const NodeCache = require('node-cache');

// stdTTL comes from the environment (default 60 s). checkperiod 0 disables
// the periodic sweep so entries live exactly their TTL.
const cache = new NodeCache({
  stdTTL: Number(process.env.CACHE_TTL_SECONDS || 60),
  checkperiod: 0,
  useClones: true
});

const KEY_TASKS_ALL = 'tasks:all';

module.exports = { cache, KEY_TASKS_ALL };
