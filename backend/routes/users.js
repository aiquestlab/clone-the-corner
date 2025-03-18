import express from 'express';
import { 
  registerUser, 
  loginUser, 
  getUserProfile,
  getUserByUsername
} from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/:username', getUserByUsername);

// Protected routes
router.get('/profile', protect, getUserProfile);

export default router;
