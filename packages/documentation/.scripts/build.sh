#!/usr/bin/env bash

self=$(readlink -f "$0")
basedir=$(dirname "$self")

cd "${basedir}"/.. || exit
docker build -t squidfunk/mkdocs-material .

cd ../..
docker run --rm -it -v "${PWD}":/docs squidfunk/mkdocs-material build --config-file packages/documentation/mkdocs.yml --site-dir public
