require('dotenv').config();
const app = require('./app');
const { connectDB } = require('./config/db');

const PORT = process.env.PORT || 5001;

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`[server] Practical 7 API listening on http://127.0.0.1:${PORT}`));
  })
  .catch((err) => {
    console.error('[server] Could not start:', err.message);
    process.exit(1);
  });
