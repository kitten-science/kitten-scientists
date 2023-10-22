FROM squidfunk/mkdocs-material@sha256:df9409b9be06e6964c23013002169805de5910db9f53d916d6ce28fb1e9088cb
RUN apk add --no-cache g++ libjpeg-turbo-dev ttf-dejavu zlib-dev
RUN python -m pip install --upgrade pip
RUN pip install blockdiag-fences
RUN pip install mkdocs-git-revision-date-localized-plugin
RUN git config --global --add safe.directory /docs
