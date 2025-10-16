import type { GameStatus as GameStatusType, Player } from '../types/game.types';
import './GameStatus.css';

interface GameStatusProps {
  gameStatus: GameStatusType;
  currentPlayer: Player;
  winner: Player | null;
  isAIThinking: boolean;
}

export function GameStatus({ gameStatus, currentPlayer, winner, isAIThinking }: GameStatusProps) {
  const getStatusMessage = () => {
    if (gameStatus === 'won') {
      if (winner === 'X') {
        return '🎉 Du hast gewonnen! ��';
      }
      return '🤖 Computer hat gewonnen!';
    }

    if (gameStatus === 'draw') {
      return '🤝 Unentschieden!';
    }

    if (isAIThinking) {
      return '🤔 Computer ist dran...';
    }

    if (currentPlayer === 'X') {
      return '✨ Du bist dran! (X)';
    }

    return '🤖 Computer ist dran...';
  };

  return (
    <div className={`game-status ${gameStatus !== 'playing' ? 'game-over' : ''}`}>
      <h2>{getStatusMessage()}</h2>
    </div>
  );
}
