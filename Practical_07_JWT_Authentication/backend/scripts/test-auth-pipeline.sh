#!/usr/bin/env bash
# End-to-end verification of the Practical 7 authentication pipeline.
# Start the API first:  npm start   (needs MongoDB running)
set -uo pipefail
BASE="${BASE_URL:-http://127.0.0.1:5001}"
EMAIL="student$(date +%s)@example.com"

step() { printf '\n=== %s\n' "$1"; }
token_of() { printf '%s' "$1" | sed -n 's/.*"token":"\([^"]*\)".*/\1/p'; }

step "1. POST /api/auth/register (new user $EMAIL)"
REG=$(curl -s -X POST "$BASE/api/auth/register" -H 'Content-Type: application/json' \
  -d "{\"name\":\"Jay Chheta\",\"email\":\"$EMAIL\",\"password\":\"secret123\"}")
printf '%s\n' "$REG"

step "2. POST /api/auth/register (same email again -> expect 409)"
curl -s -o /dev/null -w 'HTTP %{http_code}\n' -X POST "$BASE/api/auth/register" \
  -H 'Content-Type: application/json' -d "{\"name\":\"Jay Chheta\",\"email\":\"$EMAIL\",\"password\":\"secret123\"}"

step "3. Raw password never stored (bcrypt hash only)"
echo "check in mongosh: db.users.findOne({email:'$EMAIL'})"

step "4. POST /api/auth/login -> JWT issued"
LOGIN=$(curl -s -X POST "$BASE/api/auth/login" -H 'Content-Type: application/json' \
  -d "{\"email\":\"$EMAIL\",\"password\":\"secret123\"}")
printf '%s\n' "$LOGIN"
TOKEN=$(token_of "$LOGIN")

step "5. GET /api/tasks without token -> expect 401"
curl -s -w '\nHTTP %{http_code}\n' "$BASE/api/tasks"

step "6. POST /api/tasks with token but missing title -> expect 400"
curl -s -w '\nHTTP %{http_code}\n' -X POST "$BASE/api/tasks" -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' -d '{"description":"no title here"}'

step "7. POST /api/tasks with token -> expect 201"
curl -s -w '\nHTTP %{http_code}\n' -X POST "$BASE/api/tasks" -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' -d '{"title":"Prepare AWDF viva","description":"Revise JWT flow"}'

step "8. GET /api/tasks with token -> expect 200 and 1 task"
curl -s -w '\nHTTP %{http_code}\n' "$BASE/api/tasks" -H "Authorization: Bearer $TOKEN"
