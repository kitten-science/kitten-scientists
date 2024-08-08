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

  echo "Building Game container..."
  podman build \
    --file ./game.Dockerfile \
    --tag ksa-game \
    ../..

  echo "Building Backend container..."
  podman build \
    --file ./backend.Dockerfile \
    --tag ksa-backend \
    ../..

  echo "Building UI container..."
  podman build \
    --file ./ui.Dockerfile \
    --tag ksa-ui \
    ../..

  echo "Done."
}

main "$@"
