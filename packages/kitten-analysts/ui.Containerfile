FROM docker.io/library/node:22.8.0-bookworm@sha256:7b2c1050e3bccd9866230b4e63a88f05683035a998da5cae655bac27168e50b7

LABEL "org.opencontainers.image.description"="Headless Kittens Game"

WORKDIR /opt
COPY "node_modules" "node_modules"
COPY "packages/kitten-analysts/package.json" "package.json"
COPY "packages/kitten-analysts/output" "output"

CMD [ "/bin/bash", "-c", "node output/entrypoint-ui.js" ]
