# Stage 1: Build application
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source files
COPY . .

# Build application
RUN npm run build

# Stage 2: Production image with nginx
FROM nginx:alpine

# Copy built files from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

# Add labels for metadata
LABEL org.opencontainers.image.title="testme - Tic-Tac-Toe"
LABEL org.opencontainers.image.description="A fun, educational Tic-Tac-Toe game for children"
LABEL org.opencontainers.image.vendor="testme"

# Run nginx
CMD ["nginx", "-g", "daemon off;"]
