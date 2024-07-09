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

  yarn build:all

  echo "Removing previous containers..."
  podman kill ksa-game || true
  podman kill ksa-backend || true
  podman kill ksa-ui || true

  podman rm ksa-game || true
  podman rm ksa-backend || true
  podman rm ksa-ui || true

  echo "Previous containers removed or non-existent."

  echo "Removing previous pod..."
  podman pod rm kittenscience || true
  echo "Previous pod removed or non-existent."

  echo ""

  echo "Creating new pod..."
  # 7780 KGNet Interface
  # 9080 Kittens Game Browser UI
  # 9091 Prometheus Exporter
  # 9093 Kitten Analysts Websocket
  podman pod create \
    --name kittenscience \
    --publish 7780:7780 \
    --publish 9080:8080 \
    --publish 9091:9091 \
    --publish 9093:9093 \
    --volume "${BASEDIR}/../examples:/local_storage:rw" \
    --volume "${BASEDIR}/../../kitten-analysts/output:/kittensgame/kitten-analysts:ro" \
    --volume "${BASEDIR}/../../kitten-engineers/output:/kittensgame/kitten-engineers:ro" \
    --volume "${BASEDIR}/../../kitten-scientists/output:/kittensgame/kitten-scientists:ro"
  echo "Pod created."

  echo "Running new containers..."
  podman run \
    --detach \
    --name ksa-game \
    --pod kittenscience \
    localhost/ksa-game:latest

  podman run \
    --detach \
    --name ksa-backend \
    --pod kittenscience \
    localhost/ksa-backend:latest

  podman run \
    --detach \
    --name ksa-ui \
    --pod kittenscience \
    localhost/ksa-ui:latest

  echo "Containers running."
}

main "$@"
