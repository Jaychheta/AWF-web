const { EventEmitter } = require('node:events');

/**
 * Application event bus built on the native Node.js EventEmitter.
 * Listeners run outside the request/response cycle: the HTTP handler only
 * emits an event and returns immediately, so heavy work (notifications,
 * audit trails) never blocks the client response.
 */
class AppEventBus extends EventEmitter {
  constructor() {
    super();
    // Several listeners per event is the whole point of the practical.
    this.setMaxListeners(10);
  }

  emitTaskCreated(task) {
    return this.emit('task:created', { task, at: new Date().toISOString() });
  }

  emitTaskCompleted(task) {
    return this.emit('task:completed', { task, at: new Date().toISOString() });
  }
}

const eventBus = new AppEventBus();

module.exports = { eventBus, EVENTS: { TASK_CREATED: 'task:created', TASK_COMPLETED: 'task:completed' } };
