import { useState, useEffect, useCallback } from 'react';
import { useWebSocket } from '../context/WebSocketContext';
import type { Cell } from '../types/game.types';
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
}

interface UseOnlineGameReturn extends OnlineGameState {
  handleCellClick: (index: number) => void;
  leaveGame: () => void;
}

export function useOnlineGame(
  gameId: string,
  yourSymbol: 'X' | 'O',
  opponentName: string
): UseOnlineGameReturn {
  const { emit, on, off } = useWebSocket();

  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<'X' | 'O'>('X');
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'draw'>('playing');
  const [winner, setWinner] = useState<'X' | 'O' | null>(null);
  const [winningLine, setWinningLine] = useState<number[] | null>(null);

  const isYourTurn = currentPlayer === yourSymbol;

  // Handle game updates from server
  useEffect(() => {
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
    on('error', handleError);

    return () => {
      off('game-update', handleGameUpdate);
      off('player-disconnected', handlePlayerDisconnected);
      off('error', handleError);
    };
  }, [on, off, yourSymbol, opponentName]);

  // Handle cell click
  const handleCellClick = useCallback((index: number) => {
    // Can only make move if it's your turn and game is still playing
    if (!isYourTurn || gameStatus !== 'playing') {
      return;
    }

    // Can only click empty cells
    if (board[index] !== null) {
      return;
    }

    console.log('Making move:', { gameId, position: index });
    emit('make-move', { gameId, position: index });
  }, [isYourTurn, gameStatus, board, emit, gameId]);

  // Leave game (disconnect)
  const leaveGame = useCallback(() => {
    console.log('Leaving game:', gameId);
    // The server will handle cleanup on disconnect
    // We'll just reset the UI in the parent component
  }, [gameId]);

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
    handleCellClick,
    leaveGame,
  };
}
