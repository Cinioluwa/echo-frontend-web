# Store Utilities

Utility functions for Zustand store operations.

## Category Counts

### Overview

The category counts system tracks how many items (pings or waves) belong to each category, enabling the UI to display accurate counts in the category selector.

### How It Works

1. **Data Flow**:

   ```
   API Response → usePingsStore/useWavesStore → calculateCategoryCounts() → setCategoryCounts() → useSearchStore → UI (Categories.tsx)
   ```

2. **Calculation**:
   - When pings/waves are fetched, the store calculates counts per category
   - Counts are stored as `{ categoryId: count }` in `useSearchStore`
   - Total count across all categories is also calculated

3. **Updates**:
   - **On Fetch**: Counts update when data is fetched from API
   - **On Add**: Counts increment when new items are added
   - **On Remove**: Counts decrement when items are removed

### Functions

#### `calculatePingCategoryCounts(pings: Ping[])`

Calculates category counts from an array of pings.

**Returns**:

```typescript
{
  counts: Record<number, number>, // { categoryId: count }
  total: number                   // Total pings
}
```

**Example**:

```typescript
const pings = [
  { id: 1, category: { id: 1, name: "General" } },
  { id: 2, category: { id: 1, name: "General" } },
  { id: 3, category: { id: 2, name: "Events" } },
];

const result = calculatePingCategoryCounts(pings);
// { counts: { 1: 2, 2: 1 }, total: 3 }
```

#### `calculateWaveCategoryCounts(waves: Wave[])`

Calculates category counts from an array of waves. Prioritizes `wave.category`, falls back to `wave.ping.category`.

**Returns**:

```typescript
{
  counts: Record<number, number>, // { categoryId: count }
  total: number                   // Total waves
}
```

#### `mergeCategoryCounts(...results: CategoryCountsResult[])`

Merges multiple category count results. Useful for combining pings and waves counts.

**Example**:

```typescript
const pingCounts = { counts: { 1: 5, 2: 3 }, total: 8 };
const waveCounts = { counts: { 1: 2, 3: 4 }, total: 6 };

const merged = mergeCategoryCounts(pingCounts, waveCounts);
// { counts: { 1: 7, 2: 3, 3: 4 }, total: 14 }
```

### Integration Points

#### In Stores

```typescript
// After fetching data
const { counts, total } = calculatePingCategoryCounts(response.data);
useSearchStore.getState().setCategoryCounts(counts, total);
```

#### In UI

```typescript
// Categories.tsx
const categoryCounts = useSearchStore((state) => state.categoryCounts);
const totalCount = useSearchStore((state) => state.totalCount);

// Display counts
<span>{categoryCounts[category.id] || 0}</span>
<span>{totalCount}</span>
```

### Implementation Details

- **Store Location**: `useSearchStore` (UI store)
- **State**:
  - `categoryCounts: Record<number, number>` - Counts per category
  - `totalCount: number` - Total across all categories
- **Action**: `setCategoryCounts(counts, total)` - Updates both values

### Notes

- Counts reflect the **current page** of data loaded
- When filtering or searching, counts update based on visible results
- Category counts are automatically recalculated on:
  - Initial data fetch
  - Search/filter changes
  - Item additions
  - Item removals
- Counts default to `0` if a category has no items
