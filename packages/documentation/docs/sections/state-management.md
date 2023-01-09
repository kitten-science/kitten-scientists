# State Management

!!! danger

    This section contains features that can erase all of your KS settings, or even your entire save game. Absolutely **back up your game** before exploring these!

If you disable the checkbox **Do NOT confirm destructive actions. (Danger!)**, you will **not** be asked to confirm any actions that destroy your data. Enabling this option allows you to switch between states with a single click and load save games very quickly.

## Copy to Clipboard

With a single click you can copy only your KS settings, or your entire KG save game to the clipboard.

The **Compress data** setting controls if the copied content will be compressed with the same process that KG uses when you export your save. When you _don't_ compress the data, you will be able to read and edit it in plain text.

!!! note

    When you want to export a KG save game, and you want to be able to load it through the regular KG import mechanism later, remember that KG only expects _compressed_ data.

## Load from Clipboard

You can load either only KS settings or an entire KG save game. When you use either option, you can enter your save game data into the appearing prompt. KS supports loading both compressed and uncompressed data.

## Local States

Allows you to quickly store and restore entire sets of KS settings.

When you store your current state, KS places it in the **Load stored state** section. You can then click on that state to load it again. You can also import a state from the clipboard. Both compressed and uncompressed states can be imported.

### Reset to Factory Defaults

Resets every setting to the state that KS would have if you used it for the first time today. This only impacts KS, your KG save game is not touched by this action.

### Load Stored States

When you have stored any states, they will appear in this list. Clicking on their name will load them.

You can also copy the state to the clipboard, or delete it. When copying a state, the **Compress data** setting is respected.

<!-- prettier-ignore-start -->
*[KG]: Kittens Game
*[KS]: Kitten Scientists
<!-- prettier-ignore-end -->
