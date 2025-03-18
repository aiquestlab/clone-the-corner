import express from 'express';
import { 
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  votePost
} from '../controllers/postController.js';
import { protect, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Public routes with optional auth
router.get('/', optionalAuth, getPosts);
router.get('/:id', optionalAuth, getPostById);

// Protected routes
router.post('/', protect, createPost);
router.put('/:id', protect, updatePost);
router.delete('/:id', protect, deletePost);
router.post('/:id/vote', protect, votePost);

export default router;
