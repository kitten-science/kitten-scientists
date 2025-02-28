# Overview

## Introduction

The UI of KS is divided into several major sections. The names of these sections correlate to the main tabs in the KG UI.

Refer to the individual section documentation pages for details of the automation features on those sections.

## UI Concepts

### Panels

The UI of KS is made up of _panels_. You recognize a panel from the little :material-chevron-down: symbol on it. When you click on the :material-chevron-down:, the panel expands and the :material-chevron-down: turns into a :material-chevron-up:. When you now click the :material-chevron-up:, the panel collapses again.

!!! note

    The :material-chevron-down:/:material-chevron-up: button is sometimes referred to as an _expando_.

When you use the expando on the top-most entry, you can expand/collapse all panels at once.

Most panels are also [settings](#settings). Which means that they have a **checkbox** as their top element, which is always visible, even when the panel is collapsed. When you _disable_ this setting, it causes any automation that is controlled through that section of the UI to be bypassed.

### Settings

A _setting_ in KS is most commonly a checkbox. When the checkbox is checked, this feature is active. If the checkbox is unchecked, the feature is inactive.

Some settings also come with additional options. These are shown on the same line as the checkbox. You can click on these options to change their value. Sometimes, these options behave like expando buttons and expand an entire new panel with options.

### Settings Lists

A _settings list_ is a series of settings that have are grouped with each other. Sometimes, these lists have tools at the bottom. These tools can be any of these:

1. Enable all options

    Activates everything.

1. Disable all options

    Turns everything off.

1. Reset to defaults

    Set all options to the values that come with KS.

### Triggers

One common option to see is the _trigger_, symbolized by a little lightning :material-lightning-bolt-outline:. A trigger usually communicates at which threshold an automation should become active. Which resource this threshold refers to, is documented with the individual automations.

Triggers can be absolute values, or a percentage. This percentage then usually refers to your storage capacity for a given resource. When you enter a percentage value into KS, it expects you to provide it as a value between `0` and `100`. So if you wanted a trigger value at ¾ of your storage capacity, you'd enter `75`.

### Limits

Another common option is the _limit_. This will usually prevent an automation from going over a certain value. The most important aspects to understand are:

-   `-1` means _infinity_. Effectively disables the limit.
-   `0` means don't do anything ever.
-   any other number will be the limit for this automation.

!!! hint

    When entering limits, you can usually use the KG notations for big numbers. So `9.5M` will become `9,500,000`.

<!-- prettier-ignore-start -->
*[KG]: Kittens Game
*[KS]: Kitten Scientists
*[UI]: User interface
<!-- prettier-ignore-end -->
