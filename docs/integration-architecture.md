# Integrations-Architektur: Frontend & Backend

**Datum:** 20. Oktober 2025

---

## 1. Überblick

Die Integration zwischen dem React-Frontend und dem Node.js-Backend ist das Herzstück der Online-Multiplayer-Funktionalität. Die Kommunikation erfolgt primär über **WebSockets**, die durch die **Socket.IO**-Bibliothek auf beiden Seiten implementiert sind.

HTTP wird nur für untergeordnete Zwecke verwendet (z.B. Health-Checks).

## 2. Kommunikationskanal: Socket.IO

Socket.IO bietet eine ereignisbasierte Echtzeit-Kommunikation. Anstatt eines klassischen Request-Response-Zyklus (wie bei HTTP) wird eine persistente Verbindung aufgebaut, über die beide Seiten jederzeit Nachrichten (Events) senden können.

-   **Frontend (`WebSocketContext.tsx`):** Baut eine einzige, anwendungsweite Verbindung zum Backend auf.
-   **Backend (`index.ts`):** Startet einen Socket.IO-Server, der auf Verbindungen lauscht.

## 3. Verbindungs-Lebenszyklus

1.  **Herstellen der Verbindung:**
    -   Wenn die React-Anwendung lädt, initialisiert der `WebSocketProvider` die Verbindung zum Backend-Server (z.B. `http://localhost:3001` in der Entwicklung).
    -   Das Backend empfängt ein `connection`-Event und protokolliert die neue Verbindung. Ein dedizierter Satz von Event-Listenern wird für diesen spezifischen Client (Socket) eingerichtet.

2.  **Matchmaking-Prozess:**
    -   Der Benutzer gibt im Frontend seinen Namen ein und klickt auf "Spiel suchen".
    -   Das Frontend sendet ein `join-queue`-Event mit dem Spielernamen.
    -   Das Backend empfängt das Event, fügt den Spieler zur `MatchmakingQueue` hinzu und wartet auf einen zweiten Spieler.
    -   Sobald ein zweiter Spieler beitritt, erstellt das Backend ein neues Spiel über den `GameManager`.
    -   Das Backend sendet ein `match-found`-Event an **beide** Spieler, das die `gameId` und die Informationen zum Gegner enthält.

3.  **Spiel-Kommunikation:**
    -   Die Frontends beider Spieler empfangen `match-found` und wechseln in die Spielansicht.
    -   Wenn ein Spieler einen Zug macht, sendet sein Frontend ein `make-move`-Event.
    -   Das Backend validiert den Zug und sendet den neuen Spielzustand über ein `game-update`-Event an beide Spieler.
    -   Dieser Zyklus wiederholt sich, bis das Spiel endet.

4.  **Trennen der Verbindung:**
    -   Wenn ein Spieler den Tab schließt, wird automatisch ein `disconnect`-Event im Backend ausgelöst.
    -   Der `disconnect`-Handler im Backend benachrichtigt den verbleibenden Spieler über ein `opponent-disconnected`-Event, was das Spiel sofort beendet.

## 4. Datenkonsistenz: "Single Source of Truth"

Für Online-Spiele ist das **Backend die alleinige Quelle der Wahrheit (Single Source of Truth)** für den Spielzustand.

-   Das Frontend sendet lediglich die **Absicht** des Spielers (z.B. "Ich möchte auf Zelle 5 klicken").
-   Das Backend **validiert** diese Absicht, aktualisiert den autoritativen Spielzustand und **verteilt** diesen neuen Zustand an alle Teilnehmer.
-   Das Frontend ist rein für die Darstellung des vom Backend empfangenen Zustands verantwortlich. Es führt keine eigene Logik zur Zugvalidierung im Online-Modus durch.

Dieses Muster verhindert Cheating und sorgt dafür, dass alle Spieler immer eine konsistente Ansicht des Spiels haben, selbst bei Netzwerkproblemen.

## 5. Deployment-Kontext (Docker)

In der Produktionsumgebung (Docker) wird die Integration durch **Nginx** als Reverse-Proxy verwaltet:

-   Anfragen an die Root-URL (`/`) werden von Nginx abgefangen und mit den statischen Frontend-Dateien (HTML, CSS, JS) beantwortet.
-   Anfragen an den Socket.IO-Endpunkt (standardmäßig `/socket.io/`) werden von Nginx direkt an den laufenden Node.js-Backend-Prozess auf Port `3001` weitergeleitet.

Dies ermöglicht es, beide Teile der Anwendung über einen einzigen Port (z.B. Port 80) nach außen verfügbar zu machen.
