import 'dotenv/config'; // Load .env file
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { setupSocketHandlers } from './socket/handlers';
import { GameManager } from './game/GameManager';
import { MatchmakingQueue } from './matchmaking/Queue';

const app = express();
const httpServer = createServer(app);

// Determine allowed origins
const allowedOrigins: string[] = [
  'http://localhost:5173',  // Vite dev server
  'http://localhost:80',     // Docker local
  'http://localhost',        // Docker without port
  process.env.FRONTEND_URL,
].filter((origin): origin is string => Boolean(origin));

const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true,
  },
  // Transport configuration for MAXIMUM firewall compatibility
  // CRITICAL: Polling first ensures connection works behind firewalls
  // WebSocket can be upgraded to later if firewall allows
  transports: ['polling', 'websocket'], // Polling first, WebSocket second
  allowUpgrades: true, // Allow upgrading from polling to WebSocket
  
  // Ping/pong for connection health monitoring
  pingInterval: 25000, // Send ping every 25 seconds
  pingTimeout: 10000, // Wait 10 seconds for pong response
  
  // Connection settings - be patient with slow/restricted networks
  connectTimeout: 60000, // 60 seconds for initial connection (firewalls can be slow)
  maxHttpBufferSize: 1e6, // 1 MB max message size
  
  // Polling-specific settings (for firewall compatibility)
  allowEIO3: true, // Support older clients if needed
  cookie: false, // No cookies needed for our use case
  
  // CORS preflight settings
  perMessageDeflate: false, // Disable compression (can cause issues with some firewalls)
});

// Middleware
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
app.use(express.json());

// Game state
const gameManager = new GameManager();
const matchmakingQueue = new MatchmakingQueue();

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    activeGames: gameManager.getActiveGamesCount(),
    playersInQueue: matchmakingQueue.getQueueSize(),
  });
});

// Stats endpoint
app.get('/api/stats', (_req, res) => {
  res.json({
    activeGames: gameManager.getActiveGamesCount(),
    totalGamesPlayed: gameManager.getTotalGamesPlayed(),
    playersOnline: io.sockets.sockets.size,
    playersInQueue: matchmakingQueue.getQueueSize(),
  });
});

// Socket.IO
setupSocketHandlers(io, gameManager, matchmakingQueue);

// Start server
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 WebSocket server ready`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  httpServer.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
