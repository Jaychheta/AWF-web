# Practical 11 — Multi-Container Orchestration with Docker Compose

Three services on one compose network:

| Service | Image / build | Port (host) | Role |
|---|---|---|---|
| `mongodb` | `mongo:6` + healthcheck | – | persistent store (named volume `mongo-data`) |
| `backend` | multi-stage `node:20-alpine` | 5004 | Express API, waits for mongo to be *healthy* |
| `frontend` | multi-stage build → `nginx:alpine` | 5173 | serves pre-built React bundle, proxies `/api` to `backend` |

## Run it
```bash
docker compose up --build -d
docker compose ps                 # all three services Up
curl http://127.0.0.1:5004/api/health
curl http://127.0.0.1:5173/       # SPA served by nginx
docker compose down               # add -v to also drop the volume
```

## What this demonstrates
- **Bridge network + internal DNS**: nginx reaches the API with `proxy_pass http://backend:5004`;
  the backend reaches Mongo with `mongodb://mongodb:27017` — container names, not IPs.
- **Health-gated startup**: `depends_on: { mongodb: { condition: service_healthy } }` plus a
  retry loop in the backend means no crash loops on cold start.
- **Volume persistence**: `mongo-data` survives `docker compose down` (but not `down -v`).
- **Multi-stage images**: the frontend image contains nginx + static assets only (no node_modules,
  no source), cutting the final footprint dramatically; the backend image ships production deps only.
