import type { Cell, Player, WinResult } from '../types';
import { ROWS, COLS, BOARD_SIZE, WIN_LENGTH } from '../types';

/**
 * Converts (row, col) coordinates to flat array index
 */
export function coordsToIndex(row: number, col: number): number {
  return row * COLS + col;
}

/**
 * Gets the lowest free row in a given column
 */
export function getLowestFreeRow(board: Cell[], col: number): number | null {
  if (col < 0 || col >= COLS) return null;
  
  for (let row = ROWS - 1; row >= 0; row--) {
    const index = coordsToIndex(row, col);
    if (board[index] === null) {
      return row;
    }
  }
  
  return null;
}

/**
 * Checks if a specific player has won
 */
export function checkWin(board: Cell[], player: Player): boolean {
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const index = coordsToIndex(row, col);
      if (board[index] === player) {
        if (checkDirection(board, row, col, player, 0, 1) ||
            checkDirection(board, row, col, player, 1, 0) ||
            checkDirection(board, row, col, player, 1, 1) ||
            checkDirection(board, row, col, player, 1, -1)) {
          return true;
        }
      }
    }
  }
  return false;
}

function checkDirection(
  board: Cell[],
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
 * Finds the winning line
 */
export function findWinningLine(board: Cell[], player: Player): number[] | null {
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const index = coordsToIndex(row, col);
      if (board[index] === player) {
        const directions = [
          { dr: 0, dc: 1 },
          { dr: 1, dc: 0 },
          { dr: 1, dc: 1 },
          { dr: 1, dc: -1 },
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

function getLineInDirection(
  board: Cell[],
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

export function checkWinner(board: Cell[]): WinResult {
  if (checkWin(board, 'RED')) {
    const line = findWinningLine(board, 'RED');
    return { winner: 'RED', line };
  }
  
  if (checkWin(board, 'YELLOW')) {
    const line = findWinningLine(board, 'YELLOW');
    return { winner: 'YELLOW', line };
  }
  
  if (board.every((cell) => cell !== null)) {
    return { winner: 'draw', line: null };
  }
  
  return { winner: null, line: null };
}

export function isValidMove(board: Cell[], column: number): boolean {
  if (column < 0 || column >= COLS) return false;
  return getLowestFreeRow(board, column) !== null;
}

export function createEmptyBoard(): Cell[] {
  return Array(BOARD_SIZE).fill(null);
}
