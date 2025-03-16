# Development Container

## with published

```shell
docker run \
    --detach \
    --name devcontainer \
    --publish 8086:8086 \
    --publish 9080:8080 \
    ghcr.io/kitten-science/devcontainer:nightly
```

```shell
docker run \
    --detach \
    --mount type=bind,source="devcontainer/overlay",target=/kittensgame/overlay \
    --name devcontainer \
    --publish 8086:8086 \
    --publish 9080:8080 \
    ghcr.io/kitten-science/devcontainer:nightly
```

## with local

```shell
make devcontainer-oci
podman run \
    --detach \
    --mount type=bind,source="devcontainer/overlay",target=/kittensgame/overlay \
    --name devcontainer \
    --publish 8086:8086 \
    --publish 9080:8080 \
    localhost/devcontainer:latest
```

## clean up

```shell
sudo docker stop devcontainer; sudo docker rm devcontainer
podman stop devcontainer; podman rm devcontainer
```