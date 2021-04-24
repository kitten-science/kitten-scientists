FROM node:12

RUN git clone https://bitbucket.org/bloodrizer/kitten-game.git && \
  cd kitten-game && \
  yarn install

EXPOSE 8080

WORKDIR /kitten-game
CMD [ "/bin/bash", "-c","yarn start" ]
