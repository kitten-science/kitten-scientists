# Development Container

The development container is an OCI that you can run with Docker or other container runtimes. It provides a copy of the game, with the script already loaded into it. This allows you to make changes to the script, and quickly evaluate these changes, without having to build a userscript and load that into your userscript manager.

!!! info
    The Kitten Science Development Containers are not to be confused with [VS Code Dev Containers](https://code.visualstudio.com/docs/devcontainers/create-dev-container). Kitten Science tries to be agnostic about development environments, and does not directly support features exclusive to VS Code.

## Quick Start

The easiest way to get started is to just run the published OCI as-is.

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

Of course, this won't help you much with development, as the source code in the container is static. Read the further examples to see how to add more functionality.

## Full Background Example

More commonly, you will spawn the development container as a background task (`--detach`), and mount your local `overlay` output directory into the container.

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

1. `8080` - HTTP Browser interface. You might want to use a different port, if `8080` is already in use by another process.
1. `8086` - WebSocket Browser connection for auto-reload. Exposing this on a different port, will prevent the auto-reload from working correctly.

=== "Docker"

    ```shell
    sudo docker run \
        --publish 9080:8080 \
        --publish 8086 \
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
    podman stop devcontainer
    podman rm devcontainer
    ```

## Using the Kitten Analysts Development Container

_todo_

## Running the Kitten Analysts Backend

_todo_
