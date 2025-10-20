# Decision Architecture: Connect Four Transformation

**Projekt:** testme → Connect Four
**Datum:** 20. Oktober 2025
**Version:** 1.0
**Autor:** BMad Architect Agent

---

## Executive Summary

Dieses Dokument definiert alle kritischen technischen Entscheidungen für die Transformation der Tic-Tac-Toe-Anwendung zu Connect Four. Es dient als **Konsistenz-Vertrag** für alle AI-Agenten während der Implementation und stellt sicher, dass alle Änderungen kohärent und kompatibel sind.

**Transformation Scope:**
- Bestehende Codebase: React 19, TypeScript, Socket.IO, Express
- Ziel: Connect Four (7×6 Grid, Gravity, 4-in-a-row)
- Alle Features beibehalten: 3 Spielmodi, Chat, Sounds, Themes, Stats

---

## Decision Summary

| Category | Decision | Rationale | Affects |
|----------|----------|-----------|---------|
| **Refactoring Strategy** | Hybrid (Core First, Features Later) | Balance Geschwindigkeit/Risiko | Alle Epics |
| **Board Data Structure** | Flat Array (42) + Helper Functions | Socket.IO Kompatibilität, klare API | Frontend + Backend |
| **Win Detection** | Optimized 4-Direction Scan | Performance bei 42 Zellen | `gameLogic.ts`, `Game.ts` |
| **AI Algorithm** | Minimax mit Alpha-Beta + Heuristik | Hard Mode braucht Lookahead | `aiPlayer.ts` |
| **Component Strategy** | Refactor `Board` & `Cell`, Keep Rest | Minimale UI-Änderungen | `components/` |
| **Animation** | CSS Transitions für Gravity Drop | Smooth UX ohne Library | `Cell.css` |
| **Backend State** | Erweitere `Game` Klasse | Bestehende Architektur nutzen | `backend/src/game/` |

---

## Project Structure

```
testme/
├── src/                           # Frontend (React)
│   ├── components/
│   │   ├── Board.tsx              # ✏️ MAJOR REFACTOR (7×6 Grid)
│   │   ├── Cell.tsx               # ✏️ UPDATE (Animation)
│   │   ├── Game.tsx               # ✏️ MINOR (Props)
│   │   ├── GameStatus.tsx         # ✅ UNVERÄNDERT
│   │   ├── DifficultySelector.tsx # ✅ UNVERÄNDERT
│   │   ├── Matchmaking.tsx        # ✅ UNVERÄNDERT
│   │   └── QuickChat/             # ✅ UNVERÄNDERT
│   ├── hooks/
│   │   ├── useGameLogic.ts        # 🔥 COMPLETE REWRITE (C4 Logic)
│   │   └── useOnlineGame.ts       # ✏️ MINOR (Board Size)
│   ├── utils/
│   │   ├── gameLogic.ts           # 🔥 COMPLETE REWRITE (Win Detection)
│   │   ├── aiPlayer.ts            # 🔥 COMPLETE REWRITE (Minimax C4)
│   │   └── sounds.ts              # ✅ UNVERÄNDERT
│   └── types/
│       └── game.types.ts          # ✏️ UPDATE (Constants)
├── backend/
│   └── src/
│       ├── game/
│       │   ├── Game.ts            # 🔥 COMPLETE REWRITE (C4 Logic)
│       │   └── GameManager.ts     # ✅ UNVERÄNDERT
│       ├── matchmaking/           # ✅ UNVERÄNDERT
│       └── socket/
│           └── handlers.ts        # ✏️ MINOR (Board Size)
└── docs/                          # ✅ UPDATE nach Completion
```

**Legende:**
- 🔥 **COMPLETE REWRITE:** Neue Implementierung von Grund auf
- ✏️ **MAJOR/MINOR REFACTOR:** Signifikante/Kleine Änderungen
- ✅ **UNVERÄNDERT:** Keine Änderungen erforderlich

---

## Epic to Architecture Mapping

### Epic 1: Core Game Logic (Frontend)
**Files:** `src/utils/gameLogic.ts`, `src/types/game.types.ts`

**Changes:**
- Board-Konstanten: `ROWS = 6`, `COLS = 7`, `CELLS = 42`
- Helper Functions: `getColumnCells()`, `getLowestFreeRow()`, `isCellEmpty()`
- Win Detection: `checkWinner()` mit 4-Direction Scan (horizontal, vertical, diagonal /, diagonal \)

### Epic 2: Board UI Transformation
**Files:** `src/components/Board.tsx`, `src/components/Cell.tsx`, `src/components/Board.css`

**Changes:**
- Board Layout: CSS Grid `grid-template-columns: repeat(7, 1fr)` + `grid-template-rows: repeat(6, 1fr)`
- Click Handler: Column-based statt Cell-based
- Cell Animation: `@keyframes dropAnimation` für Gravity-Effekt
- Win Highlighting: 4-Cell-Highlight statt 3

### Epic 3: AI Algorithm Adaptation
**Files:** `src/utils/aiPlayer.ts`

**Strategy per Difficulty:**
- **Easy:** `Math.random()` auf `getValidColumns()`
- **Medium:** Defensive Block + Offensive Win-Search (2-Ply Lookahead)
- **Hard:** Minimax mit Alpha-Beta Pruning, Depth 4-6, Heuristik (Center-Control, Threats)

### Epic 4: Backend Game Logic
**Files:** `backend/src/game/Game.ts`

**Changes:**
- Board State: `private board: (string | null)[] = Array(42).fill(null)`
- Move Validation: `isValidMove(col)` prüft `column.length < 6`
- makeMove: Berechnet Row via Gravity, setzt `board[row * 7 + col]`
- checkWinner: Identische Logik zu Frontend (4-Direction Scan)

### Epic 5: Online Mode Integration
**Files:** `backend/src/socket/handlers.ts`, `src/hooks/useOnlineGame.ts`

**Changes:**
- Event Payloads: `{ gameId, columnIndex }` statt `cellIndex`
- State Sync: Board mit 42 Elementen
- Validation: Server validiert Column-basiert

---

## Technology Stack Details

### Frontend
| Technology | Version | Usage |
|------------|---------|-------|
| React | 19.1.1 | UI Framework |
| TypeScript | ~5.9.3 | Type Safety |
| Vite | 7.1.7 | Build Tool |
| Socket.IO Client | 4.8.1 | Real-time Communication |

### Backend
| Technology | Version | Usage |
|------------|---------|-------|
| Node.js | ≥20.0.0 | Runtime |
| Express | 4.21.2 | HTTP Server |
| Socket.IO | 4.8.1 | WebSocket Server |
| TypeScript | ^5.7.2 | Type Safety |

**Keine Änderungen am Tech-Stack.**

---

## Implementation Patterns

### Pattern 1: Board Data Structure

**Entscheidung:** Flat Array (42 Elemente) mit Helper Functions

```typescript
// types/game.types.ts
export const ROWS = 6;
export const COLS = 7;
export const CELLS = ROWS * COLS; // 42
export type BoardState = (Player | null)[];

// utils/gameLogic.ts
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
  return null; // Column full
};

export const makeMove = (board: BoardState, col: number, player: Player): BoardState | null => {
  const row = getLowestFreeRow(board, col);
  if (row === null) return null; // Invalid move
  
  const newBoard = [...board];
  newBoard[row * COLS + col] = player;
  return newBoard;
};
```

### Pattern 2: Win Detection Algorithm

**Entscheidung:** Optimized 4-Direction Scan

```typescript
// utils/gameLogic.ts
export const checkWinner = (board: BoardState): { winner: Player | null; line: number[] | null } => {
  const directions = [
    { dr: 0, dc: 1 },  // Horizontal
    { dr: 1, dc: 0 },  // Vertical
    { dr: 1, dc: 1 },  // Diagonal /
    { dr: 1, dc: -1 }, // Diagonal \
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

        if (count === 4) return { winner: player, line };
      }
    }
  }

  // Check for draw
  const isFull = board.every(cell => cell !== null);
  return { winner: null, line: null }; // Draw if full, ongoing if not
};
```

### Pattern 3: AI Minimax (Hard Mode)

**Entscheidung:** Minimax mit Alpha-Beta Pruning + Heuristik

```typescript
// utils/aiPlayer.ts
interface MoveScore {
  col: number;
  score: number;
}

const HEURISTIC_WEIGHTS = {
  CENTER_BONUS: 3,
  THREE_IN_ROW: 5,
  TWO_IN_ROW: 2,
  WIN: 1000,
  BLOCK_WIN: 100,
};

const evaluateBoard = (board: BoardState, player: Player): number => {
  // Center column control
  let score = 0;
  const centerCol = Math.floor(COLS / 2);
  const centerCells = getColumnCells(board, centerCol);
  score += centerCells.filter(c => c === player).length * HEURISTIC_WEIGHTS.CENTER_BONUS;

  // Check for threats and opportunities
  // ... (evaluate all 4 directions for 2-in-row, 3-in-row patterns)
  
  return score;
};

const minimax = (
  board: BoardState,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizing: boolean,
  player: Player
): number => {
  const { winner } = checkWinner(board);
  
  if (winner === player) return HEURISTIC_WEIGHTS.WIN - depth; // Prefer faster wins
  if (winner && winner !== player) return -HEURISTIC_WEIGHTS.WIN + depth;
  if (depth === 0 || board.every(c => c !== null)) return evaluateBoard(board, player);

  const validCols = getValidColumns(board);
  
  if (isMaximizing) {
    let maxScore = -Infinity;
    for (const col of validCols) {
      const newBoard = makeMove(board, col, player);
      if (!newBoard) continue;
      const score = minimax(newBoard, depth - 1, alpha, beta, false, player);
      maxScore = Math.max(maxScore, score);
      alpha = Math.max(alpha, score);
      if (beta <= alpha) break; // Alpha-Beta Pruning
    }
    return maxScore;
  } else {
    let minScore = Infinity;
    const opponent = player === 'X' ? 'O' : 'X';
    for (const col of validCols) {
      const newBoard = makeMove(board, col, opponent);
      if (!newBoard) continue;
      const score = minimax(newBoard, depth - 1, alpha, beta, true, player);
      minScore = Math.min(minScore, score);
      beta = Math.min(beta, score);
      if (beta <= alpha) break;
    }
    return minScore;
  }
};

export const getHardAIMove = (board: BoardState, player: Player): number => {
  const depth = 6; // Adjust based on performance
  let bestMove: MoveScore = { col: -1, score: -Infinity };

  for (const col of getValidColumns(board)) {
    const newBoard = makeMove(board, col, player);
    if (!newBoard) continue;
    const score = minimax(newBoard, depth - 1, -Infinity, Infinity, false, player);
    if (score > bestMove.score) {
      bestMove = { col, score };
    }
  }

  return bestMove.col;
};
```

### Pattern 4: Gravity Animation

**Entscheidung:** CSS Transitions ohne externe Library

```css
/* Cell.css */
.cell {
  /* ... existing styles ... */
  position: relative;
  overflow: hidden;
}

.cell-content {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.cell-content.dropping {
  animation: dropAnimation 0.5s ease-out;
}

@keyframes dropAnimation {
  0% {
    transform: translateY(-600%);
  }
  60% {
    transform: translateY(10%);
  }
  80% {
    transform: translateY(-5%);
  }
  100% {
    transform: translateY(0);
  }
}
```

### Pattern 5: Component Click Handler

**Entscheidung:** Column-based statt Cell-based

```typescript
// Board.tsx
const Board: React.FC<BoardProps> = ({ board, onColumnClick, disabled }) => {
  const handleCellClick = (index: number) => {
    if (disabled) return;
    const col = index % COLS;
    onColumnClick(col); // Pass column, not cell index
  };

  return (
    <div className="board" style={{ 
      gridTemplateColumns: `repeat(${COLS}, 1fr)`,
      gridTemplateRows: `repeat(${ROWS}, 1fr)` 
    }}>
      {board.map((cell, index) => (
        <Cell
          key={index}
          value={cell}
          onClick={() => handleCellClick(index)}
          isWinner={winningLine?.includes(index)}
        />
      ))}
    </div>
  );
};
```

---

## Consistency Rules

### Naming Conventions
- **Constants:** `UPPER_SNAKE_CASE` (z.B. `ROWS`, `COLS`)
- **Functions:** `camelCase` (z.B. `getLowestFreeRow`)
- **Types:** `PascalCase` (z.B. `BoardState`, `Player`)
- **Components:** `PascalCase` (z.B. `Board`, `Cell`)

### File Organization
- **Game Logic:** `src/utils/gameLogic.ts` (pure functions)
- **AI Logic:** `src/utils/aiPlayer.ts` (separate from game logic)
- **Type Definitions:** `src/types/game.types.ts`
- **Backend Logic:** `backend/src/game/Game.ts` (mirrors frontend)

### Error Handling
```typescript
// Invalid column moves return null
const result = makeMove(board, col, player);
if (result === null) {
  console.error(`Invalid move: column ${col} is full`);
  return;
}
```

### Testing Strategy
- **Unit Tests:** `gameLogic.ts`, `aiPlayer.ts` (Jest)
- **Integration Tests:** `useGameLogic.ts` (React Testing Library)
- **E2E Tests:** Online Mode (Playwright/Cypress - optional)

---

## Data Architecture

### Frontend State (useGameLogic)
```typescript
interface GameLogicState {
  board: BoardState;           // (Player | null)[] - length 42
  currentPlayer: Player;       // 'X' | 'O'
  winner: Player | null;
  winningLine: number[] | null; // Indices of winning 4 cells
  gameStatus: GameStatus;      // 'playing' | 'win' | 'draw'
  moveHistory: number[];       // Column indices
}
```

### Backend State (Game class)
```typescript
class Game {
  private id: string;
  private players: { [socketId: string]: Player };
  private board: (string | null)[];
  private currentPlayer: Player;
  private status: GameStatus;
  private winner: Player | null;
  private winningLine: number[] | null;
  private moveCount: number;
}
```

### Socket.IO Events
```typescript
// Client → Server
interface MakeMovePayload {
  gameId: string;
  columnIndex: number; // 0-6
}

// Server → Client
interface GameUpdatePayload {
  board: (string | null)[]; // length 42
  currentPlayer: string;
  isYourTurn: boolean;
  status: GameStatus;
  winner: string | null;
  winningLine: number[] | null;
}
```

---

## API Contracts

**Keine Änderungen an Socket.IO-Events erforderlich.**

Bestehende Events bleiben:
- `join-queue`, `confirm-match`, `make-move`, `chat-message`
- `match-found`, `game-start`, `game-update`, `game-over`, `opponent-disconnected`

**Änderung nur in Payloads:**
- `cellIndex` → `columnIndex` in `make-move`
- `board` array: 9 → 42 Elemente

---

## Security Architecture

**Unverändert.**

- CORS Configuration bleibt
- Socket.IO Transport Strategy bleibt
- Server-side Move Validation (essentiell!)

---

## Performance Considerations

### Frontend
- **Board Rendering:** 42 Cells (vs. 9) - React.memo für Cell-Component
- **AI Calculation:** Minimax Depth = 6 kann 200-500ms dauern
  - Lösung: Web Worker für Hard AI (optional)
  - Alternative: Loading Spinner während AI-Zug

### Backend
- **Win Detection:** O(n) wo n = 42 - negligible
- **Game State:** Minimal größer (42 vs 9 array) - kein Problem

---

## Deployment Architecture

**Unverändert.**

- Docker Multi-Stage Build bleibt
- Nginx für Frontend bleibt
- Node.js Backend bleibt
- Supervisor für beide Prozesse bleibt

---

## Development Environment

**Setup bleibt identisch:**

```bash
# Frontend
npm install
npm run dev

# Backend
cd backend
npm install
npm run dev
```

**Neue Empfehlung:**
- Unit Tests für `gameLogic.ts` VOR Implementation
- AI Tests mit bekannten Positionen

---

## Architecture Decision Records (ADRs)

### ADR-001: Hybrid Refactoring Strategy
**Status:** Accepted
**Decision:** Core Game Logic komplett neu, Features schrittweise migrieren
**Rationale:** Balance zwischen Geschwindigkeit und Risiko
**Consequences:** ~10-12 Stories, klare Epic-Grenzen

### ADR-002: Flat Array Board Structure
**Status:** Accepted
**Decision:** `(Player | null)[]` mit Helper Functions
**Rationale:** Socket.IO Kompatibilität, minimale Breaking Changes
**Consequences:** Helper Functions für Column-Logik erforderlich

### ADR-003: Optimized Win Detection
**Status:** Accepted
**Decision:** 4-Direction Scan statt Pattern-Matching
**Rationale:** Performance, Einfachheit
**Consequences:** Code ist länger, aber klarer

### ADR-004: Minimax für Hard AI
**Status:** Accepted
**Decision:** Alpha-Beta Pruning + Heuristik
**Rationale:** Connect Four braucht Lookahead für Intelligenz
**Consequences:** Performance-Overhead (200-500ms)

### ADR-005: CSS Animation für Gravity
**Status:** Accepted
**Decision:** Keine Animation-Library, pure CSS
**Rationale:** Lightweight, ausreichend für Effekt
**Consequences:** Custom Keyframe-Animation erforderlich

---

## Next Steps

1. **Solutioning Gate Check:** Validiere dieses Dokument gegen GDD
2. **Epic Breakdown:** Erstelle detaillierte User Stories (8-12)
3. **Story Sequencing:** Priorisiere nach Abhängigkeiten
4. **Implementation:** Story-by-Story mit Test-First Approach

---

_Generiert durch BMad Architecture Workflow (YOLO Mode) v1.0_
