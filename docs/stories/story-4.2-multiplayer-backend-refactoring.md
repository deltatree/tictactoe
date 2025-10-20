# Story 4.2: Multiplayer Backend Refactoring

**Epic:** 4 (Existing Feature Parity)
**Status:** TODO
**Schätzung:** 5 Punkte
**Abhängigkeit:** Story 1.5

## Beschreibung
Als Entwickler möchte ich das Multiplayer-Backend (Node.js, Socket.IO) an die Spiellogik von Connect Four anpassen, damit zwei Spieler online gegeneinander spielen können.

## Acceptance Criteria
- [ ] Der Socket.IO Server in `backend/src/server.ts` und die zugehörige Spiellogik in `backend/src/game/Game.ts` sind auf Connect Four umgestellt.
- [ ] Der Server validiert Züge basierend auf der Connect Four Logik (z.B. ist die Spalte voll?).
- [ ] Der Server erkennt Gewinnzustände und Unentschieden korrekt und informiert die Clients.
- [ ] Die Events (`playerMove`, `gameState`, `gameOver`, etc.) werden mit dem neuen Board-Format und Spielzustand gesendet.
- [ ] Die Raum-Logik (Erstellen, Beitreten) bleibt unverändert.
- [ ] Das System kann weiterhin mehrere parallele Spiele verwalten.

## Technische Notizen
- **Dateien:** `backend/src/server.ts`, `backend/src/game/Game.ts`, `backend/src/game/Player.ts`
- **Architektur-Referenz:** Decision Architecture - Feature Parity (Multiplayer)
- Dies ist eine reine Backend-Anpassung. Die Frontend-Anpassung für Multiplayer erfolgt in einer separaten Story.
