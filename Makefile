.PHONY: default build clean docs git-hook pretty lint test run

default: build

build: lib

clean:
	rm --force --recursive lib node_modules output tsconfig.tsbuildinfo

docs:
	@echo "This project has no documentation."

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


node_modules:
	yarn install

lib: node_modules
	yarn tsc --build

output: node_modules
	yarn vite --config vite.config.userscript.js build

.PHONY: userscript
userscript: node_modules
	yarn vite --config vite.config.inject.js build
	MINIFY=true yarn vite --config vite.config.userscript.js build

