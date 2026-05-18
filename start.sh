#!/bin/sh

set -e

# Render assigns PORT for the public web service
FRONTEND_PORT=${PORT:-3000}
# Backend runs internally on a separate port so it does not conflict
BACKEND_PORT=3001

cd /app/backend
PORT="$BACKEND_PORT" node dist/src/index.js &
BACKEND_PID=$!

cd /app/frontend
npx next start -p "$FRONTEND_PORT" &
FRONTEND_PID=$!

wait -n $BACKEND_PID $FRONTEND_PID
EXIT_STATUS=$?

kill $BACKEND_PID $FRONTEND_PID 2>/dev/null || true
exit $EXIT_STATUS
