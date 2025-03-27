import { Card, CardContent } from "@/components/ui/card"
import { axiosInstane } from "@/lib/axios";
import { useUser } from "@clerk/clerk-react"
import { Loader } from "lucide-react"
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router";

const AuthCallback = () => {
  const {isLoaded,user}=useUser();
  const navigate=useNavigate()
  const syncAttempted=useRef(false);

  useEffect(()=>{
    const syncUser=async()=>{
      if(!isLoaded||!user||syncAttempted.current) return;
      try {
        syncAttempted.current=true
        const response=await axiosInstane.post("/api/auth/callback",{
          id:user.id,
          firstName:user.firstName,
          lastName:user.lastName,
          imageUrl:user.imageUrl
        })
        window.localStorage.setItem("token",response.data.token);
      } catch (error) {
        console.log("Error in auth callback",error)
      }
      finally{
        navigate("/")
      }
    }

    syncUser();
  },[isLoaded,user,navigate])

  return (
    <div className="h-screen w-full bg-black flex items-center justify-center">
      <Card className="w-[90%] max-w-wd bg-zinc-900 border-zinc-800">
        <CardContent className="flex flex-col items-center gap-4 pt-6">
          <Loader className="size-6 text-emerald-500 animate-spin"/>
          <h3 className="text-zinc-400 text-xl font-bold">Logging you in</h3>
          <p className="text-zinc-400 text-sm">Redirecting...</p>
        </CardContent>
      </Card>
      </div>
  )
}

export default AuthCallback