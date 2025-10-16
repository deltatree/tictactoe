export type Player = 'X' | 'O';
export type Cell = Player | null;
export type GameStatus = 'playing' | 'won' | 'draw';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface GameState {
  board: Cell[];
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
