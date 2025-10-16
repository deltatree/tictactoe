import React from 'react';
import './GameModeSelector.css';

export type GameMode = 'ai' | 'local-2p' | 'online';

interface GameModeSelectorProps {
  currentMode: GameMode;
  onModeChange: (mode: GameMode) => void;
  disabled?: boolean;
}

export const GameModeSelector: React.FC<GameModeSelectorProps> = ({
  currentMode,
  onModeChange,
  disabled = false,
}) => {
  return (
    <div className="game-mode-selector">
      <button
        className={`mode-button ${currentMode === 'ai' ? 'active' : ''}`}
        onClick={() => onModeChange('ai')}
        disabled={disabled}
        title="Spiele gegen den Computer"
      >
        <span className="mode-icon">🤖</span>
        <span className="mode-label">Gegen Computer</span>
      </button>

      <button
        className={`mode-button ${currentMode === 'local-2p' ? 'active' : ''}`}
        onClick={() => onModeChange('local-2p')}
        disabled={disabled}
        title="Spiele mit einem Freund auf diesem Gerät"
      >
        <span className="mode-icon">👥</span>
        <span className="mode-label">2 Spieler (Lokal)</span>
      </button>

      <button
        className={`mode-button ${currentMode === 'online' ? 'active' : ''}`}
        onClick={() => onModeChange('online')}
        disabled={disabled}
        title="Spiele online gegen andere Spieler"
      >
        <span className="mode-icon">🌐</span>
        <span className="mode-label">Online Spielen</span>
      </button>
    </div>
  );
};
