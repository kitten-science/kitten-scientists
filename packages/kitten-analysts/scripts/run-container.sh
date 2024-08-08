#!/usr/bin/env bash

set -o errexit
set -o nounset
set -o pipefail
if [[ "${TRACE-0}" == "1" ]]; then
  set -o xtrace
fi

cd "$(dirname "$0")"

main() {
  BASEDIR=$(pwd)

  yarn kitten-analysts:build
  yarn kitten-engineers:build
  yarn kitten-scientists:build
  yarn kittenscience:build

  echo "Removing previous containers..."
  podman stop ksa-game > /dev/null || true
  podman stop ksa-backend > /dev/null || true
  podman stop ksa-ui > /dev/null || true

  podman rm ksa-game > /dev/null || true
  podman rm ksa-backend > /dev/null || true
  podman rm ksa-ui > /dev/null || true

  echo "Previous containers removed or non-existent."

  echo "Removing previous pod..."
  podman pod rm kittenscience || true
  echo "Previous pod removed or non-existent."

  echo ""

  echo "Creating new pod..."
  # 9080 Kittens Game
  # 9091 Prometheus Exporter
  # 9093 Kitten Analysts Websocket
  podman pod create \
    --name kittenscience \
    --publish 7780:7780 \
    --publish 9080:8080 \
    --publish 9091:9091 \
    --publish 9093:9093
  echo "Pod created."

  echo "Running new containers..."
  podman run \
    --detach \
    --mount type=bind,source="${BASEDIR}/../../kitten-analysts/output",target=/kittensgame/kitten-analysts \
    --mount type=bind,source="${BASEDIR}/../../kitten-engineers/output",target=/kittensgame/kitten-engineers \
    --mount type=bind,source="${BASEDIR}/../../kitten-scientists/output",target=/kittensgame/kitten-scientists \
    --name ksa-game \
    --pod kittenscience \
    ksa-game

  podman run \
    --detach \
    --mount type=bind,source="${BASEDIR}/../examples",target=/local_storage \
    --name ksa-backend \
    --pod kittenscience \
    ksa-backend

  podman run \
    --detach \
    --mount type=bind,source="${BASEDIR}/../examples",target=/local_storage \
    --name ksa-ui \
    --pod kittenscience \
    ksa-ui

  echo "Containers running."
}

main "$@"
