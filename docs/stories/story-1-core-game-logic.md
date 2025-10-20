# Story 1: Core Game Logic & Constants

**Epic:** Epic 1 - Core Game Logic (Frontend)
**Priority:** P0 (Blocker)
**Story Points:** 5
**Status:** TODO

---

## User Story

**As a** developer
**I want to** implement the core Connect Four game logic with 7×6 board structure
**So that** the game can correctly manage board state, validate moves, and detect wins

---

## Acceptance Criteria

### 1. Board Structure
- [ ] Define constants: `ROWS = 6`, `COLS = 7`, `CELLS = 42`
- [ ] Create `BoardState` type as `(Player | null)[]` with length 42
- [ ] Implement `createEmptyBoard()` returning Array(42).fill(null)

### 2. Helper Functions
- [ ] Implement `getColumnCells(board, col)` returning array of cells in column
- [ ] Implement `getLowestFreeRow(board, col)` returning lowest empty row or null
- [ ] Implement `getValidColumns(board)` returning array of non-full column indices
- [ ] Implement `makeMove(board, col, player)` returning new board or null if invalid

### 3. Win Detection Algorithm
- [ ] Implement `checkWinner(board)` with 4-direction scan:
  - Horizontal (left-to-right)
  - Vertical (bottom-to-top)
  - Diagonal / (bottom-left to top-right)
  - Diagonal \ (top-left to bottom-right)
- [ ] Return `{ winner: Player | null, line: number[] | null }`
- [ ] Detect draw condition (board full, no winner)

### 4. Unit Tests
- [ ] Test `getLowestFreeRow()` with empty, partial, full columns
- [ ] Test `makeMove()` with valid and invalid moves
- [ ] Test `checkWinner()` with all 4 win directions
- [ ] Test draw detection
- [ ] Test edge cases (full board, first move, last move)

---

## Technical Notes

**Files to Create/Modify:**
- `src/types/game.types.ts` - Add constants (ROWS, COLS, CELLS)
- `src/utils/gameLogic.ts` - Implement all helper functions

**Implementation Pattern:**
```typescript
// Flat array indexing: index = row * COLS + col
// Row 0 = bottom, Row 5 = top (gravity direction)
```

**Performance:**
- Win detection: O(ROWS × COLS × 4 directions) = O(168) per check
- Should complete in < 1ms

---

## Dependencies

**Blocks:**
- Story 2 (Board UI)
- Story 3 (AI)
- Story 4 (useGameLogic Hook)

**Depends On:**
- None (foundation story)

---

## Definition of Done

- [ ] All acceptance criteria met
- [ ] Unit tests written and passing
- [ ] Code reviewed
- [ ] No TypeScript errors
- [ ] Documented with JSDoc comments
