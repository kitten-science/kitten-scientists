# Kitten Data and Analytics

To advance in Kitten Science, we had to build more advanced technology. This page should explain this new technology.

## What is the Kitten DnA Platform?

At its core, there is a userscript, alongside KS, that can capture snapshots of data in KG. This userscript is the Kitten Analysts.

If you can run the entire Kitten Science DnA environment on your machine, this userscript can report the snapshots to a backend, which in turn can offer the data through a [Prometheus exporter](https://prometheus.io/). The scraped data can then be observed through a [Grafana](https://grafana.com/) dashboard. There should be a template in the `contrib` folder of this projects' code repository.

If you are not running the Kitten Science DnA environment, Kitten Analysts will just serve as a helper in the background to report the state of KG through a normalized interface. Other userscripts can then make decisions based on these snapshots.

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

*[KG]: Kittens Game
*[KS]: Kitten Scientists
*[UI]: User interface
