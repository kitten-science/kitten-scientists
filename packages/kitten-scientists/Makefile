.PHONY: default build clean docs git-hook pretty lint test run

default: build

build: output

clean:
	rm --force --recursive build node_modules output tsconfig.tsbuildinfo

docs:
	@echo "Documentation is maintained in discrete project."

git-hook:
	echo "make pretty" > ../../.git/hooks/pre-commit

pretty:
	cd ../.. && $(MAKE) pretty
	npm pkg fix

lint:
	cd ../.. && $(MAKE) lint

test: build
	@echo "Kittens test in production only."


output:
	cd ../.. && yarn install && yarn tsc --build
	node build.js
