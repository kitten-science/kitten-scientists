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

  # Build with tsc first, so all cross-workspace imports can be resolved.
  echo "Building with tsc..."
  yarn tsc --build
  echo "Done building with tsc."

  # Build the individual user scripts.
  echo "Building user scripts..."
  yarn kitten-analysts:build
  echo "Done with Kitten Analysts."
  yarn kitten-engineers:build
  echo "Done with Kitten Engineers."
  yarn kitten-scientists:build
  echo "Done with Kitten Scientists."
}

main "$@"
