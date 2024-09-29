FROM docker.io/library/node:22.9.0-bookworm@sha256:69e667a79aa41ec0db50bc452a60e705ca16f35285eaf037ebe627a65a5cdf52

LABEL "org.opencontainers.image.description"="Kittens Game with Kitten Science DNA"

ARG REPO=https://github.com/kitten-science/kittensgame.git
ARG BRANCH=feat/caching

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
