FROM docker.io/library/node:22.13.0-bookworm@sha256:816f04d578545be8f3faadaefaa0926c65e67056d9bf2864009976380c2b0713

LABEL "org.opencontainers.image.description"="Headless Kittens Game"

WORKDIR /opt
COPY "node_modules" "node_modules"
COPY "packages/kitten-analysts/package.json" "package.json"
COPY "packages/kitten-analysts/output" "output"

CMD [ "/bin/bash", "-c", "node output/entrypoint-ui.js" ]
