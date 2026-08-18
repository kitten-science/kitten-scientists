# Resource Control

This section allows you to control how much of your resources will be consumed by KS automations.

## Stock

The value you set for **Stock** determines the amount of the resource that KS will never touch. The only reason to set this value to anything but `0`, is for you to manually do something. The stocked amount of the resource will be entirely unavailable to KS.

## Consume

The **Consume** rate defines how much of an available resource should be made available to automation as a percentage.

This applies to the amount of resources that are available after the **Stock** has been considered. Of the excess amount beyond your stock, the consume rate is made available for consumption.

The default value for this is always `1`. You would usually want to lower this, if you want to interact with the game more manually.

!!! example

    Your capacity for **Wood** is `10K`. Your **Stock** for Wood is `5K`. Your **Consume** rate for Wood is set to `0.1`.

    When an automation now asks for the available amount of Wood, we would expect the result to be:

      ( 10K Wood - 5K Stock ) * 0.1 Consume Rate = 500 Wood
