# Practical 12 — GitHub Actions CI/CD Pipeline (Pass vs Fail demonstration)

A dependency-light Express API with a Jest + Supertest suite, ESLint linting and a GitHub
Actions workflow that runs **lint → test → gate** on every push and pull request.

## Local verification
```bash
npm install
npm run lint          # 0 errors
npm test              # 7 passing specs (tests/api.test.js)
npm run test:fail-demo # failure-demo/broken.test.js -> red on purpose (200 !== 999)
```

## The pipeline
`.github/workflows/ci.yml` defines three jobs:
1. **Lint** – `npm ci` + `npm run lint`
2. **Test** – `npm ci` + `npm test -- --ci --verbose`
3. **Pipeline gate** – runs only if both previous jobs are green (`needs: [lint, test]`)

### Pass vs fail demonstration
- Push any commit → both jobs green → gate prints “pipeline is green ✅”.
- To reproduce a red run exactly as in the report, temporarily change an assertion
  (or run `npm run test:fail-demo` locally): the job stops at the test step, isolating the
  failing assertion line before any later stage runs.

## Key implementation notes
- `src/store.js` – in-memory store, so CI needs **no** database service container.
- `tests/api.test.js` – 7 specs covering health, CRUD, validation (400), content-type (415) and 404.
- `failure-demo/broken.test.js` – excluded from `npm test` via jest `testMatch`, kept for the deliberate-failure demo.

> **Note:** GitHub only executes workflows located at the *repository root*
> (`.github/workflows/`). The live pipeline therefore runs from
> `/.github/workflows/ci.yml`, which is an identical copy of the reference file kept
> inside this practical folder (`./.github/workflows/ci.yml`).
