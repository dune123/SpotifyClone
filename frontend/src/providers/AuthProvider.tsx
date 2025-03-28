import { axiosInstane } from "@/lib/axios";
import { useAuth, useUser } from "@clerk/clerk-react";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { useChatStore } from "@/stores/useChatStore";// Update with correct path
import { useAuthStore } from "@/stores/useAuthStore";

const updateApiToken = (token: string | null) => {
    if (token) {
        axiosInstane.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
        delete axiosInstane.defaults.headers.common["Authorization"];
    }
};

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const {userId } = useAuth();
    const [loading, setLoading] = useState(true);
    const {checkAdminStatus}=useAuthStore();
    const { initSocket, disconnectSocket } = useChatStore();
    const token=localStorage.getItem("token");
    const userClerk=useUser();
    const userEmail=userClerk.user?.primaryEmailAddress;


    // Access the store to update auth state
    const { setAuth } = useChatStore();

    useEffect(() => {
        const initAuth = async () => {
            try {
                updateApiToken(token);
                // Set the token and userId in Zustand store
                setAuth({ 
                    userId:userId??null,  // string | null
                    token    // string | null
                  });

                if(token&&userEmail){
                    await checkAdminStatus(userEmail.toString());

                    // init socket
					if (userId) initSocket(userId);
                }
            } catch (error: any) {
                updateApiToken(null);
                console.log("Error in auth provider", error);
            } finally {
                setLoading(false);
            }
        };

        initAuth();
        
        // clean up
        return ()=>disconnectSocket();

    }, [token, userId, setAuth,checkAdminStatus,initSocket,disconnectSocket]);

    if (loading)
        return (
            <div className="h-screen w-full flex items-center justify-center">
                <Loader className="size-8 text-emerald-500 animate-spin" />
            </div>
        );

    return <>{children}</>;
};

export default AuthProvider;
