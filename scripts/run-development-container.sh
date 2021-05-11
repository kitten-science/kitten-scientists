#!/usr/bin/env bash

set -o errexit

BASEDIR=$(dirname "$(readlink -f "$0")")

yarn devcontainer:build

docker stop kitten-game || true
docker rm kitten-game || true

docker run \
  --detach \
  --mount type=bind,source="${BASEDIR}/../packages/kitten-game/index.html",target=/kitten-game/index.html \
  --mount type=bind,source="${BASEDIR}/../packages/userscript/output/kitten-scientists.inject.js",target=/kitten-game/kitten-scientists.inject.js \
  --name kitten-game \
  --publish 8100:8080 kitten-game

echo "Kitten game should be running at http://127.0.0.1:8100"
