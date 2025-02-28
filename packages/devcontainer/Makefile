.PHONY: default build clean docs git-hook pretty lint test run

default: build

build: output

clean:
	rm --force --recursive output tsconfig.tsbuildinfo

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

run: build
	node ./output/main.js


output:
	cd ../.. && yarn install && yarn tsc --build
	node build.js

kittensgame:
	git clone --branch "master" --single-branch "https://github.com/nuclear-unicorn/kittensgame.git" \
		&& cd kittensgame \
		&& git pull \
		&& yarn add -D watch-http-server \
		&& yarn install
