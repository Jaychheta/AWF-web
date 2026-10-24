const mongoose = require('mongoose');

/**
 * Opens the MongoDB connection used by every route in this practical.
 * The URI comes from the environment so the same code runs locally,
 * in Docker (Practical 11) and in CI (Practical 12).
 */
async function connectDB(uri = process.env.MONGO_URI) {
  if (!uri) {
    throw new Error('MONGO_URI is not set. Copy .env.example to .env first.');
  }
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
  return mongoose.connection;
}

module.exports = { connectDB };
