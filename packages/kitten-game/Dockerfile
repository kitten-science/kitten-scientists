FROM node:21-bookworm@sha256:834d7a2cdaa7b3e760a7a6a2d5bac300ac824eaf6b631242360dd65352111f1b

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
