import type { Cell as CellType } from '../types/game.types';
import { Cell } from './Cell';
import './Board.css';

interface BoardProps {
  board: CellType[];
  winningLine: number[] | null;
  onCellClick: (index: number) => void;
}

export function Board({ board, winningLine, onCellClick }: BoardProps) {
  return (
    <div className="board">
      {board.map((cell, index) => (
        <Cell
          key={index}
          value={cell}
          onClick={() => onCellClick(index)}
          isWinningCell={winningLine?.includes(index) || false}
        />
      ))}
    </div>
  );
}
