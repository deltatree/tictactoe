# Story 1.5: Game State Management Refactoring

**Epic:** 1 (Core Game Logic)
**Status:** TODO
**Schätzung:** 5 Punkte
**Abhängigkeit:** Story 1.2, Story 1.3

## Beschreibung
Als Entwickler möchte ich den `useGameLogic` Hook anpassen, um den Spielzustand für Connect Four zu verwalten, einschließlich des neuen Boards, des aktuellen Spielers und des Spielstatus (läuft, gewonnen, unentschieden).

## Acceptance Criteria
- [ ] Der `useGameLogic` Hook in `src/hooks/useGameLogic.ts` initialisiert den Zustand mit einem leeren 7x6 Board.
- [ ] Die `handleCellClick` Funktion (oder eine neue `handleColumnClick` Funktion) nutzt die `makeMove` und `checkWin` Helper aus `gameLogic.ts`.
- [ ] Der Zustand für `currentPlayer`, `board`, `winner` und `isDraw` wird korrekt aktualisiert.
- [ ] Die Reset-Funktion setzt das Spiel korrekt in den Anfangszustand zurück.
- [ ] Der Hook ist an die neuen Gegebenheiten von Connect Four angepasst (z.B. Unentschieden nach 42 Zügen).
- [ ] Die serverseitige Logik in `backend/src/game/Game.ts` wird ebenfalls angepasst, um den Connect Four Zustand zu spiegeln.

## Technische Notizen
- **Dateien:** `src/hooks/useGameLogic.ts`, `src/components/Game.tsx`, `backend/src/game/Game.ts`
- **Architektur-Referenz:** Decision Architecture - Pattern 2 (State Management)
- Dies ist eine zentrale Story, die die Frontend-Logik mit der neuen Core-Logik verbindet.
