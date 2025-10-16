import type { Cell as CellType } from '../types/game.types';
import './Cell.css';

interface CellProps {
  value: CellType;
  onClick: () => void;
  isWinningCell: boolean;
}

export function Cell({ value, onClick, isWinningCell }: CellProps) {
  return (
    <button
      className={`cell ${isWinningCell ? 'winning' : ''} ${value ? 'occupied' : ''}`}
      onClick={onClick}
      aria-label={value ? `Cell contains ${value}` : 'Empty cell'}
    >
      {value && (
        <span className={`symbol ${value === 'X' ? 'player-x' : 'player-o'}`}>
          {value}
        </span>
      )}
    </button>
  );
}
