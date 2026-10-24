const { cache } = require('../cache');

/** GET /api/debug/cache-stats - live hit/miss telemetry of the cache */
function cacheStats(req, res) {
  const s = cache.getStats();
  const hitRate = s.hits + s.misses > 0 ? ((s.hits / (s.hits + s.misses)) * 100).toFixed(2) + '%' : 'n/a';
  return res.json({
    success: true,
    stats: {
      cacheEnabled: true,
      ttlSeconds: Number(process.env.CACHE_TTL_SECONDS || 60),
      cacheHits: s.hits,
      cacheMisses: s.misses,
      hitRate,
      keys: cache.keys(),
      keyCount: cache.getStats().keys
    }
  });
}

module.exports = { cacheStats };
