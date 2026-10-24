# Practical 8 — Lazy Loading & Route-Based Code Splitting

A React + Vite SPA where every route (`/projects`, `/tasks`, `/contact`, 404) is loaded with
`React.lazy()` + dynamic `import()`, wrapped in a `<Suspense>` boundary that renders an animated
`RouteFallback` spinner. The first paint therefore downloads only the entry chunk plus the shared
vendor chunk; route chunks arrive strictly on demand.

## Run it
```bash
npm install
npm run dev        # http://127.0.0.1:5173
```

## Measure the splitting
```bash
npm run measure    # vite build + raw/gzip size table for every emitted chunk
```
Expected shape of the output: one `vendor-*.js` chunk (react + router), one small `index-*.js`
entry chunk, and one tiny chunk per page (`Home`, `Projects`, `Tasks`, `Contact`, `NotFound`).

## Verify in the browser
1. DevTools → Network → JS filter, tick “Disable cache”.
2. Load `/` → only `index` + `vendor` are fetched.
3. Click *Tasks* → exactly one extra chunk (the Tasks route) streams in while the spinner shows.
4. Reload on `/tasks` → the Tasks chunk is requested first (route-driven loading).

## Key implementation notes
- `src/App.jsx` – `lazy(() => import('./pages/X.jsx'))` per route inside one `<Suspense>`.
- `src/components/RouteFallback.jsx` – spinner fallback, prevents layout shift while streaming.
- `vite.config.js` – `manualChunks` pins react/react-dom/react-router into a cacheable vendor chunk.
