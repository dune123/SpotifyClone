import mongoose from "mongoose";

const connectDB=async()=>{
    try {
        const connect=await mongoose.connect(process.env.MONGODB_URL)

        console.log(`Connected to MongoDB ${connect.connection.host}`)
    } catch (error) {
        console.log("Failed to connect with Mongodb",error);
    }
}

export default connectDB;