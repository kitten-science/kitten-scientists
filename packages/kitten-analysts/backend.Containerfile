FROM docker.io/library/node:22.8.0-bookworm@sha256:8ec02324cb37718197de92e51677781be9f1345c709f31a1f44440c6036d24a2

LABEL "org.opencontainers.image.description"="Kitten Analysts Backend"

EXPOSE 7780
EXPOSE 9091
EXPOSE 9093

WORKDIR /opt
COPY "node_modules" "node_modules"
COPY "packages/kitten-analysts/package.json" "package.json"
COPY "packages/kitten-analysts/output" "output"

CMD [ "/bin/bash", "-c", "node output/entrypoint-backend.js" ]
