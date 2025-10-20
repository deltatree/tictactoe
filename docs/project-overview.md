# Projekt-Übersicht: testme (Tic-Tac-Toe)

**Datum:** 20. Oktober 2025
**Version:** 1.0.0 (Brownfield-Dokumentation)

---

## 1. Executive Summary

Dieses Dokument bietet eine hochrangige Übersicht über das "testme" Projekt. Es handelt sich um eine **Full-Stack Web-Anwendung**, die ein klassisches Tic-Tac-Toe-Spiel mit drei Spielmodi realisiert: Spieler-gegen-Spieler (lokal), Spieler-gegen-KI und Spieler-gegen-Spieler (online).

Das Projekt ist als **Multi-Part-Anwendung** strukturiert, bestehend aus einem modernen React-Frontend und einem Node.js-Backend, die in Echtzeit über WebSockets kommunizieren. Die Architektur ist auf Skalierbarkeit, Wartbarkeit und eine reibungslose Entwicklererfahrung ausgelegt.

## 2. Projekt-Klassifizierung

- **Repository-Typ:** Multi-Part (in einem einzigen Repository)
- **Primär-Klassifizierung:** `Game` (Echtzeit, Multiplayer)
- **Sekundär-Klassifizierung:** `Web Application` (Client-Server)
- **Architektur-Muster:** Client-Server mit WebSocket-basierter Echtzeit-Kommunikation

## 3. Technologie-Stack im Überblick

| Bereich | Technologie | Version | Anmerkung |
| :--- | :--- | :--- | :--- |
| **Frontend** | React | `19.1.1` | UI-Bibliothek |
| | TypeScript | `~5.9.3` | Typsicherheit im Frontend |
| | Vite | `7.1.7` | Build-Tool & Dev-Server |
| | Socket.IO Client | `4.8.1` | Echtzeit-Kommunikation |
| **Backend** | Node.js | `>=20.0.0` | Serverseitige Laufzeitumgebung |
| | Express | `4.21.2` | Web-Framework für Health-Checks |
| | Socket.IO Server | `4.8.1` | WebSocket-Server |
| | TypeScript | `^5.7.2` | Typsicherheit im Backend |
| **Deployment** | Docker | - | Containerisierung (Multi-Stage Build) |
| | Nginx | - | Dient als Reverse-Proxy & für das Frontend |
| **Entwicklung** | ESLint | `9.36.0` | Code-Linting |

## 4. Projekt-Struktur

Das Projekt besteht aus zwei Hauptteilen:

1.  **Frontend (Root-Verzeichnis):**
    -   Verantwortlich für die gesamte Benutzeroberfläche, die Darstellung des Spiels und die Interaktion mit dem Benutzer.
    -   Kommuniziert über den Socket.IO-Client mit dem Backend.
    -   Befindet sich im Hauptverzeichnis des Repositorys.

2.  **Backend (`/backend` Verzeichnis):**
    -   Verwaltet die Spiellogik, den Spielstatus, das Matchmaking für Online-Spiele und die Kommunikation zwischen den Spielern.
    -   Stellt einen Socket.IO-Server bereit.
    -   Befindet sich im Unterverzeichnis `backend/`.

Eine detaillierte Beschreibung der Integration finden Sie in der [Integrations-Architektur](./integration-architecture.md).
