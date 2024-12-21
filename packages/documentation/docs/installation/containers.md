# Containers

You can pull any version of the script as a container. The images are hosted on the [GitHub registry](https://github.com/kitten-science/kitten-scientists/pkgs/container/kitten-scientists).

The container exposes Kittens Game's own development server on port 8080. It has the version of the userscript injected into it, according to the tag on the image.

```shell
docker run --publish 8080:8080 --rm ghcr.io/kitten-science/kitten-scientists:2.0.0-beta.8
```

<!-- prettier-ignore-start -->
*[KG]: Kittens Game
*[KS]: Kitten Scientists
*[UI]: User interface
<!-- prettier-ignore-end -->
