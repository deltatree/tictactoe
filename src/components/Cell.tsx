import type { Cell as CellType } from '../types/game.types';
import './Cell.css';

interface CellProps {
  value: CellType;
  onClick: () => void;
  isWinningCell: boolean;
  row?: number;
  isInteractive?: boolean;
}

export function Cell({ value, onClick, isWinningCell, row = 0, isInteractive = true }: CellProps) {
  const playerClass = value === 'RED' ? 'player-red' : value === 'YELLOW' ? 'player-yellow' : '';
  const dropClass = value ? `drop-row-${row}` : '';
  
  return (
    <button
      className={`cell connect-four-cell ${isWinningCell ? 'winning' : ''} ${value ? 'occupied' : ''} ${playerClass} ${dropClass}`}
      onClick={onClick}
      disabled={!isInteractive}
      aria-label={value ? `Cell contains ${value}` : 'Empty cell'}
    >
      {value && (
        <span className={`piece ${playerClass}`}>
          <span className="piece-inner"></span>
        </span>
      )}
    </button>
  );
}
