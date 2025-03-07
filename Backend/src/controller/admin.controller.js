import  Song  from '../models/song.model.js';  // Corrected import for ES module
import  Album  from '../models/album.model.js';  // Corrected import for ES module
import cloudinary from "../lib/cloudinary.js";

// Helper function for cloudinary uploads
export const uploadToCloudinary = async (file) => {
    try {
        const result = await cloudinary.v2.uploader.upload(file.tempFilePath, {
            resource_type: "auto",  // Automatically detect the resource type (image/audio)
        });
        return result.secure_url;  // Return the secure URL after upload
    } catch (error) {
        console.log("Error in uploadToCloudinary", error);
        throw new Error("Error uploading to Cloudinary");
    }
};

// Function to create a song
export const createSong = async (req, res, next) => {
    try {
        // Ensure both audioFile and imageFile are uploaded
        if (!req.files || !req.files.audioFile || !req.files.imageFile) {
            return res.status(400).json({ message: "Please upload all files" });
        }

        const { title, artist, albumId, duration } = req.body;

        // Extract audioFile and imageFile from the request
        const audioFile = req.files.audioFile;
        const imageFile = req.files.imageFile;

        // Upload audio and image files to Cloudinary
        const audioUrl = await uploadToCloudinary(audioFile);
        const imageUrl = await uploadToCloudinary(imageFile);

        // Create a new song document
        const song = new Song({
            title,
            artist,
            audioUrl,
            imageUrl,
            duration,
            albumId: albumId || null,  // If no albumId provided, set to null
        });

        // Save the song to the database
        await song.save();

        // If an albumId is provided, update the album by adding the new song's ID
        if (albumId) {
            await Album.findByIdAndUpdate(albumId, {
                $push: { songs: song._id },
            });
        }

        // Return the created song as the response
        res.status(201).json(song);
    } catch (error) {
        console.error("Error in createSong", error);
        next(error);
    }
};

//function to delete a song
export const deleteSong=async(req,res,next)=>{
    try {
        const {id}=req.params

        const song=await Song.findById(id);

        //if song belongs to an album,update the album's songs array

        if(song.albumId){
            await Album.findByIdAndUpdate(song.albumId,{
                $pull:{songs:song._id}
            })
        }

        res.status(200).json({message:"Song deleted successfully"})
    } catch (error) {
        console.log("Error in delete Song",error);
        next(error);
    }
}

//function to create a album
export const createAlbum=async(req,res,next)=>{
    try {
        const {title,artist,releaseYear}=req.body;
        const {imageFile}=req.files

        const imageUrl=await uploadToCloudinary(imageFile);

        const album=new Album({
            title,
            artist,
            imageUrl,
            releaseYear
        })

        await album.save();
        res.status(200).json(album);
    } catch (error) {
        console.log("Error in createAlbum",error);
        next(error);
    }
}

//function to create a delete a album
export const deleteAlbum=async(req,res,next)=>{
    try {
        const {id}=req.params

        await Song.deleteMany({albumId:id});
        await Album.findByIdAndDelete(id);

        res.status(200).json({message:"Album deleted successfully"})
    } catch (error) {
        console.log("Error in deleteAlbum",error);
        next(error);
    }
}

//check admin
export const checkAdmin=async(req,res,next)=>{
    res.status(200).json({admin:true});
}