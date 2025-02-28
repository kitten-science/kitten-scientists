#!/usr/bin/env bash

set -o errexit
set -o nounset
set -o pipefail
if [[ "${TRACE-0}" == "1" ]]; then
  set -o xtrace
fi

cd "$(dirname "$0")"

main() {
  BASEDIR=$(pwd)
  BRANCH=${1:-master}
  REPO=${2:-https://github.com/nuclear-unicorn/kittensgame.git}

  echo "Building everything..."
  KA_CONNECT_BACKEND="" yarn build:all
  echo "Done building everything."

  echo "Building Devcontainer..."
  yarn devcontainer:build "$BRANCH" "$REPO"
  echo "Done building Devcontainer."

  echo "Removing previous container..."
  docker kill devcontainer || true
  docker rm devcontainer || true
  echo "Previous container removed or non-existent."

  echo ""

  echo "Starting new container..."
  # 8086 Live-Reload Websocket from Development HTTP Server
  # 8100 Kittens Game Browser UI
  docker run \
    --detach \
    --mount type=bind,source="${BASEDIR}/../../kitten-analysts/output",target=/kittensgame/kitten-analysts \
    --mount type=bind,source="${BASEDIR}/../../kitten-engineers/output",target=/kittensgame/kitten-engineers \
    --mount type=bind,source="${BASEDIR}/../../kitten-scientists/output",target=/kittensgame/kitten-scientists \
    --name devcontainer \
    --publish 8086:8086 \
    --publish 8100:8080 \
    devcontainer
  echo "Container started."

  echo ""
  echo "Kittens Game should be running at http://127.0.0.1:8100"
}

main "$@"
