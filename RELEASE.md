# Release Guide

This document describes the release process for the testme Tic-Tac-Toe game.

## Release Process Overview

1. **Preparation:** Ensure code quality and tests pass
2. **Versioning:** Create semantic version tag
3. **Automation:** GitHub Actions builds and publishes Docker image
4. **Verification:** Test the published image

---

## Step-by-Step Release Process

### 1. Pre-Release Checklist

Before creating a release, ensure:

```bash
# ✅ ESLint passes
npm run lint

# ✅ TypeScript compiles
npx tsc --noEmit

# ✅ Production build succeeds
npm run build

# ✅ Preview works correctly
npm run preview
# Open http://localhost:4173 and test all features

# ✅ All changes committed
git status
# Should show: "nothing to commit, working tree clean"
```

### 2. Choose Version Number

Follow **Semantic Versioning** (SemVer) with format: `vMM.mm.pp`

- **Major (MM):** Breaking changes, major rewrites
  - Example: v01.00.00 → v02.00.00
  - When: Complete UI overhaul, game rule changes, API changes

- **Minor (mm):** New features, non-breaking changes
  - Example: v01.00.00 → v01.01.00
  - When: Added 2-player mode, new theme, new difficulty

- **Patch (pp):** Bug fixes, minor improvements
  - Example: v01.00.00 → v01.00.01
  - When: Fixed win detection bug, improved performance

**Current Version Examples:**
- `v01.00.00` - Initial MVP release (Stories 1.1-1.4 complete)
- `v01.01.00` - Added sound volume controls
- `v01.02.00` - Added 2-player local mode
- `v02.00.00` - Major rewrite with new framework

### 3. Create Git Tag

```bash
# Create annotated tag with message
git tag -a v01.00.00 -m "Release v01.00.00 - Initial MVP with AI, sound, confetti"

# Verify tag created
git tag -l

# Show tag details
git show v01.00.00
```

### 4. Push Tag to GitHub

```bash
# Push the tag to trigger GitHub Actions workflow
git push origin v01.00.00
```

**Important:** Only tags matching pattern `v[0-9]+.[0-9]+.[0-9]+` trigger the build!

### 5. Monitor GitHub Actions

1. Go to your repository on GitHub
2. Click **Actions** tab
3. Watch for workflow: "Build and Push Docker Image"
4. Workflow should:
   - ✅ Validate semantic version format
   - ✅ Build Docker image
   - ✅ Tag image with version and `latest`
   - ✅ Push to GitHub Container Registry

**Expected Duration:** 3-5 minutes

### 6. Verify Published Image

```bash
# Pull the newly published image
docker pull ghcr.io/YOUR_GITHUB_USERNAME/testme:v01.00.00

# Run the image
docker run -d -p 8080:80 --name testme-test ghcr.io/YOUR_GITHUB_USERNAME/testme:v01.00.00

# Test in browser
open http://localhost:8080

# Verify all features work:
# - Game board renders
# - Player can make moves
# - AI responds correctly
# - Win detection works
# - Sound effects play
# - Confetti triggers on win
# - Statistics track correctly

# Clean up
docker stop testme-test
docker rm testme-test
```

### 7. Create GitHub Release (Optional but Recommended)

1. Go to repository → **Releases** → **Create a new release**
2. Choose the tag you just created (v01.00.00)
3. Release title: `v01.00.00 - Initial MVP Release`
4. Add release notes:

```markdown
## 🎉 v01.00.00 - Initial MVP Release

### Features
- ✨ Three AI difficulty levels (Easy, Medium, Hard)
- 🎨 Colorful, child-friendly design
- 🔊 Sound effects (Web Audio API)
- 🎊 Confetti animation on win
- 📊 Statistics tracking with localStorage
- 📱 Fully responsive (desktop, tablet, mobile)

### Technical
- Bundle size: ~68KB gzipped
- Lighthouse score: 90+
- Docker image: < 50MB

### Docker
```bash
docker pull ghcr.io/YOUR_USERNAME/testme:v01.00.00
docker run -p 80:80 ghcr.io/YOUR_USERNAME/testme:v01.00.00
```

**Full Changelog:** https://github.com/YOUR_USERNAME/testme/compare/v00.00.00...v01.00.00
```

5. Click **Publish release**

---

## Docker Image Tags

After a successful release, the following tags are available:

- `v01.00.00` - Specific version (immutable)
- `01.00` - Major.minor version
- `01` - Major version
- `latest` - Always points to most recent release

**Examples:**
```bash
# Pull specific version (recommended for production)
docker pull ghcr.io/USERNAME/testme:v01.00.00

# Pull latest minor version
docker pull ghcr.io/USERNAME/testme:01.00

# Pull latest major version
docker pull ghcr.io/USERNAME/testme:01

# Pull latest release
docker pull ghcr.io/USERNAME/testme:latest
```

---

## Troubleshooting

### Tag doesn't trigger workflow

**Problem:** Pushed tag but GitHub Actions didn't run.

**Solution:** Check tag format matches `v[0-9]+.[0-9]+.[0-9]+`

```bash
# ✅ Valid tags (triggers workflow)
v01.00.00
v10.05.23
v02.00.00

# ❌ Invalid tags (does NOT trigger)
v1.0.0        # Not zero-padded
version-1.0.0 # Wrong prefix
1.0.0         # Missing 'v'
v01.00.00-rc1 # Has suffix
```

### Workflow fails at build step

**Problem:** Docker build fails in GitHub Actions.

**Solutions:**
1. Test build locally: `docker build -t testme:test .`
2. Check Dockerfile syntax
3. Ensure all dependencies in package.json
4. Verify no absolute paths in code

### Image push fails

**Problem:** Cannot push to GitHub Container Registry.

**Solutions:**
1. Check repository settings → Actions → General
2. Ensure "Read and write permissions" enabled for GITHUB_TOKEN
3. Verify workflow has `permissions: packages: write`

### Image runs but app doesn't work

**Problem:** Docker container starts but app has errors.

**Solutions:**
1. Check container logs: `docker logs CONTAINER_NAME`
2. Verify nginx config is correct
3. Test production build locally: `npm run build && npm run preview`
4. Check browser console for errors

---

## Rollback

If a release has critical issues:

### Option 1: Quick Rollback with Tags

```bash
# Pull previous working version
docker pull ghcr.io/USERNAME/testme:v00.99.00

# Update 'latest' tag to point to previous version
# (Requires manually retagging in registry or creating new release)
```

### Option 2: Hot Fix Release

```bash
# Fix the issue
git add .
git commit -m "Fix critical bug in v01.00.00"

# Create patch release
git tag v01.00.01
git push origin v01.00.01
```

---

## Best Practices

### Do:
- ✅ Test thoroughly before releasing
- ✅ Use semantic versioning correctly
- ✅ Write clear release notes
- ✅ Tag with annotated tags (`git tag -a`)
- ✅ Keep CHANGELOG.md updated
- ✅ Verify Docker image after release

### Don't:
- ❌ Delete or re-use version tags
- ❌ Skip testing before release
- ❌ Use non-semantic versions
- ❌ Release directly from feature branches
- ❌ Forget to document breaking changes

---

## Release Checklist Template

Copy this for each release:

```markdown
## Release v01.00.00 Checklist

### Pre-Release
- [ ] All tests pass
- [ ] ESLint clean
- [ ] TypeScript compiles
- [ ] Production build works
- [ ] Manual testing complete
- [ ] All changes committed

### Release
- [ ] Version number chosen
- [ ] Git tag created: `v01.00.00`
- [ ] Tag pushed to GitHub
- [ ] GitHub Actions workflow succeeded
- [ ] Docker image published

### Post-Release
- [ ] Image pulled and tested
- [ ] GitHub Release created
- [ ] Release notes published
- [ ] Documentation updated
- [ ] Stakeholders notified

### Rollback Plan (if needed)
- Previous stable version: v00.99.00
- Rollback command: `docker pull ghcr.io/USERNAME/testme:v00.99.00`
```

---

## Version History

| Version | Date | Description |
|---------|------|-------------|
| v01.00.00 | 2025-10-16 | Initial MVP release |

---

**Questions?** See [GitHub Actions Documentation](https://docs.github.com/en/actions) or [Docker Documentation](https://docs.docker.com/)
