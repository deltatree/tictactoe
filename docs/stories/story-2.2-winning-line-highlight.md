# Story 2.2: Winning Line Highlight

**Epic:** 2 (Visual Polish & UX)
**Status:** TODO
**Schätzung:** 2 Punkte
**Abhängigkeit:** Story 1.3

## Beschreibung
Als Spieler möchte ich, dass die vier gewinnenden Steine hervorgehoben werden, damit ich auf einen Blick sehe, welche Reihe zum Sieg geführt hat.

## Acceptance Criteria
- [ ] Nach einem Gewinn werden die vier Steine, die die Gewinnreihe bilden, visuell hervorgehoben (z.B. durch eine andere Farbe, einen Rahmen oder eine Animation).
- [ ] Die `checkWin` Funktion (oder eine neue Wrapper-Funktion) gibt die Koordinaten der gewinnenden Steine zurück.
- [ ] Der `useGameLogic` Hook speichert die Positionen der gewinnenden Steine im Zustand.
- [ ] Das `Cell` Component erhält einen neuen Prop (z.B. `isWinningCell`), um die Hervorhebung zu aktivieren.
- [ ] Die Hervorhebung funktioniert für horizontale, vertikale und diagonale Gewinnreihen.

## Technische Notizen
- **Dateien:** `src/utils/gameLogic.ts`, `src/hooks/useGameLogic.ts`, `src/components/Cell.tsx`, `src/components/Cell.css`
- **Architektur-Referenz:** Decision Architecture - UI/UX Refactoring
- Die Modifikation der `checkWin` Funktion ist der kritische Teil. Sie muss nicht nur `true` zurückgeben, sondern auch die beteiligten Zellen.
