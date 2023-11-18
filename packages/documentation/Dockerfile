FROM squidfunk/mkdocs-material@sha256:2c57e4d0fe6ad69e38e1198a59871638256ab9fdeab74f0fe79b42d6b380a23f
RUN apk add --no-cache g++ libjpeg-turbo-dev ttf-dejavu zlib-dev
RUN python -m pip install --upgrade pip
RUN pip install blockdiag-fences
RUN pip install mkdocs-git-revision-date-localized-plugin
RUN git config --global --add safe.directory /docs
