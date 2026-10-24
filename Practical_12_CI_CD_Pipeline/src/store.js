// Deliberately dependency-free in-memory store so the CI job needs no
// external services (no MongoDB container) to run the test suite.
let tasks = [];
let seq = 1;

function reset() {
  tasks = [];
  seq = 1;
}

function list() {
  return tasks.slice();
}

function add({ title }) {
  const task = { id: seq++, title: String(title).trim(), done: false, createdAt: new Date().toISOString() };
  tasks.push(task);
  return task;
}

function stats() {
  return { total: tasks.length, done: tasks.filter((t) => t.done).length };
}

module.exports = { reset, list, add, stats };
