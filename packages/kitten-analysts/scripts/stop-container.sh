#!/usr/bin/env bash

set -o errexit
set -o nounset
set -o pipefail
if [[ "${TRACE-0}" == "1" ]]; then
  set -o xtrace
fi

cd "$(dirname "$0")"

main() {
  echo "Removing containers..."
  podman kill ksa-game || true
  podman kill ksa-backend || true
  podman kill ksa-ui || true

  podman rm ksa-game || true
  podman rm ksa-backend || true
  podman rm ksa-ui || true

  echo "Containers removed or non-existent."

  echo "Removing pod..."
  podman pod rm kittenscience || true
  echo "Pod removed or non-existent."
}

main "$@"
