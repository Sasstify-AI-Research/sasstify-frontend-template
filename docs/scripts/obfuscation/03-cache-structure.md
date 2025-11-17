# Cache Structure

Complete documentation of the obfuscation cache format and management.

---

## Table of Contents

**Quick Navigation:**

- [Cache File Location](#cache-file-location)
- [Cache File Format](#cache-file-format)
- [Content-Based Cache Keys](#content-based-cache-keys)
- [Cache Operations](#cache-operations)
- [Cache Validation](#cache-validation)
- [Cache Management](#cache-management)

---

## Cache File Location

**Path:** `.vite-cache/obfuscation-cache.json`

**Storage:**
- Created automatically on first build
- Updated on every build
- Persists across builds
- Ignored by Git (`.gitignore`)

**Size:** ~4-5 MB (typical project with 14 chunks)

---

## 📦 Cache File Format

### Top-Level Structure

```json
{
  "chunks": {
    "cache-key-1": { /* chunk data */ },
    "cache-key-2": { /* chunk data */ },
    "cache-key-3": { /* chunk data */ }
  }
}
```

---

### Chunk Entry Format

```json
{
  "chunks": {
    "a1b2c3d4e5f6...": {
      "moduleHashes": {
        "src/pages/index/Index.tsx": "hash_of_file_content_abc123",
        "src/components/Header.tsx": "hash_of_file_content_def456",
        "src/hooks/useSectionNavigation.ts": "hash_of_file_content_ghi789"
      },
      "obfuscatedCode": "!function(){var _0x1a2b=0x1,_0x3c4d=0x2;...",
      "outputHash": "BDsDggUV",
      "fileName": "static/js/BDsDggUV.js",
      "chunkName": "main",
      "timestamp": "2025-11-13T10:00:00.000Z"
    }
  }
}
```

---

### Field Descriptions

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `moduleHashes` | Object | Map of file paths to content hashes | `{"src/file.tsx": "abc123"}` |
| `obfuscatedCode` | String | The obfuscated JavaScript code | `"!function(){...}"` |
| `outputHash` | String | The hash used in the filename | `"BDsDggUV"` |
| `fileName` | String | Full output filename | `"static/js/BDsDggUV.js"` |
| `chunkName` | String | Rollup chunk name | `"main"` |
| `timestamp` | String | When this cache entry was created | ISO 8601 format |

---

### Size Breakdown

**For a typical project (14 chunks):**

| Component | Size | Percentage |
|-----------|------|------------|
| Obfuscated Code | ~4.2 MB | ~92% |
| Module Hashes | ~300 KB | ~7% |
| Metadata | ~50 KB | ~1% |
| **Total** | **~4.5 MB** | **100%** |

---

## 🔑 Content-Based Cache Keys

### Key Generation Algorithm

```javascript
function generateChunkKey(chunk) {
  // 1. Get all module IDs in this chunk
  const moduleIds = Array.from(chunk.moduleIds || []);
  
  // 2. Get hash for each module
  const moduleHashes = {};
  for (const id of moduleIds) {
    const normalizedId = normalizePath(id);
    const hash = sourceHashes.get(normalizedId);
    if (hash) {
      moduleHashes[normalizedId] = hash;
    }
  }
  
  // 3. Sort for consistency
  const sortedKeys = Object.keys(moduleHashes).sort();
  const sortedHashes = {};
  for (const key of sortedKeys) {
    sortedHashes[key] = moduleHashes[key];
  }
  
  // 4. Create deterministic string
  const cacheKeyString = JSON.stringify(sortedHashes);
  
  // 5. Hash it
  return crypto.createHash('sha256')
    .update(cacheKeyString)
    .digest('hex');
}
```

---

### Key Properties

**Deterministic:**
- Same source files → Same key
- Always produces identical key for identical content

**Stable:**
- Independent of chunk name
- Independent of build timestamp
- Independent of file order

**Unique:**
- Different source → Different key
- No collisions (SHA-256)

---

### Example Key Generation

**Scenario:**

```javascript
// Chunk contains 3 files
Chunk: {
  name: "main",
  moduleIds: [
    "/path/src/pages/index/Index.tsx",
    "/path/src/components/Header.tsx",
    "/path/src/hooks/useSectionNavigation.ts"
  ]
}

// Step 1: Get hashes
moduleHashes = {
  "src/pages/index/Index.tsx": "abc123...",
  "src/components/Header.tsx": "def456...",
  "src/hooks/useSectionNavigation.ts": "ghi789..."
}

// Step 2: Sort keys
sorted = {
  "src/components/Header.tsx": "def456...",
  "src/hooks/useSectionNavigation.ts": "ghi789...",
  "src/pages/index/Index.tsx": "abc123..."
}

// Step 3: Create string
cacheKeyString = '{"src/components/Header.tsx":"def456...","src/hooks/useSectionNavigation.ts":"ghi789...","src/pages/index/Index.tsx":"abc123..."}'

// Step 4: Hash it
cacheKey = sha256(cacheKeyString)
         = "a1b2c3d4e5f6789..."
```

---

## 🔄 Cache Operations

### 1. Load Cache (Build Start)

```javascript
function loadCache() {
  const cacheFile = '.vite-cache/obfuscation-cache.json';
  
  try {
    if (fs.existsSync(cacheFile)) {
      const data = fs.readFileSync(cacheFile, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.warn('⚠️  Cache corrupted, starting fresh');
  }
  
  return { chunks: {} };
}
```

---

### 2. Track Source Hash (During Transform)

```javascript
function trackSourceHash(id, code) {
  const hash = crypto.createHash('sha256')
    .update(code)
    .digest('hex');
  
  const normalized = normalizePath(id);
  sourceHashes.set(normalized, hash);
}
```

---

### 3. Get Cached Chunk (Before Obfuscation)

```javascript
function getCachedChunk(chunk) {
  const cacheKey = generateChunkKey(chunk);
  
  if (cache.chunks[cacheKey]) {
    // Verify all modules still have same hash
    const entry = cache.chunks[cacheKey];
    const currentModuleHashes = getModuleHashes(chunk);
    
    // Compare
    if (deepEqual(entry.moduleHashes, currentModuleHashes)) {
      return entry;  // Cache hit!
    }
  }
  
  return null;  // Cache miss
}
```

---

### 4. Save Chunk (After Obfuscation)

```javascript
function saveChunk(chunk, obfuscatedCode) {
  const cacheKey = generateChunkKey(chunk);
  const moduleHashes = getModuleHashes(chunk);
  
  cache.chunks[cacheKey] = {
    moduleHashes,
    obfuscatedCode,
    outputHash: null,  // Will be set in generateBundle
    fileName: null,
    chunkName: chunk.name,
    timestamp: new Date().toISOString()
  };
}
```

---

### 5. Update Output Hash (After Bundle Generation)

```javascript
function updateChunkHash(chunk, outputHash) {
  const cacheKey = generateChunkKey(chunk);
  
  if (cache.chunks[cacheKey]) {
    cache.chunks[cacheKey].outputHash = outputHash;
    cache.chunks[cacheKey].fileName = chunk.fileName;
  }
}
```

---

### 6. Save Cache (Build End)

```javascript
function saveCache() {
  const cacheFile = '.vite-cache/obfuscation-cache.json';
  const cacheDir = path.dirname(cacheFile);
  
  // Ensure directory exists
  if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir, { recursive: true });
  }
  
  // Write cache
  fs.writeFileSync(
    cacheFile,
    JSON.stringify(cache, null, 2),
    'utf-8'
  );
  
  const sizeKB = (fs.statSync(cacheFile).size / 1024).toFixed(0);
  console.log(`✅ Saved cache: ${Object.keys(cache.chunks).length} chunks (${sizeKB} KB)`);
}
```

---

## ✅ Cache Validation

### Validation Checks

**1. File Integrity:**
```javascript
// Check cache file is valid JSON
try {
  JSON.parse(cacheContent);
} catch (error) {
  console.warn('Cache corrupted, rebuilding');
  return emptyCache();
}
```

**2. Module Hash Matching:**
```javascript
// Verify all module hashes still match
function validateCacheEntry(entry, chunk) {
  const currentHashes = getModuleHashes(chunk);
  
  // Check all modules present
  for (const [moduleId, hash] of Object.entries(currentHashes)) {
    if (entry.moduleHashes[moduleId] !== hash) {
      return false;  // Hash changed!
    }
  }
  
  return true;  // All match
}
```

**3. Schema Validation:**
```javascript
// Ensure required fields exist
function isValidCacheEntry(entry) {
  return entry &&
         entry.moduleHashes &&
         entry.obfuscatedCode &&
         typeof entry.obfuscatedCode === 'string' &&
         entry.obfuscatedCode.length > 0;
}
```

---

## 🗑️ Cache Management

### Clearing Cache

**Manual:**
```bash
# Option 1: Clean build script
npm run build:clean

# Option 2: Manual deletion
rm -rf .vite-cache
npm run build
```

**Automatic (when needed):**
- Cache file corrupted
- Cache format version mismatch
- Obfuscation settings changed significantly

---

### Cache Size Management

**Typical Growth:**
- First build: 4-5 MB
- After 10 builds: 4-5 MB (same chunks)
- After 100 builds: 5-6 MB (slight growth as old entries retained)

**Cleanup Strategy:**
- Cache is overwritten on each build
- Old entries for deleted files remain (minimal impact)
- Manual cleanup recommended every few months

---

### Cache in CI/CD

**GitHub Actions:**
```yaml
- name: Cache obfuscation
  uses: actions/cache@v3
  with:
    path: .vite-cache
    key: obfuscation-${{ hashFiles('**/*.{ts,tsx}') }}
```

**Benefits:**
- Reuse cache across CI builds
- Faster CI/CD pipelines
- Consistent hashes across environments

**See:** [CI/CD Cache Management](../production-build/07-cicd.md#cache-management)

---

## 🔍 Debugging Cache

### Check Cache Status

```bash
# Check if cache exists
ls -lh .vite-cache/obfuscation-cache.json

# View cache size
du -sh .vite-cache/

# Count cached chunks
cat .vite-cache/obfuscation-cache.json | grep '"obfuscatedCode"' | wc -l
```

---

### Inspect Cache Contents

```bash
# Pretty print cache (first 100 lines)
head -n 100 .vite-cache/obfuscation-cache.json | jq '.'

# List all cached chunk names
cat .vite-cache/obfuscation-cache.json | jq '.chunks[].chunkName'

# Check specific chunk
cat .vite-cache/obfuscation-cache.json | jq '.chunks[] | select(.chunkName=="main")'
```

---

### Build Logs

```
♻️  Reusing cached obfuscated: react-vendor (Dj7pr43P)
♻️  Reusing cached obfuscated: main (BDsDggUV)
🔒 Newly obfuscated: dashboard (C3cfMgm3)

📊 Obfuscation Cache Statistics:
   Cached & reused:  13 chunks
   Newly obfuscated: 1 chunk
   Total chunks:     14
   Cache hit rate:   93%
```

---

## 📖 Related Documentation

- **[Implementation](./02-implementation.md)** - How caching is implemented
- **[Performance](./04-performance.md)** - Cache performance metrics
- **[Usage](./06-usage.md)** - How to use caching

---

**Last Updated:** November 2025


