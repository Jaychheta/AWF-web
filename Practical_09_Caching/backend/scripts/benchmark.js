/*
 * Latency benchmark: uncached MongoDB query vs node-cache HIT.
 * Three comparative trials against the live server (npm start first).
 */
require('dotenv').config();

const BASE = process.env.BASE_URL || 'http://127.0.0.1:5002';

async function timedGet(path) {
  const started = process.hrtime.bigint();
  const res = await fetch(BASE + path);
  const body = await res.json();
  const ms = Number(process.hrtime.bigint() - started) / 1e6;
  return { ms, fromCache: res.headers.get('x-cache') === 'HIT', body };
}

function row(trial, uncached, cached) {
  const delta = (cached.ms - uncached.ms).toFixed(2);
  console.log(
    `Trial ${trial}   uncached ${uncached.ms.toFixed(2).padStart(6)} ms   ` +
      `cached ${cached.ms.toFixed(2).padStart(6)} ms   delta ${delta} ms   ` +
      (cached.fromCache ? '[CACHE HIT]' : '[cache miss!]')
  );
}

(async () => {
  // Warm the cache once so trials 1..3 all observe a HIT.
  await timedGet('/api/tasks');

  console.log('[BENCHMARK] Uncached MongoDB query vs node-cache HIT\n');
  const results = [];
  for (let trial = 1; trial <= 3; trial += 1) {
    const uncached = await timedGet('/api/tasks?nocache=1');
    const cached = await timedGet('/api/tasks');
    row(trial, uncached, cached);
    results.push([uncached.ms, cached.ms]);
  }

  const avg = (xs) => xs.reduce((a, b) => a + b, 0) / xs.length;
  const u = avg(results.map((r) => r[0]));
  const c = avg(results.map((r) => r[1]));
  console.log(
    `\nAverage      uncached ${u.toFixed(2)} ms   cached ${c.toFixed(2)} ms   ` +
      `${(((u - c) / u) * 100).toFixed(2)}% faster from cache`
  );

  const stats = await (await fetch(`${BASE}/api/debug/cache-stats`)).json();
  console.log('\nGET /api/debug/cache-stats:');
  console.log(JSON.stringify(stats.stats, null, 2));
})().catch((err) => {
  console.error('Benchmark failed - is the server running?', err.message);
  process.exit(1);
});
