import { clerkClient } from "@clerk/express"; 
import jwt from "jsonwebtoken"

export const protectRoute = async (req, res, next) => {
    const authHeader=req.header("Authorization")

    if(!authHeader){
        return res.status(401).json({ message: "Unauthorized" });
    }
    const token = authHeader.split(' ')[1];
    if(!token){
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const decoded=jwt.verify(token,process.env.CLERK_SECRET_KEY)
        req.user=decoded._id
        next()
    } catch (error) {
        console.log(error);
        res.status(400).json({message:"Unauthorized"})
    }
};


export const requireAdmin=async(req,res,next)=>{
    try {
        // Extract user email from query params or route params
        const userEmail = req.params.userEmail || req.query.userEmail;

        if (!userEmail) {
            return res.status(400).json({ message: "Bad Request - Missing user email" });
        }
        // Check if the provided email matches the admin email
        const isAdmin = process.env.ADMIN_EMAIL === userEmail
     
        if (!isAdmin) {
            return res.status(403).json({ message: "Unauthorized - You must be an admin" });
        }
        
        next();

    } catch (error) {
        next(error);
    }
}

