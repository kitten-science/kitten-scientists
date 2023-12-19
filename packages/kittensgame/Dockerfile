FROM docker.io/library/node:20.10.0-bookworm@sha256:c454cb8e4376ab2ac080eb5358ab4d4348a0e66da42886241f972348aa912daa

ARG BRANCH=master

EXPOSE 8080
EXPOSE 8086

RUN git clone --branch $BRANCH --single-branch https://github.com/nuclear-unicorn/kittensgame.git \
  && cd kittensgame \
  && yarn add -D watch-http-server \
  && yarn install

# Copy the script that injects kitten-scientists.inject.js into index.html and execute it.
WORKDIR /kittensgame
COPY "kitten-scientists" "kitten-scientists"
COPY "inject-scientists.js" "inject-scientists.js"
RUN node inject-scientists.js

# Start the development server that serves the Kittens Game.
CMD [ "/bin/bash", "-c", "yarn run watch-http-server" ]
