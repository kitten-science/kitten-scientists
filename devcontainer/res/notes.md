# Notes about Themes

## Kittens Game Color Theory

### 10 Basic Rules

1. _Metallic_ resources are `"gray"`/`#808080`.
1. _Special_ stuff and p1 messages derive from **blue/purple/violet** space. Think eludium, void, antimatter, paragon.
   Distinct from **pink** scale, which is parchment/culture/elderBox.
1. UI elements use **grayscale**, sometime slightly pitched.
1. _Radioactive_ stuff is **green**. TimeCrystals are radioactive.
1. _Science_/_Knowledge_ stuff and p3 messages are **blue**. `#01A9DB`
1. **Red** is for p0 messages (+noRes), unobtainium, blood, and necrocorns.
1. Rare resources are **orange** and glow.
1. Uncommon resources and p2 messages are **orange**. (Not correctly positioned on color scale!)
1. At the yellow edge of the scale is only blackcoin `"gold"`/`#FFD700` and kerosene (bugged).
1. Kittens derive their color from the catscale.

### Derived Model Properties

1. _Metallic_ resources can use the **grayscale**.
1. _Radioactive_ stuff is **green**, glows.
1. **Red** (edge) is unchanged, for signal value, and must be respected.
1. The **red/orange/yellow** space can be refactored and repurposed.
1. Message priority aligns with resource rarity. Priority should not be communicated by color only!
1. **Blue** (edge) is unchanged, for signal value, and refers to _Science_/_Knowledge_.
1. The **blue/purple/violet/pink** can be relocated.
1. Non-contributors can be colored freely. Manpower, tMythril, UI borders, 

## Kittens Game Color Palette

Main source of truth for all other palette derivatives.

Always maintain this list first!

- ref: <https://developer.mozilla.org/en-US/docs/Web/CSS/named-color>
- ref: <https://en.wikipedia.org/wiki/Web_colors>

- #000000 (`black`) - sorrow
- #0000FF - UI rainbow 4
- #001F3F - `pulse` animation 0
- #008000 (`green`) - UI only
- #00E6B8 - tMythril
- #00FF00 - UI rainbow 2
- #00FFFF - UI rainbow 3
- #01A9DB - `notice` message
- #01A9DB - blueprint
- #01A9DB - compedium
- #01A9DB - cycleYear 3
- #01A9DB - manuscript
- #01A9DB - science
- #14CD61 - cycleYear 2
- #14CD61 - timeCrystal
- #282828 - UI leet
- #33FF00 - UI leet
- #404040 - UI only
- #444444 - UI only
- #493099 - burnedParagon
- #4EA24E - thorium
- #4EA24E - uranium
- #555555 - UI only
- #5A0EDE - antimatter
- #5A0EDE - relic
- #5A0EDE - void
- #6141CD - paragon
- #64C864 - UI progress bar
- #666666 - UI only
- #696969 (`dimgray`, `color-black` CSS class) - kitten color 3
- #777777 - UI only
- #808080 (`gray`) - alloy
- #808080 (`gray`) - faith
- #808080 (`gray`) - gear
- #808080 (`gray`) - megalith
- #808080 (`gray`) - steel
- #8A2BE2 (`blueviolet`) - `urgent` message
- #8B0000 (`darkred`) - UI only
- #8B4513 (`saddlebrown`, `color-brown` CSS class) - kitten color 0
- #9400D3 (`darkViolet`) - eludium
- #999999 - UI only
- #9A2EFE - cycleYear 4
- #9A2EFE - starchart
- #9A2EFE - UI neon-purple
- #9BC89B4D - UI `res-row`
- #A00000 - cycleYear 0
- #A00000 - unobtainium
- #A8A7AC - UI tooltip
- #AAAAAA - UI only
- #C0C0C0 (`silver`, `color-white` CSS class) - kitten color 5
- #CD853F (`peru`) - kitten variety
- #CECEC3 - UI progress bar
- #CF4F20 - tanker
- #D2B48C (`tan`, `color-cream` CSS class) - kitten color 2
- #D3D3D3 - UI only
- #DBA901 - cycleYear 1
- #DBA901 - manpower
- #DCDCDC (`gainsboro`) - UI credits
- #DF01D7 - culture
- #DF01D7 - parchment
- #E00000 - necrocorn
- #E00000 - necrocornDeficit
- #EEEEEE - UI only
- #EFEFF4 - UI tooltip
- #F4A460 (`sandybrown`, `color-fawn` CSS class) - kitten color 4
- #F6F6F6 - UI only
- #F9F9F9 - UI only
- #FA0EDE - elderBox
- #FA0EDE - wrappingPaper
- #FF0000 - UI rainbow 0
- #FF0000 (`red`) - `alert` message
- #FF0000 (`red`) - bloodstone
- #FF00FF - UI rainbow 5
- #FF3030 - UI `noRes`
- #FF4136 - `pulse` animation 1
- #FF571A - ship
- #FF7F50 - date message
- #FF7F50 - scaffold
- #FF7F50 (`coral`) - `important` message
- #FF7F50 (`Coral`) - `uncommon` resources
- #FFA500 (`orange`) - `rare` resources + textShadow: "1px 0px 10px Coral"
- #FFD700 (`gold`) - blackcoin
- #FFFF00 - UI rainbow 1
- #FFFFFF (`color-cinamon` CSS class, TYPO 'cinnamon') - kitten color 1
- #FFFFFF (`color-lilac` CSS class) - kitten color 6
- #FFFFFF (`darkYellow` NOT A VALID HTML COLOR) - kerosene