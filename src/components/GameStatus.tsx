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
}

export function GameStatus({ 
  gameStatus, 
  currentPlayer, 
  winner, 
  isAIThinking,
  gameMode = 'ai',
  player1Name = '',
  player2Name = ''
}: GameStatusProps) {
  const getPlayerName = (player: Player) => {
    if (gameMode === 'local-2p') {
      return player === 'X' 
        ? (player1Name || 'Spieler 1') 
        : (player2Name || 'Spieler 2');
    }
    return player === 'X' ? 'Du' : 'Computer';
  };

  const getStatusMessage = () => {
    if (gameStatus === 'won') {
      if (gameMode === 'local-2p' || gameMode === 'online') {
        const winnerName = winner === 'X' ? getPlayerName('X') : getPlayerName('O');
        return `🎉 ${winnerName} hat gewonnen! 🎉`;
      }
      if (winner === 'X') {
        return '🎉 Du hast gewonnen! 🎉';
      }
      return '🤖 Computer hat gewonnen!';
    }

    if (gameStatus === 'draw') {
      return '🤝 Unentschieden!';
    }

    if (gameMode === 'local-2p' || gameMode === 'online') {
      const currentName = getPlayerName(currentPlayer);
      const symbol = currentPlayer === 'X' ? '✖️' : '⭕';
      return `${symbol} ${currentName} ist dran!`;
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
