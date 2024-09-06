FROM docker.io/library/node:22.8.0-bookworm@sha256:bd00c03095f7586432805dbf7989be10361d27987f93de904b1fc003949a4794

LABEL "org.opencontainers.image.description"="Headless Kittens Game"

WORKDIR /opt
COPY "node_modules" "node_modules"
COPY "packages/kitten-analysts/package.json" "package.json"
COPY "packages/kitten-analysts/output" "output"

CMD [ "/bin/bash", "-c", "node output/entrypoint-ui.js" ]
