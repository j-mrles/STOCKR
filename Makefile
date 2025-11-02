.PHONY: help venv install run test clean backend-restore run-backend frontend-install run-frontend

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

venv:
	$(PY) -m venv $(VENV_DIR)

install: venv
	$(PIP) install --upgrade pip
	$(PIP) install -r requirements.txt

run: install
	$(UVICORN) main:app --reload --host 127.0.0.1 --port 8000

test: install
	$(PYTEST) -q ai_service/

clean:
	rm -rf $(VENV_DIR) __pycache__ .pytest_cache

backend-restore:
	dotnet restore $(BACKEND_PROJECT)

run-backend:
	 dotnet run --project $(BACKEND_PROJECT) --urls http://localhost:5100

frontend-install:
	cd $(FRONTEND_DIR) && npm install

run-frontend: frontend-install
	cd $(FRONTEND_DIR) && npm start
