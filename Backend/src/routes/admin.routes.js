import express from 'express';
import { protectRoute, requireAdmin } from '../middleware/auth.middleware.js';
import {createSong,deleteSong,createAlbum,deleteAlbum,checkAdmin}  from '../controller/admin.controller.js';

const router = express.Router();

//this will implement in the following routes && slighlty optimize clean code
router.get('/check/:userEmail', checkAdmin);


router.post('/songs/:userEmail',protectRoute,requireAdmin, createSong);
router.delete('/songs/:id',protectRoute,requireAdmin,deleteSong)
router.post('/albums/:userEmail',protectRoute,requireAdmin,createAlbum);
router.delete('/albums/:userEmail/:id', protectRoute, requireAdmin, deleteAlbum);

export default router;
