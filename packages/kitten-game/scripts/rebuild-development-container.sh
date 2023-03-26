#!/usr/bin/env bash

set -o errexit
set -o nounset
set -o pipefail
if [[ "${TRACE-0}" == "1" ]]; then
  set -o xtrace
fi

cd "$(dirname "$0")"

main() {
  BRANCH=${1:-master}

  echo "Re-Building development container on $BRANCH branch..."
  cd ..
  export DOCKER_SCAN_SUGGEST=false
  docker build \
    --build-arg BRANCH="$BRANCH" \
    --no-cache \
    --tag kitten-game .
  echo "Done."
  echo
  echo "Remember to restart your development container if it's already running!"
}

main "$@"
