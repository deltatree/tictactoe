import type { Cell, Difficulty, Player } from '../types/game.types';
import { checkWinner, getEmptyCells } from './gameLogic';

export function getAIMove(board: Cell[], difficulty: Difficulty): number {
  const emptyCells = getEmptyCells(board);
  
  if (emptyCells.length === 0) {
    throw new Error('No empty cells available');
  }

  switch (difficulty) {
    case 'easy':
      return getEasyMove(board, emptyCells);
    case 'medium':
      return getMediumMove(board, emptyCells);
    case 'hard':
      return getHardMove(board);
    default:
      return emptyCells[0];
  }
}

// Easy Mode: 70% random, 30% strategic
function getEasyMove(board: Cell[], emptyCells: number[]): number {
  const random = Math.random();
  
  // 70% of the time, make a random move
  if (random < 0.7) {
    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
  }
  
  // 30% strategic: 50% chance to win/block
  const winMove = findWinningMove(board, 'O');
  const blockMove = findWinningMove(board, 'X');
  
  if (winMove !== -1 && Math.random() < 0.5) {
    return winMove;
  }
  
  if (blockMove !== -1 && Math.random() < 0.5) {
    return blockMove;
  }
  
  // Otherwise random
  return emptyCells[Math.floor(Math.random() * emptyCells.length)];
}

// Medium Mode: Heuristic strategy
function getMediumMove(board: Cell[], emptyCells: number[]): number {
  // 1. Try to win
  const winMove = findWinningMove(board, 'O');
  if (winMove !== -1) return winMove;
  
  // 2. Block player from winning
  const blockMove = findWinningMove(board, 'X');
  if (blockMove !== -1) return blockMove;
  
  // 3. Take center if available (80% chance)
  if (board[4] === null && Math.random() < 0.8) return 4;
  
  // 4. Take a corner (60% chance)
  const corners = [0, 2, 6, 8].filter(pos => board[pos] === null);
  if (corners.length > 0 && Math.random() < 0.6) {
    return corners[Math.floor(Math.random() * corners.length)];
  }
  
  // 5. Take any edge
  return emptyCells[Math.floor(Math.random() * emptyCells.length)];
}

// Hard Mode: Minimax algorithm (unbeatable)
function getHardMove(board: Cell[]): number {
  let bestScore = -Infinity;
  let bestMove = -1;
  
  const emptyCells = getEmptyCells(board);
  
  for (const cell of emptyCells) {
    // Make move
    board[cell] = 'O';
    const score = minimax(board, 0, false);
    // Undo move
    board[cell] = null;
    
    if (score > bestScore) {
      bestScore = score;
      bestMove = cell;
    }
  }
  
  return bestMove;
}

function minimax(board: Cell[], depth: number, isMaximizing: boolean): number {
  const result = checkWinner(board);
  
  // Terminal states
  if (result.winner === 'O') return 10 - depth; // AI wins (prefer faster wins)
  if (result.winner === 'X') return depth - 10; // Player wins (prefer slower losses)
  if (result.winner === 'draw') return 0; // Draw
  
  const emptyCells = getEmptyCells(board);
  
  if (isMaximizing) {
    // AI's turn (O)
    let bestScore = -Infinity;
    for (const cell of emptyCells) {
      board[cell] = 'O';
      const score = minimax(board, depth + 1, false);
      board[cell] = null;
      bestScore = Math.max(bestScore, score);
    }
    return bestScore;
  } else {
    // Player's turn (X)
    let bestScore = Infinity;
    for (const cell of emptyCells) {
      board[cell] = 'X';
      const score = minimax(board, depth + 1, true);
      board[cell] = null;
      bestScore = Math.min(bestScore, score);
    }
    return bestScore;
  }
}

// Helper: Find a move that would result in a win for the given player
function findWinningMove(board: Cell[], player: Player): number {
  const emptyCells = getEmptyCells(board);
  
  for (const cell of emptyCells) {
    board[cell] = player;
    const result = checkWinner(board);
    board[cell] = null;
    
    if (result.winner === player) {
      return cell;
    }
  }
  
  return -1;
}
