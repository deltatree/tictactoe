import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { setupSocketHandlers } from './socket/handlers';
import { GameManager } from './game/GameManager';
import { MatchmakingQueue } from './matchmaking/Queue';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(cors());
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
