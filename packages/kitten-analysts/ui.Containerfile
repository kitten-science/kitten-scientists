FROM docker.io/library/node:22.8.0-bookworm@sha256:7cbc7e41c78f055826a9e2498ecac951fdbc1b0cc3b5d70e7ee5d57189a9de41

LABEL "org.opencontainers.image.description"="Headless Kittens Game"

WORKDIR /opt
COPY "node_modules" "node_modules"
COPY "packages/kitten-analysts/package.json" "package.json"
COPY "packages/kitten-analysts/output" "output"

CMD [ "/bin/bash", "-c", "node output/entrypoint-ui.js" ]
