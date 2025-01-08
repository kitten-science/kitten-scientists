FROM docker.io/library/node:22.13.0-bookworm@sha256:40500dee24186ae165e667b219de8a1757c00f2cdecf7ea552fc1cd1b66a842b

LABEL "org.opencontainers.image.description"="Headless Kittens Game"

WORKDIR /opt
COPY "node_modules" "node_modules"
COPY "packages/kitten-analysts/package.json" "package.json"
COPY "packages/kitten-analysts/output" "output"

CMD [ "/bin/bash", "-c", "node output/entrypoint-ui.js" ]
