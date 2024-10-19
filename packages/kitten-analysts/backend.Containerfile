FROM docker.io/library/node:22.10.0-bookworm@sha256:da53547a061beb7f11f58ee2231589b999acfca89bdf6dfd740627340c879f63

LABEL "org.opencontainers.image.description"="Kitten Analysts Backend"

EXPOSE 7780
EXPOSE 9091
EXPOSE 9093

WORKDIR /opt
COPY "node_modules" "node_modules"
COPY "packages/kitten-analysts/package.json" "package.json"
COPY "packages/kitten-analysts/output" "output"

CMD [ "/bin/bash", "-c", "node output/entrypoint-backend.js" ]
