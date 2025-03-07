import User from "../models/user.model.js";

const authCallback=async(req,res,next)=>{
    try {
        const {id,firstName,lastName,imageUrl}=req.body;

        const user = await User.findOneAndUpdate(
            { clerkId: id },  // Search by clerkId
            {
                fullname: `${firstName || ""} ${lastName || ""}`,
                imageUrl
            },
            { upsert: true, new: true } // If not found, create a new one
        );

        res.status(200).json({ success: true, user });
    } catch (error) {
        console.log("Error in auth callback",error);
        next(error);
    }
}

export default authCallback