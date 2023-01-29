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

  echo "Building development container on $BRANCH branch..."
  cd ..
  export DOCKER_SCAN_SUGGEST=false
  docker build \
    --build-arg BRANCH="$BRANCH" \
    --tag kitten-game .
  echo "Done."
}

main "$@"
