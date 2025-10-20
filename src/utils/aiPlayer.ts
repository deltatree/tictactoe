import type { BoardState, Difficulty, Player } from '../types/game.types';
import { COLS, ROWS } from '../types/game.types';
import { checkWin, getAvailableColumns, makeMove, isBoardFull, coordsToIndex } from './gameLogic';

/**
 * Main AI move function - returns the column to play
 */
export function getAIMove(board: BoardState, difficulty: Difficulty): number {
  const availableColumns = getAvailableColumns(board);
  
  if (availableColumns.length === 0) {
    throw new Error('No available columns');
  }

  switch (difficulty) {
    case 'easy':
      return findBestMove_Easy(board, availableColumns);
    case 'medium':
      return findBestMove_Medium(board, availableColumns);
    case 'hard':
      return findBestMove_Hard(board, 'YELLOW');
    default:
      return availableColumns[0];
  }
}

// ===== STORY 3.1: AI Player (Easy) =====
/**
 * Easy AI: Makes random valid moves
 */
function findBestMove_Easy(_board: BoardState, availableColumns: number[]): number {
  // Simply pick a random column
  return availableColumns[Math.floor(Math.random() * availableColumns.length)];
}

// ===== STORY 3.2: AI Player (Hard) - Minimax with Alpha-Beta Pruning =====
/**
 * Hard AI: Uses Minimax algorithm with alpha-beta pruning and heuristic evaluation
 */
function findBestMove_Hard(board: BoardState, aiPlayer: Player): number {
  const availableColumns = getAvailableColumns(board);
  let bestScore = -Infinity;
  let bestCol = availableColumns[0];
  
  for (const col of availableColumns) {
    const newBoard = makeMove(board, col, aiPlayer);
    if (newBoard) {
      const score = minimax(newBoard, 5, -Infinity, Infinity, false, aiPlayer);
      
      if (score > bestScore) {
        bestScore = score;
        bestCol = col;
      }
    }
  }
  
  return bestCol;
}

/**
 * Medium AI: Uses heuristics
 */
function findBestMove_Medium(board: BoardState, availableColumns: number[]): number {
  const aiPlayer: Player = 'YELLOW';
  const humanPlayer: Player = 'RED';
  
  // 1. Check if AI can win
  for (const col of availableColumns) {
    const testBoard = makeMove(board, col, aiPlayer);
    if (testBoard && checkWin(testBoard, aiPlayer)) {
      return col;
    }
  }
  
  // 2. Block human from winning
  for (const col of availableColumns) {
    const testBoard = makeMove(board, col, humanPlayer);
    if (testBoard && checkWin(testBoard, humanPlayer)) {
      return col;
    }
  }
  
  // 3. Prefer center column
  if (availableColumns.includes(3)) {
    return 3;
  }
  
  // 4. Choose column with best position
  const columnScores = availableColumns.map(col => {
    const testBoard = makeMove(board, col, aiPlayer);
    return testBoard ? evaluateBoard(testBoard, aiPlayer) : -Infinity;
  });
  
  const maxScore = Math.max(...columnScores);
  const bestCols = availableColumns.filter((_, i) => columnScores[i] === maxScore);
  
  return bestCols[Math.floor(Math.random() * bestCols.length)];
}

/**
 * Minimax algorithm with alpha-beta pruning
 */
function minimax(
  board: BoardState,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizing: boolean,
  aiPlayer: Player
): number {
  const humanPlayer: Player = aiPlayer === 'RED' ? 'YELLOW' : 'RED';
  
  // Check terminal states
  if (checkWin(board, aiPlayer)) return 1000 + depth;
  if (checkWin(board, humanPlayer)) return -1000 - depth;
  if (isBoardFull(board) || depth === 0) return evaluateBoard(board, aiPlayer);
  
  const availableColumns = getAvailableColumns(board);
  
  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const col of availableColumns) {
      const newBoard = makeMove(board, col, aiPlayer);
      if (newBoard) {
        const evaluation = minimax(newBoard, depth - 1, alpha, beta, false, aiPlayer);
        maxEval = Math.max(maxEval, evaluation);
        alpha = Math.max(alpha, evaluation);
        if (beta <= alpha) break; // Alpha-beta pruning
      }
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const col of availableColumns) {
      const newBoard = makeMove(board, col, humanPlayer);
      if (newBoard) {
        const evaluation = minimax(newBoard, depth - 1, alpha, beta, true, aiPlayer);
        minEval = Math.min(minEval, evaluation);
        beta = Math.min(beta, evaluation);
        if (beta <= alpha) break; // Alpha-beta pruning
      }
    }
    return minEval;
  }
}

/**
 * Heuristic evaluation function for Connect Four
 */
function evaluateBoard(board: BoardState, player: Player): number {
  let score = 0;
  const opponent: Player = player === 'RED' ? 'YELLOW' : 'RED';
  
  // Check all possible windows of 4
  // Horizontal
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS - 3; col++) {
      const window = [
        board[coordsToIndex(row, col)],
        board[coordsToIndex(row, col + 1)],
        board[coordsToIndex(row, col + 2)],
        board[coordsToIndex(row, col + 3)],
      ];
      score += evaluateWindow(window, player, opponent);
    }
  }
  
  // Vertical
  for (let row = 0; row < ROWS - 3; row++) {
    for (let col = 0; col < COLS; col++) {
      const window = [
        board[coordsToIndex(row, col)],
        board[coordsToIndex(row + 1, col)],
        board[coordsToIndex(row + 2, col)],
        board[coordsToIndex(row + 3, col)],
      ];
      score += evaluateWindow(window, player, opponent);
    }
  }
  
  // Diagonal (down-right)
  for (let row = 0; row < ROWS - 3; row++) {
    for (let col = 0; col < COLS - 3; col++) {
      const window = [
        board[coordsToIndex(row, col)],
        board[coordsToIndex(row + 1, col + 1)],
        board[coordsToIndex(row + 2, col + 2)],
        board[coordsToIndex(row + 3, col + 3)],
      ];
      score += evaluateWindow(window, player, opponent);
    }
  }
  
  // Diagonal (down-left)
  for (let row = 0; row < ROWS - 3; row++) {
    for (let col = 3; col < COLS; col++) {
      const window = [
        board[coordsToIndex(row, col)],
        board[coordsToIndex(row + 1, col - 1)],
        board[coordsToIndex(row + 2, col - 2)],
        board[coordsToIndex(row + 3, col - 3)],
      ];
      score += evaluateWindow(window, player, opponent);
    }
  }
  
  // Bonus for center column control
  const centerCol = 3;
  for (let row = 0; row < ROWS; row++) {
    if (board[coordsToIndex(row, centerCol)] === player) {
      score += 3;
    }
  }
  
  return score;
}

/**
 * Evaluate a window of 4 cells
 */
function evaluateWindow(window: (Player | null)[], player: Player, opponent: Player): number {
  let score = 0;
  
  const playerCount = window.filter(c => c === player).length;
  const opponentCount = window.filter(c => c === opponent).length;
  const emptyCount = window.filter(c => c === null).length;
  
  // Scoring logic
  if (playerCount === 4) {
    score += 100; // Four in a row
  } else if (playerCount === 3 && emptyCount === 1) {
    score += 5; // Three in a row with one empty
  } else if (playerCount === 2 && emptyCount === 2) {
    score += 2; // Two in a row with two empty
  }
  
  // Penalize opponent opportunities
  if (opponentCount === 3 && emptyCount === 1) {
    score -= 4; // Opponent has three in a row
  }
  
  return score;
}
