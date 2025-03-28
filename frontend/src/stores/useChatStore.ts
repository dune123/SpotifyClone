import { create } from "zustand";
import axios from "axios";
import { Message, User } from "@/types";
import { io } from "socket.io-client";
import { axiosInstane } from "@/lib/axios";

interface AuthState {
	userId: string | null;
	token: string | null;
  }
  
  

// Define the structure for your store
interface ChatStore {
    users: User[];
    isLoading: boolean;
    error: string | null;
    token: string | null;
    userId: string | null;
    socket: any;
	isConnected: boolean;
	onlineUsers: Set<string>;
	userActivities: Map<string, string>;
	messages: Message[];
	selectedUser: User | null;
	auth: AuthState;  // Add this line
	setAuth: (authDetails: AuthState) => void;

	fetchUsers: (userId:string) => Promise<void>;
	initSocket: (userId: string) => void;
	disconnectSocket: () => void;
	sendMessage: (receiverId: string, senderId: string, content: string) => void;
	fetchMessages: (userId: string) => Promise<void>;
	setSelectedUser: (user: User | null) => void;
}

const baseURL = import.meta.env.MODE === "development" ? "http://localhost:3000" : "/";

const socket = io(baseURL, {  // Ensure it matches the backend port
    autoConnect: false,
    withCredentials: true,
});


export const useChatStore = create<ChatStore>((set,get) => ({
    users: [],
    isLoading: false,
    error: null,
    token: null,
    userId: null,
    socket: socket,
	isConnected: false,
	onlineUsers: new Set(),
	userActivities: new Map(),
	messages: [],
	selectedUser: null,
	auth: {
		userId: null,
		token: null
	  },
    // Action to set the auth details in the store
    setAuth: ({ userId, token }) => set({ 
		auth: { 
		  userId: userId ?? null, 
		  token: token ?? null 
		} 
	  }),

    setSelectedUser: (user) => set({ selectedUser: user }),

    fetchUsers: async (userId:string) => { // Accept userId as a parameter
        set({ isLoading: true, error: null });
    
        try {
            const token = window.localStorage.getItem("token");
            if (!token) {
                set({ error: "Unauthorized - Missing token" });
                return;
            }
            
            const response = await axios.get(`http://localhost:3000/api/users/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                } // Pass userId as query param
            });
    
            set({ users: response.data.users });
        } catch (error: any) {
            set({ error: error.response?.data?.message || "Unknown error" });
        } finally {
            set({ isLoading: false });
        }
    },

    initSocket: (userId) => {
		if (!get().isConnected) {
			socket.auth = { userId };
			socket.connect();

			socket.emit("user_connected", userId);

			socket.on("users_online", (users: string[]) => {
				console.log("Online users:", users);
				set(() => ({
					onlineUsers: new Set([...users]), // Ensures a new reference
				}));
			});

			socket.on("activities", (activities: [string, string][]) => {
				console.log("Received activities:", activities); // Debugging log
				set({ userActivities: new Map(activities) });
			});
			
			socket.on("activity_updated", ({ userId, activity }) => {
				console.log(`Activity updated for ${userId}: ${activity}`); // Debugging log
				set((state) => {
					const newActivities = new Map(state.userActivities);
					newActivities.set(userId, activity);
					return { userActivities: newActivities };
				});
			});

			socket.on("user_connected", (userId: string) => {
				set((state) => ({
					onlineUsers: new Set([...state.onlineUsers, userId]),
				}));
			});

			socket.on("user_disconnected", (userId: string) => {
				set((state) => {
					const newOnlineUsers = new Set(state.onlineUsers);
					newOnlineUsers.delete(userId);
					return { onlineUsers: newOnlineUsers };
				});
			});

			socket.on("receive_message", (message: Message) => {
				set((state) => ({
					messages: [...state.messages, message],
				}));
            });

			socket.on("message_sent", (message: Message) => {
				set((state) => ({
					messages: [...state.messages, message],
				}));
			});

			socket.on("activity_updated", ({ userId, activity }) => {
				set((state) => {
					const newActivities = new Map(state.userActivities);
					newActivities.set(userId, activity);
					return { userActivities: newActivities };
				});
			});

			set({ isConnected: true });
		}
	},
	disconnectSocket: () => {
		if (get().isConnected) {
			socket.disconnect();
			set({ isConnected: false });
		}
	},

	sendMessage: async (receiverId, senderId, content) => {
		const socket = get().socket;
		if (!socket) return;

		socket.emit("send_message", { receiverId, senderId, content });
	},

	fetchMessages: async (userId: string) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstane.get(`api/users/messages/${userId}`);
			set({ messages: response.data });
		} catch (error: any) {
			set({ error: error.response.data.message });
		} finally {
			set({ isLoading: false });
		}
	}

}));
