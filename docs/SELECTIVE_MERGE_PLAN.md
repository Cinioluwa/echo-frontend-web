# Selective Merge Plan: Integrate UI Changes While Keeping API Implementation

**Branch:** `feature/api-integration` ← `main`  
**Date:** January 30, 2026  
**Strategy:** Keep comprehensive Zustand/API implementation, adopt UI improvements  
**Estimated Time:** 90-120 minutes

---

## Table of Contents

1. [Overview](#overview)
2. [Pre-Merge Analysis](#pre-merge-analysis)
3. [Merge Strategy](#merge-strategy)
4. [Step-by-Step Execution](#step-by-step-execution)
5. [Conflict Resolution Guide](#conflict-resolution-guide)
6. [Integration Requirements](#integration-requirements)
7. [Testing Checklist](#testing-checklist)
8. [Troubleshooting](#troubleshooting)
9. [Rollback Plan](#rollback-plan)

---

## Overview

### Situation

- **Your Branch (`feature/api-integration`)**: 29 commits ahead with comprehensive API integration and Zustand state management
- **Main Branch**: 5 commits with UI improvements, Layout component, and simplified form flow
- **Goal**: Merge UI changes while preserving your robust API/state infrastructure

### What We're Keeping vs. Adopting

| Component                           | Decision         | Reason                          |
| ----------------------------------- | ---------------- | ------------------------------- |
| **Zustand Stores** (`src/stores/`)  | ✅ KEEP YOURS    | Comprehensive, production-ready |
| **API Layer** (`src/api/`)          | ✅ KEEP YOURS    | Full service integration        |
| **Layout Component**                | ✅ ADOPT THEIRS  | New UI structure                |
| **Routes File**                     | ✅ ADOPT THEIRS  | Cleaner routing                 |
| **Page Components**                 | ✅ KEEP YOURS    | API-integrated                  |
| **Modal Components**                | 🔄 HYBRID        | Their UI + Your API             |
| **Simple Stores** (`src/services/`) | ❌ DELETE THEIRS | Redundant                       |

---

## Pre-Merge Analysis

### Files Changed in Main (Their Work)

**New Files:**

- `src/components/Layout.tsx` - New layout wrapper
- `src/components/routes.tsx` - Router configuration
- `src/services/pingStore.ts` - Simple Zustand store
- `src/services/waveStore.ts` - Simple Zustand store
- `public/echo.svg` - Asset

**Modified Files:**

- `src/App.tsx` - Uses Layout component
- Wave creation flow components
- UI/styling improvements across components

### Files Changed in Your Branch (Your Work)

**New Directories:**

- `src/api/` - Complete API service layer
- `src/stores/` - 7 comprehensive Zustand stores
- `docs/` - Implementation documentation

**Modified Files:**

- All page components (API integration)
- All card components (API data display)
- Modal components (API submission)
- Search/filter components (Zustand integration)

### Divergence Summary

```
feature/api-integration: 29 commits ahead, 5 commits behind
Files changed: 111
Insertions: +8,627
Deletions: -1,082
```

---

## Merge Strategy

### Three-Phase Approach

#### Phase 1: Preparation (10 min)

- Create safety backup
- Review changes
- Plan conflict resolution

#### Phase 2: Merge Execution (45 min)

- Start merge (no auto-commit)
- Resolve conflicts strategically
- Manual file-by-file decisions

#### Phase 3: Integration & Testing (45 min)

- Integrate Layout with Zustand
- Update routing
- Test all functionality

---

## Step-by-Step Execution

### Phase 1: Preparation

#### Step 1.1: Create Backup

```bash
# Switch to your branch
git checkout feature/api-integration

# Verify you're on the right branch
git branch --show-current

# Create safety backup
git checkout -b backup/pre-selective-merge

# Return to working branch
git checkout feature/api-integration

# Verify clean working directory
git status
```

**Expected Output:**

```
On branch feature/api-integration
Your branch is up to date with 'origin/feature/api-integration'.

nothing to commit, working tree clean
```

#### Step 1.2: Review Main Changes

```bash
# Fetch latest
git fetch origin main

# View main's recent commits
git log origin/main --oneline -5

# See what files they changed (excluding your new dirs)
git diff origin/main --name-status | Select-String -Pattern "^M" | Select-String -NotMatch "src/(api|stores)" -Context 0,0
```

**Document findings:**

- [ ] Identify Layout usage pattern
- [ ] Note wave creation flow changes
- [ ] List UI component updates

#### Step 1.3: Prepare Conflict Resolution List

Create a file to track decisions:

```bash
# Create decision log
"# Merge Decisions Log" > merge-decisions.txt
"Date: $(Get-Date)" >> merge-decisions.txt
"" >> merge-decisions.txt
```

---

### Phase 2: Merge Execution

#### Step 2.1: Initiate Merge

```bash
# Start merge WITHOUT auto-commit
git merge origin/main --no-commit --no-ff
```

**Expected Output:**

```
Automatic merge failed; fix conflicts and then commit the result.
```

**Don't panic!** This is expected. Check status:

```bash
git status
```

#### Step 2.2: Handle Store Conflicts (Priority 1)

**Decision: Keep YOUR comprehensive stores, remove their simple stores**

```bash
# Keep YOUR entire stores directory
git checkout --ours src/stores/
git add src/stores/

# Remove THEIR simple stores (redundant)
git rm -f src/services/pingStore.ts 2>$null
git rm -f src/services/waveStore.ts 2>$null

# If removal shows "does not exist", that's fine - they may not conflict
# Log decision
"[STORES] Kept comprehensive Zustand implementation from api-integration" >> merge-decisions.txt
"[STORES] Removed simple pingStore.ts and waveStore.ts from main" >> merge-decisions.txt
```

#### Step 2.3: Handle API Layer (Priority 2)

**Decision: Keep YOUR complete API infrastructure**

```bash
# Keep YOUR entire API directory
git checkout --ours src/api/
git add src/api/

# Log decision
"[API] Kept complete API service layer from api-integration" >> merge-decisions.txt
```

#### Step 2.4: Adopt UI Structure (Priority 3)

**Decision: Take their Layout and Routes**

```bash
# Take THEIR Layout component (new file)
git checkout --theirs src/components/Layout.tsx
git add src/components/Layout.tsx

# Take THEIR routes file (new file)
git checkout --theirs src/components/routes.tsx
git add src/components/routes.tsx

# Take THEIR public assets if any
git checkout --theirs public/echo.svg 2>$null
git add public/echo.svg 2>$null

# Log decisions
"[UI] Adopted Layout.tsx from main" >> merge-decisions.txt
"[UI] Adopted routes.tsx from main" >> merge-decisions.txt
```

#### Step 2.5: Handle Page Components (Priority 4)

**Decision: Keep YOUR API-integrated pages**

```bash
# Keep YOUR pages (they have API integration)
git checkout --ours src/pages/Stream.tsx
git checkout --ours src/pages/SoundBoard.tsx
git checkout --ours src/pages/WaveHistory.tsx
git checkout --ours src/pages/Login.tsx
git checkout --ours src/pages/SignUp.tsx
git add src/pages/

# Log decision
"[PAGES] Kept all page components from api-integration (API-integrated)" >> merge-decisions.txt
```

#### Step 2.6: Handle Modal Components (Hybrid Approach)

**Decision: Manually merge - take their UI improvements, keep your API logic**

```bash
# Check the diff for each modal
git diff --ours --theirs src/components/WaveFormModal.tsx > wave-modal-diff.txt
git diff --ours --theirs src/components/PingFormModal.tsx > ping-modal-diff.txt
git diff --ours --theirs src/components/ProposeWaveModal.tsx > propose-modal-diff.txt
```

**For each modal:**

1. **If their changes are mostly CSS/JSX structure:**

   ```bash
   # Take their version as base
   git checkout --theirs src/components/WaveFormModal.tsx
   ```

2. **Then manually add back your API integration:**
   - Open file in editor
   - Add imports: `import { useWavesStore } from '../stores'`
   - Add API submission logic
   - Keep their UI/form structure

3. **If their changes conflict with your API logic:**
   ```bash
   # Keep yours
   git checkout --ours src/components/WaveFormModal.tsx
   ```

**Manual merge checklist:**

- [ ] WaveFormModal.tsx - Check wave creation flow
- [ ] PingFormModal.tsx - Check ping creation flow
- [ ] ProposeWaveModal.tsx - Check proposal flow

#### Step 2.7: Handle App.tsx (Critical - Manual Merge Required)

**Decision: Combine both implementations**

```bash
# Check the conflict
git diff --ours --theirs src/App.tsx > app-diff.txt
```

**Open App.tsx and create hybrid version:**

```tsx
import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import router from "./components/routes"; // FROM MAIN
import { useAuthStore } from "./stores"; // FROM YOUR BRANCH

function App() {
  // YOUR CODE: Initialize auth on mount
  const fetchUser = useAuthStore((state) => state.fetchUser);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchUser();
    }
  }, [fetchUser]);

  // THEIR CODE: Use RouterProvider with their routes
  return <RouterProvider router={router} />;
}

export default App;
```

```bash
# After manual edit, stage it
git add src/App.tsx

# Log decision
"[APP] Manually merged App.tsx - using their RouterProvider with your auth initialization" >> merge-decisions.txt
```

#### Step 2.8: Handle Remaining Component Conflicts

**Strategy: Take their UI, verify API integration intact**

```bash
# Check remaining conflicts
git status | Select-String "both modified"
```

**For each remaining conflict:**

1. **Check if it's a UI-only component:**

   ```bash
   git checkout --theirs src/components/ComponentName.tsx
   git add src/components/ComponentName.tsx
   ```

2. **If it has API logic:**
   - Check diff: `git diff --ours --theirs src/components/ComponentName.tsx`
   - If their changes are CSS/structure: take theirs, verify imports
   - If they removed API calls: keep yours
   - If uncertain: keep yours (safer)

#### Step 2.9: Handle Documentation

**Decision: Keep YOUR documentation**

```bash
# Keep your comprehensive docs
git checkout --ours docs/
git add docs/

# Log decision
"[DOCS] Kept API integration documentation from api-integration" >> merge-decisions.txt
```

#### Step 2.10: Handle Config Files

```bash
# Check remaining conflicts
git status

# For package.json - usually keep yours (has API dependencies)
git checkout --ours package.json
git checkout --ours package-lock.json
git add package.json package-lock.json

# For other configs - case by case
```

#### Step 2.11: Verify All Conflicts Resolved

```bash
# Check status - should show no conflicts
git status

# Should see:
# - Changes to be committed (green)
# - No "Unmerged paths" section
```

**If still conflicts:**

- Review each conflicted file
- Make decision: `--ours`, `--theirs`, or manual edit
- Stage with `git add`

---

### Phase 3: Integration & Testing

#### Step 3.1: Review Layout Integration

**File: `src/components/Layout.tsx`**

The Layout component from main expects these props:

```tsx
interface LayoutProps {
  setFormSegment: React.Dispatch<React.SetStateAction<string>>;
  setForm: React.Dispatch<React.SetStateAction<boolean>>;
  setActivePage: React.Dispatch<React.SetStateAction<Pages>>;
  activePage: Pages;
  heading: string;
}
```

**Integration Options:**

**Option A: Keep prop-based approach (Simpler)**

- No changes to Layout needed
- Page components pass form state down
- Works immediately

**Option B: Integrate Zustand (More consistent)**

- Modify Layout to use your stores
- Remove prop drilling
- More work but cleaner

**Recommended: Option A for initial merge, then refactor to Option B**

#### Step 3.2: Update Imports After Merge

**Files that may need import updates:**

1. **Components using old Context API** (if any remain):

   ```tsx
   // Old
   import { useAuth } from "../contexts/AuthContext";

   // New
   import { useAuthStore } from "../stores";
   ```

2. **Components importing from wrong path:**
   ```bash
   # Search for any old imports
   grep -r "from '../contexts" src/components/
   grep -r "from '../services/pingStore" src/
   ```

#### Step 3.3: Install Dependencies

```bash
# In case any new dependencies from main
npm install

# Verify no conflicts
npm run build
```

#### Step 3.4: Run Development Server

```bash
# Start dev server
npm run dev
```

**Expected:**

- Server starts on `http://localhost:5173`
- No compilation errors
- No TypeScript errors

#### Step 3.5: Manual Testing Checklist

**Test Each Page:**

- [ ] **Login Page**
  - [ ] Form renders correctly (their UI)
  - [ ] Login API call works (your API)
  - [ ] Auth store updates (your Zustand)
  - [ ] Redirects after login
  - [ ] Error handling displays

- [ ] **SignUp Page**
  - [ ] Form renders correctly
  - [ ] Registration API works
  - [ ] Validation works
  - [ ] Success flow

- [ ] **Stream Page**
  - [ ] Layout component wraps page (their UI)
  - [ ] Waves load from API (your API)
  - [ ] Waves display correctly (your data + their UI)
  - [ ] Surge toggle works (your Zustand)
  - [ ] Search works (your search store)
  - [ ] Category filter works (your categories store)
  - [ ] Pagination works

- [ ] **SoundBoard Page**
  - [ ] Layout component present
  - [ ] Pings load from API
  - [ ] Create ping button works (their UI)
  - [ ] Ping creation modal works (hybrid)
  - [ ] Surge toggle works
  - [ ] Propose wave works

- [ ] **WaveHistory Page**
  - [ ] Waves grouped by date (your logic)
  - [ ] Category filter works
  - [ ] Loads from cache on navigation

**Test Navigation:**

- [ ] Routes work (their routes.tsx)
- [ ] Auth persistence works
- [ ] Page transitions are fast (your caching)

**Test Zustand:**

- [ ] Open Redux DevTools
- [ ] Verify all 7 stores present:
  - [ ] AuthStore
  - [ ] WavesStore
  - [ ] PingsStore
  - [ ] ResolutionsStore
  - [ ] CategoriesStore
  - [ ] SurgeStore
  - [ ] SearchStore

**Test API Layer:**

- [ ] Open Network tab
- [ ] Login - see `/api/auth/login`
- [ ] Stream - see `/api/public/stream`
- [ ] SoundBoard - see `/api/public/soundboard`
- [ ] Cache prevents duplicate calls

#### Step 3.6: Fix Issues Found

**Common Issues & Fixes:**

**Issue 1: Import errors**

```bash
# Find and fix import paths
# Component doesn't find store
# Fix: Check import path is correct
import { useWavesStore } from '../stores'; // or '../../stores'
```

**Issue 2: Layout props missing**

```tsx
// If page doesn't provide props to Layout
// Add prop state management or use Option B (Zustand in Layout)
```

**Issue 3: Routes not found**

```tsx
// If routes.tsx not found
// Verify file was merged: ls src/components/routes.tsx
```

**Issue 4: Duplicate stores error**

```bash
# If both old and new stores loaded
# Search for old imports and remove
grep -r "services/pingStore" src/
```

#### Step 3.7: Performance Verification

**Check Caching Works:**

1. Visit Stream page (API call)
2. Navigate to SoundBoard (API call)
3. Navigate back to Stream (NO API call - cached!)
4. Open DevTools → Redux → WavesStore → lastFetched (should have timestamp)

**Expected Metrics:**

- Page load: <100ms (cached)
- Initial load: ~1000ms (API)
- Re-renders: Minimal (Zustand optimization)

---

## Conflict Resolution Guide

### Decision Matrix

| File Pattern                | Keep   | Reason                       | Command                            |
| --------------------------- | ------ | ---------------------------- | ---------------------------------- |
| `src/stores/**`             | YOURS  | Comprehensive implementation | `git checkout --ours src/stores/`  |
| `src/api/**`                | YOURS  | Core infrastructure          | `git checkout --ours src/api/`     |
| `src/services/pingStore.ts` | DELETE | Redundant                    | `git rm src/services/pingStore.ts` |
| `src/services/waveStore.ts` | DELETE | Redundant                    | `git rm src/services/waveStore.ts` |
| `src/components/Layout.tsx` | THEIRS | New UI structure             | `git checkout --theirs`            |
| `src/components/routes.tsx` | THEIRS | New routing                  | `git checkout --theirs`            |
| `src/pages/**`              | YOURS  | API-integrated               | `git checkout --ours src/pages/`   |
| `src/App.tsx`               | MANUAL | Needs both                   | Edit manually                      |
| `src/components/*Modal.tsx` | HYBRID | Their UI + Your API          | Case-by-case                       |
| `docs/**`                   | YOURS  | Your documentation           | `git checkout --ours docs/`        |
| `package.json`              | YOURS  | Has API deps                 | `git checkout --ours`              |
| CSS files                   | THEIRS | UI improvements              | `git checkout --theirs`            |
| `public/**`                 | REVIEW | Check each file              | Case-by-case                       |

### Conflict Resolution Commands

**View conflict:**

```bash
git diff --ours --theirs <file>
```

**Take your version:**

```bash
git checkout --ours <file>
git add <file>
```

**Take their version:**

```bash
git checkout --theirs <file>
git add <file>
```

**Manual merge:**

1. Open file in VS Code
2. Look for conflict markers:
   ```
   <<<<<<< HEAD (yours)
   Your code
   =======
   Their code
   >>>>>>> origin/main
   ```
3. Edit to combine both
4. Remove markers
5. Save and stage: `git add <file>`

### Specific File Guidance

#### `src/App.tsx`

**Their version** (simplified):

```tsx
import { RouterProvider } from "react-router-dom";
import router from "./components/routes";

function App() {
  return <RouterProvider router={router} />;
}
```

**Your version** (with auth):

```tsx
import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuthStore } from "./stores";
// ... page imports

function App() {
  const fetchUser = useAuthStore((state) => state.fetchUser);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) fetchUser();
  }, [fetchUser]);

  return (
    <BrowserRouter>
      <Routes>{/* routes */}</Routes>
    </BrowserRouter>
  );
}
```

**Merged version** (best of both):

```tsx
import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import router from "./components/routes"; // Their cleaner routing
import { useAuthStore } from "./stores"; // Your auth

function App() {
  // Your auth initialization
  const fetchUser = useAuthStore((state) => state.fetchUser);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchUser();
    }
  }, [fetchUser]);

  // Their routing structure
  return <RouterProvider router={router} />;
}

export default App;
```

#### Modal Components Pattern

**For WaveFormModal.tsx:**

1. Check their changes:

   ```bash
   git diff --ours --theirs src/components/WaveFormModal.tsx
   ```

2. If changes are UI/JSX:
   - Take their version: `git checkout --theirs src/components/WaveFormModal.tsx`
   - Then add back your API imports and submission logic

3. Key API code to preserve:

   ```tsx
   import { useWavesStore } from "../stores";

   const invalidateCache = useWavesStore((state) => state.invalidateCache);
   const fetchWaves = useWavesStore((state) => state.fetchWaves);

   const handleSubmit = async (data) => {
     await waveService.createWave(data);
     invalidateCache();
     await fetchWaves();
     onClose();
   };
   ```

---

## Integration Requirements

### Post-Merge Modifications Needed

#### 1. Ensure Layout Compatibility

**If using their Layout component prop-based:**

Page components need to provide:

```tsx
const [form, setForm] = useState(false);
const [formSegment, setFormSegment] = useState("");
const [activePage, setActivePage] = useState<Pages>("stream");

<Layout
  setFormSegment={setFormSegment}
  setForm={setForm}
  setActivePage={setActivePage}
  activePage={activePage}
  heading="Stream"
>
  {/* page content */}
</Layout>;
```

**Alternatively, refactor Layout to use Zustand:**

```tsx
// In Layout.tsx, replace props with stores
import { useWavesStore, usePingsStore } from "../stores";

const Layout = ({ activePage, heading }: Partial<LayoutProps>) => {
  const invalidateWaves = useWavesStore((state) => state.invalidateCache);
  const invalidatePings = usePingsStore((state) => state.invalidateCache);

  const handleCreatePing = () => {
    // Show modal
    // On success, invalidate caches
  };

  // ... rest of component
};
```

#### 2. Remove Old Context Providers (if any remain)

Search and remove:

```bash
# Find any remaining context imports
grep -r "AuthContext" src/
grep -r "CategoryFilterContext" src/

# Remove the context files if they exist
rm src/contexts/AuthContext.tsx 2>$null
rm src/contexts/CategoryFilterContext.tsx 2>$null
```

#### 3. Update Import Paths

Run consistency check:

```bash
# Find inconsistent import paths
grep -r "from '../stores" src/pages/
grep -r "from '../../stores" src/components/
```

All should use correct relative path based on file location.

#### 4. Verify TypeScript Types

```bash
# Check for type errors
npm run build

# Or if you have type-check script
npm run type-check
```

Common type issues:

- Props interfaces changed
- Store types not exported
- Component prop mismatches

---

## Testing Checklist

### Pre-Commit Testing

#### Automated Checks

```bash
# TypeScript compilation
npm run build

# Linting (if configured)
npm run lint

# Unit tests (if any)
npm run test
```

#### Manual Functional Testing

**Critical Path 1: Authentication Flow**

- [ ] Navigate to `/`
- [ ] Enter credentials
- [ ] Click login
- [ ] Verify redirect to `/stream`
- [ ] Verify user data in NavBar
- [ ] Check localStorage has token
- [ ] Refresh page - verify still logged in
- [ ] Logout - verify redirect to `/`
- [ ] Verify token removed from localStorage

**Critical Path 2: Stream Page**

- [ ] Navigate to `/stream`
- [ ] Verify waves load (check Network tab)
- [ ] Verify Layout component renders
- [ ] Click a category - verify filter works
- [ ] Type in search - verify debounced search works
- [ ] Click surge on a wave - verify toggle works
- [ ] Check Redux DevTools - verify WavesStore updated
- [ ] Navigate away and back - verify no new API call (cached)

**Critical Path 3: SoundBoard Page**

- [ ] Navigate to `/soundboard`
- [ ] Verify pings load
- [ ] Click "Create a ping" button (from Layout)
- [ ] Fill form and submit
- [ ] Verify modal closes
- [ ] Verify new ping appears in list
- [ ] Verify cache invalidated (new API call)
- [ ] Click surge - verify works
- [ ] Click "Propose Wave" - verify modal works

**Critical Path 4: WaveHistory Page**

- [ ] Navigate to `/waveHistory`
- [ ] Verify waves grouped by date
- [ ] Verify "Today", "Yesterday" labels
- [ ] Verify category filter works
- [ ] Verify loads from cache if already fetched

**Critical Path 5: Wave Creation Flow** (Their new flow)

- [ ] From any page, click create ping/wave button
- [ ] Verify modal opens with their new UI
- [ ] Fill form
- [ ] Submit
- [ ] Verify API call made (your API)
- [ ] Verify success handling (your store update)
- [ ] Verify UI feedback (their UI)

#### Performance Testing

**Cache Effectiveness:**

1. Open DevTools → Network tab
2. Visit Stream page (should see API call)
3. Navigate to SoundBoard (should see API call)
4. Navigate back to Stream (should see NO API call - cached)
5. Wait 6 minutes
6. Navigate away and back (should see NEW API call - cache expired)

**Zustand DevTools:**

1. Open Redux DevTools extension
2. Verify all stores present:
   - AuthStore
   - WavesStore
   - PingsStore
   - ResolutionsStore
   - CategoriesStore
   - SurgeStore
   - SearchStore
3. Perform action (surge)
4. Verify state updated in DevTools
5. Verify action logged

**Network Efficiency:**

- [ ] Login: 1 API call
- [ ] Initial Stream load: 1 API call
- [ ] Category filter: 1 API call (or 0 if cached)
- [ ] Search: 1 API call after debounce
- [ ] Surge toggle: 1 API call
- [ ] Page navigation (cached): 0 API calls

#### Browser Compatibility

Test in:

- [ ] Chrome (primary)
- [ ] Firefox
- [ ] Safari (if available)
- [ ] Edge

Check:

- [ ] Layout renders correctly
- [ ] Zustand persistence works (localStorage)
- [ ] API calls succeed
- [ ] No console errors

### Post-Commit Verification

After successful merge commit:

```bash
# Push to remote
git push origin feature/api-integration

# Verify on GitHub
# Check Actions/CI passes (if configured)

# Pull request checks:
# - No merge conflicts with main
# - All tests pass
# - Code review approved
```

---

## Troubleshooting

### Common Issues & Solutions

#### Issue 1: "Cannot find module '../stores'"

**Symptoms:**

```
Error: Cannot find module '../stores'
```

**Cause:** Import path incorrect or stores not staged

**Fix:**

```bash
# Verify stores directory exists
ls src/stores/

# Check import path in component
# Should be:
import { useWavesStore } from '../stores'; // from pages/
import { useWavesStore } from '../../stores'; // from components/subdirs/

# Verify stores were merged correctly
git status | grep stores
```

#### Issue 2: Duplicate Stores Conflict

**Symptoms:**

```
Error: Multiple stores with same name
```

**Cause:** Both old (services/) and new (stores/) exist

**Fix:**

```bash
# Remove old stores
git rm src/services/pingStore.ts
git rm src/services/waveStore.ts

# Search for any imports of old stores
grep -r "services/pingStore" src/
grep -r "services/waveStore" src/

# Update any found imports to use new stores
```

#### Issue 3: Layout Props Missing

**Symptoms:**

```
Type error: Property 'setFormSegment' is missing
```

**Cause:** Page component doesn't provide required Layout props

**Fix Option A - Add prop state:**

```tsx
// In page component
const [form, setForm] = useState(false);
const [formSegment, setFormSegment] = useState("");
const [activePage, setActivePage] = useState<Pages>("stream");

<Layout
  setFormSegment={setFormSegment}
  setForm={setForm}
  setActivePage={setActivePage}
  activePage={activePage}
  heading="Stream"
>
```

**Fix Option B - Make props optional:**

```tsx
// In Layout.tsx
interface LayoutProps {
  setFormSegment?: React.Dispatch<React.SetStateAction<string>>;
  setForm?: React.Dispatch<React.SetStateAction<boolean>>;
  // ...
}
```

#### Issue 4: Routes Not Working

**Symptoms:**

- 404 on navigation
- Blank pages
- Routes not loading

**Cause:** RouterProvider not configured or routes file missing

**Fix:**

```bash
# Verify routes file exists
ls src/components/routes.tsx

# Verify App.tsx uses RouterProvider
cat src/App.tsx | grep RouterProvider

# Should see:
# import { RouterProvider } from 'react-router-dom';
# return <RouterProvider router={router} />;
```

#### Issue 5: Auth Not Persisting

**Symptoms:**

- User logged out on refresh
- Token disappears
- Auth state resets

**Cause:** Zustand persist middleware not working

**Fix:**

```bash
# Check AuthStore has persist middleware
cat src/stores/auth/useAuthStore.ts | grep persist

# Should see:
# persist(
#   immer((set) => ({ ... })),
#   { name: 'auth-storage' }
# )

# Check localStorage
# In browser console:
localStorage.getItem('auth-storage')
```

#### Issue 6: API Calls Failing

**Symptoms:**

- Network errors
- 404 on API calls
- CORS errors

**Cause:** API base URL not set or incorrect

**Fix:**

```bash
# Verify .env file exists
cat .env

# Should have:
VITE_API_BASE_URL="http://localhost:3000/api"

# Verify axios config uses it
cat src/api/axios.config.ts | grep VITE_API_BASE_URL

# Restart dev server to load .env
npm run dev
```

#### Issue 7: Surge Toggle Not Working

**Symptoms:**

- Click surge, nothing happens
- Surge count doesn't update
- Errors in console

**Cause:** SurgeStore not connected or API call failing

**Fix:**

```tsx
// Verify component uses SurgeStore
import { useSurgeStore } from "../../stores";

const toggleSurge = useSurgeStore((state) => state.toggleSurge);
const hasSurged = useSurgeStore((state) => state.hasSurged("wave", waveId));

// Check Network tab - should see POST to /api/waves/:id/surge
// Check Redux DevTools - should see SurgeStore update
```

#### Issue 8: TypeScript Errors After Merge

**Symptoms:**

```
Type 'X' is not assignable to type 'Y'
```

**Cause:** Type definitions changed between branches

**Fix:**

```bash
# Rebuild types
npm run build

# Check type exports
cat src/api/types/index.ts

# Verify component imports correct types
# Should use types from src/api/types
import type { Wave, Ping } from '../api/types';
```

### Debug Checklist

When something doesn't work:

1. **Check console:**

   ```
   Open DevTools → Console
   Look for errors
   ```

2. **Check network:**

   ```
   Open DevTools → Network
   Filter: XHR
   Check API calls
   ```

3. **Check Zustand:**

   ```
   Open Redux DevTools
   Check store state
   Check action logs
   ```

4. **Check imports:**

   ```bash
   grep -r "import.*from.*stores" src/pages/ComponentName.tsx
   ```

5. **Check build:**

   ```bash
   npm run build
   # Any errors?
   ```

6. **Check git status:**
   ```bash
   git status
   # Any unstaged changes?
   # Any conflicts remaining?
   ```

---

## Rollback Plan

### If Merge Fails Catastrophically

#### Option 1: Abort Merge (Before Commit)

```bash
# If merge not yet committed
git merge --abort

# Verify clean state
git status

# You're back to pre-merge state
```

#### Option 2: Reset to Backup (After Commit)

```bash
# If merge committed but broken
git reset --hard backup/pre-selective-merge

# Force push if already pushed
git push origin feature/api-integration --force

# WARNING: Only do this if no one else is using the branch
```

#### Option 3: Revert Merge Commit

```bash
# If merge committed and pushed
git revert -m 1 HEAD

# This creates a new commit that undoes the merge
git push origin feature/api-integration
```

### If Specific Files Broken

```bash
# Reset specific file to your version
git checkout backup/pre-selective-merge -- src/path/to/file.tsx

# Re-stage
git add src/path/to/file.tsx

# Amend merge commit
git commit --amend --no-edit
```

### Recovery Checklist

If you need to rollback:

- [ ] Verify backup branch exists: `git branch | grep backup`
- [ ] Document what went wrong
- [ ] Save error logs
- [ ] Identify problematic files
- [ ] Execute rollback command
- [ ] Verify app works again
- [ ] Plan corrective action

---

## Final Checklist

### Before Committing Merge

- [ ] All conflicts resolved (`git status` shows no conflicts)
- [ ] All files staged (`git status` shows changes to be committed)
- [ ] App compiles (`npm run build` succeeds)
- [ ] No TypeScript errors
- [ ] Dev server runs (`npm run dev` works)
- [ ] All pages load without errors
- [ ] Auth flow works (login/logout)
- [ ] API calls work (check Network tab)
- [ ] Zustand stores work (check Redux DevTools)
- [ ] Surge toggle works
- [ ] Search works
- [ ] Category filter works
- [ ] Navigation works
- [ ] Layout component displays correctly
- [ ] Modal forms work
- [ ] No console errors

### Commit Message Template

```bash
git commit -m "Merge UI improvements from main into API integration branch

Selective merge strategy:
- ✅ Kept comprehensive Zustand implementation (7 stores)
- ✅ Kept complete API service layer
- ✅ Adopted Layout component and routes structure from main
- ✅ Integrated wave creation flow updates
- ✅ Removed redundant simple stores (pingStore, waveStore)
- 🔄 Hybrid approach for modal components (their UI + our API)

Changes:
- Integrated Layout.tsx wrapper component
- Updated App.tsx to use RouterProvider with auth initialization
- Maintained API integration in all page components
- Preserved Zustand caching and state management
- Updated modal components with new UI while keeping API logic

Testing:
- All pages load correctly
- Auth flow works (login/logout/persistence)
- API calls functional (Stream, SoundBoard, WaveHistory)
- Zustand stores operational (verified in DevTools)
- Cache working (5-min TTL, prevents duplicate calls)
- Surge toggling functional
- Search and filtering operational

No breaking changes to:
- API service layer
- Zustand store structure
- Component props interfaces
- Type definitions"
```

### After Committing

```bash
# Push to remote
git push origin feature/api-integration

# Verify on GitHub
# - Check no conflicts with main
# - Verify all files pushed
# - Check CI/Actions pass

# Create/update pull request
# Add description of merge strategy
# Request code review
```

### Post-Merge Follow-ups

- [ ] Update documentation if needed
- [ ] Notify team of successful merge
- [ ] Plan final merge to main
- [ ] Schedule code review
- [ ] Test in staging environment
- [ ] Monitor for any issues

---

## Timeline

| Phase               | Tasks                          | Duration               |
| ------------------- | ------------------------------ | ---------------------- |
| **Preparation**     | Backup, review, plan           | 10 min                 |
| **Merge Execution** | Resolve conflicts, stage files | 45 min                 |
| **Integration**     | Update imports, fix issues     | 15 min                 |
| **Testing**         | Manual testing, verification   | 30 min                 |
| **Documentation**   | Update logs, commit message    | 10 min                 |
| **Total**           |                                | **110 min (1h 50min)** |

---

## Success Criteria

✅ **Merge is successful when:**

1. **Code Quality:**
   - No TypeScript errors
   - No console errors
   - No build errors
   - All tests pass

2. **Functionality:**
   - All pages load
   - Auth works
   - API calls succeed
   - Zustand stores work
   - Navigation works
   - UI displays correctly

3. **Performance:**
   - Caching works (no duplicate calls)
   - Page transitions fast (<100ms cached)
   - No memory leaks
   - DevTools show proper state

4. **Integration:**
   - Layout component works
   - Routes work
   - Modal flow works
   - Surge toggle works
   - Search works

5. **Git Status:**
   - Clean working directory
   - Single merge commit
   - Proper commit message
   - Pushed to remote

---

**Document Version:** 1.0  
**Last Updated:** January 30, 2026  
**Next Review:** After merge execution

**Remember:** Take your time, test thoroughly, and don't hesitate to rollback if something goes wrong. The backup branch is your safety net!
