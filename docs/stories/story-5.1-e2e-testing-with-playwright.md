# Story 5.1: E2E Testing with Playwright

**Epic:** 5 (Testing & Deployment)
**Status:** TODO
**Schätzung:** 5 Punkte
**Abhängigkeit:** Story 1.5, Story 3.1

## Beschreibung
Als Entwickler möchte ich die bestehenden E2E-Tests (Playwright) an das neue Connect Four Spiel anpassen, um die Kernfunktionalitäten abzusichern.

## Acceptance Criteria
- [ ] Die Playwright-Tests in `tests/e2e` werden aktualisiert oder neu geschrieben.
- [ ] Ein Testfall simuliert ein komplettes Spiel "Player vs AI (Easy)".
- [ ] Der Test verifiziert, dass ein Spieler einen Zug machen kann, indem er auf eine Spalte klickt.
- [ ] Der Test verifiziert, dass der Spielstatus (Gewinn, Unentschieden) korrekt am Ende des Spiels angezeigt wird.
- [ ] Der Test verifiziert, dass der "New Game" Button das Spiel zurücksetzt.
- [ ] Die CI-Pipeline (GitHub Actions) führt die Playwright-Tests erfolgreich aus.

## Technische Notizen
- **Dateien:** `tests/e2e/game.spec.ts` (oder ähnlich)
- **Architektur-Referenz:** Decision Architecture - Testing Strategy
- Die Tests müssen an die neue DOM-Struktur (7x6 Grid) und die geänderte Spiel-Logik angepasst werden.
