FROM docker.io/library/node:22.11.0-bookworm@sha256:6eb1af33c8fc1104f23efdd15f1e791570395eab3d0fb597087d18a4ab1f7b65

LABEL "org.opencontainers.image.description"="Headless Kittens Game"

WORKDIR /opt
COPY "node_modules" "node_modules"
COPY "packages/kitten-analysts/package.json" "package.json"
COPY "packages/kitten-analysts/output" "output"

CMD [ "/bin/bash", "-c", "node output/entrypoint-ui.js" ]
