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
  REPO=${2:-https://github.com/nuclear-unicorn/kittensgame.git}

  echo "Building development container on $BRANCH branch of $REPO..."
  cd ..
  podman build \
    --build-arg BRANCH="$BRANCH" \
    --build-arg REPO="$REPO" \
    --tag kittensgame .
  echo "Done."
}

main "$@"
