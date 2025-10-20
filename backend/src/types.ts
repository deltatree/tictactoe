// Connect Four Types
export const ROWS = 6;
export const COLS = 7;
export const BOARD_SIZE = ROWS * COLS; // 42
export const WIN_LENGTH = 4;

export type Player = 'RED' | 'YELLOW';
export type Cell = Player | null;
export type GameStatus = 'waiting' | 'playing' | 'won' | 'draw' | 'abandoned';

export interface GameState {
  id: string;
  board: Cell[];
  currentPlayer: Player;
  status: GameStatus;
  winner: Player | null;
  winningLine: number[] | null;
  players: {
    RED: string; // socket ID
    YELLOW: string; // socket ID
  };
  createdAt: number;
  lastMoveAt: number;
}

export interface Move {
  position: number;
  player: Player;
  timestamp: number;
}

export interface WinResult {
  winner: Player | 'draw' | null;
  line: number[] | null;
}

export interface ChatMessage {
  id: string;
  sender: string; // socket ID
  messageId: string;
  timestamp: number;
}
