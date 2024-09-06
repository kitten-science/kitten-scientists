FROM docker.io/library/node:22.8.0-bookworm@sha256:c6add15c26b86f1ad3f43c8339cf04da4b01984b6b348d9879f9509049381252

LABEL "org.opencontainers.image.description"="Headless Kittens Game"

WORKDIR /opt
COPY "node_modules" "node_modules"
COPY "packages/kitten-analysts/package.json" "package.json"
COPY "packages/kitten-analysts/output" "output"

CMD [ "/bin/bash", "-c", "node output/entrypoint-ui.js" ]
