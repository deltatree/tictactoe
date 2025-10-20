# Entwicklungs-Leitfaden

**Datum:** 20. Oktober 2025

---

Dieser Leitfaden beschreibt, wie die Entwicklungsumgebung eingerichtet und das Projekt lokal ausgeführt wird.

## 1. Voraussetzungen

-   **Node.js:** Version `20.x` oder höher.
-   **Docker:** (Optional, für produktionsnahe Tests) Neueste Version.
-   **Git:** Zur Verwaltung des Quellcodes.

## 2. Lokales Setup

### Schritt 1: Repository klonen

```bash
git clone https://github.com/deltatree/testme.git
cd testme
```

### Schritt 2: Frontend-Abhängigkeiten installieren

Die Abhängigkeiten für die React-Anwendung werden im Hauptverzeichnis installiert.

```bash
npm install
```

### Schritt 3: Backend-Abhängigkeiten installieren

Die Abhängigkeiten für den Node.js-Server werden im `backend`-Verzeichnis installiert.

```bash
cd backend
npm install
cd ..
```

## 3. Projekt lokal ausführen

Frontend und Backend müssen parallel in zwei separaten Terminals gestartet werden.

### Terminal 1: Frontend starten

Der Vite-Entwicklungsserver wird gestartet. Die Anwendung ist normalerweise unter `http://localhost:5173` erreichbar.

```bash
npm run dev
```

### Terminal 2: Backend starten

Der Node.js-Server wird mit `tsx` für Hot-Reloading bei Änderungen gestartet. Der Server läuft auf Port `3001`.

```bash
cd backend
npm run dev
```

Das Frontend ist so konfiguriert, dass es sich im Entwicklungsmodus automatisch mit `http://localhost:3001` verbindet.

## 4. Wichtige Skripte

### Frontend (`package.json`)

-   `npm run dev`: Startet den Vite-Entwicklungsserver.
-   `npm run build`: Erstellt eine optimierte Produktionsversion des Frontends in den `dist`-Ordner.
-   `npm run lint`: Führt ESLint zur statischen Code-Analyse aus.
-   `npm run preview`: Startet einen lokalen Server, um die Produktionsversion (`dist`) zu testen.

### Backend (`backend/package.json`)

-   `npm run dev`: Startet den Backend-Server im Entwicklungsmodus mit Hot-Reload.
-   `npm run build`: Kompiliert den TypeScript-Code nach JavaScript in den `dist`-Ordner.
-   `npm run start`: Startet den kompilierten Server aus dem `dist`-Ordner (für die Produktion).
-   `npm run typecheck`: Überprüft die TypeScript-Typen, ohne Code zu kompilieren.

## 5. Mit Docker ausführen

Das `Dockerfile` im Hauptverzeichnis erstellt ein produktionsfertiges Image, das sowohl das Frontend (über Nginx) als auch das Backend enthält.

### Image erstellen

```bash
docker build -t testme-app .
```

### Container starten

```bash
docker run -p 8080:80 -p 3001:3001 testme-app
```

-   Das Frontend ist unter `http://localhost:8080` erreichbar.
-   Das Backend ist unter `http://localhost:3001` erreichbar.

Der Container verwendet `supervisor` um sowohl den Nginx-Server als auch den Node.js-Prozess zu verwalten.
