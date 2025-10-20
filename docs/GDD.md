# Game Design Document: Connect Four

**Version:** 1.0
**Datum:** 20. Oktober 2025
**Projekt-Typ:** Brownfield (Transformation von Tic-Tac-Toe)
**Projekt-Level:** 2 (Medium Complexity)

---

## 1. Game Overview

### 1.1 Game Concept
**Connect Four** (Vier Gewinnt) ist ein klassisches 2-Spieler-Strategiespiel. Spieler lassen abwechselnd farbige Spielsteine in ein vertikales 7×6-Gitter fallen, wobei die Schwerkraft die Steine nach unten zieht. Ziel ist es, vier eigene Steine in einer Reihe zu verbinden (horizontal, vertikal oder diagonal).

### 1.2 Platforms
- **Primary:** Web Browser (Desktop & Mobile)
- **Deployment:** Docker, Cloud-ready
- **Tech Stack:** React 19, TypeScript, Socket.IO, Express

### 1.3 Target Audience
- **Age:** 8+ Jahre
- **Experience:** Casual bis Core Gamer
- **Session Length:** 2-5 Minuten pro Spiel

---

## 2. Core Gameplay

### 2.1 Game Pillars
1. **Strategic Depth:** Vorausplanung und Taktik
2. **Quick Sessions:** Schnelle, wiederholbare Matches
3. **Social Play:** Multiplayer-Fokus mit Chat

### 2.2 Gameplay Loop
```
Spieler wählt Spalte → Stein fällt nach unten → Gegner am Zug → 
Wiederholung bis Sieg/Unentschieden → Rematch-Option
```

### 2.3 Win/Loss Conditions
- **Win:** 4 eigene Steine in einer Reihe (horizontal, vertikal, diagonal)
- **Draw:** Alle 42 Felder belegt, kein Spieler hat 4 in Reihe
- **Loss:** Gegner erreicht 4 in Reihe zuerst

---

## 3. Game Mechanics

### 3.1 Board Structure
- **Grid Size:** 7 Spalten × 6 Reihen = 42 Felder
- **Gravity Mechanic:** Steine fallen immer zum tiefsten freien Feld einer Spalte
- **Turn Order:** Abwechselnd, Spieler 1 (z.B. Rot) beginnt

### 3.2 Core Mechanics
| Mechanic | Description |
|----------|-------------|
| **Column Selection** | Spieler klickt auf Spalte oder Spalten-Header |
| **Gravity Drop** | Stein fällt animiert zur untersten freien Position |
| **Win Detection** | Prüfung nach jedem Zug auf 4-in-a-row (4 Richtungen) |
| **Invalid Move** | Volle Spalten können nicht gewählt werden |

### 3.3 Controls
- **Desktop:** Mausklick auf Spalte
- **Mobile:** Touch auf Spalte
- **Keyboard:** Pfeiltasten + Enter (optional)

---

## 4. Game Modes

### 4.1 Local Mode (Player vs Player)
- 2 Spieler am gleichen Gerät
- Hot-Seat-Modus
- Sofortiger Start, keine Netzwerkverbindung

### 4.2 AI Mode (Player vs Computer)
- 3 Schwierigkeitsgrade:
  - **Easy:** Zufällige gültige Züge
  - **Medium:** Blockiert Spieler-Gewinne, sucht eigene Gewinnzüge
  - **Hard:** Minimax-Algorithmus mit Lookahead (4-6 Züge)

### 4.3 Online Mode (Player vs Player Remote)
- **Matchmaking:** Automatische Spieler-Paarung via Warteschlange
- **Real-time:** WebSocket-basiert (Socket.IO)
- **Quick Chat:** Vordefinierte Nachrichten während des Spiels
- **Reconnection:** Graceful Disconnect-Handling

---

## 5. Features (von Tic-Tac-Toe übernommen)

### 5.1 UI/UX Features
- **Theme System:** Hell/Dunkel-Modi
- **Sound Effects:** Move, Win, Loss, Draw
- **Animations:** Stein-Fall-Animation, Gewinn-Highlight
- **Statistics:** Wins/Losses/Draws pro Modus

### 5.2 Online Features
- **Player Names:** Anpassbare Namen während Matchmaking
- **Quick Chat:** Vordefinierte Nachrichten (GG, Good luck, etc.)
- **Opponent Info:** Name und Status des Gegners sichtbar

---

## 6. Technical Considerations

### 6.1 Algorithm Changes (vs Tic-Tac-Toe)
| Aspect | Tic-Tac-Toe | Connect Four |
|--------|-------------|--------------|
| **Board Size** | 3×3 (9 cells) | 7×6 (42 cells) |
| **Win Condition** | 3 in row (8 patterns) | 4 in row (69 patterns) |
| **Move Validation** | Any empty cell | Only valid if column not full |
| **Gravity** | None | Stones fall to lowest position |
| **AI Complexity** | Simple (low branching) | Higher (more positions) |

### 6.2 Key Implementation Areas
1. **Game Logic:** `gameLogic.ts` - Win detection, gravity simulation
2. **AI Player:** `aiPlayer.ts` - Minimax mit Connect-Four-Heuristik
3. **Board Component:** `Board.tsx` - 7×6 Grid-Rendering
4. **Backend:** `Game.ts` - Server-seitige Validierung & Zustandsverwaltung

---

## 7. Epic Breakdown

### Epic 1: Core Game Logic
- Implement 7×6 board structure
- Gravity-based move validation
- 4-in-a-row win detection (horizontal, vertical, diagonal)

### Epic 2: UI Transformation
- Board component redesign (7×6 grid)
- Column selection interface
- Gravity drop animation
- Win highlighting (4 cells)

### Epic 3: AI Adaptation
- Easy AI (random valid moves)
- Medium AI (defensive + offensive patterns)
- Hard AI (Minimax with Connect Four evaluation)

### Epic 4: Online Mode Adaptation
- Backend game state for 7×6 board
- Move validation with gravity
- Win detection server-side
- Multiplayer synchronization

### Epic 5: Feature Preservation
- Theme system adaptation
- Sound effects mapping
- Statistics migration
- Chat system (unchanged)

---

## 8. Success Metrics

- ✅ All 3 game modes functional
- ✅ Win detection 100% accurate
- ✅ AI difficulty levels distinguishable
- ✅ Online mode stable (no desyncs)
- ✅ All existing features preserved

---

## 9. Out of Scope

- Tournament mode
- Leaderboards
- Advanced AI (neural network)
- Custom board sizes
- Power-ups or special rules

---

_Generiert durch BMad GDD Workflow (Express) v1.0_
