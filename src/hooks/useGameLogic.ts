import { useState, useCallback, useEffect } from 'react';
import confetti from 'canvas-confetti';
import type { BoardState, Difficulty, GameStatus, Player, GameMode } from '../types/game.types';
import { checkWinner, createEmptyBoard, makeMove, getLowestFreeRow } from '../utils/gameLogic';
import { getAIMove } from '../utils/aiPlayer';
import { soundEffects } from '../utils/sounds';

interface UseGameLogicProps {
  onGameEnd?: (result: { winner: Player | 'draw'; player1: string; player2: string }) => void;
}

export function useGameLogic(props?: UseGameLogicProps) {
  const { onGameEnd } = props || {};
  const [board, setBoard] = useState<BoardState>(createEmptyBoard());
  const [currentPlayer, setCurrentPlayer] = useState<Player>('RED');
  const [gameStatus, setGameStatus] = useState<GameStatus>('playing');
  const [winner, setWinner] = useState<Player | null>(null);
  const [winningLine, setWinningLine] = useState<number[] | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [isAIThinking, setIsAIThinking] = useState(false);
  
  // Track last move for animation (kept for future features, currently unused in render)
  const [_lastMove, setLastMove] = useState<{ col: number; row: number } | null>(null);
  
  // 2-Player mode support
  const [gameMode, setGameMode] = useState<GameMode>('ai');
  const [player1Name, setPlayer1Name] = useState<string>('');
  const [player2Name, setPlayer2Name] = useState<string>('');
  
  // Statistics tracking (persisted in localStorage)
  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem('connect-four-stats');
    return saved ? JSON.parse(saved) : { wins: 0, losses: 0, draws: 0 };
  });

  // Trigger confetti when player wins
  useEffect(() => {
    if (gameStatus === 'won' && winner === 'RED') {
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

  const checkGameOver = useCallback((newBoard: BoardState) => {
    const result = checkWinner(newBoard);
    
    if (result.winner) {
      if (result.winner === 'draw') {
        setGameStatus('draw');
        setWinner(null);
        soundEffects.playDraw();
        
        // Update stats
        const newStats = { ...stats, draws: stats.draws + 1 };
        setStats(newStats);
        localStorage.setItem('connect-four-stats', JSON.stringify(newStats));
        
        // Trigger enhanced stats update
        if (onGameEnd) {
          onGameEnd({
            winner: 'draw',
            player1: gameMode === 'ai' ? 'Du' : player1Name || 'Spieler 1',
            player2: gameMode === 'ai' ? 'Computer' : player2Name || 'Spieler 2',
          });
        }
      } else {
        setGameStatus('won');
        setWinner(result.winner);
        setWinningLine(result.line);
        
        // Update stats
        const newStats = result.winner === 'RED' 
          ? { ...stats, wins: stats.wins + 1 }
          : { ...stats, losses: stats.losses + 1 };
        setStats(newStats);
        localStorage.setItem('connect-four-stats', JSON.stringify(newStats));
        
        // Play appropriate sound
        if (result.winner === 'RED') {
          soundEffects.playVictory();
        } else {
          soundEffects.playDefeat();
        }
        
        // Trigger enhanced stats update
        if (onGameEnd) {
          onGameEnd({
            winner: result.winner,
            player1: gameMode === 'ai' ? 'Du' : player1Name || 'Spieler 1',
            player2: gameMode === 'ai' ? 'Computer' : player2Name || 'Spieler 2',
          });
        }
      }
      return true;
    }
    
    return false;
  }, [stats, onGameEnd, gameMode, player1Name, player2Name]);

  const makeAIMove = useCallback((currentBoard: BoardState) => {
    setIsAIThinking(true);
    
    // Add small delay for better UX (shows AI is "thinking")
    setTimeout(() => {
      try {
        const aiMoveCol = getAIMove([...currentBoard], difficulty);
        const row = getLowestFreeRow(currentBoard, aiMoveCol);
        
        if (row !== null) {
          const newBoard = makeMove(currentBoard, aiMoveCol, 'YELLOW');
          
          if (newBoard) {
            // Play click sound for AI move
            soundEffects.playClick();
            
            setBoard(newBoard);
            setLastMove({ col: aiMoveCol, row });
            
            if (!checkGameOver(newBoard)) {
              setCurrentPlayer('RED');
            }
          }
        }
      } catch (error) {
        console.error('AI move failed:', error);
      } finally {
        setIsAIThinking(false);
      }
    }, 300);
  }, [difficulty, checkGameOver]);

  const handleColumnClick = useCallback((col: number) => {
    // Ignore clicks if game is over
    if (gameStatus !== 'playing') {
      return;
    }

    // For AI mode: ignore if AI is thinking or not player's turn
    if (gameMode === 'ai' && (isAIThinking || currentPlayer !== 'RED')) {
      return;
    }

    // Try to make the move
    const row = getLowestFreeRow(board, col);
    if (row === null) {
      // Column is full
      return;
    }

    // Play click sound
    soundEffects.playClick();

    // Make move
    const newBoard = makeMove(board, col, currentPlayer);
    if (!newBoard) {
      return;
    }

    setBoard(newBoard);
    setLastMove({ col, row });

    // Check if game over
    if (checkGameOver(newBoard)) {
      return;
    }

    // Switch player
    const nextPlayer: Player = currentPlayer === 'RED' ? 'YELLOW' : 'RED';
    setCurrentPlayer(nextPlayer);

    // AI mode: let AI play
    if (gameMode === 'ai' && nextPlayer === 'YELLOW') {
      makeAIMove(newBoard);
    }
  }, [board, currentPlayer, gameStatus, isAIThinking, checkGameOver, makeAIMove, gameMode]);

  // Legacy support for old interface
  const handleCellClick = useCallback((index: number) => {
    // Convert index to column
    const col = index % 7;
    handleColumnClick(col);
  }, [handleColumnClick]);

  const resetGame = useCallback(() => {
    setBoard(createEmptyBoard());
    setCurrentPlayer('RED');
    setGameStatus('playing');
    setWinner(null);
    setWinningLine(null);
    setIsAIThinking(false);
    setLastMove(null);
  }, []);

  const changeDifficulty = useCallback((newDifficulty: Difficulty) => {
    setDifficulty(newDifficulty);
    resetGame();
  }, [resetGame]);

  const resetStats = useCallback(() => {
    const emptyStats = { wins: 0, losses: 0, draws: 0 };
    setStats(emptyStats);
    localStorage.setItem('connect-four-stats', JSON.stringify(emptyStats));
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
    handleColumnClick,
    resetGame,
    changeDifficulty,
    resetStats,
    changeGameMode,
    setPlayer1Name,
    setPlayer2Name,
  };
}
