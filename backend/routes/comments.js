import express from 'express';
import { 
  createComment,
  getCommentsByPost,
  updateComment,
  deleteComment,
  voteComment
} from '../controllers/commentController.js';
import { protect, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Public routes with optional auth
router.get('/post/:postId', optionalAuth, getCommentsByPost);

// Protected routes
router.post('/', protect, createComment);
router.put('/:id', protect, updateComment);
router.delete('/:id', protect, deleteComment);
router.post('/:id/vote', protect, voteComment);

export default router;
