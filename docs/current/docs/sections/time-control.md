# Time Control

As the name suggests, this section contains automations that control time itself.

## Tempus Fugit

Automatically spend collected temporal flux to speed up time, if you have stored up to **Trigger** of your capacity.

## Time Skip

Allows you to configure when KS should automatically combust TCs to skip years.

For a skip to be triggered, all of these have to be true:

1. We have **Trigger** amount of TCs available.
1. We are within an enabled **Cycle**.
1. We are within an enabled **Season**.

KS will skip as many as the configured **Max** years.

### Ignore overheat

Usually, KS will not combust any more TCs when you have already reached your chrono heat capacity. When you have overheated your capacity, combusting any more TCs costs a premium.

You can ignore this, when moving forward through time is more important than saving the time crystals.

### Active Heat Transfer

Allows you to configure KS to Heat Transfer at specified Cycle.

For **Active Heat Transfer** to be triggered, all of these have to be true:

1. The [**Ignore overheat**](#ignore-overheat) option is not enabled.
1. The **Heat Max** has been exceeded.
1. We are within an enabled **Cycle**.

KS will maintain the Heat Transfer state until the Heat drops below the trigger threshold.

### Get Temporal Flux

For **Get Temporal Flux** to be triggered, all of these have to be true:

1. The [**Tempus Fugit**](#tempus-fugit) option is enabled.
1. The Temporal Flux acquired from the combust TCs can accelerate the required Heat Transfer time for generating Temporal Heat.
1. The **total** amount of Temporal Flux can accelerate a year's time.
1. The amount of Temporal Flux is insufficient to accelerate the next year.

KS will prepare to accelerate the Temporal Flux for the next year in the first 10 days of each year.

## Reset Timeline

This automation allows you to reset your entire game, when all your configured conditions are met.

!!! danger

    Misconfiguration can lead to unexpected resets, and loss of important resources.

    Make sure to back up your save before experimenting with auto-resets!

The options should be pretty straight-forward, but let's look at them in detail regardless.

Most importantly, keep in mind that triggers, which are set to **Infinite**, will never be reached, and your game will never be reset. This is just a save value to use so enabling that reset condition doesn't instantly trigger a reset.

### Bonfire

Every enabled building has to be built **Trigger** times.

### Religion

Every enabled building has to be built **Trigger** times.

### Resource Control

Every enabled resource must be in stock at the given amount.

### Space

Every enabled building has to be built **Trigger** times.

### Time

Every enabled building has to be built **Trigger** times.

### Upgrades

Every enabled upgrade has to have been researched.

<!-- prettier-ignore-start -->
*[KG]: Kittens Game
*[KS]: Kitten Scientists
*[TCs]: Time crystals
<!-- prettier-ignore-end -->
