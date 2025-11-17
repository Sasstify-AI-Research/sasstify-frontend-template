# Implementation: Technical Details

Complete technical documentation of the cached obfuscation implementation.

---

## Table of Contents

**Quick Navigation:**

- [Components Created](#components-created)
- [Key Innovation](#key-innovation-content-based-cache-keys)
- [How It Works](#how-it-works-technical-deep-dive)
- [Build Pipeline Phases](#build-pipeline-phases)
- [Files Modified](#files-modified)

---

## 🔧 Components Created

### 1. `scripts/obfuscation-cache.js`

**Purpose:** Manages cache storage and retrieval

**Responsibilities:**
- Load/save cache from `.vite-cache/obfuscation-cache.json`
- Track source file content hashes
- Store obfuscated code + output hashes
- Generate content-based cache keys
- Validate cache integrity

**Size:** ~200 lines

**Key Functions:**
```javascript
class ObfuscationCache {
  loadCache()           // Load from disk
  saveCache()           // Save to disk
  trackSourceHash()     // Track file hash
  generateChunkKey()    // Create cache key
  getCachedChunk()      // Retrieve cached output
  saveChunk()           // Store obfuscated code
  updateChunkHash()     // Update output hash
}
```

---

### 2. `scripts/cached-obfuscation-plugin.js`

**Purpose:** Vite plugin for intelligent obfuscation

**Responsibilities:**
- Integrate with Vite build pipeline
- Decide when to obfuscate vs reuse cache
- Force Rollup to use cached hashes
- Log cache statistics

**Size:** ~180 lines

**Plugin Hooks Used:**
```javascript
export default function cachedObfuscation(options) {
  return {
    name: 'cached-obfuscation',
    configResolved(config) { },    // Setup
    transform(code, id) { },       // Track source hashes
    renderChunk(code, chunk) { },  // Obfuscate or reuse
    generateBundle(opts, bundle) { }, // Restore hashes
    closeBundle() { }              // Save cache
  };
}
```

---

### 3. Updated `vite.config.ts`

**Changes:**
```typescript
// ❌ Before (traditional obfuscation)
import JavaScriptObfuscator from 'vite-plugin-javascript-obfuscator';

plugins: [
  JavaScriptObfuscator({
    // Settings
  })
]

// ✅ After (cached obfuscation)
import { cachedObfuscation } from './scripts/cached-obfuscation-plugin';

plugins: [
  cachedObfuscation({
    // All aggressive settings enabled!
    controlFlowFlattening: true,
    stringArrayRotate: true,  // Random (OK now!)
    // ... many more
  })
]
```

---

## 💡 Key Innovation: Content-Based Cache Keys

### The Problem with Traditional Caching

**Traditional Approach (doesn't work):**
```javascript
// Cache by chunk name
const cacheKey = chunk.name;  // e.g., "main", "vendor"
cache[cacheKey] = obfuscatedCode;
```

**Why it fails:**
- Chunk names can change between builds
- Chunk composition can change
- No way to detect if source changed
- False cache hits → wrong output
- False cache misses → wasted work

---

### Our Solution: Content-Based Keys

**Our Approach (works perfectly):**
```javascript
// Cache by source file content hashes
function generateChunkKey(chunk) {
  const moduleHashes = {};
  
  // Hash each source file's content
  for (const moduleId of chunk.moduleIds) {
    moduleHashes[moduleId] = hashFileContent(moduleId);
  }
  
  // Combine all hashes into a single key
  const combined = JSON.stringify(moduleHashes);
  return crypto.createHash('sha256').update(combined).digest('hex');
}
```

**Why this works:**
- Same source files → Same content hashes → Same cache key
- Different source files → Different hashes → Cache miss (correct!)
- Chunk name/structure can change → Cache still matches if content same
- Perfect cache reuse with zero false positives

---

### Example

**Scenario:** Chunk name changes but content stays the same

```javascript
// Build 1
Chunk name: "index-main"
Source files: 
  - src/pages/index/Index.tsx (hash: abc123)
  - src/components/Header.tsx (hash: def456)
Cache key: hash("abc123-def456") = "xyz789"

// Build 2 (Vite changed internal chunking)
Chunk name: "main-entry"  ← NAME CHANGED!
Source files:
  - src/pages/index/Index.tsx (hash: abc123)  ← Same!
  - src/components/Header.tsx (hash: def456)  ← Same!
Cache key: hash("abc123-def456") = "xyz789"  ← MATCHES!

Result: Cache hit! ✅
```

---

## 🎓 How It Works (Technical Deep Dive)

### Phase 1: `transform` - Track Source Hashes

**When:** During initial code transformation

**Purpose:** Build a map of file → content hash

```javascript
transform(code, id) {
  // Skip node_modules
  if (id.includes('node_modules')) return null;
  
  // Track source file hash
  if (cache) {
    const hash = crypto.createHash('sha256')
      .update(code)
      .digest('hex');
    
    cache.trackSourceHash(id, hash);
  }
  
  return null;  // Don't transform
}
```

**Result:** Cache knows hash of every source file

---

### Phase 2: `renderChunk` - Obfuscate or Reuse

**When:** After Rollup generates chunks, before writing to disk

**Purpose:** Return obfuscated code (cached or new)

```javascript
renderChunk(code, chunk) {
  // Skip in development
  if (!isProduction || !cache) return null;
  
  // Skip non-JS files
  if (!chunk.fileName.endsWith('.js')) return null;
  
  // Try to get cached obfuscated code
  const cachedChunk = cache.getCachedChunk(chunk);
  
  if (cachedChunk) {
    // Cache hit! Reuse obfuscated code
    console.log(`♻️  Reusing cached obfuscated: ${chunk.name}`);
    return {
      code: cachedChunk.obfuscatedCode,
      map: null
    };
  }
  
  // Cache miss - obfuscate now
  console.log(`🔒 Obfuscating: ${chunk.name}`);
  try {
    const obfuscated = JavaScriptObfuscatorLib.obfuscate(
      code,
      obfuscatorOptions
    );
    const obfuscatedCode = obfuscated.getObfuscatedCode();
    
    // Save to cache (without hash yet)
    cache.saveChunk(chunk, obfuscatedCode);
    
    return {
      code: obfuscatedCode,
      map: null
    };
  } catch (error) {
    console.error(`❌ Obfuscation failed:`, error.message);
    return null;  // Use original code
  }
}
```

**Result:** Chunk has obfuscated code (cached or newly generated)

---

### Phase 3: `generateBundle` - Capture & Restore Hashes

**When:** After Rollup assigns final filenames with hashes

**Purpose:** Ensure identical hashes for unchanged files

```javascript
generateBundle(options, bundle) {
  if (!isProduction || !cache) return;
  
  const modifications = [];
  
  for (const [fileName, output] of Object.entries(bundle)) {
    if (output.type !== 'chunk') continue;
    
    // Get cached chunk
    const cachedChunk = cache.getCachedChunk(output);
    
    // Extract current hash from filename
    // e.g., "static/js/abc123.js" → "abc123"
    const currentHashMatch = fileName.match(/\/([a-zA-Z0-9_-]+)\.js$/);
    const currentHash = currentHashMatch ? currentHashMatch[1] : null;
    
    if (cachedChunk && cachedChunk.outputHash) {
      // We have a cached hash - use it!
      if (currentHash && currentHash !== cachedChunk.outputHash) {
        const newFileName = fileName.replace(
          currentHash,
          cachedChunk.outputHash
        );
        
        modifications.push({
          oldName: fileName,
          newName: newFileName,
          output,
          cachedHash: cachedChunk.outputHash
        });
        
        console.log(`♻️  Reusing cached hash: ${cachedChunk.outputHash}`);
      }
    } else if (currentHash) {
      // New chunk - save its hash for next time
      cache.updateChunkHash(output, currentHash);
      console.log(`🔒 Newly obfuscated with hash: ${currentHash}`);
    }
  }
  
  // Apply filename changes
  for (const mod of modifications) {
    delete bundle[mod.oldName];
    bundle[mod.newName] = {
      ...mod.output,
      fileName: mod.newName
    };
  }
}
```

**Result:** Unchanged chunks have exact same hash as before

---

### Phase 4: `closeBundle` - Save Cache

**When:** After bundle is completely generated

**Purpose:** Persist cache to disk

```javascript
closeBundle() {
  if (isProduction && cache) {
    cache.saveCache();
    console.log(`✅ Saved obfuscation cache`);
  }
}
```

**Result:** Cache written to `.vite-cache/obfuscation-cache.json`

---

## 🔄 Build Pipeline Phases

### Complete Flow Diagram

```
┌─────────────────────────────────────────────────────┐
│  1. SOURCE FILES                                     │
│     - TypeScript compilation                         │
│     - React JSX transformation                       │
│     - Track file hashes (transform hook)            │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│  2. MODULE BUNDLING                                  │
│     - Rollup combines modules                        │
│     - Code splitting                                 │
│     - Tree shaking                                   │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│  3. OBFUSCATION (renderChunk hook)                  │
│                                                      │
│     Check cache:                                     │
│     ├─ Cache hit?  → Reuse obfuscated code         │
│     └─ Cache miss? → Obfuscate now + save to cache │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│  4. HASH GENERATION                                  │
│     - Rollup generates content-based hash            │
│     - Filename: static/js/[hash].js                  │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│  5. HASH RESTORATION (generateBundle hook)          │
│                                                      │
│     For each chunk:                                  │
│     ├─ Has cached hash? → Replace with cached hash  │
│     └─ New chunk?       → Save hash for next build  │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│  6. WRITE TO DISK                                    │
│     - Write files with stable hashes                 │
│     - Save cache (closeBundle hook)                  │
└─────────────────────────────────────────────────────┘
```

---

## 📂 Files Modified

### New Files Created

1. **`scripts/obfuscation-cache.js`** (~200 lines)
   - Cache management logic
   - Content-based key generation
   - File hash tracking

2. **`scripts/cached-obfuscation-plugin.js`** (~180 lines)
   - Vite plugin implementation
   - Hook into build pipeline
   - Logging and statistics

---

### Modified Files

3. **`vite.config.ts`**
   - Replaced `JavaScriptObfuscator` with `cachedObfuscation`
   - Enabled all aggressive obfuscation settings
   - Removed `__BUILD_TIME__` (for hash stability)

4. **`.gitignore`**
   - Added `.vite-cache/` to ignore list

5. **`package.json`**
   - Added `build:clean` script:
     ```json
     "build:clean": "rm -rf dist .vite-cache && npm run build"
     ```

---

## 🔍 Code Quality

### Error Handling

**Obfuscation failures:**
```javascript
try {
  const obfuscated = JavaScriptObfuscatorLib.obfuscate(code, options);
  return obfuscated.getObfuscatedCode();
} catch (error) {
  console.error(`❌ Obfuscation failed for ${chunkName}:`, error.message);
  return null;  // Use un-obfuscated code (fallback)
}
```

**Cache corruption:**
```javascript
try {
  const cache = JSON.parse(fs.readFileSync(cacheFile, 'utf-8'));
  return cache;
} catch (error) {
  console.warn('⚠️  Cache corrupted, starting fresh');
  return { chunks: {} };  // Start with empty cache
}
```

---

### Performance Optimizations

**1. Skip node_modules tracking:**
```javascript
if (id.includes('node_modules')) return null;
// Don't track vendor code hashes
```

**2. Cache file size management:**
```javascript
// Only store necessary data
{
  moduleHashes: {},      // Small (just hashes)
  obfuscatedCode: "",    // Required
  outputHash: "",        // Small (8 chars)
  // Don't store: original code, source maps, etc.
}
```

**3. Incremental cache updates:**
```javascript
// Only save cache if changes were made
if (cacheModified) {
  cache.saveCache();
}
```

---

## 📖 Related Documentation

- **[Cache Structure](./03-cache-structure.md)** - Cache file format details
- **[Performance](./04-performance.md)** - Performance metrics
- **[Security](./05-security.md)** - Obfuscation settings
- **[Usage](./06-usage.md)** - How to use

---

**Last Updated:** November 2025


