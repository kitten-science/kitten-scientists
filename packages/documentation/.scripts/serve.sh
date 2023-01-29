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
  export DOCKER_SCAN_SUGGEST=false
  docker build -t squidfunk/mkdocs-material .

  cd ../..
  docker run --rm -it -p 8000:8000 -v "${PWD}":/docs squidfunk/mkdocs-material serve --config-file packages/documentation/mkdocs.yml
}

main "$@"
