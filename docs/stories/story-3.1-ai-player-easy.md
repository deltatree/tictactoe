# Story 3.1: AI Player (Easy)

**Epic:** 3 (AI Opponent)
**Status:** TODO
**Schätzung:** 1 Punkt
**Abhängigkeit:** Story 1.5

## Beschreibung
Als Spieler möchte ich gegen eine "leichte" KI spielen können, die zufällige, aber gültige Züge macht.

## Acceptance Criteria
- [ ] In `src/utils/aiPlayer.ts` gibt es eine Funktion `findBestMove_Easy(board: BoardState): number`.
- [ ] Die Funktion wählt eine zufällige Spalte aus.
- [ ] Die Funktion stellt sicher, dass die gewählte Spalte nicht bereits voll ist.
- [ ] Wenn alle Spalten voll sind, gibt die Funktion einen Indikator zurück, dass kein Zug möglich ist (z.B. `null`).
- [ ] Der `useGameLogic` Hook integriert diese Funktion, wenn der Spielmodus "Player vs AI (Easy)" ausgewählt ist.

## Technische Notizen
- **Datei:** `src/utils/aiPlayer.ts`
- **Architektur-Referenz:** Decision Architecture - Algorithm 2 (AI)
- Dies ist die einfachste Form der KI und dient als Grundlage für die komplexeren Stufen.
