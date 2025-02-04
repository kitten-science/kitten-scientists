FROM docker.io/library/node:22.13.1-bookworm@sha256:debe7ff79b1a92c699629d685c4b69ba531172d6dfd89e145fa528bfb18eefb7

LABEL "org.opencontainers.image.description"="Headless Kittens Game"

WORKDIR /opt
COPY "node_modules" "node_modules"
COPY "packages/kitten-analysts/package.json" "package.json"
COPY "packages/kitten-analysts/output" "output"

CMD [ "/bin/bash", "-c", "node output/entrypoint-ui.js" ]
