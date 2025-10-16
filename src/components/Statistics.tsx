import './Statistics.css';

interface StatisticsProps {
  stats: {
    wins: number;
    losses: number;
    draws: number;
  };
  onReset: () => void;
}

export function Statistics({ stats, onReset }: StatisticsProps) {
  const totalGames = stats.wins + stats.losses + stats.draws;
  const winRate = totalGames > 0 ? Math.round((stats.wins / totalGames) * 100) : 0;

  return (
    <div className="statistics">
      <h3>📊 Deine Statistik</h3>
      <div className="stats-grid">
        <div className="stat-item win">
          <span className="stat-emoji">🏆</span>
          <span className="stat-value">{stats.wins}</span>
          <span className="stat-label">Siege</span>
        </div>
        <div className="stat-item loss">
          <span className="stat-emoji">😢</span>
          <span className="stat-value">{stats.losses}</span>
          <span className="stat-label">Niederlagen</span>
        </div>
        <div className="stat-item draw">
          <span className="stat-emoji">🤝</span>
          <span className="stat-value">{stats.draws}</span>
          <span className="stat-label">Unentschieden</span>
        </div>
      </div>
      {totalGames > 0 && (
        <div className="win-rate">
          <p>Siegesrate: <strong>{winRate}%</strong></p>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${winRate}%` }} />
          </div>
        </div>
      )}
      {totalGames > 0 && (
        <button className="reset-stats-button" onClick={onReset}>
          🔄 Statistik zurücksetzen
        </button>
      )}
    </div>
  );
}
