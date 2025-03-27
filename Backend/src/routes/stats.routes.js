import express from "express";
import { getStats } from "../controller/stat.controller.js";
import { protectRoute, requireAdmin } from "../middleware/auth.middleware.js";

const router=express.Router();

router.get('/:userEmail',protectRoute,requireAdmin,getStats)

export default router