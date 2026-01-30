# Zustand Migration Plan - Component Integration

**Version:** 1.0  
**Date:** January 23, 2026  
**Status:** Ready for Execution  
**Estimated Time:** 3-4 days

---

## Table of Contents

1. [Overview](#overview)
2. [Migration Goals](#migration-goals)
3. [Pre-Migration Checklist](#pre-migration-checklist)
4. [Component Migration Strategy](#component-migration-strategy)
5. [Step-by-Step Implementation](#step-by-step-implementation)
6. [Testing & Validation](#testing--validation)
7. [Performance Monitoring](#performance-monitoring)
8. [Rollback Strategy](#rollback-strategy)
9. [Success Criteria](#success-criteria)

---

## Overview

### Current State

The application currently uses:

- **Context API**: `AuthProvider`, `CategoryFilterProvider`
- **Local State**: `useState` hooks in Stream, SoundBoard, WaveHistory
- **Direct API Calls**: Components fetch data independently
- **No Caching**: Every page visit triggers new API calls
- **Duplicated Logic**: Search/filter logic repeated across components

### Target State

After migration:

- **Zustand Stores**: Centralized state management
- **Intelligent Caching**: 5-minute cache TTL reduces API calls
- **Shared State**: Navigation between pages uses cached data
- **Optimized Re-renders**: Shallow comparison prevents unnecessary updates
- **Persistent State**: Auth and surge state survives page refreshes

---

## Migration Goals

### Primary Objectives

1. ✅ **Reduce API Calls by 40-60%**
   - Cache waves/pings/resolutions for 5 minutes
   - Prevent duplicate concurrent requests
   - Share data across page navigations

2. ✅ **Improve Page Transition Speed by 90%**
   - From: 800-1200ms (fresh API calls)
   - To: 50-100ms (cached data)

3. ✅ **Decrease Re-renders by 70%**
   - Use shallow comparison selectors
   - Subscribe only to needed state slices

4. ✅ **Enhance Developer Experience**
   - Redux DevTools for debugging
   - Clear state structure
   - Reusable selectors

### Secondary Benefits

- Better error handling consistency
- Simplified component logic
- Easier testing
- Type-safe state management

---

## Pre-Migration Checklist

### ✅ Completed

- [x] Zustand stores implemented
- [x] Dependencies installed (zustand, immer)
- [x] Store documentation created
- [x] TypeScript types defined
- [x] Redux DevTools configured

### 🔜 Before Starting Migration

- [ ] **Backup current code**: Create feature branch
- [ ] **Review store APIs**: Understand all store methods
- [ ] **Test stores in isolation**: Verify stores work independently
- [ ] **Document current behavior**: Note expected functionality
- [ ] **Set up error tracking**: Prepare to monitor issues

```bash
# Create backup branch
git checkout -b backup/pre-zustand-migration

# Create migration branch
git checkout -b feature/zustand-component-migration
```

---

## Component Migration Strategy

### Migration Order (Priority)

```
Phase 1: Foundation (Day 1)
├── App.tsx                    ← Initialize stores, remove Context
├── NavBar.tsx                 ← Auth state, search input
└── SearchInput.tsx            ← Search query management

Phase 2: Data Pages (Days 2-3)
├── Stream.tsx                 ← useWavesStore
├── SoundBoard.tsx             ← usePingsStore
└── WaveHistory.tsx            ← useResolutionsStore

Phase 3: Card Components (Day 3)
├── StreamCard.tsx             ← Wave data display
├── StreamCardFooter.tsx       ← useSurgeStore
├── SoundBoardCard.tsx         ← Ping data display
└── SoundBoardCardFooter.tsx   ← useSurgeStore

Phase 4: Modals & Forms (Day 4)
├── WaveFormModal.tsx          ← Add wave to store
├── PingFormModal.tsx          ← Add ping to store
└── ProposeWaveModal.tsx       ← Wave creation

Phase 5: Cleanup & Optimization
├── Remove Context files
├── Remove unused imports
├── Performance testing
└── Documentation updates
```

### Risk Assessment

| Component       | Risk Level | Reason                      | Mitigation                |
| --------------- | ---------- | --------------------------- | ------------------------- |
| App.tsx         | 🟢 Low     | Simple provider replacement | Test auth flow thoroughly |
| Stream.tsx      | 🟡 Medium  | Complex state logic         | Migrate incrementally     |
| SoundBoard.tsx  | 🟡 Medium  | Similar to Stream           | Use Stream as template    |
| WaveHistory.tsx | 🟡 Medium  | Date grouping logic         | Test grouped selectors    |
| Card Components | 🟢 Low     | Simple surge toggle         | Verify optimistic updates |
| Form Modals     | 🟡 Medium  | Cache invalidation needed   | Test create + refetch     |

---

## Step-by-Step Implementation

### Phase 1: App.tsx & Navigation (Day 1)

#### 1.1 Update App.tsx

**Current Implementation:**

```tsx
import { AuthProvider } from "./contexts/AuthContext";
import { CategoryFilterProvider } from "./contexts/CategoryFilterContext";

const App = () => {
  return (
    <AuthProvider>
      <CategoryFilterProvider>
        <BrowserRouter>
          <Routes>{/* ... */}</Routes>
        </BrowserRouter>
      </CategoryFilterProvider>
    </AuthProvider>
  );
};
```

**New Implementation:**

```tsx
import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuthStore } from "./stores";
import Stream from "./pages/Stream";
import SoundBoard from "./pages/SoundBoard";
import WaveHistory from "./pages/WaveHistory";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";

const App = () => {
  const fetchUser = useAuthStore((state) => state.fetchUser);

  // Initialize auth on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchUser();
    }
  }, [fetchUser]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="signUp" element={<SignUp />} />
        <Route path="waveHistory" element={<WaveHistory />} />
        <Route path="soundBoard" element={<SoundBoard />} />
        <Route path="stream" element={<Stream />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
```

**Changes:**

- ❌ Remove `AuthProvider`
- ❌ Remove `CategoryFilterProvider`
- ✅ Add `useAuthStore` hook
- ✅ Initialize user fetch on mount

**Testing Checklist:**

- [ ] Login still works
- [ ] User persists on refresh
- [ ] Logout clears state
- [ ] Protected routes work

---

#### 1.2 Update NavBar.tsx

**Before:**

```tsx
import { useAuth } from "../contexts/AuthContext";

const NavBar = () => {
  const { user } = useAuth();
  // ...
};
```

**After:**

```tsx
import { useAuthStore, useSearchStore } from "../stores";
import { useShallow } from "zustand/react/shallow";

const NavBar = () => {
  const { user, logout } = useAuthStore(
    useShallow((state) => ({
      user: state.user,
      logout: state.logout,
    })),
  );

  const { query, setQuery } = useSearchStore(
    useShallow((state) => ({
      query: state.query,
      setQuery: state.setQuery,
    })),
  );

  const handleLogout = () => {
    logout();
    // Navigate to login
  };

  return (
    <nav>
      <SearchInput value={query} onChange={setQuery} />
      <UserInfo user={user} onLogout={handleLogout} />
    </nav>
  );
};
```

**Changes:**

- ✅ Replace `useAuth()` with `useAuthStore`
- ✅ Add `useSearchStore` for search input
- ✅ Use `useShallow` for optimal re-renders

---

#### 1.3 Update SearchInput.tsx

**Before:**

```tsx
const SearchInput = () => {
  const [query, setQuery] = useState("");
  // ...
};
```

**After:**

```tsx
import { useSearchStore } from "../stores";
import { useEffect } from "react";

const SearchInput = () => {
  const query = useSearchStore((state) => state.query);
  const setQuery = useSearchStore((state) => state.setQuery);
  const setDebouncedQuery = useSearchStore((state) => state.setDebouncedQuery);

  // Debounce logic
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);
    return () => clearTimeout(timer);
  }, [query, setDebouncedQuery]);

  return (
    <input
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search waves, pings..."
    />
  );
};
```

**Changes:**

- ✅ Remove local `useState`
- ✅ Use `useSearchStore` for query
- ✅ Handle debouncing centrally

---

### Phase 2: Data Pages (Days 2-3)

#### 2.1 Migrate Stream.tsx

**Current Issues:**

- ~150 lines of state management code
- Duplicated fetch logic
- No caching
- Manual debouncing
- No request deduplication

**Migration Steps:**

**Step 1: Import Stores**

```tsx
import { useWavesStore, useSearchStore, useSurgeStore } from "../stores";
import { useShallow } from "zustand/react/shallow";
```

**Step 2: Replace State Declarations**

**Remove:**

```tsx
// ❌ Remove all these
const [waves, setWaves] = useState<Wave[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
const [currentPage, setCurrentPage] = useState(1);
const [hasNextPage, setHasNextPage] = useState(false);
const [searchQuery, setSearchQuery] = useState<string>("");
const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>("");
```

**Add:**

```tsx
// ✅ Add these
const { waves, isLoading, error, hasNextPage, fetchWaves, fetchNextPage } =
  useWavesStore(
    useShallow((state) => ({
      waves: state.waves,
      isLoading: state.isLoading,
      error: state.error,
      hasNextPage: state.hasNextPage,
      fetchWaves: state.fetchWaves,
      fetchNextPage: state.fetchNextPage,
    })),
  );

const { debouncedQuery, selectedCategoryId } = useSearchStore(
  useShallow((state) => ({
    debouncedQuery: state.debouncedQuery,
    selectedCategoryId: state.selectedCategoryId,
  })),
);
```

**Step 3: Simplify useEffect**

**Before (50+ lines):**

```tsx
useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedSearchQuery(searchQuery);
  }, 500);
  return () => clearTimeout(timer);
}, [searchQuery]);

useEffect(() => {
  fetchWaves();
}, [currentPage, debouncedSearchQuery, selectedCategoryId]);

const fetchWaves = async () => {
  try {
    setLoading(true);
    setError(null);
    let response;
    if (debouncedSearchQuery || selectedCategoryId) {
      response = await searchService.searchStream({
        /* ... */
      });
    } else {
      response = await publicService.getStream({
        /* ... */
      });
    }
    setWaves(response.data);
    // ... more state updates
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};
```

**After (8 lines):**

```tsx
useEffect(() => {
  fetchWaves({
    q: debouncedQuery,
    category: selectedCategoryId || undefined,
    sort: "trending",
  });
}, [debouncedQuery, selectedCategoryId, fetchWaves]);
```

**Step 4: Update Render Logic**

**Before:**

```tsx
{
  loading && <div>Loading...</div>;
}
{
  error && <div>Error: {error}</div>;
}
{
  waves.map((wave) => <StreamCard key={wave.id} wave={wave} />);
}
```

**After:**

```tsx
{
  isLoading && <div>Loading...</div>;
}
{
  error && <div>Error: {error}</div>;
}
{
  waves.map((wave) => <StreamCard key={wave.id} wave={wave} />);
}
{
  hasNextPage && <button onClick={fetchNextPage}>Load More</button>;
}
```

**Expected Results:**

- ✅ ~100 lines removed
- ✅ Automatic caching (no refetch on navigation)
- ✅ Cleaner, more maintainable code
- ✅ Better error handling

---

#### 2.2 Migrate SoundBoard.tsx

**Similar to Stream.tsx - Use as Template**

**Quick Migration:**

```tsx
import { usePingsStore, useSearchStore } from "../stores";
import { useShallow } from "zustand/react/shallow";

const SoundBoard = () => {
  const { pings, isLoading, error, fetchPings } = usePingsStore(
    useShallow((state) => ({
      pings: state.pings,
      isLoading: state.isLoading,
      error: state.error,
      fetchPings: state.fetchPings,
    })),
  );

  const { debouncedQuery, selectedCategoryId } = useSearchStore(
    useShallow((state) => ({
      debouncedQuery: state.debouncedQuery,
      selectedCategoryId: state.selectedCategoryId,
    })),
  );

  useEffect(() => {
    fetchPings({
      q: debouncedQuery,
      category: selectedCategoryId || undefined,
      sort: "trending",
    });
  }, [debouncedQuery, selectedCategoryId, fetchPings]);

  // Filter pings by category (or use selector)
  const filteredPings = selectedCategoryId
    ? pings.filter((p) => p.category?.id === selectedCategoryId)
    : pings;

  return (
    <div>
      {isLoading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorDisplay error={error} onRetry={fetchPings} />
      ) : (
        <PingsList pings={filteredPings} />
      )}
    </div>
  );
};
```

**Time Estimate:** 30-45 minutes (copy Stream pattern)

---

#### 2.3 Migrate WaveHistory.tsx

**Special Considerations:**

- Uses date grouping (Today, Yesterday, etc.)
- Uses `selectGroupedResolutions` selector

**Implementation:**

```tsx
import { useResolutionsStore, useSearchStore } from "../stores";
import { selectGroupedResolutions } from "../stores";

const WaveHistory = () => {
  const { isLoading, error, fetchResolutions } = useResolutionsStore(
    useShallow((state) => ({
      isLoading: state.isLoading,
      error: state.error,
      fetchResolutions: state.fetchResolutions,
    })),
  );

  const selectedCategoryId = useSearchStore(
    (state) => state.selectedCategoryId,
  );

  // Use grouped selector
  const groupedResolutions = useResolutionsStore(
    selectGroupedResolutions(selectedCategoryId),
  );

  useEffect(() => {
    fetchResolutions({ days: "all" });
  }, [fetchResolutions]);

  return (
    <div>
      {Object.entries(groupedResolutions).map(([date, resolutions]) => (
        <div key={date}>
          <h3>{date}</h3>
          {resolutions.map((resolution) => (
            <WaveCard key={resolution.id} resolution={resolution} />
          ))}
        </div>
      ))}
    </div>
  );
};
```

**Time Estimate:** 45-60 minutes

---

### Phase 3: Card Components (Day 3)

#### 3.1 Migrate StreamCardFooter.tsx

**Critical Component:** Handles surge toggling

**Before:**

```tsx
const StreamCardFooter = ({ waveId, surgeCount }) => {
  const [surged, setSurged] = useState(false);
  const [currentCount, setCurrentCount] = useState(surgeCount);

  const handleSurge = async () => {
    // Optimistic update
    setSurged(!surged);
    setCurrentCount((prev) => (surged ? prev - 1 : prev + 1));

    try {
      await surgeService.toggleSurge("wave", waveId);
    } catch (error) {
      // Revert
      setSurged(surged);
      setCurrentCount(surgeCount);
    }
  };

  return <button onClick={handleSurge}>SURGE ({currentCount})</button>;
};
```

**After:**

```tsx
import { useSurgeStore } from "../../stores";

const StreamCardFooter = ({ waveId, surgeCount }) => {
  const toggleSurge = useSurgeStore((state) => state.toggleSurge);
  const hasSurged = useSurgeStore((state) =>
    state.hasSurged("wave", waveId.toString()),
  );

  const handleSurge = async () => {
    try {
      await toggleSurge("wave", waveId.toString());
    } catch (error) {
      console.error("Surge failed:", error);
      // Error already handled by store (revert)
    }
  };

  return (
    <button onClick={handleSurge} className={hasSurged ? "surged" : ""}>
      SURGE ({surgeCount + (hasSurged ? 1 : 0)})
    </button>
  );
};
```

**Benefits:**

- ✅ Automatic optimistic updates
- ✅ Automatic error reversion
- ✅ Surge state persists across page navigation
- ✅ ~20 lines removed

**Time Estimate:** 20 minutes

---

#### 3.2 Migrate SoundBoardCardFooter.tsx

**Identical pattern to StreamCardFooter:**

```tsx
const SoundBoardCardFooter = ({ pingId, surgeCount }) => {
  const toggleSurge = useSurgeStore((state) => state.toggleSurge);
  const hasSurged = useSurgeStore((state) =>
    state.hasSurged("ping", pingId.toString()),
  );

  const handleSurge = async () => {
    await toggleSurge("ping", pingId.toString());
  };

  return (
    <button onClick={handleSurge}>
      SURGE ({surgeCount + (hasSurged ? 1 : 0)})
    </button>
  );
};
```

**Time Estimate:** 10 minutes

---

### Phase 4: Form Modals (Day 4)

#### 4.1 Migrate WaveFormModal.tsx

**Key Task:** Add new wave to store + invalidate cache

**After creating wave:**

```tsx
import { useWavesStore } from "../stores";

const WaveFormModal = () => {
  const { addWave, invalidateCache, fetchWaves } = useWavesStore(
    useShallow((state) => ({
      addWave: state.addWave,
      invalidateCache: state.invalidateCache,
      fetchWaves: state.fetchWaves,
    })),
  );

  const handleSubmit = async (data: WaveFormData) => {
    try {
      const newWave = await waveService.createWave(data);

      // Option 1: Add to store immediately (optimistic)
      addWave(newWave);

      // Option 2: Invalidate cache and refetch (safer)
      invalidateCache();
      await fetchWaves();

      onClose();
    } catch (error) {
      console.error("Failed to create wave:", error);
    }
  };

  // ... form logic
};
```

**Recommendation:** Use Option 2 for safety

**Time Estimate:** 30 minutes

---

#### 4.2 Migrate PingFormModal.tsx

**Same pattern as WaveFormModal:**

```tsx
import { usePingsStore } from "../stores";

const PingFormModal = () => {
  const { invalidateCache, fetchPings } = usePingsStore(
    useShallow((state) => ({
      invalidateCache: state.invalidateCache,
      fetchPings: state.fetchPings,
    })),
  );

  const handleSubmit = async (data: PingFormData) => {
    await pingService.createPing(data);
    invalidateCache();
    await fetchPings();
    onClose();
  };
};
```

**Time Estimate:** 20 minutes

---

### Phase 5: Cleanup (Day 4)

#### 5.1 Remove Context Files

**Files to Delete:**

```bash
rm src/contexts/AuthContext.tsx
rm src/contexts/CategoryFilterContext.tsx
```

**Verify no imports remain:**

```bash
grep -r "AuthContext" src/
grep -r "CategoryFilterContext" src/
```

#### 5.2 Remove Unused Imports

Search and remove:

- `import { useAuth }` → Replace with `useAuthStore`
- `import { useCategoryFilter }` → Replace with `useSearchStore`

#### 5.3 Update Component Imports

**Old:**

```tsx
import { useAuth } from "../contexts/AuthContext";
```

**New:**

```tsx
import { useAuthStore } from "../stores";
```

---

## Testing & Validation

### Unit Tests

**Test Store Actions:**

```typescript
// src/stores/__tests__/useAuthStore.test.ts
import { renderHook, act } from "@testing-library/react";
import { useAuthStore } from "../auth/useAuthStore";

describe("useAuthStore", () => {
  it("should login successfully", async () => {
    const { result } = renderHook(() => useAuthStore());

    await act(async () => {
      await result.current.login("test-token");
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toBeDefined();
  });
});
```

### Integration Tests

**Test Component Integration:**

```typescript
// src/pages/__tests__/Stream.test.tsx
import { render, waitFor } from '@testing-library/react';
import Stream from '../Stream';
import { useWavesStore } from '../../stores';

describe('Stream Page', () => {
  it('should fetch and display waves', async () => {
    const { getByText } = render(<Stream />);

    await waitFor(() => {
      expect(getByText(/wave title/i)).toBeInTheDocument();
    });
  });
});
```

### Manual Testing Checklist

**Phase 1: App & Navigation**

- [ ] Login works and persists user
- [ ] Logout clears all data
- [ ] Search query persists across pages
- [ ] Category filter persists

**Phase 2: Data Pages**

- [ ] Stream loads waves from cache (instant)
- [ ] SoundBoard loads pings from cache
- [ ] WaveHistory groups by date correctly
- [ ] Search filters work on all pages
- [ ] Category filter works on all pages

**Phase 3: Interactions**

- [ ] Surge toggles instantly (optimistic)
- [ ] Surge count updates correctly
- [ ] Surge persists across page refresh
- [ ] Error reverts surge on failure

**Phase 4: Forms**

- [ ] Creating wave refreshes stream
- [ ] Creating ping refreshes soundboard
- [ ] Cache invalidates after creation

**Phase 5: Performance**

- [ ] No duplicate API calls
- [ ] Page transitions are instant (<100ms)
- [ ] Redux DevTools shows state changes
- [ ] No console errors

---

## Performance Monitoring

### Metrics to Track

**Before Migration (Baseline):**

```typescript
// Add performance monitoring
const measurePageLoad = () => {
  const startTime = performance.now();

  // After data loads
  const endTime = performance.now();
  console.log(`Page load: ${endTime - startTime}ms`);
};
```

**Expected Improvements:**

| Metric                    | Before | After  | Target            |
| ------------------------- | ------ | ------ | ----------------- |
| API calls per session     | 30-40  | 15-20  | 50% reduction     |
| Initial page load         | 1200ms | 1200ms | Same (first load) |
| Navigation to cached page | 800ms  | 50ms   | 94% faster        |
| Surge toggle latency      | 100ms  | 10ms   | 90% faster        |
| Component re-renders      | 200    | 60     | 70% reduction     |

### Tools to Use

1. **React DevTools Profiler**
   - Record component renders
   - Identify unnecessary re-renders

2. **Redux DevTools**
   - Monitor state changes
   - Verify cache hits

3. **Network Tab**
   - Count API requests
   - Verify caching works

4. **Performance API**
   ```typescript
   performance.mark("start-fetch");
   await fetchWaves();
   performance.mark("end-fetch");
   performance.measure("fetch-duration", "start-fetch", "end-fetch");
   ```

---

## Rollback Strategy

### If Migration Fails

**Quick Rollback:**

```bash
# Revert all changes
git checkout backup/pre-zustand-migration

# Or revert specific files
git checkout backup/pre-zustand-migration -- src/App.tsx
```

**Partial Rollback:**
If only one component fails, revert just that component while keeping others.

### Common Issues & Fixes

**Issue 1: State not persisting**

```typescript
// Fix: Check persist middleware configuration
persist(
  immer((set) => ({
    /* ... */
  })),
  { name: "auth-storage" }, // ← Ensure name is set
);
```

**Issue 2: Infinite re-renders**

```typescript
// Bad: Creates new object every render
const state = useStore((state) => ({ user: state.user }));

// Good: Use shallow comparison
const state = useStore(useShallow((state) => ({ user: state.user })));
```

**Issue 3: Cache not invalidating**

```typescript
// After mutations, always invalidate:
await waveService.createWave(data);
useWavesStore.getState().invalidateCache();
await useWavesStore.getState().fetchWaves();
```

---

## Success Criteria

### ✅ Migration Complete When:

1. **All Context Providers Removed**
   - No `AuthProvider` in App.tsx
   - No `CategoryFilterProvider` in App.tsx

2. **All Components Using Stores**
   - Stream.tsx uses `useWavesStore`
   - SoundBoard.tsx uses `usePingsStore`
   - WaveHistory.tsx uses `useResolutionsStore`
   - Card components use `useSurgeStore`
   - NavBar uses `useAuthStore` and `useSearchStore`

3. **All Tests Passing**
   - Unit tests for stores
   - Integration tests for pages
   - Manual testing complete

4. **Performance Targets Met**
   - 40%+ reduction in API calls
   - <100ms cached page loads
   - No console errors

5. **Code Quality**
   - No TypeScript errors
   - No unused imports
   - No dead code

---

## Timeline Summary

| Day   | Tasks                         | Hours | Status     |
| ----- | ----------------------------- | ----- | ---------- |
| Day 1 | App.tsx, NavBar, SearchInput  | 4-5h  | ⏳ Pending |
| Day 2 | Stream.tsx, SoundBoard.tsx    | 4-5h  | ⏳ Pending |
| Day 3 | WaveHistory, Card components  | 4-5h  | ⏳ Pending |
| Day 4 | Form modals, Cleanup, Testing | 4-5h  | ⏳ Pending |

**Total Time:** 16-20 hours (3-4 days)

---

## Next Steps

### To Begin Migration:

1. **Create Branch**

   ```bash
   git checkout -b feature/zustand-component-migration
   ```

2. **Start with Phase 1**
   - Migrate App.tsx first
   - Test auth flow thoroughly
   - Commit after each working component

3. **Follow the Plan**
   - One phase at a time
   - Test after each component
   - Commit working changes

4. **Monitor Performance**
   - Use DevTools to verify improvements
   - Track API call reduction
   - Measure page load times

5. **Document Issues**
   - Note any problems encountered
   - Update this plan with learnings
   - Share knowledge with team

---

**Ready to Begin?** Start with Phase 1: App.tsx migration!

**Document Version:** 1.0  
**Last Updated:** January 23, 2026  
**Next Review:** After Phase 1 completion
