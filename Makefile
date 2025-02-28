.PHONY: default build clean docs git-hook pretty lint test run

default: build

build: output

clean:
	rm --force --recursive node_modules output packages/*/build packages/*/coverage packages/*/output packages/*/tsconfig.tsbuildinfo tsconfig.tsbuildinfo

docs:
	@echo "No documentation included by default."

git-hook:
	echo "make pretty" > .git/hooks/pre-commit

pretty: node_modules
	yarn biome check --write --no-errors-on-unmatched
	npm pkg fix

lint: node_modules
	yarn biome check .
	yarn tsc --noEmit

test: build
	yarn c8 --reporter=html-spa mocha output/*.test.js

run: build
	node ./output/main.js


node_modules:
	yarn install

output: node_modules
	cd packages/action-release-info && $(MAKE) build
	cd packages/devcontainer && $(MAKE) build
	cd packages/documentation && $(MAKE) build
	cd packages/kitten-analysts && $(MAKE) build
	cd packages/kitten-engineers && $(MAKE) build
	cd packages/kitten-scientists && $(MAKE) build
