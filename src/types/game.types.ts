// Connect Four Constants
export const ROWS = 6;
export const COLS = 7;
export const BOARD_SIZE = ROWS * COLS; // 42
export const WIN_LENGTH = 4;

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

export type Player = 'RED' | 'YELLOW';
export type Cell = Player | null;
export type BoardState = Cell[];
export type GameStatus = 'playing' | 'won' | 'draw';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type GameMode = 'ai' | 'local-2p' | 'online';

export interface GameState {
  board: BoardState;
  currentPlayer: Player;
  gameStatus: GameStatus;
  winner: Player | null;
  winningLine: number[] | null;
  difficulty: Difficulty;
  moveHistory: Move[];
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

// Enhanced Statistics Types
export interface GameModeStats {
  wins: number;
  losses: number;
  draws: number;
  gamesPlayed: number;
}

export interface EnhancedStats {
  // Per-mode stats
  ai: GameModeStats;
  'local-2p': GameModeStats;
  online: GameModeStats;
  
  // Overall stats
  totalWins: number;
  totalLosses: number;
  totalDraws: number;
  totalGames: number;
  
  // Streaks
  currentWinStreak: number;
  longestWinStreak: number;
  
  // Achievements
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: number;
}

export interface GameHistoryEntry {
  id: string;
  mode: GameMode;
  result: 'win' | 'loss' | 'draw';
  opponent: string;
  playerSymbol: Player;
  opponentSymbol: Player;
  date: number;
  duration?: number; // in seconds
}
