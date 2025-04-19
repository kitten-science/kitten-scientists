# Kitten Engineers

KE is a future extension to KS, that will take over decision-making in the KG automation environment. It is still in its design phase.

## What is it going to be?

Let's first have a look at KS, and at what it is _supposed_ to be. KS should really just follow simple instructions as directly as possible. When you tell it to build a hut, it should just build that hut, no strings attached.

But that's not how KS behaves in all areas. Some features provide exceptions to existing logic, or they replace it (for example, [building the best unicorn building first](../sections/religion.md#ziggurats)). If you look at it very strictly, even triggers are a sort of decision-making component that conflicts with just implementing strict instructions.

Over the years, there have been many feature requests that would have expanded the dynamic behavior of KS even further, but there is more defensive stance on integrating features like that today. The reason for that is often that KE would likely be a better place to implement the requested feature. Adding too many dynamic behaviors into KS can make the overall behavior very hard to control. In the past, this has lead developers to include exceptions in completely unrelated areas of the code base, leading to issues that were very hard to understand.

## How will this work?

Instead of giving you thousands of parameters to adjust, like KS, KE will be an empty canvas. It should then allow you to author _rules_, if the _conditions_ of a rule are met, the rule will trigger _actions_. Consider the following data structure:

```yaml
rules:
    - name: Build huts
      conditions:
          - resource: wood
            is: GREATER_THAN_OR_EQUAL
            value: bonfire.buildings.hut[next].price.wood * 1.5
      actions:
          - ks:
            setting: bonfire.buildings.hut.limit
            value: bonfire.buildings.hut.limit + 1
```

!!! warning

    Don't expect rule sets to necessarily be authored in YAML. At this time, this is purely for illustration.

The idea of this rule would be to allow KS to build another hut when we have 1.5 times the amount of wood in stock that the next hut would cost. Making decisions, and adjusting KS settings, on such a granular level is impossible with KS today.

Manipulating settings in KS is also only one of the types of actions that KE should be able to perform. Overall, it should provide the ability to:

1. Make changes to KS settings.
1. Load entire settings states into KS.
1. Trigger actions in KG directly.

Specifically loading entire settings states is probably going to be the major way people are going to interact with KE, as most people will not be interested in the manual labor of writing actions, as shown above, to modify KS behavior. The recent development of [state management](../sections/state-management.md) has been the initial foundational work for this feature. KS has also been continously extended to provide an API that allows developers to control it externally. This API is currently being solidified. We provide extensive schemata for the KS settings structure, which allow developers to author settings profiles, which can also be composed from other profiles, and be shared online.

In theory, users can already make use of this behavior today, but pre-authored settings profiles will likely not catch on until the feature is documented properly.

## When will it be available?

KE will be done, when it's done. There is no date or timeline for its development. However, this is a potential roadmap for the progress oriented at the KS release cycle.

-   v2.0.0-beta.8 - Settings profiles integrated into KS
-   v2.0.0-beta.9 - Settings profiles stable, integrated into UI. Deprecate state management
-   v2.0.0-beta.10 - Settings profiles sharing infrastructure
-   v2.0.0-beta.? - KE pre-alpha development starts
-   v2.0.0-rc - Settings profiles feature complete. First KE alpha release

*[API]: Application Programming Interface
*[KE]: Kitten Engineers
*[KG]: Kittens Game
*[KS]: Kitten Scientists
