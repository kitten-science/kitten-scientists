#!/usr/bin/env bash

set -o errexit
set -o nounset
set -o pipefail
if [[ "${TRACE-0}" == "1" ]]; then
  set -o xtrace
fi

cd "$(dirname "$0")"

main() {
  echo "Removing container..."
  docker kill devcontainer || true
  docker rm devcontainer || true
  echo "Previous container removed or non-existent."
}

main "$@"
