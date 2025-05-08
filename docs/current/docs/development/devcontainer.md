# Development Container

## Quick Start

=== "Docker"

    ```shell
    sudo docker run \
        ghcr.io/kitten-science/devcontainer:nightly
    ```

=== "Podman"

    ```shell
    podman run \
        ghcr.io/kitten-science/devcontainer:nightly
    ```

## Full Background Example

=== "Docker"

    ```shell
    sudo docker run \
        --detach \
        --mount type=bind,source="devcontainer/overlay",target=/kittensgame/overlay \
        --name devcontainer \
        --publish 8080 \
        --publish 8086 \
        --replace \
        ghcr.io/kitten-science/devcontainer:nightly
    ```

=== "Podman"

    ```shell
    podman run \
        --detach \
        --mount type=bind,source="devcontainer/overlay",target=/kittensgame/overlay \
        --name devcontainer \
        --publish 8080 \
        --publish 8086 \
        --replace \
        ghcr.io/kitten-science/devcontainer:nightly
    ```

## Publish Ports

The container exposes these ports:

1. `8080` - HTTP Browser interface
1. `8086` - WebSocket Browser interface

=== "Docker"

    ```shell
    sudo docker run \
        --publish 9080:8080 \
        --publish 9086:8086 \
        ghcr.io/kitten-science/devcontainer:nightly
    ```

=== "Podman"

    ```shell
    podman run \
        --publish 9080:8080 \
        --publish 9086:8086 \
        ghcr.io/kitten-science/devcontainer:nightly
    ```

## Use Local Output

=== "Docker"

    ```shell
    sudo docker run \
        --mount type=bind,source="devcontainer/overlay",target=/kittensgame/overlay \
        ghcr.io/kitten-science/devcontainer:nightly
    ```

=== "Podman"

    ```shell
    podman run \
        --mount type=bind,source="devcontainer/overlay",target=/kittensgame/overlay \
        ghcr.io/kitten-science/devcontainer:nightly
    ```

## Use Local OCI (Advanced)

The container itself is not very complicated, and rarely needs to be built locally.

=== "Docker"

    ```shell
    make devcontainer-oci
    sudo docker run \
        localhost/devcontainer:latest
    ```

=== "Podman"

    ```shell
    make devcontainer-oci
    podman run \
        localhost/devcontainer:latest
    ```

## Clean Up

=== "Docker"

    ```shell
    sudo docker stop devcontainer
    sudo docker rm devcontainer
    ```

=== "Podman"

    ```shell
    podman stop devcontainer;
    podman rm devcontainer
    ```
