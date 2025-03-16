.PHONY: default build clean docs git-hook pretty lint test run

default: build

build: devcontainer lib

clean:
	rm --force --recursive .venv devcontainer/overlay docs/current/public lib node_modules output tsconfig.tsbuildinfo

docs: docs/current/public

git-hook:
	echo "make pretty" > .git/hooks/pre-commit

pretty: node_modules
	yarn biome check --write --no-errors-on-unmatched
	npm pkg fix

lint: node_modules
	yarn biome check .
	yarn tsc --noEmit

test:
	@echo "Kitten Scientists test in production."


.PHONY: devcontainer devcontainer-oci
devcontainer: injectable
	node devcontainer/build-devcontainer.js
devcontainer-oci: devcontainer
	docker build \
		--build-arg BRANCH="master" \
		--build-arg REPO="https://github.com/nuclear-unicorn/kittensgame.git" \
		--file devcontainer/Containerfile \
		--no-cache \
		--tag localhost/devcontainer:latest \
		.

node_modules:
	yarn install

lib: node_modules
	yarn tsc --build

output: node_modules
	yarn vite --config vite.config.userscript.js build

.PHONY: injectable
injectable: node_modules
	yarn vite --config vite.config.inject.js build
	mkdir --parents devcontainer/overlay/ && cp output/kitten-scientists.inject.js devcontainer/overlay/kitten-scientists.inject.js

.PHONY: userscript
userscript: node_modules
	yarn vite --config vite.config.userscript.js build
	MINIFY=true yarn vite --config vite.config.userscript.js build

.venv:
	python3 -m venv .venv
	. .venv/bin/activate; pip install -r requirements.txt

docs/current/public: .venv
	. .venv/bin/activate; cd docs/current/; mkdocs build --config-file mkdocs.yml --site-dir public

.PHONY: docs-serve
docs-serve: .venv
	. .venv/bin/activate; cd docs/current/; mkdocs serve --config-file mkdocs.yml
