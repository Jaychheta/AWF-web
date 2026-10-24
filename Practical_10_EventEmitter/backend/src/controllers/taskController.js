const Task = require('../models/Task');
const { eventBus } = require('../services/eventBus');

/**
 * POST /api/tasks
 * Persists the task, emits "task:created" and responds immediately.
 * The response time therefore does NOT include notification work.
 */
async function createTask(req, res, next) {
  try {
    const task = await Task.create(req.body);
    const respondedAt = Date.now();
    eventBus.emitTaskCreated(task);
    return res.status(201).json({
      success: true,
      message: 'Task created; task:created event dispatched to listeners',
      respondedInMs: Date.now() - respondedAt,
      task
    });
  } catch (err) {
    return next(err);
  }
}

/** POST /api/tasks/:id/complete - emits "task:completed" */
async function completeTask(req, res, next) {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, { status: 'completed' }, { new: true });
    if (!task) return res.status(404).json({ success: false, error: 'Task not found' });
    eventBus.emitTaskCompleted(task);
    return res.json({ success: true, message: 'Task completed; task:completed event dispatched', task });
  } catch (err) {
    return next(err);
  }
}

/** GET /api/events/audit - inspect what the listeners recorded */
function audit(req, res, next) {
  try {
    const { auditLog } = require('../services/listeners');
    return res.json({ success: true, count: auditLog.length, events: auditLog });
  } catch (err) {
    return next(err);
  }
}

module.exports = { createTask, completeTask, audit };
