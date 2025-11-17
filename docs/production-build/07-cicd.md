# CI/CD Integration

Continuous Integration and Deployment configuration for automated builds and deployments.

---

## Table of Contents

**Quick Navigation** - Jump to the section you need:

### 🔄 CI/CD Platforms
- [GitHub Actions](#github-actions) - Complete workflow & separate jobs
- [GitLab CI/CD](#gitlab-cicd) - Pipeline configuration
- [CircleCI](#circleci) - Build & deploy jobs

### ⚙️ Configuration
- [Environment Variables](#environment-variables) - Secrets & variables
- [Caching Strategies](#caching-strategies) - Node modules & obfuscation cache
- [Cache Management](#cache-management) - Size monitoring, retention, & troubleshooting
- [Build Optimization](#build-optimization) - Parallel jobs & conditional steps

### 📢 Operations
- [Notifications](#notifications) - Slack & email alerts
- [Security Scanning](#security-scanning) - Dependency audit & CodeQL
- [Performance Monitoring](#performance-monitoring) - Lighthouse CI

### 🚀 Deployment
- [Deployment Strategies](#deployment-strategies) - Blue-green & canary
- [Rollback Automation](#rollback-automation) - Auto-rollback on failure
- [Best Practices](#best-practices) - Security, performance, & reliability

### 🔗 Next Steps
- [Related Documentation](#related-documentation) - Additional resources

---

## GitHub Actions

### Complete Workflow

**.github/workflows/deploy.yml:**
```yaml
name: Build and Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Type check
        run: npm run type-check
      
      - name: Lint
        run: npm run lint
      
      - name: Cache obfuscation
        uses: actions/cache@v3
        with:
          path: .vite-cache
          key: ${{ runner.os }}-obfuscation-${{ hashFiles('**/*.{ts,tsx,js,jsx}') }}
          restore-keys: |
            ${{ runner.os }}-obfuscation-
      
      - name: Build
        run: npm run build
        env:
          NODE_ENV: production
          VITE_API_URL: ${{ secrets.API_URL }}
      
      - name: Upload artifacts
        uses: actions/upload-artifact@v3
        with:
          name: dist
          path: dist/
      
      - name: Deploy to Vercel
        if: github.ref == 'refs/heads/main'
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

---

### Separate Workflows

**Build Only:**
```yaml
name: Build Check

on: [pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
```

**Deploy Only:**
```yaml
name: Deploy Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run build
      - name: Deploy
        # Your deployment step
```

---

## GitLab CI/CD

**.gitlab-ci.yml:**
```yaml
stages:
  - test
  - build
  - deploy

variables:
  NODE_VERSION: "18"

cache:
  paths:
    - node_modules/
    - .vite-cache/

test:
  stage: test
  image: node:18
  script:
    - npm ci
    - npm run lint
    - npm run type-check

build:
  stage: build
  image: node:18
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - dist/
    expire_in: 1 week

deploy_production:
  stage: deploy
  image: node:18
  only:
    - main
  script:
    - npm ci
    - npm run build
    # Add deployment commands here
```

---

## CircleCI

**.circleci/config.yml:**
```yaml
version: 2.1

jobs:
  build:
    docker:
      - image: cimg/node:18.0
    steps:
      - checkout
      - restore_cache:
          keys:
            - v1-deps-{{ checksum "package-lock.json" }}
            - v1-deps-
      - run: npm ci
      - save_cache:
          key: v1-deps-{{ checksum "package-lock.json" }}
          paths:
            - node_modules
            - .vite-cache
      - run: npm run type-check
      - run: npm run lint
      - run: npm run build
      - persist_to_workspace:
          root: .
          paths:
            - dist
  
  deploy:
    docker:
      - image: cimg/node:18.0
    steps:
      - checkout
      - attach_workspace:
          at: .
      # Add deployment steps

workflows:
  build_and_deploy:
    jobs:
      - build
      - deploy:
          requires:
            - build
          filters:
            branches:
              only: main
```

---

## Environment Variables

### GitHub Actions

**Repository Secrets:**
```yaml
# Access in workflow
env:
  VITE_API_URL: ${{ secrets.API_URL }}
  VITE_APP_KEY: ${{ secrets.APP_KEY }}
```

**Set Secrets:**
- Repository Settings → Secrets → Actions
- Add secrets: `API_URL`, `APP_KEY`, etc.

---

### GitLab CI/CD

**CI/CD Variables:**
```yaml
# Access in pipeline
script:
  - export VITE_API_URL=$CI_API_URL
  - npm run build
```

**Set Variables:**
- Settings → CI/CD → Variables
- Add protected/masked variables

---

## Caching Strategies

### Node Modules

**GitHub Actions:**
```yaml
- uses: actions/setup-node@v4
  with:
    cache: 'npm'  # Auto-caches node_modules
```

**Manual:**
```yaml
- uses: actions/cache@v3
  with:
    path: node_modules
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
```

---

### Obfuscation Cache

**GitHub Actions:**
```yaml
- uses: actions/cache@v3
  with:
    path: .vite-cache
    key: obfuscation-${{ hashFiles('**/*.{ts,tsx}') }}
```

**Benefits:**
- ~23% faster builds
- Cache hit on unchanged files
- Automatic invalidation on code changes

---

## Cache Management

### Cache Size & Monitoring

**Typical Sizes:**
- `node_modules/`: 200-500 MB
- `.vite-cache/`: 5-15 MB

**Monitor cache in CI:**
```yaml
- name: Check cache status
  run: |
    echo "📦 node_modules: $(du -sh node_modules/ 2>/dev/null || echo 'not cached')"
    echo "🔒 .vite-cache: $(du -sh .vite-cache/ 2>/dev/null || echo 'not cached')"
    ls -la .vite-cache/ 2>/dev/null || echo "No obfuscation cache"
```

---

### Cache Retention

| Platform | Default | Action Required |
|----------|---------|-----------------|
| GitHub Actions | 7 days | Auto-cleanup, no action needed |
| GitLab CI | Indefinite | Manual cleanup if needed |
| CircleCI | 15 days | Auto-cleanup, no action needed |

---

### Clearing Cache

**Manual Cache Bust (GitHub Actions):**
```yaml
# Add workflow_dispatch trigger
on:
  workflow_dispatch:
    inputs:
      clear_cache:
        description: 'Clear build cache'
        required: false
        type: boolean

# In build steps
- name: Clear cache if requested
  if: github.event.inputs.clear_cache == 'true'
  run: rm -rf .vite-cache node_modules/.vite
```

**Bump Cache Version:**
```yaml
# Change cache key to force new cache
- uses: actions/cache@v3
  with:
    path: .vite-cache
    key: v2-obfuscation-${{ hashFiles('**/*.{ts,tsx}') }}
    #    ^^ Increment version number
```

**GitLab CI - Clear via UI:**
- CI/CD → Pipelines → Clear Runner Caches

**CircleCI - Clear via CLI:**
```bash
circleci cache clear <cache-key>
```

---

### Troubleshooting Cache

**Cache not working:**
```yaml
# Debug cache hits/misses
- name: Debug cache
  run: |
    if [ -d ".vite-cache" ]; then
      echo "✅ Cache restored"
      echo "Files: $(ls -1 .vite-cache/ | wc -l)"
    else
      echo "❌ Cache miss - will be slower"
    fi
```

**Cache corrupted:**
```bash
# Force rebuild without cache
npm run build:clean

# Or manually remove
rm -rf .vite-cache node_modules/.vite
```

**Different cache per branch:**
```yaml
# Use branch-specific keys
key: ${{ github.ref }}-obfuscation-${{ hashFiles('**/*.{ts,tsx}') }}
restore-keys: |
  ${{ github.ref }}-obfuscation-
  main-obfuscation-  # Fallback to main branch cache
```

---

### Best Practices

✅ **DO:**
- Cache both `node_modules/` and `.vite-cache/`
- Monitor cache hit rates in build logs
- Version cache keys when changing build process
- Use restore-keys for fallback caching

⛔ **DON'T:**
- Cache `dist/` folder (always rebuild fresh)
- Use timestamp-based cache keys
- Commit `.vite-cache/` to git (already in `.gitignore`)
- Share cache across different Node versions

---

## Build Optimization

### Parallel Jobs

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [18, 20]
    steps:
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
      - run: npm test
```

---

### Conditional Steps

```yaml
- name: Deploy to staging
  if: github.ref == 'refs/heads/develop'
  run: npm run deploy:staging

- name: Deploy to production
  if: github.ref == 'refs/heads/main'
  run: npm run deploy:production
```

---

## Notifications

### Slack

```yaml
- name: Notify Slack
  if: always()
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    text: 'Build completed'
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

---

### Email

**GitHub:**
- Automatic on failure
- Configure in repository settings

**GitLab:**
```yaml
deploy:
  script:
    - npm run deploy
  only:
    - main
  when: on_success
  after_script:
    - echo "Deployment successful" | mail -s "Deploy Success" team@example.com
```

---

## Security Scanning

### Dependency Audit

```yaml
- name: Security audit
  run: npm audit --audit-level=high
```

---

### CodeQL Analysis

```yaml
- name: Initialize CodeQL
  uses: github/codeql-action/init@v2
  with:
    languages: javascript

- name: Perform CodeQL Analysis
  uses: github/codeql-action/analyze@v2
```

---

## Performance Monitoring

### Lighthouse CI

```yaml
- name: Lighthouse
  run: |
    npm install -g @lhci/cli
    lhci autorun
```

**lighthouserc.json:**
```json
{
  "ci": {
    "collect": {
      "startServerCommand": "npm run preview",
      "url": ["http://localhost:4173/"]
    },
    "assert": {
      "preset": "lighthouse:recommended"
    }
  }
}
```

---

## Deployment Strategies

### Blue-Green Deployment

```yaml
- name: Deploy to green
  run: deploy_to_green.sh

- name: Health check
  run: curl https://green.example.com/health

- name: Switch traffic
  run: switch_to_green.sh
```

---

### Canary Deployment

```yaml
- name: Deploy canary (10%)
  run: deploy_canary.sh --percentage=10

- name: Monitor metrics
  run: monitor_canary.sh --duration=10m

- name: Full rollout
  if: success()
  run: deploy_canary.sh --percentage=100
```

---

## Rollback Automation

```yaml
- name: Deploy
  id: deploy
  run: npm run deploy
  continue-on-error: true

- name: Rollback on failure
  if: steps.deploy.outcome == 'failure'
  run: npm run rollback
```

---

## Best Practices

### Security

✅ Use secrets for sensitive data  
✅ Scan dependencies regularly  
✅ Audit before deployment  
✅ Use signed commits  
✅ Review permissions  

### Performance

✅ Cache dependencies  
✅ Cache build artifacts  
✅ Use matrix for parallel jobs  
✅ Optimize Docker layers  
✅ Monitor build times  

### Reliability

✅ Test before deploy  
✅ Implement health checks  
✅ Automate rollbacks  
✅ Monitor deployments  
✅ Alert on failures  

---

## Related Documentation

- **[Deployment](./deployment.md)** - Deployment platforms
- **[Performance](./performance.md)** - Build optimization
- **[Troubleshooting](./troubleshooting.md)** - CI/CD issues

---

**Last Updated:** November 2025
