# Story 4.1: Game Statistics Refactoring

**Epic:** 4 (Existing Feature Parity)
**Status:** TODO
**Schätzung:** 2 Punkte
**Abhängigkeit:** Story 1.5

## Beschreibung
Als Spieler möchte ich, dass meine Spielstatistiken (Siege, Niederlagen, Unentschieden) für Connect Four korrekt gezählt und angezeigt werden, genau wie zuvor bei Tic-Tac-Toe.

## Acceptance Criteria
- [ ] Das `Statistics.tsx` Component zeigt die Statistiken für das Connect Four Spiel an.
- [ ] Der `useGameLogic` Hook (oder ein übergeordneter Hook) aktualisiert die Statistiken nach jedem Spielende (Sieg, Niederlage, Unentschieden).
- [ ] Die Statistiken werden weiterhin im `localStorage` gespeichert, um sie über mehrere Sitzungen hinweg zu erhalten.
- [ ] Die Logik zur Speicherung und zum Abruf der Statistiken ist an die neuen Spielmodi (z.B. "Player vs AI (Hard)") angepasst.
- [ ] Der "Reset Statistics" Button funktioniert wie erwartet.

## Technische Notizen
- **Dateien:** `src/components/Statistics.tsx`, `src/hooks/useGameLogic.ts`
- **Architektur-Referenz:** Decision Architecture - Feature Parity
- Dies ist primär eine Anpassung der bestehenden Logik an die neuen Spielzustände von Connect Four.
