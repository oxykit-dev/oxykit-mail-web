# Features

Vertical slices aligned with OxyKit.Mail. Layout is current — not a migration backlog.

```text
features/<name>/
  api/           HTTP against /api/v1
  views/         route roots
  components/    feature-only UI (optional)
  composables/   feature-only (optional)
  stores/        feature-only (optional)
  index.ts       public barrel
```

| Feature | Routes | Owns |
|---------|--------|------|
| `identity` | `/` | login, bootstrap admin, auth store, logoff |
| `dashboard` | `/dashboard` | stats, charts, SignalR live updates |
| `email` | (FAB in `App.vue`) | send-email form + API |
| `users` | `/users`, `/profile` | user CRUD, roles, avatars, profile |
| `apikeys` | `/apikeys` | API key list / create / revoke / regenerate |

## Rules

- Import other features only via their `index.ts` (or move shared code to `src/shared/`)
- API modules: `import { api } from '@/api/client'`
- Prefer `@/features/...` and relative `../api` inside a feature; Axios via `@/api/client` only
- Gate admin UI with roles (navbar + route `meta.roles`)

Agent map: [`../../AGENTS.md`](../../AGENTS.md). Shared helpers: [`../../docs/SHARED.md`](../../docs/SHARED.md).
