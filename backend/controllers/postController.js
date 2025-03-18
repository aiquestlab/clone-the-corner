import Post from '../models/Post.js';
import Comment from '../models/Comment.js';
import Subreddit from '../models/Subreddit.js';
import User from '../models/User.js';

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
export const createPost = async (req, res) => {
  try {
    const { title, content, subredditId, image } = req.body;
    
    // Check if subreddit exists
    const subreddit = await Subreddit.findById(subredditId);
    if (!subreddit) {
      return res.status(404).json({ message: 'Subreddit not found' });
    }
    
    // Create post
    const post = await Post.create({
      title,
      content,
      author: req.user._id,
      subreddit: subredditId,
      image: image || null
    });
    
    // Populate author and subreddit
    const populatedPost = await Post.findById(post._id)
      .populate('author', 'username avatar')
      .populate('subreddit', 'name');
    
    res.status(201).json(populatedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all posts
// @route   GET /api/posts
// @access  Public
export const getPosts = async (req, res) => {
  try {
    const { sort = 'hot', limit = 10, page = 1, subreddit } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Build query
    const query = {};
    if (subreddit) {
      const subredditDoc = await Subreddit.findOne({ name: subreddit.toLowerCase() });
      if (subredditDoc) {
        query.subreddit = subredditDoc._id;
      } else {
        return res.status(404).json({ message: 'Subreddit not found' });
      }
    }
    
    // Sort options
    let sortOption = {};
    switch (sort) {
      case 'new':
        sortOption = { createdAt: -1 };
        break;
      case 'top':
        sortOption = { votes: -1 };
        break;
      case 'hot':
      default:
        // Hot is a combination of votes and recency
        sortOption = { votes: -1, createdAt: -1 };
        break;
    }
    
    // Get posts
    const posts = await Post.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('author', 'username avatar')
      .populate('subreddit', 'name');
    
    // Get total count
    const total = await Post.countDocuments(query);
    
    res.json({
      posts,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get post by ID
// @route   GET /api/posts/:id
// @access  Public
export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'username avatar')
      .populate('subreddit', 'name');
    
    if (post) {
      res.json(post);
    } else {
      res.status(404).json({ message: 'Post not found' });
    }
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update post
// @route   PUT /api/posts/:id
// @access  Private
export const updatePost = async (req, res) => {
  try {
    const { title, content, image } = req.body;
    
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    // Check if user is the author
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this post' });
    }
    
    // Update fields
    post.title = title || post.title;
    post.content = content || post.content;
    post.image = image !== undefined ? image : post.image;
    
    const updatedPost = await post.save();
    
    res.json(updatedPost);
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    // Check if user is the author
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }
    
    // Delete post and its comments
    await Comment.deleteMany({ post: req.params.id });
    await post.deleteOne();
    
    res.json({ message: 'Post removed' });
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Vote on a post
// @route   POST /api/posts/:id/vote
// @access  Private
export const votePost = async (req, res) => {
  try {
    const { vote } = req.body;
    
    // Validate vote value
    if (vote !== 1 && vote !== -1) {
      return res.status(400).json({ message: 'Vote must be 1 or -1' });
    }
    
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    // Check if user has already voted
    const existingVoteIndex = post.votesUsers.findIndex(
      v => v.user.toString() === req.user._id.toString()
    );
    
    if (existingVoteIndex !== -1) {
      // User has already voted
      const existingVote = post.votesUsers[existingVoteIndex];
      
      if (existingVote.vote === vote) {
        // Remove vote if same value
        post.votes -= existingVote.vote;
        post.votesUsers.splice(existingVoteIndex, 1);
      } else {
        // Change vote
        post.votes = post.votes - existingVote.vote + vote;
        existingVote.vote = vote;
      }
    } else {
      // Add new vote
      post.votes += vote;
      post.votesUsers.push({
        user: req.user._id,
        vote
      });
    }
    
    await post.save();
    
    // Update user karma
    const author = await User.findById(post.author);
    if (author) {
      author.karma = await Post.aggregate([
        { $match: { author: author._id } },
        { $group: { _id: null, totalVotes: { $sum: '$votes' } } }
      ]).then(result => result[0]?.totalVotes || 0);
      
      await author.save();
    }
    
    res.json({ votes: post.votes });
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};
