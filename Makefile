.PHONY: default build clean docs git-hook pretty lint test run

default: build

build: devcontainer injectable userscript loader lib

clean:
	rm --force --recursive _site .venv devcontainer/overlay docs/current/public lib node_modules output tsconfig.tsbuildinfo

docs: docs/current/public

git-hook:
	echo "make pretty" > .git/hooks/pre-commit; chmod +x .git/hooks/pre-commit

pretty: node_modules
	npm exec -- biome check --no-errors-on-unmatched --fix --unsafe
	npm pkg fix

lint: node_modules
	npm exec -- biome check .
	npm exec -- tsc --noEmit

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
	npm install

lib: node_modules
	npm exec -- tsc --build

.PHONY: injectable userscript loader
injectable: node_modules
	npm exec -- vite --config vite.config.inject.js build
	MINIFY=true npm exec -- vite --config vite.config.inject.js build
	mkdir -p devcontainer/overlay/ && cp output/kitten-scientists.inject.js devcontainer/overlay/kitten-scientists.inject.js

userscript: node_modules
	npm exec -- vite --config vite.config.user.js build
	MINIFY=true npm exec -- vite --config vite.config.user.js build

loader: node_modules injectable
	npm exec -- vite --config vite.config.loader.js build
	MINIFY=true npm exec -- vite --config vite.config.loader.js build


.venv:
	python3 -m venv .venv
	. .venv/bin/activate; pip install -r requirements.txt

docs/current/public: .venv
	. .venv/bin/activate; cd docs/current/; mkdocs build --config-file mkdocs.yml --site-dir public

.PHONY: docs-serve
docs-serve: .venv
	. .venv/bin/activate; cd docs/current/; mkdocs serve --config-file mkdocs.yml

.PHONY: full-docs
full-docs: docs
	mkdir -p _site
	cp -r docs/v2.0.0-beta.8 _site/
	cp -r docs/v2.0.0-beta.9 _site/
	cp -r docs/v2.0.0-beta.10 _site/
	cp -r docs/current/public _site/main
