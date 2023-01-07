# Installation

## Userscript Manager (recommended)

!!! hint

    If you don't have a userscript manager yet, [Tampermonkey](https://www.tampermonkey.net/) is a good solution for the most popular browsers.

The file you need to put into your userscript manager is available from the [Releases page](https://github.com/kitten-science/kitten-scientists/releases) of KS.

KS is released in 3 variants:

1. The **latest stable** release.

    This is a release with a familiar version number, that has been designated as a reasonably stable version to use. At this time, that is:

    <https://github.com/kitten-science/kitten-scientists/releases/tag/v2.0.0-beta.2>.

1. The **nightly** release.

    This release is built each night, if any changes have been made to the source code since the last nightly build.

    These builds usually have a time stamp in their filename, like `20230103`, which designates the night they were built on.

    <https://github.com/kitten-science/kitten-scientists/releases/tag/nightly>

1. The **latest** release.

    This is built after every single change to the codebase. It should be considered highly unstable and experimental, although it usually isn't.

    <https://github.com/kitten-science/kitten-scientists/releases/tag/latest>

## Bookmarklet

You can also load KS through a bookmarklet.

To use bookmarklets, just create a new bookmark in your browser and enter the text below as the URL. When you're on the KG game website, open this bookmark, and it should load KS for you.

!!! note

    This bookmarklet points to the **latest stable** release of KS.

```
javascript:(function(){var d=document,s=d.createElement('script');s.src='https://github.com/kitten-science/kitten-scientists/releases/download/v2.0.0-beta.2/kitten-scientists-2.0.0-beta.2.user.js';d.body.appendChild(s);})();
```

## Container

!!! warning

    If you're not familiar with Docker/OCI containers, then you can safely ignore this section.

You can pull any version of the script as a container. The images are hosted on the [GitHub registry](https://github.com/kitten-science/kitten-scientists/pkgs/container/kitten-scientists).

The container exposes Kittens Game's own development server on port 8080. It has the version of the userscript injected into it, according to the tag on the image.

```shell
docker run --publish 8080:8080 --rm ghcr.io/kitten-science/kitten-scientists:2.0.0-beta.2
```

<!-- prettier-ignore-start -->
*[KG]: Kittens Game
*[KS]: Kitten Scientists
*[UI]: User interface
<!-- prettier-ignore-end -->
