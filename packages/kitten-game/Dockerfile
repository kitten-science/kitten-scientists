FROM node:12

EXPOSE 8080

RUN git clone https://bitbucket.org/bloodrizer/kitten-game.git && \
  cd kitten-game && \
  yarn install

WORKDIR /kitten-game
COPY "inject-scientists.js" "inject-scientists.js"
RUN node inject-scientists.js

CMD [ "/bin/bash", "-c", "yarn start" ]
