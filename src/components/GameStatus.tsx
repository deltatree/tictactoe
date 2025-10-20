import type { GameStatus as GameStatusType, Player, GameMode } from '../types/game.types';
import './GameStatus.css';

interface GameStatusProps {
  gameStatus: GameStatusType;
  currentPlayer: Player;
  winner: Player | null;
  isAIThinking: boolean;
  gameMode?: GameMode;
  player1Name?: string;
  player2Name?: string;
  isYourTurn?: boolean;
  yourSymbol?: 'X' | 'O';
}

export function GameStatus({ 
  gameStatus, 
  currentPlayer, 
  winner, 
  isAIThinking,
  gameMode = 'ai',
  player1Name = '',
  player2Name = '',
  isYourTurn: _isYourTurn = false,
  yourSymbol = 'X'
}: GameStatusProps) {
  const getPlayerName = (player: Player) => {
    if (gameMode === 'online') {
      // For online mode, use isYourTurn to determine correct name
      if (player === yourSymbol as any) {
        return 'Du';
      } else {
        return player === 'RED' ? player1Name : player2Name;
      }
    }
    if (gameMode === 'local-2p') {
      return player === 'RED' 
        ? (player1Name || 'Spieler 1 (Rot)') 
        : (player2Name || 'Spieler 2 (Gelb)');
    }
    return player === 'RED' ? 'Du (Rot)' : 'Computer (Gelb)';
  };

  const getStatusMessage = () => {
    if (gameStatus === 'won') {
      if (gameMode === 'local-2p' || gameMode === 'online') {
        const winnerName = winner ? getPlayerName(winner) : 'Unbekannt';
        return `🎉 ${winnerName} hat gewonnen! 🎉`;
      }
      if (winner === 'RED') {
        return '🎉 Du hast gewonnen! 🎉';
      }
      return '🤖 Computer hat gewonnen!';
    }

    if (gameStatus === 'draw') {
      return '🤝 Unentschieden!';
    }

    if (gameMode === 'local-2p' || gameMode === 'online') {
      const currentName = getPlayerName(currentPlayer);
      const symbol = currentPlayer === 'RED' ? '🔴' : '🟡';
      return `${symbol} ${currentName} ist dran!`;
    }

    if (isAIThinking) {
      return '🤔 Computer ist dran...';
    }

    if (currentPlayer === 'RED') {
      return '✨ Du bist dran! 🔴';
    }

    return '🤖 Computer ist dran...';
  };

  return (
    <div className={`game-status ${gameStatus !== 'playing' ? 'game-over' : ''}`}>
      <h2>{getStatusMessage()}</h2>
    </div>
  );
}
