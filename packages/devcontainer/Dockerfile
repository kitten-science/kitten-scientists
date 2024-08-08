FROM docker.io/library/node:20.16.0-bookworm@sha256:1ae9ba874435551280e95c8a8e74adf8a48d72b564bf9dfe4718231f2144c88f

ARG REPO=https://github.com/nuclear-unicorn/kittensgame.git
ARG BRANCH=master

EXPOSE 8080
EXPOSE 8086

RUN git clone --branch "$BRANCH" --single-branch "$REPO" \
  && cd kittensgame \
  && git pull \
  && yarn add -D watch-http-server \
  && yarn install

WORKDIR /kittensgame
COPY "kitten-analysts" "kitten-analysts"
COPY "kitten-scientists" "kitten-scientists"
COPY "inject-scripts.js" "inject-scripts.js"
RUN node inject-scripts.js

# Start the development server that serves the Kittens Game.
CMD [ "/bin/bash", "-c", "yarn run watch-http-server" ]
