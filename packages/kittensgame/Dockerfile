FROM docker.io/library/node:20.15.1-bookworm@sha256:34cc48658dd212db8b5494311c4a0d1c31121a172f89475e2dbd3dbe851d515c

ARG REPO=https://github.com/nuclear-unicorn/kittensgame.git
ARG BRANCH=master

EXPOSE 8080
EXPOSE 8086

RUN git clone --branch "$BRANCH" --single-branch "$REPO" \
  && cd kittensgame \
  && git pull \
  && yarn add -D watch-http-server \
  && yarn install

# Copy the script that injects kitten-scientists.inject.js into index.html and execute it.
WORKDIR /kittensgame
COPY "kitten-scientists" "kitten-scientists"
COPY "inject-scientists.js" "inject-scientists.js"
RUN node inject-scientists.js

# Start the development server that serves the Kittens Game.
CMD [ "/bin/bash", "-c", "yarn run watch-http-server" ]
