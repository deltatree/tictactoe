# Story C4-2: Board Helper Functions

**Epic:** Epic 1 - Core Game Logic
**Priorität:** P0 (Blocker)
**Geschätzter Aufwand:** 3 Story Points
**Status:** TODO

---

## User Story

Als Entwickler möchte ich Helper-Functions für Board-Operationen implementieren, damit die Gravity-Mechanik und Spalten-Zugriffe sauber abstrahiert sind.

---

## Acceptance Criteria

- [ ] `createEmptyBoard()` erstellt Array mit 42 null-Werten
- [ ] `getColumnCells(board, col)` gibt alle Zellen einer Spalte zurück
- [ ] `getLowestFreeRow(board, col)` findet unterste freie Position oder null
- [ ] `isValidMove(board, col)` prüft ob Spalte nicht voll ist
- [ ] `makeMove(board, col, player)` gibt neues Board mit gesetztem Stein zurück (immutable)
- [ ] Unit Tests für alle Funktionen (100% Coverage)

---

## Technical Details

### Files to Create/Modify
- `src/utils/gameLogic.ts` (neue Helper Functions am Anfang)

### Implementation Pattern
```typescript
export const createEmptyBoard = (): BoardState => Array(CELLS).fill(null);

export const getColumnCells = (board: BoardState, col: number): (Player | null)[] => {
  const cells: (Player | null)[] = [];
  for (let row = 0; row < ROWS; row++) {
    cells.push(board[row * COLS + col]);
  }
  return cells;
};

export const getLowestFreeRow = (board: BoardState, col: number): number | null => {
  for (let row = ROWS - 1; row >= 0; row--) {
    if (board[row * COLS + col] === null) return row;
  }
  return null;
};

export const isValidMove = (board: BoardState, col: number): boolean => {
  return getLowestFreeRow(board, col) !== null;
};

export const makeMove = (
  board: BoardState, 
  col: number, 
  player: Player
): BoardState | null => {
  const row = getLowestFreeRow(board, col);
  if (row === null) return null;
  
  const newBoard = [...board];
  newBoard[row * COLS + col] = player;
  return newBoard;
};
```

### Unit Tests
```typescript
describe('Board Helper Functions', () => {
  test('createEmptyBoard creates 42-cell array', () => {
    const board = createEmptyBoard();
    expect(board.length).toBe(42);
    expect(board.every(cell => cell === null)).toBe(true);
  });

  test('getLowestFreeRow returns bottom row for empty column', () => {
    const board = createEmptyBoard();
    expect(getLowestFreeRow(board, 0)).toBe(5); // Bottom row
  });

  test('makeMove places piece at lowest free position', () => {
    const board = createEmptyBoard();
    const newBoard = makeMove(board, 3, 'X');
    expect(newBoard![5 * 7 + 3]).toBe('X'); // Row 5, Col 3
  });

  test('isValidMove returns false for full column', () => {
    let board = createEmptyBoard();
    for (let i = 0; i < 6; i++) {
      board = makeMove(board!, 0, 'X')!;
    }
    expect(isValidMove(board, 0)).toBe(false);
  });
});
```

---

## Definition of Done

- [ ] Alle Helper Functions implementiert
- [ ] Unit Tests geschrieben und bestanden (100% Coverage)
- [ ] TypeScript Typen korrekt
- [ ] Code committed & reviewed

---

## Abhängigkeiten

**Benötigt:** Story C4-1 (Constants)
**Blockt:** Story C4-3 (Win Detection)

---

_Story erstellt: 20. Oktober 2025_
