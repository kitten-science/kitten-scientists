FROM docker.io/library/node:22.13.0-bookworm@sha256:d77c6457d4318c6ef537dbf9fe86f36bfb997d280c9f949e3a1d968cf841390d

LABEL "org.opencontainers.image.description"="Headless Kittens Game"

WORKDIR /opt
COPY "node_modules" "node_modules"
COPY "packages/kitten-analysts/package.json" "package.json"
COPY "packages/kitten-analysts/output" "output"

CMD [ "/bin/bash", "-c", "node output/entrypoint-ui.js" ]
