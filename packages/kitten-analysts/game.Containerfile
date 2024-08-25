FROM docker.io/library/node:20.15.1-bookworm@sha256:6326b52a508f0d99ffdbfaa29a69380321b215153db6f32974835bac71b38fa4

LABEL "org.opencontainers.image.description"="Kittens Game with Kitten Science DNA"

ARG REPO=https://github.com/kitten-science/kittensgame.git
ARG BRANCH=feat/kgnet-iteration

EXPOSE 8080

RUN git clone --branch "$BRANCH" --single-branch "$REPO" \
  && cd kittensgame \
  && yarn install

WORKDIR /kittensgame
COPY "packages/kitten-analysts/headless.html" "headless.html"
COPY "packages/kitten-analysts/output" "kitten-analysts"
COPY "packages/kitten-engineers/output" "kitten-engineers"
COPY "packages/kitten-scientists/output" "kitten-scientists"
COPY "packages/kitten-analysts/inject-scripts.js" "inject-scripts.js"
RUN node inject-scripts.js

# Start the development server that serves the Kittens Game.
CMD [ "/bin/bash", "-c", "yarn run start" ]
