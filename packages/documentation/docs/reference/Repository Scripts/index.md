# Full reference

## build

-   Project: `kitten-scientists`
-   Source:

    ```shell
    yarn run build:all
    ```

-   Description:

    _documentation pending_

## build:all

-   Project: `kitten-scientists`
-   Source:

    ```shell
    scripts/build-all.sh
    ```

-   Description:

    Builds all TypeScript workspaces.

## clean

-   Project: `kitten-scientists`
-   Source:

    ```shell
    yarn run clean:all
    ```

-   Description:

    _documentation pending_

## clean:all

-   Project: `kitten-scientists`
-   Source:

    ```shell
    rm -rf packages/*/{build,output,tsconfig.tsbuildinfo}
    ```

-   Description:

    Cleans all TypeScript build output from all workspaces.

## devcontainer:build

-   Project: `@kitten-science/devcontainer`
-   Source:

    ```shell
    bash ./scripts/build-container.sh
    ```

-   Description:

    Builds the [Development Container](../../development/development.md#development-with-kittens-game-container).

## devcontainer:rebuild

-   Project: `@kitten-science/devcontainer`
-   Source:

    ```shell
    bash ./scripts/rebuild-container.sh
    ```

-   Description:

    Rebuilds the [Development Container](../../development/development.md#development-with-kittens-game-container).

    You're going to want to rebuild your development container every once in a while to ensure you're using the latest version of Kittens Game in your container.

## devcontainer:run

-   Project: `@kitten-science/devcontainer`
-   Source:

    ```shell
    bash ./scripts/run-container.sh
    ```

-   Description:

    Builds the [Development Container](../../development/development.md#development-with-kittens-game-container) and starts it.

## devcontainer:stop

-   Project: `@kitten-science/devcontainer`
-   Source:

    ```shell
    bash ./scripts/stop-container.sh
    ```

-   Description:

    _documentation pending_

## docs:nsd

-   Project: `@kitten-science/documentation`
-   Source:

    ```shell
    make nsd
    ```

-   Description:

    Update the scripts reference that you are looking at right now.

## ka:build

-   Project: `@kitten-science/kitten-analysts`
-   Source:

    ```shell
    node build.js && vite --config vite.config.inject.js build
    ```

-   Description:

    _documentation pending_

## ka:compose:build

-   Project: `@kitten-science/kitten-analysts`
-   Source:

    ```shell
    docker-compose build
    ```

-   Description:

    _documentation pending_

## ka:compose:down

-   Project: `@kitten-science/kitten-analysts`
-   Source:

    ```shell
    docker-compose down
    ```

-   Description:

    _documentation pending_

## ka:compose:up

-   Project: `@kitten-science/kitten-analysts`
-   Source:

    ```shell
    docker-compose up
    ```

-   Description:

    _documentation pending_

## ka:preview

-   Project: `@kitten-science/kitten-analysts`
-   Source:

    ```shell
    DEV_BUILD=true vite --config vite.config.userscript.js build
    ```

-   Description:

    _documentation pending_

## ka:release

-   Project: `@kitten-science/kitten-analysts`
-   Source:

    ```shell
    MINIFY=true vite --config vite.config.userscript.js build; vite --config vite.config.userscript.js build
    ```

-   Description:

    _documentation pending_

## ka:start

-   Project: `@kitten-science/kitten-analysts`
-   Source:

    ```shell
    node output/entrypoint-backend.js
    ```

-   Description:

    _documentation pending_

## ke:build

-   Project: `@kitten-science/kitten-engineers`
-   Source:

    ```shell
    vite --config vite.config.inject.js build
    ```

-   Description:

    _documentation pending_

## ke:preview

-   Project: `@kitten-science/kitten-engineers`
-   Source:

    ```shell
    DEV_BUILD=true vite --config vite.config.userscript.js build
    ```

-   Description:

    _documentation pending_

## ke:release

-   Project: `@kitten-science/kitten-engineers`
-   Source:

    ```shell
    MINIFY=true vite --config vite.config.userscript.js build; vite --config vite.config.userscript.js build
    ```

-   Description:

    _documentation pending_

## ke:version

-   Project: `@kitten-science/kitten-engineers`
-   Source:

    ```shell
    node version.cjs
    ```

-   Description:

    _documentation pending_

## ke:watch

-   Project: `@kitten-science/kitten-engineers`
-   Source:

    ```shell
    vite --config vite.config.inject.js build --watch
    ```

-   Description:

    _documentation pending_

## ks:build

-   Project: `@kitten-science/kitten-scientists`
-   Source:

    ```shell
    vite --config vite.config.inject.js build
    ```

-   Description:

    Build the Kitten Scientists userscript.

    This builds the version of the script that is also used in the development container.

## ks:preview

-   Project: `@kitten-science/kitten-scientists`
-   Source:

    ```shell
    DEV_BUILD=true vite --config vite.config.userscript.js build
    ```

-   Description:

    Build a development release version of the userscript.

## ks:release

-   Project: `@kitten-science/kitten-scientists`
-   Source:

    ```shell
    MINIFY=true vite --config vite.config.userscript.js build; vite --config vite.config.userscript.js build
    ```

-   Description:

    Build a release version of the Kitten Scientists userscript.

    This is usually only used from CI to build both the regular version of the script, as well as a minified build. When you use this locally, it still builds both files, but clears the output directory between builds. So you end up with only the regular version.

## ks:version

-   Project: `@kitten-science/kitten-scientists`
-   Source:

    ```shell
    node version.cjs
    ```

-   Description:

    Returns the version for the Kitten Scientists userscript.

## ks:watch

-   Project: `@kitten-science/kitten-scientists`
-   Source:

    ```shell
    vite --config vite.config.inject.js build --watch
    ```

-   Description:

    Builds the Kitten Scientists userscript and watches all files for changes. If changes are detected, the script is rebuilt.

    !!! warning

        This watcher has caused problems in the past, generating broken output. Use at your own risk.

## lint

-   Project: `kitten-scientists`
-   Source:

    ```shell
    yarn run lint:all
    ```

-   Description:

    _documentation pending_

## lint:all

-   Project: `kitten-scientists`
-   Source:

    ```shell
    yarn run lint:eslint && yarn run lint:prettier
    ```

-   Description:

    Check source code for style issues.

## lint:eslint

-   Project: `kitten-scientists`
-   Source:

    ```shell
    eslint .
    ```

-   Description:

    _documentation pending_

## lint:prettier

-   Project: `kitten-scientists`
-   Source:

    ```shell
    prettier --check packages
    ```

-   Description:

    _documentation pending_

## test

-   Project: `kitten-scientists`
-   Source:

    ```shell
    yarn run test:all
    ```

-   Description:

    _documentation pending_

## test:all

-   Project: `kitten-scientists`
-   Source:

    ```shell
    yarn workspaces foreach --all --exclude kitten-scientists --parallel --verbose run test
    ```

-   Description:

    Runs unit tests in all workspaces.

## test:inspect

-   Project: `@kitten-science/action-release-info`
-   Source:

    ```shell
    node $(yarn bin mocha) --inspect ./build/*.test.js
    ```

-   Description:

    Runs unit tests and lets you attach a debugger.

## typecheck:all

-   Project: `kitten-scientists`
-   Source:

    ```shell
    tsc --noEmit --incremental false
    ```

-   Description:

    Run the TypeScript compiler to find problems with the code.

