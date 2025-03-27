import PlaylistSkeleton from "@/components/skeletons/PlayListSkeleton"
import { buttonVariants } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { useMusicStore } from "@/stores/useMusicStore"
import { SignedIn } from "@clerk/clerk-react"
import { HomeIcon, Library, MessageCircle } from "lucide-react"
import { useEffect } from "react"
import { Link } from "react-router"

const LeftSideBar = () => {

    // data fetching => zustand
    const {albums,fetchAlbums,isLoading}=useMusicStore()

    useEffect(()=>{
        fetchAlbums()
    },[fetchAlbums])

   
  return (
    <div className="h-full flex flex-col gap-2">
        {/**NAVIGATION MENU */}
        <div className="rounded-lg bg-zinc-900 p-4">
            <div className="space-y-2">
                <Link to={"/"} className={cn(buttonVariants({
                    variant:"ghost",
                    className:"w-full justify-start text-white hover:bg-zinc-800"
                }))}>
                    <HomeIcon className="mr-2 size-5"/>
                    <span className="hidden md:inline">Home</span>
                </Link>
                <SignedIn>
                <Link to={"/chat"} className={cn(buttonVariants({
                    variant:"ghost",
                    className:"w-full justify-start text-white hover:bg-zinc-800"
                }))}>
                    <MessageCircle className="mr-2 size-5"/>
                    <span className="hidden md:inline">Messages</span>
                </Link>
                </SignedIn>
            </div>
        </div>

        {/* Liberary Section*/}
        <div className="flex-1 rounded-lg bg-zinc-900 p-4">
            <div className="flex items-center justify-start mb-4">
                <div className="flex items-center text-white px-2">
                    <Library className="size-5 mr-2"/>
                    <span className="hidden md:inline">Playlists</span>
                </div>
            </div>
            <ScrollArea className="h-[calc(100vh-300px)]">
                <div className="space-y-2">
                    {isLoading?(
                        <PlaylistSkeleton/>
                    ):(
                        albums&&albums.map((album:any)=>(
                            <Link to={`/albums/${album._id}`}
                            key={album._id}
                            className="p-2 hover:bg-zinc-800 rounded flex items-center gap-3 cursor-pointer"
                            >
                                <img src={album.imageUrl}
                                className="size-12 rounded-md flex-shrink-0 object-cover"
                                />
                                <div className="flex-1 min-w-0 hidden md:block">
                                    <p>
                                        {album.title}
                                    </p>
                                    <p className="text-sm text-zinc-400 truncate">
                                        Album : {album.artist}
                                    </p>    
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </ScrollArea>
        </div>

    </div>
  )
}
 
export default LeftSideBar