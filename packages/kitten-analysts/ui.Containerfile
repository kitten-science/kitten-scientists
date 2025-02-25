FROM docker.io/library/node:22.14.0-bookworm@sha256:a27967171a54d13b85387675fe0362f77e969c7a8abad2faaee45490ad48fd52

LABEL "org.opencontainers.image.description"="Headless Kittens Game"

WORKDIR "/opt"
COPY [ ".", "packages/kitten-analysts", "/opt" ]
CMD [ "/bin/bash", "-c", "node output/entrypoint-ui.js" ]
