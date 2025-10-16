import { Board } from './Board';
import { GameStatus } from './GameStatus';
import { DifficultySelector } from './DifficultySelector';
import { Statistics } from './Statistics';
import { useGameLogic } from '../hooks/useGameLogic';
import './Game.css';

export function Game() {
  const {
    board,
    currentPlayer,
    gameStatus,
    winner,
    winningLine,
    difficulty,
    isAIThinking,
    stats,
    handleCellClick,
    resetGame,
    changeDifficulty,
    resetStats,
  } = useGameLogic();

  return (
    <div className="game-container">
      <header className="game-header">
        <h1>🎮 Tic-Tac-Toe 🎮</h1>
        <p className="subtitle">Spiele gegen den Computer!</p>
      </header>

      <DifficultySelector
        currentDifficulty={difficulty}
        onDifficultyChange={changeDifficulty}
        disabled={gameStatus !== 'playing' && gameStatus !== 'draw' && gameStatus !== 'won'}
      />

      <GameStatus
        gameStatus={gameStatus}
        currentPlayer={currentPlayer}
        winner={winner}
        isAIThinking={isAIThinking}
      />

      <Board board={board} winningLine={winningLine} onCellClick={handleCellClick} />

      <button className="new-game-button" onClick={resetGame}>
        🔄 Neues Spiel
      </button>

      <Statistics stats={stats} onReset={resetStats} />

      <footer className="game-footer">
        <p>Erstellt mit ❤️ für Kinder</p>
      </footer>
    </div>
  );
}
