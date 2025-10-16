import type { Achievement, EnhancedStats } from '../types/game.types';

export const ACHIEVEMENTS: Omit<Achievement, 'unlocked' | 'unlockedAt'>[] = [
  {
    id: 'first-win',
    name: 'Erster Sieg',
    description: 'Gewinne dein erstes Spiel',
    icon: '🎉',
  },
  {
    id: 'win-streak-3',
    name: 'Siegesserie',
    description: 'Gewinne 3 Spiele in Folge',
    icon: '🔥',
  },
  {
    id: 'online-master',
    name: 'Online-Meister',
    description: 'Gewinne 10 Online-Spiele',
    icon: '👑',
  },
  {
    id: 'veteran',
    name: 'Veteran',
    description: 'Spiele 50 Spiele insgesamt',
    icon: '⭐',
  },
  {
    id: 'perfect-score',
    name: 'Perfekt',
    description: 'Gewinne 10 Spiele ohne eine Niederlage',
    icon: '💯',
  },
  {
    id: 'local-champion',
    name: 'Lokaler Champion',
    description: 'Gewinne 20 lokale 2-Spieler Spiele',
    icon: '🏠',
  },
  {
    id: 'ai-destroyer',
    name: 'KI-Bezwinger',
    description: 'Gewinne 25 Spiele gegen die KI',
    icon: '🤖',
  },
  {
    id: 'draw-master',
    name: 'Unentschieden-Meister',
    description: 'Erziele 10 Unentschieden',
    icon: '🤝',
  },
];

export function checkAchievements(stats: EnhancedStats): Achievement[] {
  const achievements: Achievement[] = ACHIEVEMENTS.map((achievement) => {
    const existing = stats.achievements.find((a) => a.id === achievement.id);
    if (existing?.unlocked) {
      return existing;
    }

    let unlocked = false;

    switch (achievement.id) {
      case 'first-win':
        unlocked = stats.totalWins >= 1;
        break;
      case 'win-streak-3':
        unlocked = stats.longestWinStreak >= 3;
        break;
      case 'online-master':
        unlocked = stats.online.wins >= 10;
        break;
      case 'veteran':
        unlocked = stats.totalGames >= 50;
        break;
      case 'perfect-score':
        unlocked = stats.totalWins >= 10 && stats.totalLosses === 0;
        break;
      case 'local-champion':
        unlocked = stats['local-2p'].wins >= 20;
        break;
      case 'ai-destroyer':
        unlocked = stats.ai.wins >= 25;
        break;
      case 'draw-master':
        unlocked = stats.totalDraws >= 10;
        break;
    }

    return {
      ...achievement,
      unlocked,
      unlockedAt: unlocked ? Date.now() : undefined,
    };
  });

  return achievements;
}

export function getNewlyUnlockedAchievements(
  oldAchievements: Achievement[],
  newAchievements: Achievement[]
): Achievement[] {
  return newAchievements.filter((newAch) => {
    const oldAch = oldAchievements.find((a) => a.id === newAch.id);
    return newAch.unlocked && (!oldAch || !oldAch.unlocked);
  });
}
