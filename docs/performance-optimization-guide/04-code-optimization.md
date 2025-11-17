# Code Optimization

JavaScript, React, and data fetching performance best practices.

---

## Table of Contents

- [JavaScript Optimization](#javascript-optimization)
- [React Performance](#react-performance)
- [Data Fetching](#data-fetching)

---

## JavaScript Optimization

### 1. Tree Shaking

**Use Named Imports:**

```typescript
// ❌ Bad - imports entire library
import * as Icons from 'react-icons/fa';
import _ from 'lodash';

// ✅ Good - tree-shakeable
import { FaHome } from 'react-icons/fa';
import { debounce } from 'lodash-es';
```

### 2. Lazy Load Heavy Libraries

```typescript
// ❌ Always loaded
import { parseMarkdown } from 'markdown-parser'; // 50 KB

// ✅ Load when needed
async function parseText(text: string) {
  const { parseMarkdown } = await import('markdown-parser');
  return parseMarkdown(text);
}
```

### 3. Use Modern JavaScript

```typescript
// ✅ Optional chaining (smaller than if checks)
const value = obj?.prop?.nested;

// ✅ Nullish coalescing
const result = value ?? 'default';

// ✅ Array methods
const filtered = items.filter(item => item.active);
```

---

## React Performance

### 1. Memoization

#### React.memo

```typescript
import { memo } from 'react';

// ✅ Memo expensive components
const ExpensiveComponent = memo(({ data, onUpdate }) => {
  // Complex rendering logic
  return <div>{/* ... */}</div>;
});
```

**When to Use:**
- Component renders often with same props
- Rendering is expensive (>16ms)
- Component is large or complex

**When NOT to Use:**
- Props change on every render
- Component is simple
- Premature optimization

#### useMemo

```typescript
import { useMemo } from 'react';

function DataTable({ data }) {
  // ✅ Memoize expensive calculations
  const sortedData = useMemo(
    () => data.sort((a, b) => a.value - b.value),
    [data]
  );
  
  return <Table data={sortedData} />;
}
```

**Use Cases:**
- Expensive calculations
- Complex filtering/sorting
- Object/array creation for props

#### useCallback

```typescript
import { useCallback } from 'react';

function Parent() {
  // ✅ Memoize callbacks passed to children
  const handleClick = useCallback((id: string) => {
    // Handler logic
  }, []);
  
  return <Child onClick={handleClick} />;
}
```

**Use Cases:**
- Callbacks passed to memoized children
- Dependencies for other hooks
- Event handlers in lists

---

### 2. Lazy Loading Components

```typescript
import { lazy, Suspense } from 'react';

// ✅ Lazy load heavy components
const Chart = lazy(() => import('./HeavyChart'));
const Modal = lazy(() => import('./Modal'));
const Editor = lazy(() => import('./RichTextEditor'));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      {showChart && <Chart />}
    </Suspense>
  );
}
```

**[→ Complete lazy loading guide](../reusable-implementations/lazy-loading/)**

---

### 3. Virtualize Long Lists

```typescript
import { useVirtualizer } from '@tanstack/react-virtual';

function LongList({ items }) {
  const parentRef = useRef();
  
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50, // Item height
  });
  
  return (
    <div ref={parentRef} style={{ height: '400px', overflow: 'auto' }}>
      {virtualizer.getVirtualItems().map(virtualItem => (
        <div key={virtualItem.index}>
          {items[virtualItem.index]}
        </div>
      ))}
    </div>
  );
}
```

**When to Virtualize:**
- Lists with >100 items
- Infinite scroll
- Table with many rows

---

### 4. Debounce & Throttle

```typescript
import { useCallback, useEffect, useState } from 'react';

// Debounce - wait until user stops typing
function SearchInput() {
  const [value, setValue] = useState('');
  const [debouncedValue, setDebouncedValue] = useState('');
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [value]);
  
  // Use debouncedValue for API call
  useEffect(() => {
    if (debouncedValue) {
      searchAPI(debouncedValue);
    }
  }, [debouncedValue]);
  
  return <input value={value} onChange={e => setValue(e.target.value)} />;
}

// Throttle - limit execution rate
function ScrollTracker() {
  useEffect(() => {
    let lastRun = 0;
    
    const handleScroll = () => {
      const now = Date.now();
      if (now - lastRun >= 100) { // Max once per 100ms
        lastRun = now;
        trackScroll();
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
}
```

---

### 5. Avoid Inline Functions

```typescript
// ❌ Bad - creates new function on every render
<button onClick={() => handleClick(id)}>
  Click
</button>

// ✅ Good - memoized callback
const onClick = useCallback(() => handleClick(id), [id]);
<button onClick={onClick}>
  Click
</button>

// ✅ Good - if function doesn't use props/state
function handleButtonClick() {
  console.log('clicked');
}
<button onClick={handleButtonClick}>
  Click
</button>
```

---

## Data Fetching

### 1. Use TanStack Query (Included)

```typescript
import { useQuery } from '@tanstack/react-query';

function UserProfile({ userId }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    staleTime: 5 * 60 * 1000, // Cache 5 minutes
  });
  
  if (isLoading) return <Loading />;
  if (error) return <Error />;
  
  return <div>{data.name}</div>;
}
```

**Benefits:**
- Automatic caching
- Background refetching
- Request deduplication
- Optimistic updates

---

### 2. Prefetch Data

```typescript
import { useQueryClient } from '@tanstack/react-query';

function Navigation() {
  const queryClient = useQueryClient();
  
  // ✅ Prefetch on hover
  const prefetchUser = (userId: string) => {
    queryClient.prefetchQuery({
      queryKey: ['user', userId],
      queryFn: () => fetchUser(userId),
    });
  };
  
  return (
    <Link
      to={`/user/${userId}`}
      onMouseEnter={() => prefetchUser(userId)}
    >
      View Profile
    </Link>
  );
}
```

---

### 3. Set Appropriate Stale Times

```typescript
// ✅ Slow-changing data (user profile)
useQuery({
  queryKey: ['user'],
  queryFn: fetchUser,
  staleTime: 5 * 60 * 1000, // 5 minutes
});

// ✅ Fast-changing data (live feed)
useQuery({
  queryKey: ['feed'],
  queryFn: fetchFeed,
  staleTime: 30 * 1000, // 30 seconds
});

// ✅ Static data (config)
useQuery({
  queryKey: ['config'],
  queryFn: fetchConfig,
  staleTime: Infinity, // Never refetch
});
```

---

### 4. Pagination & Infinite Scroll

```typescript
import { useInfiniteQuery } from '@tanstack/react-query';

function InfiniteList() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['items'],
    queryFn: ({ pageParam = 0 }) => fetchItems(pageParam),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });
  
  return (
    <div>
      {data?.pages.map((page) =>
        page.items.map((item) => <Item key={item.id} {...item} />)
      )}
      {hasNextPage && (
        <button onClick={() => fetchNextPage()}>
          Load More
        </button>
      )}
    </div>
  );
}
```

---

## Quick Wins

### 1-Minute Optimizations

```typescript
// ✅ Lazy load modals
const Modal = lazy(() => import('./Modal'));

// ✅ Memoize list items
const ListItem = memo(({ item }) => <div>{item.name}</div>);

// ✅ Set staleTime on queries
useQuery({ queryKey: ['data'], queryFn, staleTime: 60000 });

// ✅ Debounce search input
const [debouncedValue] = useDebounce(searchTerm, 500);

// ✅ Use tree-shakeable imports
import { debounce } from 'lodash-es';
```

---

## Performance Checklist

### Code
- [ ] Named imports (tree shaking)
- [ ] Lazy load heavy components
- [ ] Memoize expensive calculations
- [ ] Virtualize long lists (>100 items)

### React
- [ ] React.memo on expensive components
- [ ] useMemo for calculations
- [ ] useCallback for callbacks
- [ ] Avoid inline functions

### Data
- [ ] Use TanStack Query
- [ ] Set appropriate staleTime
- [ ] Prefetch on hover
- [ ] Implement pagination/infinite scroll

---

## Next Steps

- **[Network Optimization](./05-network-optimization.md)** - CDN, compression & caching
- **[Monitoring & Tools](./06-monitoring-and-tools.md)** - Measure performance
- **[Lazy Loading Guide](../reusable-implementations/lazy-loading/)** - Detailed patterns

---

**Quick check:** Are expensive components memoized? Queries cached? Lists virtualized? ✅

