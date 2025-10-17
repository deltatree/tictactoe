import { useState, useEffect, useCallback } from 'react';
import { useWebSocket } from '../context/WebSocketContext';
import type { Cell } from '../types/game.types';
import type { ChatMessage } from '../types/chat.types';
import { QUICK_MESSAGES } from '../types/chat.types';
import { soundEffects } from '../utils/sounds';

interface OnlineGameState {
  gameId: string;
  board: Cell[];
  currentPlayer: 'X' | 'O';
  yourSymbol: 'X' | 'O';
  opponentName: string;
  gameStatus: 'playing' | 'won' | 'draw';
  winner: 'X' | 'O' | null;
  winningLine: number[] | null;
  isYourTurn: boolean;
  chatMessages: ChatMessage[];
}

interface UseOnlineGameReturn extends OnlineGameState {
  handleCellClick: (index: number) => void;
  leaveGame: () => void;
  sendChatMessage: (messageId: string) => void;
  requestRematch: (playerName: string) => void;
  acceptRematch: (playerName: string) => void;
  declineRematch: () => void;
  rematchStatus: 'none' | 'requested' | 'pending' | 'accepted' | 'declined';
  rematchRequesterName: string | null;
}

export function useOnlineGame(
  gameId: string,
  yourSymbol: 'X' | 'O',
  opponentName: string
): UseOnlineGameReturn {
  const { emit, on, off, socket } = useWebSocket();

  // If no gameId, we're not in an online game yet - return early with defaults
  const isActive = Boolean(gameId);

  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<'X' | 'O'>('X');
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'draw'>('playing');
  const [winner, setWinner] = useState<'X' | 'O' | null>(null);
  const [winningLine, setWinningLine] = useState<number[] | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [rematchStatus, setRematchStatus] = useState<'none' | 'requested' | 'pending' | 'accepted' | 'declined'>('none');
  const [rematchRequesterName, setRematchRequesterName] = useState<string | null>(null);
  const [rematchRequesterId, setRematchRequesterId] = useState<string | null>(null);
  const [previousGameId, setPreviousGameId] = useState<string>('');

  const isYourTurn = currentPlayer === yourSymbol;

  // Debug logging for turn calculation
  useEffect(() => {
    if (isActive) {
      console.log('🎮 Turn Debug:', {
        currentPlayer,
        yourSymbol,
        isYourTurn,
        gameStatus,
        board: board.filter(c => c !== null).length + ' moves'
      });
    }
  }, [currentPlayer, yourSymbol, isYourTurn, gameStatus, board, isActive]);

  // Reset game state when gameId changes (new game/rematch)
  useEffect(() => {
    if (gameId && gameId !== previousGameId) {
      console.log('🔄 Online Game: New game detected, resetting state', { 
        oldGameId: previousGameId, 
        newGameId: gameId 
      });
      
      // Reset all game state
      setBoard(Array(9).fill(null));
      setCurrentPlayer('X');
      setGameStatus('playing');
      setWinner(null);
      setWinningLine(null);
      setChatMessages([]);
      setRematchStatus('none');
      setRematchRequesterName(null);
      setRematchRequesterId(null);
      
      setPreviousGameId(gameId);
    }
  }, [gameId, previousGameId]);

  // Handle game updates from server - only if we have an active game
  useEffect(() => {
    if (!isActive) return;
    
    const handleGameUpdate = (data: {
      gameState: {
        board: Cell[];
        currentPlayer: 'X' | 'O';
        status: 'playing' | 'won' | 'draw';
        winner: 'X' | 'O' | null;
        winningLine: number[] | null;
      };
    }) => {
      console.log('Online game update:', data);
      
      const { board, currentPlayer, status, winner, winningLine } = data.gameState;
      
      setBoard(board);
      setCurrentPlayer(currentPlayer);
      setGameStatus(status);
      setWinner(winner);
      setWinningLine(winningLine);

      // Play sound effects
      if (status === 'won') {
        if (winner === yourSymbol) {
          soundEffects.playVictory();
        } else {
          soundEffects.playClick(); // Play subtle sound for opponent win
        }
      } else if (status === 'draw') {
        soundEffects.playClick();
      } else {
        soundEffects.playClick();
      }
    };

    const handleChatMessage = (data: {
      messageId: string;
      sender: string;
      timestamp: number;
    }) => {
      console.log('Chat message received:', data);
      
      const message = QUICK_MESSAGES.find(m => m.id === data.messageId);
      if (!message) return;

      const newMessage: ChatMessage = {
        id: `${data.timestamp}-${data.sender}`,
        sender: data.sender === socket?.id ? 'you' : 'opponent',
        messageId: data.messageId,
        text: message.text,
        timestamp: data.timestamp,
      };

      setChatMessages((prev) => [...prev, newMessage].slice(-10)); // Keep last 10 messages
    };

    const handlePlayerDisconnected = (data: {
      gameState: {
        status: string;
      };
    }) => {
      console.log('Player disconnected:', data);
      setGameStatus('won');
      setWinner(yourSymbol); // You win by default if opponent disconnects
      alert(`${opponentName} hat das Spiel verlassen. Du gewinnst!`);
    };

    const handleError = (data: { message: string }) => {
      console.error('Game error:', data);
      alert(`Fehler: ${data.message}`);
    };

    on('game-update', handleGameUpdate);
    on('player-disconnected', handlePlayerDisconnected);
    on('chat-message', handleChatMessage);
    on('error', handleError);

    return () => {
      off('game-update', handleGameUpdate);
      off('player-disconnected', handlePlayerDisconnected);
      off('chat-message', handleChatMessage);
      off('error', handleError);
    };
  }, [on, off, yourSymbol, opponentName, socket, isActive]);

  // Handle cell click - only if we have an active game
  const handleCellClick = useCallback((index: number) => {
    if (!isActive) return;
    
    console.log('🖱️ Cell clicked:', {
      index,
      isYourTurn,
      currentPlayer,
      yourSymbol,
      gameStatus,
      cellEmpty: board[index] === null
    });
    
    // Can only make move if it's your turn and game is still playing
    if (!isYourTurn || gameStatus !== 'playing') {
      console.warn('❌ Cannot make move:', {
        isYourTurn,
        gameStatus,
        reason: !isYourTurn ? 'Not your turn' : 'Game not playing'
      });
      return;
    }

    // Can only click empty cells
    if (board[index] !== null) {
      console.warn('❌ Cell already taken:', index);
      return;
    }

    console.log('✅ Making move:', { gameId, position: index });
    emit('make-move', { gameId, position: index });
  }, [isYourTurn, gameStatus, board, emit, gameId, isActive, currentPlayer, yourSymbol]);

  // Leave game (disconnect) - only if active
  const leaveGame = useCallback(() => {
    if (!isActive) return;
    console.log('Leaving game:', gameId);
    // The server will handle cleanup on disconnect
    // We'll just reset the UI in the parent component
  }, [gameId, isActive]);

  // Send chat message - only if active
  const sendChatMessage = useCallback((messageId: string) => {
    if (!isActive) return;
    console.log('Sending chat message:', messageId);
    emit('send-message', { gameId, messageId });
  }, [emit, gameId, isActive]);

  // Request rematch - only if active
  const requestRematch = useCallback((playerName: string) => {
    if (!isActive) return;
    console.log('Requesting rematch:', gameId, playerName);
    emit('request-rematch', { gameId, playerName });
    setRematchStatus('requested');
  }, [emit, gameId, isActive]);

  // Accept rematch - only if active
  const acceptRematch = useCallback((playerName: string) => {
    if (!isActive || !rematchRequesterId) return;
    console.log('Accepting rematch:', gameId, rematchRequesterId, playerName);
    emit('accept-rematch', {
      gameId,
      requesterId: rematchRequesterId,
      playerName,
      requesterName: rematchRequesterName || 'Anonymous',
    });
  }, [emit, gameId, rematchRequesterId, rematchRequesterName, isActive]);

  // Decline rematch - only if active
  const declineRematch = useCallback(() => {
    if (!isActive || !rematchRequesterId) return;
    console.log('Declining rematch:', rematchRequesterId);
    emit('decline-rematch', {
      requesterId: rematchRequesterId,
    });
    setRematchStatus('none');
    setRematchRequesterName(null);
    setRematchRequesterId(null);
  }, [emit, rematchRequesterId, isActive]);

  // Handle rematch events
  useEffect(() => {
    if (!isActive) return;

    const handleRematchRequest = (data: {
      requesterId: string;
      requesterName: string;
      gameId: string;
    }) => {
      console.log('Rematch request received:', data);
      setRematchStatus('pending');
      setRematchRequesterName(data.requesterName);
      setRematchRequesterId(data.requesterId);
    };

    const handleRematchAccepted = (data: {
      gameId: string;
      yourSymbol: 'X' | 'O';
      opponent: { name: string };
    }) => {
      console.log('Rematch accepted:', data);
      setRematchStatus('accepted');
      // Game will be restarted by parent component
    };

    const handleRematchDeclined = (data: { message: string }) => {
      console.log('Rematch declined:', data);
      setRematchStatus('declined');
      alert(data.message);
    };

    on('rematch-request', handleRematchRequest);
    on('rematch-accepted', handleRematchAccepted);
    on('rematch-declined', handleRematchDeclined);

    return () => {
      off('rematch-request', handleRematchRequest);
      off('rematch-accepted', handleRematchAccepted);
      off('rematch-declined', handleRematchDeclined);
    };
  }, [on, off, isActive]);

  return {
    gameId,
    board,
    currentPlayer,
    yourSymbol,
    opponentName,
    gameStatus,
    winner,
    winningLine,
    isYourTurn,
    chatMessages,
    handleCellClick,
    leaveGame,
    sendChatMessage,
    requestRematch,
    acceptRematch,
    declineRematch,
    rematchStatus,
    rematchRequesterName,
  };
}
