# Kitten Data and Analytics

!!! note

    We're currently rewriting this section of the documentation!

To advance in Kitten Science, we had to build more advanced technology. This page should explain this new technology.

## What is the Kitten DnA Platform?

At its core, there is a userscript, alongside KS, that can capture snapshots of data in KG. This userscript is the [Kitten Analysts].

If you can run the Kitten Science DnA environment on your machine, this userscript can report the snapshots to a backend, which in turn can offer the data through a [Prometheus exporter](https://prometheus.io/). The scraped data can then be observed through a [Grafana](https://grafana.com/) dashboard.

## How can I use it?

You should be able to bring up the environment with:

```shell
yarn ka:compose:up
```

The resulting pod should expose 4 ports:

1. 7780 KGNet Interface
1. 9080 Kittens Game Browser UI
1. 9091 Prometheus Exporter
1. 9093 Kitten Analysts Websocket

Navigate to <http://localhost:9080/> to start playing with Kitten Science DnA.

## How do I get the fancy dashboards?

You need to be familiar with Prometheus and Grafana and have both already running. If you have that, you only need to scrape port `9091` on the machine that is running Kitten Science DnA.

[Kitten Analysts]: https://github.com/kitten-science/kitten-analysts

*[KG]: Kittens Game
*[KS]: Kitten Scientists
*[UI]: User interface
