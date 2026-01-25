.PHONY: install test test-headless run clean lint

install:
	pip install -r requirements.txt

install-dev:
	pip install -e .[dev]

install-prod:
	pip install -e .[prod]

test:
	pytest tests/oauth/ -v

test-headless:
	python tests/oauth/test_oauth_flow_headless.py

run:
	uvicorn src.oauth.consent:app --reload

run-prod:
	gunicorn src.oauth.consent:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000

clean:
	find . -type f -name "*.pyc" -delete
	find . -type d -name "__pycache__" -delete
	rm -rf .pytest_cache
	rm -rf .coverage

lint:
	black src tests
	flake8 src tests

build:
	python -m build