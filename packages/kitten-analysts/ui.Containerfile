FROM docker.io/library/node:22.11.0-bookworm@sha256:db556c2974040f7812c7f39c15afb1e8b1901d6e23f1975ff71b5236a1244e52

LABEL "org.opencontainers.image.description"="Headless Kittens Game"

WORKDIR /opt
COPY "node_modules" "node_modules"
COPY "packages/kitten-analysts/package.json" "package.json"
COPY "packages/kitten-analysts/output" "output"

CMD [ "/bin/bash", "-c", "node output/entrypoint-ui.js" ]
