# Datenmodelle und Typen

**Datum:** 20. Oktober 2025

---

Dieses Dokument beschreibt die zentralen Datenstrukturen und TypeScript-Typen, die im "testme"-Projekt verwendet werden.

## 1. Kern-Typen (`/src/types/game.types.ts`)

Diese Typen werden sowohl im Frontend als auch konzeptionell im Backend verwendet.

### `Player`

Definiert den Spielstein eines Spielers.

```typescript
export type Player = 'X' | 'O';
```

### `BoardState`

Repräsentiert das 3x3-Spielfeld als Array mit 9 Elementen.

```typescript
export type BoardState = (Player | null)[];
```
-   `null` bedeutet, die Zelle ist leer.
-   `'X'` oder `'O'` bedeutet, die Zelle ist von einem Spieler besetzt.

### `GameStatus`

Definiert die möglichen Zustände, in denen sich ein Spiel befinden kann.

```typescript
export type GameStatus = 'waiting' | 'playing' | 'win' | 'draw';
```
-   `waiting`: Wartet auf den Beginn des Spiels (z.B. im Online-Modus).
-   `playing`: Das Spiel läuft aktiv.
-   `win`: Ein Spieler hat gewonnen.
-   `draw`: Das Spiel endete unentschieden.

### `GameMode`

Definiert die drei möglichen Spielmodi.

```typescript
export type GameMode = 'local' | 'ai' | 'online';
```

### `GameState`

Die umfassendste Struktur, die den gesamten Zustand eines Spiels zu einem beliebigen Zeitpunkt beschreibt.

```typescript
export interface GameState {
  board: BoardState;
  currentPlayer: Player;
  winner: Player | null;
  status: GameStatus;
  mode: GameMode;
}
```

## 2. Backend-Datenmodelle

Diese Modelle existieren serverseitig und werden nicht direkt mit dem Frontend geteilt, aber ihre Eigenschaften spiegeln sich in den API-Verträgen wider.

### `Game` (`/backend/src/game/Game.ts`)

Eine Klasse, die eine einzelne Spielinstanz auf dem Server repräsentiert.

-   **Eigenschaften:**
    -   `id: string`: Eindeutige ID des Spiels.
    -   `players: { [socketId: string]: Player }`: Ein Objekt, das die Socket-IDs der Spieler ihren Spielsteinen ('X' oder 'O') zuordnet.
    -   `board: BoardState`: Der aktuelle Zustand des Spielfelds.
    -   `currentPlayer: Player`: Der Spieler, der aktuell am Zug ist.
    -   `status: GameStatus`: Der aktuelle Spielstatus.
    -   `winner: Player | null`: Der Gewinner des Spiels.

### `GameManager` (`/backend/src/game/GameManager.ts`)

Eine Singleton-Klasse zur Verwaltung aller aktiven Spiele.

-   **Eigenschaften:**
    -   `games: Map<string, Game>`: Eine Map, die `gameId` auf die entsprechende `Game`-Instanz abbildet.
    -   `totalGamesPlayed: number`: Ein Zähler für Statistiken.

### `MatchmakingQueue` (`/backend/src/matchmaking/Queue.ts`)

Eine Singleton-Klasse zur Verwaltung der Spieler-Warteschlange.

-   **Eigenschaften:**
    -   `queue: { socketId: string; playerName: string; }[]`: Ein Array von Spielern, die auf einen Gegner warten.

## 3. Frontend-spezifische Typen

### `ChatMessage` (`/src/components/QuickChat/QuickChat.tsx`)

Definiert die Struktur einer Chat-Nachricht im Frontend.

```typescript
export interface ChatMessage {
  sender: 'me' | 'opponent' | 'system';
  message: string;
}
```
-   `sender`: Wird verwendet, um die Nachricht im UI korrekt zuzuordnen und zu formatieren.
-   `message`: Der Inhalt der Nachricht.
