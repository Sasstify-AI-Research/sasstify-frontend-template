# Troubleshooting

Common issues and their solutions.

---

## Table of Contents

- [Installation Issues](#installation-issues)
- [Development Server Issues](#development-server-issues)
- [Build Issues](#build-issues)
- [Runtime Issues](#runtime-issues)
- [Performance Issues](#performance-issues)

---

## Installation Issues

### npm install Fails

**Error:**
```
npm ERR! code ECONNRESET
npm ERR! network request failed
```

**Solutions:**

**1. Clear cache and retry:**
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**2. Use different registry:**
```bash
npm config set registry https://registry.npmjs.org/
npm install
```

**3. Check internet connection:**
```bash
ping registry.npmjs.org
```

---

### Permission Errors

**Error:**
```
EACCES: permission denied
```

**Solutions:**

**On macOS/Linux:**
```bash
sudo chown -R $USER ~/.npm
sudo chown -R $USER node_modules
```

**Never use sudo npm install!**

---

### Wrong Node Version

**Error:**
```
The engine "node" is incompatible with this module
```

**Solution:**
```bash
# Check current version
node --version

# Install correct version (22.20.0)
nvm install 22
nvm use 22

# Verify
node --version  # Should show v22.x
```

---

## Development Server Issues

### Port Already in Use

**Error:**
```
Port 8080 is in use, trying another one...
```

**Solutions:**

**1. Kill process on port:**
```bash
# macOS/Linux
lsof -ti:8080 | xargs kill -9

# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

**2. Change port in vite.config.ts:**
```typescript
export default defineConfig({
  server: {
    port: 3000, // Change to any available port
  },
});
```

---

### Module Not Found

**Error:**
```
Cannot find module '@/components/...'
```

**Solutions:**

**1. Check path alias:**
```typescript
// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

**2. Restart dev server:**
```bash
# Stop server (Ctrl+C)
npm run dev
```

**3. Clear cache:**
```bash
rm -rf node_modules/.vite
npm run dev
```

---

### HMR Not Working

**Issue:** Changes don't reflect in browser

**Solutions:**

**1. Check browser console for errors**

**2. Restart dev server:**
```bash
# Stop (Ctrl+C)
npm run dev
```

**3. Hard refresh browser:**
```
macOS: Cmd + Shift + R
Windows: Ctrl + Shift + R
```

**4. Clear Vite cache:**
```bash
rm -rf node_modules/.vite
npm run dev
```

---

## Build Issues

### Build Fails

**Error:**
```
Build failed with X errors
```

**Solutions:**

**1. Check TypeScript errors:**
```bash
npm run type-check
```

Fix reported type errors.

**2. Check linter errors:**
```bash
npm run lint
```

Fix reported issues.

**3. Clean build:**
```bash
npm run build:clean
```

**4. Check disk space:**
```bash
df -h  # macOS/Linux
```

Ensure >1GB free space.

---

### Out of Memory

**Error:**
```
JavaScript heap out of memory
```

**Solutions:**

**1. Increase Node memory:**
```bash
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

**2. Add to package.json:**
```json
{
  "scripts": {
    "build": "NODE_OPTIONS='--max-old-space-size=4096' vite build"
  }
}
```

**3. Close other applications**

---

### Obfuscation Cache Issues

**Issue:** JavaScript hashes changing every build

**Solutions:**

**1. Check .vite-cache:**
```bash
ls -la .vite-cache/obfuscation-cache.json
```

**2. Clear cache:**
```bash
npm run build:clean
```

**3. Verify deterministic obfuscation:**
```bash
# Build twice
npm run build
npm run build

# Hashes should be identical if no code changed
```

**[→ Cached obfuscation docs](../scripts/obfuscation/)**

---

## Runtime Issues

### White Screen

**Issue:** Browser shows blank page

**Solutions:**

**1. Check browser console:**
- Open DevTools (F12)
- Look for JavaScript errors
- Fix reported issues

**2. Check network tab:**
- Verify all files load (200 status)
- Check for 404 errors

**3. Verify build output:**
```bash
ls -la dist/
ls -la dist/static/js/
```

Ensure files exist.

---

### 404 on Page Refresh

**Issue:** Page works initially, 404 on refresh

**Cause:** Server not configured for MPA

**Solutions:**

**In development:**
```bash
npm run dev  # Use dev server
```

**In production (preview):**
```bash
npm run preview  # Use preview server
```

**For custom server:**
- Ensure `/dashboard/` serves `/dashboard/index.html`
- No SPA fallback needed (this is MPA)

---

### JavaScript Errors

**Error:**
```
TypeError: Cannot read property 'x' of undefined
```

**Solutions:**

**1. Add null checks:**
```typescript
// ❌ Bad
const name = user.name;

// ✅ Good
const name = user?.name;
```

**2. Use TypeScript:**
```typescript
// Define proper types
interface User {
  name: string;
}

const user: User = fetchUser();
```

**3. Check async data:**
```typescript
// ❌ Bad
return <div>{data.value}</div>;

// ✅ Good
if (!data) return <div>Loading...</div>;
return <div>{data.value}</div>;
```

---

## Performance Issues

### Slow Dev Server

**Issue:** HMR takes >1 second

**Solutions:**

**1. Reduce dependencies:**
- Remove unused imports
- Lazy load heavy components

**2. Optimize Vite config:**
```typescript
// vite.config.ts
export default defineConfig({
  optimizeDeps: {
    include: ['react', 'react-dom'], // Pre-bundle dependencies
  },
});
```

**3. Clear cache:**
```bash
rm -rf node_modules/.vite
npm run dev
```

---

### Large Bundle Size

**Issue:** Bundle >100 KB gzipped

**Solutions:**

**1. Analyze bundle:**
```bash
npm run build:analyze
```

**2. Lazy load routes/components:**
```typescript
const HeavyComponent = lazy(() => import('./HeavyComponent'));
```

**3. Check for duplicate dependencies:**
```bash
npm ls react  # Should show single version
```

**[→ Performance optimization guide](../performance-optimization-guide/)**

---

### Slow Build Times

**Issue:** Build takes >30 seconds

**Solutions:**

**1. Use cached build:**
```bash
npm run build  # Should be ~3-5s with cache
```

**2. Verify cache:**
```bash
ls -la .vite-cache/
```

Should contain `obfuscation-cache.json`.

**3. Clean build if needed:**
```bash
npm run build:clean
```

**[→ Build process docs](../production-build/)**

---

## TypeScript Issues

### Type Errors

**Error:**
```
Property 'x' does not exist on type 'Y'
```

**Solutions:**

**1. Define proper types:**
```typescript
interface MyProps {
  x: string;
}

function MyComponent({ x }: MyProps) {
  return <div>{x}</div>;
}
```

**2. Use type assertions (carefully):**
```typescript
const value = (data as MyType).property;
```

**3. Check imports:**
```typescript
// Ensure types are imported
import type { MyType } from './types';
```

---

### Path Alias Not Working

**Error:**
```
Cannot find module '@/components/...'
```

**Solutions:**

**1. Check tsconfig.json:**
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

**2. Check vite.config.ts:**
```typescript
resolve: {
  alias: {
    '@': path.resolve(__dirname, './src'),
  },
},
```

**3. Restart TypeScript server:**
- VS Code: Cmd/Ctrl + Shift + P → "Restart TypeScript Server"

---

## Getting More Help

### Check Documentation

- **[Complete Documentation](../README.md)**
- **[Production Build](../production-build/)**
- **[Performance Guide](../performance-optimization-guide/)**
- **[Scripts Documentation](../scripts/)**

---

### Debug Checklist

When reporting issues, provide:

- [ ] Error message (full output)
- [ ] Node version (`node --version`)
- [ ] npm version (`npm --version`)
- [ ] OS (macOS, Linux, Windows)
- [ ] Steps to reproduce
- [ ] What you've tried

---

## Quick Reference

| Issue | Solution |
|-------|----------|
| Port in use | `lsof -ti:8080 \| xargs kill -9` |
| npm install fails | `npm cache clean --force` |
| Build fails | `npm run build:clean` |
| White screen | Check browser console |
| Type errors | `npm run type-check` |
| Slow build | Check `.vite-cache/` exists |
| Large bundle | `npm run build:analyze` |

---

**Still stuck?** Review the [complete documentation](../README.md) or check specific guides for your issue.

