import express from 'express';
import { createUser, loginUser, logoutCurrentUser, getCurrentUserProfile } from '../controllers/userController.js';
import {protect} from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', createUser);
router.post('/login', loginUser);
router.post('/logout', logoutCurrentUser);
router.get('/profile', protect, getCurrentUserProfile);

export default router;
