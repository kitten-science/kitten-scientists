# Development Container

```shell
docker run \
    --detach \
    --mount type=bind,source="devcontainer/overlay",target=/kittensgame/overlay \
    --name devcontainer \
    --publish 8100:8080 \
    kitten-science/devcontainer:nightly
```
