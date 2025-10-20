# Story 3.2: AI Player (Hard) - Minimax Algorithm

**Epic:** 3 (AI Opponent)
**Status:** TODO
**Schätzung:** 8 Punkte
**Abhängigkeit:** Story 1.3, Story 3.1

## Beschreibung
Als Spieler möchte ich gegen eine "schwere" KI spielen können, die strategisch sinnvolle Züge macht und eine echte Herausforderung darstellt.

## Acceptance Criteria
- [ ] In `src/utils/aiPlayer.ts` gibt es eine Funktion `findBestMove_Hard(board: BoardState, player: Player): number`.
- [ ] Die Funktion implementiert den Minimax-Algorithmus mit Alpha-Beta-Pruning, wie in der Architektur beschrieben.
- [ ] Eine Heuristik-Funktion `evaluateBoard(board: BoardState, player: Player): number` wird erstellt, um Board-Zustände zu bewerten.
- [ ] Die Heuristik bewertet Gewinnchancen (3er-Reihen, 2er-Reihen) für beide Spieler und die Kontrolle über die mittlere Spalte.
- [ ] Die Suchtiefe des Algorithmus ist konfigurierbar (z.B. 4-6 Züge vorausschauen).
- [ ] Die KI kann sowohl offensive (eigene Gewinnchancen nutzen) als auch defensive (gegnerische Gewinnchancen blockieren) Züge machen.
- [ ] Die Performance ist akzeptabel (Zugberechnung < 1-2 Sekunden).

## Technische Notizen
- **Datei:** `src/utils/aiPlayer.ts`
- **Architektur-Referenz:** Decision Architecture - Algorithm 2 (AI - Minimax)
- Dies ist die komplexeste Logik-Komponente des Spiels. Eine sorgfältige Implementierung und Testung der Heuristik ist entscheidend.
