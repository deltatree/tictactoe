import React from 'react';
import './VolumeControl.css';

interface VolumeControlProps {
  volume: number;
  isMuted: boolean;
  onVolumeChange: (volume: number) => void;
  onMuteToggle: () => void;
}

const VolumeControl: React.FC<VolumeControlProps> = ({
  volume,
  isMuted,
  onVolumeChange,
  onMuteToggle,
}) => {
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value, 10);
    onVolumeChange(newVolume);
  };

  const getVolumeIcon = () => {
    if (isMuted || volume === 0) {
      return '🔇';
    } else if (volume < 33) {
      return '🔈';
    } else if (volume < 66) {
      return '🔉';
    } else {
      return '🔊';
    }
  };

  return (
    <div className="volume-control">
      <button
        className="mute-button"
        onClick={onMuteToggle}
        aria-label={isMuted ? 'Unmute' : 'Mute'}
        title={isMuted ? 'Unmute' : 'Mute'}
      >
        {getVolumeIcon()}
      </button>
      
      <div className="volume-slider-container">
        <input
          type="range"
          min="0"
          max="100"
          value={isMuted ? 0 : volume}
          onChange={handleVolumeChange}
          className="volume-slider"
          aria-label="Volume"
          disabled={isMuted}
        />
        <span className="volume-label">{isMuted ? 0 : volume}%</span>
      </div>
    </div>
  );
};

export default VolumeControl;
