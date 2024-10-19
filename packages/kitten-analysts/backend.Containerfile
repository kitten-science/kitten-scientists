FROM docker.io/library/node:22.10.0-bookworm@sha256:545b0979454e889c3a49a4b2dff2c80cdb4ab37ac3e7053ecc1257b097dc81d5

LABEL "org.opencontainers.image.description"="Kitten Analysts Backend"

EXPOSE 7780
EXPOSE 9091
EXPOSE 9093

WORKDIR /opt
COPY "node_modules" "node_modules"
COPY "packages/kitten-analysts/package.json" "package.json"
COPY "packages/kitten-analysts/output" "output"

CMD [ "/bin/bash", "-c", "node output/entrypoint-backend.js" ]
