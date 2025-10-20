import type { Cell as CellType } from '../types/game.types';
import { ROWS, COLS, coordsToIndex } from '../types/game.types';
import { Cell } from './Cell';
import './Board.css';

interface BoardProps {
  board: CellType[];
  winningLine: number[] | null;
  onColumnClick: (col: number) => void;
  isInteractive: boolean;
}

export function Board({ board, winningLine, onColumnClick, isInteractive }: BoardProps) {
  const handleCellClick = (index: number) => {
    if (!isInteractive) return;
    
    // Calculate column from index
    const col = index % COLS;
    onColumnClick(col);
  };

  return (
    <div className="board connect-four">
      {Array.from({ length: ROWS }, (_, row) => (
        <div key={row} className="board-row">
          {Array.from({ length: COLS }, (_, col) => {
            const index = coordsToIndex(row, col);
            return (
              <Cell
                key={index}
                value={board[index]}
                onClick={() => handleCellClick(index)}
                isWinningCell={winningLine?.includes(index) || false}
                row={row}
                isInteractive={isInteractive}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}
