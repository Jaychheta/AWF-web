const request = require('supertest');
const app = require('../src/app');
const store = require('../src/store');

beforeEach(() => store.reset());

describe('Practical 12: CI/CD pipeline test suite', () => {
  test('GET / (root health check) returns status ok', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  test('GET /api/tasks returns an empty list initially', async () => {
    const res = await request(app).get('/api/tasks');
    expect(res.status).toBe(200);
    expect(res.body.tasks).toEqual([]);
  });

  test('POST /api/tasks creates a task', async () => {
    const res = await request(app).post('/api/tasks').send({ title: 'Wire the CI pipeline' });
    expect(res.status).toBe(201);
    expect(res.body.task.title).toBe('Wire the CI pipeline');
  });

  test('GET /api/tasks returns the created task', async () => {
    await request(app).post('/api/tasks').send({ title: 'First' });
    const res = await request(app).get('/api/tasks');
    expect(res.body.tasks).toHaveLength(1);
    expect(res.body.tasks[0].title).toBe('First');
  });

  test('POST /api/tasks rejects a missing title with 400', async () => {
    const res = await request(app).post('/api/tasks').send({ description: 'no title' });
    expect(res.status).toBe(400);
  });

  test('POST /api/tasks rejects non-JSON payloads with 415', async () => {
    const res = await request(app).post('/api/tasks').set('Content-Type', 'text/plain').send('title=hello');
    expect(res.status).toBe(415);
  });

  test('GET /invalid-route returns 404 for an unknown route', async () => {
    const res = await request(app).get('/invalid-route');
    expect(res.status).toBe(404);
  });
});
