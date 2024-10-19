FROM docker.io/library/node:22.10.0-bookworm@sha256:ea545571f3d84e512ac6c34f40ccf2dbeb1b01136c092999360d5ced5df3e291

LABEL "org.opencontainers.image.description"="Headless Kittens Game"

WORKDIR /opt
COPY "node_modules" "node_modules"
COPY "packages/kitten-analysts/package.json" "package.json"
COPY "packages/kitten-analysts/output" "output"

CMD [ "/bin/bash", "-c", "node output/entrypoint-ui.js" ]
