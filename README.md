# oxykit-mail-web

Vue 3 + Vite SPA for **[OxyKit.Mail](https://github.com/oxykit-dev/OxyKit.Mail)** — login/setup, dashboard (REST + SignalR), users, API keys, profile, send-email.

**License:** MIT · **Org:** [oxykit-dev](https://github.com/oxykit-dev) · **Site:** [oxykit.dev](https://oxykit.dev)

## Setup

Requires Node `^20.19.0 || >=22.12.0` and a running Mail API (default `:5026`).

```sh
cp .env.example .env   # optional — defaults already point at localhost:5026
npm install
npm run dev            # http://localhost:5173
npm run build
npm run lint
```

| Env var | Default | Purpose |
|---------|---------|---------|
| `VITE_BACKEND_URL` | `http://localhost:5026` | Mail API base (client uses `{url}/api/v1`) |
| `VITE_SIGNALR_HUB_URL` | `http://localhost:5026/hubs` | Dashboard hub root |

No Vite proxy — the browser talks to Mail directly. CORS on the API must allow the Vite origin (`http://localhost:5173` in Development).

## Known gaps

- No automated frontend tests yet — smoke the API via Mail’s `hoppscotch/` collection.
- DKIM / ops UI is not surfaced (API has Admin helpers).
- Sender role can send email but may get 403 on many dashboard stats.

## Docs

| Doc | Use |
|-----|-----|
| [AGENTS.md](AGENTS.md) | Agent orientation |
| [src/features/README.md](src/features/README.md) | Feature modules |
| [docs/SHARED.md](docs/SHARED.md) | Shared composables / UI |
| [LICENSE](./LICENSE) | MIT |
