import type { Cell, Player, WinResult } from '../types/game.types';

export const WINNING_PATTERNS = [
  [0, 1, 2], // Row 1
  [3, 4, 5], // Row 2
  [6, 7, 8], // Row 3
  [0, 3, 6], // Col 1
  [1, 4, 7], // Col 2
  [2, 5, 8], // Col 3
  [0, 4, 8], // Diagonal 1
  [2, 4, 6], // Diagonal 2
];

export function checkWinner(board: Cell[]): WinResult {
  // Check all winning patterns
  for (const pattern of WINNING_PATTERNS) {
    const [a, b, c] = pattern;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a] as Player, line: pattern };
    }
  }

  // Check for draw (all cells filled)
  if (board.every((cell) => cell !== null)) {
    return { winner: 'draw', line: null };
  }

  // Game still in progress
  return { winner: null, line: null };
}

export function getEmptyCells(board: Cell[]): number[] {
  return board
    .map((cell, index) => (cell === null ? index : -1))
    .filter((index) => index !== -1);
}

export function isBoardFull(board: Cell[]): boolean {
  return board.every((cell) => cell !== null);
}

export function createEmptyBoard(): Cell[] {
  return Array(9).fill(null);
}
