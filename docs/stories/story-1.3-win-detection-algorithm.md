# Story 1.3: Win Detection Algorithm

**Epic:** 1 (Core Game Logic)
**Status:** TODO
**Schätzung:** 5 Punkte
**Abhängigkeit:** Story 1.2

## Beschreibung
Als Spieler möchte ich, dass das Spiel erkennt, wenn ich vier meiner Steine in einer Reihe (horizontal, vertikal oder diagonal) platziert habe, damit ich das Spiel gewinnen kann.

## Acceptance Criteria
- [ ] In `src/utils/gameLogic.ts` existiert eine Funktion `checkWin(board: BoardState, player: Player): boolean`.
- [ ] Die Funktion `checkWin` erkennt korrekt horizontale Gewinne (4 Steine nebeneinander).
- [ ] Die Funktion `checkWin` erkennt korrekt vertikale Gewinne (4 Steine übereinander).
- [ ] Die Funktion `checkWin` erkennt korrekt diagonale Gewinne (sowohl aufsteigend als auch absteigend).
- [ ] Die Funktion gibt `false` zurück, wenn kein Gewinnzustand für den angegebenen Spieler vorliegt.
- [ ] Die Funktion ist performant und nutzt den "Optimized 4-Direction Scan" aus der Architektur.
- [ ] Die Funktion ist durch umfassende Unit-Tests für alle Gewinn- und Nicht-Gewinn-Szenarien abgedeckt.

## Technische Notizen
- **Datei:** `src/utils/gameLogic.ts`
- **Architektur-Referenz:** Decision Architecture - Algorithm 1 (Win Detection)
- Die Implementierung sollte beim zuletzt gesetzten Stein beginnen und von dort aus in alle 8 Richtungen (bzw. 4 Achsen) prüfen.
