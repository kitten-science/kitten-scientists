FROM squidfunk/mkdocs-material@sha256:f486dc932650bbbf71b83862715b842248973f1e240bf032c44ffe71906c40a4
RUN apk add --no-cache g++ libjpeg-turbo-dev ttf-dejavu zlib-dev
RUN python -m pip install --upgrade pip
RUN pip install blockdiag-fences
RUN pip install mkdocs-git-revision-date-localized-plugin
RUN git config --global --add safe.directory /docs
