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
        origin: process.env.CLIENT_URL || "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true
    }
});

const PORT = process.env.PORT || 5000;
const allowedOrigins = [
    'https://dealistan-frontend-git-main-dealistaans-projects.vercel.app',
    'https://dealistan-frontend.vercel.app',
    'http://localhost:3000',
    'http://localhost:3001',
  ];
  
 
  const corsOptions = {
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      if (origin.includes('vercel.app')) return callback(null, true);
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  };
  
  app.use(cors(corsOptions));
  app.options('*', cors(corsOptions));
  

app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {
    res.send('Hello from server');
});

app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

routes(app);

// Initialize Socket.IO handlers and expose io globally
setIO(io);
initializeSocketHandlers(io);

// Initialize database connection and start server
connectDB().then(() => {
    server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
        console.log(`Socket.IO server is ready for connections`);
    });
}).catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
});