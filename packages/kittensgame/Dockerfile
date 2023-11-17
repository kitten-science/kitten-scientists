FROM docker.io/library/node:20.9.0-bookworm@sha256:5f21943fe97b24ae1740da6d7b9c56ac43fe3495acb47c1b232b0a352b02a25c

ARG BRANCH=master

EXPOSE 8080

RUN git clone https://github.com/nuclear-unicorn/kittensgame.git \
  && cd kittensgame \
  && git checkout $BRANCH \
  && yarn install

# Copy the script that injects kitten-scientists.inject.js into index.html and execute it.
WORKDIR /kittensgame
COPY "kitten-scientists" "kitten-scientists"
COPY "inject-scientists.js" "inject-scientists.js"
RUN node inject-scientists.js

# Start the development server that serves the Kittens Game.
CMD [ "/bin/bash", "-c", "yarn start" ]
