import type { Cell, Player, WinResult, BoardState } from '../types/game.types';
import { ROWS, COLS, BOARD_SIZE, WIN_LENGTH } from '../types/game.types';

// ===== BOARD HELPER FUNCTIONS (Story 1.2) =====

/**
 * Creates an empty Connect Four board (7x6 = 42 cells)
 */
export function createEmptyBoard(): BoardState {
  return Array(BOARD_SIZE).fill(null);
}

/**
 * Converts (row, col) coordinates to flat array index
 */
export function coordsToIndex(row: number, col: number): number {
  return row * COLS + col;
}

/**
 * Converts flat array index to (row, col) coordinates
 */
export function indexToCoords(index: number): { row: number; col: number } {
  return {
    row: Math.floor(index / COLS),
    col: index % COLS,
  };
}

/**
 * Gets the lowest free row in a given column
 * Returns null if the column is full
 */
export function getLowestFreeRow(board: BoardState, col: number): number | null {
  if (col < 0 || col >= COLS) return null;
  
  // Start from bottom row and go up
  for (let row = ROWS - 1; row >= 0; row--) {
    const index = coordsToIndex(row, col);
    if (board[index] === null) {
      return row;
    }
  }
  
  return null; // Column is full
}

/**
 * Makes a move in the specified column
 * Returns a new board state or null if the move is invalid
 */
export function makeMove(board: BoardState, col: number, player: Player): BoardState | null {
  const row = getLowestFreeRow(board, col);
  
  if (row === null) {
    return null; // Invalid move - column is full
  }
  
  const newBoard = [...board];
  const index = coordsToIndex(row, col);
  newBoard[index] = player;
  
  return newBoard;
}

/**
 * Checks if a column is full
 */
export function isColumnFull(board: BoardState, col: number): boolean {
  if (col < 0 || col >= COLS) return true;
  const topIndex = coordsToIndex(0, col);
  return board[topIndex] !== null;
}

/**
 * Checks if the board is completely full
 */
export function isBoardFull(board: BoardState): boolean {
  return board.every((cell) => cell !== null);
}

/**
 * Gets all available columns (columns that are not full)
 */
export function getAvailableColumns(board: BoardState): number[] {
  const available: number[] = [];
  for (let col = 0; col < COLS; col++) {
    if (!isColumnFull(board, col)) {
      available.push(col);
    }
  }
  return available;
}

// ===== WIN DETECTION (Story 1.3) =====

/**
 * Checks if a specific player has won the game
 * Uses optimized 4-direction scan from any position
 */
export function checkWin(board: BoardState, player: Player): boolean {
  // Check all positions for potential wins
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const index = coordsToIndex(row, col);
      if (board[index] === player) {
        // Check 4 directions from this position
        if (checkDirection(board, row, col, player, 0, 1) ||  // Horizontal
            checkDirection(board, row, col, player, 1, 0) ||  // Vertical
            checkDirection(board, row, col, player, 1, 1) ||  // Diagonal down-right
            checkDirection(board, row, col, player, 1, -1)) { // Diagonal down-left
          return true;
        }
      }
    }
  }
  return false;
}

/**
 * Checks if there are WIN_LENGTH consecutive pieces in a given direction
 */
function checkDirection(
  board: BoardState,
  startRow: number,
  startCol: number,
  player: Player,
  rowDelta: number,
  colDelta: number
): boolean {
  let count = 0;
  
  for (let i = 0; i < WIN_LENGTH; i++) {
    const row = startRow + i * rowDelta;
    const col = startCol + i * colDelta;
    
    // Check bounds
    if (row < 0 || row >= ROWS || col < 0 || col >= COLS) {
      return false;
    }
    
    const index = coordsToIndex(row, col);
    if (board[index] === player) {
      count++;
    } else {
      return false;
    }
  }
  
  return count === WIN_LENGTH;
}

/**
 * Finds the winning line if a player has won
 * Returns the indices of the winning pieces
 */
export function findWinningLine(board: BoardState, player: Player): number[] | null {
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const index = coordsToIndex(row, col);
      if (board[index] === player) {
        // Check all 4 directions
        const directions = [
          { dr: 0, dc: 1 },  // Horizontal
          { dr: 1, dc: 0 },  // Vertical
          { dr: 1, dc: 1 },  // Diagonal down-right
          { dr: 1, dc: -1 }, // Diagonal down-left
        ];
        
        for (const { dr, dc } of directions) {
          const line = getLineInDirection(board, row, col, player, dr, dc);
          if (line && line.length === WIN_LENGTH) {
            return line;
          }
        }
      }
    }
  }
  return null;
}

/**
 * Gets the line of pieces in a specific direction
 */
function getLineInDirection(
  board: BoardState,
  startRow: number,
  startCol: number,
  player: Player,
  rowDelta: number,
  colDelta: number
): number[] | null {
  const line: number[] = [];
  
  for (let i = 0; i < WIN_LENGTH; i++) {
    const row = startRow + i * rowDelta;
    const col = startCol + i * colDelta;
    
    if (row < 0 || row >= ROWS || col < 0 || col >= COLS) {
      return null;
    }
    
    const index = coordsToIndex(row, col);
    if (board[index] === player) {
      line.push(index);
    } else {
      return null;
    }
  }
  
  return line.length === WIN_LENGTH ? line : null;
}

/**
 * Main winner check function (compatible with existing interface)
 */
export function checkWinner(board: BoardState): WinResult {
  // Check for RED win
  if (checkWin(board, 'RED')) {
    const line = findWinningLine(board, 'RED');
    return { winner: 'RED', line };
  }
  
  // Check for YELLOW win
  if (checkWin(board, 'YELLOW')) {
    const line = findWinningLine(board, 'YELLOW');
    return { winner: 'YELLOW', line };
  }
  
  // Check for draw
  if (isBoardFull(board)) {
    return { winner: 'draw', line: null };
  }
  
  // Game still in progress
  return { winner: null, line: null };
}

// ===== LEGACY FUNCTIONS (for backward compatibility during transition) =====

export function getEmptyCells(board: Cell[]): number[] {
  return board
    .map((cell, index) => (cell === null ? index : -1))
    .filter((index) => index !== -1);
}
