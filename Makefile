.PHONY: help venv install run test clean backend-restore run-backend frontend-install run-frontend kill-ports run-all

PY=python
VENV_DIR=venv
PIP=$(VENV_DIR)/bin/pip
PYTEST=$(VENV_DIR)/bin/pytest
UVICORN=$(VENV_DIR)/bin/uvicorn
BACKEND_PROJECT=backend/src/Stockr.Api/Stockr.Api.csproj
FRONTEND_DIR=frontend

help:
	@echo "Makefile targets:"
	@echo "  make venv     - create a virtual environment"
	@echo "  make install  - install dependencies into the venv"
	@echo "  make run      - run the app with uvicorn"
	@echo "  make test     - run pytest"
	@echo "  make clean    - remove venv and caches"
	@echo "  make backend-restore - restore .NET backend dependencies"
	@echo "  make run-backend     - run the .NET backend (network accessible)"
	@echo "  make run-backend-local - run backend on localhost only"
	@echo "  make frontend-install - install frontend dependencies"
	@echo "  make run-frontend    - run the Angular frontend (http://localhost:4200)"
	@echo "  make kill-ports      - kill processes on ports 8000, 5100, and 4200"
	@echo "  make run-all         - kill ports and run all services"
	@echo "  make run-network     - start all services for network access (phone)"
	@echo "  make get-ip          - display your local IP address"

venv:
	$(PY) -m venv $(VENV_DIR)

install: venv
	$(PIP) install --upgrade pip
	$(PIP) install -r requirements.txt

run: install
	@-lsof -ti:8000 | xargs kill -9 2>/dev/null || true
	$(UVICORN) main:app --reload --host 0.0.0.0 --port 8000

run-local: install
	@-lsof -ti:8000 | xargs kill -9 2>/dev/null || true
	$(UVICORN) main:app --reload --host 127.0.0.1 --port 8000

test: install
	$(PYTEST) -q ai_service/

clean:
	rm -rf $(VENV_DIR) __pycache__ .pytest_cache

backend-restore:
	dotnet restore $(BACKEND_PROJECT)

run-backend:
	@-lsof -ti:5100 | xargs kill -9 2>/dev/null || true
	dotnet run --project $(BACKEND_PROJECT) --urls http://0.0.0.0:5100

run-backend-local:
	@-lsof -ti:5100 | xargs kill -9 2>/dev/null || true
	dotnet run --project $(BACKEND_PROJECT) --urls http://localhost:5100

frontend-install:
	cd $(FRONTEND_DIR) && npm install

run-frontend: frontend-install
	@-lsof -ti:4200 | xargs kill -9 2>/dev/null || true
	cd $(FRONTEND_DIR) && npm start

kill-ports:
	@echo "Killing processes on ports 8000, 5100, and 4200..."
	@-lsof -ti:8000 | xargs kill -9 2>/dev/null || true
	@-lsof -ti:5100 | xargs kill -9 2>/dev/null || true
	@-lsof -ti:4200 | xargs kill -9 2>/dev/null || true
	@echo "Ports cleared!"

run-all: kill-ports
	@echo "Starting all services (localhost only)..."
	@echo "Starting Python service on port 8000..."
	@sleep 2
	@$(UVICORN) main:app --reload --host 127.0.0.1 --port 8000 &
	@echo "Starting .NET backend on port 5100..."
	@sleep 3
	@dotnet run --project $(BACKEND_PROJECT) --urls http://localhost:5100 &
	@echo "Starting Angular frontend on port 4200..."
	@sleep 3
	@cd $(FRONTEND_DIR) && npm start &
	@echo ""
	@echo "✅ All services starting!"
	@echo "  Python: http://localhost:8000"
	@echo "  Backend: http://localhost:5100"
	@echo "  Frontend: http://localhost:4200"

run-network: kill-ports
	@echo "🌐 Starting all services for NETWORK ACCESS (phone)..."
	@echo ""
	@$(eval LOCAL_IP := $(shell ipconfig getifaddr en0 2>/dev/null || hostname -I | awk '{print $$1}' || echo "YOUR_LOCAL_IP"))
	@echo "📍 Your local IP: $(LOCAL_IP)"
	@echo ""
	@echo "Starting Python service on port 8000 (network accessible)..."
	@sleep 2
	@$(UVICORN) main:app --reload --host 0.0.0.0 --port 8000 &
	@echo "Starting .NET backend on port 5100 (network accessible)..."
	@sleep 3
	@dotnet run --project $(BACKEND_PROJECT) --urls http://0.0.0.0:5100 &
	@echo "Starting Angular frontend on port 4200 (network accessible)..."
	@sleep 3
	@cd $(FRONTEND_DIR) && npm start -- --configuration=network &
	@echo ""
	@echo "✅ All services starting for network access!"
	@echo ""
	@echo "📱 Access from your phone:"
	@echo "   Frontend: http://$(LOCAL_IP):4200"
	@echo "   Backend:  http://$(LOCAL_IP):5100"
	@echo "   Python:   http://$(LOCAL_IP):8000"
	@echo ""
	@echo "⚠️  Make sure your phone is on the same WiFi network!"

get-ip:
	@echo "📍 Your local IP address(es):"
	@ipconfig getifaddr en0 2>/dev/null || hostname -I 2>/dev/null || echo "Could not detect IP. Try: ipconfig (Windows) or ifconfig (Linux/Mac)"
