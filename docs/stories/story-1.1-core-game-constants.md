# Story 1.1: Core Game Constants & Types

**Epic:** 1 (Core Game Logic)
**Status:** TODO
**Schätzung:** 1 Punkt

## Beschreibung
Als Entwickler möchte ich die zentralen Spielkonstanten und Typen von Tic-Tac-Toe auf Connect Four umstellen, um eine solide Grundlage für die neue Spiellogik zu schaffen.

## Acceptance Criteria
- [ ] In `src/types/game.types.ts` sind die Konstanten `ROWS`, `COLS`, und `CELLS` definiert.
  - `ROWS` = 6
  - `COLS` = 7
  - `CELLS` = 42
- [ ] Der Typ `BoardState` ist weiterhin `(Player | null)[]`, repräsentiert aber nun ein Array der Länge 42.
- [ ] Alle bestehenden Typen (`Player`, `GameStatus`, `GameMode`) bleiben unverändert.
- [ ] Die Änderungen führen zu keinen Build-Fehlern (obwohl die Spiellogik noch nicht funktioniert).

## Technische Notizen
- **Datei:** `src/types/game.types.ts`
- Dies ist eine grundlegende Änderung, die viele andere Teile des Codes beeinflussen wird.
- Die `checkWinner` Funktion in `gameLogic.ts` wird temporär fehlschlagen, was erwartet wird.
