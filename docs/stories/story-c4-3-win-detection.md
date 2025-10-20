# Story C4-3: Win Detection Algorithm

**Epic:** Epic 1 - Core Game Logic
**Priorität:** P0 (Critical)
**Geschätzter Aufwand:** 5 Story Points
**Status:** TODO

---

## User Story

Als Spieler möchte ich dass das Spiel automatisch erkennt, wenn ich 4 Steine in einer Reihe habe, damit der Gewinner korrekt ermittelt wird.

---

## Acceptance Criteria

- [ ] Horizontal Win Detection (4 in Reihe)
- [ ] Vertical Win Detection (4 in Reihe)
- [ ] Diagonal Win Detection (/ und \)
- [ ] Function gibt `{ winner: Player | null, line: number[] | null }` zurück
- [ ] `line` enthält die 4 Cell-Indices der Gewinn-Kombination
- [ ] Draw Detection wenn Board voll und kein Gewinner
- [ ] Unit Tests für alle 4 Richtungen + Edge Cases
- [ ] Performance: < 10ms pro Check

---

## Technical Details

### Files to Modify
- `src/utils/gameLogic.ts`

### Algorithm (4-Direction Scan)
```typescript
export const checkWinner = (
  board: BoardState
): { winner: Player | null; line: number[] | null } => {
  const directions = [
    { dr: 0, dc: 1 },  // Horizontal →
    { dr: 1, dc: 0 },  // Vertical ↓
    { dr: 1, dc: 1 },  // Diagonal ↘
    { dr: 1, dc: -1 }, // Diagonal ↙
  ];

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const player = board[row * COLS + col];
      if (!player) continue;

      for (const { dr, dc } of directions) {
        const line: number[] = [];
        let count = 0;

        for (let i = 0; i < 4; i++) {
          const r = row + dr * i;
          const c = col + dc * i;
          
          if (r < 0 || r >= ROWS || c < 0 || c >= COLS) break;
          if (board[r * COLS + c] !== player) break;
          
          line.push(r * COLS + c);
          count++;
        }

        if (count === 4) {
          return { winner: player, line };
        }
      }
    }
  }

  return { winner: null, line: null };
};
```

### Unit Tests
```typescript
describe('checkWinner', () => {
  test('detects horizontal win', () => {
    const board = createEmptyBoard();
    // Bottom row: X X X X
    board[35] = board[36] = board[37] = board[38] = 'X';
    const result = checkWinner(board);
    expect(result.winner).toBe('X');
    expect(result.line).toEqual([35, 36, 37, 38]);
  });

  test('detects vertical win', () => {
    const board = createEmptyBoard();
    // Column 0: X X X X (bottom 4)
    board[35] = board[28] = board[21] = board[14] = 'X';
    const result = checkWinner(board);
    expect(result.winner).toBe('X');
    expect(result.line).toHaveLength(4);
  });

  test('detects diagonal win (↘)', () => {
    const board = createEmptyBoard();
    board[14] = board[22] = board[30] = board[38] = 'O';
    const result = checkWinner(board);
    expect(result.winner).toBe('O');
  });

  test('returns null for no winner', () => {
    const board = createEmptyBoard();
    board[0] = 'X';
    board[1] = 'O';
    const result = checkWinner(board);
    expect(result.winner).toBeNull();
  });
});
```

---

## Definition of Done

- [ ] Alle 4 Richtungen implementiert
- [ ] Unit Tests mit 100% Coverage
- [ ] Edge Cases getestet (Ecken, Kanten, volle Spalten)
- [ ] Performance-Test < 10ms
- [ ] Code committed & reviewed

---

## Abhängigkeiten

**Benötigt:** Story C4-2 (Helper Functions)
**Blockt:** Story C4-4 (useGameLogic Refactor)

---

_Story erstellt: 20. Oktober 2025_
