# API-Verträge (Socket.IO Events)

**Datum:** 20. Oktober 2025

---

Dieses Dokument definiert die "Verträge" für die Echtzeit-Kommunikation zwischen dem Client (Frontend) und dem Server (Backend).

## Client-zu-Server Events (C2S)

Events, die vom Frontend an das Backend gesendet werden.

---

### `join-queue`

-   **Beschreibung:** Ein Spieler möchte einem Online-Spiel beitreten und tritt der Matchmaking-Warteschlange bei.
-   **Payload:**
    ```typescript
    {
      playerName: string;
    }
    ```
-   **Antwort des Servers:** `match-found` (wenn ein Gegner gefunden wird).

---

### `confirm-match`

-   **Beschreibung:** Ein Spieler bestätigt, dass er das gefundene Match annehmen und das Spiel starten möchte. Sendet seinen finalen Namen.
-   **Payload:**
    ```typescript
    {
      gameId: string;
      playerName: string;
    }
    ```
-   **Antwort des Servers:** `game-start` und `game-update` an beide Spieler.

---

### `make-move`

-   **Beschreibung:** Ein Spieler macht einen Zug im laufenden Spiel.
-   **Payload:**
    ```typescript
    {
      gameId: string;
      cellIndex: number; // 0-8
    }
    ```
-   **Antwort des Servers:** `game-update` an beide Spieler im Raum.

---

### `chat-message`

-   **Beschreibung:** Ein Spieler sendet eine Chat-Nachricht.
-   **Payload:**
    ```typescript
    {
      gameId: string;
      message: string;
    }
    ```
-   **Antwort des Servers:** `chat-message` an den Gegner.

---

## Server-zu-Client Events (S2C)

Events, die vom Backend an das/die Frontend(s) gesendet werden.

---

### `match-found`

-   **Beschreibung:** Benachrichtigt einen Spieler, dass ein Gegner gefunden wurde.
-   **Payload:**
    ```typescript
    {
      gameId: string;
      opponentName: string;
      starts: boolean; // true, wenn dieser Spieler beginnt
    }
    ```

---

### `opponent-name-updated`

-   **Beschreibung:** Informiert einen Spieler, wenn der Gegner seinen Namen während der Match-Bestätigung aktualisiert.
-   **Payload:**
    ```typescript
    {
      newName: string;
    }
    ```

---

### `game-start`

-   **Beschreibung:** Signalisiert den offiziellen Beginn des Spiels, nachdem beide Spieler bestätigt haben.
-   **Payload:** (keine)

---

### `game-update`

-   **Beschreibung:** Sendet den vollständigen, aktuellen Spielzustand an beide Spieler. Dies ist das wichtigste Event während des Spiels.
-   **Payload:**
    ```typescript
    {
      board: (string | null)[]; // Array der Länge 9
      currentPlayer: string; // 'X' oder 'O'
      isYourTurn: boolean;
      status: 'waiting' | 'playing' | 'win' | 'draw';
      winner: string | null;
    }
    ```

---

### `game-over`

-   **Beschreibung:** Benachrichtigt die Spieler über das Ende des Spiels und das Ergebnis.
-   **Payload:**
    ```typescript
    {
      winner: string | null; // 'X', 'O', oder null bei Unentschieden
      board: (string | null)[];
    }
    ```

---

### `chat-message`

-   **Beschreibung:** Leitet eine empfangene Chat-Nachricht an den Client weiter.
-   **Payload:**
    ```typescript
    {
      sender: string; // 'opponent'
      message: string;
    }
    ```

---

### `opponent-disconnected`

-   **Beschreibung:** Informiert einen Spieler, dass sein Gegner die Verbindung getrennt hat.
-   **Payload:** (keine)

---

### `error`

-   **Beschreibung:** Sendet eine Fehlermeldung an einen Client (z.B. bei einem ungültigen Zug).
-   **Payload:**
    ```typescript
    {
      message: string;
    }
    ```
