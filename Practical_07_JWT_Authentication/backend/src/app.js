const express = require('express');
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

const app = express();
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ success: true, service: 'practical-07', uptime: process.uptime() }));
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

app.use((req, res) => res.status(404).json({ success: false, error: 'Route not found' }));

// Central error handler: mongoose validation errors become HTTP 400.
app.use((err, req, res, next) => {
  if (err.name === 'ValidationError') {
    const details = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ success: false, error: 'Validation Error', details });
  }
  console.error(err);
  return res.status(500).json({ success: false, error: 'Internal server error' });
});

module.exports = app;
