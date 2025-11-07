#!/bin/bash

# Quick script to start STOCKR for network access (phone)

echo "🌐 Starting STOCKR for Network Access..."
echo ""

# Get local IP
if [[ "$OSTYPE" == "darwin"* ]]; then
    LOCAL_IP=$(ipconfig getifaddr en0)
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    LOCAL_IP=$(hostname -I | awk '{print $1}')
else
    echo "⚠️  Could not detect IP automatically. Please find your local IP and update this script."
    LOCAL_IP="YOUR_LOCAL_IP"
fi

echo "📍 Your local IP: $LOCAL_IP"
echo ""
echo "Make sure your phone is on the same WiFi network!"
echo ""

# Kill existing processes
echo "Clearing ports..."
lsof -ti:8000 | xargs kill -9 2>/dev/null || true
lsof -ti:5100 | xargs kill -9 2>/dev/null || true
lsof -ti:4200 | xargs kill -9 2>/dev/null || true
sleep 1

# Start Python service
echo "Starting Python service (port 8000)..."
cd "$(dirname "$0")"
source venv/bin/activate 2>/dev/null || python -m venv venv && source venv/bin/activate
pip install -q -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000 > /dev/null 2>&1 &
PYTHON_PID=$!
sleep 2

# Start .NET backend
echo "Starting .NET backend (port 5100)..."
cd backend/src/Stockr.Api
dotnet run --urls http://0.0.0.0:5100 > /dev/null 2>&1 &
BACKEND_PID=$!
sleep 3

# Start Angular frontend
echo "Starting Angular frontend (port 4200)..."
cd ../../../frontend
npm start -- --host 0.0.0.0 > /dev/null 2>&1 &
FRONTEND_PID=$!
sleep 3

echo ""
echo "✅ All services started!"
echo ""
echo "📱 Access from your phone:"
echo "   Frontend: http://$LOCAL_IP:4200"
echo "   Backend:  http://$LOCAL_IP:5100"
echo "   Python:   http://$LOCAL_IP:8000"
echo ""
echo "💡 To stop all services, press Ctrl+C or run: make kill-ports"
echo ""

# Wait for interrupt
trap "kill $PYTHON_PID $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT
wait

