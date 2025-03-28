import { useAuthStore } from "@/stores/useAuthStore"
import DashboardStats from "./components/DashboardStats"
import AdminHeader from "./components/AdminHeader"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs"
import { Album, Music } from "lucide-react"
import SongTabContent from "./components/SongTabContent"
import AlbumsTabContent from "./components/AlbumsTabContent"
import { useEffect } from "react"
import { useMusicStore } from "@/stores/useMusicStore"
import { useUser } from "@clerk/clerk-react"

const AdminPage = () => {

    const {isAdmin,isLoading}=useAuthStore()
	const {fetchAlbums,fetchSongs,fetchStats}=useMusicStore()
	const { user } = useUser();
	const userEmail=user?.emailAddresses[0].emailAddress

	useEffect(()=>{
		fetchAlbums();
		fetchSongs();
		if (user?.emailAddresses[0]?.emailAddress) {
            //fetchStats(user.emailAddresses[0].emailAddress);
			if (userEmail) {  // Only call if not empty string
				fetchStats(userEmail);
			}
        }
	},[fetchAlbums,fetchSongs,fetchStats])

    if(!isAdmin && isLoading){
        return <div>Unauthorized</div>
    }

	
  return (
    <div className='min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-900
    to-black text-zinc-100 p-8'>
        <AdminHeader/>

        <DashboardStats/>

        <Tabs defaultValue='songs' className='space-y-6'>
				<TabsList className='p-1 bg-zinc-800/50 flex gap-2 w-[13.5vw] rounded-2xl'>
					<TabsTrigger value='songs' className='data-[state=active]:bg-zinc-700 flex p-2 rounded-2xl items-center'>
						<Music className='mr-2 size-4' />
						<span>Songs</span>
					</TabsTrigger>
					<TabsTrigger value='albums' className='data-[state=active]:bg-zinc-700 flex p-2 rounded-2xl items-center'>
						<Album className='mr-2 size-4' />
						<span>Albums</span>
					</TabsTrigger>
				</TabsList>

				<TabsContent value='songs'>
					<SongTabContent />
				</TabsContent>
				<TabsContent value='albums'>
					<AlbumsTabContent />
				</TabsContent>
			</Tabs>
    </div>
  )
}

export default AdminPage