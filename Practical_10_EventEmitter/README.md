# Practical 10 — Native Node.js EventEmitter (Non-Blocking Dispatch)

The task API publishes domain events on a native `EventEmitter` bus. Two listeners subscribe to
`task:created` (a slow simulated notification gateway + an audit trail) and one to
`task:completed`. Because dispatch is non-blocking, the HTTP response returns immediately while
the heavy listener keeps running in the background.

## Run it
```bash
cp .env.example .env
npm install
npm start              # API on http://127.0.0.1:5003
npm run test:events    # stepped verification of the async flow
```

## Observing non-blocking behaviour
- `POST /api/tasks` responds in a few milliseconds (`respondedInMs` in the body),
  while the server log shows `[notification] COMPLETED after ~800ms` **after** the response.
- `GET /api/events/audit` proves both listeners observed every event.

## Key implementation notes
- `src/services/eventBus.js` – `AppEventBus extends EventEmitter` with typed emit helpers.
- `src/services/listeners.js` – async notification listener + synchronous audit listener on the same event.
- `src/controllers/taskController.js` – emits after persisting, before/without awaiting listeners.
