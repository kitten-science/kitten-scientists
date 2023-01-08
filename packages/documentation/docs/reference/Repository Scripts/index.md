# Full reference

## devcontainer:build

-   Project: `@kitten-science/kitten-game`
-   Source:

    ```shell
    docker build --tag kitten-game .
    ```

-   Description:

    Builds the Development Container.

## devcontainer:rebuild

-   Project: `@kitten-science/kitten-game`
-   Source:

    ```shell
    docker build --no-cache --tag kitten-game .
    ```

-   Description:

    Rebuilds the development container.

    You're going to want to rebuild your development container every once in a while to ensure you're using the latest version of Kittens Game in your container.

## devcontainer:run

-   Project: `@kitten-science/kitten-game`
-   Source:

    ```shell
    bash ./scripts/run-development-container.sh
    ```

-   Description:

    Builds the development container and starts it.

## docs:build

-   Project: `@kitten-science/documentation`
-   Source:

    ```shell
    .scripts/build.sh
    ```

-   Description:

    Build the documentation.

## docs:nsd

-   Project: `@kitten-science/documentation`
-   Source:

    ```shell
    nsd --cwd=$INIT_CWD --docs-location="packages/documentation/docs/reference/Repository Scripts/"
    ```

-   Description:

    Update the scripts documentation that you are looking at right now.

## docs:serve

-   Project: `@kitten-science/documentation`
-   Source:

    ```shell
    .scripts/serve.sh
    ```

-   Description:

    Start the [mkdocs-material](https://squidfunk.github.io/mkdocs-material/) development server to work on the documentation.

## lint:all

-   Project: `kitten-scientists`
-   Source:

    ```shell
    eslint . --ext .ts
    ```

-   Description:

    Check source code for style issues.

## tests:build

-   Project: `@kitten-science/tests`
-   Source:

    ```shell
    tsc --build
    ```

-   Description:

    Build tests.

## tests:run

-   Project: `@kitten-science/tests`
-   Source:

    ```shell
    mocha output/tests/*.spec.js
    ```

-   Description:

    Execute tests.

## typecheck:all

-   Project: `kitten-scientists`
-   Source:

    ```shell
    tsc --noEmit --incremental false
    ```

-   Description:

    Run the TypeScript compiler to find problems with the code.

## userscript:build

-   Project: `@kitten-science/userscript`
-   Source:

    ```shell
    vite --config vite.config.inject.js build
    ```

-   Description:

    Build the userscript.

    This builds the version of the script that is also used in the development container.

## userscript:preview

-   Project: `@kitten-science/userscript`
-   Source:

    ```shell
    DEV_BUILD=true vite --config vite.config.userscript.js build
    ```

-   Description:

    Build a development release version of the userscript.

## userscript:release

-   Project: `@kitten-science/userscript`
-   Source:

    ```shell
    MINIFY=true vite --config vite.config.userscript.js build
    vite --config vite.config.userscript.js build
    ```

-   Description:

    Build a release version of the userscript.

    This is usually only used from CI to build both the regular version of the script, as well as a minified build. When you use this locally, it still builds both files, but clears the output directory between builds. So you end up with only the regular version.

## userscript:version

-   Project: `@kitten-science/userscript`
-   Source:

    ```shell
    node version.cjs
    ```

-   Description:

    Returns the version for the userscript.

## userscript:watch

-   Project: `@kitten-science/userscript`
-   Source:

    ```shell
    vite --config vite.config.inject.js build --watch
    ```

-   Description:

    Builds the userscript and watches all files for changes. If changes are detected, the script is rebuilt.

    !!! warning

        This watcher has caused problems in the past, generating broken output. Use at your own risk.
