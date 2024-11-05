FROM docker.io/library/node:22.11.0-bookworm@sha256:de4c8be8232b7081d8846360d73ce6dbff33c6636f2259cd14d82c0de1ac3ff2

LABEL "org.opencontainers.image.description"="Headless Kittens Game"

WORKDIR /opt
COPY "node_modules" "node_modules"
COPY "packages/kitten-analysts/package.json" "package.json"
COPY "packages/kitten-analysts/output" "output"

CMD [ "/bin/bash", "-c", "node output/entrypoint-ui.js" ]
