import type { Server, Socket } from 'socket.io';
import type { GameManager } from '../game/GameManager';
import type { MatchmakingQueue } from '../matchmaking/Queue';

export function setupSocketHandlers(
  io: Server,
  gameManager: GameManager,
  matchmakingQueue: MatchmakingQueue
): void {
  io.on('connection', (socket: Socket) => {
    console.log(`🔌 Client connected: ${socket.id}`);

    // Join matchmaking queue
    socket.on('join-queue', (data: { playerName?: string }) => {
      matchmakingQueue.addPlayer(socket.id, data?.playerName);
      
      // Emit queue size to all clients
      io.emit('queue-update', { queueSize: matchmakingQueue.getQueueSize() });

      // Try to find a match
      const match = matchmakingQueue.findMatch();
      if (match) {
        const game = gameManager.createGame(match.player1, match.player2);
        const gameState = game.getState();

        // Notify both players
        io.to(match.player1).emit('game-found', {
          gameId: gameState.id,
          role: 'X',
          opponent: match.player2,
          gameState,
        });

        io.to(match.player2).emit('game-found', {
          gameId: gameState.id,
          role: 'O',
          opponent: match.player1,
          gameState,
        });

        // Join both players to game room
        io.sockets.sockets.get(match.player1)?.join(gameState.id);
        io.sockets.sockets.get(match.player2)?.join(gameState.id);

        // Update queue size
        io.emit('queue-update', { queueSize: matchmakingQueue.getQueueSize() });
      }
    });

    // Leave matchmaking queue
    socket.on('leave-queue', () => {
      matchmakingQueue.removePlayer(socket.id);
      io.emit('queue-update', { queueSize: matchmakingQueue.getQueueSize() });
    });

    // Make a move
    socket.on('make-move', (data: { gameId: string; position: number }) => {
      const game = gameManager.getGame(data.gameId);
      if (!game) {
        socket.emit('error', { message: 'Game not found' });
        return;
      }

      const result = game.makeMove(socket.id, data.position);
      if (!result.success) {
        socket.emit('error', { message: result.error });
        return;
      }

      // Broadcast updated game state to both players
      io.to(data.gameId).emit('game-update', {
        gameState: game.getState(),
      });

      // If game is over, clean up after a delay
      if (game.isOver()) {
        setTimeout(() => {
          gameManager.removeGame(data.gameId);
        }, 10000); // 10 seconds
      }
    });

    // Player disconnects
    socket.on('disconnect', () => {
      console.log(`🔌 Client disconnected: ${socket.id}`);

      // Remove from queue if in queue
      matchmakingQueue.removePlayer(socket.id);
      io.emit('queue-update', { queueSize: matchmakingQueue.getQueueSize() });

      // Handle game abandonment
      const game = gameManager.playerDisconnected(socket.id);
      if (game) {
        const gameState = game.getState();
        io.to(gameState.id).emit('player-disconnected', {
          gameState,
        });

        // Clean up game
        setTimeout(() => {
          gameManager.removeGame(gameState.id);
        }, 5000);
      }
    });
  });

  // Periodic cleanup
  setInterval(() => {
    gameManager.cleanupOldGames();
    matchmakingQueue.cleanupOldEntries();
  }, 60000); // Every minute
}
