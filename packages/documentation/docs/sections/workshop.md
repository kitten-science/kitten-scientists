# Workshop

## Resource Crafting

In general, resources are crafted if they are enabled and less than **Max** resources are already in stock.

Additionally, if crafting a resource requires one or more materials that have a capacity, those materials need to be filled to **Trigger** of their stock capacity.

!!! example

    **Wood** has a capacity. If you want to craft **Beams**, and you set a trigger of `0.5`, then beams would be crafted if wood is filled to half of its stock capacity.

    When you want to craft **Megaliths**, they are built from **Beams**, **Slabs**, and **Plates**. All of which have _no capacity_. So the trigger value does not apply to this craft.

### Unlimited Crafting

Just craft as many items as possible, respecting your [Resource Control configuration](./resource-control.md).

### Limited Crafting

For a limited item to be crafted, we first look at all the materials that are required for the item to be crafted, and at our current stock for the item. We then calculate how much of our materials would be required to build all the items _we already have in stock_. If we have more materials than _that_, then we allow the additional materials to be crafted into more of the craftable item.

!!! example

    Let's assume you want to craft **Beams**. A beam costs 175 **Wood**, and you have 1 beam in stock. KS would then craft the next beam when you have 350 wood available.

### Force Ships to 243

When enabled, **Trade Ships** will be handled as _unlimited_, regardless of the actual configuration, until you have at least 243 ships in stock.

!!! quote

    Having 243 or more ships will guarantee that you get titanium from a trade. The exact number is `1700/7` ships, which rounds up to 243.

    <https://wiki.kittensgame.com/en/general-information/resources/ship>

## Research Upgrades

Selected upgrades will automatically be researched as soon as possible.

<!-- prettier-ignore-start -->
*[KG]: Kittens Game
*[KS]: Kitten Scientists
*[UI]: User interface
<!-- prettier-ignore-end -->
