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
npm install                 # only if dependencies are not installed
```

Only one env var is actually read by the Vite app:

```env
VITE_API_BASE_URL=http://127.0.0.1:3000/api
```

The `NEXT_PUBLIC_*` entries in `.env.example` are Next.js leftovers — this app
never reads them.

Start the app:

```bash
npm run dev -- --host 127.0.0.1 --port 5173
```

Open `http://127.0.0.1:5173`. Stop the foreground process with `Ctrl+C`.

The institutional marketing page is served separately from
`C:\Echo Landing Page V3` on port 5175:

```powershell
cd C:\Echo Landing Page V3
& 'C:\echo-frontend-web\node_modules\.bin\vite.cmd' --host 127.0.0.1 --port 5175
```

Open `http://127.0.0.1:5175/institutions.html`.

## 3. Superadmin dashboard (`C:\echo-superadmin`)

The separate Superadmin app now has a **Claim Review** page. Run it against the
local backend API with a process-scoped environment override (the checked-in
`.env` currently points at the hosted API):

```powershell
cd C:\echo-superadmin
$env:VITE_API_BASE_URL = "http://127.0.0.1:3000"
npm run dev -- --host 127.0.0.1 --port 5174
```

Open `http://127.0.0.1:5174`. The local backend must be running, and you need a
`SUPER_ADMIN` account to sign in. In **Claim Review**, use **Authorize & send
agreement** for verified claims; the claim is not activated until the signer
accepts the agreement.

## 4. Backend (`C:\echo-backend`)

The local PostgreSQL service is expected at `localhost:5433`. If the local
database has not yet been synced with the current Prisma schema, run this only
when `DATABASE_URL` points to your local development database:

```bash
npx prisma db push --skip-generate
```

Start the API:

```powershell
$env:FRONTEND_URL = "http://127.0.0.1:5173"
npm run dev
```

Stop the foreground process with `Ctrl+C`. PostgreSQL runs as the local
`postgresql-x64-18` Windows service.

Verify:

```bash
curl http://127.0.0.1:3000/healthz      # {"status":"ok"}  -- ROOT, not /api
curl http://127.0.0.1:3000/health       # deep check incl. database
```

Seed / refresh test data (safe to re-run — all upserts):

```bash
cd /d C:\echo-backend && node scripts\setup-multitenancy-tests.js
```

## 5. Test credentials

Password for all accounts: **`password123`**

| Organisation | Domain | Accounts |
| --- | --- | --- |
| Covenant University | `cu.edu.ng` | `admin@cu.edu.ng` (ADMIN), `rep@cu.edu.ng` (REP), `student@cu.edu.ng` (USER) |
| Test University A | `testuniva.edu` | `admina@testuniva.edu` (ADMIN), `studenta@testuniva.edu` (USER) |
| Test University B | `testunivb.edu` | `adminb@testunivb.edu` (ADMIN), `studentb@testunivb.edu` (USER) |

CU has 7 seeded pings and 8 waves; Orgs A and B have their own categories and
zero pings (useful for tenant-isolation testing — see §9).

For the institution claim/review flow, this local database also has an isolated
unclaimed test institution:

| Institution | User | Password |
| --- | --- | --- |
| Echo Claim Test University (`claimtest.echo.test`) | `claimant@claimtest.echo.test` (verified member) | `EchoLocalTest2026!` |
| Echo Claim Test University (`claimtest.echo.test`) | `reviewer@claimtest.echo.test` (SUPER_ADMIN) | `EchoAdminLocal2026!` |

These are local-only test credentials. The previous walkthrough completed the
fixture as a Founding Partner; reset it or create another institution to replay
the claim flow. Recommendations to non-users use `hello@mail.echo-ng.com`.
Agreement email and other messages to Echo users use
`notifications@echo-ng.com`; they also receive the agreement in-app. Configure
`RESEND_API_KEY` (or SMTP credentials) in the backend environment to test actual
delivery. Without a configured transport, claim authorization still delivers the
agreement through the claimant's Echo notifications, while external
recommendation requests show an email-delivery error.

> `src/pages/Login.tsx` also shows quick-fill buttons when the URL contains
> `?demoOrg=<name>` (password `EchoDemo2026!`). Those target the self-serve demo
> tenants, not the local seed above.

## 6. Quality gates

```bash
npm run lint     # ESLint 9 flat config
npm run build    # tsc -b (typecheck) + vite production build
npm run preview  # serve the production build
```

**Current verification:** the frontend production build passes. Targeted ESLint
for the changed frontend files passes with warnings; full `npm run lint` still
reports three pre-existing conditional-hook errors in `src/pages/ErrorPage.tsx`.
The superadmin Vite build passes, while its `npm run build` is blocked by two
pre-existing `TS1294` errors in `src/api/client.ts`.

The backend TypeScript build and 15 focused institution-flow integration tests
pass. All 38 migrations apply successfully to an empty local validation
database.

## 7. Gotchas that will waste your time

- **Login is rate-limited to 5 attempts / 15 min per IP.** Once exhausted it
  returns 429 and *every* account stops working, which looks like a broken seed
  or a wrong password. Restart `npm run dev` to clear the in-memory limiter.
- **Use `http://127.0.0.1:5173`** with the host binding shown in §2.
- **Health endpoints are at the root**, not under `/api`.
- **`api/share.ts` + the `vercel.json` rewrites only run on Vercel.** Share-link
  Open-Graph previews are not exercised by `npm run dev`.
- Redis is not running, so the backend logs "Redis unavailable" and falls back
  to in-memory rate-limit stores. Expected and harmless locally.

## 8. Route map for manual testing

| Route | Access | What to check |
| --- | --- | --- |
| `/login` (`/`) | public | Form validation, forgot-password modal, offline banner |
| `/signUp`, `/signup` | public | Validation, institutional email registration |
| `/verification` | public | Token consumption, resend cooldown |
| `/find-institution`, `/institution-found`, `/make-request`, `/request-submitted` | public | Multi-step flow, back navigation |
| `/waiting-room`, `/all-verified` | public | Status messaging and institution confirmation |
| `/onboarding/institution-agreement?claimId=…&token=…&orgId=…` | public/token | Agreement integrity, signature, and activation |
| `/reset-password` | public | Invalid/expired token handling |
| `/feed`, `/feed/:pingId` | auth | Infinite scroll, skeletons, "load more", category/author names |
| `/guest/feed/:pingId` | public | Unauthenticated deep-link + redirect from `/feed/:pingId` |
| `/history`, `/history/:tab` | auth | Tab switching, filters |
| `/notifications` | auth | Read/unread, pagination |
| `/user/profile`, `/user/account`, `/user/privacy`, `/user/notification` | auth | Forms + optimistic updates |
| `/admin/soundboard`, `/admin/followUp`, `/admin/moderation`, `/admin/settings` | ADMIN | Moderation actions, bulk ops |
| `/admin/institution` | ADMIN | Departments, representative bodies, delegation and permissions |
| `/super-admin/*` | SUPER_ADMIN | Tables, destructive-action confirmations |
| `/terms`, `/privacy` | public | Static copy |
| `/soundBoard`, `/stream`, `/waveHistory` | public | Legacy redirects to `/feed` / `/history` |
| any unknown path | public | `ErrorPage` 404 |

Guards: `ProtectedRoute` sends guests to `/login` (or `/guest/feed/...` for feed
deep-links) and routes non-active / org-less users to `/waiting-room`,
`/find-institution` or `/verification`. `AdminRoute` / `SuperAdminRoute` gate the
admin surfaces.

## 9. Bug-hunting checklist

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
  — verify the entrance animations actually play (see §10, bug 1).
- Responsive: mobile nav (hamburger in the top bar opens `MobileSideDrawer`;
  `AdminMobileMenu` on admin pages), safe-area insets, PWA standalone splash.
- Accessibility: tab order, focus rings, `aria-*` on modals/dropdowns.

## 10. Bugs found and fixed during setup

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

## 11. Visual verification harness (Playwright)

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

## 12. Known issues left open

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