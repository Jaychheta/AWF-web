# AWF-web — Advanced Web Framework (ITUE301) Practicals 7–12

Coursework repository for **Advanced Web Framework**, Semester 5 (2026-27).
Six self-contained practicals, each with runnable code, a verification script and a README.

| # | Practical | Focus | Verify with |
|---|---|---|---|
| 07 | `Practical_07_JWT_Authentication` | bcrypt hashing, JWT issue/verify, protected routes, server-side validation | `npm run test:pipeline` (backend) |
| 08 | `Practical_08_Lazy_Loading` | `React.lazy()` route splitting, `<Suspense>` fallback, Vite chunking | `npm run measure` |
| 09 | `Practical_09_Caching` | `node-cache` TTL cache, hit/miss telemetry, write-invalidation | `npm run benchmark` |
| 10 | `Practical_10_EventEmitter` | native `EventEmitter` bus, non-blocking listeners | `npm run test:events` |
| 11 | `Practical_11_Docker` | compose orchestration, healthchecks, multi-stage images, bridge DNS | `docker compose up --build` |
| 12 | `Practical_12_CI_CD_Pipeline` | GitHub Actions lint+test gate, deliberate failure demo | `npm test`, see Actions tab |

## Prerequisites
- Node.js 20+, npm 10+
- MongoDB 6+ locally (`mongod` or `docker run -d -p 27017:27017 mongo:6`) for practicals 07, 09, 10
- Docker + Compose for practical 11

## Quick start (per practical)
```bash
cd Practical_07_JWT_Authentication/backend
cp .env.example .env && npm install && npm start
```
Every practical folder has its own `README.md` with run + verification steps.

## Repository layout
```
Practical_07_JWT_Authentication/   backend/ (Express+Mongo)  frontend/ (React+Vite)
Practical_08_Lazy_Loading/         frontend/ (React+Vite, route-level chunks)
Practical_09_Caching/              backend/ (Express+Mongo+node-cache)
Practical_10_EventEmitter/         backend/ (Express+Mongo+EventEmitter)
Practical_11_Docker/               backend/ frontend/ docker-compose.yml
Practical_12_CI_CD_Pipeline/       src/ tests/ failure-demo/ .github/workflows/ci.yml
```
