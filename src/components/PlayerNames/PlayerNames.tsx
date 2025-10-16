import React, { useState } from 'react';
import './PlayerNames.css';

interface PlayerNamesProps {
  player1Name: string;
  player2Name: string;
  onPlayer1NameChange: (name: string) => void;
  onPlayer2NameChange: (name: string) => void;
}

export const PlayerNames: React.FC<PlayerNamesProps> = ({
  player1Name,
  player2Name,
  onPlayer1NameChange,
  onPlayer2NameChange,
}) => {
  const [showInputs, setShowInputs] = useState(false);

  return (
    <div className="player-names">
      {!showInputs ? (
        <button className="edit-names-button" onClick={() => setShowInputs(true)}>
          ✏️ Spielernamen bearbeiten
        </button>
      ) : (
        <div className="names-inputs">
          <div className="name-input-group">
            <label htmlFor="player1">
              <span className="player-icon">✖️</span> Spieler 1:
            </label>
            <input
              id="player1"
              type="text"
              value={player1Name}
              onChange={(e) => onPlayer1NameChange(e.target.value)}
              placeholder="Dein Name"
              maxLength={20}
            />
          </div>

          <div className="name-input-group">
            <label htmlFor="player2">
              <span className="player-icon">⭕</span> Spieler 2:
            </label>
            <input
              id="player2"
              type="text"
              value={player2Name}
              onChange={(e) => onPlayer2NameChange(e.target.value)}
              placeholder="Gegner"
              maxLength={20}
            />
          </div>

          <button className="done-button" onClick={() => setShowInputs(false)}>
            ✅ Fertig
          </button>
        </div>
      )}

      {!showInputs && (
        <div className="current-names">
          <span className="player-tag">
            <span className="player-icon">✖️</span> {player1Name || 'Spieler 1'}
          </span>
          <span className="vs">vs</span>
          <span className="player-tag">
            <span className="player-icon">⭕</span> {player2Name || 'Spieler 2'}
          </span>
        </div>
      )}
    </div>
  );
};
