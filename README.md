# oxykit-mail-web

[![CI](https://github.com/oxykit-dev/oxykit-mail-web/actions/workflows/ci.yml/badge.svg)](https://github.com/oxykit-dev/oxykit-mail-web/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)

Vue 3 + Vite **dashboard** for the [OxyKit](https://oxykit.dev) suite — companion UI for [OxyKit.Mail](https://github.com/oxykit-dev/OxyKit.Mail) (login/setup, dashboard, users, API keys, profile, send-email).

**License:** MIT · **Org:** [oxykit-dev](https://github.com/oxykit-dev) · **Site:** [oxykit.dev](https://oxykit.dev)  
**Related:** [OxyKit.Mail](https://github.com/oxykit-dev/OxyKit.Mail) API (`:5026`)

## Quick start

Requires Node `^20.19.0 || >=22.12.0` and a running Mail API (default `:5026`).

```bash
cp .env.example .env   # optional — defaults already point at localhost:5026
npm install
npm run dev            # http://localhost:5173
```

| Env var | Default | Purpose |
|---------|---------|---------|
| `VITE_BACKEND_URL` | `http://localhost:5026` | Mail API base (client uses `{url}/api/v1`) |
| `VITE_SIGNALR_HUB_URL` | `http://localhost:5026/hubs` | Dashboard hub root |

```bash
npm run build
npm run lint
```

No Vite proxy — the browser talks to Mail directly. CORS on the API must allow the Vite origin (`http://localhost:5173` in Development).

## Known gaps

- No automated frontend tests yet — smoke the API via Mail’s `hoppscotch/` collection.
- DKIM / ops UI is not surfaced (API has Admin helpers).
- Sender role can send email but may get 403 on many dashboard stats.

## Docs

| Doc | Role |
|-----|------|
| [AGENTS.md](./AGENTS.md) | Layout, constraints |
| [oxykit.dev/mail](https://oxykit.dev/mail/) | Mail product docs (API + companion) |
| [src/features/README.md](./src/features/README.md) | Feature modules |
| [docs/SHARED.md](./docs/SHARED.md) | Shared composables / UI |
| [LICENSE](./LICENSE) | MIT |
