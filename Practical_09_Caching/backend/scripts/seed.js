require('dotenv').config();
const mongoose = require('mongoose');
const Task = require('../src/models/Task');

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await Task.deleteMany({});
  await Task.insertMany([
    { title: 'Write caching middleware', priority: 5 },
    { title: 'Benchmark Mongo vs node-cache', priority: 4 },
    { title: 'Document TTL strategy', priority: 3 }
  ]);
  console.log('[seed] 3 tasks inserted');
  await mongoose.disconnect();
})();
