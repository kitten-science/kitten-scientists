FROM docker.io/library/node:22.9.0-bookworm@sha256:8398ea18b8b72817c84af283f72daed9629af2958c4f618fe6db4f453c5c9328

LABEL "org.opencontainers.image.description"="Headless Kittens Game"

WORKDIR /opt
COPY "node_modules" "node_modules"
COPY "packages/kitten-analysts/package.json" "package.json"
COPY "packages/kitten-analysts/output" "output"

CMD [ "/bin/bash", "-c", "node output/entrypoint-ui.js" ]
