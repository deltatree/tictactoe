# Story C4-1: Core Game Constants & Types

**Epic:** Epic 1 - Core Game Logic
**Priorität:** P0 (Blocker)
**Geschätzter Aufwand:** 2 Story Points
**Status:** TODO

---

## User Story

Als Entwickler möchte ich die grundlegenden Connect-Four-Konstanten und TypeScript-Typen definieren, damit alle nachfolgenden Stories auf einer konsistenten Basis aufbauen können.

---

## Acceptance Criteria

- [ ] `ROWS = 6` Konstante definiert in `game.types.ts`
- [ ] `COLS = 7` Konstante definiert in `game.types.ts`
- [ ] `CELLS = 42` Konstante berechnet und exportiert
- [ ] `BoardState` Type bleibt `(Player | null)[]` aber mit Kommentar "length: CELLS (42)"
- [ ] Bestehende `Player`, `GameStatus`, `GameMode` Types bleiben unverändert
- [ ] Alle Tests für Types laufen durch

---

## Technical Details

### Files to Modify
- `src/types/game.types.ts`

### Implementation
```typescript
// src/types/game.types.ts
export const ROWS = 6;
export const COLS = 7;
export const CELLS = ROWS * COLS; // 42

export type Player = 'X' | 'O';
export type BoardState = (Player | null)[]; // length: CELLS (42)
export type GameStatus = 'waiting' | 'playing' | 'win' | 'draw';
export type GameMode = 'local' | 'ai' | 'online';

export interface GameState {
  board: BoardState;
  currentPlayer: Player;
  winner: Player | null;
  status: GameStatus;
  mode: GameMode;
}
```

---

## Definition of Done

- [ ] Code committed
- [ ] TypeScript compilation erfolgreich
- [ ] Keine Breaking Changes in bestehenden Imports
- [ ] Reviewed durch Senior Dev

---

## Abhängigkeiten

**Blockt:** Story C4-2 (Helper Functions)

---

_Story erstellt: 20. Oktober 2025_
