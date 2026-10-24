# Practical 9 — In-Memory Caching with `node-cache`

Adds a TTL-based response cache in front of the MongoDB read path. A cache HIT answers the
request without touching the database; every mutation invalidates the cached collection so
subsequent reads are never stale.

## Run it
```bash
# MongoDB running, then:
cp .env.example .env
npm install
npm run seed        # inserts 3 demo tasks
npm start           # API on http://127.0.0.1:5002
npm run benchmark   # 3 trials: uncached Mongo vs cache HIT + hit-rate telemetry
```

## Endpoints
| Route | Behaviour |
|---|---|
| `GET /api/tasks` | `X-Cache: MISS` first time, `X-Cache: HIT` afterwards (Mongo skipped) |
| `GET /api/tasks?nocache=1` | bypasses the cache (used by the benchmark) |
| `POST /api/tasks`, `PATCH /api/tasks/:id` | mutate Mongo **and** invalidate `tasks:all` |
| `GET /api/debug/cache-stats` | hits, misses, hit rate, live keys |

## Key implementation notes
- `src/cache/index.js` – single `NodeCache` instance, `stdTTL` from env (default 60 s).
- `src/middleware/cache.js` – wraps `res.json` so only successful responses are cached.
- Invalidation on write guarantees zero stale reads after `POST`/`PATCH`.
