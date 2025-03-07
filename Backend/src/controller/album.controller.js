import  Album  from '../models/album.model.js';  // Corrected import for ES module


export const getAllAlbums=async(req,res,next)=>{
    try {
        const albums=await Album.find();
        res.status(200).json(albums);        
    } catch (error) {
        console.log("error in getting all albums",error);
        next(error);
    }
}

export const getAlbumById=async(req,res,next)=>{
    try {
        const {albumId}=req.params;

        const album=await Album.findById(albumId).populate("songs");

        if(!album){
            return res.status(404).json({message:"Album not found"})
        }

        res.status(200).json(album);
    } catch (error) {
        console.log("error in getting album by Id",error);
        next(error);
    }
}

