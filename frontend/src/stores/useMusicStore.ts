import { axiosInstane } from '@/lib/axios'
import {create} from 'zustand'
import { Album, Song, Stats } from "@/types";
import { findPackageJSON } from 'module';
import { error } from 'console';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';


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
    fetchAlbumsById: (id:string)=> Promise<void>;
    fetchFeaturedSongs:()=>Promise<void>;
    fetchMadeForYouSongs:()=>Promise<void>;
    fetchTrendingSongs:()=>Promise<void>;
    fetchStats:()=>Promise<void>;
    fetchSongs:()=>Promise<void>;
    deleteSong:(id:string)=>Promise<void>;
    deleteAlbum:(id:string)=>Promise<void>
}

export const useMusicStore=create((set)=>({
    albums:[],
    songs:[],
    isLoading:false,
    error:null,
    madeForYouSongs:[],
    featuredSongs:[],
    trendingSongs:[],
    stats:{
        totalSongs:0,
        totalAlbums:0,
        totalUsers:0,
        totalArtists:0
    },
    isSongsLoading:false, 
    isStatsLoading:false,

    deleteSong:async(id:any)=>{
        set({})
        try{
            await axiosInstane.delete(`/api/admin/songs/${id}`)
            set((state:any)=>({
                songs:state.songs.filter((song:any)=>song._id!==id)
            }))

            toast.success("Song deleted successfully")
        }
        catch(error:any){
            console.log("Error in deleting Song",error)
            toast.error("Error in deleting Song")
            set({error:error.message})
        }
        finally{
            set({isLoading:false})
        }
    },
    deleteAlbum:async(id:any,userEmail:any)=>{
        set({})
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
    ,
    fetchSongs:async()=>{
        try {
            const response=await axiosInstane.get("/api/songs");
            set({songs:response.data});

        } catch (error:any) {
            set({error:error.message})
        }
        finally{
            set({isLoading:false})
        }
    },
    fetchStats: async (userEmail: string) => {
        set({ isLoading: true, error: null });
    
        try {
            const response = await axiosInstane.get(`/api/stats/${userEmail}`);
            set({ stats: response.data });
        } catch (error: any) {
            console.error("Error fetching stats:", error);
            set({ error: error.message });
        } finally {
            set({ isLoading: false });
        }
    },
    fetchAlbums: async()=>{
        // data fetch Logic ...
        set({
            isLoading:true,
            error:null
        })

        try {
            const response=await axiosInstane.get("/api/albums");

            set({albums:response.data})

        } catch (error:any) {
            set({error:error.response.data.message});
        }
        finally{
            set({isLoading:false})
        }
    },

    fetchAlbumById:async(id:string)=>{
        set({isLoading:true,error:null});

        try {
            const response=await axiosInstane.get(`/api/albums/${id}`)
            set({currentAlbum:response.data});


        } catch (error:any) {
            set({error:error.response.data.message});
        }
        finally{
            set({isLoading:false})
        }
    },

    fetchFeaturedSongs:async()=>{
        set({isLoading:true,error:null})
        try {
            const response=await axiosInstane.get("/api/songs/featured")

            set({featuredSongs:response.data})
        } catch (error:any) {
            set({error:error.response.data.message})
        }
        finally{
            set({isLoading:false})
        }
    },
    fetchMadeForYouSongs:async()=>{
        set({isLoading:true,error:null})
        try {
            const reponse=await axiosInstane.get("/api/songs/made-for-you");

            set({madeForYouSongs:reponse.data})
        } catch (error:any) {
            set({error:error.response.data.message})
        }
        finally{
            set({isLoading:false})
        }
    },
    fetchTrendingSongs:async()=>{
        set({isLoading:true,error:null})
        try {
            const response=await axiosInstane.get("/api/songs/trending");

            set({trendingSongs:response.data})
        } catch (error:any) {
            set({error:error.response.data.message})
        }
        finally{
            set({isLoading:false})
        }
    }
}))

