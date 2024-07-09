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

  yarn clean:all
  yarn build:all

  echo "Re-Building Game container..."
  buildah bud \
    --file ./game.Containerfile \
    --no-cache \
    --tag localhost/ksa-game:latest \
    ../..

  echo "Re-Building Backend container..."
  buildah bud \
    --file ./backend.Containerfile \
    --no-cache \
    --tag localhost/ksa-backend:latest \
    ../..

  echo "Re-Building UI container..."
  buildah bud \
    --file ./ui.Containerfile \
    --no-cache \
    --tag localhost/ksa-ui:latest \
    ../..

  echo "Done."
  echo
  echo "Remember to restart your container if it's already running!"
}

main "$@"
