FROM squidfunk/mkdocs-material@sha256:fc42bac0005e79c2b2dd576e72103b06932c30c7b7b455a1f9cd3d39b187d49d
RUN apk add --no-cache g++ libjpeg-turbo-dev ttf-dejavu zlib-dev
RUN python -m pip install --upgrade pip
RUN pip install blockdiag-fences
RUN pip install mkdocs-git-revision-date-localized-plugin
RUN git config --global --add safe.directory /docs
