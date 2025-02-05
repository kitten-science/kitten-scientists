FROM docker.io/library/node:22.13.1-bookworm@sha256:5145c882f9e32f07dd7593962045d97f221d57a1b609f5bf7a807eb89deff9d6

LABEL "org.opencontainers.image.description"="Headless Kittens Game"

WORKDIR /opt
COPY "node_modules" "node_modules"
COPY "packages/kitten-analysts/package.json" "package.json"
COPY "packages/kitten-analysts/output" "output"

CMD [ "/bin/bash", "-c", "node output/entrypoint-ui.js" ]
