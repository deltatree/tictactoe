# Story 1.2: Board Helper Functions

**Epic:** 1 (Core Game Logic)
**Status:** TODO
**Schätzung:** 2 Punkte
**Abhängigkeit:** Story 1.1

## Beschreibung
Als Entwickler möchte ich eine Reihe von Helper-Funktionen implementieren, die die Interaktion mit der Flat-Array-Board-Struktur für Connect Four abstrahieren und vereinfachen.

## Acceptance Criteria
- [ ] In `src/utils/gameLogic.ts` existiert eine Funktion `createEmptyBoard()`, die ein Array der Länge 42 mit `null` zurückgibt.
- [ ] Es gibt eine Funktion `getLowestFreeRow(board: BoardState, col: number): number | null`, die die unterste freie Reihe für eine gegebene Spalte zurückgibt oder `null`, wenn die Spalte voll ist.
- [ ] Es gibt eine Funktion `makeMove(board: BoardState, col: number, player: Player): BoardState | null`, die einen neuen Board-Zustand zurückgibt oder `null` bei einem ungültigen Zug.
- [ ] Alle Helper-Funktionen sind mit Unit-Tests abgedeckt.

## Technische Notizen
- **Datei:** `src/utils/gameLogic.ts`
- **Architektur-Referenz:** Decision Architecture - Pattern 1 (Board Data Structure)
- Diese Funktionen sind die Basis für die gesamte Spiellogik und die AI.
