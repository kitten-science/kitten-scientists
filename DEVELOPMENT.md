# Development Guide

## Introduction

The script is written in [TypeScript](https://www.typescriptlang.org/). The JS userscript itself is not intended to be edited. Changes need to be made in [userscript source code](https://github.com/kitten-science/kitten-scientists/tree/main/packages/userscript/source) and then be compiled into the userscript.

The project is set up to be used with [VS Code](https://code.visualstudio.com/). While other editors will work fine, some integrations have been prepared to make the development process easier.

## Prerequisites

The development environment is expected to be a POSIX-compliant system. On Windows, WSL will do fine.

You will need [NodeJS](https://nodejs.org/) to be able to work with the project. The project uses [yarn](https://yarnpkg.com/) as a package and project manager, which is usually integrated with recent NodeJS versions.

Additionally, you will need to have [Docker](https://www.docker.com/get-started) available, to use the container-based Kittens Game development server. If you do not have Docker, you can still build a release version of the script and drop that into your userscript manager.

## Development with Kittens Game Container

The development container provides a version of Kittens Game that already a Kitten Scientists version injected into it, based on your local development state.

1. Manual Refresh (recommended)

    Build the development container and start it.

    ```shell
    yarn devcontainer:run
    ```

    The script prints the URL where you can now play the game with KS installed.

    You will need to manually reload the page after each build to get the latest changes in the browser.

1. Watcher (experimental)

    Start a watcher to continuously rebuild KS when you make code changes.

    ```shell
    yarn userscript:watch
    ```

    > This task can also be started directly in VS Code, using the **Run Task** command.

When the container is built, it downloads the latest version of the game from https://bitbucket.org/bloodrizer/kitten-game.

## Development without Container

To develop without containers, you can build a development version of the userscript with full debugging information.

1. Run the build script.

    ```shell
    yarn userscript:preview
    ```

    The userscript is placed in the `packages/userscript/output` directory.

## Type-Checking

To fill the **Problems** panel in VS Code with all current, type-related errors, run the `typecheck:all` npm task in VS Code.

## Releases

### Building a Release Version of the Userscript

Run the script to build the release:

```shell
yarn userscript:release
```

### Releasing a New Version

1. Build a preview of the script:

    ```bash
    yarn userscript:preview
    ```

1. Load the built preview into a userscript manager in Chrome and perform a quick, manual test.

    1. Does the script load at all?
    1. Are settings restored to expectation?
    1. Are settings saved when they are changed?

1. Create a tag for this version:

    ```bash
    git tag v2.0.0-beta.9
    ```

1. Push the tag:

    ```bash
    git push --tags
    ```

1. Raise the version number in `packages/userscript/package.json` to a higher version that will be in development next!

1. Make sure to also update the `README.md` to point the bookmarklet to the new script.

1. Make sure to also update the `.github/bug_report.yml` to mention the latest version number.
