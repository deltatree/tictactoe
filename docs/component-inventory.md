# UI-Komponenten-Inventar

**Datum:** 20. Oktober 2025

---

Dieses Dokument katalogisiert die primären React-Komponenten der Anwendung.

## 1. Haupt- & Strukturkomponenten

### `App.tsx`
-   **Verantwortlichkeit:** Die Wurzelkomponente der Anwendung. Sie fungiert als Router, der basierend auf dem ausgewählten Spielmodus (`local`, `ai`, `online`) die entsprechende Ansicht anzeigt.
-   **Props:** Keine.
-   **Zustand:** `gameMode`.

### `Game.tsx`
-   **Verantwortlichkeit:** Orchestriert eine einzelne Spielrunde. Diese Komponente lädt den passenden Hook (`useGameLogic` oder `useOnlineGame`) und gibt dessen Zustand und Funktionen an die untergeordneten UI-Komponenten weiter. Sie ist das zentrale Bindeglied zwischen Logik und Darstellung.
-   **Props:** `mode: GameMode`.
-   **Zustand:** Keinen eigenen, leitet den Zustand vom zuständigen Hook weiter.

## 2. Spiel-Komponenten

### `Board.tsx`
-   **Verantwortlichkeit:** Rendert das 3x3-Spielfeld. Sie mappt über das `board`-Array und rendert für jeden Eintrag eine `Cell`-Komponente.
-   **Props:** `board: BoardState`, `onCellClick: (index: number) => void`, `disabled: boolean`.
-   **Zustand:** Keinen.

### `Cell.tsx`
-   **Verantwortlichkeit:** Stellt eine einzelne, klickbare Zelle des Spielfelds dar. Zeigt das 'X' oder 'O' an und hat einen speziellen Stil für Gewinnkombinationen.
-   **Props:** `value: Player | null`, `onClick: () => void`, `isWinner: boolean`.
-   **Zustand:** Keinen.

### `GameStatus.tsx`
-   **Verantwortlichkeit:** Zeigt textuelle Informationen zum aktuellen Spielverlauf an. Beispiele: "Du bist am Zug", "Gegner ist am Zug", "Du hast gewonnen!", "Unentschieden".
-   **Props:** `status: GameStatus`, `currentPlayer: Player`, `winner: Player | null`, `isYourTurn?: boolean`, `yourSymbol?: Player`.
-   **Zustand:** Keinen.

## 3. Modus-spezifische Komponenten

### `DifficultySelector.tsx`
-   **Verantwortlichkeit:** Ermöglicht dem Spieler die Auswahl des KI-Schwierigkeitsgrades ('Easy', 'Medium', 'Hard'), bevor ein Spiel gegen die KI gestartet wird.
-   **Props:** `onSelect: (difficulty: AIDifficulty) => void`.
-   **Zustand:** Keinen.

### `Matchmaking.tsx`
-   **Verantwortlichkeit:** Dient als Lobby für den Online-Modus. Enthält ein Eingabefeld für den Spielernamen, einen Button zum Beitreten der Warteschlange und zeigt den Verbindungs- und Matchmaking-Status an.
-   **Props:** `playerName: string`, `setPlayerName: (name: string) => void`, `onMatchFound: (match: any) => void`.
-   **Zustand:** `status` ('idle', 'searching', 'found').

### `QuickChat.tsx`
-   **Verantwortlichkeit:** Stellt die Chat-Oberfläche für Online-Spiele bereit. Zeigt empfangene Nachrichten an und bietet eine Auswahl an vordefinierten Schnellnachrichten zum Senden.
-   **Props:** `gameId: string`, `onUnreadChange: (count: number) => void`.
-   **Zustand:** `messages: ChatMessage[]`, `isOpen: boolean`, `unreadCount: number`.

## 4. Provider-Komponenten

### `WebSocketProvider.tsx` (`/src/context`)
-   **Verantwortlichkeit:** Eine nicht-visuelle Komponente, die die Socket.IO-Verbindung zum Server kapselt und über den React Context für alle untergeordneten Komponenten verfügbar macht.
-   **Props:** `children: ReactNode`.
-   **Zustand:** `socket: Socket | null`, `connectionStatus: ConnectionStatus`.
