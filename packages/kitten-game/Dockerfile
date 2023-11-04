FROM docker.io/library/node:21.1.0-bookworm@sha256:0052410af98158173b17a26e0e2a46a3932095ac9a0ded660439a8ffae65b1e3

ARG BRANCH=master

EXPOSE 8080

RUN git clone https://bitbucket.org/bloodrizer/kitten-game.git && \
  cd kitten-game && \
  git checkout $BRANCH && \
  yarn install

# Copy the script that injects kitten-scientists.inject.js into index.html and execute it.
WORKDIR /kitten-game
COPY "kitten-scientists" "kitten-scientists"
COPY "inject-scientists.js" "inject-scientists.js"
RUN node inject-scientists.js

# Start the development server that serves the Kittens Game.
CMD [ "/bin/bash", "-c", "yarn start" ]
