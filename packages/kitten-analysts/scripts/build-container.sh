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

  yarn build:all

  echo "Building Game container..."
  buildah bud \
    --file ./game.Containerfile \
    --tag localhost/ka-game:latest \
    ../..

  echo "Building Backend container..."
  buildah bud \
    --file ./backend.Containerfile \
    --tag localhost/ka-backend:latest \
    ../..

  echo "Building UI container..."
  buildah bud \
    --file ./ui.Containerfile \
    --tag localhost/ka-ui:latest \
    ../..

  echo "Done."
}

main "$@"
