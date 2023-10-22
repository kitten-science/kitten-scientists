FROM node:20-bookworm@sha256:bd20621deff56cb66c6cd10772d26db1a0d480f2b08609eb96b799ba6260f3ed

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
