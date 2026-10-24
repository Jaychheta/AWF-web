const express = require('express');
const { createTask, completeTask, audit } = require('./controllers/taskController');

const app = express();
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ success: true, service: 'practical-10' }));
app.post('/api/tasks', createTask);
app.post('/api/tasks/:id/complete', completeTask);
app.get('/api/events/audit', audit);

app.use((req, res) => res.status(404).json({ success: false, error: 'Route not found' }));
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

module.exports = app;
