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
  podman kill ka-game || true
  podman kill ka-backend || true
  podman kill ka-ui || true

  podman rm ka-game || true
  podman rm ka-backend || true
  podman rm ka-ui || true

  echo "Containers removed or non-existent."

  echo "Removing pod..."
  podman pod rm kittenscience || true
  echo "Pod removed or non-existent."
}

main "$@"
