# Time

## Section Trigger

This section has a trigger :material-lightning-bolt-outline: on itself. This is the _default trigger_ for the buildings in this section.

If you do not set a trigger for an individual building, that building will be triggered according to the default trigger.

## Buildings

When you enable a building, this building will be built if all of these are true:

1. Less than **Max** buildings have already been built.

1. _All_ of the resources required for the building to built are filled to **Trigger** of their stock capacity.

1. _All_ of the resources required for the building to built are sufficiently available after considering configured **Stock** and **Consume**.

## Additional Options

### Fix Cryochamber

If you have broken cryochambers, they will be fixed automatically. Every repair costs temporal flux, so the **Trigger** of this option is the amount of temporal flux that has to _remain_ after each single repair. A value of `0` means that repairs are not limited.

#### Only while Flux is Produced

Restricts repairs to situations where temporal flux is actually being produced. This requires the **Chronosurge** workshop upgrade and at least one **Chronosphere**. Without a source of temporal flux, repairs would only drain the flux that other features rely on. This sub-option is off by default.

### Turn on Chrono Furnaces

Turns on the Chrono Furnace building as soon as the first one is purchased, and keeps them turned on.
