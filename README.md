![A kitten scientist](.github/cover.png)

# Kitten Scientists v2

Kitten Scientists (KS) is a simple automation script for the complex [Kittens Game](http://kittensgame.com/web/). It was originally developed by [Cameron Condry](https://github.com/cameroncondry/cbc-kitten-scientists) and extended by many great [contributors](#contributors).

## Installation

### Userscript Manager (recommended)

Grab a build from the [Releases page](https://github.com/kitten-science/kitten-scientists/releases) and install it.

> If you don't have a userscript manager yet, [Tampermonkey](https://www.tampermonkey.net/) is a good solution for the most popular browsers.

### Bookmarklet

```
javascript:(function(){var d=document,s=d.createElement('script');s.src='https://github.com/kitten-science/kitten-scientists/releases/download/v2.0.0-beta.2/kitten-scientists-2.0.0-beta.2.user.js';d.body.appendChild(s);})();
```

### Container

You can pull any version of the script as a container. The images are hosted on the [GitHub registry](https://github.com/kitten-science/kitten-scientists/pkgs/container/kitten-scientists).

The container exposes Kittens Game's own development server on port 8080. It has the version of the userscript injected into it, according to the tag on the image.

```shell
docker run --publish 8080:8080 --rm ghcr.io/kitten-science/kitten-scientists:2.0.0-beta.2
```

## Documentation

For a full explaination of how everything in Kitten Scientists works, please visit the [documentation](https://kitten-science.github.io/kitten-scientists/).

## Contributing

You are welcome to [open a discussion](https://github.com/kitten-science/kitten-scientists/discussions/new) if you have any questions, and [open an issue on the issue tracker](https://github.com/kitten-science/kitten-scientists/issues/new/choose) if something goes wrong in your game. If you're not sure which option to pick, just create an issue.

## Contributors

A lot of thanks goes out to all the amazing people who contributed to Kitten Scientists 1.5 in the past.

-   [Cameron Condry](https://github.com/cameroncondry)
-   [adituv](https://github.com/adituv)
-   [amaranth](https://github.com/amaranth)
-   [Azulan](https://www.reddit.com/user/Azulan)
-   [carver](https://github.com/carver)
-   [coderpatsy](https://github.com/coderpatsy)
-   [cokernel](https://github.com/cokernel)
-   [DirCattus](https://www.reddit.com/user/DirCattus)
-   [DrGaellon](https://github.com/DrGaellon)
-   Eliezer Kanal
-   [enki1337](https://github.com/enki1337)
-   [FancyRabbitt](https://www.reddit.com/user/FancyRabbitt)
-   [gnidan](https://github.com/gnidan)
-   [Hastebro](https://github.com/Hastebro)
-   [hypehuman](https://github.com/hypehuman)
-   [ironchefpython](https://github.com/ironchefpython)
-   [jacob-keller](https://github.com/jacob-keller)
-   [jcranmer](https://github.com/jcranmer)
-   [KMChappell](https://github.com/KMChappell)
-   [Kobata](https://github.com/Kobata)
-   [magus424](https://github.com/magus424)
-   [mammothb](https://github.com/mammothb)
-   [markuskeunecke](https://github.com/markuskeunecke)
-   [Meleneth](https://github.com/meleneth)
-   [Mewnine](https://www.reddit.com/user/Mewnine)
-   [mjdillon](https://github.com/mjdillon)
-   [mmccubbing](https://github.com/mmccubbing)
-   [NoobKitten](https://github.com/NoobKitten)
-   [oliversalzburg](https://github.com/oliversalzburg)
-   [pefoley2](https://www.reddit.com/user/pefoley2)
-   [Phoenix09](https://github.com/Phoenix09)
-   [poizan42](https://github.com/poizan42)
-   [riannucci](https://github.com/riannucci)
-   [romanalexander](https://github.com/romanalexander)
-   [sapid](https://github.com/sapid)
-   [sjdrodge](https://github.com/sjdrodge)
-   [SphtMarathon](https://www.reddit.com/user/SphtMarathon)
-   [TeWeBu](https://github.com/TeWeBu)
-   [toadjaune](https://github.com/toadjaune)
-   Tom Rauchenwald
-   [trini](https://github.com/trini)
-   [woutershep](https://github.com/woutershep)
-   [Wymrite](https://github.com/Wymrite)
-   [Xanidel](https://github.com/Xanidel)
-   [zelenay](https://github.com/zelenay)

> If you want to see a live view of contributors for this repository, you can see it at <https://github.com/kitten-science/kitten-scientists/graphs/contributors>.
