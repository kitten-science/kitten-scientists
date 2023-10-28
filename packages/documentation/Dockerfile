FROM squidfunk/mkdocs-material@sha256:772e14ebc0f53435e682c8dbb5ab47b3862a37dfd2c465514602f25bcf52173e
RUN apk add --no-cache g++ libjpeg-turbo-dev ttf-dejavu zlib-dev
RUN python -m pip install --upgrade pip
RUN pip install blockdiag-fences
RUN pip install mkdocs-git-revision-date-localized-plugin
RUN git config --global --add safe.directory /docs
