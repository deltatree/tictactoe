# Frontend-Architektur: testme

**Datum:** 20. Oktober 2025

---

## 1. Architektur-Überblick

Das Frontend ist eine **Single-Page-Application (SPA)**, die mit **React** und **TypeScript** erstellt wurde. Das Build-System basiert auf **Vite**, was eine schnelle Entwicklung und ein optimiertes Bundle ermöglicht.

Die Architektur ist **komponentenbasiert** und folgt einem klaren Muster der Trennung von Zustandslogik, UI-Darstellung und Nebeneffekten.

-   **UI-Komponenten (`/components`):** Definieren die Struktur und das Aussehen der Anwendung.
-   **Hooks (`/hooks`):** Kapseln die komplexe Geschäfts- und Zustandslogik.
-   **Context (`/context`):** Stellt globale Zustände und Funktionen bereit (insbesondere die WebSocket-Verbindung).
-   **Typen (`/types`):** Sorgen für Typsicherheit in der gesamten Anwendung.

## 2. Kernkomponenten (`/src/components`)

-   **`Game.tsx`:** Die Hauptkomponente, die den Spielzustand basierend auf dem ausgewählten Modus (`local`, `ai`, `online`) verwaltet und die entsprechenden Unterkomponenten rendert.
-   **`Board.tsx`:** Stellt das 3x3-Spielfeld dar. Es empfängt den aktuellen Zustand des Spielfelds und leitet Klick-Events an die Spiellogik weiter.
-   **`Cell.tsx`:** Repräsentiert eine einzelne Zelle im Spielfeld.
-   **`GameStatus.tsx`:** Zeigt den aktuellen Spielstatus an (z.B. "Spieler X ist am Zug", "Unentschieden").
-   **`Matchmaking.tsx`:** UI für den Online-Modus, ermöglicht Spielern, ihren Namen einzugeben und der Warteschlange beizutreten.
-   **`QuickChat.tsx`:** Die Chat-Komponente für den Online-Modus.

## 3. Zustands- und Geschäftslogik (`/src/hooks`)

Die Spiellogik ist bewusst aus den UI-Komponenten in wiederverwendbare Hooks ausgelagert.

-   **`useGameLogic.ts`:**
    -   **Zweck:** Verwaltet den gesamten Lebenszyklus eines **lokalen** oder **Spieler-gegen-KI**-Spiels.
    -   **Zustände:** `board`, `currentPlayer`, `winner`, `gameStatus`.
    -   **Funktionen:** `handleCellClick`, `resetGame`.
    -   Implementiert die Logik zur Gewinnüberprüfung und zur Steuerung des KI-Gegners.

-   **`useOnlineGame.ts`:**
    -   **Zweck:** Verwaltet den gesamten Lebenszyklus eines **Online-Spiels**.
    -   **Abhängigkeit:** Nutzt den `WebSocketContext` zur Kommunikation mit dem Server.
    -   **Zustände:** Synchronisiert den Spielzustand (`board`, `currentPlayer`, etc.) mit dem Backend.
    -   **Event-Handler:** Definiert Listener für Server-Events wie `game-update`, `opponent-joined`, `game-over`.
    -   **Emitter:** Sendet Spieleraktionen wie `make-move` an den Server.

## 4. Globale Zustände (`/src/context`)

-   **`WebSocketContext.tsx`:**
    -   **Zweck:** Stellt eine einzige, persistente **Socket.IO-Verbindung** für die gesamte Anwendung bereit.
    -   **Funktionalität:**
        -   Baut die Verbindung zum Server auf.
        -   Verwaltet den Verbindungsstatus (`connected`, `disconnected`).
        -   Stellt generische `emit` und `on` Funktionen zur Verfügung, die von anderen Teilen der App (primär `useOnlineGame`) genutzt werden.
    -   **Vorteil:** Verhindert mehrfache Socket-Verbindungen und entkoppelt die Verbindungslogik von den Komponenten.

## 5. Datenfluss

1.  **Lokales Spiel:**
    -   `Cell` -> `Board` -> `Game` -> `useGameLogic.handleCellClick()`
    -   `useGameLogic` aktualisiert seinen internen Zustand.
    -   React rendert die `Game`-Komponente mit dem neuen Zustand neu.

2.  **Online-Spiel:**
    -   `Cell` -> `Board` -> `Game` -> `useOnlineGame.handleCellClick()`
    -   `useOnlineGame` sendet ein `make-move`-Event über den `WebSocketContext` an den Server.
    -   Der Server validiert den Zug und sendet ein `game-update`-Event an **beide** Spieler.
    -   Der `useOnlineGame`-Hook auf beiden Clients empfängt das `game-update`-Event und aktualisiert seinen Zustand.
    -   React rendert die `Game`-Komponente mit dem vom Server erhaltenen Zustand neu.

Dieser unidirektionale Datenfluss (für Online-Spiele Server-gesteuert) sorgt für einen konsistenten und vorhersagbaren Zustand.
