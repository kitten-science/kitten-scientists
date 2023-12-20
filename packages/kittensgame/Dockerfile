FROM docker.io/library/node:20.10.0-bookworm@sha256:8d0f16fe841577f9317ab49011c6d819e1fa81f8d4af7ece7ae0ac815e07ac84

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
