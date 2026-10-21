# oxykit-mail-web — agent guide

Token-efficient map. Prefer this over the boilerplate README or archived migration docs.

## What it is

**Frontend companion** for **OxyKit.Mail** (OxyKit suite core) — not one of the three org cores itself. **MIT** companion SPA: login/setup, dashboard (REST + SignalR), users, API keys, profile, send-email FAB. Backend is sibling **`../OxyKit.Mail`** (or [OxyKit.Mail](https://github.com/oxykit-dev/OxyKit.Mail)) on port **5026**.

## Open these files first

| Task | Read first |
|------|------------|
| Bootstrap | `src/main.ts`, `src/App.vue` |
| Routes | `src/router/index.ts` |
| Axios client / errors | `src/api/client.ts`, `src/shared/errors/ApiError.ts` |
| Base URL / SignalR config | `src/shared/config/index.ts` |
| Auth store + login API | `src/features/identity/stores/auth.ts`, `src/features/identity/api/auth.ts` |
| Feature module rules | `src/features/README.md` |
| UI/async patterns | `docs/SHARED.md`, `src/shared/index.ts` |
| Dashboard + SignalR | `src/features/dashboard/` |
| Send email | `src/features/email/api/email.ts`, `components/SendEmailForm.vue` |
| Users / API keys | `src/features/users/`, `src/features/apikeys/` |
| OpenAPI snapshot | `oxykit-mail-api.json` (do not dump whole file into chat) |
| Env | `.env.example` |

Ignore `dist/`, `node_modules/`. Docs stay lean (`AGENTS.md`, `features/README.md`, `docs/SHARED.md`).

## Known gaps

| Item | Notes |
|------|-------|
| Sender ∩ dashboard | Sender can send but gets 403 on most dashboard stats — decide Mail roles vs UI hide |
| No frontend tests | Prefer thin tests on auth interceptor + one feature API |
| OpenAPI snapshot | Regenerate from Mail Dev `GET /openapi/v1.json` after backend contract changes |
| No DKIM / ops UI | API has Admin DKIM helpers; web does not surface them |

## Layout

Suite SPA pattern: Vite `src/` with `features/` + `shared/` (+ `api/`, `router/`, `plugins/`).

```text
src/
  api/client.ts              shared Axios (+ legacy re-export shims)
  features/
    identity/                auth store, login/home
    dashboard/               analytics + SignalR
    email/                   send form + API
    users/                   users + profile
    apikeys/
  shared/                    composables, UI primitives, config, errors, styles
  router/, plugins/vuetify.ts
```

Path alias: `@` → `src/`.

## How it talks to the API

- `VITE_BACKEND_URL` → client base `{url}/api/v1` (default `http://localhost:5026`)
- Auth: Bearer JWT on `api` defaults; refresh/revoke; `device_id` in localStorage
- `withCredentials: true`; CORS must allow Vite origin (API allows `http://localhost:5173`)
- SignalR: `{VITE_SIGNALR_HUB_URL}/dashboard` (default hubs at `http://localhost:5026/hubs`)
- No Vite proxy — browser hits backend directly
- OpenAPI paths in `oxykit-mail-api.json` omit `/api/v1` prefix; frontend prepends it

## Add a page / API call (checklist)

1. Feature under `src/features/<name>/` (`api/`, `views/`, optional `components/`, `composables/`, `stores/`, `index.ts`)
2. API module: `import { api } from '@/api/client'`; paths relative to `/api/v1`
3. Align types with `oxykit-mail-api.json` / Mail Scalar (`/scalar`)
4. Export public surface from `features/<name>/index.ts`
5. Lazy route in `src/router/index.ts`
6. Views: Vuetify 3 + `useAsyncOperation` / `useFormValidation` from `@/shared`
7. Catch typed errors from interceptor (`UnauthorizedError`, `ValidationError`, …)
8. Gate admin UI with roles (e.g. `auth.user?.roles?.includes('Admin')`) like navbar
9. No cross-feature deep imports — use barrels or move to `shared/`

## Hard constraints

- Strict TypeScript (`noUnusedLocals`, `noUncheckedIndexedAccess`, etc.)
- Router `beforeEach`: `meta.requiresAuth` / `meta.roles` (e.g. Admin on `/users`)
- Prefer `@/features/...` and `@/shared`; Axios only via `@/api/client`
- Do not commit secrets; only `VITE_*` env vars reach the client
- Backend contract changes belong in `../OxyKit.Mail`, then update OpenAPI snapshot / feature APIs here

## Tests

None yet. Prefer thin tests on auth interceptor + one feature API when added. Until then, smoke Mail via `../OxyKit.Mail/hoppscotch/` (**OxyKit.Mail Local**).

## Commands

```bash
cd oxykit-mail-web
npm install
npm run dev          # Vite; typically http://localhost:5173
npm run build        # type-check + vite build
npm run lint
npm run format
```

Node: `^20.19.0 || >=22.12.0`.

## Docs policy for agents

- Use this file + `src/features/README.md` + `docs/SHARED.md`.
- Backend work → `../OxyKit.Mail/AGENTS.md`.
- Suite map: `../AGENTS.md`.
