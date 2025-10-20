import { Game } from './Game';

export class GameManager {
  private games: Map<string, Game> = new Map();
  private playerToGame: Map<string, string> = new Map(); // socketId -> gameId
  private totalGamesPlayed: number = 0;

  public createGame(playerXId: string, playerOId: string): Game {
    const game = new Game(playerXId, playerOId);
    const gameId = game.getId();

    this.games.set(gameId, game);
    this.playerToGame.set(playerXId, gameId);
    this.playerToGame.set(playerOId, gameId);
    this.totalGamesPlayed++;

    console.log(`✅ Game ${gameId} created: ${playerXId} vs ${playerOId}`);
    return game;
  }

  public getGame(gameId: string): Game | undefined {
    return this.games.get(gameId);
  }

  public getGameByPlayer(socketId: string): Game | undefined {
    const gameId = this.playerToGame.get(socketId);
    if (!gameId) return undefined;
    return this.games.get(gameId);
  }

  public removeGame(gameId: string): void {
    const game = this.games.get(gameId);
    if (game) {
      const state = game.getState();
      this.playerToGame.delete(state.players.RED);
      this.playerToGame.delete(state.players.YELLOW);
      this.games.delete(gameId);
      console.log(`🗑️  Game ${gameId} removed`);
    }
  }

  public playerDisconnected(socketId: string): Game | undefined {
    const game = this.getGameByPlayer(socketId);
    if (game) {
      game.abandon(socketId);
      return game;
    }
    return undefined;
  }

  public getActiveGamesCount(): number {
    return Array.from(this.games.values()).filter((game) => game.isActive()).length;
  }

  public getTotalGamesPlayed(): number {
    return this.totalGamesPlayed;
  }

  public cleanupOldGames(): void {
    const now = Date.now();
    const MAX_GAME_AGE = 30 * 60 * 1000; // 30 minutes

    for (const [gameId, game] of this.games.entries()) {
      const state = game.getState();
      if (now - state.lastMoveAt > MAX_GAME_AGE) {
        this.removeGame(gameId);
      }
    }
  }
}
