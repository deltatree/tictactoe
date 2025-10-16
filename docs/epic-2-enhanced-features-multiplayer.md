# Epic 2: Enhanced Features & Multiplayer

**Epic ID:** EPIC-2
**Epic Title:** Enhanced Features & Online Multiplayer
**Epic Goal:** Erweitere das Spiel um erweiterte Features und echten Online-Multiplayer über das Internet

**Value Proposition:**
Spieler können gegen andere echte Menschen weltweit spielen, die Lautstärke anpassen und das Spiel personalisieren - das macht testme zu einem vollwertigen Social Gaming Experience.

**Success Criteria:**
- Sound-Lautstärke einstellbar
- 2-Spieler Lokal-Modus funktioniert
- Online-Multiplayer mit Matchmaking
- Echtzeit-Synchronisation zwischen Spielern
- Stabile Verbindung mit <500ms Latenz
- Theme-Anpassungen verfügbar

**Story Count:** 8
**Estimated Effort:** 15-20 days development + 5 days testing

---

## Stories Overview

### Phase 1: Basic Enhancements (Stories 2.1-2.2)
- Story 2.1: Sound Volume Controls
- Story 2.2: 2-Player Local Mode

### Phase 2: Online Multiplayer Infrastructure (Stories 2.3-2.5)
- Story 2.3: Backend & WebSocket Infrastructure
- Story 2.4: Online Matchmaking System
- Story 2.5: Real-time Online Gameplay

### Phase 3: Polish & Features (Stories 2.6-2.8)
- Story 2.6: Chat & Player Profiles
- Story 2.7: Game History & Statistics
- Story 2.8: Theme Customization

---

## Story 2.1: Sound Volume Controls

**Story ID:** STORY-2.1
**Story Title:** Sound Volume Controls
**Epic:** EPIC-2
**Priority:** High
**Complexity:** Low
**Estimated Effort:** 1 day
**Dependencies:** None

**User Story:**
```
As a player
I want to control the volume of sound effects
So that I can adjust the audio to my preference or mute it completely
```

**Acceptance Criteria:**

**AC1: Volume Slider**
- [ ] Volume slider (0-100%) visible in game
- [ ] Slider positioned in top-right corner or settings area
- [ ] Visual feedback (speaker icon changes based on volume)
- [ ] Real-time volume adjustment (no need to restart)

**AC2: Volume Persistence**
- [ ] Volume setting saved to localStorage
- [ ] Volume restored on page reload
- [ ] Default volume: 50%

**AC3: Mute/Unmute Toggle**
- [ ] Mute button (🔇/🔊) next to slider
- [ ] One-click mute/unmute
- [ ] Mute state persists

**AC4: Volume Application**
- [ ] All sounds respect volume setting (click, win, lose, draw)
- [ ] Smooth volume transitions
- [ ] No sound glitches at 0% or 100%

**Technical Notes:**
- Modify `SoundEffects` class to accept volume parameter
- Add `VolumeControl` component
- Use Web Audio API `gainNode.gain.value`

---

## Story 2.2: 2-Player Local Mode

**Story ID:** STORY-2.2
**Story Title:** 2-Player Local Mode (Human vs Human)
**Epic:** EPIC-2
**Priority:** High
**Complexity:** Medium
**Estimated Effort:** 2 days
**Dependencies:** None

**User Story:**
```
As a player
I want to play against another person on the same device
So that I can enjoy the game with a friend or family member physically present
```

**Acceptance Criteria:**

**AC1: Mode Selection**
- [ ] Game mode selector: "Gegen Computer" / "2 Spieler (Lokal)"
- [ ] Mode selection before game start
- [ ] Can switch modes with "Neues Spiel"

**AC2: Player Names**
- [ ] Optional: Input fields for Player 1 and Player 2 names
- [ ] Default names: "Spieler 1 (X)" and "Spieler 2 (O)"
- [ ] Names displayed during game

**AC3: Turn Indicator**
- [ ] Clear indication whose turn it is
- [ ] "Spieler 1 ist dran" / "Spieler 2 ist dran"
- [ ] Visual highlight of current player

**AC4: Gameplay**
- [ ] Players alternate turns manually
- [ ] No AI interference in 2-player mode
- [ ] Win detection works correctly
- [ ] Statistics track 2-player games separately (optional)

**AC5: Game Flow**
- [ ] Winner announcement shows player name
- [ ] "Neues Spiel" resets for next round
- [ ] Can switch back to AI mode

**Technical Notes:**
- Add `gameMode` state: 'ai' | 'local-2p' | 'online'
- Disable AI logic when mode is 'local-2p'
- Add player name inputs (optional)

---

## Story 2.3: Backend & WebSocket Infrastructure

**Story ID:** STORY-2.3
**Story Title:** Backend & WebSocket Infrastructure for Online Play
**Epic:** EPIC-2
**Priority:** High
**Complexity:** High
**Estimated Effort:** 3-4 days
**Dependencies:** None (but required for 2.4, 2.5, 2.6)

**User Story:**
```
As a developer
I want a scalable backend with real-time WebSocket connections
So that players can communicate and play games online in real-time
```

**Acceptance Criteria:**

**AC1: Backend Technology Stack**
- [ ] Node.js + Express server
- [ ] WebSocket server (Socket.IO)
- [ ] In-memory game state management (Redis optional)
- [ ] RESTful API for game management
- [ ] CORS configured for frontend

**AC2: WebSocket Events**
- [ ] `connect` - Client connects
- [ ] `disconnect` - Client disconnects
- [ ] `join-queue` - Player joins matchmaking
- [ ] `leave-queue` - Player leaves matchmaking
- [ ] `game-found` - Match found
- [ ] `make-move` - Player makes a move
- [ ] `game-over` - Game ends
- [ ] `player-disconnected` - Opponent disconnects

**AC3: Game State Management**
- [ ] Store active games in memory
- [ ] Store waiting players in queue
- [ ] Clean up disconnected players
- [ ] Handle reconnection attempts

**AC4: API Endpoints**
- [ ] `GET /health` - Server health check
- [ ] `GET /stats` - Server statistics (active games, players online)
- [ ] `POST /api/games` - Create private game
- [ ] `GET /api/games/:id` - Get game state

**AC5: Security & Validation**
- [ ] Rate limiting
- [ ] Input validation
- [ ] Move validation (prevent cheating)
- [ ] Player authentication (simple session-based)

**AC6: Deployment**
- [ ] Dockerized backend
- [ ] Environment variables for configuration
- [ ] Ready for deployment (Railway, Render, Heroku)

**Technical Stack:**
```javascript
// Backend
- Node.js 20+
- Express
- Socket.IO
- TypeScript
- Redis (optional)

// Infrastructure
- Docker
- Environment variables
- WebSocket connection management
```

**File Structure:**
```
backend/
├── src/
│   ├── index.ts
│   ├── socket/
│   │   ├── handlers.ts
│   │   └── events.ts
│   ├── game/
│   │   ├── GameManager.ts
│   │   ├── Game.ts
│   │   └── Player.ts
│   ├── matchmaking/
│   │   └── Queue.ts
│   └── utils/
│       └── validation.ts
├── Dockerfile
├── package.json
└── tsconfig.json
```

---

## Story 2.4: Online Matchmaking System

**Story ID:** STORY-2.4
**Story Title:** Online Matchmaking System
**Epic:** EPIC-2
**Priority:** High
**Complexity:** Medium
**Estimated Effort:** 2-3 days
**Dependencies:** Story 2.3

**User Story:**
```
As a player
I want to be automatically matched with another online player
So that I can quickly start playing without manual setup
```

**Acceptance Criteria:**

**AC1: Matchmaking UI**
- [ ] "Online Spielen" button in main menu
- [ ] Matchmaking screen with "Suche Gegner..." message
- [ ] Animated waiting indicator (spinner/dots)
- [ ] "Abbrechen" button to leave queue
- [ ] Player count indicator: "X Spieler online"

**AC2: Queue System**
- [ ] Players join matchmaking queue
- [ ] First-come-first-served matching
- [ ] Match 2 players from queue
- [ ] Remove matched players from queue
- [ ] Handle queue cancellation

**AC3: Match Found**
- [ ] "Gegner gefunden!" notification
- [ ] Show opponent info (name/ID)
- [ ] Countdown before game starts (3 seconds)
- [ ] Automatic transition to game board

**AC4: Connection Status**
- [ ] Connection indicator (connected/disconnected)
- [ ] Reconnection attempts (3x)
- [ ] Timeout handling (30 seconds)
- [ ] Error messages for connection issues

**AC5: Fair Matching**
- [ ] Random assignment of X or O
- [ ] Both players notified who goes first
- [ ] Fair turn distribution over multiple games

**Technical Implementation:**
- WebSocket connection on "Online Spielen" click
- Queue managed on backend
- Emit `join-queue` event
- Listen for `game-found` event
- Handle connection errors gracefully

---

## Story 2.5: Real-time Online Gameplay

**Story ID:** STORY-2.5
**Story Title:** Real-time Online Gameplay & Synchronization
**Epic:** EPIC-2
**Priority:** High
**Complexity:** High
**Estimated Effort:** 3-4 days
**Dependencies:** Story 2.3, 2.4

**User Story:**
```
As a player
I want to play Tic-Tac-Toe in real-time against an online opponent
So that I can enjoy competitive gameplay with people around the world
```

**Acceptance Criteria:**

**AC1: Game Synchronization**
- [ ] Both players see the same game state
- [ ] Moves appear instantly on opponent's board (<500ms)
- [ ] Turn switching synchronized
- [ ] Win/draw detection synchronized

**AC2: Turn Management**
- [ ] Clear indication of whose turn it is
- [ ] Opponent's turn: board disabled, show "Warte auf Gegner..."
- [ ] Your turn: board enabled, show "Du bist dran!"
- [ ] Turn timeout: 60 seconds (configurable)

**AC3: Move Validation**
- [ ] Client-side validation (immediate feedback)
- [ ] Server-side validation (security)
- [ ] Invalid moves rejected with error message
- [ ] Prevent out-of-turn moves

**AC4: Game Over Handling**
- [ ] Winner announcement for both players
- [ ] Draw announcement synchronized
- [ ] Statistics updated on both clients
- [ ] "Rematch" option (return to queue)
- [ ] "Zurück zum Menü" option

**AC5: Disconnect Handling**
- [ ] Opponent disconnect: show "Gegner hat die Verbindung verloren"
- [ ] Wait 30 seconds for reconnection
- [ ] If timeout: award win to remaining player
- [ ] Option to exit or wait

**AC6: Latency & Performance**
- [ ] Move latency < 500ms under normal conditions
- [ ] No lag spikes during gameplay
- [ ] Smooth animations even with latency
- [ ] Visual feedback for pending moves

**Technical Implementation:**
```typescript
// WebSocket Events
- make-move: { gameId, cellIndex }
- move-made: { gameId, cellIndex, player }
- game-over: { gameId, winner, line }
- opponent-disconnected: { gameId }
- opponent-reconnected: { gameId }

// State Management
- Optimistic updates (show move immediately)
- Server confirmation (revert if rejected)
- Conflict resolution (server is authority)
```

---

## Story 2.6: Chat & Player Profiles

**Story ID:** STORY-2.6
**Story Title:** In-game Chat & Simple Player Profiles
**Epic:** EPIC-2
**Priority:** Medium
**Complexity:** Medium
**Estimated Effort:** 2-3 days
**Dependencies:** Story 2.5

**User Story:**
```
As a player
I want to chat with my opponent and see their profile
So that I can have a more social gaming experience
```

**Acceptance Criteria:**

**AC1: Simple Player Profile**
- [ ] Username/display name (auto-generated or custom)
- [ ] Avatar (emoji or letter-based)
- [ ] Win/loss record (from online games)
- [ ] Profile displayed before game starts

**AC2: Quick Chat Messages**
- [ ] Pre-defined messages: "Viel Glück!", "Gut gespielt!", "Danke!", "Rematch?"
- [ ] Click to send, appears for both players
- [ ] Message history (last 5 messages)
- [ ] Timestamps on messages

**AC3: Chat Safety (for kids)**
- [ ] NO free-text chat (to prevent abuse)
- [ ] Only pre-approved messages
- [ ] Report button (future: moderation)
- [ ] Family-friendly messages only

**AC4: Visual Design**
- [ ] Chat panel: collapsible, bottom-right
- [ ] Speech bubbles for messages
- [ ] Smooth animations
- [ ] Doesn't obstruct game board

**Technical Notes:**
- WebSocket event: `send-message: { gameId, messageId }`
- Store messages in game state (last 10)
- Auto-generated usernames: "Player_1234"

---

## Story 2.7: Game History & Enhanced Statistics

**Story ID:** STORY-2.7
**Story Title:** Game History & Enhanced Statistics
**Epic:** EPIC-2
**Priority:** Medium
**Complexity:** Medium
**Estimated Effort:** 2 days
**Dependencies:** Story 2.5

**User Story:**
```
As a player
I want to see my game history and detailed statistics
So that I can track my progress and improvement
```

**Acceptance Criteria:**

**AC1: Enhanced Statistics**
- [ ] Separate stats for: AI games, Local 2P, Online games
- [ ] Win rate per game mode
- [ ] Current win streak
- [ ] Longest win streak
- [ ] Total games played

**AC2: Game History**
- [ ] Last 10 games displayed
- [ ] Show: opponent, result, date/time, game mode
- [ ] Click to see game replay (optional)
- [ ] Filter by game mode

**AC3: Achievements (Basic)**
- [ ] "Erster Sieg" - Win first game
- [ ] "Siegesserie" - Win 3 games in a row
- [ ] "Meister" - Win 10 online games
- [ ] "Veteran" - Play 50 games total
- [ ] Display unlocked achievements

**AC4: Statistics Visualization**
- [ ] Win rate progress bar
- [ ] Pie chart: Win/Loss/Draw distribution
- [ ] Line graph: Performance over time (optional)

**AC5: Data Persistence**
- [ ] localStorage for local games
- [ ] Backend storage for online games
- [ ] Sync across devices (if logged in)

**Technical Notes:**
- Add statistics API endpoint
- Store game history in backend
- Use Chart.js or similar for visualizations

---

## Story 2.8: Theme Customization

**Story ID:** STORY-2.8
**Story Title:** Theme Customization & Dark Mode
**Epic:** EPIC-2
**Priority:** Low (Nice to Have)
**Complexity:** Low
**Estimated Effort:** 1-2 days
**Dependencies:** None

**User Story:**
```
As a player
I want to customize the game's appearance
So that I can play in my preferred visual style
```

**Acceptance Criteria:**

**AC1: Theme Selector**
- [ ] Settings menu with theme options
- [ ] Themes: "Bunt" (default), "Dunkel", "Ozean", "Wald"
- [ ] Theme preview before selection
- [ ] Apply theme immediately

**AC2: Dark Mode**
- [ ] Dark background (instead of gradient)
- [ ] Light text on dark background
- [ ] Darker game board
- [ ] Reduced eye strain

**AC3: Color Schemes**
- [ ] "Bunt": Current orange/purple gradient
- [ ] "Dunkel": Dark gray/black
- [ ] "Ozean": Blue/teal theme
- [ ] "Wald": Green/brown theme

**AC4: Theme Persistence**
- [ ] Theme saved to localStorage
- [ ] Restored on page reload
- [ ] Synced across tabs

**AC5: System Preference**
- [ ] Detect system dark mode preference
- [ ] Auto-apply dark theme if system is dark
- [ ] Option to override system preference

**Technical Notes:**
- CSS variables for colors
- Theme class on body element
- `prefers-color-scheme` media query

---

## Epic 2: Implementation Order

### Phase 1: Basic Enhancements (Week 1)
1. **Story 2.1** - Sound Volume (1 day)
2. **Story 2.2** - Local 2-Player (2 days)

### Phase 2: Multiplayer Infrastructure (Week 2-3)
3. **Story 2.3** - Backend & WebSocket (3-4 days)
4. **Story 2.4** - Matchmaking (2-3 days)
5. **Story 2.5** - Online Gameplay (3-4 days)

### Phase 3: Polish & Social (Week 4)
6. **Story 2.6** - Chat & Profiles (2-3 days)
7. **Story 2.7** - History & Stats (2 days)
8. **Story 2.8** - Themes (1-2 days)

---

## Technical Architecture for Online Multiplayer

### Frontend Changes
```
src/
├── contexts/
│   └── WebSocketContext.tsx
├── components/
│   ├── OnlineGame/
│   │   ├── Matchmaking.tsx
│   │   ├── OnlineBoard.tsx
│   │   ├── ConnectionStatus.tsx
│   │   └── Chat.tsx
│   └── GameModeSelector.tsx
├── hooks/
│   ├── useWebSocket.ts
│   └── useOnlineGame.ts
└── services/
    └── api.ts
```

### Backend Structure
```
backend/
├── src/
│   ├── index.ts                      # Express + Socket.IO Server
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
│   └── db/
│       └── models.ts (optional)
├── package.json
└── tsconfig.json
```

### Unified Docker Architecture
```
# Projektstruktur mit Backend
testme/
├── frontend/                         # Existing React App
│   ├── src/
│   ├── package.json
│   └── vite.config.ts
├── backend/                          # NEW: Node.js Backend
│   ├── src/
│   ├── package.json
│   └── tsconfig.json
├── nginx.conf                        # Updated: Reverse Proxy Config
├── Dockerfile                        # Updated: Multi-stage with Backend
├── docker-compose.yml                # Optional: Local development
└── .github/workflows/
    └── docker-build.yml              # Updated: Build unified image

# nginx.conf Route-Konfiguration
location / {
    root /usr/share/nginx/html;
    try_files $uri $uri/ /index.html;
}

location /api/ {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
}

location /socket.io/ {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
}
```

**Dockerfile Strategie (Multi-stage):**
```dockerfile
# Stage 1: Build Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Build Backend
FROM node:20-alpine AS backend-builder
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci
COPY backend/ .
RUN npm run build

# Stage 3: Production
FROM nginx:alpine
# Install Node.js for Backend
RUN apk add --no-cache nodejs npm supervisor

# Copy Frontend build
COPY --from=frontend-builder /app/frontend/dist /usr/share/nginx/html

# Copy Backend build
COPY --from=backend-builder /app/backend/dist /app/backend
COPY --from=backend-builder /app/backend/node_modules /app/backend/node_modules

# Copy nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Supervisor config (run nginx + node.js)
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

EXPOSE 80
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
```

### Deployment Strategy

**Single Docker Image Approach:**
- **Architecture:** Unified container mit nginx + Node.js Backend
- **Port:** Ein einziger Port (80/443) für Frontend + Backend + WebSocket
- **Routing:** nginx als Reverse Proxy
  - `/` → Statisches Frontend (React Build)
  - `/api/*` → Node.js Backend (REST API)
  - `/socket.io/*` → WebSocket Server (Socket.IO)
- **Build Process:** Multi-stage Dockerfile
  1. Stage 1: Build Frontend (React + Vite)
  2. Stage 2: Build Backend (Node.js + TypeScript)
  3. Stage 3: Production (nginx + Node.js als Supervisor/Process Manager)
- **Hosting:** Railway/Render/Heroku oder beliebiger Container-Host
- **Database:** Optional extern (PostgreSQL/MongoDB) oder separater Container

---

## Success Metrics

**After Epic 2 Completion:**
- [ ] Online games playable with <500ms latency
- [ ] 95% uptime for backend
- [ ] <5% disconnect rate
- [ ] Player retention: 40% return within 7 days
- [ ] Average 5+ games per session
- [ ] Positive user feedback on multiplayer

---

## Risk Register

### Technical Risks
1. **WebSocket scaling:** May need load balancer for many concurrent games
2. **Latency issues:** Geography affects connection quality
3. **Cheating:** Need server-side validation

### Mitigation
- Start with simple in-memory state
- Use Socket.IO for automatic reconnection
- All moves validated server-side
- Rate limiting to prevent spam

---

**Epic Status:** Planned
**Ready for Implementation:** After v1.0.0 Launch
**Estimated Total Time:** 15-20 days development + 5 days testing = 4-5 weeks

---

_End of Epic 2 Planning Document_
