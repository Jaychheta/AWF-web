const express = require('express');
const { cacheResponse } = require('./middleware/cache');
const { KEY_TASKS_ALL } = require('./cache');
const taskController = require('./controllers/taskController');
const { cacheStats } = require('./controllers/debugController');

const app = express();
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ success: true, service: 'practical-09' }));
app.get('/api/tasks', cacheResponse(KEY_TASKS_ALL), taskController.listTasks);
app.post('/api/tasks', taskController.createTask);
app.patch('/api/tasks/:id', taskController.updateTask);
app.get('/api/debug/cache-stats', cacheStats);

app.use((req, res) => res.status(404).json({ success: false, error: 'Route not found' }));
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

module.exports = app;
