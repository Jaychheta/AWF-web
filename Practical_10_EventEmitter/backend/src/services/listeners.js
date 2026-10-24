const { eventBus, EVENTS } = require('./eventBus');

const auditLog = [];

/** Simulated notification channel: deliberately slow (async) work. */
async function notificationListener({ task, at }) {
  const started = Date.now();
  console.log(`[notification] STARTED for task "${task.title}" at ${at}`);
  await new Promise((resolve) => setTimeout(resolve, 800)); // e-mail/SMS gateway latency
  console.log(`[notification] COMPLETED after ${Date.now() - started}ms of background work`);
}

/** Synchronous audit trail kept in memory for inspection. */
function auditListener({ task, at }) {
  auditLog.push({ eventId: auditLog.length + 1, type: EVENTS.TASK_CREATED, taskId: task._id.toString(), title: task.title, at });
  console.log(`[audit] recorded event #${auditLog.length} (task:created)`);
}

function completionListener({ task, at }) {
  auditLog.push({ eventId: auditLog.length + 1, type: EVENTS.TASK_COMPLETED, taskId: task._id.toString(), title: task.title, at });
  console.log(`[audit] recorded event #${auditLog.length} (task:completed)`);
}

function registerListeners() {
  eventBus.on(EVENTS.TASK_CREATED, notificationListener);
  eventBus.on(EVENTS.TASK_CREATED, auditListener);
  eventBus.on(EVENTS.TASK_COMPLETED, completionListener);
  console.log(`[eventbus] ${eventBus.eventNames().length} event types wired, non-blocking dispatch active`);
}

module.exports = { registerListeners, auditLog };
