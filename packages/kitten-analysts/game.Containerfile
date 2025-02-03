FROM docker.io/library/node:22.13.1-bookworm@sha256:ae2f3d4cc65d251352eca01ba668824f651a2ee4d2a37e2efb22649521a483fd

LABEL "org.opencontainers.image.description"="Kittens Game with Kitten Science DNA"

ARG REPO=https://github.com/nuclear-unicorn/kittensgame.git
ARG BRANCH=master

EXPOSE 8080

RUN git clone --branch "$BRANCH" --single-branch "$REPO" \
  && cd kittensgame \
  && yarn install

WORKDIR /kittensgame
COPY "packages/kitten-analysts/headless.html" "headless.html"
COPY "packages/kitten-analysts/output" "kitten-analysts"
COPY "packages/kitten-engineers/output" "kitten-engineers"
COPY "packages/kitten-scientists/output" "kitten-scientists"
COPY "packages/devcontainer/output/inject-scripts.mjs" "inject-scripts.mjs"
COPY "packages/devcontainer/output/rewrite-index.mjs" "rewrite-index.mjs"
RUN node rewrite-index.mjs
RUN node inject-scripts.mjs

# Start the development server that serves the Kittens Game.
CMD [ "/bin/bash", "-c", "yarn run start" ]
