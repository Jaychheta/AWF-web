const app = require('./app');

const PORT = process.env.PORT || 5005;
app.listen(PORT, () => console.log(`[server] Practical 12 API on http://127.0.0.1:${PORT}`));
