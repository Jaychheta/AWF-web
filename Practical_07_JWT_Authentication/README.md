# Practical 7 — Authentication and Middleware Pipeline

User registration + login for a Task Management app, with **bcrypt** password hashing,
**JWT** issuance on login and an **authentication middleware** that protects every task route.
Server-side validation rejects malformed payloads before they reach MongoDB.

## Structure
```
backend/   Express + Mongoose API (port 5001)
frontend/  React + Vite SPA (port 5173, proxies /api to the backend)
```

## Run it
```bash
# 0. MongoDB must be running, e.g.:  docker run -d -p 27017:27017 mongo:6
cd backend
cp .env.example .env          # then edit JWT_SECRET
npm install
npm start                     # API on http://127.0.0.1:5001

cd ../frontend
npm install
npm run dev                   # UI on http://127.0.0.1:5173
```

## Verify the whole pipeline
With the API running:
```bash
cd backend
npm run test:pipeline         # runs scripts/test-auth-pipeline.sh
```
The script exercises, in order: register (201) → duplicate register (409) → login + JWT (200)
→ `GET /api/tasks` without token (401) → task create with missing title (400)
→ task create with token (201) → task list with token (200).

To see that plaintext passwords are never stored:
```bash
mongosh awdf_practical7 --eval "db.users.find().pretty()"
```
Only the bcrypt hash (`$2a$10$…`) is present, never the raw password.

## Key implementation notes
- `backend/src/models/User.js` – `pre('save')` hook hashes with `bcrypt.genSalt(10)`; `password` has `select: false`.
- `backend/src/controllers/authController.js` – `jwt.sign({ sub, email }, JWT_SECRET, { expiresIn: '1h' })`.
- `backend/src/middleware/auth.js` – verifies `Authorization: Bearer <token>` and distinguishes expired vs invalid tokens.
- `backend/src/middleware/validate.js` – rejects bad name/email/password/title with HTTP 400 + `details[]`.
