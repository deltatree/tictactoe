import type { Cell, Player, WinResult } from '../types';

const WINNING_COMBINATIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6], // Diagonals
];

export function checkWinner(board: Cell[]): WinResult {
  // Check winning combinations
  for (const combo of WINNING_COMBINATIONS) {
    const [a, b, c] = combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return {
        winner: board[a] as Player,
        line: combo,
      };
    }
  }

  // Check for draw
  if (board.every((cell) => cell !== null)) {
    return { winner: 'draw', line: null };
  }

  // Game still in progress
  return { winner: null, line: null };
}

export function isValidMove(board: Cell[], position: number): boolean {
  return position >= 0 && position < 9 && board[position] === null;
}

export function createEmptyBoard(): Cell[] {
  return Array(9).fill(null);
}
