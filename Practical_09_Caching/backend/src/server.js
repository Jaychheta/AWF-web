require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');

const PORT = process.env.PORT || 5002;

mongoose
  .connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 })
  .then(() => app.listen(PORT, () => console.log(`[server] Practical 9 API on http://127.0.0.1:${PORT}`)))
  .catch((err) => {
    console.error('[server] MongoDB not reachable:', err.message);
    process.exit(1);
  });
