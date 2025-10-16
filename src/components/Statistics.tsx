import type { EnhancedStats } from '../types/game.types';
import './Statistics.css';

interface StatisticsProps {
  stats: EnhancedStats;
  onReset: () => void;
}

export function Statistics({ stats, onReset }: StatisticsProps) {
  const totalGames = stats.totalGames;
  const winRate = totalGames > 0 ? Math.round((stats.totalWins / totalGames) * 100) : 0;

  return (
    <div className="statistics">
      <h3>📊 Deine Statistik</h3>
      
      {/* Overall Stats */}
      <div className="stats-grid">
        <div className="stat-item win">
          <span className="stat-emoji">🏆</span>
          <span className="stat-value">{stats.totalWins}</span>
          <span className="stat-label">Siege</span>
        </div>
        <div className="stat-item loss">
          <span className="stat-emoji">😢</span>
          <span className="stat-value">{stats.totalLosses}</span>
          <span className="stat-label">Niederlagen</span>
        </div>
        <div className="stat-item draw">
          <span className="stat-emoji">🤝</span>
          <span className="stat-value">{stats.totalDraws}</span>
          <span className="stat-label">Unentschieden</span>
        </div>
      </div>

      {totalGames > 0 && (
        <>
          {/* Win Rate */}
          <div className="win-rate">
            <p>Siegesrate: <strong>{winRate}%</strong></p>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${winRate}%` }} />
            </div>
          </div>

          {/* Win Streaks */}
          <div className="streaks-section">
            <div className="streak-item">
              <span className="streak-icon">🔥</span>
              <div className="streak-details">
                <span className="streak-label">Aktuelle Serie</span>
                <span className="streak-value">{stats.currentWinStreak}</span>
              </div>
            </div>
            <div className="streak-item">
              <span className="streak-icon">⭐</span>
              <div className="streak-details">
                <span className="streak-label">Längste Serie</span>
                <span className="streak-value">{stats.longestWinStreak}</span>
              </div>
            </div>
          </div>

          {/* Per-Mode Stats */}
          <div className="mode-stats">
            <h4>Pro Modus</h4>
            <div className="mode-stats-grid">
              <div className="mode-stat">
                <div className="mode-stat-header">
                  <span className="mode-icon">🤖</span>
                  <span className="mode-name">KI</span>
                </div>
                <div className="mode-stat-values">
                  <span className="mode-wins">{stats.ai.wins}W</span>
                  <span className="mode-losses">{stats.ai.losses}L</span>
                  <span className="mode-draws">{stats.ai.draws}D</span>
                </div>
              </div>

              <div className="mode-stat">
                <div className="mode-stat-header">
                  <span className="mode-icon">👥</span>
                  <span className="mode-name">Lokal</span>
                </div>
                <div className="mode-stat-values">
                  <span className="mode-wins">{stats['local-2p'].wins}W</span>
                  <span className="mode-losses">{stats['local-2p'].losses}L</span>
                  <span className="mode-draws">{stats['local-2p'].draws}D</span>
                </div>
              </div>

              <div className="mode-stat">
                <div className="mode-stat-header">
                  <span className="mode-icon">🌐</span>
                  <span className="mode-name">Online</span>
                </div>
                <div className="mode-stat-values">
                  <span className="mode-wins">{stats.online.wins}W</span>
                  <span className="mode-losses">{stats.online.losses}L</span>
                  <span className="mode-draws">{stats.online.draws}D</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {totalGames > 0 && (
        <button className="reset-stats-button" onClick={onReset}>
          🔄 Statistik zurücksetzen
        </button>
      )}
    </div>
  );
}
