import Comment from '../models/Comment.js';
import Post from '../models/Post.js';
import User from '../models/User.js';

// @desc    Create a new comment
// @route   POST /api/comments
// @access  Private
export const createComment = async (req, res) => {
  try {
    const { content, postId, parentCommentId } = req.body;
    
    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    // If parentCommentId is provided, check if it exists
    if (parentCommentId) {
      const parentComment = await Comment.findById(parentCommentId);
      if (!parentComment) {
        return res.status(404).json({ message: 'Parent comment not found' });
      }
    }
    
    // Create comment
    const comment = await Comment.create({
      content,
      author: req.user._id,
      post: postId,
      parentComment: parentCommentId || null
    });
    
    // Increment post comment count
    post.commentCount += 1;
    await post.save();
    
    // Populate author
    const populatedComment = await Comment.findById(comment._id)
      .populate('author', 'username avatar');
    
    res.status(201).json(populatedComment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get comments for a post
// @route   GET /api/comments/post/:postId
// @access  Public
export const getCommentsByPost = async (req, res) => {
  try {
    // Get top-level comments (no parent)
    const comments = await Comment.find({ 
      post: req.params.postId,
      parentComment: null
    })
      .sort({ votes: -1, createdAt: -1 })
      .populate('author', 'username avatar');
    
    // Recursively populate replies for each comment
    const populateReplies = async (comment) => {
      const replies = await Comment.find({ parentComment: comment._id })
        .sort({ votes: -1, createdAt: -1 })
        .populate('author', 'username avatar');
      
      const populatedReplies = [];
      
      for (const reply of replies) {
        const replyObj = reply.toObject();
        replyObj.replies = await populateReplies(reply);
        populatedReplies.push(replyObj);
      }
      
      return populatedReplies;
    };
    
    const populatedComments = [];
    
    for (const comment of comments) {
      const commentObj = comment.toObject();
      commentObj.replies = await populateReplies(comment);
      populatedComments.push(commentObj);
    }
    
    res.json(populatedComments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update comment
// @route   PUT /api/comments/:id
// @access  Private
export const updateComment = async (req, res) => {
  try {
    const { content } = req.body;
    
    const comment = await Comment.findById(req.params.id);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    // Check if user is the author
    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this comment' });
    }
    
    // Update content
    comment.content = content;
    
    const updatedComment = await comment.save();
    
    res.json(updatedComment);
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Comment not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete comment
// @route   DELETE /api/comments/:id
// @access  Private
export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    // Check if user is the author
    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }
    
    // Get post for updating comment count
    const post = await Post.findById(comment.post);
    
    // Count all replies to this comment (recursive)
    const countReplies = async (commentId) => {
      const replies = await Comment.find({ parentComment: commentId });
      let count = replies.length;
      
      for (const reply of replies) {
        count += await countReplies(reply._id);
      }
      
      return count;
    };
    
    const replyCount = await countReplies(comment._id);
    
    // Delete all replies
    const deleteReplies = async (commentId) => {
      const replies = await Comment.find({ parentComment: commentId });
      
      for (const reply of replies) {
        await deleteReplies(reply._id);
        await reply.deleteOne();
      }
    };
    
    await deleteReplies(comment._id);
    
    // Delete the comment
    await comment.deleteOne();
    
    // Update post comment count
    if (post) {
      post.commentCount -= (1 + replyCount);
      await post.save();
    }
    
    res.json({ message: 'Comment removed' });
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Comment not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Vote on a comment
// @route   POST /api/comments/:id/vote
// @access  Private
export const voteComment = async (req, res) => {
  try {
    const { vote } = req.body;
    
    // Validate vote value
    if (vote !== 1 && vote !== -1) {
      return res.status(400).json({ message: 'Vote must be 1 or -1' });
    }
    
    const comment = await Comment.findById(req.params.id);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    // Check if user has already voted
    const existingVoteIndex = comment.votesUsers.findIndex(
      v => v.user.toString() === req.user._id.toString()
    );
    
    if (existingVoteIndex !== -1) {
      // User has already voted
      const existingVote = comment.votesUsers[existingVoteIndex];
      
      if (existingVote.vote === vote) {
        // Remove vote if same value
        comment.votes -= existingVote.vote;
        comment.votesUsers.splice(existingVoteIndex, 1);
      } else {
        // Change vote
        comment.votes = comment.votes - existingVote.vote + vote;
        existingVote.vote = vote;
      }
    } else {
      // Add new vote
      comment.votes += vote;
      comment.votesUsers.push({
        user: req.user._id,
        vote
      });
    }
    
    await comment.save();
    
    // Update user karma
    const author = await User.findById(comment.author);
    if (author) {
      const commentKarma = await Comment.aggregate([
        { $match: { author: author._id } },
        { $group: { _id: null, totalVotes: { $sum: '$votes' } } }
      ]).then(result => result[0]?.totalVotes || 0);
      
      const postKarma = await Post.aggregate([
        { $match: { author: author._id } },
        { $group: { _id: null, totalVotes: { $sum: '$votes' } } }
      ]).then(result => result[0]?.totalVotes || 0);
      
      author.karma = commentKarma + postKarma;
      await author.save();
    }
    
    res.json({ votes: comment.votes });
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Comment not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};
