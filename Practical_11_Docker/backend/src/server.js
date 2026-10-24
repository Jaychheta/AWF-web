const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

const taskSchema = new mongoose.Schema({ title: String, done: { type: Boolean, default: false } }, { timestamps: true });
const Task = mongoose.model('Task', taskSchema);

app.get('/api/health', (req, res) => res.json({ service: 'backend', container: process.env.HOSTNAME, ok: true }));
app.get('/api/tasks', async (req, res) => res.json({ tasks: await Task.find().sort({ createdAt: -1 }) }));
app.post('/api/tasks', async (req, res) => res.status(201).json({ task: await Task.create(req.body) }));

const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongodb:27017/awdf_docker';

async function boot(retries = 10) {
  for (let attempt = 1; attempt <= retries; attempt += 1) {
    try {
      await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 3000 });
      return app.listen(5004, () => console.log('[backend] listening on 5004'));
    } catch (err) {
      console.log(`[backend] mongo not ready (attempt ${attempt}/${retries})...`);
      await new Promise((r) => setTimeout(r, 2000));
    }
  }
  process.exit(1);
}
boot();
