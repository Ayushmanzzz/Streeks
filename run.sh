#!/bin/bash

echo "Starting Backend..."

cd backend
source venv/bin/activate
uvicorn app.main:app --reload &

cd ..

echo "Starting Frontend..."

cd frontend
npm run dev &

echo ""
echo "Frontend: http://localhost:3000"
echo "Backend:  http://localhost:8000"
echo ""

wait
