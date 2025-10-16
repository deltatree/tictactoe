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
}

const Matchmaking: React.FC<MatchmakingProps> = ({ playerName, onMatchFound, onCancel }) => {
  const { emit, on, off, isConnected } = useWebSocket();
  const [playersOnline, setPlayersOnline] = useState<number>(0);
  const [waitingTime, setWaitingTime] = useState<number>(0);
  const [countdown, setCountdown] = useState<number | null>(null);

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
      
      // Start countdown
      let countdownValue = 3;
      setCountdown(countdownValue);
      
      const countdownInterval = setInterval(() => {
        countdownValue--;
        setCountdown(countdownValue);
        
        if (countdownValue === 0) {
          clearInterval(countdownInterval);
          onMatchFound({
            gameId: data.gameId,
            opponentName: data.opponent.name,
            yourSymbol: data.yourSymbol,
            opponentSymbol: data.yourSymbol === 'X' ? 'O' : 'X'
          });
        }
      }, 1000);
    };

    // Listen for queue stats updates
    const handleQueueStats = (data: { playersInQueue: number }) => {
      console.log('Matchmaking: Queue stats', data);
      setPlayersOnline(data.playersInQueue);
    };

    on('game-found', handleGameFound);
    on('queue-stats', handleQueueStats);

    // Request initial stats
    emit('get-queue-stats');

    // Cleanup
    return () => {
      console.log('Matchmaking: Leaving queue...');
      emit('leave-queue');
      off('game-found', handleGameFound);
      off('queue-stats', handleQueueStats);
    };
  }, [isConnected, emit, on, off, playerName, onMatchFound]);

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

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

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
