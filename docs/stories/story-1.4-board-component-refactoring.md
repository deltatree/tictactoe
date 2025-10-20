# Story 1.4: Board Component Refactoring

**Epic:** 1 (Core Game Logic)
**Status:** TODO
**Schätzung:** 3 Punkte
**Abhängigkeit:** Story 1.1

## Beschreibung
Als Entwickler möchte ich das `Board.tsx` Component refactorn, damit es ein 7x6 Raster für Connect Four darstellt, anstatt des 3x3 Rasters von Tic-Tac-Toe.

## Acceptance Criteria
- [ ] Das `Board.tsx` Component rendert ein 7x6 Raster.
- [ ] Die CSS-Klassen in `Board.css` sind angepasst, um das 7x6 Raster korrekt darzustellen (z.B. via CSS Grid).
- [ ] Das `Cell.tsx` Component wird weiterhin für die einzelnen Zellen verwendet.
- [ ] Das Board ist responsiv und passt sich verschiedenen Bildschirmgrößen an.
- [ ] Klick-Handler auf den Spalten des Boards sind korrekt implementiert, um einen Zug auszulösen.

## Technische Notizen
- **Dateien:** `src/components/Board.tsx`, `src/components/Board.css`
- **Architektur-Referenz:** Decision Architecture - UI/UX Refactoring
- Der Fokus liegt rein auf der visuellen Darstellung des Rasters. Die Spiellogik wird in anderen Stories behandelt.
