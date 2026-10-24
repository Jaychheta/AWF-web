const { cache } = require('../cache');

/**
 * Response cache for idempotent GET routes.
 * A hit short-circuits the request: MongoDB is never queried.
 * Append ?nocache=1 to bypass both read and write of the cache (used by
 * the benchmark script to measure the uncached MongoDB path).
 */
function cacheResponse(key) {
  return (req, res, next) => {
    if (req.query.nocache === '1') return next();

    const hit = cache.get(key);
    if (hit) {
      res.set('X-Cache', 'HIT');
      return res.json(hit);
    }

    res.set('X-Cache', 'MISS');
    const originalJson = res.json.bind(res);
    res.json = (body) => {
      if (res.statusCode === 200) cache.set(key, body);
      return originalJson(body);
    };
    return next();
  };
}

/** Drops cached collections after any mutation so reads never go stale. */
function invalidate(key) {
  cache.del(key);
}

module.exports = { cacheResponse, invalidate };
