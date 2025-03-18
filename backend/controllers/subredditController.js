import Subreddit from '../models/Subreddit.js';
import Post from '../models/Post.js';

// @desc    Create a new subreddit
// @route   POST /api/subreddits
// @access  Private
export const createSubreddit = async (req, res) => {
  try {
    const { name, description } = req.body;
    
    // Check if subreddit already exists
    const subredditExists = await Subreddit.findOne({ name: name.toLowerCase() });
    
    if (subredditExists) {
      return res.status(400).json({ message: 'Subreddit already exists' });
    }
    
    // Create subreddit
    const subreddit = await Subreddit.create({
      name: name.toLowerCase(),
      description,
      creator: req.user._id,
      moderators: [req.user._id],
      members: [req.user._id],
      memberCount: 1
    });
    
    res.status(201).json(subreddit);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all subreddits
// @route   GET /api/subreddits
// @access  Public
export const getSubreddits = async (req, res) => {
  try {
    const { sort = 'members', limit = 10, page = 1, search } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Build query
    const query = {};
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    
    // Sort options
    let sortOption = {};
    switch (sort) {
      case 'new':
        sortOption = { createdAt: -1 };
        break;
      case 'members':
      default:
        sortOption = { memberCount: -1 };
        break;
    }
    
    // Get subreddits
    const subreddits = await Subreddit.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('creator', 'username');
    
    // Get total count
    const total = await Subreddit.countDocuments(query);
    
    res.json({
      subreddits,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get subreddit by name
// @route   GET /api/subreddits/:name
// @access  Public
export const getSubredditByName = async (req, res) => {
  try {
    const subreddit = await Subreddit.findOne({ name: req.params.name.toLowerCase() })
      .populate('creator', 'username')
      .populate('moderators', 'username avatar');
    
    if (subreddit) {
      res.json(subreddit);
    } else {
      res.status(404).json({ message: 'Subreddit not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update subreddit
// @route   PUT /api/subreddits/:id
// @access  Private
export const updateSubreddit = async (req, res) => {
  try {
    const { description, icon, banner, rules } = req.body;
    
    const subreddit = await Subreddit.findById(req.params.id);
    
    if (!subreddit) {
      return res.status(404).json({ message: 'Subreddit not found' });
    }
    
    // Check if user is a moderator
    if (!subreddit.moderators.includes(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized to update this subreddit' });
    }
    
    // Update fields
    if (description) subreddit.description = description;
    if (icon) subreddit.icon = icon;
    if (banner) subreddit.banner = banner;
    if (rules) subreddit.rules = rules;
    
    const updatedSubreddit = await subreddit.save();
    
    res.json(updatedSubreddit);
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Subreddit not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Join/leave subreddit
// @route   POST /api/subreddits/:id/membership
// @access  Private
export const toggleMembership = async (req, res) => {
  try {
    const { action } = req.body;
    
    if (action !== 'join' && action !== 'leave') {
      return res.status(400).json({ message: 'Action must be join or leave' });
    }
    
    const subreddit = await Subreddit.findById(req.params.id);
    
    if (!subreddit) {
      return res.status(404).json({ message: 'Subreddit not found' });
    }
    
    const userId = req.user._id;
    const isMember = subreddit.members.includes(userId);
    
    if (action === 'join' && !isMember) {
      // Join subreddit
      subreddit.members.push(userId);
      subreddit.memberCount += 1;
    } else if (action === 'leave' && isMember) {
      // Leave subreddit
      subreddit.members = subreddit.members.filter(
        member => member.toString() !== userId.toString()
      );
      subreddit.memberCount -= 1;
    }
    
    await subreddit.save();
    
    res.json({ 
      memberCount: subreddit.memberCount,
      isMember: action === 'join'
    });
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Subreddit not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get trending subreddits
// @route   GET /api/subreddits/trending
// @access  Public
export const getTrendingSubreddits = async (req, res) => {
  try {
    // Get subreddits with most posts in the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    // Find posts created in the last 7 days
    const recentPosts = await Post.find({
      createdAt: { $gte: sevenDaysAgo }
    }).populate('subreddit');
    
    // Count posts by subreddit
    const subredditCounts = {};
    recentPosts.forEach(post => {
      const subredditId = post.subreddit._id.toString();
      subredditCounts[subredditId] = (subredditCounts[subredditId] || 0) + 1;
    });
    
    // Convert to array and sort
    const trending = Object.entries(subredditCounts)
      .map(([id, count]) => ({ id, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    
    // Get subreddit details
    const trendingSubreddits = await Promise.all(
      trending.map(async ({ id }) => {
        return await Subreddit.findById(id).select('name icon memberCount description');
      })
    );
    
    res.json(trendingSubreddits);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
