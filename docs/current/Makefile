.PHONY: default build clean docs git-hook pretty lint test run

default: build

build: public

clean:
	rm --force --recursive node_modules public tsconfig.tsbuildinfo

docs: build

git-hook:
	echo "make pretty" > ../../.git/hooks/pre-commit

pretty:
	cd ../.. && $(MAKE) pretty
	npm pkg fix

lint:
	cd ../.. && $(MAKE) lint

test: build
	@echo "The documentation has no tests."

run: .venv build
	. .venv/bin/activate; mkdocs serve --config-file mkdocs.yml


.venv:
	python3 -m venv .venv
	. .venv/bin/activate; pip install -r requirements.txt

output: public


.PHONY: nsd
nsd:
	yarn install
	yarn nsd --cwd=../.. --docs-location="packages/documentation/docs/reference/Repository Scripts/"

public: .venv nsd
	. .venv/bin/activate; mkdocs build --config-file mkdocs.yml --site-dir public
