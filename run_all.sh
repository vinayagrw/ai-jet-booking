#!/bin/bash

# Start backend in a new terminal window/process
(source ./.venv/Scripts/activate && ) &
BACKEND_PID=$!

echo "Backend started with PID: $BACKEND_PID"

# Start frontend
cd frontend
pnpm dev

# Optional: Trap to kill backend on script exit (might not work perfectly across all shells/environments)
trap "echo \"Stopping backend (PID: $BACKEND_PID)...\"; kill $BACKEND_PID" EXIT 