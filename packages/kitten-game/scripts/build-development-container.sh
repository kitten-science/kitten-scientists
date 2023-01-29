#!/usr/bin/env bash

set -o errexit

BRANCH=${1:-master}

echo "Building development container on $BRANCH branch..."
export DOCKER_SCAN_SUGGEST=false
docker build \
  --build-arg BRANCH="$BRANCH" \
  --tag kitten-game .
echo "Done."
