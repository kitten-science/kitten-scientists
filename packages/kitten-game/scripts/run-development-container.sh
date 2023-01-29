#!/usr/bin/env bash

set -o errexit
set -o nounset
set -o pipefail
if [[ "${TRACE-0}" == "1" ]]; then
  set -o xtrace
fi

cd "$(dirname "$0")"

main() {
  BASEDIR=$(dirname "$(readlink -f "$0")")
  BRANCH=${1:-master}

  yarn userscript:build
  yarn devcontainer:build "$BRANCH"

  echo "Removing previous container..."
  docker stop kitten-game > /dev/null || true
  docker rm kitten-game > /dev/null || true
  echo "Previous container removed or non-existent."
  echo ""

  echo "Starting new container..."
  docker run \
    --detach \
    --mount type=bind,source="${BASEDIR}/../../userscript/output",target=/kitten-game/kitten-scientists \
    --name kitten-game \
    --publish 8100:8080 kitten-game
  echo "Container started."

  echo ""
  echo "Kitten game should be running at http://127.0.0.1:8100"
}

main "$@"
