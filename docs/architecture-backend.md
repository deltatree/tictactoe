# Backend-Architektur: testme

**Datum:** 20. Oktober 2025

---

## 1. Architektur-Überblick

Das Backend ist eine mit **Node.js** und **TypeScript** erstellte Anwendung. Es verwendet **Express** für grundlegende HTTP-Endpunkte (wie Health-Checks) und **Socket.IO** als Kerntechnologie für die Echtzeit-Kommunikation in Online-Spielen.

Die Architektur ist in klar getrennte Verantwortungsbereiche aufgeteilt:

-   **Server-Setup (`index.ts`):** Initialisiert den Express-Server, den HTTP-Server und den Socket.IO-Server.
-   **Socket-Handler (`/socket`):** Definiert das Verhalten des Servers bei eintreffenden Client-Events.
-   **Matchmaking (`/matchmaking`):** Verwaltet die Warteschlange für Spieler, die ein Online-Spiel suchen.
-   **Spiellogik (`/game`):** Kapselt die Regeln und den Zustand eines einzelnen Spiels sowie die Verwaltung aller laufenden Spiele.

## 2. Komponenten der Architektur

### `index.ts` (Einstiegspunkt)
-   Initialisiert und konfiguriert den `express`-Server.
-   Erstellt einen `http`-Server, der an Express gebunden ist.
-   Initialisiert den `Socket.IO`-Server und bindet ihn an den `http`-Server.
-   Konfiguriert **CORS** (`cors`-Paket), um Verbindungen vom Frontend (z.B. `localhost:5173`) zu erlauben.
-   Definiert HTTP-Endpunkte wie `/api/health` für System-Monitoring.
-   Instanziiert Singletons für `GameManager` und `MatchmakingQueue`.
-   Ruft `setupSocketHandlers` auf, um die Event-Listener zu registrieren.
-   Startet den Server.

### `/socket/handlers.ts`
-   **Zweck:** Das Herz der Server-Logik. Diese Datei definiert, wie der Server auf Client-Aktionen reagiert.
-   **Funktion `setupSocketHandlers`:** Nimmt die `io`-Serverinstanz sowie die `gameManager`- und `matchmakingQueue`-Instanzen entgegen.
-   **Event-Listener:** Registriert Handler für jedes Client-Event, z.B.:
    -   `connection`: Wird bei jeder neuen Client-Verbindung ausgelöst. Hier werden die Handler für die spezifischen Events des jeweiligen Clients registriert.
    -   `join-queue`: Fügt einen Spieler zur `MatchmakingQueue` hinzu.
    -   `make-move`: Empfängt einen Spielzug von einem Spieler, validiert ihn über den `GameManager` und sendet den aktualisierten Zustand an die Spieler.
    -   `chat-message`: Leitet eine Chat-Nachricht an den Gegner weiter.
    -   `disconnect`: Bereinigt Ressourcen, z.B. durch Benachrichtigung des Gegners, wenn ein Spieler das Spiel verlässt.

### `/game/Game.ts` & `GameManager.ts`
-   **`Game.ts`:**
    -   Repräsentiert **ein einzelnes Tic-Tac-Toe-Spiel**.
    -   Enthält den Zustand des Spiels: `board`, `currentPlayer`, `players`, `status`.
    -   Implementiert die Kern-Spiellogik: `makeMove()`, `checkWinner()`. Die `makeMove`-Methode validiert, ob der richtige Spieler am Zug ist und der Zug gültig ist.
-   **`GameManager.ts`:**
    -   Ein **Singleton**, das **alle aktiven Spiele** verwaltet.
    -   Speichert Spiele in einer `Map` (z.B. `gameId` -> `Game`-Instanz).
    -   Stellt Methoden zur Verfügung, um Spiele zu erstellen (`createGame`), abzurufen (`getGame`) und zu beenden (`endGame`).
    -   Dient als Service-Schicht zwischen den Socket-Handlern und den einzelnen `Game`-Instanzen.

### `/matchmaking/Queue.ts`
-   **`MatchmakingQueue.ts`:**
    -   Ein **Singleton**, das eine einfache **First-In-First-Out (FIFO)-Warteschlange** implementiert.
    -   Spieler, die ein Online-Spiel suchen, werden hier mit ihrer `socketId` und ihrem `playerName` eingereiht.
    -   Wenn zwei Spieler in der Warteschlange sind, werden sie zu einem Paar zusammengefügt, aus der Warteschlange entfernt und ein neues Spiel wird über den `GameManager` für sie erstellt.

## 3. Datenfluss (Beispiel: Online-Spielzug)

1.  **Client A** klickt auf eine Zelle. Das Frontend sendet ein `make-move`-Event mit `{ gameId, cellIndex }` an den Server.
2.  Der **Socket-Handler** auf dem Server empfängt das `make-move`-Event.
3.  Der Handler ruft `gameManager.getGame(gameId)` ab, um die richtige `Game`-Instanz zu erhalten.
4.  Er ruft dann `game.makeMove(playerSocketId, cellIndex)` auf der `Game`-Instanz auf.
5.  Die `Game`-Instanz **validiert den Zug** (ist der Spieler am Zug? ist die Zelle frei?) und aktualisiert ihren internen Zustand (`board`, `currentPlayer`).
6.  Der Socket-Handler prüft das Ergebnis des Zugs.
7.  Er sendet ein `game-update`-Event mit dem neuen Spielzustand an **beide Spieler** (Client A und Client B) im entsprechenden `gameId`-Raum.
8.  Die Frontends beider Spieler empfangen das Event und rendern die UI mit dem neuen Zustand neu.
