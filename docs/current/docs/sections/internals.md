# Internals

## Interval

This specifies how much time should pass between every single time KS evaluates the game and checks if any automations should be applied.

By default, this is `2000` milliseconds, which is `2` seconds.

!!! danger

    Lowering this value can cause instability or freeze your game, because so many browser resources will be spent on KS. If you want to speed up KS, lower the interval gradually.

## Fourth Column UI

Puts KS into a dedicated column in the UI, right next to the log.

!!! danger

    If you're using the **Sleek** theme, this will break your UI.

## Language

Allows you to select a language different from the language used in KG.

Initially, KS will just use the language KG is set at, but you can override this language here.

## Other internals

Some users may experience slow loads of KG itself, causing KS to fail to load in time, as the timeout for the loader is "only" 2 minutes.

In case you are impacted by this, set `localStorage["ks.timeout"]` to the amount of milliseconds KS should wait for KG to load. The default value is `120000`, which correlates to the amount of milliseconds in 2 minutes.

<!-- prettier-ignore-start -->
*[JS]: JavaScript
*[KG]: Kittens Game
*[KS]: Kitten Scientists
*[UI]: User interface
<!-- prettier-ignore-end -->
