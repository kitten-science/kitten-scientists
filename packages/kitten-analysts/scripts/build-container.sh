#!/usr/bin/env bash

set -o errexit
set -o nounset
set -o pipefail
if [[ "${TRACE-0}" == "1" ]]; then
  set -o xtrace
fi

cd "$(dirname "$0")"

main() {
  cd ..

  yarn kitten-analysts:build
  yarn kitten-engineers:build
  yarn kitten-scientists:build

  echo "Building Game container..."
  podman build \
    --file ./game.Dockerfile \
    --tag localhost/ksa-game:latest \
    ../..

  echo "Building Backend container..."
  podman build \
    --file ./backend.Dockerfile \
    --tag localhost/ksa-backend:latest \
    ../..

  echo "Building UI container..."
  podman build \
    --file ./ui.Dockerfile \
    --tag localhost/ksa-ui:latest \
    ../..

  echo "Done."
}

main "$@"
