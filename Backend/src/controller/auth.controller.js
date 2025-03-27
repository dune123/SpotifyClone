import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

const authCallback=async(req,res,next)=>{
    try {
        const {id,firstName,lastName,imageUrl}=req.body;

      

        const user = await User.findOneAndUpdate(
            { clerkId: id },  // Search by clerkId
            {
                fullname: `${firstName || ""} ${lastName || ""}`.trim(),
                imageUrl
            },
            { upsert: true, new: true } // If not found, create a new one
        );

       // Ensure user exists before signing token
       if (!user) {
        return res.status(500).json({ success: false, message: "User creation failed" });
    }

    // Generate auth token using user._id
    const authToken = jwt.sign(
        { _id: user.clerkId },
        process.env.CLERK_SECRET_KEY,
        { expiresIn: "7d" }
    );

    res.status(200).json({ success: true, user, token: authToken });
    } catch (error) {
        console.log("Error in auth callback",error);
        next(error);
    }
}

export default authCallback