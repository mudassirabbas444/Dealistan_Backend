import serverless from 'serverless-http';
import express from 'express';
import cors from 'cors';
import routes from '../src/init/routes.js';
import { connectDB } from '../src/init/db.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({ 
    origin: "*",
    credentials: false
}));

app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.send('Hello from Vercel serverless API');
});

app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Server is running on Vercel',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'production'
    });
});

// Initialize routes
routes(app);

// Initialize database connection
let dbConnected = false;

const connectDatabase = async () => {
    if (!dbConnected) {
        try {
            await connectDB();
            dbConnected = true;
            console.log('Database connected successfully');
        } catch (error) {
            console.error('Database connection failed:', error);
        }
    }
};

// Connect to database on cold start
connectDatabase();

// Export the serverless handler
export default serverless(app);
