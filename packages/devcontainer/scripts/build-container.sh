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

  BRANCH=${1:-master}
  REPO=${2:-https://github.com/nuclear-unicorn/kittensgame.git}

  echo "Building development container on $BRANCH branch of $REPO..."
  docker build \
    --build-arg BRANCH="$BRANCH" \
    --build-arg REPO="$REPO" \
    --file ./Containerfile \
    --tag localhost/devcontainer:latest \
    ../..

  echo "Done."
}

main "$@"
