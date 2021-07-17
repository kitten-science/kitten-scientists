# Development Guide

## Active development on the script

### Prerequisites

The development environment is expected to be a POSIX-compliant system. On Windows, WSL will do fine.

Additionally, you will need to have Docker available.

1. Build the development container and start it.

```shell
yarn devcontainer:run
```

The script prints the URL where you can now play the game with KS installed.

2. Start a watcher to continuously rebuild KS when you make code changes.

```shell
yarn userscript:watch
```

You will need to manually reload the page after each build to get the latest changes in the browser.

## Building a release of the userscript

1. Run the script to build the release:

```shell
yarn userscript:release
```
