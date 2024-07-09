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

  echo "Re-Building Game container..."
  podman build \
    --file ./game.Dockerfile \
    --no-cache \
    --tag localhost/ksa-game:latest \
    ../..

  echo "Re-Building Backend container..."
  podman build \
    --file ./backend.Dockerfile \
    --no-cache \
    --tag localhost/ksa-backend:latest \
    ../..

  echo "Re-Building UI container..."
  podman build \
    --file ./ui.Dockerfile \
    --no-cache \
    --tag localhost/ksa-ui:latest \
    ../..

  echo "Done."
  echo
  echo "Remember to restart your container if it's already running!"
}

main "$@"
