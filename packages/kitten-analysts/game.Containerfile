FROM docker.io/library/node:22.14.0-bookworm@sha256:a27967171a54d13b85387675fe0362f77e969c7a8abad2faaee45490ad48fd52

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
