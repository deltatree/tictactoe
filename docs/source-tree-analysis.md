# Analyse der Verzeichnisstruktur

**Datum:** 20. Oktober 2025
**Workflow:** `document-project`

---

Dieses Dokument bietet eine kommentierte Übersicht über die Verzeichnis- und Dateistruktur des "testme" Projekts.

## Projekt-Wurzelverzeichnis (`/`)

```
/
├── backend/                # -> Backend-Anwendung (Node.js, Express, Socket.IO)
├── bmad/                   # -> BMad Agent & Workflow Konfigurationen
├── docs/                   # -> Generierte und manuelle Projektdokumentation
├── public/                 # -> Statische Assets für das Frontend (Vite)
├── src/                    # -> Frontend-Anwendung (React, TypeScript)
├── .dockerignore           # -> Definiert Dateien, die von Docker ignoriert werden
├── .eslintrc.cjs           # -> ESLint Konfiguration
├── .gitignore              # -> Git Ignore-Datei
├── Dockerfile              # -> Multi-Stage Dockerfile für Frontend & Backend
├── index.html              # -> HTML-Einstiegspunkt für die React-Anwendung
├── nginx.conf              # -> Nginx-Konfiguration für den Docker-Container
├── package.json            # -> Frontend: Abhängigkeiten und Skripte
├── README.md               # -> Haupt-Projektdokumentation
└── tsconfig.json           # -> TypeScript-Konfiguration für das Frontend
```

## Frontend (`/src`)

Das Frontend ist eine typische Vite-basierte React-Anwendung.

```
src/
├── assets/                 # Statische Assets wie Bilder und Sounds
├── components/             # -> Wiederverwendbare React-Komponenten
├── context/                # -> React Context Provider (WebSocket)
├── hooks/                  # -> Benutzerdefinierte React Hooks (Spiellogik)
├── types/                  # -> TypeScript-Typdefinitionen für das Frontend
├── utils/                  # -> Hilfsfunktionen (KI-Logik, Sound-Effekte)
├── App.css                 # Globale Stile für die Haupt-App-Komponente
├── App.tsx                 # Haupt-React-Komponente (Anwendungs-Router)
├── index.css               # Globale CSS-Stile
└── main.tsx                # Einstiegspunkt der React-Anwendung
```

### Wichtige Frontend-Verzeichnisse:
-   `src/components`: Enthält die Bausteine der UI, wie `Board.tsx`, `Cell.tsx` und `Game.tsx`.
-   `src/hooks`: Das Herz der Frontend-Logik. `useGameLogic.ts` enthält die Logik für lokale Spiele, während `useOnlineGame.ts` die Online-Funktionalität steuert.
-   `src/context`: `WebSocketContext.tsx` kapselt die Socket.IO-Verbindung und stellt sie der gesamten Anwendung zur Verfügung.

## Backend (`/backend`)

Das Backend ist eine TypeScript-basierte Node.js-Anwendung.

```
backend/
├── src/                    # -> Backend Quellcode
│   ├── game/               # -> Kern-Spiellogik und Zustandsverwaltung
│   ├── matchmaking/        # -> Logik für die Online-Spieler-Warteschlange
│   └── socket/             # -> Socket.IO Event-Handler
├── package.json            # -> Backend: Abhängigkeiten und Skripte
└── tsconfig.json           # -> TypeScript-Konfiguration für das Backend
```

### Wichtige Backend-Verzeichnisse:
-   `backend/src/game`: Enthält die `Game.ts` Klasse, die einen einzelnen Spielzustand repräsentiert, und den `GameManager.ts`, der alle aktiven Spiele verwaltet.
-   `backend/src/matchmaking`: `Queue.ts` implementiert eine einfache Warteschlange, um Spieler zu Paaren zusammenzufügen.
-   `backend/src/socket`: `handlers.ts` definiert, wie der Server auf eintreffende Socket.IO-Events von den Clients reagiert (z.B. `join-queue`, `make-move`).
