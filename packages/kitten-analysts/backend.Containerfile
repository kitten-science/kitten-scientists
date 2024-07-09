FROM node:22.4.0@sha256:2558f19e787cb0baed81a8068adf7509023b43dedce24ed606f8a01522b21313

LABEL "org.opencontainers.image.description"="Kitten Analysts Backend"

WORKDIR /opt
COPY "node_modules" "node_modules"
COPY "packages/kitten-analysts/package.json" "package.json"
COPY "packages/kitten-analysts/output" "output"

CMD [ "/bin/bash", "-c", "node output/entrypoint-backend.js" ]
