import express from "express";
import authCallback from "../controller/auth.controller.js"

const router=express.Router();

router.post('/callback',authCallback);

export default router