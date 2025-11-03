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
	@echo "  make run-backend     - run the .NET backend (http://localhost:5100)"
	@echo "  make frontend-install - install frontend dependencies"
	@echo "  make run-frontend    - run the Angular frontend (http://localhost:4200)"
	@echo "  make kill-ports      - kill processes on ports 8000, 5100, and 4200"
	@echo "  make run-all         - kill ports and run all services"

venv:
	$(PY) -m venv $(VENV_DIR)

install: venv
	$(PIP) install --upgrade pip
	$(PIP) install -r requirements.txt

run: install
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
	@echo "Starting all services..."
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
