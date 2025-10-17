# testme - Tic-Tac-Toe für Kinder

Ein farbenfrohes, kindgerechtes Tic-Tac-Toe Web-Game mit intelligenter KI, Online-Multiplayer und drei Schwierigkeitsstufen.

## 🌐 Live Demo

**🎮 Jetzt online spielen:** [https://tictactoe.dtcloud.de](https://tictactoe.dtcloud.de)

Das aktuelle Release läuft live und kann direkt im Browser gespielt werden - keine Installation erforderlich!

## 🎮 Features

### Spielmodi
- **🤖 KI-Modus:** Drei Schwierigkeitsstufen (Leicht, Mittel, Schwer mit Minimax-Algorithmus)
- **👥 Lokal 2-Spieler:** Spiele gegen einen Freund am gleichen Gerät
- **🌍 Online-Multiplayer:** Spiele gegen andere Spieler weltweit in Echtzeit

### Multiplayer-Features
- **⚡ Echtzeit-Matchmaking:** Automatisches Matching mit anderen Spielern
- **💬 Quick-Chat:** Sichere vordefinierte Nachrichten (kindgerecht)
- **🔄 Revanche-System:** Sofortige Revanche nach Spielende
- **📊 Online-Statistiken:** Tracking von Online-Siegen und -Niederlagen
- **🎭 Spieler-Alias:** Anpassbare Anzeigenamen

### Gameplay & UX
- **🎨 Kindgerechtes Design:** Bunte Farben, große Buttons, intuitive Bedienung
- **🔊 Sound-Effekte:** Synthesized sounds via Web Audio API (keine Audio-Dateien)
- **🎵 Lautstärke-Kontrolle:** Einstellbare Lautstärke mit Mute-Funktion
- **🎊 Konfetti-Animation:** Feier-Effekt bei Spielersieg
- **📈 Erweiterte Statistiken:** Detailliertes Tracking von Spielen, Siege, Niederlagen
- **🏆 Achievements:** Freischaltbare Erfolge und Meilensteine
- **📜 Spielverlauf:** Historie der letzten 50 Spiele
- **🎨 Theme-Anpassung:** Mehrere Farbschemas (Colorful, Dark, Ocean, Forest, Sunset)
- **📱 Vollständig Responsive:** Funktioniert auf Desktop, Tablet und Mobile
- **🔒 Werbefrei & Sicher:** Keine Tracker, keine Werbung, kein Free-Text-Chat

## 🏗️ Architektur

### Frontend
- **Framework:** React 19 + TypeScript 5.9
- **Build Tool:** Vite 7.1
- **State Management:** React Hooks (useState, useEffect, useContext)
- **Real-time:** Socket.IO Client 4.8
- **Styling:** CSS Modules mit Theme-Support
- **Animations:** canvas-confetti für Siegeseffekte

### Backend
- **Runtime:** Node.js 20+
- **Framework:** Express 4.21
- **WebSocket:** Socket.IO Server 4.8
- **Game Logic:** Custom Minimax AI, Matchmaking Queue
- **Deployment:** Docker + nginx

### Key Components
- **Game Logic Hook:** `useGameLogic.ts` - Spiel-State Management
- **Online Game Hook:** `useOnlineGame.ts` - Multiplayer-State & Events
- **WebSocket Context:** `WebSocketContext.tsx` - Connection Management
- **AI Player:** `aiPlayer.ts` - Drei Schwierigkeitsgrade (Easy, Medium, Hard)
- **Backend Handlers:** `socket/handlers.ts` - Matchmaking, Game Updates, Chat

## 🚀 Quick Start

### Lokale Entwicklung

```bash
# 1. Clone Repository
git clone https://github.com/deltatree/tictactoe.git
cd tictactoe

# 2. Frontend Setup
npm install
npm run dev
# Frontend läuft auf http://localhost:5173

# 3. Backend Setup (neues Terminal)
cd backend
npm install
npm run dev
# Backend läuft auf http://localhost:3001
```

### Production Build

```bash
# Frontend Build
npm run build          # Output: dist/
npm run preview        # Preview auf http://localhost:4173

# Backend Build
cd backend
npm run build          # Output: backend/dist/
npm start              # Startet Production Server
```

### Code Quality

```bash
# Frontend
npm run lint           # ESLint
npm run typecheck      # TypeScript (npx tsc --noEmit)

# Backend
cd backend
npm run typecheck      # TypeScript
```

## 🐳 Docker Deployment

### Pull and Run from GitHub Container Registry

```bash
# Pull latest image
docker pull ghcr.io/deltatree/testme:latest

# Run Frontend Container
docker run -d -p 80:80 --name testme ghcr.io/deltatree/testme:latest

# Run Backend Container (for online multiplayer)
cd backend
docker build -t testme-backend .
docker run -d -p 3001:3001 --name testme-backend testme-backend

# Access game
open http://localhost
```

### Build Docker Images Locally

```bash
# Frontend Image
docker build -t testme:local .

docker run -d -p 8080:80 --name testme-local testme:local

# Backend Image
cd backend
docker build -t testme-backend:local .
docker run -d -p 3001:3001 --name testme-backend-local testme-backend:local

# Access game
open http://localhost:8080

# View logs
docker logs testme-local
docker logs testme-backend-local

# Stop containers
docker stop testme-local testme-backend-local
```

### Docker Image Details

**Frontend:**
- **Base Image:** nginx:alpine
- **Multi-stage Build:** Optimized for small size
- **Image Size:** < 50MB (compressed)
- **Health Check:** Built-in HTTP monitoring
- **Platforms:** linux/amd64, linux/arm64

**Backend:**
- **Base Image:** node:20-alpine
- **Image Size:** < 100MB (compressed)
- **Health Check:** WebSocket connection test
- **Environment:** Node.js 20+, Socket.IO 4.8

## 📦 Release Process

This project uses semantic versioning and automated Docker image builds via GitHub Actions.

### Creating a Release

1. **Ensure all tests pass:**
   ```bash
   # Frontend
   npm run lint
   npm run build
   
   # Backend
   cd backend
   npm run typecheck
   npm run build
   ```

2. **Create and push a semantic version tag:**
   ```bash
   # Format: vMM.mm.pp (e.g., v01.00.00, v02.01.15)
   git tag v02.00.00
   git push origin v02.00.00
   ```

3. **GitHub Actions automatically:**
   - Builds Docker images (Frontend + Backend)
   - Tags with version and `latest`
   - Pushes to GitHub Container Registry
   - Deploys to production (https://tictactoe.dtcloud.de)

### Semantic Versioning Guide

- **Major (v0X.00.00):** Breaking changes, major features
- **Minor (v02.0X.00):** New features, non-breaking
- **Patch (v02.00.0X):** Bug fixes, minor improvements

**Version History:**
- `v01.00.00` - MVP Release (AI, Statistiken, Sounds)
- `v02.00.00` - Online Multiplayer, 2-Player Local, Themes, Chat

## 🛠️ Tech Stack

### Frontend
| Technologie | Version | Verwendung |
|-------------|---------|------------|
| React | 19.1 | UI Framework |
| TypeScript | 5.9 | Type Safety |
| Vite | 7.1 | Build Tool & Dev Server |
| Socket.IO Client | 4.8 | WebSocket Communication |
| canvas-confetti | 1.9 | Konfetti-Animationen |
| CSS Modules | - | Scoped Styling |
| Web Audio API | - | Sound-Synthese (keine Dateien) |

### Backend
| Technologie | Version | Verwendung |
|-------------|---------|------------|
| Node.js | 20+ | Runtime |
| Express | 4.21 | HTTP Server |
| Socket.IO | 4.8 | WebSocket Server |
| TypeScript | 5.7 | Type Safety |
| dotenv | 16.4 | Environment Config |

### DevOps & Deployment
- **Containerization:** Docker (Multi-stage builds)
- **Web Server:** nginx (Alpine Linux)
- **CI/CD:** GitHub Actions
- **Registry:** GitHub Container Registry (ghcr.io)
- **Hosting:** dtcloud.de

## 📱 Browser Support

- Chrome 90+ ✅
- Firefox 88+ ✅
- Safari 14+ ✅
- Edge 90+ ✅
- Mobile Browsers (iOS Safari, Chrome Mobile) ✅

## 🎯 Performance

- **Bundle Size (Frontend):** ~90KB (gzipped)
- **Bundle Size (Backend):** ~100MB (Docker Image)
- **Load Time:** < 2s (First Contentful Paint)
- **Lighthouse Score:** 95+ (Performance, Accessibility, Best Practices)
- **FPS:** 60fps (Animations)
- **WebSocket Latency:** < 500ms (Online Multiplayer)

## 🎮 Spielmechaniken

### KI-Schwierigkeitsgrade

**Leicht (Easy):**
- 70% zufällige Züge
- 30% strategische Züge (Blockieren, Gewinnen)
- Ideal für Kinder 5-7 Jahre

**Mittel (Medium):**
- Regelbasierte Heuristiken
- Priorität: Gewinnen > Blockieren > Zentrum > Ecken
- Ideal für Kinder 7-10 Jahre

**Schwer (Hard):**
- Minimax-Algorithmus (unbesiegbar)
- Perfekte Spielstrategie
- Herausforderung für erfahrene Spieler

### Online-Multiplayer

**Matchmaking:**
1. Spieler gibt Alias ein (z.B. "Alex")
2. Drückt "Suche Gegner"
3. Server matched mit nächstem Spieler in Queue
4. Spiel startet automatisch (X beginnt)

**Spielablauf:**
- Echtzeit-Synchronisation (<500ms)
- Turn-basiert (X, dann O)
- Chat mit vordefinierten Nachrichten
- Revanche-Option nach Spielende

**Chat-Nachrichten:**
- "Viel Glück! 🍀"
- "Gut gespielt! 👍"
- "Danke! 😊"
- "Wow! 🤩"
- "Noch mal! 🔄"
- "Muss gehen! 👋"

## 📊 Features im Detail

### Statistiken & Achievements
- **Tracking:** Siege, Niederlagen, Unentschieden, Win-Rate
- **Speicherung:** localStorage (persistent)
- **Achievements:** 15+ freischaltbare Erfolge
- **Spielverlauf:** Historie der letzten 50 Spiele mit Details

### Theme-System
- **Colorful (Default):** Bunte, kindgerechte Farben
- **Dark:** Dunkles Theme für Abendstunden
- **Ocean:** Blau-grüne Meeres-Ästhetik
- **Forest:** Natur-inspirierte Grüntöne
- **Sunset:** Warme Orange-Violett-Töne

### Sound-System
- **Web Audio API:** Synthesized Sounds (keine Dateien)
- **Click Sound:** Bei jedem Zug (200ms)
- **Victory Sound:** C-E-G Akkord (1000ms)
- **Defeat Sound:** Fallender Ton
- **Draw Sound:** Neutraler Ton (440Hz)
- **Lautstärke-Kontrolle:** 0-100% + Mute-Button

## 🔧 Erweiterte Konfiguration

### Environment Variables (Backend)

```bash
# .env (backend/)
PORT=3001                    # Backend Port
CORS_ORIGIN=http://localhost:5173  # Frontend URL
NODE_ENV=production          # production | development
```

### Build Konfiguration

```bash
# Frontend optimieren
npm run build -- --mode production

# Backend optimieren
cd backend
npm run build
NODE_ENV=production npm start
```

## 📚 Dokumentation

- **[Game Design Document (GDD)](docs/GDD.md)** - Vollständige Spieldesign-Spezifikation
- **[Epics & Stories](docs/epics.md)** - Feature-Roadmap und User Stories
- **[CHANGELOG](CHANGELOG.md)** - Version History
- **[Epic 2 Review](docs/EPIC-2-REVIEW.md)** - Multiplayer Features Review

## 🤝 Contributing

Contributions sind willkommen! Bitte beachte:

1. Fork das Repository
2. Erstelle einen Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit deine Änderungen (`git commit -m 'Add some AmazingFeature'`)
4. Push zum Branch (`git push origin feature/AmazingFeature`)
5. Öffne einen Pull Request

**Code Standards:**
- TypeScript strict mode
- ESLint + Prettier
- Aussagekräftige Commit Messages
- Unit Tests für neue Features (geplant)

## 📄 License

This project is for educational purposes.

**Author:** Alex  
**Repository:** [github.com/deltatree/tictactoe](https://github.com/deltatree/tictactoe)  
**Live Demo:** [tictactoe.dtcloud.de](https://tictactoe.dtcloud.de)

## 🙏 Credits

- **React Team:** Für das fantastische UI Framework
- **Socket.IO Team:** Für die WebSocket-Library
- **Vite Team:** Für das blitzschnelle Build Tool
- **canvas-confetti:** Für die Konfetti-Animationen

---

**Built with ❤️ using React + TypeScript + Vite + Socket.IO**
