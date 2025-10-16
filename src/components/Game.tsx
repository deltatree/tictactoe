import { useState, useEffect } from 'react';
import { Board } from './Board';
import { GameStatus } from './GameStatus';
import { DifficultySelector } from './DifficultySelector';
import { Statistics } from './Statistics';
import VolumeControl from './VolumeControl/VolumeControl';
import { GameModeSelector } from './GameModeSelector/GameModeSelector';
import { PlayerNames } from './PlayerNames/PlayerNames';
import { ThemeSelector, type Theme } from './ThemeSelector/ThemeSelector';
import ConnectionStatus from './ConnectionStatus/ConnectionStatus';
import Matchmaking from './Matchmaking/Matchmaking';
import GameHistory from './GameHistory/GameHistory';
import Achievements from './Achievements/Achievements';
import QuickChat from './QuickChat/QuickChat';
import { useGameLogic } from '../hooks/useGameLogic';
import { useOnlineGame } from '../hooks/useOnlineGame';
import { useEnhancedStats } from '../hooks/useEnhancedStats';
import { soundEffects } from '../utils/sounds';
import { useWebSocket } from '../context/WebSocketContext';
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
    gameMode,
    player1Name,
    player2Name,
    handleCellClick,
    resetGame,
    changeDifficulty,
    changeGameMode,
    setPlayer1Name,
    setPlayer2Name,
  } = useGameLogic();

  const { connect, isConnected } = useWebSocket();

  // Enhanced stats and history
  const { stats: enhancedStats, history, recordGame: _recordGame, resetStats: resetEnhancedStats } = useEnhancedStats();

  // Volume state
  const [volume, setVolume] = useState<number>(soundEffects.getVolume());
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Theme state
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('gameTheme') as Theme | null;
    return savedTheme || 'colorful';
  });

  // Online game state
  const [isInMatchmaking, setIsInMatchmaking] = useState<boolean>(false);
  const [onlineGameData, setOnlineGameData] = useState<{
    gameId: string;
    opponentName: string;
    yourSymbol: 'X' | 'O';
  } | null>(null);

  // Load mute state from localStorage on mount
  useEffect(() => {
    const savedMute = localStorage.getItem('gameMuted');
    if (savedMute === 'true') {
      setIsMuted(true);
    }
  }, []);

  // Apply theme to body
  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('gameTheme', theme);
  }, [theme]);

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

  // Handle online mode selection
  const handleModeChange = (mode: typeof gameMode) => {
    if (mode === 'online') {
      // Connect to server if not already connected
      if (!isConnected) {
        connect();
      }
      // Show matchmaking screen
      setIsInMatchmaking(true);
    } else {
      // Cancel matchmaking if active
      setIsInMatchmaking(false);
      setOnlineGameData(null);
    }
    changeGameMode(mode);
  };

  const handleMatchFound = (data: {
    gameId: string;
    opponentName: string;
    yourSymbol: 'X' | 'O';
  }) => {
    console.log('Match found!', data);
    setOnlineGameData(data);
    setIsInMatchmaking(false);
  };

  const handleMatchmakingCancel = () => {
    setIsInMatchmaking(false);
    changeGameMode('ai'); // Return to AI mode
  };

  const handleLeaveOnlineGame = () => {
    setOnlineGameData(null);
    changeGameMode('ai'); // Return to AI mode
  };

  // Use online game hook if we have online game data
  const onlineGame = onlineGameData
    ? useOnlineGame(
        onlineGameData.gameId,
        onlineGameData.yourSymbol,
        onlineGameData.opponentName
      )
    : null;

  return (
    <div className="game-container">
      {/* Connection Status (only show in online mode) */}
      {gameMode === 'online' && <ConnectionStatus />}

      <header className="game-header">
        <h1>🎮 Tic-Tac-Toe 🎮</h1>
        <p className="subtitle">
          {gameMode === 'ai' && 'Spiele gegen den Computer!'}
          {gameMode === 'local-2p' && 'Lokaler 2-Spieler Modus'}
          {gameMode === 'online' && !onlineGameData && 'Online Multiplayer'}
          {gameMode === 'online' && onlineGameData && `Spiele gegen ${onlineGameData.opponentName}`}
        </p>
      </header>

      {/* Show matchmaking screen if in matchmaking */}
      {isInMatchmaking ? (
        <Matchmaking
          playerName={player1Name || 'Anonymous'}
          onMatchFound={handleMatchFound}
          onCancel={handleMatchmakingCancel}
        />
      ) : (
        <>
          <GameModeSelector
            currentMode={gameMode}
            onModeChange={handleModeChange}
            disabled={false}
          />

          {gameMode === 'local-2p' && (
            <PlayerNames
              player1Name={player1Name}
              player2Name={player2Name}
              onPlayer1NameChange={setPlayer1Name}
              onPlayer2NameChange={setPlayer2Name}
            />
          )}

          {gameMode === 'ai' && (
            <DifficultySelector
              currentDifficulty={difficulty}
              onDifficultyChange={changeDifficulty}
              disabled={gameStatus !== 'playing' && gameStatus !== 'draw' && gameStatus !== 'won'}
            />
          )}

          {/* Use online game state if playing online, otherwise use local game state */}
          {onlineGame ? (
            <>
              <GameStatus
                gameStatus={onlineGame.gameStatus}
                currentPlayer={onlineGame.currentPlayer}
                winner={onlineGame.winner}
                isAIThinking={false}
                gameMode="online"
                player1Name={onlineGame.yourSymbol === 'X' ? 'Du' : onlineGame.opponentName}
                player2Name={onlineGame.yourSymbol === 'O' ? 'Du' : onlineGame.opponentName}
              />

              <div className="online-game-info">
                <p className="turn-indicator">
                  {onlineGame.isYourTurn ? (
                    <span className="your-turn">🟢 Dein Zug ({onlineGame.yourSymbol})</span>
                  ) : (
                    <span className="opponent-turn">🔴 {onlineGame.opponentName} ist dran</span>
                  )}
                </p>
              </div>

              <Board 
                board={onlineGame.board} 
                winningLine={onlineGame.winningLine} 
                onCellClick={onlineGame.handleCellClick}
              />

              {onlineGame.gameStatus !== 'playing' && (
                <button className="new-game-button" onClick={handleLeaveOnlineGame}>
                  ← Zurück zum Hauptmenü
                </button>
              )}

              {/* Quick Chat for online games */}
              <QuickChat
                messages={onlineGame.chatMessages}
                onSendMessage={onlineGame.sendChatMessage}
                isOnlineGame={true}
              />
            </>
          ) : (
            <>
              <GameStatus
                gameStatus={gameStatus}
                currentPlayer={currentPlayer}
                winner={winner}
                isAIThinking={isAIThinking}
                gameMode={gameMode}
                player1Name={player1Name}
                player2Name={player2Name}
              />

              <Board board={board} winningLine={winningLine} onCellClick={handleCellClick} />

              <button className="new-game-button" onClick={resetGame}>
                🔄 Neues Spiel
              </button>
            </>
          )}

          <div className="settings-section">
            <VolumeControl
              volume={volume}
              isMuted={isMuted}
              onVolumeChange={handleVolumeChange}
              onMuteToggle={handleMuteToggle}
            />
          </div>

          <Statistics stats={enhancedStats} onReset={resetEnhancedStats} />

          <GameHistory history={history} />

          <Achievements achievements={enhancedStats.achievements} />

          <ThemeSelector currentTheme={theme} onThemeChange={setTheme} />
        </>
      )}

      <footer className="game-footer">
        <p>Erstellt mit ❤️ für Kinder</p>
      </footer>
    </div>
  );
}
