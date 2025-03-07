import express from "express";
import { getAllSongs,getFeaturedSong,getTrendingSongs,getMadeForYouSongs } from "../controller/song.controller.js";
import { protectRoute,requireAdmin } from "../middleware/auth.middleware.js";

const router=express.Router();
router.use(protectRoute,requireAdmin);

router.get('/',getAllSongs);
router.get('/featured',getFeaturedSong);
router.get('/mage-for-you',getMadeForYouSongs);
router.get('/trending',getTrendingSongs);


export default router