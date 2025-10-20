import { useState, useEffect, useCallback } from 'react';
import type { EnhancedStats, GameHistoryEntry, GameMode, Player } from '../types/game.types';
import { checkAchievements } from '../utils/achievements';

const STATS_STORAGE_KEY = 'connect-four-enhanced-stats';
const HISTORY_STORAGE_KEY = 'connect-four-game-history';
const MAX_HISTORY = 10;

const createEmptyStats = (): EnhancedStats => ({
  ai: { wins: 0, losses: 0, draws: 0, gamesPlayed: 0 },
  'local-2p': { wins: 0, losses: 0, draws: 0, gamesPlayed: 0 },
  online: { wins: 0, losses: 0, draws: 0, gamesPlayed: 0 },
  totalWins: 0,
  totalLosses: 0,
  totalDraws: 0,
  totalGames: 0,
  currentWinStreak: 0,
  longestWinStreak: 0,
  achievements: [],
});

export function useEnhancedStats() {
  const [stats, setStats] = useState<EnhancedStats>(() => {
    const saved = localStorage.getItem(STATS_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return createEmptyStats();
      }
    }
    return createEmptyStats();
  });

  const [history, setHistory] = useState<GameHistoryEntry[]>(() => {
    const saved = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  // Save to localStorage whenever stats or history change
  useEffect(() => {
    localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
  }, [history]);

  const recordGame = useCallback((
    mode: GameMode,
    result: 'win' | 'loss' | 'draw',
    opponent: string,
    playerSymbol: Player,
    opponentSymbol: Player
  ) => {
    setStats((prev) => {
      const newStats = { ...prev };

      // Update mode-specific stats
      newStats[mode].gamesPlayed++;
      if (result === 'win') newStats[mode].wins++;
      else if (result === 'loss') newStats[mode].losses++;
      else newStats[mode].draws++;

      // Update overall stats
      newStats.totalGames++;
      if (result === 'win') {
        newStats.totalWins++;
        newStats.currentWinStreak++;
        if (newStats.currentWinStreak > newStats.longestWinStreak) {
          newStats.longestWinStreak = newStats.currentWinStreak;
        }
      } else {
        newStats.currentWinStreak = 0;
        if (result === 'loss') newStats.totalLosses++;
        else newStats.totalDraws++;
      }

      // Check and update achievements
      newStats.achievements = checkAchievements(newStats);

      return newStats;
    });

    // Add to history
    setHistory((prev) => {
      const newEntry: GameHistoryEntry = {
        id: `game-${Date.now()}-${Math.random()}`,
        mode,
        result,
        opponent,
        playerSymbol,
        opponentSymbol,
        date: Date.now(),
      };

      const newHistory = [newEntry, ...prev].slice(0, MAX_HISTORY);
      return newHistory;
    });
  }, []);

  const resetStats = useCallback(() => {
    setStats(createEmptyStats());
    setHistory([]);
    localStorage.removeItem(STATS_STORAGE_KEY);
    localStorage.removeItem(HISTORY_STORAGE_KEY);
  }, []);

  return {
    stats,
    history,
    recordGame,
    resetStats,
  };
}
