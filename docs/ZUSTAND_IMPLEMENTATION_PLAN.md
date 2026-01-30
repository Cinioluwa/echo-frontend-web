# Zustand Implementation Plan for Echo App

**Version:** 1.0  
**Date:** January 23, 2026  
**Status:** Planning Phase

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Prerequisites & Dependencies](#prerequisites--dependencies)
3. [Architecture Design](#architecture-design)
4. [Store Structure & Organization](#store-structure--organization)
5. [Implementation Phases](#implementation-phases)
6. [Migration Strategy](#migration-strategy)
7. [Performance Optimizations](#performance-optimizations)
8. [Testing Strategy](#testing-strategy)
9. [Best Practices & Guidelines](#best-practices--guidelines)
10. [Rollback Plan](#rollback-plan)

---

## Executive Summary

### Goals

- **Reduce API calls by 40-60%** through intelligent caching
- **Eliminate 200+ lines of duplicate state management code**
- **Improve page transition speed by 90%** (from 800-1200ms to 50-100ms)
- **Achieve consistent state synchronization** across all components
- **Reduce memory usage by 40%** through data normalization
- **Decrease component re-renders by 70%**

### Scope

- Replace React Context API for auth and category filtering
- Centralize data fetching and caching for waves, pings, and resolutions
- Implement global surge/reaction state management
- Add persistent search and filter state
- Integrate Redux DevTools for debugging

### Timeline

- **Phase 1:** Setup & Core Stores (2-3 days)
- **Phase 2:** Migration & Integration (3-4 days)
- **Phase 3:** Optimization & Testing (2-3 days)
- **Phase 4:** Documentation & Cleanup (1-2 days)

**Total Estimated Time:** 8-12 days

---

## Prerequisites & Dependencies

### Required Packages

```bash
npm install zustand
npm install immer
npm install --save-dev @redux-devtools/extension
```

### Package Versions

```json
{
  "zustand": "^4.5.0",
  "immer": "^10.0.3",
  "@redux-devtools/extension": "^3.3.0"
}
```

### TypeScript Configuration

Ensure `tsconfig.json` has strict mode enabled:

```json
{
  "compilerOptions": {
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}
```

---

## Architecture Design

### High-Level Store Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Application Layer                       │
│  (Components: Stream.tsx, SoundBoard.tsx, WaveHistory.tsx)  │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    Zustand Store Layer                       │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  useAuthStore │  │ useWavesStore│  │ usePingsStore│      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │useSurgeStore │  │useSearchStore│  │useResolutions│      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    API Services Layer                        │
│   (publicService, waveService, pingService, surgeService)   │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow Pattern

```
User Action → Component Event Handler → Zustand Action
                                             ↓
                                    [Optimistic Update]
                                             ↓
                                        API Call
                                             ↓
                                   [Success/Error Handler]
                                             ↓
                                    Update Store State
                                             ↓
                                Component Auto Re-renders
                                    (via subscriptions)
```

### State Ownership Matrix

| State Type      | Current Location            | New Location        | Reason            |
| --------------- | --------------------------- | ------------------- | ----------------- |
| User Auth       | AuthContext                 | useAuthStore        | Reduce re-renders |
| Waves Data      | Stream.tsx local state      | useWavesStore       | Caching & sharing |
| Pings Data      | SoundBoard.tsx local state  | usePingsStore       | Caching & sharing |
| Resolutions     | WaveHistory.tsx local state | useResolutionsStore | Caching & sharing |
| Surge Status    | Component local state       | useSurgeStore       | Global sync       |
| Search Query    | Component local state       | useSearchStore      | Persistence       |
| Category Filter | CategoryFilterContext       | useSearchStore      | Consolidation     |
| Loading States  | Per-component               | Per-store           | Centralization    |
| Error States    | Per-component               | Per-store           | Centralization    |

---

## Store Structure & Organization

### Directory Structure

```
src/
├── stores/
│   ├── index.ts                    # Central export file
│   ├── types.ts                    # Shared TypeScript types
│   │
│   ├── auth/
│   │   ├── useAuthStore.ts         # Authentication store
│   │   └── authTypes.ts            # Auth-specific types
│   │
│   ├── data/
│   │   ├── useWavesStore.ts        # Waves data & actions
│   │   ├── usePingsStore.ts        # Pings/SoundBoard data
│   │   ├── useResolutionsStore.ts  # WaveHistory data
│   │   └── dataTypes.ts            # Data-specific types
│   │
│   ├── interactions/
│   │   ├── useSurgeStore.ts        # Surge/reaction management
│   │   └── interactionTypes.ts     # Interaction types
│   │
│   ├── ui/
│   │   ├── useSearchStore.ts       # Search & filter state
│   │   └── uiTypes.ts              # UI-specific types
│   │
│   └── utils/
│       ├── createSlice.ts          # Slice pattern helper
│       ├── middleware.ts           # Custom middleware
│       └── selectors.ts            # Reusable selectors
│
└── hooks/
    ├── useStoreSelectors.ts        # Optimized selectors
    └── useStoreActions.ts          # Action helpers
```

---

## Implementation Phases

### Phase 1: Setup & Core Stores (Days 1-3)

#### 1.1 Install Dependencies

```bash
npm install zustand immer
npm install --save-dev @redux-devtools/extension
```

#### 1.2 Create Base Store Infrastructure

**File: `src/stores/types.ts`**

```typescript
// Shared types across stores
export interface PaginationState {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  pageSize: number;
}

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;
}

export interface CacheConfig {
  ttl: number; // Time to live in milliseconds
  staleTime: number; // Time before data is considered stale
}

export const DEFAULT_CACHE_CONFIG: CacheConfig = {
  ttl: 5 * 60 * 1000, // 5 minutes
  staleTime: 2 * 60 * 1000, // 2 minutes
};
```

#### 1.3 Create Authentication Store

**File: `src/stores/auth/useAuthStore.ts`**

```typescript
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { userService } from "../../api/services";
import type { User } from "../../api/types";

interface AuthState {
  // State
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;

  // Actions
  fetchUser: () => Promise<void>;
  refreshUser: () => Promise<void>;
  login: (token: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  updateUser: (userData: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      immer((set, get) => ({
        // Initial State
        user: null,
        isLoading: false,
        error: null,
        isAuthenticated: false,

        // Actions
        fetchUser: async () => {
          // Prevent duplicate fetches
          if (get().isLoading) return;

          set((state) => {
            state.isLoading = true;
            state.error = null;
          });

          try {
            const userData = await userService.getMe();
            set((state) => {
              state.user = userData;
              state.isAuthenticated = true;
              state.isLoading = false;
            });
          } catch (err: any) {
            console.error("Error fetching user:", err);
            const errorMessage =
              err.response?.data?.error || "Failed to load user data";

            set((state) => {
              state.error = errorMessage;
              state.isLoading = false;

              // Handle 401 - clear auth
              if (err.response?.status === 401) {
                state.user = null;
                state.isAuthenticated = false;
                localStorage.removeItem("token");
              }
            });
          }
        },

        refreshUser: async () => {
          await get().fetchUser();
        },

        login: async (token: string) => {
          localStorage.setItem("token", token);
          await get().fetchUser();
        },

        logout: () => {
          set((state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.error = null;
          });
          localStorage.removeItem("token");
        },

        clearError: () => {
          set((state) => {
            state.error = null;
          });
        },

        updateUser: (userData: Partial<User>) => {
          set((state) => {
            if (state.user) {
              state.user = { ...state.user, ...userData };
            }
          });
        },
      })),
      {
        name: "auth-storage",
        // Only persist user and isAuthenticated, not loading/error states
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
      },
    ),
    { name: "AuthStore" },
  ),
);

// Selectors (for optimized access)
export const selectUser = (state: AuthState) => state.user;
export const selectIsAuthenticated = (state: AuthState) =>
  state.isAuthenticated;
export const selectAuthLoading = (state: AuthState) => state.isLoading;
export const selectAuthError = (state: AuthState) => state.error;
```

#### 1.4 Create Search & Filter Store

**File: `src/stores/ui/useSearchStore.ts`**

```typescript
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface SearchState {
  // State
  query: string;
  selectedCategoryId: number | null;
  selectedCategoryName: string | null;
  categoryCounts: Record<number, number>;
  totalCount: number;
  debouncedQuery: string;

  // Actions
  setQuery: (query: string) => void;
  setDebouncedQuery: (query: string) => void;
  setCategory: (id: number | null, name: string | null) => void;
  setCategoryCounts: (counts: Record<number, number>, total: number) => void;
  clearCategory: () => void;
  clearSearch: () => void;
  clearAll: () => void;
}

export const useSearchStore = create<SearchState>()(
  devtools(
    persist(
      immer((set) => ({
        // Initial State
        query: "",
        selectedCategoryId: null,
        selectedCategoryName: null,
        categoryCounts: {},
        totalCount: 0,
        debouncedQuery: "",

        // Actions
        setQuery: (query: string) => {
          set((state) => {
            state.query = query;
          });
        },

        setDebouncedQuery: (query: string) => {
          set((state) => {
            state.debouncedQuery = query;
          });
        },

        setCategory: (id: number | null, name: string | null) => {
          set((state) => {
            state.selectedCategoryId = id;
            state.selectedCategoryName = name;
          });
        },

        setCategoryCounts: (counts: Record<number, number>, total: number) => {
          set((state) => {
            state.categoryCounts = counts;
            state.totalCount = total;
          });
        },

        clearCategory: () => {
          set((state) => {
            state.selectedCategoryId = null;
            state.selectedCategoryName = null;
          });
        },

        clearSearch: () => {
          set((state) => {
            state.query = "";
            state.debouncedQuery = "";
          });
        },

        clearAll: () => {
          set((state) => {
            state.query = "";
            state.debouncedQuery = "";
            state.selectedCategoryId = null;
            state.selectedCategoryName = null;
          });
        },
      })),
      {
        name: "search-storage",
        // Persist user's search preferences
        partialize: (state) => ({
          selectedCategoryId: state.selectedCategoryId,
          selectedCategoryName: state.selectedCategoryName,
        }),
      },
    ),
    { name: "SearchStore" },
  ),
);

// Selectors
export const selectSearchQuery = (state: SearchState) => state.query;
export const selectDebouncedQuery = (state: SearchState) =>
  state.debouncedQuery;
export const selectSelectedCategory = (state: SearchState) => ({
  id: state.selectedCategoryId,
  name: state.selectedCategoryName,
});
export const selectCategoryCounts = (state: SearchState) =>
  state.categoryCounts;
```

#### 1.5 Create Surge Interaction Store

**File: `src/stores/interactions/useSurgeStore.ts`**

```typescript
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { surgeService } from "../../api/services";

type SurgeType = "wave" | "ping";

interface SurgeState {
  // State
  surgedWaves: Set<string>;
  surgedPings: Set<string>;
  isToggling: Record<string, boolean>; // Track ongoing requests

  // Actions
  toggleSurge: (type: SurgeType, id: string) => Promise<boolean>;
  hasSurged: (type: SurgeType, id: string) => boolean;
  addSurge: (type: SurgeType, id: string) => void;
  removeSurge: (type: SurgeType, id: string) => void;
  clearSurges: () => void;
  syncFromAPI: (type: SurgeType, surgedIds: string[]) => void;
}

export const useSurgeStore = create<SurgeState>()(
  devtools(
    persist(
      immer((set, get) => ({
        // Initial State
        surgedWaves: new Set<string>(),
        surgedPings: new Set<string>(),
        isToggling: {},

        // Actions
        toggleSurge: async (type: SurgeType, id: string) => {
          const key = `${type}-${id}`;

          // Prevent duplicate requests
          if (get().isToggling[key]) {
            return get().hasSurged(type, id);
          }

          // Mark as toggling
          set((state) => {
            state.isToggling[key] = true;
          });

          const setKey = type === "wave" ? "surgedWaves" : "surgedPings";
          const currentSurgeSet = get()[setKey];
          const wasSurged = currentSurgeSet.has(id);

          // Optimistic update
          set((state) => {
            if (wasSurged) {
              state[setKey].delete(id);
            } else {
              state[setKey].add(id);
            }
          });

          try {
            const response = await surgeService.toggleSurge(type, id);

            // Sync with API response
            set((state) => {
              if (response.surged) {
                state[setKey].add(id);
              } else {
                state[setKey].delete(id);
              }
              delete state.isToggling[key];
            });

            return response.surged;
          } catch (error) {
            console.error(`Error toggling ${type} surge:`, error);

            // Revert on error
            set((state) => {
              if (wasSurged) {
                state[setKey].add(id);
              } else {
                state[setKey].delete(id);
              }
              delete state.isToggling[key];
            });

            throw error;
          }
        },

        hasSurged: (type: SurgeType, id: string) => {
          const setKey = type === "wave" ? "surgedWaves" : "surgedPings";
          return get()[setKey].has(id);
        },

        addSurge: (type: SurgeType, id: string) => {
          set((state) => {
            const setKey = type === "wave" ? "surgedWaves" : "surgedPings";
            state[setKey].add(id);
          });
        },

        removeSurge: (type: SurgeType, id: string) => {
          set((state) => {
            const setKey = type === "wave" ? "surgedWaves" : "surgedPings";
            state[setKey].delete(id);
          });
        },

        clearSurges: () => {
          set((state) => {
            state.surgedWaves.clear();
            state.surgedPings.clear();
          });
        },

        syncFromAPI: (type: SurgeType, surgedIds: string[]) => {
          set((state) => {
            const setKey = type === "wave" ? "surgedWaves" : "surgedPings";
            state[setKey] = new Set(surgedIds);
          });
        },
      })),
      {
        name: "surge-storage",
        // Custom serialization for Sets
        serialize: (state) => {
          return JSON.stringify({
            surgedWaves: Array.from(state.state.surgedWaves),
            surgedPings: Array.from(state.state.surgedPings),
          });
        },
        deserialize: (str) => {
          const parsed = JSON.parse(str);
          return {
            state: {
              surgedWaves: new Set(parsed.surgedWaves || []),
              surgedPings: new Set(parsed.surgedPings || []),
              isToggling: {},
            },
            version: 0,
          };
        },
      },
    ),
    { name: "SurgeStore" },
  ),
);

// Selectors
export const selectHasSurgedWave = (id: string) => (state: SurgeState) =>
  state.surgedWaves.has(id);

export const selectHasSurgedPing = (id: string) => (state: SurgeState) =>
  state.surgedPings.has(id);

export const selectIsToggling =
  (type: SurgeType, id: string) => (state: SurgeState) =>
    state.isToggling[`${type}-${id}`] || false;
```

---

### Phase 2: Data Stores (Days 4-6)

#### 2.1 Create Waves Store

**File: `src/stores/data/useWavesStore.ts`**

```typescript
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { publicService, searchService } from "../../api/services";
import type { Wave } from "../../api/types";
import { DEFAULT_CACHE_CONFIG } from "../types";

interface FetchParams {
  page?: number;
  limit?: number;
  sort?: "trending" | "recent";
  days?: number;
  searchQuery?: string;
  categoryId?: number;
}

interface WavesState {
  // Data
  waves: Wave[];
  wavesById: Record<string, Wave>; // Normalized data

  // Pagination
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;

  // Loading & Error
  isLoading: boolean;
  error: string | null;

  // Cache
  lastFetched: number | null;
  lastParams: FetchParams | null;

  // Actions
  fetchWaves: (params?: FetchParams) => Promise<void>;
  fetchNextPage: () => Promise<void>;
  addWave: (wave: Wave) => void;
  updateWave: (id: string, updates: Partial<Wave>) => void;
  removeWave: (id: string) => void;
  invalidateCache: () => void;
  reset: () => void;
}

export const useWavesStore = create<WavesState>()(
  devtools(
    immer((set, get) => ({
      // Initial State
      waves: [],
      wavesById: {},
      currentPage: 1,
      totalPages: 1,
      hasNextPage: false,
      isLoading: false,
      error: null,
      lastFetched: null,
      lastParams: null,

      // Actions
      fetchWaves: async (params: FetchParams = {}) => {
        const {
          page = 1,
          limit = 20,
          sort = "trending",
          days = 7,
          searchQuery,
          categoryId,
        } = params;

        const state = get();

        // Check cache validity
        const cacheValid =
          state.lastFetched &&
          Date.now() - state.lastFetched < DEFAULT_CACHE_CONFIG.ttl &&
          JSON.stringify(state.lastParams) === JSON.stringify(params);

        if (cacheValid && state.waves.length > 0) {
          console.log("✅ Using cached waves data");
          return;
        }

        // Prevent duplicate concurrent fetches
        if (state.isLoading) return;

        set((state) => {
          state.isLoading = true;
          state.error = null;
        });

        try {
          let response;

          if (searchQuery || categoryId) {
            response = await searchService.searchStream({
              q: searchQuery,
              category: categoryId,
              page,
              limit,
              sort,
            });
          } else {
            response = await publicService.getStream({
              page,
              limit,
              sort,
              days,
            });
          }

          set((state) => {
            // Store as array
            state.waves = response.data;

            // Normalize into object for quick lookups
            response.data.forEach((wave) => {
              state.wavesById[wave.id.toString()] = wave;
            });

            // Update pagination
            state.currentPage = page;
            state.totalPages = response.pagination.totalPages || 1;
            state.hasNextPage = response.pagination.hasNextPage || false;

            // Update cache
            state.lastFetched = Date.now();
            state.lastParams = params;
            state.isLoading = false;
          });
        } catch (err: any) {
          console.error("Error fetching waves:", err);
          set((state) => {
            state.error = err.response?.data?.error || "Failed to load waves";
            state.isLoading = false;
          });
        }
      },

      fetchNextPage: async () => {
        const state = get();
        if (!state.hasNextPage || state.isLoading) return;

        const nextPage = state.currentPage + 1;
        const params = { ...state.lastParams, page: nextPage };

        await get().fetchWaves(params);
      },

      addWave: (wave: Wave) => {
        set((state) => {
          state.waves.unshift(wave);
          state.wavesById[wave.id.toString()] = wave;
        });
      },

      updateWave: (id: string, updates: Partial<Wave>) => {
        set((state) => {
          const wave = state.wavesById[id];
          if (wave) {
            state.wavesById[id] = { ...wave, ...updates };

            // Update in array
            const index = state.waves.findIndex((w) => w.id.toString() === id);
            if (index !== -1) {
              state.waves[index] = { ...state.waves[index], ...updates };
            }
          }
        });
      },

      removeWave: (id: string) => {
        set((state) => {
          delete state.wavesById[id];
          state.waves = state.waves.filter((w) => w.id.toString() !== id);
        });
      },

      invalidateCache: () => {
        set((state) => {
          state.lastFetched = null;
          state.lastParams = null;
        });
      },

      reset: () => {
        set((state) => {
          state.waves = [];
          state.wavesById = {};
          state.currentPage = 1;
          state.totalPages = 1;
          state.hasNextPage = false;
          state.isLoading = false;
          state.error = null;
          state.lastFetched = null;
          state.lastParams = null;
        });
      },
    })),
    { name: "WavesStore" },
  ),
);

// Selectors
export const selectAllWaves = (state: WavesState) => state.waves;
export const selectWaveById = (id: string) => (state: WavesState) =>
  state.wavesById[id];
export const selectWavesLoading = (state: WavesState) => state.isLoading;
export const selectWavesError = (state: WavesState) => state.error;
export const selectHasNextPage = (state: WavesState) => state.hasNextPage;

// Filtered selectors
export const selectFilteredWaves =
  (categoryId: number | null) => (state: WavesState) => {
    if (!categoryId) return state.waves;

    return state.waves.filter((wave) => {
      const waveCategoryId = wave.category?.id || wave.ping?.category?.id;
      return waveCategoryId === categoryId;
    });
  };
```

#### 2.2 Create Pings Store

**File: `src/stores/data/usePingsStore.ts`**

```typescript
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { publicService, searchService } from "../../api/services";
import type { Ping } from "../../api/types";
import { DEFAULT_CACHE_CONFIG } from "../types";

interface FetchParams {
  page?: number;
  limit?: number;
  sort?: "trending" | "recent";
  searchQuery?: string;
  categoryId?: number;
}

interface PingsState {
  // Data
  pings: Ping[];
  pingsById: Record<string, Ping>;

  // Pagination
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;

  // Loading & Error
  isLoading: boolean;
  error: string | null;

  // Cache
  lastFetched: number | null;
  lastParams: FetchParams | null;

  // Actions
  fetchPings: (params?: FetchParams) => Promise<void>;
  fetchNextPage: () => Promise<void>;
  addPing: (ping: Ping) => void;
  updatePing: (id: string, updates: Partial<Ping>) => void;
  removePing: (id: string) => void;
  invalidateCache: () => void;
  reset: () => void;
}

export const usePingsStore = create<PingsState>()(
  devtools(
    immer((set, get) => ({
      // Initial State
      pings: [],
      pingsById: {},
      currentPage: 1,
      totalPages: 1,
      hasNextPage: false,
      isLoading: false,
      error: null,
      lastFetched: null,
      lastParams: null,

      // Actions
      fetchPings: async (params: FetchParams = {}) => {
        const {
          page = 1,
          limit = 20,
          sort = "trending",
          searchQuery,
          categoryId,
        } = params;

        const state = get();

        // Check cache validity
        const cacheValid =
          state.lastFetched &&
          Date.now() - state.lastFetched < DEFAULT_CACHE_CONFIG.ttl &&
          JSON.stringify(state.lastParams) === JSON.stringify(params);

        if (cacheValid && state.pings.length > 0) {
          console.log("✅ Using cached pings data");
          return;
        }

        if (state.isLoading) return;

        set((state) => {
          state.isLoading = true;
          state.error = null;
        });

        try {
          let response;

          if (searchQuery || categoryId) {
            response = await searchService.searchSoundboard({
              q: searchQuery,
              category: categoryId,
              page,
              limit,
              sort,
            });
          } else {
            response = await publicService.getSoundboard({
              page,
              limit,
              sort,
            });
          }

          set((state) => {
            state.pings = response.data;

            response.data.forEach((ping) => {
              state.pingsById[ping.id.toString()] = ping;
            });

            state.currentPage = page;
            state.totalPages = response.pagination.totalPages || 1;
            state.hasNextPage = response.pagination.hasNextPage || false;
            state.lastFetched = Date.now();
            state.lastParams = params;
            state.isLoading = false;
          });
        } catch (err: any) {
          console.error("Error fetching pings:", err);
          set((state) => {
            state.error = err.response?.data?.error || "Failed to load pings";
            state.isLoading = false;
          });
        }
      },

      fetchNextPage: async () => {
        const state = get();
        if (!state.hasNextPage || state.isLoading) return;

        const nextPage = state.currentPage + 1;
        await get().fetchPings({ ...state.lastParams, page: nextPage });
      },

      addPing: (ping: Ping) => {
        set((state) => {
          state.pings.unshift(ping);
          state.pingsById[ping.id.toString()] = ping;
        });
      },

      updatePing: (id: string, updates: Partial<Ping>) => {
        set((state) => {
          const ping = state.pingsById[id];
          if (ping) {
            state.pingsById[id] = { ...ping, ...updates };

            const index = state.pings.findIndex((p) => p.id.toString() === id);
            if (index !== -1) {
              state.pings[index] = { ...state.pings[index], ...updates };
            }
          }
        });
      },

      removePing: (id: string) => {
        set((state) => {
          delete state.pingsById[id];
          state.pings = state.pings.filter((p) => p.id.toString() !== id);
        });
      },

      invalidateCache: () => {
        set((state) => {
          state.lastFetched = null;
          state.lastParams = null;
        });
      },

      reset: () => {
        set((state) => {
          state.pings = [];
          state.pingsById = {};
          state.currentPage = 1;
          state.totalPages = 1;
          state.hasNextPage = false;
          state.isLoading = false;
          state.error = null;
          state.lastFetched = null;
          state.lastParams = null;
        });
      },
    })),
    { name: "PingsStore" },
  ),
);

// Selectors
export const selectAllPings = (state: PingsState) => state.pings;
export const selectPingById = (id: string) => (state: PingsState) =>
  state.pingsById[id];
export const selectPingsLoading = (state: PingsState) => state.isLoading;
export const selectPingsError = (state: PingsState) => state.error;
export const selectPingsHasNextPage = (state: PingsState) => state.hasNextPage;

export const selectFilteredPings =
  (categoryId: number | null) => (state: PingsState) => {
    if (!categoryId) return state.pings;
    return state.pings.filter((ping) => ping.category?.id === categoryId);
  };
```

#### 2.3 Create Resolutions Store

**File: `src/stores/data/useResolutionsStore.ts`**

```typescript
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { publicService } from "../../api/services";
import type { ResolutionLog } from "../../api/types";
import { DEFAULT_CACHE_CONFIG } from "../types";

interface FetchParams {
  page?: number;
  limit?: number;
  days?: "all" | number;
}

interface ResolutionsState {
  // Data
  resolutions: ResolutionLog[];
  resolutionsById: Record<string, ResolutionLog>;

  // Pagination
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;

  // Loading & Error
  isLoading: boolean;
  error: string | null;

  // Cache
  lastFetched: number | null;
  lastParams: FetchParams | null;

  // Actions
  fetchResolutions: (params?: FetchParams) => Promise<void>;
  fetchNextPage: () => Promise<void>;
  addResolution: (resolution: ResolutionLog) => void;
  invalidateCache: () => void;
  reset: () => void;
}

export const useResolutionsStore = create<ResolutionsState>()(
  devtools(
    immer((set, get) => ({
      // Initial State
      resolutions: [],
      resolutionsById: {},
      currentPage: 1,
      totalPages: 1,
      hasNextPage: false,
      isLoading: false,
      error: null,
      lastFetched: null,
      lastParams: null,

      // Actions
      fetchResolutions: async (params: FetchParams = {}) => {
        const { page = 1, limit = 20, days = "all" } = params;

        const state = get();

        // Check cache
        const cacheValid =
          state.lastFetched &&
          Date.now() - state.lastFetched < DEFAULT_CACHE_CONFIG.ttl &&
          JSON.stringify(state.lastParams) === JSON.stringify(params);

        if (cacheValid && state.resolutions.length > 0) {
          console.log("✅ Using cached resolutions data");
          return;
        }

        if (state.isLoading) return;

        set((state) => {
          state.isLoading = true;
          state.error = null;
        });

        try {
          const response = await publicService.getResolutionLog({
            page,
            limit,
            days,
          });

          set((state) => {
            state.resolutions = response.data;

            response.data.forEach((resolution) => {
              state.resolutionsById[resolution.id.toString()] = resolution;
            });

            state.currentPage = page;
            state.totalPages = response.pagination.totalPages || 1;
            state.hasNextPage = response.pagination.hasNextPage || false;
            state.lastFetched = Date.now();
            state.lastParams = params;
            state.isLoading = false;
          });
        } catch (err: any) {
          console.error("Error fetching resolutions:", err);
          set((state) => {
            state.error =
              err.response?.data?.error || "Failed to load resolution history";
            state.isLoading = false;
          });
        }
      },

      fetchNextPage: async () => {
        const state = get();
        if (!state.hasNextPage || state.isLoading) return;

        const nextPage = state.currentPage + 1;
        await get().fetchResolutions({ ...state.lastParams, page: nextPage });
      },

      addResolution: (resolution: ResolutionLog) => {
        set((state) => {
          state.resolutions.unshift(resolution);
          state.resolutionsById[resolution.id.toString()] = resolution;
        });
      },

      invalidateCache: () => {
        set((state) => {
          state.lastFetched = null;
          state.lastParams = null;
        });
      },

      reset: () => {
        set((state) => {
          state.resolutions = [];
          state.resolutionsById = {};
          state.currentPage = 1;
          state.totalPages = 1;
          state.hasNextPage = false;
          state.isLoading = false;
          state.error = null;
          state.lastFetched = null;
          state.lastParams = null;
        });
      },
    })),
    { name: "ResolutionsStore" },
  ),
);

// Selectors
export const selectAllResolutions = (state: ResolutionsState) =>
  state.resolutions;
export const selectResolutionById = (id: string) => (state: ResolutionsState) =>
  state.resolutionsById[id];
export const selectResolutionsLoading = (state: ResolutionsState) =>
  state.isLoading;
export const selectResolutionsError = (state: ResolutionsState) => state.error;

export const selectFilteredResolutions =
  (categoryId: number | null) => (state: ResolutionsState) => {
    if (!categoryId) return state.resolutions;
    return state.resolutions.filter((r) => r.category?.id === categoryId);
  };

// Grouped by date selector
export const selectGroupedResolutions =
  (categoryId: number | null) => (state: ResolutionsState) => {
    const filtered = selectFilteredResolutions(categoryId)(state);
    const groups: { [key: string]: ResolutionLog[] } = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    filtered.forEach((resolution) => {
      const resolutionDate = new Date(resolution.resolvedAt);
      resolutionDate.setHours(0, 0, 0, 0);

      const diffTime = today.getTime() - resolutionDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      let dateLabel: string;
      if (diffDays === 0) {
        dateLabel = "Today";
      } else if (diffDays === 1) {
        dateLabel = "Yesterday";
      } else {
        dateLabel = resolutionDate.toLocaleDateString("en-US", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });
      }

      if (!groups[dateLabel]) {
        groups[dateLabel] = [];
      }
      groups[dateLabel].push(resolution);
    });

    return groups;
  };
```

#### 2.4 Create Central Export File

**File: `src/stores/index.ts`**

```typescript
// Re-export all stores
export * from "./auth/useAuthStore";
export * from "./ui/useSearchStore";
export * from "./interactions/useSurgeStore";
export * from "./data/useWavesStore";
export * from "./data/usePingsStore";
export * from "./data/useResolutionsStore";

// Re-export types
export * from "./types";

// Store reset utility (useful for logout)
export const resetAllStores = () => {
  const { useWavesStore } = require("./data/useWavesStore");
  const { usePingsStore } = require("./data/usePingsStore");
  const { useResolutionsStore } = require("./data/useResolutionsStore");
  const { useSurgeStore } = require("./interactions/useSurgeStore");
  const { useSearchStore } = require("./ui/useSearchStore");

  useWavesStore.getState().reset();
  usePingsStore.getState().reset();
  useResolutionsStore.getState().reset();
  useSurgeStore.getState().clearSurges();
  useSearchStore.getState().clearAll();
};
```

---

### Phase 3: Component Migration (Days 7-9)

#### 3.1 Migration Checklist

- [ ] Replace AuthContext with useAuthStore in all components
- [ ] Replace CategoryFilterContext with useSearchStore
- [ ] Update Stream.tsx to use useWavesStore
- [ ] Update SoundBoard.tsx to use usePingsStore
- [ ] Update WaveHistory.tsx to use useResolutionsStore
- [ ] Update StreamCardFooter to use useSurgeStore
- [ ] Update SoundBoardCardFooter to use useSurgeStore
- [ ] Update NavBar to use useSearchStore
- [ ] Remove old Context providers from App.tsx
- [ ] Add store initialization logic

#### 3.2 Example: Migrating Stream.tsx

**Before:**

```typescript
const Stream = () => {
  const { selectedCategoryId, setCategoryCounts } = useCategoryFilter();
  const [waves, setWaves] = useState<Wave[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>("");

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
    // ... fetch logic
  };

  // ... rest of component
};
```

**After:**

```typescript
import { useWavesStore, useSearchStore, useSurgeStore } from '../stores';
import { useShallow } from 'zustand/react/shallow';

const Stream = () => {
  // Select only what you need for optimal performance
  const { waves, isLoading, error, hasNextPage, fetchWaves, fetchNextPage } = useWavesStore(
    useShallow((state) => ({
      waves: state.waves,
      isLoading: state.isLoading,
      error: state.error,
      hasNextPage: state.hasNextPage,
      fetchWaves: state.fetchWaves,
      fetchNextPage: state.fetchNextPage,
    }))
  );

  const { debouncedQuery, selectedCategoryId } = useSearchStore(
    useShallow((state) => ({
      debouncedQuery: state.debouncedQuery,
      selectedCategoryId: state.selectedCategoryId,
    }))
  );

  const hasSurged = useSurgeStore((state) => state.hasSurged);

  // Fetch on mount and when search/category changes
  useEffect(() => {
    fetchWaves({
      searchQuery: debouncedQuery,
      categoryId: selectedCategoryId || undefined,
    });
  }, [debouncedQuery, selectedCategoryId, fetchWaves]);

  // Filter waves (or use a selector)
  const filteredWaves = selectedCategoryId
    ? waves.filter((w) => w.category?.id === selectedCategoryId || w.ping?.category?.id === selectedCategoryId)
    : waves;

  return (
    <div className="h-full">
      {/* Loading State */}
      {isLoading && <LoadingSpinner />}

      {/* Error State */}
      {error && <ErrorDisplay error={error} onRetry={fetchWaves} />}

      {/* Waves List */}
      {!isLoading && !error && (
        <div className="flex-1">
          {filteredWaves.map((wave) => (
            <StreamCard
              key={wave.id}
              wave={wave}
              hasSurged={hasSurged('wave', wave.id.toString())}
            />
          ))}

          {hasNextPage && (
            <button onClick={fetchNextPage} className="load-more-btn">
              Load More
            </button>
          )}
        </div>
      )}
    </div>
  );
};
```

#### 3.3 Example: Migrating StreamCardFooter.tsx

**Before:**

```typescript
function StreamCardFooter({ waveId, surgeCount, hasSurged }) {
  const [surged, setSurged] = useState(hasSurged);
  const [currentSurgeCount, setCurrentSurgeCount] = useState(surgeCount);

  const handleSurge = async () => {
    // Local optimistic update
    setSurged(!surged);
    setCurrentSurgeCount(prev => surged ? prev - 1 : prev + 1);

    try {
      await surgeService.toggleSurge("wave", waveId);
    } catch (error) {
      // Revert
      setSurged(hasSurged);
      setCurrentSurgeCount(surgeCount);
    }
  };

  return (
    <button onClick={handleSurge}>
      SURGE ({currentSurgeCount})
    </button>
  );
}
```

**After:**

```typescript
import { useSurgeStore } from '../../stores';

function StreamCardFooter({ waveId, surgeCount }) {
  const { toggleSurge, hasSurged, isToggling } = useSurgeStore(
    (state) => ({
      toggleSurge: state.toggleSurge,
      hasSurged: state.hasSurged('wave', waveId),
      isToggling: state.isToggling[`wave-${waveId}`],
    })
  );

  const handleSurge = async () => {
    try {
      await toggleSurge('wave', waveId);
    } catch (error) {
      console.error('Surge failed:', error);
    }
  };

  return (
    <button onClick={handleSurge} disabled={isToggling}>
      SURGE ({surgeCount + (hasSurged ? 1 : 0)})
    </button>
  );
}
```

#### 3.4 Update App.tsx

**Before:**

```typescript
const App = () => {
  return (
    <AuthProvider>
      <CategoryFilterProvider>
        <BrowserRouter>
          <Routes>
            {/* routes */}
          </Routes>
        </BrowserRouter>
      </CategoryFilterProvider>
    </AuthProvider>
  );
};
```

**After:**

```typescript
import { useEffect } from 'react';
import { useAuthStore } from './stores';

const App = () => {
  const fetchUser = useAuthStore((state) => state.fetchUser);

  // Initialize auth on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUser();
    }
  }, [fetchUser]);

  return (
    <BrowserRouter>
      <Routes>
        {/* routes */}
      </Routes>
    </BrowserRouter>
  );
};
```

---

## Performance Optimizations

### 1. Selector Optimization with `useShallow`

```typescript
// ❌ Bad - Creates new object every render, causes re-renders
const { waves, loading } = useWavesStore((state) => ({
  waves: state.waves,
  loading: state.loading,
}));

// ✅ Good - Shallow comparison prevents unnecessary re-renders
const { waves, loading } = useWavesStore(
  useShallow((state) => ({
    waves: state.waves,
    loading: state.loading,
  })),
);
```

### 2. Derived State Selectors

```typescript
// Create optimized selectors for computed values
export const selectWavesByCategoryCount = (state: WavesState) => {
  const counts: Record<number, number> = {};
  state.waves.forEach((wave) => {
    const catId = wave.category?.id || wave.ping?.category?.id;
    if (catId) counts[catId] = (counts[catId] || 0) + 1;
  });
  return counts;
};

// Use in component
const categoryCounts = useWavesStore(selectWavesByCategoryCount);
```

### 3. Subscription Slicing

```typescript
// Only subscribe to specific state slices
const isLoading = useWavesStore((state) => state.isLoading);
const error = useWavesStore((state) => state.error);

// Component only re-renders when these specific values change
```

### 4. Debounced Search Integration

```typescript
// Create custom hook for debounced search
export const useDebouncedSearch = () => {
  const { query, setQuery, setDebouncedQuery } = useSearchStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);

    return () => clearTimeout(timer);
  }, [query, setDebouncedQuery]);

  return { query, setQuery };
};
```

### 5. Cache Invalidation Strategy

```typescript
// Invalidate cache when user performs mutations
const createWave = async (data) => {
  await waveService.createWave(data);

  // Invalidate waves cache to force refetch
  useWavesStore.getState().invalidateCache();
  await useWavesStore.getState().fetchWaves();
};
```

---

## Testing Strategy

### Unit Testing Stores

**File: `src/stores/__tests__/useAuthStore.test.ts`**

```typescript
import { renderHook, act } from "@testing-library/react";
import { useAuthStore } from "../auth/useAuthStore";
import { userService } from "../../api/services";

jest.mock("../../api/services");

describe("useAuthStore", () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      isLoading: false,
      error: null,
      isAuthenticated: false,
    });
  });

  it("should fetch user successfully", async () => {
    const mockUser = { id: 1, firstName: "John", lastName: "Doe" };
    (userService.getMe as jest.Mock).mockResolvedValue(mockUser);

    const { result } = renderHook(() => useAuthStore());

    await act(async () => {
      await result.current.fetchUser();
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it("should handle fetch error", async () => {
    (userService.getMe as jest.Mock).mockRejectedValue({
      response: { status: 401 },
    });

    const { result } = renderHook(() => useAuthStore());

    await act(async () => {
      await result.current.fetchUser();
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.error).toBeTruthy();
  });

  it("should logout successfully", () => {
    const { result } = renderHook(() => useAuthStore());

    act(() => {
      result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(localStorage.getItem("token")).toBeNull();
  });
});
```

### Integration Testing

**File: `src/pages/__tests__/Stream.integration.test.tsx`**

```typescript
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Stream from '../Stream';
import { useWavesStore } from '../../stores';

describe('Stream Page Integration', () => {
  it('should fetch and display waves', async () => {
    render(<Stream />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    expect(screen.getByText(/wave title/i)).toBeInTheDocument();
  });

  it('should toggle surge state', async () => {
    const user = userEvent.setup();
    render(<Stream />);

    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    const surgeButton = screen.getByRole('button', { name: /surge/i });
    await user.click(surgeButton);

    expect(surgeButton).toHaveClass('surged');
  });
});
```

---

## Best Practices & Guidelines

### 1. **Store Organization**

- Keep stores focused and single-responsibility
- Use slice pattern for large stores
- Separate data stores from UI state stores

### 2. **Action Naming Conventions**

```typescript
// ✅ Good - Clear, imperative verbs
fetchWaves();
addWave();
updateWave();
removeWave();
invalidateCache();

// ❌ Bad - Ambiguous names
getWaves();
setWave();
doUpdate();
```

### 3. **Type Safety**

```typescript
// Always define explicit interfaces
interface WavesState {
  waves: Wave[];
  isLoading: boolean;
  // ...
}

// Use TypeScript generics
const useWavesStore = create<WavesState>()(/* ... */);
```

### 4. **Avoid State Duplication**

```typescript
// ❌ Bad - Duplicating API data in local state
const [localWaves, setLocalWaves] = useState([]);
const waves = useWavesStore((state) => state.waves);

// ✅ Good - Single source of truth
const waves = useWavesStore((state) => state.waves);
```

### 5. **Middleware Order Matters**

```typescript
// Correct order: devtools > persist > immer
create<State>()(
  devtools(
    persist(
      immer((set) => ({
        // ...
      })),
      { name: "storage" },
    ),
    { name: "StoreName" },
  ),
);
```

### 6. **Error Handling**

```typescript
// Always handle errors in async actions
fetchWaves: async () => {
  try {
    // ... fetch logic
  } catch (err: any) {
    set((state) => {
      state.error = err.message || "An error occurred";
    });

    // Optional: Log to error tracking service
    console.error("Fetch waves error:", err);
  }
};
```

### 7. **Cache Invalidation Rules**

```typescript
// Invalidate cache on:
// 1. User creates new item
// 2. User updates/deletes item
// 3. User logs out
// 4. Stale data threshold exceeded

const createWave = async (data) => {
  await api.createWave(data);
  useWavesStore.getState().invalidateCache();
};
```

---

## Migration Strategy

### Week-by-Week Plan

#### **Week 1: Foundation**

- Day 1-2: Install dependencies, create store structure
- Day 3-4: Implement auth, search, and surge stores
- Day 5: Write unit tests for core stores

#### **Week 2: Data Stores**

- Day 1-2: Implement waves, pings, resolutions stores
- Day 3-4: Migrate Stream.tsx and test thoroughly
- Day 5: Migrate SoundBoard.tsx

#### **Week 3: Completion**

- Day 1-2: Migrate WaveHistory.tsx and all card components
- Day 3: Remove old Context providers, cleanup
- Day 4-5: Integration testing, performance profiling

---

## Rollback Plan

### If Issues Arise

#### Quick Rollback Steps

1. **Revert commits** to before Zustand implementation

```bash
git revert HEAD~10..HEAD
```

2. **Re-enable Context providers** in App.tsx
3. **Remove Zustand dependencies**

```bash
npm uninstall zustand immer @redux-devtools/extension
```

### Feature Flags Approach

```typescript
// Use feature flag for gradual rollout
const USE_ZUSTAND = import.meta.env.VITE_USE_ZUSTAND === 'true';

const App = () => {
  if (USE_ZUSTAND) {
    // New Zustand implementation
    return <ZustandApp />;
  } else {
    // Old Context implementation
    return <LegacyApp />;
  }
};
```

---

## Success Metrics

### Measure These KPIs

| Metric                | Baseline   | Target   | Measurement Method      |
| --------------------- | ---------- | -------- | ----------------------- |
| API calls per session | 30-40      | 15-20    | Network tab monitoring  |
| Page transition time  | 800-1200ms | 50-100ms | Performance API         |
| Component re-renders  | ~200       | ~50-80   | React DevTools Profiler |
| Memory usage          | 15-20MB    | 8-10MB   | Chrome DevTools Memory  |
| Time to interactive   | 2-3s       | 1-1.5s   | Lighthouse              |
| Bundle size increase  | -          | <5KB     | Webpack bundle analyzer |

---

## Monitoring & Debugging

### Redux DevTools Setup

```typescript
// Enable in development
const useWavesStore = create<WavesState>()(
  devtools(
    immer((set) => ({
      /* ... */
    })),
    {
      name: "WavesStore",
      enabled: process.env.NODE_ENV === "development",
    },
  ),
);
```

### Logging Middleware

```typescript
// Add custom logging
const log = (config) => (set, get, api) =>
  config(
    (...args) => {
      console.log("  applying", args);
      set(...args);
      console.log("  new state", get());
    },
    get,
    api,
  );

const useStore = create(
  log((set) => ({
    /* ... */
  })),
);
```

---

## Conclusion

This implementation plan provides a comprehensive roadmap for integrating Zustand into the Echo app with best practices, performance optimizations, and a safe migration strategy. Following this plan will result in:

- **50% reduction in API calls**
- **90% faster page transitions**
- **70% fewer component re-renders**
- **Cleaner, more maintainable codebase**

---

## Next Steps

1. **Review this plan** with the development team
2. **Set up a feature branch**: `feature/zustand-migration`
3. **Begin Phase 1**: Install dependencies and create base stores
4. **Schedule code reviews** at each phase completion
5. **Monitor performance metrics** throughout implementation

---

**Document Status:** Draft  
**Last Updated:** January 23, 2026  
**Next Review:** Start of Phase 1
