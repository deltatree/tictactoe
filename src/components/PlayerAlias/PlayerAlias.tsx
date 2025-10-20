import { useState, useEffect } from 'react';
import './PlayerAlias.css';

interface PlayerAliasProps {
  onAliasSet: (alias: string) => void;
  currentAlias?: string;
}

const ALIAS_STORAGE_KEY = 'connect-four-player-alias';
const DEFAULT_ALIAS = 'Anonymous';

export const PlayerAlias: React.FC<PlayerAliasProps> = ({ onAliasSet, currentAlias }) => {
  const [alias, setAlias] = useState<string>(currentAlias || DEFAULT_ALIAS);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [tempAlias, setTempAlias] = useState<string>(alias);

  useEffect(() => {
    // Load saved alias from localStorage
    const savedAlias = localStorage.getItem(ALIAS_STORAGE_KEY);
    if (savedAlias) {
      setAlias(savedAlias);
      onAliasSet(savedAlias);
    }
  }, [onAliasSet]);

  const handleSave = () => {
    const trimmedAlias = tempAlias.trim();
    if (trimmedAlias) {
      const finalAlias = trimmedAlias.slice(0, 20); // Max 20 characters
      setAlias(finalAlias);
      localStorage.setItem(ALIAS_STORAGE_KEY, finalAlias);
      onAliasSet(finalAlias);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setTempAlias(alias);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <div className="player-alias">
      {isEditing ? (
        <div className="alias-edit">
          <input
            type="text"
            value={tempAlias}
            onChange={(e) => setTempAlias(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Dein Name"
            maxLength={20}
            autoFocus
            className="alias-input"
          />
          <button onClick={handleSave} className="alias-save-btn">
            ✓
          </button>
          <button onClick={handleCancel} className="alias-cancel-btn">
            ✕
          </button>
        </div>
      ) : (
        <div className="alias-display">
          <span className="alias-label">Spieler:</span>
          <span className="alias-name">{alias}</span>
          <button onClick={() => setIsEditing(true)} className="alias-edit-btn">
            ✏️
          </button>
        </div>
      )}
    </div>
  );
};

export const getPlayerAlias = (): string => {
  return localStorage.getItem(ALIAS_STORAGE_KEY) || DEFAULT_ALIAS;
};
