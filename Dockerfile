# Multi-stage build: Frontend + Backend in one image
# Stage 1: Build Frontend
FROM node:20-alpine AS frontend-builder

WORKDIR /app

# Copy frontend package files
COPY package*.json ./

# Install frontend dependencies
RUN npm ci

# Copy frontend source files
COPY . .

# Build frontend
RUN npm run build

# Stage 2: Build Backend
FROM node:20-alpine AS backend-builder

WORKDIR /app

# Copy backend package files
COPY backend/package*.json ./

# Install backend dependencies (including dev dependencies for build)
RUN npm ci

# Copy backend source
COPY backend/tsconfig.json ./
COPY backend/src ./src

# Build backend TypeScript
RUN npx tsc

# Stage 3: Production image with Node.js (runs both frontend via nginx and backend)
FROM node:20-alpine

# Install nginx and supervisor for running both services
RUN apk add --no-cache nginx supervisor wget

WORKDIR /app

# Setup backend
COPY backend/package*.json ./backend/
RUN cd backend && npm ci --only=production && npm cache clean --force

# Copy built backend from builder
COPY --from=backend-builder /app/dist ./backend/dist

# Setup frontend with nginx
COPY --from=frontend-builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/http.d/default.conf

# Create supervisor config for running both services
RUN mkdir -p /etc/supervisor.d
COPY <<EOF /etc/supervisor.d/services.ini
[supervisord]
nodaemon=true
user=root

[program:nginx]
command=nginx -g 'daemon off;'
autostart=true
autorestart=true
stdout_logfile=/dev/stdout
stdout_logfile_maxbytes=0
stderr_logfile=/dev/stderr
stderr_logfile_maxbytes=0

[program:backend]
command=node /app/backend/dist/index.js
directory=/app/backend
autostart=true
autorestart=true
stdout_logfile=/dev/stdout
stdout_logfile_maxbytes=0
stderr_logfile=/dev/stderr
stderr_logfile_maxbytes=0
environment=NODE_ENV=production,PORT=3000
EOF

# Expose ports (80 for nginx/frontend, 3000 for backend)
EXPOSE 80 3000

# Health check for both services
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s \
  CMD wget --quiet --tries=1 --spider http://localhost/ && \
      wget --quiet --tries=1 --spider http://localhost:3000/api/health || exit 1

# Add labels for metadata
LABEL org.opencontainers.image.title="testme - Tic-Tac-Toe Full Stack"
LABEL org.opencontainers.image.description="Full-stack Tic-Tac-Toe game with frontend (nginx) and backend (Node.js + Socket.IO)"
LABEL org.opencontainers.image.vendor="testme"

# Run supervisor to manage both nginx and node
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]
