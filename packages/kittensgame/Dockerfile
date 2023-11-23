FROM docker.io/library/node:20.10.0-bookworm@sha256:445acd9b2ef7e9de665424053bf95652e0b8995ef36500557d48faf29300170a

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
