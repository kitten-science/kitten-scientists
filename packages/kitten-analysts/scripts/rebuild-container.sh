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

  echo "Re-Building Game container..."
  podman build \
    --file ./game.Dockerfile \
    --no-cache \
    --tag ksa-game \
    ../..

  echo "Re-Building Backend container..."
  podman build \
    --file ./backend.Dockerfile \
    --no-cache \
    --tag ksa-backend \
    ../..

  echo "Re-Building UI container..."
  podman build \
    --file ./ui.Dockerfile \
    --no-cache \
    --tag ksa-ui \
    ../..

  echo "Done."
  echo
  echo "Remember to restart your container if it's already running!"
}

main "$@"
