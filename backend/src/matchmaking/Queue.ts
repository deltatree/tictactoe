interface QueueEntry {
  socketId: string;
  joinedAt: number;
  playerName?: string;
}

export class MatchmakingQueue {
  private queue: QueueEntry[] = [];
  private readonly MAX_QUEUE_TIME = 5 * 60 * 1000; // 5 minutes

  public addPlayer(socketId: string, playerName?: string): void {
    // Remove if already in queue
    this.removePlayer(socketId);

    this.queue.push({
      socketId,
      joinedAt: Date.now(),
      playerName,
    });

    console.log(`➕ Player ${socketId} joined queue (${this.queue.length} waiting)`);
  }

  public removePlayer(socketId: string): void {
    const index = this.queue.findIndex((entry) => entry.socketId === socketId);
    if (index !== -1) {
      this.queue.splice(index, 1);
      console.log(`➖ Player ${socketId} left queue (${this.queue.length} waiting)`);
    }
  }

  public findMatch(): { player1: string; player2: string } | null {
    if (this.queue.length < 2) {
      return null;
    }

    // Simple FIFO matching
    const player1 = this.queue.shift()!;
    const player2 = this.queue.shift()!;

    console.log(`🎮 Match found: ${player1.socketId} vs ${player2.socketId}`);

    return {
      player1: player1.socketId,
      player2: player2.socketId,
    };
  }

  public getQueueSize(): number {
    return this.queue.length;
  }

  public isInQueue(socketId: string): boolean {
    return this.queue.some((entry) => entry.socketId === socketId);
  }

  public cleanupOldEntries(): void {
    const now = Date.now();
    this.queue = this.queue.filter((entry) => {
      return now - entry.joinedAt < this.MAX_QUEUE_TIME;
    });
  }
}
