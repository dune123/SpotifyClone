import { axiosInstane } from '@/lib/axios'
import {create} from 'zustand'
import { Album, Song, Stats } from "@/types";
import toast from 'react-hot-toast';


interface MusicStore{
    songs: Song[];
	albums: Album[];
	isLoading: boolean;
	error: string | null;
    currentAlbum: Album | null;
    madeForYouSongs:Song[];
    featuredSongs:Song[];
    trendingSongs:Song[];
    stats:Stats


	fetchAlbums: () => Promise<void>;
    fetchAlbumById: (id: string) => Promise<void>;
    fetchFeaturedSongs:()=>Promise<void>;
    fetchMadeForYouSongs:()=>Promise<void>;
    fetchTrendingSongs:()=>Promise<void>;
    fetchStats: (userEmail:string) => Promise<void>;
    fetchSongs:()=>Promise<void>;
    deleteSong:(id:string)=>Promise<void>;
    deleteAlbum:(id:string,userEmail?:string)=>Promise<void>
}

export const useMusicStore = create<MusicStore>()((set) => ({
    // State properties
    albums: [],
    songs: [],
    isLoading: false,
    error: null,
    currentAlbum: null,
    madeForYouSongs: [],
    featuredSongs: [],
    trendingSongs: [],
    stats: {
        totalSongs: 0,
        totalAlbums: 0,
        totalUsers: 0,
        totalArtists: 0
    },
    isSongsLoading: false,
    isStatsLoading: false,

    // Action implementations (all methods from interface)
    fetchAlbums: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstane.get<Album[]>("/api/albums");
            set({ albums: response.data, isLoading: false });
        } catch (error: any) {
            set({ error: error.response?.data?.message || error.message, isLoading: false });
        }
    },

    fetchAlbumById: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstane.get<Album>(`/api/albums/${id}`);
            set({ currentAlbum: response.data, isLoading: false });
        } catch (error: any) {
            set({ error: error.response?.data?.message || error.message, isLoading: false });
        }
    },

    fetchFeaturedSongs: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstane.get<Song[]>("/api/songs/featured");
            set({ featuredSongs: response.data, isLoading: false });
        } catch (error: any) {
            set({ error: error.response?.data?.message || error.message, isLoading: false });
        }
    },

    fetchMadeForYouSongs: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstane.get<Song[]>("/api/songs/made-for-you");
            set({ madeForYouSongs: response.data, isLoading: false });
        } catch (error: any) {
            set({ error: error.response?.data?.message || error.message, isLoading: false });
        }
    },

    fetchTrendingSongs: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstane.get<Song[]>("/api/songs/trending");
            set({ trendingSongs: response.data, isLoading: false });
        } catch (error: any) {
            set({ error: error.response?.data?.message || error.message, isLoading: false });
        }
    },

    fetchStats: async (userEmail: string) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstane.get<Stats>(`/api/stats/${userEmail}`);
            set({ stats: response.data, isLoading: false});
        } catch (error: any) {
            set({ 
                error: error.response?.data?.message || error.message,
                isLoading: false,
            });
        }
    },

    fetchSongs: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstane.get<Song[]>("/api/songs");
            set({ songs: response.data, isLoading: false });
        } catch (error: any) {
            set({ error: error.response?.data?.message || error.message, isLoading: false });
        }
    },

    deleteSong: async (id: string) => {
        set({ isLoading: true });
        try {
            await axiosInstane.delete(`/api/admin/songs/${id}`);
            set((state) => ({
                songs: state.songs.filter((song) => song._id !== id),
                isLoading: false
            }));
            toast.success("Song deleted successfully");
        } catch (error: any) {
            console.log("Error deleting song:", error);
            toast.error("Error deleting song");
            set({ error: error.message, isLoading: false });
        }
    },

    deleteAlbum: async (id: string, userEmail?: string) => {
        set({ isLoading: true });
        try {
            await axiosInstane.delete(`/api/admin/albums/${userEmail}/${id}`);
            set((state:any)=>({
                albums:state.albums.filter((album:any)=>album._id!==id),
                songs:state.songs.map((song:any)=>{
                    song.album===state.albums.find((a:any)=>a._id===id)?.title?{...song,album:null}:song
                })
            }))
            toast.success("Album deleted successfully");
        } catch(error:any){
            console.log("Error in deleting Album",error)
            toast.error("Error in deleting Album")
            set({error:error.message})
        }
        finally{
            set({isLoading:false})
        }
    }
}));