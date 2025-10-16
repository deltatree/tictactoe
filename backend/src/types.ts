export type Player = 'X' | 'O';
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
    X: string; // socket ID
    O: string; // socket ID
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
