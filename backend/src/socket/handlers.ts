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
          yourSymbol: 'X',
          opponent: {
            id: match.player2,
            name: match.player2Name || 'Anonymous'
          },
          gameState,
        });

        io.to(match.player2).emit('game-found', {
          gameId: gameState.id,
          yourSymbol: 'O',
          opponent: {
            id: match.player1,
            name: match.player1Name || 'Anonymous'
          },
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

    // Get queue stats
    socket.on('get-queue-stats', () => {
      socket.emit('queue-stats', {
        playersInQueue: matchmakingQueue.getQueueSize()
      });
    });

    // Send chat message
    socket.on('send-message', (data: { gameId: string; messageId: string }) => {
      const game = gameManager.getGame(data.gameId);
      if (!game) {
        socket.emit('error', { message: 'Game not found' });
        return;
      }

      // Verify player is in this game
      if (!game.hasPlayer(socket.id)) {
        socket.emit('error', { message: 'Not in this game' });
        return;
      }

      // Broadcast message to game room (both players)
      io.to(data.gameId).emit('chat-message', {
        messageId: data.messageId,
        sender: socket.id,
        timestamp: Date.now(),
      });
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
        }, 30000); // 30 seconds (give time for rematch)
      }
    });

    // Request rematch
    socket.on('request-rematch', (data: { gameId: string; playerName: string }) => {
      const game = gameManager.getGame(data.gameId);
      if (!game) {
        socket.emit('error', { message: 'Game not found' });
        return;
      }

      // Verify player is in this game
      if (!game.hasPlayer(socket.id)) {
        socket.emit('error', { message: 'Not in this game' });
        return;
      }

      // Get opponent socket ID
      const gameState = game.getState();
      const opponentId = gameState.players.X === socket.id 
        ? gameState.players.O 
        : gameState.players.X;

      // Notify opponent about rematch request
      io.to(opponentId).emit('rematch-request', {
        requesterId: socket.id,
        requesterName: data.playerName,
        gameId: data.gameId,
      });

      console.log(`🔄 Rematch requested by ${socket.id} in game ${data.gameId}`);
    });

    // Accept rematch
    socket.on('accept-rematch', (data: { 
      gameId: string; 
      requesterId: string; 
      playerName: string;
      requesterName: string;
    }) => {
      const oldGame = gameManager.getGame(data.gameId);
      if (!oldGame) {
        socket.emit('error', { message: 'Original game not found' });
        return;
      }
      
      // Create new game with same players
      const newGame = gameManager.createGame(data.requesterId, socket.id);
      const newGameState = newGame.getState();

      // Notify both players with correct opponent names
      io.to(data.requesterId).emit('rematch-accepted', {
        gameId: newGameState.id,
        yourSymbol: 'X',
        opponent: {
          id: socket.id,
          name: data.playerName || 'Anonymous'
        },
        gameState: newGameState,
      });

      io.to(socket.id).emit('rematch-accepted', {
        gameId: newGameState.id,
        yourSymbol: 'O',
        opponent: {
          id: data.requesterId,
          name: data.requesterName || 'Anonymous'
        },
        gameState: newGameState,
      });

      // Join both players to new game room
      io.sockets.sockets.get(data.requesterId)?.join(newGameState.id);
      io.sockets.sockets.get(socket.id)?.join(newGameState.id);

      // Clean up old game immediately
      gameManager.removeGame(data.gameId);

      console.log(`🔄 Rematch accepted: new game ${newGameState.id}`);
    });

    // Decline rematch
    socket.on('decline-rematch', (data: { requesterId: string }) => {
      io.to(data.requesterId).emit('rematch-declined', {
        message: 'Dein Gegner möchte keine Revanche spielen.'
      });

      console.log(`🔄 Rematch declined by ${socket.id}`);
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
