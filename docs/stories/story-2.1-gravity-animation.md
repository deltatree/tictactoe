# Story 2.1: Gravity Animation

**Epic:** 2 (Visual Polish & UX)
**Status:** TODO
**Schätzung:** 3 Punkte
**Abhängigkeit:** Story 1.4

## Beschreibung
Als Spieler möchte ich, dass die Spielsteine mit einer "Gravity"-Animation in die jeweilige Spalte fallen, um ein realistischeres und ansprechenderes Spielgefühl zu erzeugen.

## Acceptance Criteria
- [ ] Wenn ein Spieler einen Zug macht, fällt der Spielstein von oben in die niedrigste freie Zelle der gewählten Spalte.
- [ ] Die Animation wird mit reinem CSS (Keyframes) umgesetzt, um die Performance zu maximieren.
- [ ] Für jede der 6 Reihen wird eine eigene Animations-Klasse erstellt (z.B. `drop-row-1`, `drop-row-2`, ...), die die `transform: translateY(...)` Distanz korrekt abbildet.
- [ ] Die Animation wird dynamisch auf das `Cell` Component angewendet, wenn ein Stein platziert wird.
- [ ] Die Animation ist flüssig und dauert ca. 300-500ms.

## Technische Notizen
- **Dateien:** `src/components/Cell.css`, `src/components/Cell.tsx`
- **Architektur-Referenz:** Decision Architecture - UI/UX Refactoring (Animation)
- Dies ist ein reines Frontend-Feature. Die Logik zur Bestimmung der Ziel-Zelle existiert bereits in `useGameLogic`.
