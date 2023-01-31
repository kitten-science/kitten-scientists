# Internals

## Interval

This specifies how much time should pass between every single time KS evaluates the game and checks if any automations should be applied.

By default, this is `2000` milliseconds, which is `2` seconds.

!!! danger

    Lowering this value can cause instability or freeze your game, because so many browser resources will be spent on KS. If you want to speed up KS, lower the interval gradually.

<!-- prettier-ignore-start -->
*[JS]: JavaScript
*[KG]: Kittens Game
*[KS]: Kitten Scientists
*[UI]: User interface
<!-- prettier-ignore-end -->
