import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const CACHE_DIR = '.vite-cache';
const CACHE_FILE = path.join(CACHE_DIR, 'obfuscation-cache.json');

/**
 * Manages caching of obfuscated code for unchanged files
 * This enables:
 * - 100% obfuscation coverage (all code obfuscated)
 * - 100% hash stability (unchanged files reuse exact cached output)
 * - ~95% cache efficiency (only re-obfuscate changed files)
 */
export class ObfuscationCache {
  constructor() {
    this.sourceHashes = new Map(); // Current build's source hashes
    this.cachedData = this.load();
    this.stats = {
      cached: 0,
      obfuscated: 0,
    };
  }

  /**
   * Load cached data from disk
   */
  load() {
    try {
      if (fs.existsSync(CACHE_FILE)) {
        const data = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'));
        console.log(`📂 Loaded obfuscation cache: ${Object.keys(data.chunks || {}).length} chunks`);
        return data;
      }
    } catch (error) {
      console.warn('⚠️  Failed to load obfuscation cache, treating as first build');
    }
    return { chunks: {} };
  }

  /**
   * Save cached data to disk
   */
  save() {
    try {
      if (!fs.existsSync(CACHE_DIR)) {
        fs.mkdirSync(CACHE_DIR, { recursive: true });
      }
      
      fs.writeFileSync(CACHE_FILE, JSON.stringify(this.cachedData, null, 2));
      
      const chunkCount = Object.keys(this.cachedData.chunks).length;
      const sizeKB = Math.round(fs.statSync(CACHE_FILE).size / 1024);
      console.log(`✅ Saved obfuscation cache: ${chunkCount} chunks (${sizeKB} KB)`);
    } catch (error) {
      console.error('❌ Failed to save obfuscation cache:', error.message);
    }
  }

  /**
   * Generate hash from content
   */
  hashContent(content) {
    return crypto.createHash('sha256').update(content).digest('hex');
  }

  /**
   * Track source file hash during transform phase
   */
  trackSourceHash(id, code) {
    // Only track source files (not node_modules unless needed)
    if (!id.includes('node_modules') || id.includes('react')) {
      const hash = this.hashContent(code);
      this.sourceHashes.set(id, hash);
    }
  }

  /**
   * Check if a module is unchanged compared to cache
   */
  isModuleUnchanged(id) {
    const currentHash = this.sourceHashes.get(id);
    if (!currentHash) return false;

    // Check all cached chunks for this module
    for (const chunkData of Object.values(this.cachedData.chunks)) {
      if (chunkData.moduleHashes && chunkData.moduleHashes[id]) {
        return chunkData.moduleHashes[id] === currentHash;
      }
    }
    
    return false;
  }

  /**
   * Generate a stable key for a chunk based on its module content hashes
   */
  generateChunkKey(chunk) {
    // Sort module IDs for consistency
    const sortedModuleIds = [...chunk.moduleIds].sort();
    
    // Create a composite key from all module hashes
    const moduleHashesKey = sortedModuleIds
      .map(id => {
        const hash = this.sourceHashes.get(id);
        return hash ? `${id}:${hash}` : `${id}:unknown`;
      })
      .join('|');
    
    return this.hashContent(moduleHashesKey);
  }

  /**
   * Get cached chunk if all modules are unchanged
   */
  getCachedChunk(chunk) {
    // Generate content-based key
    const chunkKey = this.generateChunkKey(chunk);
    const cachedChunk = this.cachedData.chunks[chunkKey];
    
    if (cachedChunk) {
      this.stats.cached++;
      return cachedChunk;
    }

    return null;
  }

  /**
   * Save obfuscated chunk to cache (without hash - added later in generateBundle)
   */
  saveChunk(chunk, obfuscatedCode) {
    // Use content-based key for consistency
    const chunkKey = this.generateChunkKey(chunk);
    
    // Build module hashes map
    const moduleHashes = {};
    chunk.moduleIds.forEach(id => {
      const hash = this.sourceHashes.get(id);
      if (hash) {
        moduleHashes[id] = hash;
      }
    });

    this.cachedData.chunks[chunkKey] = {
      moduleHashes,
      obfuscatedCode,
      outputHash: null, // Will be set in generateBundle
      fileName: chunk.fileName,
      chunkName: chunk.name,
      timestamp: new Date().toISOString(),
    };

    this.stats.obfuscated++;
  }
  
  /**
   * Update chunk hash after Rollup finalizes filenames
   */
  updateChunkHash(chunk, outputHash) {
    const chunkKey = this.generateChunkKey(chunk);
    const cachedChunk = this.cachedData.chunks[chunkKey];
    
    if (cachedChunk) {
      cachedChunk.outputHash = outputHash;
      cachedChunk.fileName = chunk.fileName;
    }
  }

  /**
   * Get statistics for reporting
   */
  getStats() {
    return {
      ...this.stats,
      total: this.stats.cached + this.stats.obfuscated,
      hitRate: this.stats.cached + this.stats.obfuscated > 0
        ? Math.round((this.stats.cached / (this.stats.cached + this.stats.obfuscated)) * 100)
        : 0,
    };
  }

  /**
   * Clear cache (for build:clean)
   */
  clear() {
    try {
      if (fs.existsSync(CACHE_FILE)) {
        fs.unlinkSync(CACHE_FILE);
        console.log('🗑️  Cleared obfuscation cache');
      }
    } catch (error) {
      console.error('❌ Failed to clear cache:', error.message);
    }
  }
}

