# Development Guide

## Active development on the script

The project is set up to be used with [VS Code](https://code.visualstudio.com/). While other editors will work fine, some integrations have been prepared to make the development process easier.

### Prerequisites

The development environment is expected to be a POSIX-compliant system. On Windows, WSL will do fine.

You will need [NodeJS](https://nodejs.org/) and [yarn](https://yarnpkg.com/getting-started/install) to be able to work with the project.

Additionally, you will need to have [Docker](https://www.docker.com/get-started) available, to use the container-based Kitten Game development server. If you do not have Docker, you can still build a release version of the script and drop that into your userscript manager.

### Development

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

### Type-checking

To fill the **Problems** panel in VS Code with all current, type-related errors, run the `typecheck:all` npm task in VS Code.

## Building a release version of the userscript

1. Run the script to build the release:

```shell
yarn userscript:release
```
