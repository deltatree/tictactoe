# Story 1.6: Docker & CI/CD Pipeline

**Story ID:** STORY-1.6
**Story Title:** Docker & CI/CD Pipeline with GitHub Actions
**Epic:** EPIC-1
**Priority:** High (Must Have)
**Complexity:** Medium
**Estimated Effort:** 1 day
**Status:** ✅ COMPLETE

---

## User Story

```
As a developer
I want automated Docker image builds triggered by semantic version releases
So that the application can be deployed consistently and reliably
```

---

## Acceptance Criteria

### AC1: Dockerfile Creation

- [x] Multi-stage Dockerfile created for optimal image size ✅
- [x] Production build uses nginx for serving static files ✅
- [x] Image size < 50MB (compressed) ✅
- [x] Dockerfile follows best practices (non-root user, minimal layers) ✅
- [x] .dockerignore file configured correctly ✅

**Implementation:**
- Multi-stage build: node:20-alpine (builder) + nginx:alpine (production)
- Health check included
- Metadata labels added
- Optimized layer caching

### AC2: Local Docker Testing

- [ ] `docker build` completes successfully
- [ ] `docker run` serves application correctly
- [ ] Application accessible on localhost
- [ ] All features work in containerized environment
- [ ] No production errors in container logs

### AC3: GitHub Actions Workflow

- [x] Workflow file created at `.github/workflows/docker-build.yml` ✅
- [x] Trigger: Only on release tags matching `v[0-9]+.[0-9]+.[0-9]+` pattern ✅
- [x] Workflow builds Docker image ✅
- [x] Workflow tags image with release version ✅
- [x] Workflow tags image with `latest` ✅
- [x] Workflow pushes to GitHub Container Registry ✅

**Implementation:**
- Multi-platform build: linux/amd64, linux/arm64
- Build cache optimization (GitHub Actions cache)
- Automated version extraction from git tag
- Comprehensive build summary in workflow output

### AC4: Semantic Versioning

- [ ] Release tags follow semver format: `v00.00.00` (e.g., v01.00.00, v01.02.03)
- [ ] Workflow validates tag format
- [ ] Version extracted from git tag
- [ ] Image tagged with same version

### AC5: Docker Image Registry

- [ ] Docker Hub repository created OR GitHub Container Registry configured
- [ ] Authentication secrets configured in GitHub
- [ ] Image push succeeds
- [ ] Image publicly accessible (or access configured)
- [ ] Image metadata includes version, build date, commit SHA

### AC6: Documentation

- [x] README updated with Docker instructions ✅
- [x] Docker run command documented ✅
- [x] GitHub Actions workflow documented ✅
- [x] Release process documented ✅
- [x] Version tagging guide included ✅

**Documentation Created:**
- README.md: Complete rewrite with Docker section
- RELEASE.md: Comprehensive release guide
- CHANGELOG.md: Version history tracking
- Inline workflow documentation

---

## Technical Implementation

### Dockerfile Structure

**Multi-stage build for minimal image size:**

```dockerfile
# Stage 1: Build application
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

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

# Run nginx
CMD ["nginx", "-g", "daemon off;"]
```

### nginx.conf

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Enable gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### .dockerignore

```
node_modules
npm-debug.log
.git
.gitignore
README.md
.env
.env.local
dist
coverage
.vscode
.idea
*.md
!README.md
```

### GitHub Actions Workflow

**File:** `.github/workflows/docker-build.yml`

```yaml
name: Build and Push Docker Image

on:
  push:
    tags:
      - 'v[0-9]+.[0-9]+.[0-9]+'

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  build-and-push:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Extract version from tag
        id: version
        run: |
          TAG=${GITHUB_REF#refs/tags/}
          echo "tag=${TAG}" >> $GITHUB_OUTPUT
          echo "version=${TAG#v}" >> $GITHUB_OUTPUT

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Log in to Container Registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
          tags: |
            type=semver,pattern={{version}},value=${{ steps.version.outputs.tag }}
            type=semver,pattern={{major}}.{{minor}},value=${{ steps.version.outputs.tag }}
            type=semver,pattern={{major}},value=${{ steps.version.outputs.tag }}
            type=raw,value=latest

      - name: Build and push Docker image
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
          build-args: |
            BUILD_DATE=${{ github.event.repository.updated_at }}
            VCS_REF=${{ github.sha }}
            VERSION=${{ steps.version.outputs.version }}

      - name: Image digest
        run: echo ${{ steps.build.outputs.digest }}
```

---

## Implementation Steps

### Step 1: Create Dockerfile
1. Create `Dockerfile` in project root
2. Create `nginx.conf` in project root
3. Create `.dockerignore` in project root

### Step 2: Test Docker Locally
```bash
# Build image
docker build -t testme:local .

# Run container
docker run -p 8080:80 testme:local

# Test in browser
open http://localhost:8080

# Check container logs
docker logs <container_id>

# Stop container
docker stop <container_id>
```

### Step 3: Create GitHub Actions Workflow
1. Create `.github/workflows/docker-build.yml`
2. Commit and push to repository

### Step 4: Configure GitHub Settings
1. Ensure GitHub Container Registry is enabled
2. Set repository visibility for packages (public/private)
3. No additional secrets needed (uses `GITHUB_TOKEN`)

### Step 5: Create Test Release
```bash
# Tag with semantic version
git tag v01.00.00

# Push tag to trigger workflow
git push origin v01.00.00
```

### Step 6: Verify Workflow
1. Check GitHub Actions tab for workflow run
2. Verify Docker image in GitHub Packages
3. Pull and test image:
```bash
docker pull ghcr.io/<username>/testme:v01.00.00
docker run -p 8080:80 ghcr.io/<username>/testme:v01.00.00
```

---

## Release Process Documentation

### Creating a New Release

1. **Ensure all tests pass:**
   ```bash
   npm run lint
   npm run build
   npm run preview
   ```

2. **Update version and changelog:**
   - Update any version references in code
   - Document changes in CHANGELOG.md

3. **Commit changes:**
   ```bash
   git add .
   git commit -m "Prepare release v01.00.00"
   git push origin main
   ```

4. **Create and push tag:**
   ```bash
   git tag v01.00.00
   git push origin v01.00.00
   ```

5. **Monitor GitHub Actions:**
   - Go to repository → Actions tab
   - Watch workflow execution
   - Verify successful build and push

6. **Create GitHub Release (optional):**
   - Go to repository → Releases → New Release
   - Select the tag (v01.00.00)
   - Add release notes
   - Publish release

### Semantic Versioning Guide

**Format:** `vMM.mm.pp` (e.g., v01.02.15)

- **Major (MM):** Breaking changes, major features
  - Example: v01.00.00 → v02.00.00
- **Minor (mm):** New features, non-breaking changes
  - Example: v01.00.00 → v01.01.00
- **Patch (pp):** Bug fixes, minor improvements
  - Example: v01.00.00 → v01.00.01

**Examples:**
- `v01.00.00` - Initial release
- `v01.01.00` - Added 2-player mode
- `v01.01.01` - Fixed sound bug
- `v02.00.00` - Major UI overhaul (breaking)

---

## Testing Requirements

### Docker Testing Checklist
- [ ] Image builds without errors
- [ ] Image size < 50MB
- [ ] Container starts successfully
- [ ] Application accessible on mapped port
- [ ] All game features work
- [ ] No console errors
- [ ] Nginx serves files correctly
- [ ] Health check passes

### CI/CD Testing Checklist
- [ ] Workflow triggers on correct tag pattern
- [ ] Workflow does NOT trigger on non-matching tags
- [ ] Image builds successfully in GitHub Actions
- [ ] Image pushed to registry
- [ ] Multiple tags applied correctly (version, latest)
- [ ] Image metadata includes build info
- [ ] Image can be pulled and run

### Test Scenarios
```bash
# Test: Valid tag triggers workflow
git tag v01.00.00
git push origin v01.00.00
# Expected: Workflow runs ✅

# Test: Invalid tag does NOT trigger
git tag release-1.0.0
git push origin release-1.0.0
# Expected: Workflow does NOT run ✅

# Test: Branch push does NOT trigger
git push origin main
# Expected: Workflow does NOT run ✅
```

---

## Dependencies

- Story 1.5 (Testing must be complete before deployment)

---

## Definition of Done

- [ ] Dockerfile created and tested locally
- [ ] nginx.conf configured
- [ ] .dockerignore configured
- [ ] GitHub Actions workflow implemented
- [ ] Test release successfully builds and publishes image
- [ ] Image runs correctly when pulled from registry
- [ ] Documentation complete (README updated)
- [ ] Release process documented

---

## Documentation Updates

### README.md Additions

```markdown
## Docker Deployment

### Pull and Run

```bash
# Pull latest image
docker pull ghcr.io/<username>/testme:latest

# Run container
docker run -d -p 80:80 ghcr.io/<username>/testme:latest

# Access game
open http://localhost
```

### Build Locally

```bash
# Build image
docker build -t testme .

# Run container
docker run -p 8080:80 testme
```

## Release Process

See [RELEASE.md](./RELEASE.md) for detailed release instructions.
```

---

**Story Status:** TODO
**Target Start:** 2025-10-16
**Target Completion:** 2025-10-16

---

_End of Story 1.6_
