# Network Optimization

CDN, compression, caching strategies, and HTTP optimization.

---

## Table of Contents

- [HTTP/2 & HTTP/3](#http2--http3)
- [CDN](#cdn)
- [Compression](#compression)
- [Caching Strategy](#caching-strategy)

---

## HTTP/2 & HTTP/3

### What They Provide

**HTTP/2:**
- Multiplexing (parallel requests over single connection)
- Header compression
- Server push
- Binary protocol

**HTTP/3:**
- Built on QUIC (UDP-based)
- Faster connection establishment
- Better mobile performance
- No head-of-line blocking

---

### How to Enable

**Use Modern Hosting:**
- **Vercel** - Automatic HTTP/2 & HTTP/3
- **Netlify** - Automatic HTTP/2 & HTTP/3
- **Cloudflare** - Enable in dashboard
- **AWS CloudFront** - Enable in distribution settings

**Verify:**
```bash
# Check HTTP version
curl -I --http2 https://your-site.com

# Look for:
HTTP/2 200
# or
HTTP/3 200
```

---

## CDN

### What is a CDN?

**Content Delivery Network:**
- Global network of servers
- Serves content from nearest location
- Reduces latency
- Offloads origin server

---

### Recommended CDNs

#### 1. Vercel (Recommended)

```bash
# Deploy to Vercel
npm install -g vercel
vercel deploy

# Features:
# - Edge Network (global)
# - Automatic HTTPS
# - HTTP/2 & HTTP/3
# - Optimal caching
# - Zero config
```

**Best for:** Modern web apps, zero configuration

#### 2. Netlify

```bash
# Deploy to Netlify
npm install -g netlify-cli
netlify deploy --prod

# Features:
# - Global CDN
# - Instant rollbacks
# - Edge functions
# - Automatic HTTPS
```

**Best for:** Static sites, simple apps

#### 3. Cloudflare

```bash
# Point DNS to Cloudflare
# Enable CDN in dashboard

# Features:
# - Free tier
# - DDoS protection
# - Web Application Firewall
# - Analytics
```

**Best for:** High-traffic sites, security

#### 4. AWS CloudFront

```bash
# Create CloudFront distribution
# Point to S3 bucket

# Features:
# - Integration with AWS
# - Lambda@Edge
# - Fine-grained control
# - Pay-as-you-go
```

**Best for:** AWS infrastructure, enterprise

---

### CDN Best Practices

#### 1. Cache Static Assets Long-Term

```
/static/* → Cache-Control: public, max-age=31536000, immutable
/*.html → Cache-Control: no-cache
```

#### 2. Use CDN for All Assets

```typescript
// ✅ Good - CDN URL
<img src="https://cdn.example.com/image.jpg" />

// ❌ Bad - origin server
<img src="https://www.example.com/image.jpg" />
```

#### 3. Purge Cache on Deploy

```bash
# Cloudflare
curl -X POST "https://api.cloudflare.com/client/v4/zones/{zone_id}/purge_cache"

# Vercel - automatic on deploy

# Netlify - automatic on deploy
```

---

## Compression

### Built-in Compression

Modern hosting platforms automatically compress:
- Gzip (universal support)
- Brotli (better compression)

---

### Manual Configuration (if needed)

#### Vite Compression Plugin

```typescript
// vite.config.ts
import viteCompression from 'vite-plugin-compression';

export default defineConfig({
  plugins: [
    // Brotli compression
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
      threshold: 10240, // Only compress files >10 KB
    }),
    // Gzip compression
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 10240,
    }),
  ],
});
```

#### Nginx Configuration

```nginx
# Enable gzip
gzip on;
gzip_vary on;
gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
gzip_min_length 1000;

# Enable brotli
brotli on;
brotli_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
brotli_comp_level 6;
```

---

### Compression Comparison

| Format | Compression | Browser Support | Recommendation |
|--------|-------------|----------------|----------------|
| **None** | 0% | 100% | ❌ Never |
| **Gzip** | ~70% | 100% | ✅ Fallback |
| **Brotli** | ~80% | 95%+ | ✅ Primary |

**Result:**
- JavaScript: 236 KB → 56 KB (brotli)
- CSS: 100 KB → 18 KB (brotli)

---

## Caching Strategy

### Cache Headers

#### Static Assets (Hashed Files)

```
Cache-Control: public, max-age=31536000, immutable
```

**For:**
- `/static/js/main.[hash].js`
- `/static/css/style.[hash].css`
- `/static/images/logo.[hash].png`

**Why:**
- Hash changes when content changes
- Can cache forever (immutable)
- No revalidation needed

---

#### HTML Files

```
Cache-Control: no-cache
```

**For:**
- `/index.html`
- `/dashboard/index.html`

**Why:**
- Always check for updates
- Allows instant deployments
- Revalidates with server

---

#### API Responses

```
Cache-Control: private, max-age=300
```

**For:**
- User-specific data
- Frequently changing data

**Why:**
- Private (not cacheable by CDN)
- 5 minute cache in browser
- Reduces API calls

---

### Example Configurations

#### Vercel (vercel.json)

```json
{
  "headers": [
    {
      "source": "/static/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/(.*).html",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "no-cache"
        }
      ]
    }
  ]
}
```

#### Netlify (_headers)

```
/static/*
  Cache-Control: public, max-age=31536000, immutable

/*.html
  Cache-Control: no-cache
```

#### Nginx

```nginx
location /static/ {
  expires 1y;
  add_header Cache-Control "public, immutable";
}

location ~ \.html$ {
  expires -1;
  add_header Cache-Control "no-cache";
}
```

---

## Quick Wins

### 1-Minute Optimizations

```bash
# ✅ Deploy to Vercel/Netlify (automatic CDN)
vercel deploy

# ✅ Enable Cloudflare (free CDN)
# Point DNS → Enable orange cloud

# ✅ Add cache headers (if self-hosting)
# See nginx/vercel examples above
```

---

## Performance Impact

### Before CDN

```
Origin Server (US)
User in Asia: 2000ms latency
User in Europe: 800ms latency
User in US: 50ms latency
```

### After CDN

```
Edge Servers (Global)
User in Asia: 50ms latency (40x faster!)
User in Europe: 40ms latency (20x faster!)
User in US: 30ms latency (1.6x faster!)
```

---

## Network Checklist

- [ ] Using HTTP/2 or HTTP/3
- [ ] Assets served from CDN
- [ ] Brotli/gzip compression enabled
- [ ] Cache headers configured
- [ ] Static assets cached long-term
- [ ] HTML files set to no-cache

---

## Next Steps

- **[Monitoring & Tools](./06-monitoring-and-tools.md)** - Measure and track performance
- **[Production Build](../production-build/)** - Build pipeline documentation
- **[Hash Stability](../scripts/obfuscation/)** - Optimal caching with obfuscation

---

**Quick check:** CDN enabled? Compression active? Cache headers set? ✅

