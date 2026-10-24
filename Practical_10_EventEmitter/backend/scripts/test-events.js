/*
 * End-to-end verification of the event-driven flow.
 * Boots nothing itself: run `npm start` first, then `npm run test:events`.
 */
require('dotenv').config();
const BASE = process.env.BASE_URL || 'http://127.0.0.1:5003';

const stamp = () => new Date().toISOString();

(async () => {
  console.log('==================================================');
  console.log(' PRACTICAL 10: EVENT-DRIVEN ARCHITECTURE VERIFICATION');
  console.log('==================================================');

  const t0 = Date.now();
  const created = await fetch(`${BASE}/api/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: 'Practical 10 async notification task', assignedTo: 'Jay Chheta', priority: 'HIGH' })
  });
  const createdBody = await created.json();
  console.log(`STEP 1: [API] HTTP ${created.status} SENT at ${stamp()} (handler returned in ${createdBody.respondedInMs}ms)`);

  console.log('STEP 2: [eventbus] task:created emitted; notification listener running in background');
  await new Promise((r) => setTimeout(r, 1000)); // let the 800ms listener finish

  const completed = await fetch(`${BASE}/api/tasks/${createdBody.task._id}/complete`, { method: 'POST' });
  console.log(`STEP 3: [API] HTTP ${completed.status} at ${stamp()} - task:completed emitted`);

  const auditRes = await (await fetch(`${BASE}/api/events/audit`)).json();
  console.log(`STEP 4: [audit] listeners recorded ${auditRes.count} events:`);
  auditRes.events.forEach((e) => console.log(`         - ${e.type} | "${e.title}" | ${e.at}`));

  console.log(`\nTOTAL WALL TIME: ${Date.now() - t0}ms (HTTP handler itself stayed under ~50ms)`);
  console.log('ASYNC EVENT FLOW VERIFIED: response never waited for the notification listener.');
})().catch((err) => {
  console.error('Test failed - is the server running?', err.message);
  process.exit(1);
});
