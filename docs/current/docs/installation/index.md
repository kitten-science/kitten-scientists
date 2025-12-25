# Installation

## Userscript Manager (recommended)

The file you need to put into your userscript manager is available from the [Releases page](https://github.com/kitten-science/kitten-scientists/releases) of KS. KS is released in 2 important variants:

1. The **latest stable** release.

    <https://github.com/kitten-science/kitten-scientists/releases/tag/v2.0.0-beta.11>

    This is a release with a familiar version number, that has been designated as a reasonably stable version to use.
    

1. The **nightly** release.

    <https://github.com/kitten-science/kitten-scientists/releases/tag/nightly>

    This release is built each night, if any changes have been made to the source code since the last nightly build.

    These builds usually have a time stamp in their filename, like `20230103`, which designates the night they were built on.

!!! hint

    If you don't have a userscript manager yet, [Tampermonkey](https://www.tampermonkey.net/) is a good solution for the most popular browsers.

## Bookmarklet

You can also load KS through a bookmarklet.

To use bookmarklets, just create a new bookmark in your browser and enter the text below as the URL. When you're on the KG game website, open this bookmark, and it should load KS for you.

```
javascript:(function(){var d=document,s=d.createElement('script');s.src='https://kitten-science.com/stable.js';d.body.appendChild(s);})();
```

!!! note

    This bookmarklet points to the **latest stable** release of KS.

This bookmarklet uses <https://kitten-science.com/stable.js>, the stable release. You can also replace that URL with the [nightly](https://kitten-science.com/nightly.js) build.

*[KG]: Kittens Game
*[KS]: Kitten Scientists
*[UI]: User interface
