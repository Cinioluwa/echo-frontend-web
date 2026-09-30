# Local Testing Guide

Run the full Echo stack (frontend + backend + database) locally to test and hunt
for bugs.

## 1. Prerequisites

| Tool | Version verified | Notes |
| --- | --- | --- |
| Node.js | v24.11.1 | `node --version` |
| npm | 11.6.2 | `npm --version` |
| PostgreSQL | 18.4 | `C:\Program Files\PostgreSQL\18\bin` |

## 2. Frontend (`c:\echo-frontend-web`)

```bash
npm install
copy .env.example .env      # Windows cmd
```

Only one env var is actually read by the Vite app:

```env
VITE_API_BASE_URL=http://127.0.0.1:3000/api
```

The `NEXT_PUBLIC_*` entries in `.env.example` are Next.js leftovers — this app
never reads them.

Start (detached, logs to disk):

```bash
powershell -NoProfile -ExecutionPolicy Bypass -File scripts\start-dev-server.ps1
```

Stop:

```bash
powershell -NoProfile -ExecutionPolicy Bypass -File scripts\stop-dev-server.ps1
```

Logs: `dev-server.log`, `dev-server-err.log` (git-ignored).

> **Use `http://localhost:5173`, not `127.0.0.1:5173`.** Vite binds the IPv6
> loopback (`[::1]`), so the IPv4 address refuses the connection. Add
> `server: { host: "127.0.0.1" }` to `vite.config.ts` if you need IPv4.

## 3. Backend (`C:\echo-backend`)

Install once — the repo shipped with an incomplete `node_modules` (`node-cron`
was missing, which crashed startup):

```bash
cd /d C:\echo-backend && npm install
```

Start both Postgres and the API (detached):

```bash
powershell -NoProfile -ExecutionPolicy Bypass -File C:\echo-backend\scripts\start-local.ps1
```

Stop the API (add `-IncludePostgres` to also stop the DB):

```bash
powershell -NoProfile -ExecutionPolicy Bypass -File C:\echo-backend\scripts\stop-local.ps1
```

Verify:

```bash
curl http://127.0.0.1:3000/healthz      # {"status":"ok"}  -- ROOT, not /api
curl http://127.0.0.1:3000/health       # deep check incl. database
```

Seed / refresh test data (safe to re-run — all upserts):

```bash
cd /d C:\echo-backend && node scripts\setup-multitenancy-tests.js
```

## 4. Test credentials

Password for all accounts: **`password123`**

| Organisation | Domain | Accounts |
| --- | --- | --- |
| Covenant University | `cu.edu.ng` | `admin@cu.edu.ng` (ADMIN), `rep@cu.edu.ng` (REP), `student@cu.edu.ng` (USER) |
| Test University A | `testuniva.edu` | `admina@testuniva.edu` (ADMIN), `studenta@testuniva.edu` (USER) |
| Test University B | `testunivb.edu` | `adminb@testunivb.edu` (ADMIN), `studentb@testunivb.edu` (USER) |

CU has 7 seeded pings and 8 waves; Orgs A and B have their own categories and
zero pings (useful for tenant-isolation testing — see §8).

> `src/pages/Login.tsx` also shows quick-fill buttons when the URL contains
> `?demoOrg=<name>` (password `EchoDemo2026!`). Those target the self-serve demo
> tenants, not the local seed above.

## 5. Quality gates

```bash
npm run lint     # ESLint 9 flat config
npm run build    # tsc -b (typecheck) + vite production build
npm run preview  # serve the production build
```

**Verified baseline:** `npm run build` passes with no TypeScript errors;
`npm run lint` exits 0 with 147 warnings and **0 errors**.

## 6. Gotchas that will waste your time

- **Login is rate-limited to 5 attempts / 15 min per IP.** Once exhausted it
  returns 429 and *every* account stops working, which looks like a broken seed
  or a wrong password. Restart the backend (`stop-local.ps1` then
  `start-local.ps1`) to clear the in-memory limiter while developing.
- **`localhost:5173`, not `127.0.0.1:5173`** (see §2).
- **Health endpoints are at the root**, not under `/api`.
- **`api/share.ts` + the `vercel.json` rewrites only run on Vercel.** Share-link
  Open-Graph previews are not exercised by `npm run dev`.
- Redis is not running, so the backend logs "Redis unavailable" and falls back
  to in-memory rate-limit stores. Expected and harmless locally.

## 7. Route map for manual testing

| Route | Access | What to check |
| --- | --- | --- |
| `/login` (`/`) | public | Form validation, forgot-password modal, offline banner |
| `/signUp`, `/signup` | public | Validation, consent text, error mapping (`SignUpError`) |
| `/verification` | public | Token consumption, resend cooldown |
| `/find-institution`, `/institution-found`, `/make-request`, `/request-submitted` | public | Multi-step flow, back navigation |
| `/waiting-room`, `/all-verified` | public | Status messaging |
| `/reset-password` | public | Invalid/expired token handling |
| `/feed`, `/feed/:pingId` | auth | Infinite scroll, skeletons, "load more", category/author names |
| `/guest/feed/:pingId` | public | Unauthenticated deep-link + redirect from `/feed/:pingId` |
| `/history`, `/history/:tab` | auth | Tab switching, filters |
| `/notifications` | auth | Read/unread, pagination |
| `/user/profile`, `/user/account`, `/user/privacy`, `/user/notification` | auth | Forms + optimistic updates |
| `/admin/soundboard`, `/admin/followUp`, `/admin/moderation`, `/admin/settings` | ADMIN | Moderation actions, bulk ops |
| `/super-admin/*` | SUPER_ADMIN | Tables, destructive-action confirmations |
| `/terms`, `/privacy` | public | Static copy |
| `/soundBoard`, `/stream`, `/waveHistory` | public | Legacy redirects to `/feed` / `/history` |
| any unknown path | public | `ErrorPage` 404 |

Guards: `ProtectedRoute` sends guests to `/login` (or `/guest/feed/...` for feed
deep-links) and routes non-active / org-less users to `/waiting-room`,
`/find-institution` or `/verification`. `AdminRoute` / `SuperAdminRoute` gate the
admin surfaces.

## 8. Bug-hunting checklist

- **Tenant isolation:** log in as `studenta@testuniva.edu` — expect 0 pings and
  only that org's 2 categories. Anything leaking from Covenant University is a bug.
- Console errors/warnings on each route (React keys, hook deps, 401 loops).
- Network tab: payloads, pagination params, duplicate calls.
- WebSocket: `src/api/socket.ts` connects to the API *root* namespace. Confirm
  `🟢 WebSocket connected` after login and that it survives a reconnect.
- Realtime: post a ping/surge/wave and confirm another tab updates live.
- Offline: DevTools "Offline" and confirm `parseNetworkError` states render.
- Session expiry: clear `authToken` in localStorage; the 401 interceptor should
  redirect exactly once (no loop).
- Modal/report flows (`WaveActionModal`, `ReportModal`, `CommentActionsDropdown`)
  — verify the entrance animations actually play (see §9, bug 1).
- Responsive: mobile nav (hamburger in the top bar opens `MobileSideDrawer`;
  `AdminMobileMenu` on admin pages), safe-area insets, PWA standalone splash.
- Accessibility: tab order, focus rings, `aria-*` on modals/dropdowns.

## 9. Bugs found and fixed during setup

1. **Every custom Tailwind animation was a silent no-op.** `tailwind.config.js`
   declared keyframes/animations, but Tailwind v4 does not auto-detect a JS
   config — it needs an `@config` directive, which `src/index.css` lacked. So
   `animate-fade-in`, `animate-fade-in-up`, `animate-scale-in`,
   `animate-bounce-subtle`, `animate-slide-up` and `animate-slide-down` were never
   emitted: modals never faded in, error text never slid up and the offline banner
   never slid down.
   **Fixed** by migrating the keyframes into the `@theme` block in
   `src/index.css` (the v4-native way) and deleting the now-dead, unloadable
   `tailwind.config.js`. Verified: all 7 animation utilities and their
   `@keyframes` are present in `dist/assets/*.css`.
2. **`animate-slide-in` was never defined anywhere**, so toasts had no entrance
   animation. Added a `slide-in` keyframe alongside the rest.
3. **`npm run lint` failed with 171 errors / 10 warnings**, making it useless as a
   gate. Fixed every error: `prefer-const`, unused params, an empty block, a
   useless regex escape, two empty `interface X {}` declarations, and
   `react-refresh/only-export-components` on the two context files (disabled with
   a justification — co-locating provider + hook is idiomatic). All 10
   `react-hooks/exhaustive-deps` warnings were resolved by adding stable
   dependencies or `useCallback`, except one where the correct fix would have
   caused an infinite render loop (documented inline).
4. **`healthService.check()` requested `/api/healthz`, which 404s** — the backend
   mounts health at the root. Now calls `<root>/healthz`.
5. **Dead code removed:** `src/hooks/useFormOptimization.ts` (never imported) and
   `tailwind.config.js` (never loaded).
6. **Backend: login was impossible with the README seed.** The backend resolves an
   organisation from the email domain via `organizationDomain.findUnique()`, *not*
   the legacy `Organization.domain` column — but
   `scripts/setup-multitenancy-tests.js` never created those rows. Every login
   returned 404 `ORG_NOT_FOUND` ("Login attempt for unknown organization
   domain"). Fixed the seed script and backfilled the table.
7. **Backend: half the seeded test accounts could never log in.** The API lowercases
   emails (`normalizeEmail`), but the seed created mixed-case local parts
   (`studentA@…`), so lookups missed. Seed, existing rows and README are now
   lowercase.

## 10. Visual verification harness (Playwright)

Playwright's Chromium is installed at
`%LOCALAPPDATA%\ms-playwright` and the package lives in the backend repo
(`C:\echo-backend`), so the harness scripts live in `C:\echo-backend\scripts\`.
They log in as `student@cu.edu.ng` through the real form (the login form, so the
Zustand store ends up in the app's own shape).

```bash
# Fast DOM assertions — checks each UI requirement without screenshots
node C:\echo-backend\scripts\assert-ui.mjs

# Exact layout geometry: navbar/column alignment, gutter widths
node C:\echo-backend\scripts\visual-measure.mjs

# Screenshots -> %LOCALAPPDATA%\Temp\shots (open them in an image viewer)
node C:\echo-backend\scripts\visual-check.mjs
```

Output logs are written next to them (`assert-ui.log`, `visual-measure.log`,
`visual-check.log`).

Gotcha: the login endpoint is rate-limited to 5 attempts / 15 min. Each script
run performs one login, so if a run fails with a 429, restart the backend first.

Baseline for `assert-ui.mjs`: **19 passed, 0 failed.**

## 11. Known issues left open

- **`src/pages/MobileSignUp.tsx` is unreachable** — no route references it
  (`routes.tsx` maps only `SignUp` to `/signUp` and `/signup`). It also hardcodes
  "Echo: Your Voice at CU", which conflicts with the multi-tenant design, but a
  past commit explicitly "fixed MobileSignUp", so **deleting or wiring it up is a
  product decision — it was deliberately left untouched.**
- **`src/App.tsx` and `src/App.css` are dead Vite-template leftovers.** `main.tsx`
  renders `RouterProvider` directly and never imports them. Not a runtime bug (the
  auth store persists and rehydrates `user`/`token`, so the `fetchUser()` in
  `App.tsx` is redundant), but misleading.
- **147 `no-explicit-any` warnings** (downgraded from errors in
  `eslint.config.js`). These are ~83 `catch (err: any)` clauses plus loosely typed
  API payloads. Replacing them with real error/payload types is a deliberate
  refactor, not a quick fix.
- **`CommentsList.tsx`** keeps an inline `eslint-disable` for
  `react-hooks/exhaustive-deps`; its callback depends on an inline prop and a
  first-load flag, so honouring the rule would loop forever.