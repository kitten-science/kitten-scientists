FROM node:18-buster

EXPOSE 8080

RUN git clone https://bitbucket.org/bloodrizer/kitten-game.git && \
  cd kitten-game && \
  yarn install

# Copy the script that injects kitten-scientists.inject.js into index.html and execute it.
WORKDIR /kitten-game
COPY "kitten-scientists" "kitten-scientists"
COPY "inject-scientists.js" "inject-scientists.js"
RUN node inject-scientists.js

# Start the development server that serves the Kittens Game.
CMD [ "/bin/bash", "-c", "yarn start" ]
