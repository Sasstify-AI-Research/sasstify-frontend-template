# Deployment Guide

Complete guide for deploying the production build to various hosting platforms.

---

## Table of Contents

**Quick Navigation** - Jump to the section you need:

### 🚀 Hosting Platforms
- [Prerequisites](#prerequisites) - Before deployment
- [Vercel](#vercel) - Auto-deployment setup
- [Netlify](#netlify) - Git or drag-drop deployment
- [AWS S3 + CloudFront](#aws-s3--cloudfront) - Cloud infrastructure
- [GitHub Pages](#github-pages) - Free static hosting
- [Cloudflare Pages](#cloudflare-pages) - CDN-first hosting

### 🔧 Server Configuration
- [Nginx](#nginx) - Nginx web server setup
- [Apache](#apache) - Apache .htaccess configuration
- [Docker Deployment](#docker-deployment) - Containerized deployment

### ⚙️ Configuration
- [Environment Variables](#environment-variables) - Build-time variables
- [SSL/HTTPS](#sslhttps) - Certificate setup
- [Performance Optimization](#performance-optimization) - CDN & security headers

### 📊 Operations
- [Monitoring](#monitoring) - Health checks & metrics
- [Rollback Procedure](#rollback-procedure) - Emergency rollback
- [Checklist](#checklist) - Pre, during, & post-deployment

### 🔗 Next Steps
- [Related Documentation](#related-documentation) - Additional resources

---

## Prerequisites

**Before Deployment:**
```bash
# Build the project
npm run build

# Verify build output
ls -la dist/

# Test locally
npm run preview
```

---

## Hosting Platforms

### Vercel

**Setup:**
1. Connect GitHub repository
2. Auto-detected as static site
3. Zero configuration needed

**Configuration (if needed):**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install"
}
```

**Custom Domains:**
- Add in Vercel dashboard
- Automatic SSL

**Deploy:**
```bash
# Via GitHub
git push origin main  # Auto-deploys

# Or CLI
npx vercel --prod
```

---

### Netlify

**Setup:**
1. Connect repository or drag/drop `dist/` folder
2. Configure build settings

**netlify.toml:**
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[headers]]
  for = "/static/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.html"
  [headers.values]
    Cache-Control = "no-cache"
```

**Deploy:**
```bash
# Via Git
git push

# Or CLI
npm install -g netlify-cli
netlify deploy --prod
```

---

### AWS S3 + CloudFront

**S3 Bucket Setup:**
```bash
# Create bucket
aws s3 mb s3://your-bucket-name

# Upload files
aws s3 sync dist/ s3://your-bucket-name/ \
  --delete \
  --cache-control "no-cache" \
  --exclude "static/*"

# Upload static assets with long cache
aws s3 sync dist/static/ s3://your-bucket-name/static/ \
  --delete \
  --cache-control "public, max-age=31536000, immutable"
```

**Bucket Policy:**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::your-bucket-name/*"
    }
  ]
}
```

**CloudFront Distribution:**
- Origin: S3 bucket
- Default Root Object: `index.html`
- Price Class: Choose based on needs
- SSL Certificate: AWS Certificate Manager

**Cache Behaviors:**
```
Pattern: /static/*
Cache Policy: CachingOptimized (1 year)

Pattern: /*
Cache Policy: CachingDisabled (for HTML)
```

**Invalidation After Deploy:**
```bash
aws cloudfront create-invalidation \
  --distribution-id YOUR_DIST_ID \
  --paths "/*"
```

---

### GitHub Pages

**Setup:**
```bash
# Install gh-pages
npm install --save-dev gh-pages
```

**Add Script to package.json:**
```json
{
  "scripts": {
    "deploy": "npm run build && gh-pages -d dist"
  }
}
```

**Deploy:**
```bash
npm run deploy
```

**Note:** GitHub Pages doesn't support custom cache headers. Consider using CloudFlare as CDN.

---

### Cloudflare Pages

**Setup:**
1. Connect GitHub repository
2. Configure build settings

**Build Configuration:**
```
Build command: npm run build
Build output directory: dist
Root directory: /
Node version: 18
```

**Deploy:**
```bash
# Via Git
git push

# Or Wrangler CLI
npx wrangler pages publish dist
```

**Cache Rules:**
- Automatic optimization
- Brotli compression
- HTTP/3 support

---

## Server Configuration

### Nginx

**Configuration:**
```nginx
server {
    listen 80;
    server_name example.com;
    root /var/www/dist;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Hashed assets - long cache
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    # HTML - no cache
    location ~* \.html$ {
        expires -1;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }

    # MPA routing
    location / {
        try_files $uri $uri/ =404;
    }
}
```

---

### Apache

**.htaccess:**
```apache
# Enable compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript
</IfModule>

# Cache headers
<IfModule mod_expires.c>
    ExpiresActive On
    
    # Hashed assets - 1 year
    <FilesMatch "\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf)$">
        ExpiresDefault "access plus 1 year"
        Header set Cache-Control "public, immutable"
    </FilesMatch>
    
    # HTML - no cache
    <FilesMatch "\.html$">
        ExpiresDefault "access plus 0 seconds"
        Header set Cache-Control "no-cache, no-store, must-revalidate"
    </FilesMatch>
</IfModule>
```

---

## Docker Deployment

**Dockerfile:**
```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Build and Run:**
```bash
# Build image
docker build -t your-app .

# Run container
docker run -p 80:80 your-app
```

---

## Environment Variables

**Build Time:**
```bash
# Set before build
export VITE_API_URL=https://api.example.com
npm run build
```

**CI/CD:**
```yaml
# GitHub Actions
env:
  VITE_API_URL: ${{ secrets.API_URL }}
```

**Access in Code:**
```typescript
const apiUrl = import.meta.env.VITE_API_URL;
```

---

## SSL/HTTPS

**Let's Encrypt (Certbot):**
```bash
# Install certbot
sudo apt-get install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d example.com -d www.example.com

# Auto-renewal (cron)
0 0 * * * certbot renew --quiet
```

**Cloudflare:**
- Automatic SSL
- Free tier available
- Full or Flexible mode

---

## Performance Optimization

### CDN Configuration

**Cache TTL:**
- HTML: 0 seconds (no-cache)
- CSS/JS: 1 year (immutable)
- Images: 1 month

**Compression:**
- Enable Brotli
- Enable Gzip fallback

**HTTP/2 or HTTP/3:**
- Enable for multiplexing
- Faster parallel downloads

---

### Security Headers

**Recommended Headers:**
```nginx
# Security headers
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';" always;
```

---

## Monitoring

### Health Checks

**Simple:**
```bash
# Check site is up
curl -I https://example.com/
```

**Advanced:**
```javascript
// pages/health.json
{
  "status": "ok",
  "version": "1.0.0",
  "timestamp": "2025-11-13T10:00:00Z"
}
```

### Metrics to Track

- **Uptime** - 99.9%+ target
- **Response Time** - <200ms target
- **Error Rate** - <0.1% target
- **Cache Hit Rate** - >95% target

---

## Rollback Procedure

**Vercel/Netlify:**
- Use dashboard to rollback to previous deployment

**AWS S3:**
```bash
# Enable versioning
aws s3api put-bucket-versioning \
  --bucket your-bucket \
  --versioning-configuration Status=Enabled

# Restore previous version
aws s3 cp s3://your-bucket/ s3://your-bucket/ \
  --recursive \
  --metadata-directive REPLACE \
  --version-id PREVIOUS_VERSION_ID
```

**Docker:**
```bash
# Tag deployments
docker tag your-app:latest your-app:v1.0.0

# Rollback
docker run -p 80:80 your-app:v1.0.0
```

---

## Checklist

**Pre-Deployment:**
- [ ] Run `npm run build`
- [ ] Test with `npm run preview`
- [ ] Check bundle sizes
- [ ] Verify environment variables
- [ ] Review security headers

**Deployment:**
- [ ] Deploy to staging first
- [ ] Verify deployment
- [ ] Check all pages load
- [ ] Test on mobile
- [ ] Verify cache headers

**Post-Deployment:**
- [ ] Clear CDN cache
- [ ] Test from multiple locations
- [ ] Monitor error logs
- [ ] Check analytics
- [ ] Verify performance metrics

---

## Related Documentation

- **[CI/CD Integration](./cicd.md)** - Automated deployments
- **[Performance](./performance.md)** - Optimization tips
- **[Troubleshooting](./troubleshooting.md)** - Common issues

---

**Last Updated:** November 2025
