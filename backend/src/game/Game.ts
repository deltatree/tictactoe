import type { GameState, Player, Cell } from '../types';
import { checkWinner, createEmptyBoard, isValidMove } from './gameLogic';
import { randomUUID } from 'crypto';

export class Game {
  private state: GameState;

  constructor(playerXId: string, playerOId: string) {
    this.state = {
      id: randomUUID(),
      board: createEmptyBoard(),
      currentPlayer: 'X',
      status: 'playing',
      winner: null,
      winningLine: null,
      players: {
        X: playerXId,
        O: playerOId,
      },
      createdAt: Date.now(),
      lastMoveAt: Date.now(),
    };
  }

  public getState(): GameState {
    return { ...this.state };
  }

  public getId(): string {
    return this.state.id;
  }

  public getPlayerRole(socketId: string): Player | null {
    if (this.state.players.X === socketId) return 'X';
    if (this.state.players.O === socketId) return 'O';
    return null;
  }

  public hasPlayer(socketId: string): boolean {
    return this.state.players.X === socketId || this.state.players.O === socketId;
  }

  public makeMove(socketId: string, position: number): { success: boolean; error?: string } {
    // Validate it's the player's turn
    const playerRole = this.getPlayerRole(socketId);
    if (!playerRole) {
      return { success: false, error: 'Player not in this game' };
    }

    if (playerRole !== this.state.currentPlayer) {
      return { success: false, error: 'Not your turn' };
    }

    if (this.state.status !== 'playing') {
      return { success: false, error: 'Game is not active' };
    }

    // Validate move
    if (!isValidMove(this.state.board, position)) {
      return { success: false, error: 'Invalid move' };
    }

    // Make move
    const newBoard: Cell[] = [...this.state.board];
    newBoard[position] = playerRole;
    this.state.board = newBoard;
    this.state.lastMoveAt = Date.now();

    // Check game over
    const result = checkWinner(newBoard);
    if (result.winner) {
      this.state.status = result.winner === 'draw' ? 'draw' : 'won';
      this.state.winner = result.winner === 'draw' ? null : (result.winner as Player);
      this.state.winningLine = result.line;
    } else {
      // Switch player
      this.state.currentPlayer = this.state.currentPlayer === 'X' ? 'O' : 'X';
    }

    return { success: true };
  }

  public abandon(socketId: string): void {
    if (this.hasPlayer(socketId) && this.state.status === 'playing') {
      this.state.status = 'abandoned';
      // The other player wins
      const leavingPlayer = this.getPlayerRole(socketId);
      if (leavingPlayer) {
        this.state.winner = leavingPlayer === 'X' ? 'O' : 'X';
      }
    }
  }

  public isActive(): boolean {
    return this.state.status === 'playing';
  }

  public isOver(): boolean {
    return this.state.status === 'won' || this.state.status === 'draw' || this.state.status === 'abandoned';
  }
}
