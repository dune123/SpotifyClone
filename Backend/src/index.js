import express from 'express';
import { clerkMiddleware } from '@clerk/express';
import path from 'path';
import dotenv from 'dotenv';
import fileUpload from 'express-fileupload';
import cors from "cors"

// Router imports
import userRoutes from './routes/user.routes.js';
import authRoutes from './routes/auth.routes.js';
import adminRoutes from './routes/admin.routes.js';
import songRoutes from './routes/song.routes.js';
import albumRoutes from './routes/album.routes.js';
import statsRoutes from './routes/stats.routes.js';

import connectDB  from './lib/db.js';
import { createServer } from 'http';
import { initializeSocket } from './lib/socket.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const httpServer=createServer(app);
initializeSocket(httpServer);

// Middleware to parse JSON requests
app.use(express.json());
app.use(clerkMiddleware()); // This will add auth to req object => req.user 
app.use(cors(
    {
        origin:"http://localhost:5000",
        credentials:true
    }
))

const __dirname = path.resolve();
app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: path.join(__dirname, 'tmp'),
        createParentPath: true,
        limits: {
            filesSize: 10 * 1024 * 1024, // 10 MB max file size
        },
    })
);

// Routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/songs', songRoutes);
app.use('/api/albums', albumRoutes);
app.use('/api/stats', statsRoutes);

//error handlers
app.use((err,req,res,next)=>{
    res.status(500).json({message: process.env.NODE_ENV==="production"?"Internal Server Error":err.message});
})

// Start the server
httpServer.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
    console.log('Connecting to database...');
    connectDB()
        .then(() => {
            console.log('Database connection established');
        })
        .catch((err) => {
            console.error('Error connecting to database:', err);
        });
});


//todo: socket.io