FROM node:12

RUN git clone https://bitbucket.org/bloodrizer/kitten-game.git && \
  cd kitten-game && \
  yarn install

RUN cp /kitten-game/index.html /kitten-game/index.html.orig

EXPOSE 8080

WORKDIR /kitten-game
CMD [ "/bin/bash", "-c","yarn start" ]
