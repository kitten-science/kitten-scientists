## Introduction

Note that the default configuration of Kitten Scientists is designed to already give very good results for most stages of the game. When you're exploring the features of KS, try disabling all sections and then re-enabling them one-by-one.

As you get more comfortable with the behavior of KS, feel free to fine-tune the settings to achieve your goals faster.

## UI Guide

To enable/disable the entire suite of automations of KS, click the **Enable Scientists** label at the top of the UI.

Individual automation sections can be enabled/disabled by clicking on the label of the automation section. By clicking the **items** label to the right of the label, you can expand/collapse the panel that holds the individual automation options of that section. Their specific behavior is documented below.

### Bonfire

> This section has a configurable threshold for when the automation should be activated. Click the **trigger** label to the right of the **Bonfire** label to set your desired threshold. The default value is `0` (activate as soon as possible).

By clicking the names of the individual buildings, you can select which buildings from the **Bonfire** page you want to have built automatically. The **Max** setting tells KS not to build any more than the designated number (the default value of `-1` allowing unlimited production).

Please note that the **Unic. Pasture** is in the **Religion** section.

### Space

> This section has a configurable threshold for when the automation should be activated. Click the **trigger** label to the right of the **Space** label to set your desired threshold. The default value is `0` (activate as soon as possible).

As in the **Bonfire** section, here you can select which buildings from the **Space** page you want to have built automatically.

### Crafting

> This section has a configurable threshold for when the automation should be activated. Click the **trigger** label to the right of the **Crafting** label to set your desired threshold. The default value is `0.95`. This means that a resource will be crafted when it is at 95% of your storage limit. (What about unlimited resources?)

In this section, you can select which craftable resources you want to craft automatically.

When you enable the **Limited** option for a resource, then only a portion of the source materials is crafted into the desired resource. The portion is currently set to 50% (this is currently not configurable).

This means that if you have 1000 beams, and you have crafting of scaffolds enabled, then only 500 beams would be crafted into scaffolds. This is especially useful for when you want to split up source materials between different craftable resources.

Consider crafting steel and plates. Both require iron. If you would allow unlimited plate crafting, then you wouldn't have any iron left to craft steel. By having steel and plates set to **limited**, the iron resource is split between the two craftable resources.

#### Resources

By clicking the **Resources** label, you can access the fine-grained resource management.

For each resource, you can set a _consumption rate_ (60% by default) and a _stock_ (0 by default). The consumption rate defines how much of the trigger value times the storage capacity that autocrafting is allowed to consume (meaning with the default consumption rate and a trigger value of 100%, autocrafting would leave 40% of the resource's storage capacity). The stock setting keeps a specific amount on hand, regardless of all other settings.

### Unlocking

-   Workshop **upgrades** and **techs** are automatically bought when affordable, prioritizing the workshop if both are enabled.
-   **Races** for trading are automatically explored as they become available.
-   Space **missions** can automatically be conducted.
-   **Buildings** can be set to be automatically upgraded to their second stage as soon as upgrading would not significantly impact income.

### Trading

> This section has a configurable threshold for when the automation should be activated. Click the **trigger** label to the right of the **Trading** label to set your desired threshold. The default value is `0.98`. This means that a trade will be made, when you're at 98% of your storage limit. This only relates to resources that have a storage limit.

By default, the trades are optimized to only happen during seasons when the trade is most effective. You can customize these seasons by clicking the **seasons** label to the right of the individual races.

Trading also has a _limited_ trading mode. This mode determines how much production time is needed to make the trade's input resources versus the time to make the trade's average output resources to determine if a trade is profitable. The resources gained and spent trading and hunting are also factored in, making this mode self-limiting.

### Religion

> This section has a configurable threshold for when the automation should be activated. Click the **trigger** label to the right of the **Religion** label to set your desired threshold. The default value is `0` (activate as soon as possible).

In the **Religion** section, you can select which buildings and techs from the **Religion** page you want to have purchased automatically. If necessary and possible, unicorns will be sacrificed to produce tears.

Click **addition** to customize these additional options:

-   **Build Best Unicorn Building First**: Figures out which unicorn building gives the best return on investment ([source](https://github.com/Bioniclegenius/NummonCalc/blob/master/NummonCalc.js#L490)) and builds that one first. Overrides the individual settings for those buildings.
-   **Auto Praise**: Automatically praises the sun as your faith approaches the resource limit. Set the **trigger** value as normal.
-   **Auto Adore the Galaxy**: Automatically adores the galaxy and converts worship to epiphany based on the **trigger** value. (Worship is uncapped, so based in what way?)
-   **Auto Transcend**: Automatically transcends, converting epiphany into transcendence tiers. (What's the threshold?)

### Time

> This section has a configurable threshold for when the automation should be activated. Click the **trigger** label to the right of the **Time** label to set your desired threshold. The default value is `0` (activate as soon as possible).

The automations in this section behave exactly like in the **Bonfire** and **Space** sections, but here you select which buildings from the **Time** page you want to have built automatically.

### Time Control

-   **Tempus Fugit**: Automatically enables the time-acceleration ability when temporal flux approaches cap, customizable with a **trigger** value as normal.
-   **Time Skip**: As long as you have a minimum number of time crystals (set by the **trigger** value), will automatically shatter time crystals (up to the number specified in the **Maximum** value) to skip over the selected **Cycles**. Will only activate during designated **seasons**.
-   **Reset Timeline (Danger!)**: TBA

### Kitten Resources

-   Automatically assigns kittens to selected jobs. If a job is marked **Limited**, kittens will be distributed up to the designated **Max** amount.
-   Make Leader can be set to automatically make leader for selecting job and trait.

### Options

-   **Observe Astro Events**: Automatically observe astronomical events as they happen.
-   **Hold Festivals**: Automatically hold festivals as soon as the previous one ends and enough resources are available and holding the festival won't drain your stockpile.
-   **Force Ships to 243**: Ensures that 243 ships are constructed as soon as possible, ignoring other resource constraints. This is useful because after 243 ships, trades for titanium with the zebras are guaranteed to be successful 100% of the time.
-   **Feed Leviathans**: Automatically feed the leviathans race necrocorns to ensure they stay longer for possible trading.
-   **Hunt**: Automatically send your kittens hunting as you approach the catpower limit. This automation has a configurable trigger. The default value is `0.98`, which means the kittens will hunt when your catpower is at 98% of your catpower limit.
-   **Promote Leader**: Automatically promotes leader when they have enough experience and you have enough gold.
-   **Trade Blackcoin**: Automatically trade blackcoin with the leviathans at low prices and sells near the peak. The trigger value corresponds to the amount of relics needed before the exchange is made.
-   **Fix Cryochamber**: Automatically fixes used cryochambers if possible.
-   **Build Embassies (Beta)**: Automatically builds embassies, just like other buildings.
-   **View Full Width**: Uncheck to make the game look like it normally does when Kitten Scientists isn't active.

### Filters

The filters allow you to set which types of messages you want to see in the game log.

Note that _enabling_ a filter will cause the message to **not** be logged. This is in contrast to the **Log Filters** that are already present in Kittens Game, where the logic is reversed.
