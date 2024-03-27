FROM docker.io/library/node:20.12.0-bookworm@sha256:bf0ef0687ffbd6c7742e1919177826c8bf1756a68b51f003dcfe3a13c31c65fe

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
