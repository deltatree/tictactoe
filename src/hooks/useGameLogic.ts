import { useState, useCallback, useEffect } from 'react';
import confetti from 'canvas-confetti';
import type { Cell, Difficulty, GameStatus, Player, GameMode } from '../types/game.types';
import { checkWinner, createEmptyBoard } from '../utils/gameLogic';
import { getAIMove } from '../utils/aiPlayer';
import { soundEffects } from '../utils/sounds';

export function useGameLogic() {
  const [board, setBoard] = useState<Cell[]>(createEmptyBoard());
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [gameStatus, setGameStatus] = useState<GameStatus>('playing');
  const [winner, setWinner] = useState<Player | null>(null);
  const [winningLine, setWinningLine] = useState<number[] | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [isAIThinking, setIsAIThinking] = useState(false);
  
  // 2-Player mode support
  const [gameMode, setGameMode] = useState<GameMode>('ai');
  const [player1Name, setPlayer1Name] = useState<string>('');
  const [player2Name, setPlayer2Name] = useState<string>('');
  
  // Statistics tracking (persisted in localStorage)
  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem('tictactoe-stats');
    return saved ? JSON.parse(saved) : { wins: 0, losses: 0, draws: 0 };
  });

  // Trigger confetti when player wins
  useEffect(() => {
    if (gameStatus === 'won' && winner === 'X') {
      // Celebrate player victory with confetti!
      const duration = 3000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
      };

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        
        // Fire confetti from random positions
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [gameStatus, winner]);

  const checkGameOver = useCallback((newBoard: Cell[]) => {
    const result = checkWinner(newBoard);
    
    if (result.winner) {
      if (result.winner === 'draw') {
        setGameStatus('draw');
        setWinner(null);
        soundEffects.playDraw();
        
        // Update stats
        const newStats = { ...stats, draws: stats.draws + 1 };
        setStats(newStats);
        localStorage.setItem('tictactoe-stats', JSON.stringify(newStats));
      } else {
        setGameStatus('won');
        setWinner(result.winner);
        setWinningLine(result.line);
        
        // Update stats
        const newStats = result.winner === 'X' 
          ? { ...stats, wins: stats.wins + 1 }
          : { ...stats, losses: stats.losses + 1 };
        setStats(newStats);
        localStorage.setItem('tictactoe-stats', JSON.stringify(newStats));
        
        // Play appropriate sound
        if (result.winner === 'X') {
          soundEffects.playVictory();
        } else {
          soundEffects.playDefeat();
        }
      }
      return true;
    }
    
    return false;
  }, [stats]);

  const makeAIMove = useCallback((currentBoard: Cell[]) => {
    setIsAIThinking(true);
    
    // Add small delay for better UX (shows AI is "thinking")
    setTimeout(() => {
      try {
        const aiMovePosition = getAIMove([...currentBoard], difficulty);
        const newBoard = [...currentBoard];
        newBoard[aiMovePosition] = 'O';
        
        // Play click sound for AI move
        soundEffects.playClick();
        
        setBoard(newBoard);
        
        if (!checkGameOver(newBoard)) {
          setCurrentPlayer('X');
        }
      } catch (error) {
        console.error('AI move failed:', error);
      } finally {
        setIsAIThinking(false);
      }
    }, 300);
  }, [difficulty, checkGameOver]);

  const handleCellClick = useCallback((index: number) => {
    // Ignore clicks if game is over or cell is occupied
    if (gameStatus !== 'playing' || board[index] !== null) {
      return;
    }

    // For AI mode: ignore if AI is thinking or not player's turn
    if (gameMode === 'ai' && (isAIThinking || currentPlayer !== 'X')) {
      return;
    }

    // Play click sound
    soundEffects.playClick();

    // Make move
    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    // Check if game over
    if (checkGameOver(newBoard)) {
      return;
    }

    // Switch player
    const nextPlayer: Player = currentPlayer === 'X' ? 'O' : 'X';
    setCurrentPlayer(nextPlayer);

    // AI mode: let AI play
    if (gameMode === 'ai' && nextPlayer === 'O') {
      makeAIMove(newBoard);
    }
  }, [board, currentPlayer, gameStatus, isAIThinking, checkGameOver, makeAIMove, gameMode]);

  const resetGame = useCallback(() => {
    setBoard(createEmptyBoard());
    setCurrentPlayer('X');
    setGameStatus('playing');
    setWinner(null);
    setWinningLine(null);
    setIsAIThinking(false);
  }, []);

  const changeDifficulty = useCallback((newDifficulty: Difficulty) => {
    setDifficulty(newDifficulty);
    resetGame();
  }, [resetGame]);

  const resetStats = useCallback(() => {
    const emptyStats = { wins: 0, losses: 0, draws: 0 };
    setStats(emptyStats);
    localStorage.setItem('tictactoe-stats', JSON.stringify(emptyStats));
  }, []);

  const changeGameMode = useCallback((mode: GameMode) => {
    setGameMode(mode);
    resetGame();
  }, [resetGame]);

  return {
    board,
    currentPlayer,
    gameStatus,
    winner,
    winningLine,
    difficulty,
    isAIThinking,
    stats,
    gameMode,
    player1Name,
    player2Name,
    handleCellClick,
    resetGame,
    changeDifficulty,
    resetStats,
    changeGameMode,
    setPlayer1Name,
    setPlayer2Name,
  };
}
