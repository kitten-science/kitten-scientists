#!/usr/bin/env bash

set -o errexit
set -o nounset
set -o pipefail
if [[ "${TRACE-0}" == "1" ]]; then
  set -o xtrace
fi

cd "$(dirname "$0")"

main() {
  cd ../../..
  podman run --rm -p 8000:8000 -v "${PWD}":/docs docker.io/squidfunk/mkdocs-material serve --config-file packages/documentation/mkdocs.yml
}

main "$@"
