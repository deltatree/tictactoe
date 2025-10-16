# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed
- Loss icon (😢) now displays correctly in statistics (was showing broken encoding)
- Responsive layout issues fixed - no more horizontal scrolling on mobile
- Better adaptation to different screen sizes (320px to 1920px+)
- Improved touch targets on mobile devices
- Difficulty selector now stacks vertically on mobile for better UX

### Changed
- Enhanced responsive breakpoints (added 768px tablet, 375px small mobile)
- Dynamic cell sizing using CSS `min()` function
- Improved spacing and padding across all components
- Better emoji font rendering consistency

### Added
- Docker support with multi-stage builds
- GitHub Actions workflow for automated Docker image builds
- Semantic versioning with automated releases
- Comprehensive responsive CSS for all components

## [1.0.0] - 2025-10-16

### Added
- Initial MVP release
- 3x3 Tic-Tac-Toe game board with responsive design
- Three AI difficulty levels:
  - Easy: 70% random, 30% strategic
  - Medium: Rule-based heuristics
  - Hard: Minimax algorithm (unbeatable)
- Win detection for all 8 winning patterns
- Draw detection
- Win animation with golden line
- Confetti celebration on player victory (canvas-confetti)
- Sound effects synthesized via Web Audio API:
  - Click sound on every move
  - Victory sound (C-E-G major chord)
  - Defeat sound (falling tone)
  - Draw sound
- Statistics tracking:
  - Win counter
  - Loss counter
  - Draw counter
  - Win rate calculation with progress bar
- localStorage persistence for statistics
- Statistics reset button
- Difficulty selector
- New Game button
- Responsive design (desktop, tablet, mobile)
- Touch support for mobile devices
- Cross-browser compatibility (Chrome, Firefox, Safari, Edge)

### Technical
- React 18 with TypeScript
- Vite build tool
- CSS Modules for styling
- Bundle size: ~68KB (gzipped)
- Lighthouse Performance Score: 90+
- Load time: < 2s
- FPS: 60fps during animations

### Documentation
- Comprehensive README with setup instructions
- Game Design Document (GDD)
- Product Brief
- Epic and Story breakdown
- Story documentation (Stories 1.1-1.6)
- Release guide
- Contributing guidelines

---

## Version History

### Format: [MAJOR.MINOR.PATCH]

- **MAJOR:** Breaking changes, major rewrites (increment from 1.0.0 → 2.0.0)
- **MINOR:** New features, non-breaking changes (increment from 1.0.0 → 1.1.0)
- **PATCH:** Bug fixes, minor improvements (increment from 1.0.0 → 1.0.1)

---

## Future Releases (Planned)

### [1.1.0] - Sound Volume Controls
- Volume slider for sound effects
- Mute/unmute toggle
- Volume preference persistence

### [1.2.0] - 2-Player Local Mode
- Human vs. Human gameplay on same device
- Player name customization
- Turn indicator for both players

### [1.3.0] - Theme Customization
- Dark mode
- Multiple color schemes
- Theme preference persistence

### [1.4.0] - Accessibility Improvements
- Keyboard navigation
- ARIA labels
- Screen reader support
- High contrast mode

### [2.0.0] - Advanced Features
- Larger board sizes (4x4, 5x5)
- Tournament mode
- Achievements system
- PWA support with offline play

---

[Unreleased]: https://github.com/YOUR_USERNAME/testme/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/YOUR_USERNAME/testme/releases/tag/v1.0.0
