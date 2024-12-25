FROM docker.io/library/node:22.12.0-bookworm@sha256:71972a1c6569a4b2e8b555d1558a5b08993142b110f93e16c2729feac6aa27f6

LABEL "org.opencontainers.image.description"="Headless Kittens Game"

WORKDIR /opt
COPY "node_modules" "node_modules"
COPY "packages/kitten-analysts/package.json" "package.json"
COPY "packages/kitten-analysts/output" "output"

CMD [ "/bin/bash", "-c", "node output/entrypoint-ui.js" ]
