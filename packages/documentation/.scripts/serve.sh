#!/usr/bin/env bash

self=$(readlink -f "$0")
basedir=$(dirname "$self")

cd ${basedir}/..
docker build -t mkdocs-material .

cd ../..
docker run --rm -it -p 8000:8000 -v ${PWD}:/docs ghcr.io/oliversalzburg/mkdocs-material-ex:main serve --config-file packages/documentation/mkdocs.yml
