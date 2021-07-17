# Development Guide

## Active development on the script

The project is set up to be used with [VS Code](https://code.visualstudio.com/). While other editors will work fine, some integrations have been prepared to make the development process easier.

### Introduction

The script is written in [TypeScript](https://www.typescriptlang.org/). The JS userscript itself is not intended to be edited. Changes need to be made in [userscript source code](https://github.com/oliversalzburg/cbc-kitten-scientists/tree/master/packages/userscript/source) and then be compiled into the userscript.

### Prerequisites

The development environment is expected to be a POSIX-compliant system. On Windows, WSL will do fine.

You will need [NodeJS](https://nodejs.org/) and [yarn](https://yarnpkg.com/getting-started/install) to be able to work with the project.

Additionally, you will need to have [Docker](https://www.docker.com/get-started) available, to use the container-based Kitten Game development server. If you do not have Docker, you can still build a release version of the script and drop that into your userscript manager.

### Development (with Kitten Game container)

The development container provides a version of Kitten Game that already a Kitten Scientists version injected into it, based on your local development state.

1. Start a watcher to continuously rebuild KS when you make code changes.

   ```shell
   yarn userscript:watch
   ```

   > This task can also be started directly in VS Code, using the **Run Task** command.

1. Build the development container and start it.

   ```shell
   yarn devcontainer:run
   ```

   The script prints the URL where you can now play the game with KS installed.

   You will need to manually reload the page after each build to get the latest changes in the browser.

When the container is built, it downloads the latest version of the game from https://bitbucket.org/bloodrizer/kitten-game.

Additionally, the Kitten Scientists will use a pre-configured set of options. This makes it easier to always start debugging with a defined state.

If you need to make changes to either the stored game state or the pre-configured options, see the [`packages/userscript/source/fixtures`](https://github.com/oliversalzburg/cbc-kitten-scientists/tree/master/packages/userscript/source/fixtures) directory.
The savegame data is a simple export from the game and the settings are a copy of the object that is stored in localStorage. This can be accessed through the DevTools of the browser.

If you have another savegame to load, you can set the path in the environment variable `KG_SAVEGAME`, the default is `"./fixtures/lategame"`.  
If you have other settings to load, you can set the path in the environment variable `KS_SETTINGS`, the default is `"./fixtures/localstorage.json"`.

### Development (without container)

To develop without containers, you can build a development version of the userscript with full debugging information.

1. Run the build script.

   ```shell
   yarn userscript:preview
   ```

   The userscript is placed in the `packages/userscript/bundle` directory.

### Type-checking

To fill the **Problems** panel in VS Code with all current, type-related errors, run the `typecheck:all` npm task in VS Code.

## Building a release version of the userscript

1. Run the script to build the release:

   ```shell
   yarn userscript:release
   ```
