FROM docker.io/library/node:22.11.0-bookworm@sha256:f496dba5f685ef33797ed5882b4ce209053db67f88b50c1484ecccba6531bfde

LABEL "org.opencontainers.image.description"="Headless Kittens Game"

WORKDIR /opt
COPY "node_modules" "node_modules"
COPY "packages/kitten-analysts/package.json" "package.json"
COPY "packages/kitten-analysts/output" "output"

CMD [ "/bin/bash", "-c", "node output/entrypoint-ui.js" ]
