.PHONY: help venv install run test clean

PY=python
VENV_DIR=venv
PIP=$(VENV_DIR)/bin/pip
PYTEST=$(VENV_DIR)/bin/pytest
UVICORN=$(VENV_DIR)/bin/uvicorn

help:
	@echo "Makefile targets:"
	@echo "  make venv     - create a virtual environment"
	@echo "  make install  - install dependencies into the venv"
	@echo "  make run      - run the app with uvicorn"
	@echo "  make test     - run pytest"
	@echo "  make clean    - remove venv and caches"

venv:
	$(PY) -m venv $(VENV_DIR)

install: venv
	$(PIP) install --upgrade pip
	$(PIP) install -r requirements.txt

run: install
	$(UVICORN) main:app --reload --host 127.0.0.1 --port 8000

test: install
	$(PYTEST) -q

clean:
	rm -rf $(VENV_DIR) __pycache__ .pytest_cache
