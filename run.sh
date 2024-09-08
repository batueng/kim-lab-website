#!/bin/bash

cleanup() {
  echo "Stopping both servers..."
  kill $CLIENT_PID $SERVER_PID 
  wait $CLIENT_PID
  wait $SERVER_PID
  echo "Both servers stopped."
  exit 0
}

trap cleanup SIGINT

echo "Starting client-side server..."
cd client/myapp/
npm run dev &
CLIENT_PID=$!

cd ../../

echo "Starting server-side server..."
cd server/
source env/bin/activate
cd myapp/
python3 manage.py runserver &
SERVER_PID=$!

wait $CLIENT_PID
wait $SERVER_PID