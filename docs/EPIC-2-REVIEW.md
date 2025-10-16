# Epic 2 - Stories Übersicht zur Abnahme

**Projekt:** testme - Tic-Tac-Toe
**Epic:** EPIC-2 - Enhanced Features & Online Multiplayer
**Datum:** 2025-10-16
**Status:** ⏳ Zur Abnahme vorgelegt

---

## 📋 Epic 2 Zusammenfassung

**Ziel:** Erweitere das Spiel um Sound-Kontrolle, lokalen 2-Spieler Modus, und vollständigen Online-Multiplayer über das Internet.

**Story Count:** 8 Stories
**Estimated Effort:** 20-25 Arbeitstage (4-5 Wochen)
**Priority:** High (Stories 2.1-2.5), Medium (2.6-2.7), Low (2.8)

---

## 🎯 Stories im Überblick

| Story | Titel | Komplexität | Aufwand | Priorität | Dependencies |
|-------|-------|-------------|---------|-----------|--------------|
| 2.1 | Sound Volume Controls | Low | 1 Tag | High | - |
| 2.2 | 2-Player Local Mode | Medium | 2 Tage | High | - |
| 2.3 | Backend & WebSocket Infrastructure | High | 3-4 Tage | High | - |
| 2.4 | Online Matchmaking System | Medium | 2-3 Tage | High | 2.3 |
| 2.5 | Real-time Online Gameplay | High | 3-4 Tage | High | 2.3, 2.4 |
| 2.6 | Chat & Player Profiles | Medium | 2-3 Tage | Medium | 2.5 |
| 2.7 | Game History & Statistics | Medium | 2 Tage | Medium | 2.5 |
| 2.8 | Theme Customization | Low | 1-2 Tage | Low | - |

**Total:** 16-21 Tage (3-4 Wochen) Entwicklung + 4-5 Tage Testing = **4-5 Wochen**

---

## 📖 Story Details

### **Story 2.1: Sound Volume Controls** 
**Aufwand:** 1 Tag | **Priorität:** High

**Was wird implementiert:**
- Volume Slider (0-100%) mit visueller Anzeige
- Mute/Unmute Toggle Button (🔇/🔊)
- Persistenz der Lautstärke in localStorage
- Alle Sound-Effekte respektieren die Einstellung

**User Value:** Spieler können Sounds nach Belieben anpassen oder stumm schalten.

---

### **Story 2.2: 2-Player Local Mode**
**Aufwand:** 2 Tage | **Priorität:** High

**Was wird implementiert:**
- Spielmodus-Auswahl: "Gegen Computer" / "2 Spieler (Lokal)"
- Optionale Spielernamen-Eingabe
- Abwechselnde Züge zwischen zwei menschlichen Spielern
- Gewinner-Anzeige mit Spielernamen
- Separate Statistik-Tracking (optional)

**User Value:** Freunde/Familie können auf einem Gerät gegeneinander spielen.

---

### **Story 2.3: Backend & WebSocket Infrastructure** ⭐ KRITISCH
**Aufwand:** 3-4 Tage | **Priorität:** High

**Was wird implementiert:**
- **Backend:** Node.js + Express + TypeScript
- **WebSocket:** Socket.IO für Real-time Kommunikation
- **Game State Management:** In-Memory (Redis optional)
- **API Endpoints:** Health, Stats, Game Management
- **Security:** Rate Limiting, Input Validation, Move Validation
- **Deployment:** Docker-ready, ENV-Konfiguration

**WebSocket Events:**
- `connect`, `disconnect`
- `join-queue`, `leave-queue`
- `game-found`, `make-move`, `game-over`
- `player-disconnected`, `player-reconnected`

**Tech Stack:**
```
Backend: Node.js 20+ + Express + Socket.IO + TypeScript
Database: Optional (PostgreSQL/MongoDB für Prod)
Deployment: Railway/Render/Heroku
```

**User Value:** Ermöglicht alle Online-Features (2.4, 2.5, 2.6, 2.7).

---

### **Story 2.4: Online Matchmaking System**
**Aufwand:** 2-3 Tage | **Priorität:** High | **Requires:** 2.3

**Was wird implementiert:**
- "Online Spielen" Button im Hauptmenü
- Matchmaking-Screen mit Warteanimation
- Queue-System (First-Come-First-Served)
- "Gegner gefunden!" Benachrichtigung
- Connection Status Indicator
- Abbrechen-Option
- "X Spieler online" Anzeige

**User Value:** Spieler werden automatisch mit Gegnern gematched.

---

### **Story 2.5: Real-time Online Gameplay** ⭐ KRITISCH
**Aufwand:** 3-4 Tage | **Priorität:** High | **Requires:** 2.3, 2.4

**Was wird implementiert:**
- Echtzeit-Synchronisation des Spielstands
- Turn Management (Wer ist dran?)
- Move Validation (Client & Server)
- Latenz-Optimierung (<500ms)
- Disconnect Handling (30s Reconnect-Window)
- Game Over Synchronisation
- Rematch-Option

**Performance Target:**
- Move Latency: <500ms
- Reconnect: Automatisch innerhalb 30s
- Fairness: Server ist Authority

**User Value:** Spieler können in Echtzeit gegeneinander antreten.

---

### **Story 2.6: Chat & Player Profiles**
**Aufwand:** 2-3 Tage | **Priorität:** Medium | **Requires:** 2.5

**Was wird implementiert:**
- Einfache Player Profile (Name, Avatar, Record)
- Quick-Chat mit vordefinierten Nachrichten
- **KEIN Freitext-Chat** (Kinderschutz!)
- Nachrichten: "Viel Glück!", "Gut gespielt!", "Danke!", "Rematch?"
- Chat-Panel (collapsible)

**Sicherheit:** Nur vordefinierte, familienfreundliche Nachrichten.

**User Value:** Soziale Interaktion ohne Missbrauchsrisiko.

---

### **Story 2.7: Game History & Enhanced Statistics**
**Aufwand:** 2 Tage | **Priorität:** Medium | **Requires:** 2.5

**Was wird implementiert:**
- Separate Stats: AI, Local 2P, Online
- Game History (letzte 10 Spiele)
- Win Streaks (Current & Longest)
- Basis-Achievements:
  - "Erster Sieg"
  - "Siegesserie" (3 in Folge)
  - "Meister" (10 Online Wins)
  - "Veteran" (50 Spiele)
- Visualisierungen (Graphen)

**User Value:** Spieler sehen ihren Fortschritt und Erfolge.

---

### **Story 2.8: Theme Customization**
**Aufwand:** 1-2 Tage | **Priorität:** Low (Nice to Have)

**Was wird implementiert:**
- Theme Selector im Settings-Menü
- 4 Themes: Bunt (default), Dunkel, Ozean, Wald
- Dark Mode mit System-Preference-Erkennung
- Theme Persistenz in localStorage
- Sofortige Anwendung ohne Reload

**User Value:** Personalisierung und Augen-freundlichkeit.

---

## 🏗️ Implementierungs-Phasen

### **Phase 1: Basic Enhancements (Woche 1)**
```
Tag 1:     Story 2.1 (Sound Volume)
Tag 2-3:   Story 2.2 (Local 2-Player)
```
**Deliverable:** Sound-Kontrolle + Lokaler Multiplayer funktioniert

---

### **Phase 2: Backend & Matchmaking (Woche 2)**
```
Tag 1-4:   Story 2.3 (Backend Infrastructure)
Tag 5-7:   Story 2.4 (Matchmaking System)
```
**Deliverable:** Backend deployed, Matchmaking funktioniert

---

### **Phase 3: Online Gameplay (Woche 3)**
```
Tag 1-4:   Story 2.5 (Real-time Gameplay)
Tag 5-7:   Story 2.6 (Chat & Profiles)
```
**Deliverable:** Vollständiger Online-Multiplayer spielbar

---

### **Phase 4: Polish & Stats (Woche 4)**
```
Tag 1-2:   Story 2.7 (Game History & Stats)
Tag 3-4:   Story 2.8 (Theme Customization)
Tag 5:     Final Testing & Bug Fixes
```
**Deliverable:** Polished, Feature-complete Epic 2

---

## 🎯 Success Criteria (Epic 2 Done)

### Funktional
- [x] Sound-Lautstärke einstellbar und persistent
- [x] 2-Spieler Lokal-Modus funktioniert einwandfrei
- [x] Online-Matchmaking matcht Spieler in <10 Sekunden
- [x] Online-Spiele laufen mit <500ms Latency
- [x] Disconnect-Handling funktioniert (Reconnect innerhalb 30s)
- [x] Chat mit sicheren, vordefinierten Nachrichten
- [x] Game History und Enhanced Statistics verfügbar
- [x] Theme-Wechsel funktioniert ohne Reload

### Performance
- [x] Backend Uptime: >95%
- [x] WebSocket Latency: <500ms (95th percentile)
- [x] Disconnect Rate: <5%
- [x] Matchmaking Time: <10 Sekunden

### Quality
- [x] Alle Stories getestet und dokumentiert
- [x] Backend deployed und stabil
- [x] Zero critical bugs
- [x] User-friendly error handling

---

## 🔧 Technische Architektur

### Frontend Additions
```typescript
src/
├── contexts/
│   └── WebSocketContext.tsx          // NEW
├── components/
│   ├── VolumeControl/                 // NEW (2.1)
│   ├── GameModeSelector/              // NEW (2.2)
│   ├── OnlineGame/                    // NEW (2.4, 2.5)
│   │   ├── Matchmaking.tsx
│   │   ├── OnlineBoard.tsx
│   │   ├── ConnectionStatus.tsx
│   │   └── Chat.tsx                   // NEW (2.6)
│   ├── GameHistory/                   // NEW (2.7)
│   └── ThemeSelector/                 // NEW (2.8)
├── hooks/
│   ├── useWebSocket.ts                // NEW
│   └── useOnlineGame.ts               // NEW
└── services/
    └── api.ts                         // NEW
```

### Backend (Komplett NEU)
```typescript
backend/
├── src/
│   ├── index.ts                       // Express + Socket.IO Server
│   ├── socket/
│   │   ├── connection.ts
│   │   ├── handlers.ts
│   │   └── events.ts
│   ├── game/
│   │   ├── GameManager.ts
│   │   ├── Game.ts
│   │   └── Player.ts
│   ├── matchmaking/
│   │   └── Queue.ts
│   ├── api/
│   │   ├── routes.ts
│   │   └── controllers.ts
│   └── db/                            // Optional
│       └── models.ts
├── package.json
└── tsconfig.json
```

### Unified Docker Deployment ⭐

**Konzept:** Single Docker Image mit Frontend + Backend über einen Port

```
┌─────────────────────────────────────┐
│       Docker Container              │
│                                     │
│  ┌──────────────────────────────┐  │
│  │         nginx:alpine         │  │
│  │  Port 80/443 (Reverse Proxy) │  │
│  └──────────┬───────────────────┘  │
│             │                       │
│    ┌────────┴────────┐             │
│    ▼                 ▼             │
│  Static          Node.js           │
│  Frontend        Backend            │
│  (React)        (Express+Socket.IO)│
│  /               /api/* /socket.io/*│
└─────────────────────────────────────┘
```

**Vorteile:**
- ✅ Ein Port für alles (HTTPS 443)
- ✅ Keine CORS-Probleme (gleicher Origin)
- ✅ Einfaches Deployment (ein Container)
- ✅ Gleicher Workflow wie v1.0.0 (bekannt)
- ✅ WebSocket über nginx Reverse Proxy (stabil)

**nginx.conf Routing:**
```nginx
location / {
    root /usr/share/nginx/html;
    try_files $uri $uri/ /index.html;
}

location /api/ {
    proxy_pass http://localhost:3000;
}

location /socket.io/ {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
}
```

**Multi-stage Dockerfile:**
```dockerfile
# Stage 1: Build Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
RUN npm run build

# Stage 2: Build Backend
FROM node:20-alpine AS backend-builder
WORKDIR /app/backend
RUN npm run build

# Stage 3: Production (nginx + Node.js)
FROM nginx:alpine
RUN apk add --no-cache nodejs npm supervisor

# Copy builds
COPY --from=frontend-builder /app/dist /usr/share/nginx/html
COPY --from=backend-builder /app/backend /app/backend

# Copy configs
COPY nginx.conf /etc/nginx/nginx.conf
COPY supervisord.conf /etc/supervisor/

EXPOSE 80
CMD ["supervisord"]
```

**Deployment:**
- **Platform:** Railway/Render/Heroku (Container-Support)
- **CI/CD:** GitHub Actions (wie v1.0.0, erweitert)
- **Trigger:** Semantic Version Tags (v01.01.00+)
- **Registry:** GitHub Container Registry
- **Database:** Optional extern (PostgreSQL/MongoDB)

---

## 💰 Aufwands-Schätzung

| Phase | Stories | Entwicklung | Testing | Total |
|-------|---------|-------------|---------|-------|
| Phase 1 | 2.1-2.2 | 3 Tage | 0.5 Tage | 3.5 Tage |
| Phase 2 | 2.3-2.4 | 7 Tage | 1.5 Tage | 8.5 Tage |
| Phase 3 | 2.5-2.6 | 7 Tage | 1.5 Tage | 8.5 Tage |
| Phase 4 | 2.7-2.8 | 3 Tage | 0.5 Tage | 3.5 Tage |
| **TOTAL** | **8 Stories** | **20 Tage** | **4 Tage** | **24 Tage** |

**Timeline:** 4-5 Wochen (bei Vollzeit-Entwicklung)

---

## ⚠️ Risiken & Mitigationen

### Risiko 1: Backend Skalierung
**Problem:** Viele gleichzeitige Spieler könnten Backend überlasten.
**Mitigation:** 
- Start mit in-memory state
- Redis für Session-Management (Phase 2)
- Load Balancer erst bei >1000 concurrent users

### Risiko 2: WebSocket Latency
**Problem:** Geografische Distanz = höhere Latenz.
**Mitigation:**
- Socket.IO mit automatischer Reconnection
- Optimistic Updates (sofortiges visuelles Feedback)
- Server-Autorität für finale Validierung

### Risiko 3: Cheating
**Problem:** Spieler könnten versuchen zu schummeln.
**Mitigation:**
- Alle Moves server-seitig validiert
- Rate Limiting
- Move-History logging

### Risiko 4: Child Safety (Chat)
**Problem:** Freitext-Chat könnte missbraucht werden.
**Mitigation:**
- **NUR vordefinierte Nachrichten!**
- Keine Freitext-Eingabe
- Report-Button für zukünftige Moderation

---

## ✅ Abnahme-Checkliste

### Vor Start der Implementierung
- [ ] Epic 2 Stories review & approval
- [ ] Backend-Technologie-Stack bestätigt (Node.js + Socket.IO)
- [ ] Hosting-Plattform ausgewählt (Railway/Render/Heroku)
- [ ] Budget für Hosting geklärt
- [ ] Timeframe realistisch (4-5 Wochen)

### Pro Story
- [ ] Story klar formuliert und verständlich
- [ ] Acceptance Criteria eindeutig
- [ ] Dependencies identifiziert
- [ ] Aufwand realistisch geschätzt

### Nach Epic 2 Completion
- [ ] Alle 8 Stories complete
- [ ] Backend deployed und stabil
- [ ] Online Multiplayer funktioniert
- [ ] Performance-Targets erreicht
- [ ] Dokumentation aktualisiert

---

## 🚀 Empfohlener Start

1. **Release v1.0.0 erst abschließen** (Tag erstellen + pushen)
2. **User Testing durchführen** (1-2 Wochen Feedback sammeln)
3. **Epic 2 starten mit Story 2.1** (Quick Win: Sound Controls)
4. **Backend parallel planen** (Hosting, Tech Stack finalisieren)
5. **Phase für Phase umsetzen**

---

## 📝 Offene Fragen zur Klärung

1. **Hosting Budget:** Wie viel Budget für Container-Hosting (Railway/Render)? (~$5-20/Monat)
2. **Database:** PostgreSQL/MongoDB für Prod oder weiterhin in-memory (Redis)?
3. **Domain:** Gleiche Domain wie v1.0.0, nur Backend erweitert (CORS-frei!)
4. **Analytics:** Tracking für Online-Games gewünscht (Matomo/Plausible)?
5. **Monetization:** Zukunfts-Plan für Revenue (Ads/Premium)?
6. **Process Manager:** Supervisor oder PM2 im Docker Container?

---

## 🎯 Empfehlung

**Status:** ✅ **Stories sind gut durchdacht und ready für Abnahme**

**Empfohlene Reihenfolge:**
1. Story 2.1-2.2 zuerst (Quick Wins, kein Backend nötig)
2. Backend-Setup parallel planen
3. Stories 2.3-2.5 als Block (Online Multiplayer Core)
4. Stories 2.6-2.8 als Polish (basierend auf User Feedback)

**Next Step nach Abnahme:** 
- Finalisiere Backend Tech Stack
- Wähle Hosting-Plattform
- Beginne mit Story 2.1

---

**Zur Abnahme vorgelegt am:** 2025-10-16
**Wartet auf:** Approval & Feedback

---

_Ende der Abnahme-Dokumentation_
