import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import routes from './src/init/routes.js';
import { connectDB } from './src/init/db.js';
import { initializeSocketHandlers } from './src/websocket/socketHandlers.js';
import { setIO } from './src/websocket/io.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        credentials: false
    }
});

const PORT = process.env.PORT || 5000;

// Add middleware
app.use(cors({ 
    origin: "*",
    credentials: false
}));

app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
app.get('/', (req, res) => {
    res.send('Hello from server');
});

app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Server is running',
        timestamp: new Date().toISOString(),
        port: PORT,
        environment: process.env.NODE_ENV || 'development'
    });
});

// Initialize routes
routes(app);

// Initialize Socket.IO handlers and expose io globally
setIO(io);
initializeSocketHandlers(io);

// Start server immediately (don't wait for DB connection)
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Socket.IO server is ready for connections`);
    
    // Connect to database after server starts
    connectDB().then(() => {
        console.log('Database connected successfully');
    }).catch((error) => {
        console.error('Database connection failed:', error);
        // Don't exit - let server run without DB for debugging
    });
});