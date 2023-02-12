# Internals

## Interval

This specifies how much time should pass between every single time KS evaluates the game and checks if any automations should be applied.

By default, this is `2000` milliseconds, which is `2` seconds.

!!! danger

    Lowering this value can cause instability or freeze your game, because so many browser resources will be spent on KS. If you want to speed up KS, lower the interval gradually.

## Language

Allows you to select a language different from the language used in KG.

Initially, KS will just use the language KG is set at, but you can override this language here.

<!-- prettier-ignore-start -->
*[JS]: JavaScript
*[KG]: Kittens Game
*[KS]: Kitten Scientists
*[UI]: User interface
<!-- prettier-ignore-end -->
