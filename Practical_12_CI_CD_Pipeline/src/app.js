const express = require('express');
const store = require('./store');

const app = express();
app.use(express.json());

app.get('/', (req, res) => res.json({ service: 'practical-12', status: 'ok', uptime: process.uptime() }));

app.get('/api/tasks', (req, res) => res.json({ success: true, tasks: store.list() }));

// Reject payloads that are not JSON before any parsing/validation happens.
function requireJson(req, res, next) {
  if (!req.is('json')) {
    return res.status(415).json({ success: false, error: 'Unsupported Media Type', message: 'Only application/json payloads are accepted' });
  }
  return next();
}

app.post('/api/tasks', requireJson, (req, res) => {
  const { title } = req.body || {};
  if (typeof title !== 'string' || title.trim().length < 3) {
    return res.status(400).json({ success: false, error: 'Validation Error', message: 'title must be at least 3 characters' });
  }
  return res.status(201).json({ success: true, task: store.add({ title }) });
});

app.get('/api/debug/cache-stats', (req, res) => res.json({ success: true, stats: store.stats() }));

app.use((req, res) => res.status(404).json({ success: false, error: `No route matches ${req.method} ${req.path}` }));

module.exports = app;
