const Task = require('../models/Task');

/** POST /api/tasks (protected) */
async function createTask(req, res, next) {
  try {
    const { title, description } = req.body;
    const task = await Task.create({
      title: title.trim(),
      description: (description || '').trim(),
      owner: req.user.id
    });
    return res.status(201).json({ success: true, task });
  } catch (err) {
    return next(err);
  }
}

/** GET /api/tasks (protected) - only the caller's own tasks */
async function listTasks(req, res, next) {
  try {
    const tasks = await Task.find({ owner: req.user.id }).sort({ createdAt: -1 });
    return res.json({ success: true, count: tasks.length, tasks });
  } catch (err) {
    return next(err);
  }
}

module.exports = { createTask, listTasks };
