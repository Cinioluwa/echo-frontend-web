# Category Counts Implementation - Visual Flow

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         API LAYER                                │
│  publicService.getSoundboard() / searchService.searchSoundboard()│
│  publicService.getStream() / searchService.searchStream()        │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ Response Data
                             ▼
┌────────────────────────────────────────────────────────────────┐
│                      DATA STORES                               │
│  ┌──────────────────┐         ┌──────────────────┐             │
│  │  usePingsStore   │         │  useWavesStore   │             │
│  │                  │         │                  │             │
│  │ • fetchPings()   │         │ • fetchWaves()   │             │
│  │ • addPing()      │         │ • addWave()      │             │
│  │ • removePing()   │         │ • removeWave()   │             │
│  └────────┬─────────┘         └────────┬─────────┘             │
└───────────┼──────────────────────────┼─────────────────────────┘
            │                          │
            │ Calls utility            │ Calls utility
            ▼                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                     UTILITY LAYER                               │
│  src/stores/utils/categoryCounts.ts                             │
│                                                                 │
│  calculatePingCategoryCounts(pings[])                           │
│     ↓                                                           │
│  { counts: { 1: 5, 2: 3 }, total: 8 }                           │
│                                                                 │
│  calculateWaveCategoryCounts(waves[])                           │
│     ↓                                                           │
│  { counts: { 1: 2, 3: 4 }, total: 6 }                           │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ Result
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                      UI STORE                                   │
│  useSearchStore.setCategoryCounts(counts, total)                │
│                                                                 │
│  State:                                                         │
│  • categoryCounts: { 1: 5, 2: 3, 3: 4 }                         │
│  • totalCount: 8                                                │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ Subscribed
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    UI COMPONENTS                                │
│  Categories.tsx                                                 │
│                                                                 │
│  const categoryCounts = useSearchStore(s => s.categoryCounts)   │
│  const totalCount = useSearchStore(s => s.totalCount)           │
│                                                                 │
│  ┌────────────────────────────────────────────┐                 │
│  │ All Categories                        [8]  │  ← totalCount   │
│  ├────────────────────────────────────────────┤                 │
│  │ 📚 General                           [5]  │  ← counts[1]    │
│  │ 🎉 Events                            [3]  │  ← counts[2]    │
│  │ 💡 Ideas                             [4]  │  ← counts[3]    │
│  └────────────────────────────────────────────┘                 │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow Sequence

```
1. User navigates to SoundBoard or Stream page
   ↓
2. useEffect triggers fetchPings() or fetchWaves()
   ↓
3. Store makes API call
   ↓
4. Response received: [ping1, ping2, ping3, ...]
   ↓
5. Store updates internal state (pings/waves array)
   ↓
6. Store calls calculatePingCategoryCounts(response.data)
   ↓
7. Utility function loops through data:
   • Counts items per category.id
   • Calculates total
   ↓
8. Result: { counts: { 1: 5, 2: 3 }, total: 8 }
   ↓
9. Store calls useSearchStore.getState().setCategoryCounts(counts, total)
   ↓
10. useSearchStore updates:
    • categoryCounts = { 1: 5, 2: 3 }
    • totalCount = 8
   ↓
11. Categories.tsx re-renders with new counts
   ↓
12. UI displays updated badge numbers
```

## Example Calculation

### Input Data:

```typescript
const pings = [
  { id: 1, title: "Fix login", category: { id: 1, name: "General" } },
  { id: 2, title: "Add dark mode", category: { id: 1, name: "General" } },
  { id: 3, title: "Career fair", category: { id: 2, name: "Events" } },
  { id: 4, title: "Study group", category: { id: 2, name: "Events" } },
  { id: 5, title: "New library", category: { id: 3, name: "Ideas" } },
];
```

### Processing:

```typescript
calculatePingCategoryCounts(pings)

Loop iteration 1: ping.category.id = 1 → counts[1] = 1
Loop iteration 2: ping.category.id = 1 → counts[1] = 2
Loop iteration 3: ping.category.id = 2 → counts[2] = 1
Loop iteration 4: ping.category.id = 2 → counts[2] = 2
Loop iteration 5: ping.category.id = 3 → counts[3] = 1
```

### Output:

```typescript
{
  counts: {
    1: 2,  // General has 2 pings
    2: 2,  // Events has 2 pings
    3: 1   // Ideas has 1 ping
  },
  total: 5  // 5 pings total
}
```

### UI Display:

```
All Categories              [5]
📚 General                 [2]
🎉 Events                  [2]
💡 Ideas                   [1]
```

## Trigger Events

The counts are recalculated when:

| Event      | Trigger              | Example                       |
| ---------- | -------------------- | ----------------------------- |
| **Fetch**  | Data loaded from API | User opens SoundBoard page    |
| **Search** | Search query changes | User types "login" in search  |
| **Filter** | Category selected    | User clicks "Events" category |
| **Add**    | New item created     | User creates new ping         |
| **Remove** | Item deleted         | Admin deletes a ping          |

## Key Files

- **Utility**: [`src/stores/utils/categoryCounts.ts`](../utils/categoryCounts.ts)
- **Pings Store**: [`src/stores/data/usePingsStore.ts`](../data/usePingsStore.ts)
- **Waves Store**: [`src/stores/data/useWavesStore.ts`](../data/useWavesStore.ts)
- **Search Store**: [`src/stores/ui/useSearchStore.ts`](../ui/useSearchStore.ts)
- **UI Component**: [`src/components/Categories.tsx`](../../components/Categories.tsx)
