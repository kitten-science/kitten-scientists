FROM squidfunk/mkdocs-material
RUN apk add --no-cache g++ libjpeg-turbo-dev ttf-dejavu zlib-dev
RUN python -m pip install --upgrade pip
RUN pip install blockdiag-fences
RUN pip install mkdocs-git-revision-date-localized-plugin
RUN git config --global --add safe.directory /docs
