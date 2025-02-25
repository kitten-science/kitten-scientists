FROM docker.io/library/node:22.14.0-bookworm@sha256:a27967171a54d13b85387675fe0362f77e969c7a8abad2faaee45490ad48fd52

LABEL "org.opencontainers.image.description"="Kitten Analysts Backend"

EXPOSE 7780
EXPOSE 9091
EXPOSE 9093

WORKDIR "/opt"
COPY [ ".", "packages/kitten-analysts", "/opt" ]
CMD [ "/bin/bash", "-c", "node output/entrypoint-backend.js" ]
