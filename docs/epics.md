# Epics & Stories: testme - Tic-Tac-Toe

**Project:** testme
**Date:** 2025-10-16
**Author:** Alex
**Project Level:** 1 (Small coherent feature - 2-3 stories, 1 epic)

---

## Epic Overview

### Epic 1: Core Tic-Tac-Toe Game Implementation

**Epic ID:** EPIC-1
**Epic Title:** Core Game Implementation
**Epic Goal:** Implement a fully functional, child-friendly Tic-Tac-Toe web game with three AI difficulty levels

**Value Proposition:**
Children can play an engaging, educational strategy game that helps develop critical thinking skills in a safe, ad-free environment.

**Success Criteria:**
- Game is playable from start to finish
- All three difficulty levels work correctly
- Responsive across desktop, tablet, and mobile
- Deployed and accessible via web browser
- Meets performance targets (< 2s load time)

**Story Count:** 7 (including bonus features + deployment + bugfixes)
**Estimated Effort:** 7.5-10.5 days development + testing + deployment + bugfixes
**Status:** ✅ COMPLETE (2025-10-16)
**Ready for Release:** v01.00.00

---

### Epic 2: Enhanced Features & Online Multiplayer

**Epic ID:** EPIC-2
**Epic Title:** Enhanced Features & Online Multiplayer
**Epic Goal:** Erweitere das Spiel um Sound-Kontrolle, lokalen 2-Spieler Modus, und vollständigen Online-Multiplayer über das Internet

**Value Proposition:**
Spieler können nicht nur gegen die KI spielen, sondern auch lokal oder online gegen Freunde antreten, mit personalisierten Einstellungen und sozialer Interaktion.

**Success Criteria:**
- Sound-Lautstärke einstellbar und persistent
- 2-Spieler Lokal-Modus funktioniert einwandfrei
- Online-Matchmaking matcht Spieler in <10 Sekunden
- Online-Spiele laufen mit <500ms Latency
- Backend Uptime >95%
- Chat mit sicheren, vordefinierten Nachrichten
- Theme-Wechsel funktioniert ohne Reload

**Story Count:** 8
**Estimated Effort:** 20 Tage Entwicklung + 4 Tage Testing = 24 Arbeitstage (4-5 Wochen)
**Status:** 🚀 IN PROGRESS (Started: 2025-10-16)
**Target Release:** v02.00.00 (Mid-November 2025)

**Progress:** 0/8 Stories Complete (0%)

| Story | Title | Status | Priority | Effort | Week |
|-------|-------|--------|----------|--------|------|
| 2.1 | Sound Volume Controls | 🚀 In Progress | High | 1 Tag | Week 6 |
| 2.2 | 2-Player Local Mode | ⏳ Planned | High | 2 Tage | Week 6 |
| 2.3 | Backend & WebSocket Infrastructure | ⏳ Planned | High | 3-4 Tage | Week 7 |
| 2.4 | Online Matchmaking System | ⏳ Planned | High | 2-3 Tage | Week 7 |
| 2.5 | Real-time Online Gameplay | ⏳ Planned | High | 3-4 Tage | Week 8 |
| 2.6 | Chat & Player Profiles | ⏳ Planned | Medium | 2-3 Tage | Week 8 |
| 2.7 | Game History & Statistics | ⏳ Planned | Medium | 2 Tage | Week 9 |
| 2.8 | Theme Customization | ⏳ Planned | Low | 1-2 Tage | Week 9 |

---

## Epic 1 Stories

### Story 1.1: Basic Game Board & Player Moves

**Story ID:** STORY-1.1
**Story Title:** Basic Game Board & Player Moves
**Epic:** EPIC-1
**Priority:** High (Must Have)
**Complexity:** Medium
**Estimated Effort:** 1-2 days

**User Story:**
```
As a child player
I want to see a colorful 3x3 game board and place my X marks by clicking cells
So that I can start playing the game immediately
```

**Acceptance Criteria:**

✅ **AC1: Board Rendering**
- [ ] 3x3 grid renders correctly with 9 clickable cells
- [ ] Each cell is clearly bordered and visually distinct
- [ ] Cell size is appropriate: ~100px x 100px on desktop, ~80px x 80px on mobile
- [ ] Grid uses bright, child-friendly colors (white board, purple/orange gradient background)

✅ **AC2: Player Interaction**
- [ ] Player can click any empty cell to place an X symbol
- [ ] Only empty cells are clickable (occupied cells cannot be clicked)
- [ ] X symbol appears immediately in blue (#3B82F6) when clicked
- [ ] Visual feedback on hover (desktop): cell highlights with subtle glow

✅ **AC3: Touch Support**
- [ ] Touch interactions work correctly on mobile/tablet devices
- [ ] Touch targets are min. 80x80px for accessibility
- [ ] No double-tap zoom issues on mobile

✅ **AC4: State Management**
- [ ] Game state correctly tracks which cells are occupied
- [ ] Board state persists during a single game session
- [ ] "New Game" button clears the board and resets state

✅ **AC5: Responsive Design**
- [ ] Board scales correctly on desktop (1920x1080 min)
- [ ] Board scales correctly on tablet (768x1024)
- [ ] Board scales correctly on mobile (375x667 min - iPhone SE)
- [ ] Layout remains centered and playable at all sizes
- [ ] No horizontal scrolling required

✅ **AC6: Visual Feedback**
- [ ] Hover state shows cell highlight (desktop only)
- [ ] Click/tap triggers brief scale animation (cell "presses down")
- [ ] Turn indicator shows "Du bist dran! (X)"

**Technical Notes:**
- Use React with TypeScript
- Component structure: Board → Cell components
- State management via React Context or useState
- CSS Modules or Tailwind for styling
- SVG for X symbols (scalable, crisp rendering)

**Dependencies:**
- None (first story)

**Testing Requirements:**
- Unit tests for board state management
- Unit tests for cell click handling
- E2E test: Load game and click cells
- Visual regression testing on 3 viewport sizes

**Definition of Done:**
- [x] All acceptance criteria met
- [x] Code implemented and tested
- [x] Works on all target devices
- [x] Successfully integrated with existing stories

---

### Story 1.7: Bugfixing - UI/UX Improvements

**Story ID:** STORY-1.7
**Story Title:** Bugfixing - Statistics Icon & Responsive Layout
**Epic:** EPIC-1
**Priority:** High (Critical Bugs)
**Complexity:** Low
**Estimated Effort:** 0.5 day
**Status:** ✅ COMPLETE

**User Story:**
```
As a player
I want the statistics to display correctly and the game to adapt properly to all screen sizes
So that I have a consistent and pleasant experience on any device
```

**Bugs Fixed:**

✅ **Bug 1: Loss Icon Display**
- Fixed broken emoji encoding in Statistics.tsx
- Changed `��` to `😢`
- Added emoji font family for consistent cross-browser rendering

✅ **Bug 2: Responsive Layout Issues**
- Fixed horizontal scrolling on mobile devices
- Improved layout adaptation for all screen sizes
- Added comprehensive breakpoints (768px, 480px, 375px)
- Made difficulty selector buttons stack vertically on mobile
- Dynamic cell sizing using `min()` function
- Proper `box-sizing` on all components

**Files Modified (8):**
- `src/components/Statistics.tsx` - Fixed emoji
- `src/components/Statistics.css` - Enhanced responsive styles
- `src/components/Game.css` - Improved container responsiveness
- `src/components/Board.css` - Better board scaling
- `src/components/Cell.css` - Dynamic cell sizing
- `src/components/DifficultySelector.css` - Vertical stack on mobile
- `src/components/GameStatus.css` - Responsive improvements
- `src/index.css` - Global responsive fixes

**Technical Implementation:**
- Added tablet breakpoint (768px)
- Enhanced mobile breakpoint (480px)
- Added very small device support (375px)
- Prevented horizontal overflow
- Improved touch targets on mobile
- Better spacing and padding at all sizes

**Implementation Date:** 2025-10-16

**Definition of Done:**
- [x] Both bugs fixed
- [x] Icons display correctly
- [x] Responsive on all screen sizes
- [x] No horizontal scrolling
- [x] Production build successful
- [x] No regressions

---

## Post-MVP Backlog (Phase 2)

---

### Story 1.2: AI Opponent & Difficulty Levels

**Story ID:** STORY-1.2
**Story Title:** AI Opponent & Difficulty Levels
**Epic:** EPIC-1
**Priority:** High (Must Have)
**Complexity:** High
**Estimated Effort:** 2-3 days

**User Story:**
```
As a child player
I want to play against a computer opponent with adjustable difficulty
So that I can challenge myself as I improve
```

**Acceptance Criteria:**

✅ **AC1: AI Response**
- [ ] After player places X, AI automatically places O in a valid empty cell
- [ ] AI response is immediate (< 50ms calculation time)
- [ ] O symbol appears in red (#EF4444)
- [ ] Turn switches back to player after AI move

✅ **AC2: Difficulty Selection**
- [ ] Three difficulty buttons displayed: "Leicht", "Mittel", "Schwer"
- [ ] User can select difficulty before starting a game
- [ ] Selected difficulty is visually highlighted
- [ ] Difficulty cannot be changed during an active game
- [ ] New game resets to allow difficulty change

✅ **AC3: Easy Mode (Semi-Random AI)**
- [ ] AI makes 70% random moves, 30% strategic moves
- [ ] Strategic moves: 50% chance to take winning move if available
- [ ] Strategic moves: 50% chance to block player winning move
- [ ] Player win rate in testing: 30-40%
- [ ] AI feels beatable but not trivial

✅ **AC4: Medium Mode (Heuristic AI)**
- [ ] AI always takes winning move if available (100%)
- [ ] AI always blocks player winning move if available (100%)
- [ ] AI prefers center cell when available (80%)
- [ ] AI prefers corner cells over edges (60%)
- [ ] Player win rate in testing: 10-20%

✅ **AC5: Hard Mode (Minimax AI)**
- [ ] AI uses minimax algorithm for optimal play
- [ ] AI never loses (perfect play)
- [ ] Best possible outcome for player: draw
- [ ] Algorithm completes in < 50ms on target devices
- [ ] Player win rate: 0% (draws acceptable)

✅ **AC6: Performance**
- [ ] All AI calculations complete in < 50ms
- [ ] No UI freezing or lag during AI turn
- [ ] Smooth transition between player and AI turns

**Technical Notes:**
- Implement three separate AI strategy functions
- Easy: weighted random + conditional logic
- Medium: rule-based heuristics (win → block → center → corner → edge)
- Hard: recursive minimax with alpha-beta pruning (optional optimization)
- AI logic in separate `aiPlayer.ts` module for testability

**AI Algorithm Pseudocode (Hard Mode):**
```typescript
function minimax(board, depth, isMaximizing):
  if gameOver:
    return score (10 for AI win, -10 for player win, 0 for draw)
  
  if isMaximizing:
    bestScore = -infinity
    for each empty cell:
      place O, recurse with isMaximizing=false, undo move
      bestScore = max(bestScore, recursion result)
    return bestScore
  else:
    bestScore = infinity
    for each empty cell:
      place X, recurse with isMaximizing=true, undo move
      bestScore = min(bestScore, recursion result)
    return bestScore
```

**Dependencies:**
- Story 1.1 (board and player moves must work first)

**Testing Requirements:**
- Unit tests for each AI difficulty level
- Test Easy AI randomness distribution (70/30 split)
- Test Medium AI rule priorities
- Test Hard AI never loses (play 100 games programmatically)
- Performance test: AI response time < 50ms
- E2E test: Complete game against each difficulty level

**Definition of Done:**
- [ ] Code complete and peer-reviewed
- [ ] All acceptance criteria met
- [ ] Unit tests for all three AI modes (>80% coverage)
- [ ] Performance benchmarks passing
- [ ] AI difficulty correctly balanced (via playtesting)
- [ ] E2E tests passing for all difficulties
- [ ] No console errors or warnings
- [ ] Deployed to staging environment

---

### Story 1.3: Win Detection & Game Flow

**Story ID:** STORY-1.3
**Story Title:** Win Detection & Game Flow
**Epic:** EPIC-1
**Priority:** High (Must Have)
**Complexity:** Medium
**Estimated Effort:** 1-2 days

**User Story:**
```
As a child player
I want the game to automatically detect when someone wins or the game is a draw
So that I know the result and can start a new game
```

**Acceptance Criteria:**

✅ **AC1: Win Detection**
- [ ] Game correctly detects all 8 winning patterns:
  - 3 horizontal rows: [0,1,2], [3,4,5], [6,7,8]
  - 3 vertical columns: [0,3,6], [1,4,7], [2,5,8]
  - 2 diagonals: [0,4,8], [2,4,6]
- [ ] Win detection triggers immediately after winning move
- [ ] No false positives (non-winning states reported as wins)
- [ ] No false negatives (actual wins missed)

✅ **AC2: Draw Detection**
- [ ] Game correctly detects draw when all 9 cells filled with no winner
- [ ] Draw detection only triggers when board is completely full
- [ ] Draw message displays clearly

✅ **AC3: Win Animation**
- [ ] Winning line is highlighted/animated across winning cells
- [ ] Line color: Golden Yellow (#FBBF24)
- [ ] Animation duration: ~500ms
- [ ] Line draws smoothly from first to last cell in pattern

✅ **AC4: Game Status Display**
- [ ] Status text updates correctly at each stage:
  - Before game start: "Wähle deinen Schwierigkeitsgrad"
  - Player turn: "Du bist dran! (X)"
  - AI turn: "Computer ist dran..." (if delay enabled)
  - Player wins: "Du hast gewonnen! 🎉"
  - AI wins: "Computer hat gewonnen!"
  - Draw: "Unentschieden!"
- [ ] Text is large, clear, and easy to read (24px+ font size)

✅ **AC5: New Game Flow**
- [ ] "Neues Spiel" button is always visible and accessible
- [ ] Clicking "Neues Spiel" clears the board completely
- [ ] New game resets all state (board, turn, status, winner)
- [ ] Difficulty selection remains available after game end
- [ ] Smooth transition when starting new game (200ms fade)

✅ **AC6: Game Over State**
- [ ] After win/draw, board becomes non-interactive (can't click cells)
- [ ] Result message displays prominently
- [ ] Optional: Subtle celebration animation on player win (confetti/sparkles)
- [ ] "Neues Spiel" button is emphasized after game ends

✅ **AC7: No Bugs or Edge Cases**
- [ ] Game never crashes during play
- [ ] No infinite loops or freezes
- [ ] State transitions are always correct
- [ ] Rapid clicking doesn't break game logic
- [ ] Browser refresh doesn't cause errors

**Technical Notes:**
- Win detection function checks all 8 patterns after each move
- Store winning line coordinates for animation
- Use React state to manage game status
- Animation via CSS transitions or SVG line drawing
- Prevent cell clicks when game is over (gameStatus !== 'playing')

**Win Detection Algorithm:**
```typescript
function checkWinner(board: Cell[]): {
  winner: 'X' | 'O' | 'draw' | null,
  line: number[] | null
} {
  const patterns = [
    [0,1,2], [3,4,5], [6,7,8], // rows
    [0,3,6], [1,4,7], [2,5,8], // columns
    [0,4,8], [2,4,6] // diagonals
  ];
  
  for (pattern of patterns) {
    const [a, b, c] = pattern;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line: pattern };
    }
  }
  
  if (board.every(cell => cell !== null)) {
    return { winner: 'draw', line: null };
  }
  
  return { winner: null, line: null };
}
```

**Dependencies:**
- Story 1.1 (board must work)
- Story 1.2 (AI must work)

**Testing Requirements:**
- Unit tests for all 8 win patterns (X wins and O wins)
- Unit test for draw detection
- Unit test for "no winner yet" state
- E2E tests for complete game flows:
  - Player wins on each of the 8 patterns
  - AI wins
  - Draw game
- Visual testing for win animation
- Edge case testing (rapid clicks, mid-game refresh)

**Definition of Done:**
- [ ] Code complete and peer-reviewed
- [ ] All acceptance criteria met
- [ ] Unit tests for win/draw detection (100% coverage)
- [ ] E2E tests for all game outcome scenarios
- [ ] Animation tested on all target browsers
- [ ] No bugs found in QA testing
- [ ] Performance meets targets
- [ ] Deployed to staging environment

---

## Epic 1: Definition of Done

**Epic-Level Completion Criteria:**

- [ ] **All stories complete:** 1.1, 1.2, 1.3 fully implemented and tested
- [ ] **Integration testing:** All stories work together seamlessly
- [ ] **Code quality:** >80% test coverage for game logic, >60% overall
- [ ] **Performance:** Lighthouse score >90, load time <2s
- [ ] **Cross-browser:** Works on Chrome, Firefox, Safari, Edge
- [ ] **Responsive:** Tested on Desktop (1920x1080), Tablet (768x1024), Mobile (375x667)
- [ ] **Deployment:** Live on production (Vercel/Netlify)
- [ ] **Documentation:** README updated with setup/run instructions
- [ ] **Product Brief alignment:** All MVP acceptance criteria from Product Brief satisfied

**User Acceptance Testing:**
- [ ] 5 test children (ages 7-10) can play without assistance
- [ ] 3 test parents rate the game as "age-appropriate"
- [ ] No confusion about game rules or controls
- [ ] Average session includes 3+ games played

**Production Readiness:**
- [ ] Custom domain configured (optional)
- [ ] SSL/HTTPS enabled
- [ ] CDN delivering globally
- [ ] Error monitoring in place (Sentry or similar)
- [ ] Basic analytics configured (optional for MVP)

---

## Story Summary

| Story ID | Title | Priority | Complexity | Est. Effort | Status |
|----------|-------|----------|------------|-------------|--------|
| STORY-1.1 | Basic Game Board & Player Moves | High | Medium | 1-2 days | ✅ Complete |
| STORY-1.2 | AI Opponent & Difficulty Levels | High | High | 2-3 days | ✅ Complete |
| STORY-1.3 | Win Detection & Game Flow | High | Medium | 1-2 days | ✅ Complete |
| STORY-1.4 | Polish and Enhancements (Bonus) | Medium | Medium | 1 day | ✅ Complete |
| STORY-1.5 | Production Testing & QA | High | Medium | 1 day | ✅ Complete |
| STORY-1.6 | Docker & CI/CD Pipeline | High | Medium | 1 day | ✅ Complete |
| STORY-1.7 | Bugfixing - UI/UX Improvements | High | Low | 0.5 day | ✅ Complete |

**Total Estimated Effort:** 7.5-10.5 days development + testing + deployment = **1.5-2 weeks**
**Current Status:** ✅ **ALL STORIES COMPLETE** - Ready for v1.0.0 Release!

---

## Implementation Order

1. **STORY-1.1** (Foundation) → Board and player moves must work first ✅
2. **STORY-1.2** (Core Feature) → AI opponent enables actual gameplay ✅
3. **STORY-1.3** (Completion) → Win detection completes game loop ✅
4. **STORY-1.4** (Polish) → Bonus features for enhanced user experience ✅

This order ensures each story builds on the previous, with testable increments at each stage.

**Implementation Complete:** All stories finished on 2025-10-16

---

### Story 1.4: Polish and Enhancements (Bonus Features)

**Story ID:** STORY-1.4
**Story Title:** Polish and Enhancements (Bonus Features)
**Epic:** EPIC-1
**Priority:** Medium (Nice to Have)
**Complexity:** Medium
**Estimated Effort:** 1 day
**Status:** ✅ COMPLETE

**User Story:**
```
As a child player
I want exciting visual and audio feedback when playing
So that the game feels more fun and rewarding
```

**Acceptance Criteria:**

✅ **AC1: Confetti Animation on Player Victory**
- [x] Confetti animation triggers automatically when player wins
- [x] Animation lasts 3 seconds
- [x] Uses professional canvas-confetti library
- [x] Works on all devices (desktop, tablet, mobile)

✅ **AC2: Sound Effects (Web Audio API)**
- [x] Click sound plays on every move (player and AI)
- [x] Victory sound plays when player wins (C-E-G major chord)
- [x] Defeat sound plays when AI wins (falling tone)
- [x] Draw sound plays on tie game
- [x] All sounds synthesized via Web Audio API (no external files)

✅ **AC3: Statistics Tracking**
- [x] Win counter tracks player victories (🏆)
- [x] Loss counter tracks AI victories (😢)
- [x] Draw counter tracks tie games (🤝)
- [x] Win rate calculation with progress bar
- [x] Statistics persist across browser sessions (localStorage)
- [x] Reset button to clear all statistics

✅ **AC4: Enhanced User Experience**
- [x] Smooth animations for all state transitions
- [x] Visual feedback for all user interactions
- [x] No performance degradation with added features
- [x] Responsive design maintained across all enhancements

**Technical Notes:**
- canvas-confetti library for celebration animation
- Web Audio API for sound synthesis (no audio files needed)
- localStorage for statistics persistence
- Component: Statistics.tsx
- Module: sounds.ts

**Dependencies:**
- Stories 1.1, 1.2, 1.3 (all core features must be complete)

**Implementation Date:** 2025-10-16

**Definition of Done:**
- [x] All acceptance criteria met
- [x] Code implemented and tested
- [x] Works on all target devices
- [x] Successfully integrated with existing stories

---

### Story 1.5: Production Testing & Quality Assurance

**Story ID:** STORY-1.5
**Story Title:** Production Testing & Quality Assurance
**Epic:** EPIC-1
**Priority:** High (Must Have)
**Complexity:** Medium
**Estimated Effort:** 1 day
**Status:** Todo

**User Story:**
```
As a product owner
I want comprehensive testing and quality assurance
So that the game is production-ready and meets all quality standards
```

**Acceptance Criteria:**

**AC1: Cross-Browser Testing**
- [ ] Game tested on Chrome (latest)
- [ ] Game tested on Firefox (latest)
- [ ] Game tested on Safari (latest)
- [ ] Game tested on Edge (latest)
- [ ] No browser-specific bugs found
- [ ] All features work consistently across browsers

**AC2: Responsive Testing**
- [ ] Desktop tested (1920x1080, 1366x768)
- [ ] Tablet tested (768x1024 portrait/landscape)
- [ ] Mobile tested (375x667, 390x844, 414x896)
- [ ] No layout breaks at any breakpoint
- [ ] Touch interactions work correctly on all devices

**AC3: Performance Testing**
- [ ] Lighthouse Performance Score ≥ 90
- [ ] Lighthouse Accessibility Score ≥ 90
- [ ] Lighthouse Best Practices Score ≥ 90
- [ ] Lighthouse SEO Score ≥ 90
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3s
- [ ] Total Bundle Size < 500KB

**AC4: Code Quality**
- [ ] ESLint runs without errors
- [ ] TypeScript compilation without errors
- [ ] No console errors or warnings in production build
- [ ] Code follows project conventions
- [ ] All TODOs resolved or documented

**AC5: Functionality Testing**
- [ ] All game modes work correctly (Easy, Medium, Hard)
- [ ] Win detection accurate for all 8 patterns
- [ ] Draw detection works correctly
- [ ] Statistics tracking persists correctly
- [ ] Sound effects play on all browsers
- [ ] Confetti animation works smoothly
- [ ] New game button resets state correctly

**AC6: User Acceptance Testing**
- [ ] Game tested with at least 3 users (preferably children/parents)
- [ ] No confusion about game controls
- [ ] Game completion rate > 90%
- [ ] Positive feedback on user experience
- [ ] All critical issues resolved

**Technical Tasks:**
- Run production build (`npm run build`)
- Test production build locally
- Run Lighthouse audits
- Document test results
- Create bug list and fix critical issues

**Testing Checklist:**
- [ ] Unit tests passing (if implemented)
- [ ] Integration tests passing
- [ ] Manual testing completed
- [ ] Performance benchmarks met
- [ ] Accessibility checks passed

**Dependencies:**
- All previous stories (1.1-1.4) complete

**Definition of Done:**
- [ ] All acceptance criteria met
- [ ] Test report documented
- [ ] All critical bugs fixed
- [ ] Performance targets achieved
- [ ] Ready for deployment

---

### Story 1.6: Docker & CI/CD Pipeline

**Story ID:** STORY-1.6
**Story Title:** Docker & CI/CD Pipeline with GitHub Actions
**Epic:** EPIC-1
**Priority:** High (Must Have)
**Complexity:** Medium
**Estimated Effort:** 1 day
**Status:** Todo

**User Story:**
```
As a developer
I want automated Docker image builds triggered by semantic version releases
So that the application can be deployed consistently and reliably
```

**Acceptance Criteria:**

**AC1: Dockerfile Creation**
- [ ] Multi-stage Dockerfile created for optimal image size
- [ ] Production build uses nginx for serving static files
- [ ] Image size < 50MB (compressed)
- [ ] Dockerfile follows best practices (non-root user, minimal layers)
- [ ] .dockerignore file configured correctly

**AC2: Local Docker Testing**
- [ ] `docker build` completes successfully
- [ ] `docker run` serves application correctly
- [ ] Application accessible on localhost
- [ ] All features work in containerized environment
- [ ] No production errors in container logs

**AC3: GitHub Actions Workflow**
- [ ] Workflow file created at `.github/workflows/docker-build.yml`
- [ ] Trigger: Only on release tags matching `v*.*.* ` pattern (semantic versioning)
- [ ] Workflow builds Docker image
- [ ] Workflow tags image with release version
- [ ] Workflow tags image with `latest`
- [ ] Workflow pushes to Docker Hub or GitHub Container Registry

**AC4: Semantic Versioning**
- [ ] Release tags follow semver format: `v00.00.00` (e.g., v01.00.00, v01.02.03)
- [ ] Workflow validates tag format
- [ ] Version extracted from git tag
- [ ] Image tagged with same version

**AC5: Docker Image Registry**
- [ ] Docker Hub repository created OR GitHub Container Registry configured
- [ ] Authentication secrets configured in GitHub
- [ ] Image push succeeds
- [ ] Image publicly accessible (or access configured)
- [ ] Image metadata includes version, build date, commit SHA

**AC6: Documentation**
- [ ] README updated with Docker instructions
- [ ] Docker run command documented
- [ ] GitHub Actions workflow documented
- [ ] Release process documented
- [ ] Version tagging guide included

**Technical Implementation:**

**Dockerfile Structure:**
```dockerfile
# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Production
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**GitHub Actions Workflow Triggers:**
- Release tags matching: `v[0-9]+.[0-9]+.[0-9]+`
- Examples: v01.00.00, v01.02.15, v02.00.00

**Environment Variables:**
- `DOCKER_USERNAME`: Docker Hub username
- `DOCKER_PASSWORD`: Docker Hub token
- OR `GHCR_TOKEN`: GitHub Container Registry token

**Dependencies:**
- Story 1.5 (testing must be complete)

**Testing Requirements:**
- [ ] Test Docker build locally
- [ ] Test Docker run locally
- [ ] Create test release (v00.01.00) to verify workflow
- [ ] Verify image in registry
- [ ] Test pulling and running published image

**Definition of Done:**
- [ ] Dockerfile created and tested
- [ ] GitHub Actions workflow implemented
- [ ] Test release successfully builds and publishes image
- [ ] Documentation complete
- [ ] Image runs correctly when pulled from registry

---

## Post-MVP Backlog (Phase 2)

**Not in Epic 1, but documented for future:**

- **Sound Volume Controls:** Adjustable volume slider for sound effects
- **2-Player Local Mode:** Human vs. Human on same device
- **Theme Customization:** Dark mode, different color schemes
- **Accessibility:** Keyboard navigation, ARIA labels, screen reader support
- **Advanced Animations:** More elaborate confetti patterns, particle effects
- **Localization:** English translation
- **PWA Features:** Install to home screen, offline play
- **Achievements System:** Badges for milestones (10 wins, win streak, etc.)

---

## Risk Register

### Technical Risks
1. **AI Performance on Low-End Devices**
   - Risk: Minimax too slow on old phones
   - Mitigation: Benchmark early, optimize if needed, fallback to heuristic if < 50ms

2. **Browser Quirks**
   - Risk: Safari or mobile browser bugs
   - Mitigation: Cross-browser testing on real devices, progressive enhancement

### Scope Risks
3. **Feature Creep**
   - Risk: Adding "just one more thing" delays MVP
   - Mitigation: Strict adherence to Epic 1 scope, move extras to Phase 2

### UX Risks
4. **Difficulty Balancing**
   - Risk: Easy too hard, Hard too frustrating
   - Mitigation: Playtest with 5-10 kids, adjust AI weights as needed

---

## Success Metrics (Post-Launch)

**Within 30 Days of MVP Launch:**
- 1,000+ unique visitors
- 50+ daily active users
- Average 5+ games per session
- 95%+ game completion rate
- 40% return rate (7-day)
- < 5% bounce rate
- Load time < 2s (95th percentile)

---

## Notes & Assumptions

**Assumptions:**
- Players have modern browsers (no IE11 support)
- Players have stable internet for initial load (after that, game is client-side)
- Children know basic Tic-Tac-Toe rules or learn them intuitively
- Touch devices are primary platform (60%+ mobile/tablet usage expected)

**Out of Scope for Epic 1:**
- User accounts or login
- Persistent statistics across sessions
- Online multiplayer (real-time between users)
- Backend or database
- Monetization or ads
- Complex tutorials or onboarding

---

**Document Status:** Ready for Development
**Next Step:** Begin Story 1.1 implementation
**Story Files Location:** `docs/stories/` (to be created)

---

_End of Epics & Stories Document_
