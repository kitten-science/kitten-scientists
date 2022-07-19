FROM node:18

EXPOSE 8080

RUN git clone https://bitbucket.org/bloodrizer/kitten-game.git && \
  cd kitten-game && \
  yarn install

# The entire build output directory will be mounted inside the docker container at /kitten-game/build.
# If the build process changes the inode of the kitten-scientists.inject.js file, then the new
# file will be visible inside the container. In contrast, if only the single file is mounted inside
# the container, then the mount is tied to that specific inode. Build updates that change the inode
# will not be visible in the container.
RUN mkdir -p /kitten-game/build

# Also symlink to the build artifact from the /kitten-game directory, where inject-scientists.js
# normally expects to find the file.
RUN ln -s /kitten-game/build/kitten-scientists.inject.js /kitten-game/kitten-scientists.inject.js

WORKDIR /kitten-game
COPY "inject-scientists.js" "inject-scientists.js"
RUN node inject-scientists.js

CMD [ "/bin/bash", "-c", "yarn start" ]
