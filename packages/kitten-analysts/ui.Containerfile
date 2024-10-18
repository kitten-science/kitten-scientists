FROM docker.io/library/node:22.10.0-bookworm@sha256:f8ee7f5834a708ddc9f69090a3db24788c28a87f0947703e735404b2be71a53d

LABEL "org.opencontainers.image.description"="Headless Kittens Game"

WORKDIR /opt
COPY "node_modules" "node_modules"
COPY "packages/kitten-analysts/package.json" "package.json"
COPY "packages/kitten-analysts/output" "output"

CMD [ "/bin/bash", "-c", "node output/entrypoint-ui.js" ]
