FROM docker.io/library/node:22.12.0-bookworm@sha256:f7354aa281a8d45e44f4d28269200e1c412e9b41188599326a49506e01a89f97

LABEL "org.opencontainers.image.description"="Kitten Analysts Backend"

EXPOSE 7780
EXPOSE 9091
EXPOSE 9093

WORKDIR /opt
COPY "node_modules" "node_modules"
COPY "packages/kitten-analysts/package.json" "package.json"
COPY "packages/kitten-analysts/output" "output"

CMD [ "/bin/bash", "-c", "node output/entrypoint-backend.js" ]
