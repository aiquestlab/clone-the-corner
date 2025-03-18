import express from 'express';
import { 
  createSubreddit,
  getSubreddits,
  getSubredditByName,
  updateSubreddit,
  toggleMembership,
  getTrendingSubreddits
} from '../controllers/subredditController.js';
import { protect, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Public routes with optional auth
router.get('/', optionalAuth, getSubreddits);
router.get('/trending', getTrendingSubreddits);
router.get('/:name', optionalAuth, getSubredditByName);

// Protected routes
router.post('/', protect, createSubreddit);
router.put('/:id', protect, updateSubreddit);
router.post('/:id/membership', protect, toggleMembership);

export default router;
