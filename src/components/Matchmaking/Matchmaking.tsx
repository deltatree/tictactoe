import React, { useState, useEffect } from 'react';
import { useWebSocket } from '../../context/WebSocketContext';
import './Matchmaking.css';

interface MatchmakingProps {
  playerName: string;
  onMatchFound: (gameData: {
    gameId: string;
    opponentName: string;
    yourSymbol: 'X' | 'O';
    opponentSymbol: 'X' | 'O';
  }) => void;
  onCancel: () => void;
  onNameConfirmed?: () => void;
}

const Matchmaking: React.FC<MatchmakingProps> = ({ playerName, onMatchFound, onCancel, onNameConfirmed }) => {
  const { emit, on, off, isConnected } = useWebSocket();
  const [playersOnline, setPlayersOnline] = useState<number>(0);
  const [waitingTime, setWaitingTime] = useState<number>(0);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [matchData, setMatchData] = useState<{
    gameId: string;
    opponent: { name: string };
    yourSymbol: 'X' | 'O';
  } | null>(null);
  const [waitingForConfirmation, setWaitingForConfirmation] = useState<boolean>(false);

  useEffect(() => {
    if (!isConnected) {
      console.warn('Matchmaking: Not connected to server');
      return;
    }

    console.log('Matchmaking: Joining queue...', { playerName });
    emit('join-queue', { playerName });

    // Listen for game found event
    const handleGameFound = (data: {
      gameId: string;
      opponent: { name: string };
      yourSymbol: 'X' | 'O';
    }) => {
      console.log('Matchmaking: Game found!', data);
      
      // Store match data and wait for user confirmation
      setMatchData(data);
      setWaitingForConfirmation(true);
    };

    // Listen for opponent name updates (when opponent confirms with different name)
    const handleOpponentNameUpdated = (data: {
      gameId: string;
      opponentName: string;
    }) => {
      console.log('Matchmaking: Opponent name updated!', data);
      
      // Update opponent name in matchData
      if (matchData && matchData.gameId === data.gameId) {
        setMatchData({
          ...matchData,
          opponent: { name: data.opponentName }
        });
      }
    };

    // Listen for queue stats updates
    const handleQueueStats = (data: { playersInQueue: number }) => {
      console.log('Matchmaking: Queue stats', data);
      setPlayersOnline(data.playersInQueue);
    };

    on('game-found', handleGameFound);
    on('opponent-name-updated', handleOpponentNameUpdated);
    on('queue-stats', handleQueueStats);

    // Request initial stats
    emit('get-queue-stats');

    // Cleanup
    return () => {
      console.log('Matchmaking: Leaving queue...');
      emit('leave-queue');
      off('game-found', handleGameFound);
      off('opponent-name-updated', handleOpponentNameUpdated);
      off('queue-stats', handleQueueStats);
    };
  }, [isConnected, emit, on, off, playerName, onMatchFound, matchData]);

  // Waiting time counter
  useEffect(() => {
    const interval = setInterval(() => {
      setWaitingTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleCancel = () => {
    console.log('Matchmaking: User cancelled');
    emit('leave-queue');
    onCancel();
  };

  const handleConfirmName = () => {
    if (!matchData) return;
    
    console.log('Matchmaking: Name confirmed, starting game...', matchData);
    console.log('Matchmaking: Sending current player name to backend:', playerName);
    
    // Send confirmation with current player name to backend
    emit('confirm-match', {
      gameId: matchData.gameId,
      playerName: playerName, // Use CURRENT playerName (might have changed)
    });
    
    if (onNameConfirmed) {
      onNameConfirmed();
    }
    
    // Start countdown after confirmation
    let countdownValue = 3;
    setCountdown(countdownValue);
    setWaitingForConfirmation(false);
    
    const countdownInterval = setInterval(() => {
      countdownValue--;
      setCountdown(countdownValue);
      
      if (countdownValue === 0) {
        clearInterval(countdownInterval);
        // Fix: opponent.name aus matchData extrahieren
        const opponentName = matchData.opponent?.name || 'Anonymous';
        console.log('Starting game with opponent:', opponentName);
        onMatchFound({
          gameId: matchData.gameId,
          opponentName: opponentName,
          yourSymbol: matchData.yourSymbol,
          opponentSymbol: matchData.yourSymbol === 'X' ? 'O' : 'X'
        });
      }
    }, 1000);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Countdown screen (after confirmation)
  if (countdown !== null) {
    return (
      <div className="matchmaking-container">
        <div className="matchmaking-card match-found">
          <div className="match-found-icon">🎉</div>
          <h2>Gegner gefunden!</h2>
          <p className="match-countdown">Spiel startet in {countdown}...</p>
        </div>
      </div>
    );
  }

  // Waiting for name confirmation (match found but need to confirm name)
  if (waitingForConfirmation && matchData) {
    return (
      <div className="matchmaking-container">
        <div className="matchmaking-card match-found">
          <div className="match-found-icon">🎉</div>
          <h2>Gegner gefunden!</h2>
          <p className="opponent-name">Gegen: {matchData.opponent.name}</p>
          
          <div className="name-confirmation">
            <p className="confirmation-text">
              Spielst du als: <strong>{playerName}</strong>?
            </p>
            <div className="confirmation-buttons">
              <button className="confirm-button" onClick={handleConfirmName}>
                ✓ Bestätigen
              </button>
              <button className="cancel-button" onClick={handleCancel}>
                ✕ Abbrechen
              </button>
            </div>
            <p className="hint-text">
              💡 Dein Gegner wartet! Falls du deinen Namen ändern möchtest, drücke "Abbrechen" und setze deinen Alias neu.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Searching screen
  return (
    <div className="matchmaking-container">
      <div className="matchmaking-card">
        <h2>Online Matchmaking</h2>
        
        <div className="player-info">
          <span className="player-name">{playerName}</span>
        </div>

        <div className="searching-animation">
          <div className="spinner">
            <div className="dot dot-1"></div>
            <div className="dot dot-2"></div>
            <div className="dot dot-3"></div>
          </div>
          <p className="searching-text">Suche Gegner...</p>
        </div>

        <div className="matchmaking-stats">
          <div className="stat">
            <span className="stat-icon">👥</span>
            <span className="stat-value">{playersOnline}</span>
            <span className="stat-label">Spieler in Warteschlange</span>
          </div>
          <div className="stat">
            <span className="stat-icon">⏱️</span>
            <span className="stat-value">{formatTime(waitingTime)}</span>
            <span className="stat-label">Wartezeit</span>
          </div>
        </div>

        <button className="cancel-button" onClick={handleCancel}>
          Abbrechen
        </button>

        <div className="matchmaking-tips">
          <p className="tip">💡 Tipp: Die meisten Matches werden in unter 10 Sekunden gefunden!</p>
        </div>
      </div>
    </div>
  );
};

export default Matchmaking;
