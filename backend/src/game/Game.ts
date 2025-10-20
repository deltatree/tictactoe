import type { GameState, Player, Cell } from '../types';
import { checkWinner, createEmptyBoard, isValidMove, getLowestFreeRow, coordsToIndex } from './gameLogic';
import { randomUUID } from 'crypto';

export class Game {
  private state: GameState;

  constructor(playerRedId: string, playerYellowId: string) {
    this.state = {
      id: randomUUID(),
      board: createEmptyBoard(),
      currentPlayer: 'RED',
      status: 'playing',
      winner: null,
      winningLine: null,
      players: {
        RED: playerRedId,
        YELLOW: playerYellowId,
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
    if (this.state.players.RED === socketId) return 'RED';
    if (this.state.players.YELLOW === socketId) return 'YELLOW';
    return null;
  }

  public hasPlayer(socketId: string): boolean {
    return this.state.players.RED === socketId || this.state.players.YELLOW === socketId;
  }

  public makeMove(socketId: string, column: number): { success: boolean; error?: string } {
    // Validate it's the player's turn
    const playerRole = this.getPlayerRole(socketId);
    if (!playerRole) {
      console.error('❌ Player not in game:', { socketId, gameId: this.state.id });
      return { success: false, error: 'Player not in this game' };
    }

    console.log('🎮 Backend makeMove (Connect Four):', {
      gameId: this.state.id,
      socketId,
      playerRole,
      currentPlayer: this.state.currentPlayer,
      column,
      board: this.state.board.filter(c => c !== null).length + ' moves',
      players: this.state.players
    });

    if (playerRole !== this.state.currentPlayer) {
      console.error('❌ Not your turn:', {
        playerRole,
        currentPlayer: this.state.currentPlayer,
        socketId,
        expectedSocketId: this.state.players[this.state.currentPlayer]
      });
      return { success: false, error: 'Not your turn' };
    }

    if (this.state.status !== 'playing') {
      return { success: false, error: 'Game is not active' };
    }

    // Validate move (column)
    if (!isValidMove(this.state.board, column)) {
      return { success: false, error: 'Invalid move - column full or out of range' };
    }

    // Find lowest free row in column
    const row = getLowestFreeRow(this.state.board, column);
    if (row === null) {
      return { success: false, error: 'Column is full' };
    }

    // Make move
    const position = coordsToIndex(row, column);
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
      console.log('🏆 Game over:', { winner: result.winner, line: result.line });
    } else {
      // Switch player
      const oldPlayer = this.state.currentPlayer;
      this.state.currentPlayer = this.state.currentPlayer === 'RED' ? 'YELLOW' : 'RED';
      console.log('🔄 Turn switched:', {
        from: oldPlayer,
        to: this.state.currentPlayer,
        nextSocketId: this.state.players[this.state.currentPlayer]
      });
    }

    return { success: true };
  }

  public abandon(socketId: string): void {
    if (this.hasPlayer(socketId) && this.state.status === 'playing') {
      this.state.status = 'abandoned';
      // The other player wins
      const leavingPlayer = this.getPlayerRole(socketId);
      if (leavingPlayer) {
        this.state.winner = leavingPlayer === 'RED' ? 'YELLOW' : 'RED';
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
