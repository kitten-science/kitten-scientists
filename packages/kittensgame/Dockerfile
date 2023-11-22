FROM docker.io/library/node:20.9.0-bookworm@sha256:146bbe4eaee99ae885be2a0a767f63a4b96032141d70d80e590f10e0d7ebabcb

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
