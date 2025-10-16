import { useState, useEffect } from 'react';
import { Board } from './Board';
import { GameStatus } from './GameStatus';
import { DifficultySelector } from './DifficultySelector';
import { Statistics } from './Statistics';
import VolumeControl from './VolumeControl/VolumeControl';
import { useGameLogic } from '../hooks/useGameLogic';
import { soundEffects } from '../utils/sounds';
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

  // Volume state
  const [volume, setVolume] = useState<number>(soundEffects.getVolume());
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Load mute state from localStorage on mount
  useEffect(() => {
    const savedMute = localStorage.getItem('gameMuted');
    if (savedMute === 'true') {
      setIsMuted(true);
    }
  }, []);

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    soundEffects.setVolume(newVolume);
    
    // If volume is changed from 0, unmute
    if (newVolume > 0 && isMuted) {
      setIsMuted(false);
      localStorage.setItem('gameMuted', 'false');
    }
  };

  const handleMuteToggle = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    localStorage.setItem('gameMuted', newMutedState.toString());
    
    // If unmuting, restore the volume
    if (!newMutedState) {
      soundEffects.setVolume(volume);
    } else {
      soundEffects.setVolume(0);
    }
  };

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

      <div className="settings-section">
        <VolumeControl
          volume={volume}
          isMuted={isMuted}
          onVolumeChange={handleVolumeChange}
          onMuteToggle={handleMuteToggle}
        />
      </div>

      <Statistics stats={stats} onReset={resetStats} />

      <footer className="game-footer">
        <p>Erstellt mit ❤️ für Kinder</p>
      </footer>
    </div>
  );
}
