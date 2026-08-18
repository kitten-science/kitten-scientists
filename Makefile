OBJECTS := $(shell find source -regextype posix-extended -regex '.*\.(css|json|svg|ts)')
OBJECTS_DEVCONTAINER := $(shell find devcontainer -maxdepth 0 -regextype posix-extended -regex '.*\.(js|ts)')
DOCS := $(shell find docs/current)

.PHONY: default
default: output/kitten-scientists.user.js

.PHONY: all
all: devcontainer docs userscript

.PHONY: clean
clean:
	rm --force --recursive \
		_site \
		.venv \
		devcontainer/overlay \
		docs/current/.venv \
		docs/current/public \
		node_modules \
		output

.PHONY: git-hook
git-hook:
	echo "make pretty" > .git/hooks/pre-commit; chmod +x .git/hooks/pre-commit

.PHONY: pretty
pretty: node_modules/.package-lock.json
	npm exec -- biome check --no-errors-on-unmatched --fix --unsafe
	npm pkg fix

.PHONY: lint
lint: node_modules/.package-lock.json
	npm exec -- biome check .
	npm exec -- tsc

# Tools
package-lock.json: package.json
	npm install --package-lock-only
node_modules/.package-lock.json: package-lock.json
	npm ci

.venv/pyvenv.cfg : requirements.txt
	python3 -m venv .venv
	. .venv/bin/activate; pip install -r requirements.txt
	touch .venv/pyvenv.cfg

# Kitten Scientists
output/kitten-scientists.inject.js : node_modules/.package-lock.json $(OBJECTS)
	npm exec -- vite --config vite.config.inject.js build
output/kitten-scientists.user.js : node_modules/.package-lock.json output/kitten-scientists.inject.js
	npm exec -- vite --config vite.config.loader.js build
devcontainer/overlay/kitten-scientists.inject.js : output/kitten-scientists.inject.js
	@mkdir -p devcontainer/overlay/ || true
	cp $^ $@

.PHONY: userscript
userscript : output/kitten-scientists.user.js

# DevContainer
output/entrypoint-devcontainer.mjs : node_modules/.package-lock.json $(OBJECTS_DEVCONTAINER)
	node devcontainer/build-devcontainer.js
output/devcontainer.tar : \
	output/entrypoint-devcontainer.mjs \
	devcontainer/Containerfile \
	devcontainer/overlay/kitten-scientists.inject.js
	docker build \
		--build-arg BRANCH="master" \
		--build-arg REPO="https://github.com/nuclear-unicorn/kittensgame.git" \
		--file devcontainer/Containerfile \
		--no-cache \
		--tag localhost/devcontainer:latest \
		.
	docker save localhost/devcontainer:latest --output "$@"

.PHONY: devcontainer
devcontainer: output/devcontainer.tar

# Docs
docs/current/public/index.html : .venv/pyvenv.cfg $(DOCS)
	. .venv/bin/activate; cd docs/current/; mkdocs build --config-file mkdocs.yml --site-dir public
_site/index.html : docs/current/public/index.html $(DOCS)
	mkdir -p _site || true
	cp -r docs/current/public _site

.PHONY: docs
docs: _site/index.html

.PHONY: docs-serve
docs-serve: .venv/pyvenv.cfg
	. .venv/bin/activate; cd docs/current/; mkdocs serve --config-file mkdocs.yml
