import Message from "../models/message.model.js";
import User from "../models/user.model.js"


export const getAllUsers=async(req,res,next)=>{
    try {
        const { userId } = req.params; // Extract userId correctly

    // Fetch all users except the one with the provided userId
    const users = await User.find({ clerkId: { $ne: userId } });
    
    res.status(200).json({ users });
    } catch (error) {
        next(error);
    }
}

export const getMessages=async(req,res,next)=>{
    try {
        const myId=req.user;
        const {userId}=req.params;
        
        console.log("myId=>",myId)
        console.log("userId=>",userId)
        const messages=await Message.find({
            $or:[
                {senderId:userId,receiverId:myId},
                {senderId:myId,receiverId:userId}
            ]
        }).sort({createdAt:1})
        console.log("userID during fetching message",userId)
        console.log("messages",messages);
        res.status(200).json(messages);

    } catch (error) {
        next(error)
    }
}