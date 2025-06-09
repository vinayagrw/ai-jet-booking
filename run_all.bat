@echo off
start cmd /k "cd backend && uvicorn main:app --reload"
cd frontend
pnpm dev 