import type { Difficulty } from '../types/game.types';
import './DifficultySelector.css';

interface DifficultySelectorProps {
  currentDifficulty: Difficulty;
  onDifficultyChange: (difficulty: Difficulty) => void;
  disabled: boolean;
}

export function DifficultySelector({
  currentDifficulty,
  onDifficultyChange,
  disabled,
}: DifficultySelectorProps) {
  const difficulties: { value: Difficulty; label: string; emoji: string }[] = [
    { value: 'easy', label: 'Leicht', emoji: '😊' },
    { value: 'medium', label: 'Mittel', emoji: '🤔' },
    { value: 'hard', label: 'Schwer', emoji: '😈' },
  ];

  return (
    <div className="difficulty-selector">
      <h3>Schwierigkeitsgrad:</h3>
      <div className="difficulty-buttons">
        {difficulties.map((diff) => (
          <button
            key={diff.value}
            className={`difficulty-button ${
              currentDifficulty === diff.value ? 'active' : ''
            }`}
            onClick={() => onDifficultyChange(diff.value)}
            disabled={disabled}
          >
            <span className="emoji">{diff.emoji}</span>
            <span className="label">{diff.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
