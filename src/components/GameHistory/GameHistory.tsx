import React, { useState } from 'react';
import type { GameHistoryEntry, GameMode } from '../../types/game.types';
import './GameHistory.css';

interface GameHistoryProps {
  history: GameHistoryEntry[];
}

const GameHistory: React.FC<GameHistoryProps> = ({ history }) => {
  const [filterMode, setFilterMode] = useState<GameMode | 'all'>('all');

  const filteredHistory = filterMode === 'all'
    ? history
    : history.filter((entry) => entry.mode === filterMode);

  const getResultIcon = (result: 'win' | 'loss' | 'draw') => {
    switch (result) {
      case 'win':
        return '🏆';
      case 'loss':
        return '😢';
      case 'draw':
        return '🤝';
    }
  };

  const getResultClass = (result: 'win' | 'loss' | 'draw') => {
    return `result-${result}`;
  };

  const getModeLabel = (mode: GameMode) => {
    switch (mode) {
      case 'ai':
        return '🤖 KI';
      case 'local-2p':
        return '👥 Lokal';
      case 'online':
        return '🌐 Online';
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Gerade eben';
    if (diffMins < 60) return `vor ${diffMins} Min`;
    if (diffHours < 24) return `vor ${diffHours} Std`;
    if (diffDays < 7) return `vor ${diffDays} ${diffDays === 1 ? 'Tag' : 'Tagen'}`;
    
    return date.toLocaleDateString('de-DE', { 
      day: '2-digit', 
      month: '2-digit',
      year: '2-digit'
    });
  };

  if (history.length === 0) {
    return (
      <div className="game-history">
        <h3>📜 Spielverlauf</h3>
        <p className="no-history">Noch keine Spiele gespielt</p>
      </div>
    );
  }

  return (
    <div className="game-history">
      <h3>📜 Spielverlauf</h3>
      
      <div className="history-filters">
        <button
          className={`filter-btn ${filterMode === 'all' ? 'active' : ''}`}
          onClick={() => setFilterMode('all')}
        >
          Alle
        </button>
        <button
          className={`filter-btn ${filterMode === 'ai' ? 'active' : ''}`}
          onClick={() => setFilterMode('ai')}
        >
          🤖 KI
        </button>
        <button
          className={`filter-btn ${filterMode === 'local-2p' ? 'active' : ''}`}
          onClick={() => setFilterMode('local-2p')}
        >
          👥 Lokal
        </button>
        <button
          className={`filter-btn ${filterMode === 'online' ? 'active' : ''}`}
          onClick={() => setFilterMode('online')}
        >
          🌐 Online
        </button>
      </div>

      <div className="history-list">
        {filteredHistory.length === 0 ? (
          <p className="no-results">Keine Spiele in dieser Kategorie</p>
        ) : (
          filteredHistory.map((entry) => (
            <div key={entry.id} className={`history-item ${getResultClass(entry.result)}`}>
              <div className="history-icon">
                {getResultIcon(entry.result)}
              </div>
              <div className="history-details">
                <div className="history-header">
                  <span className="history-mode">{getModeLabel(entry.mode)}</span>
                  <span className="history-result">
                    {entry.result === 'win' ? 'Gewonnen' : 
                     entry.result === 'loss' ? 'Verloren' : 
                     'Unentschieden'}
                  </span>
                </div>
                <div className="history-info">
                  <span className="history-opponent">
                    vs {entry.opponent} ({entry.opponentSymbol})
                  </span>
                  <span className="history-date">{formatDate(entry.date)}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default GameHistory;
