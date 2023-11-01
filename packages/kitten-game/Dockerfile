FROM node:20-bookworm@sha256:be4ad7f6808f747a611a374a786bf625382592310d47e6014004a97b473bdd4e

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
