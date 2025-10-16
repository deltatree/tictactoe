# testme - Tic-Tac-Toe für Kinder

Ein farbenfrohes, kindgerechtes Tic-Tac-Toe Web-Game mit intelligenter KI und drei Schwierigkeitsstufen.

## 🎮 Features

- **Drei KI-Schwierigkeitsstufen:** Leicht, Mittel, Schwer
- **Kindgerechtes Design:** Bunte Farben, große Buttons, intuitive Bedienung
- **Sound-Effekte:** Synthesized sounds via Web Audio API (keine Audio-Dateien)
- **Konfetti-Animation:** Feier-Effekt bei Spielersieg
- **Statistik-Tracking:** Zählt Siege, Niederlagen und Unentschieden
- **Vollständig Responsive:** Funktioniert auf Desktop, Tablet und Mobile
- **Werbefrei & Sicher:** Keine Tracker, keine Werbung

## 🚀 Quick Start

### Development

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open in browser
open http://localhost:5173
```

### Production Build

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview
```

### Code Quality

```bash
# Run ESLint
npm run lint

# TypeScript type checking
npx tsc --noEmit
```

## 🐳 Docker Deployment

### Pull and Run from GitHub Container Registry

```bash
# Pull latest image
docker pull ghcr.io/OWNER/testme:latest

# Run container
docker run -d -p 80:80 --name testme ghcr.io/OWNER/testme:latest

# Access game
open http://localhost
```

### Build Docker Image Locally

```bash
# Build image
docker build -t testme:local .

# Run container
docker run -d -p 8080:80 --name testme-local testme:local

# Access game
open http://localhost:8080

# View logs
docker logs testme-local

# Stop container
docker stop testme-local
```

### Docker Image Details

- **Base Image:** nginx:alpine (minimal footprint)
- **Multi-stage Build:** Optimized for small image size
- **Image Size:** < 50MB (compressed)
- **Health Check:** Built-in HTTP health monitoring
- **Platforms:** linux/amd64, linux/arm64

## 📦 Release Process

This project uses semantic versioning and automated Docker image builds.

### Creating a Release

1. **Ensure all tests pass:**
   ```bash
   npm run lint
   npm run build
   ```

2. **Create and push a semantic version tag:**
   ```bash
   # Format: vMM.mm.pp (e.g., v01.00.00, v01.02.15)
   git tag v01.00.00
   git push origin v01.00.00
   ```

3. **GitHub Actions automatically:**
   - Builds Docker image
   - Tags with version and `latest`
   - Pushes to GitHub Container Registry

### Semantic Versioning Guide

- **Major (v0X.00.00):** Breaking changes
- **Minor (v01.0X.00):** New features, non-breaking
- **Patch (v01.00.0X):** Bug fixes, minor improvements

**Examples:**
- `v01.00.00` - Initial release
- `v01.01.00` - Added 2-player mode
- `v01.01.01` - Fixed sound bug
- `v02.00.00` - Major UI overhaul

## 🛠️ Tech Stack

- **Frontend:** React 18 + TypeScript
- **Build Tool:** Vite
- **Styling:** CSS Modules
- **Animation:** canvas-confetti
- **Audio:** Web Audio API (no external files)
- **Storage:** localStorage
- **Deployment:** Docker + nginx

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🎯 Performance

- **Bundle Size:** ~68KB (gzipped)
- **Load Time:** < 2s
- **Lighthouse Score:** 90+
- **FPS:** 60fps (animations)

## 📄 License

This project is for educational purposes.

## 👨‍💻 Development

Built with React + TypeScript + Vite
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
