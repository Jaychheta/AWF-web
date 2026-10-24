/*
 * DELIBERATE FAILURE DEMO - not part of `npm test`.
 * Run `npm run test:fail-demo` locally to reproduce a red pipeline run
 * (the same assertion failing in GitHub Actions turns the job red).
 */
const request = require('supertest');
const app = require('../src/app');

test('Deliberately broken assertion: GET / returns 999', async () => {
  const res = await request(app).get('/');
  const expected = 999;
  const received = res.status;
  expect(received).toBe(expected); // fails on purpose: 200 !== 999
});
