#!/usr/bin/env bash

self=$(readlink -f "$0")
basedir=$(dirname "$self")

cd ${basedir}/..
docker build -t mkdocs-material .

cd ../..
docker run --rm -it -p 8000:8000 -v ${PWD}:/docs mkdocs-material serve --config-file packages/documentation/mkdocs.yml
