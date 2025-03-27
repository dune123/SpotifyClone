import express from 'express';
import { getAllUsers, getMessages } from '../controller/user.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/:userId',protectRoute,getAllUsers);
router.get("/messages/:userId",protectRoute,getMessages);

export default router;
