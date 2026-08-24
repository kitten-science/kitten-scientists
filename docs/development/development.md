# Development Guide

!!! question

    Please help us [translate KS](https://crowdin.com/project/kitten-scientists), either by contributing missing translations or reviewing the existing entries.

## Introduction

The script is written in [TypeScript](https://www.typescriptlang.org/). The JS script itself is not intended to be edited. Changes need to be made in the [script source code](https://github.com/kitten-science/kitten-scientists/tree/main/source) and then be compiled into the actual output artifact.

## Prerequisites

The development environment is expected to be a POSIX-compliant system. On Windows, WSL will do fine.

You will need [NodeJS](https://nodejs.org/) to be able to work with the project.

Additionally, you will need to have [Docker](https://www.docker.com/) available, to use the container-based Kittens Game development server. On Debian, you might prefer to use `podman` with `podman-docker`.

## General Development

Whenever you want to see the result of your changes, use:

```shell
make build
```

This will build a fresh version of the script. _If_ you are running a development container, this build output will also be used the next time you refresh the page.

## Development with Kittens Game Container

The development container provides a version of Kittens Game that already a Kitten Scientists version injected into it, based on your local development state.

See the [dedicated documentation](./devcontainer.md) for more information.

## Development without Container

To develop without containers, you can build a development version of the script with full debugging information.

```shell
make build
```

The userscript is placed in the `output` directory.

## The Different Build Layers

When we build KS, we first use [`vite`](https://vite.dev/) to build the _injectable_. This version of the script is meant for scenarios where we can _inject_ it directly into the game, as if it was a part of the game like any other code the game comes with. This is used for the Steam version of the game, or our development container, where we fully control the game.

The script is also offered as a userscript, where we need to inject it into the game page in the browser. This process has security implications, which is why some userscript managers sandbox scripts that are injected this way. To work around those issues, we don't inject KS itself, but only a _loader_. This loader is the second layer we build.

The loader creates a new `<script>` node inside the game page, and then puts the injectable version of the script into that node. By doing so, any sandboxing applied by the userscript manager only applies to the loader itself. KS is then handled by the browser like any other script in the game.

You might ask yourself, if the loader variant apparently always works, then why do we need the injectable at all? The injectable is preferred whenever possible, because you can read it easily. It's big file, but you can still understand what the script does, just by reading through it. In the loader variant, the entire script is contained in a single string on a single line. To a user, this might look like obfuscated code that is trying to hide malicious behavior.

## Type-Checking

Run `make lint` on the command line.

## Commit Standards

KS development follows the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification for commit messages.

Whenever possible, use one of the established scopes:

Tab related:

-   `bonfire`
-   `religion`
-   `science`
-   `space`
-   `time`
-   `trade`
-   `village`
-   `workshop`

Internals related:

-   `api`

    Relates to the global `kittenScientists` API.

-   `build`

    Relates to the process of producing one of the KS release fragment.

-   `container`

    Relates to the KS development container.

-   `core`

    Relates to central behavior of KS. Also includes state management.

-   `filters`

    Relates to the log filters of KS.

-   `i18n`

    Relates to translations of KS.

-   `settings`

    Relates to changes to the settings system.

-   `ui`

    Relates to the KS user interface.

## Pull Requests

When you open a pull request, make sure that you squash your commits into a single one, _unless_ individual commits are substantial enough that they should be preserved as-is. Just make sure that all commits follow the [commit standards](#commit-standards) mentioned above.

## Releasing a New Version

1.  Have your release notes ready. You can draft them in the `CHANGELOG.md` and copy the auto-generated changes for the release from the GitHub release later.

1.  Build a preview of the script:

    ```bash
    make preview
    ```

1.  Load the built preview into a userscript manager in Chrome and perform a quick, manual test.

    1. Does the script load at all?
    1. Are settings restored to expectation?
    1. Are settings saved when they are changed?

1.  Last checks!

    1. Does anything need to be committed?
    1. Are all remote changes merged?
    1. Did `make pretty` run one last time?

1.  Create a tag for this version:

    ```bash
    git tag -s v2.0.1 -m "2.0.1"
    ```

1.  Push the tag:

    ```bash
    git push origin v2.0.1
    ```

1.  Edit the drafted release on GitHub. Leave it drafted. Publish it when all release tasks listed here have been completed.

1.  Raise the version number in [`package.json`](/package.json) to a **higher version that will be in development next**!

1.  Update the [`README.md`](/README.md) to point the latest stable release.

1.  Update the [`docs/current/docs/installation/index.md`](/docs/current/docs/installation/index.md) to point to the latest version number.

1.  Update the [`.github/ISSUE_TEMPLATE/bug_report.yml`](/.github/ISSUE_TEMPLATE/bug_report.yml) to mention the latest version number.

1.  Ultimately, search the entire project code base for the previous version string, like `2.0.0`. Make sure to also search for _future_ releases that need to point to the _new future_ release!

1.  There are other hardcoded version references in `infrastructure` and `action-release-info`. Those must be updated as well, and the entire changeset needs to be cycled through the deployment chain!

!!! note

    Don't forget to publish the drafted release on GitHub!

*[JS]: JavaScript
*[KG]: Kittens Game
*[KS]: Kitten Scientists
*[UI]: User interface
