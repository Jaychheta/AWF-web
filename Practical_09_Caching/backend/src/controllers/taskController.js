const Task = require('../models/Task');
const { KEY_TASKS_ALL } = require('../cache');
const { invalidate } = require('../middleware/cache');

/** GET /api/tasks - served from node-cache on a HIT */
async function listTasks(req, res, next) {
  try {
    const tasks = await Task.find().sort({ priority: -1, createdAt: -1 }).lean();
    return res.json({ success: true, source: 'mongodb', count: tasks.length, tasks });
  } catch (err) {
    return next(err);
  }
}

/** POST /api/tasks - invalidates the cached collection */
async function createTask(req, res, next) {
  try {
    const task = await Task.create(req.body);
    invalidate(KEY_TASKS_ALL);
    return res.status(201).json({ success: true, task });
  } catch (err) {
    return next(err);
  }
}

/** PATCH /api/tasks/:id - invalidates the cached collection */
async function updateTask(req, res, next) {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!task) return res.status(404).json({ success: false, error: 'Task not found' });
    invalidate(KEY_TASKS_ALL);
    return res.json({ success: true, task });
  } catch (err) {
    return next(err);
  }
}

module.exports = { listTasks, createTask, updateTask };
