import { Server } from "socket.io";
import Message  from "../models/message.model.js"

export const initializeSocket=(server)=>{
    const io=new Server(server,{
        cors: {
        origin: "http://localhost:5000",  // Change to match the correct frontend port
        credentials: true
    }
    });

    const userSockets=new Map();
    const userActivities=new Map();

    io.on("connection",(socket)=>{
        socket.on("user_connected",(userId)=>{
            /*userSockets.set(userId,socket.id);
            userActivities.set(userId,"Idle");
            
            // broadcast to all connected sockets that this user just logged in
            io.emit("user_connected", userId);

            // Send updated online users list to everyone
            io.emit("users_online", Array.from(userSockets.keys()));
        
            io.emit("activities", Array.from(userActivities.entries()));*/
            console.log(`User connected: ${userId}, Socket ID: ${socket.id}`); // Debugging
            userSockets.set(userId, socket.id);
            userActivities.set(userId, "Idle");

            io.emit("users_online", Array.from(userSockets.keys())); // Broadcast online users
            io.emit("activities", Array.from(userActivities.entries()));
        });

        socket.on("updated_activity",({userId,activity})=>{
            console.log("activity updated",userId,activity);
            userActivities.set(userId,activity);
            io.emit("activity_updated",{userId,activity})
        })

        socket.on("send_message",async(data)=>{
            try {
                const { senderId,receiverId,content}=data;
                console.log(senderId,receiverId,content)
                const message=await Message.create({
                    senderId,
                    receiverId,
                    content
                })

                const reciverSocketId=userSockets.get(receiverId)
                if(reciverSocketId){
                    io.to(reciverSocketId).emit("receive_message", message);
                }

                socket.emit("message_sent",message)
            } catch (error) {
                console.error("Message error:",error)
                socket.emit("message_error",error.message)
            }
        })

        socket.on("disconnect",()=>{
            let disconnectedUserId;
            for(const [userId,socketId] of userSockets.entries()){
                // find disconnected user
				if (socketId === socket.id) {
					disconnectedUserId = userId;
					userSockets.delete(userId);
					userActivities.delete(userId);
					break;
				}
            }
            if (disconnectedUserId) {
				io.emit("user_disconnected", disconnectedUserId);
			}
        })
    })
}