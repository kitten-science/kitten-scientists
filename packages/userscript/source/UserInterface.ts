import { objectEntries } from "./tools/Entries";
import { ucfirst } from "./tools/Format";
import { mustExist } from "./tools/Maybe";
import { Resource, Season } from "./types";
import { UserScript } from "./UserScript";

export type UiOptionElement = JQuery<HTMLElement> & {};

export class UserInterface {
  private readonly _host: UserScript;

  constructor(host: UserScript) {
    this._host = host;
  }

  private _addRule(rule: string) {
    const sheets = document.styleSheets;
    sheets[0].insertRule(rule, 0);
  }

  configure(): void {
    const right = $("#rightColumn");

    const defaultSelector = "body[data-ks-style]:not(.scheme_sleek)";

    this._addRule(
      "body {" + // low priority. make sure it can be covered by the theme
        "font-family: monospace;" +
        "font-size: 12px;" +
        "}"
    );

    this._addRule(
      defaultSelector +
        " #game {" +
        // + 'font-family: monospace;'
        // + 'font-size: 12px;'
        "min-width: 1300px;" +
        "top: 32px;" +
        "}"
    );

    // this._addRule(defaultSelector + ' {'
    //     + 'font-family: monospace;'
    //     + 'font-size: 12px;'
    //     + '}');

    this._addRule(
      defaultSelector +
        " .column {" +
        "min-height: inherit;" +
        "max-width: inherit !important;" +
        "padding: 1%;" +
        "margin: 0;" +
        "overflow-y: auto;" +
        "}"
    );

    this._addRule(defaultSelector + " #leftColumn {" + "height: 92%;" + "width: 26%;" + "}");

    this._addRule(
      defaultSelector +
        " #midColumn {" +
        "margin-top: 1% !important;" +
        "height: 90%;" +
        "width: 48%;" +
        "}"
    );

    this._addRule(
      defaultSelector +
        " #rightColumn {" +
        "overflow-y: auto;" +
        "height: 92%;" +
        "width: 19%;" +
        "}"
    );

    this._addRule("body #gamePageContainer #game #rightColumn {" + "overflow-y: auto" + "}");

    // this._addRule(defaultSelector + ' #gameLog .msg {'
    //     + 'display: block;'
    //     + '}');

    this._addRule(
      defaultSelector +
        " #gameLog {" +
        "overflow-y: hidden !important;" +
        "width: 100% !important;" +
        "padding-top: 5px !important;" +
        "}"
    );

    this._addRule(defaultSelector + " #resContainer .maxRes {" + "color: #676766;" + "}");

    this._addRule(
      defaultSelector +
        " #game .btn {" +
        "border-radius: 0px;" +
        "font-family: monospace;" +
        "font-size: 12px !important;" +
        "margin: 0 5px 7px 0;" +
        "width: 290px;" +
        "}"
    );

    this._addRule(
      defaultSelector +
        " #game .map-viewport {" +
        "height: 340px;" +
        "max-width: 500px;" +
        "overflow: visible;" +
        "}"
    );

    this._addRule(" #game .map-dashboard {" + "height: 120px;" + "width: 292px;" + "}");

    this._addRule(
      "#ks-options ul {" + "list-style: none;" + "margin: 0 0 5px;" + "padding: 0;" + "}"
    );

    this._addRule(
      "#ks-options ul:after {" +
        "clear: both;" +
        'content: " ";' +
        "display: block;" +
        "height: 0;" +
        "}"
    );

    this._addRule(
      "#ks-options ul li {" + "display: block;" + "float: left;" + "width: 100%;" + "}"
    );

    this._addRule(
      "#ks-options #toggle-list-resources .stockWarn *," +
        "#ks-options #toggle-reset-list-resources .stockWarn * {" +
        "color: " +
        this._host.options.stockwarncolor +
        ";" +
        "}"
    );

    this._addRule(".right-tab {" + "height: unset !important;" + "}");

    const activityBox = $("<div/>", {
      id: "activity-box",
      css: {
        display: "inline-block",
        verticalAlign: "top",
      },
    });

    const showActivity = $("<a/>", {
      id: "showActivityHref",
      text: this._host.i18n("summary.show"),
      href: "#",
      css: {
        verticalAlign: "top",
      },
    });

    showActivity.on("click", () => this._host.displayActivitySummary());

    activityBox.append(showActivity);

    $("#clearLog").append(activityBox);

    const messageBox = $("<div/>", {
      id: "important-msg-box",
      class: "dialog help",
      css: {
        display: "none",
        width: "auto",
        height: "auto",
      },
    });
    const mbClose = $("<a/>", {
      text: this._host.i18n("ui.close"),
      href: "#",
      css: { position: "absolute", top: "10px", right: "15px" },
    });
    mbClose.on("click", function () {
      messageBox.toggle();
    });
    const mbTitle = $("<h1/>", { id: "mb-title", text: "test text" });
    const mbContent = $("<h1/>", { id: "mb-content", text: "test text" });
    messageBox.append(mbClose, mbTitle, mbContent);
    $("#gamePageContainer").append(messageBox);

    const showMessageBox = (title: string, content: string) => {
      mbTitle.html(title);
      mbContent.html(content);
      messageBox.toggle();
    };

    // Donation Button
    // ===============
    const address = "1HDV6VEnXH9m8PJuT4eQD7v8jRnucbneaq";
    const donate = $("<li/>", { id: "ks-donate" })
      .append(
        $("<a/>", {
          href: "bitcoin:" + address + "?amount=0.00048&label=Kittens Donation",
          target: "_blank",
          text: address,
        })
      )
      .prepend(
        $("<img/>", {
          css: {
            height: "15px",
            width: "15px",
            padding: "3px 4px 0 4px",
            verticalAlign: "bottom",
          },
          src:
            "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIgogICB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sbnM6c29kaXBvZGk9Imh0dHA6Ly9zb2RpcG9kaS5zb3VyY2Vmb3JnZS5uZXQvRFREL3NvZGlwb2RpLTAuZHRkIgogICB4bWxuczppbmtzY2FwZT0iaHR0cDovL3d3dy5pbmtzY2FwZS5vcmcvbmFtZXNwYWNlcy9pbmtzY2FwZSIKICAgdmVyc2lvbj0iMS4xIgogICB3aWR0aD0iNTEycHgiCiAgIGhlaWdodD0iNTEycHgiCiAgIHZpZXdCb3g9IjAgMCAxIDEiCiAgIHByZXNlcnZlQXNwZWN0UmF0aW89InhNaWRZTWlkIgogICBpZD0ic3ZnMiIKICAgaW5rc2NhcGU6dmVyc2lvbj0iMC40OC4yIHI5ODE5IgogICBzb2RpcG9kaTpkb2NuYW1lPSJiaXRjb2luLWxvZ28tbm9zaGFkb3cuc3ZnIj4KICA8bWV0YWRhdGEKICAgICBpZD0ibWV0YWRhdGEyMiI+CiAgICA8cmRmOlJERj4KICAgICAgPGNjOldvcmsKICAgICAgICAgcmRmOmFib3V0PSIiPgogICAgICAgIDxkYzpmb3JtYXQ+aW1hZ2Uvc3ZnK3htbDwvZGM6Zm9ybWF0PgogICAgICAgIDxkYzp0eXBlCiAgICAgICAgICAgcmRmOnJlc291cmNlPSJodHRwOi8vcHVybC5vcmcvZGMvZGNtaXR5cGUvU3RpbGxJbWFnZSIgLz4KICAgICAgICA8ZGM6dGl0bGU+PC9kYzp0aXRsZT4KICAgICAgPC9jYzpXb3JrPgogICAgPC9yZGY6UkRGPgogIDwvbWV0YWRhdGE+CiAgPHNvZGlwb2RpOm5hbWVkdmlldwogICAgIHBhZ2Vjb2xvcj0iI2ZmZmZmZiIKICAgICBib3JkZXJjb2xvcj0iIzY2NjY2NiIKICAgICBib3JkZXJvcGFjaXR5PSIxIgogICAgIG9iamVjdHRvbGVyYW5jZT0iMTAiCiAgICAgZ3JpZHRvbGVyYW5jZT0iMTAiCiAgICAgZ3VpZGV0b2xlcmFuY2U9IjEwIgogICAgIGlua3NjYXBlOnBhZ2VvcGFjaXR5PSIwIgogICAgIGlua3NjYXBlOnBhZ2VzaGFkb3c9IjIiCiAgICAgaW5rc2NhcGU6d2luZG93LXdpZHRoPSIxNDQ3IgogICAgIGlua3NjYXBlOndpbmRvdy1oZWlnaHQ9Ijg2MSIKICAgICBpZD0ibmFtZWR2aWV3MjAiCiAgICAgc2hvd2dyaWQ9ImZhbHNlIgogICAgIGlua3NjYXBlOnpvb209IjAuOTIxODc1IgogICAgIGlua3NjYXBlOmN4PSIyMTIuNTE0MzciCiAgICAgaW5rc2NhcGU6Y3k9IjIzMy4yNDYxNyIKICAgICBpbmtzY2FwZTp3aW5kb3cteD0iMCIKICAgICBpbmtzY2FwZTp3aW5kb3cteT0iMCIKICAgICBpbmtzY2FwZTp3aW5kb3ctbWF4aW1pemVkPSIwIgogICAgIGlua3NjYXBlOmN1cnJlbnQtbGF5ZXI9InN2ZzIiIC8+CiAgPCEtLSBBbmRyb2lkIGxhdW5jaGVyIGljb25zOiB2aWV3Qm94PSItMC4wNDUgLTAuMDQ1IDEuMDkgMS4wOSIgLS0+CiAgPGRlZnMKICAgICBpZD0iZGVmczQiPgogICAgPGZpbHRlcgogICAgICAgaWQ9Il9kcm9wLXNoYWRvdyIKICAgICAgIGNvbG9yLWludGVycG9sYXRpb24tZmlsdGVycz0ic1JHQiI+CiAgICAgIDxmZUdhdXNzaWFuQmx1cgogICAgICAgICBpbj0iU291cmNlQWxwaGEiCiAgICAgICAgIHJlc3VsdD0iYmx1ci1vdXQiCiAgICAgICAgIHN0ZERldmlhdGlvbj0iMSIKICAgICAgICAgaWQ9ImZlR2F1c3NpYW5CbHVyNyIgLz4KICAgICAgPGZlQmxlbmQKICAgICAgICAgaW49IlNvdXJjZUdyYXBoaWMiCiAgICAgICAgIGluMj0iYmx1ci1vdXQiCiAgICAgICAgIG1vZGU9Im5vcm1hbCIKICAgICAgICAgaWQ9ImZlQmxlbmQ5IiAvPgogICAgPC9maWx0ZXI+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIGlkPSJjb2luLWdyYWRpZW50IgogICAgICAgeDE9IjAlIgogICAgICAgeTE9IjAlIgogICAgICAgeDI9IjAlIgogICAgICAgeTI9IjEwMCUiPgogICAgICA8c3RvcAogICAgICAgICBvZmZzZXQ9IjAlIgogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojZjlhYTRiIgogICAgICAgICBpZD0ic3RvcDEyIiAvPgogICAgICA8c3RvcAogICAgICAgICBvZmZzZXQ9IjEwMCUiCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiNmNzkzMWEiCiAgICAgICAgIGlkPSJzdG9wMTQiIC8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogIDwvZGVmcz4KICA8ZwogICAgIHRyYW5zZm9ybT0ic2NhbGUoMC4wMTU2MjUpIgogICAgIGlkPSJnMTYiPgogICAgPHBhdGgKICAgICAgIGlkPSJjb2luIgogICAgICAgZD0ibSA2My4wMzU5LDM5Ljc0MSBjIC00LjI3NCwxNy4xNDMgLTIxLjYzNywyNy41NzYgLTM4Ljc4MiwyMy4zMDEgLTE3LjEzOCwtNC4yNzQgLTI3LjU3MSwtMjEuNjM4IC0yMy4yOTUsLTM4Ljc4IDQuMjcyLC0xNy4xNDUgMjEuNjM1LC0yNy41NzkgMzguNzc1LC0yMy4zMDUgMTcuMTQ0LDQuMjc0IDI3LjU3NiwyMS42NCAyMy4zMDIsMzguNzg0IHoiCiAgICAgICBzdHlsZT0iZmlsbDp1cmwoI2NvaW4tZ3JhZGllbnQpIiAvPgogICAgPHBhdGgKICAgICAgIGlkPSJzeW1ib2wiCiAgICAgICBkPSJtIDQ2LjEwMDksMjcuNDQxIGMgMC42MzcsLTQuMjU4IC0yLjYwNSwtNi41NDcgLTcuMDM4LC04LjA3NCBsIDEuNDM4LC01Ljc2OCAtMy41MTEsLTAuODc1IC0xLjQsNS42MTYgYyAtMC45MjMsLTAuMjMgLTEuODcxLC0wLjQ0NyAtMi44MTMsLTAuNjYyIGwgMS40MSwtNS42NTMgLTMuNTA5LC0wLjg3NSAtMS40MzksNS43NjYgYyAtMC43NjQsLTAuMTc0IC0xLjUxNCwtMC4zNDYgLTIuMjQyLC0wLjUyNyBsIDAuMDA0LC0wLjAxOCAtNC44NDIsLTEuMjA5IC0wLjkzNCwzLjc1IGMgMCwwIDIuNjA1LDAuNTk3IDIuNTUsMC42MzQgMS40MjIsMC4zNTUgMS42NzksMS4yOTYgMS42MzYsMi4wNDIgbCAtMS42MzgsNi41NzEgYyAwLjA5OCwwLjAyNSAwLjIyNSwwLjA2MSAwLjM2NSwwLjExNyAtMC4xMTcsLTAuMDI5IC0wLjI0MiwtMC4wNjEgLTAuMzcxLC0wLjA5MiBsIC0yLjI5Niw5LjIwNSBjIC0wLjE3NCwwLjQzMiAtMC42MTUsMS4wOCAtMS42MDksMC44MzQgMC4wMzUsMC4wNTEgLTIuNTUyLC0wLjYzNyAtMi41NTIsLTAuNjM3IGwgLTEuNzQzLDQuMDE5IDQuNTY5LDEuMTM5IGMgMC44NSwwLjIxMyAxLjY4MywwLjQzNiAyLjUwMywwLjY0NiBsIC0xLjQ1Myw1LjgzNCAzLjUwNywwLjg3NSAxLjQzOSwtNS43NzIgYyAwLjk1OCwwLjI2IDEuODg4LDAuNSAyLjc5OCwwLjcyNiBsIC0xLjQzNCw1Ljc0NSAzLjUxMSwwLjg3NSAxLjQ1MywtNS44MjMgYyA1Ljk4NywxLjEzMyAxMC40ODksMC42NzYgMTIuMzg0LC00LjczOSAxLjUyNywtNC4zNiAtMC4wNzYsLTYuODc1IC0zLjIyNiwtOC41MTUgMi4yOTQsLTAuNTI5IDQuMDIyLC0yLjAzOCA0LjQ4MywtNS4xNTUgeiBtIC04LjAyMiwxMS4yNDkgYyAtMS4wODUsNC4zNiAtOC40MjYsMi4wMDMgLTEwLjgwNiwxLjQxMiBsIDEuOTI4LC03LjcyOSBjIDIuMzgsMC41OTQgMTAuMDEyLDEuNzcgOC44NzgsNi4zMTcgeiBtIDEuMDg2LC0xMS4zMTIgYyAtMC45OSwzLjk2NiAtNy4xLDEuOTUxIC05LjA4MiwxLjQ1NyBsIDEuNzQ4LC03LjAxIGMgMS45ODIsMC40OTQgOC4zNjUsMS40MTYgNy4zMzQsNS41NTMgeiIKICAgICAgIHN0eWxlPSJmaWxsOiNmZmZmZmYiIC8+CiAgPC9nPgo8L3N2Zz4=",
        })
      );

    // Add some padding above the donation item
    donate.css("padding", "5px");

    const kg_version = "Kitten Scientists version 1.5.0";

    const optionsElement = $("<div/>", { id: "ks-options", css: { marginBottom: "10px" } });
    const optionsListElement = $("<ul/>");
    const optionsTitleElement = $("<div/>", {
      css: { bottomBorder: "1px solid gray", marginBottom: "5px" },
      text: kg_version,
    });

    optionsElement.append(optionsTitleElement);

    optionsListElement.append(this.getToggle("engine"));
    optionsListElement.append(this.getToggle("build"));
    optionsListElement.append(this.getToggle("space"));
    optionsListElement.append(this.getToggle("craft"));
    optionsListElement.append(this.getToggle("upgrade"));
    optionsListElement.append(this.getToggle("trade"));
    optionsListElement.append(this.getToggle("faith"));
    optionsListElement.append(this.getToggle("time"));
    optionsListElement.append(this.getToggle("timeCtrl"));
    optionsListElement.append(this.getToggle("distribute"));
    optionsListElement.append(this.getToggle("options"));
    optionsListElement.append(this.getToggle("filter"));

    optionsListElement.append(donate);

    // add the options above the game log
    right.prepend(optionsElement.append(optionsListElement));
  }

  setStockWarning(name: Resource, value: number, forReset = false): void {
    // simplest way to ensure it doesn't stick around too often; always do
    // a remove first then re-add only if needed
    const path = forReset ? "#resource-reset-" + name : "#resource-" + name;
    $(path).removeClass("stockWarn");

    const maxValue = this._host.gamePage.resPool.resources.filter(i => i.name == name)[0].maxValue;
    if ((value > maxValue && !(maxValue === 0)) || value === Infinity)
      $(path).addClass("stockWarn");
  }

  setStockValue(name: Resource, value: string, forReset = false): void {
    let n = Number(value);

    if (isNaN(n) || n < 0) {
      this._host.warning("ignoring non-numeric or invalid stock value " + value);
      return;
    }

    if (!this._host.options.auto.resources[name]) {
      this._host.options.auto.resources[name] = {};
    }
    let path;
    if (forReset) {
      path = "#resource-reset-" + name + " #stock-value-" + name;
      n = n < 0 ? Infinity : n;
      this._host.options.auto.resources[name]!.checkForReset = true;
      this._host.options.auto.resources[name]!.stockForReset = n;
    } else {
      path = "#resource-" + name + " #stock-value-" + name;
      this._host.options.auto.resources[name]!.enabled = true;
      this._host.options.auto.resources[name]!.stock = n;
    }
    $(path).text(
      this._host.i18n("resources.stock", [
        n === Infinity ? "∞" : this._host.gamePage.getDisplayValueExt(n),
      ])
    );

    this.setStockWarning(name, n, forReset);
  }

  setConsumeRate(name: Resource, value: string): void {
    const n = parseFloat(value);

    if (isNaN(n) || n < 0.0 || n > 1.0) {
      this._host.warning("ignoring non-numeric or invalid consume rate " + value);
      return;
    }

    if (!this._host.options.auto.resources[name]) {
      this._host.options.auto.resources[name] = {};
    }
    this._host.options.auto.resources[name]!.consume = n;
    $("#consume-rate-" + name).text(this._host.i18n("resources.consume", [n.toFixed(2)]));
  }

  removeResourceControl(name: Resource, forReset = false): void {
    const opt = mustExist(this._host.options.auto.resources[name]);
    if (forReset) {
      opt.checkForReset = false;
    } else {
      opt.enabled = false;
    }

    if (!opt.enabled && !opt.checkForReset) delete this._host.options.auto.resources[name];
  }

  addNewResourceOption(name: Resource, title?: string, forReset = false): UiOptionElement {
    title = title || this._host.gamePage.resPool.get(name)?.title || ucfirst(name);
    const res = this._host.options.auto.resources[name];
    let stock;
    if (forReset && res && res.stockForReset) {
      stock = res.stockForReset;
    } else if (!forReset && res && res.stock) {
      stock = res.stock;
    } else {
      stock = 0;
    }
    const consume = res && res.consume != undefined ? res.consume : this._host.options.consume;

    const container = $("<div/>", {
      id: (forReset ? "resource-reset-" : "resource-") + name,
      css: { display: "inline-block", width: "100%" },
    });

    const label = $("<div/>", {
      id: "resource-label-" + name,
      text: title,
      css: { display: "inline-block", width: "95px" },
    });

    const stockElement = $("<div/>", {
      id: "stock-value-" + name,
      text: this._host.i18n("resources.stock", [
        stock === Infinity ? "∞" : this._host.gamePage.getDisplayValueExt(stock),
      ]),
      css: { cursor: "pointer", display: "inline-block", width: "80px" },
    });

    const consumeElement = $("<div/>", {
      id: "consume-rate-" + name,
      text: this._host.i18n("resources.consume", [consume.toFixed(2)]),
      css: { cursor: "pointer", display: "inline-block" },
    });

    const del = $("<div/>", {
      id: "resource-delete-" + name,
      text: this._host.i18n("resources.del"),
      css: {
        cursor: "pointer",
        display: "inline-block",
        float: "right",
        paddingRight: "5px",
        textShadow: "3px 3px 4px gray",
      },
    });

    if (forReset) {
      container.append(label, stockElement, del);
    } else {
      container.append(label, stockElement, consumeElement, del);
    }

    // once created, set color if relevant
    if (res != undefined && res.stock != undefined) {
      this.setStockWarning(name, res.stock);
    }

    stockElement.on("click", () => {
      const value = window.prompt(this._host.i18n("resources.stock.set", [title]));
      if (value !== null) {
        this.setStockValue(name, value, forReset);
        this._host.saveToKittenStorage();
      }
    });

    consumeElement.on("click", () => {
      const value = window.prompt(this._host.i18n("resources.consume.set", [title]));
      if (value !== null) {
        this.setConsumeRate(name, value);
        this._host.saveToKittenStorage();
      }
    });

    del.on("click", () => {
      if (window.confirm(this._host.i18n("resources.del.confirm", [title]))) {
        container.remove();
        this.removeResourceControl(name, forReset);
        this._host.saveToKittenStorage();
      }
    });

    return container;
  }

  getAvailableResourceOptions(forReset: boolean): Array<UiOptionElement> {
    const items = [];
    const idPrefix = forReset ? "#resource-reset-" : "#resource-";

    for (const i in this._host.gamePage.resPool.resources) {
      const res = this._host.gamePage.resPool.resources[i];

      // Show only new resources that we don't have in the list and that are
      // visible. This helps cut down on total size.
      if (res.name && $(idPrefix + res.name).length === 0) {
        const item = $("<div/>", {
          id: "resource-add-" + res.name,
          text: ucfirst(res.title ? res.title : res.name),
          css: { cursor: "pointer", textShadow: "3px 3px 4px gray" },
        });

        item.on("click", () => {
          item.remove();
          if (!this._host.options.auto.resources[res.name]) {
            this._host.options.auto.resources[res.name] = {};
          }
          if (forReset) {
            this._host.options.auto.resources[res.name]!.checkForReset = true;
            this._host.options.auto.resources[res.name]!.stockForReset = Infinity;
            $("#toggle-reset-list-resources").append(
              this.addNewResourceOption(res.name, res.title, forReset)
            );
          } else {
            this._host.options.auto.resources[res.name]!.enabled = true;
            this._host.options.auto.resources[res.name]!.stock = 0;
            this._host.options.auto.resources[res.name]!.consume = this._host.options.consume;
            $("#toggle-list-resources").append(
              this.addNewResourceOption(res.name, res.title, forReset)
            );
          }
          this._host.saveToKittenStorage();
        });

        items.push(item);
      }
    }

    return items;
  }

  getResourceOptions(forReset = false): UiOptionElement {
    const list = $("<ul/>", {
      id: forReset ? "toggle-reset-list-resources" : "toggle-list-resources",
      css: { display: "none", paddingLeft: "20px" },
    });

    const add = $("<div/>", {
      id: "resources-add",
      text: this._host.i18n("resources.add"),
      css: {
        cursor: "pointer",
        display: "inline-block",
        textShadow: "3px 3px 4px gray",
        borderBottom: "1px solid rgba(185, 185, 185, 0.7)",
      },
    });

    const clearunused = $("<div/>", {
      id: "resources-clear-unused",
      text: this._host.i18n("resources.clear.unused"),
      css: {
        cursor: "pointer",
        display: "inline-block",
        float: "right",
        paddingRight: "5px",
        textShadow: "3px 3px 4px gray",
      },
    });

    clearunused.on("click", () => {
      for (const name in this._host.options.auto.resources) {
        // Only delete resources with unmodified values. Require manual
        // removal of resources with non-standard values.
        if (
          (!this._host.options.auto.resources[name as Resource]!.stock &&
            this._host.options.auto.resources[name as Resource]!.consume ==
              this._host.options.consume) ||
          this._host.options.auto.resources[name as Resource]!.consume == undefined
        ) {
          $("#resource-" + name).remove();
        }
      }
    });

    const allresources = $("<ul/>", {
      id: "available-resources-list",
      css: { display: "none", paddingLeft: "20px" },
    });

    add.on("click", () => {
      allresources.toggle();
      allresources.empty();
      allresources.append(this.getAvailableResourceOptions(forReset));
    });

    if (forReset) list.append(add, allresources);
    else list.append(add, clearunused, allresources);

    // Add all the current resources
    for (const [name] of objectEntries(this._host.options.auto.resources)) {
      const res = mustExist(this._host.options.auto.resources[name]);
      if ((forReset && res.checkForReset) || (!forReset && res.enabled))
        list.append(this.addNewResourceOption(name, undefined, forReset));
    }

    return list;
  }

  getOptionHead(toggleName: string): UiOptionElement {
    const list = $("<ul/>", {
      id: "items-list-" + toggleName,
      css: { display: "none", paddingLeft: "20px" },
    });

    const disableall = $("<div/>", {
      id: "toggle-all-items-" + toggleName,
      text: this._host.i18n("ui.disable.all"),
      css: {
        cursor: "pointer",
        display: "inline-block",
        textShadow: "3px 3px 4px gray",
        marginRight: "8px",
      },
    });

    disableall.on("click", function () {
      // can't use find as we only want one layer of checkboxes
      const items = list.children().children(":checkbox");
      items.prop("checked", false);
      items.change();
      list.children().children(":checkbox").change();
    });

    list.append(disableall);

    const enableall = $("<div/>", {
      id: "toggle-all-items-" + toggleName,
      text: this._host.i18n("ui.enable.all"),
      css: { cursor: "pointer", display: "inline-block", textShadow: "3px 3px 4px gray" },
    });

    enableall.on("click", function () {
      // can't use find as we only want one layer of checkboxes
      const items = list.children().children(":checkbox");
      items.prop("checked", true);
      items.change();
      list.children().children(":checkbox").change();
    });

    list.append(enableall);
    return list;
  }

  getAdditionOptions(): unknown {
    const toggleName = "faith-addition";
    const list = this.getOptionHead(toggleName);

    const addi = this._host.options.auto.faith.addition;
    for (const itemName in addi) {
      const node = this.getOption(itemName, addi[itemName as keyof typeof addi]);

      if (itemName == "bestUnicornBuilding") {
        node.children("label").prop("title", this._host.i18n("option.faith.best.unicorn.desc"));
        const input = node.children("input");
        input.unbind("change");
        const bub = addi.bestUnicornBuilding;
        input.on("change", () => {
          if (input.is(":checked") && !bub.enabled) {
            bub.enabled = true;
            // enable all unicorn buildings
            for (const unicornName in this._host.options.auto.unicorn.items) {
              const building = $("#toggle-" + unicornName);
              building.prop("checked", true);
              building.trigger("change");
            }
            this._host.imessage("status.sub.enable", [
              this._host.i18n("option.faith.best.unicorn"),
            ]);
          } else if (!input.is(":checked") && bub.enabled) {
            bub.enabled = false;
            this._host.imessage("status.sub.disable", [
              this._host.i18n("option.faith.best.unicorn"),
            ]);
          }
          kittenStorage.items[input.attr("id")] = bub.enabled;
          this._host.saveToKittenStorage();
        });
      }

      if (addi[itemName].subTrigger !== undefined) {
        const triggerButton = $("<div/>", {
          id: "set-" + itemName + "-subTrigger",
          text: this._host.i18n("ui.trigger"),
          title: addi[itemName].subTrigger,
          css: {
            cursor: "pointer",
            display: "inline-block",
            float: "right",
            paddingRight: "5px",
            textShadow: "3px 3px 4px gray",
          },
        }).data("option", addi[itemName]);

        if (itemName == "adore") {
          triggerButton.on("click", () => {
            const value = window.prompt(
              this._host.i18n("adore.trigger.set"),
              addi[itemName].subTrigger
            );

            if (value !== null) {
              addi[itemName].subTrigger = parseFloat(value);
              kittenStorage.items[triggerButton[0].id] = addi[itemName].subTrigger;
              this._host.saveToKittenStorage();
              triggerButton[0].title = addi[itemName].subTrigger;
            }
          });
        } else if (itemName == "autoPraise") {
          triggerButton.on("click", () => {
            const value = window.prompt(
              this._host.i18n("ui.trigger.set", [this._host.i18n("option.praise")]),
              addi[itemName].subTrigger
            );

            if (value !== null) {
              addi[itemName].subTrigger = parseFloat(value);
              kittenStorage.items[triggerButton[0].id] = addi[itemName].subTrigger;
              this._host.saveToKittenStorage();
              triggerButton[0].title = addi[itemName].subTrigger;
            }
          });
        }

        node.append(triggerButton);
      }

      list.append(node);
    }

    return list;
  }

  getToggle(toggleName: string): UiOptionElement {
    const itext = ucfirst(this._host.i18n("ui." + toggleName));

    const auto = this._host.options.auto[toggleName];
    const element = $("<li/>", { id: "ks-" + toggleName });

    const label = $("<label/>", {
      for: "toggle-" + toggleName,
      text: itext,
    });

    const input = $("<input/>", {
      id: "toggle-" + toggleName,
      type: "checkbox",
    });

    if (auto.enabled) {
      input.prop("checked", true);
    }

    // engine needs a custom toggle
    if (toggleName !== "engine") {
      input.on("change", () => {
        if (input.is(":checked") && auto.enabled == false) {
          auto.enabled = true;
          if (toggleName === "filter" || toggleName === "options") {
            this._host.imessage("status.sub.enable", [itext]);
          } else {
            this._host.imessage("status.auto.enable", [itext]);
          }
          this._host.saveToKittenStorage();
        } else if (!input.is(":checked") && auto.enabled == true) {
          auto.enabled = false;
          if (toggleName === "filter" || toggleName === "options") {
            this._host.imessage("status.sub.disable", [itext]);
          } else {
            this._host.imessage("status.auto.disable", [itext]);
          }
          this._host.saveToKittenStorage();
        }
      });
    }

    element.append(input, label);

    if (auto.items) {
      // Add a border on the element
      element.css("borderBottom", "1px  solid rgba(185, 185, 185, 0.7)");

      const toggle = $("<div/>", {
        css: { display: "inline-block", float: "right" },
      });

      const button = $("<div/>", {
        id: "toggle-items-" + toggleName,
        text: this._host.i18n("ui.items"),
        css: {
          cursor: "pointer",
          display: "inline-block",
          float: "right",
          paddingRight: "5px",
          textShadow: "3px 3px 4px gray",
        },
      });

      element.append(button);

      const list = this.getOptionHead(toggleName);

      // merge unicorn to faith
      if (toggleName == "faith") {
        for (const itemName in options.auto.unicorn.items) {
          list.append(this.getOption(itemName, options.auto.unicorn.items[itemName]));
        }
      }

      // fill out list with toggle items
      for (const itemName in auto.items) {
        switch (toggleName) {
          case "trade":
            list.append(this.getTradeOption(itemName, auto.items[itemName]));
            break;
          case "craft":
            list.append(this.getCraftOption(itemName, auto.items[itemName]));
            break;
          case "timeCtrl":
            list.append(this.getTimeCtrlOption(itemName, auto.items[itemName]));
            break;
          case "options":
            list.append(this.getOptionsOption(itemName, auto.items[itemName]));
            break;
          case "upgrade":
            list.append(
              this.getOption(
                itemName,
                auto.items[itemName],
                this._host.i18n("ui.upgrade." + itemName)
              )
            );
            break;
          case "distribute":
            list.append(this.getDistributeOption(itemName, auto.items[itemName]));
            break;
          case "build":
          case "space":
            list.append(this.getLimitedOption(itemName, auto.items[itemName]));
            break;
          default:
            list.append(this.getOption(itemName, auto.items[itemName]));
            break;
        }
      }

      button.on("click", () => {
        list.toggle();
      });

      // Add resource controls for crafting, sort of a hack
      if (toggleName === "craft") {
        const resources = $("<div/>", {
          id: "toggle-resource-controls",
          text: this._host.i18n("ui.craft.resources"),
          css: {
            cursor: "pointer",
            display: "inline-block",
            float: "right",
            paddingRight: "5px",
            textShadow: "3px 3px 4px gray",
          },
        });

        const resourcesList = this.getResourceOptions();

        // When we click the items button, make sure we clear resources
        button.on("click", () => {
          resourcesList.toggle(false);
        });

        resources.on("click", () => {
          list.toggle(false);
          resourcesList.toggle();
        });

        element.append(resources);
      }

      // Add additional controls for faith, sort of a hack again
      if (toggleName === "faith") {
        const addition = $("<div/>", {
          id: "toggle-addition-controls",
          text: this._host.i18n("ui.faith.addtion"),
          css: {
            cursor: "pointer",
            display: "inline-block",
            float: "right",
            paddingRight: "5px",
            textShadow: "3px 3px 4px gray",
          },
        });

        const additionList = this.getAdditionOptions();

        button.on("click", () => {
          additionList.toggle(false);
        });

        addition.on("click", () => {
          list.toggle(false);
          additionList.toggle();
        });

        element.append(addition);

        // disable auto best unicorn building when unicorn building was disable
        for (const unicornName in this._host.options.auto.unicorn.items) {
          const ub = list.children().children("#toggle-" + unicornName);
          ub.on("change", event => {
            if (!$(event.target).is(":checked")) {
              const b = $("#toggle-bestUnicornBuilding");
              b.prop("checked", false);
              b.trigger("change");
            }
          });
        }
      }
    }

    if (auto.trigger !== undefined) {
      const triggerButton = $("<div/>", {
        id: "trigger-" + toggleName,
        text: this._host.i18n("ui.trigger"),
        title: auto.trigger,
        css: {
          cursor: "pointer",
          display: "inline-block",
          float: "right",
          paddingRight: "5px",
          textShadow: "3px 3px 4px gray",
        },
      });

      triggerButton.on("click", () => {
        const value = window.prompt(this._host.i18n("ui.trigger.set", [itext]), auto.trigger);

        if (value !== null) {
          auto.trigger = parseFloat(value);
          this._host.saveToKittenStorage();
          triggerButton[0].title = auto.trigger;
        }
      });

      element.append(triggerButton);
    }

    if (toggleName === "craft") {
      element.append(resourcesList);
    } else if (toggleName === "faith") {
      element.append(additionList);
    }

    if (auto.items) {
      element.append(toggle, list);
    }

    return element;
  }

  getTradeOption(name: string, option: unknown): unknown {
    const iname = ucfirst(this._host.i18n("$trade.race." + name));

    const element = this.getOption(name, option, iname);
    element.css("borderBottom", "1px solid rgba(185, 185, 185, 0.7)");

    //Limited Trading
    const label = $("<label/>", {
      for: "toggle-limited-" + name,
      text: this._host.i18n("ui.limit"),
    });

    const input = $("<input/>", {
      id: "toggle-limited-" + name,
      type: "checkbox",
    }).data("option", option);

    if (option.limited) {
      input.prop("checked", true);
    }

    input.on("change", () => {
      if (input.is(":checked") && option.limited == false) {
        option.limited = true;
        this._host.imessage("trade.limited", [iname]);
      } else if (!input.is(":checked") && option.limited == true) {
        option.limited = false;
        this._host.imessage("trade.unlimited", [iname]);
      }
      kittenStorage.items[input.attr("id")] = option.limited;
      this._host.saveToKittenStorage();
    });

    element.append(input, label);
    //Limited Trading End

    const button = $("<div/>", {
      id: "toggle-seasons-" + name,
      text: this._host.i18n("trade.seasons"),
      css: {
        cursor: "pointer",
        display: "inline-block",
        float: "right",
        paddingRight: "5px",
        textShadow: "3px 3px 4px gray",
      },
    });

    const list = $("<ul/>", {
      id: "seasons-list-" + name,
      css: { display: "none", paddingLeft: "20px" },
    });

    // fill out the list with seasons
    list.append(this.getSeason(name, "spring", option));
    list.append(this.getSeason(name, "summer", option));
    list.append(this.getSeason(name, "autumn", option));
    list.append(this.getSeason(name, "winter", option));

    button.on("click", function () {
      list.toggle();
    });

    element.append(button, list);

    return element;
  }

  getSeason(name: string, season: Season, option: unknown): UiOptionElement {
    const iname = ucfirst(this._host.i18n("$trade.race." + name));
    const iseason = ucfirst(this._host.i18n("$calendar.season." + season));

    const element = $("<li/>");

    const label = $("<label/>", {
      for: "toggle-" + name + "-" + season,
      text: ucfirst(iseason),
    });

    const input = $("<input/>", {
      id: "toggle-" + name + "-" + season,
      type: "checkbox",
    }).data("option", option);

    if (option[season]) {
      input.prop("checked", true);
    }

    input.on("change", () => {
      if (input.is(":checked") && option[season] == false) {
        option[season] = true;
        this._host.imessage("trade.season.enable", [iname, iseason]);
      } else if (!input.is(":checked") && option[season] == true) {
        option[season] = false;
        this._host.imessage("trade.season.disable", [iname, iseason]);
      }
      kittenStorage.items[input.attr("id")] = option[season];
      this._host.saveToKittenStorage();
    });

    element.append(input, label);

    return element;
  }

  getSeasonForTimeSkip(season: Season, option: unknown): UiOptionElement {
    const iseason = ucfirst(this._host.i18n("$calendar.season." + season));

    const element = $("<li/>");

    const label = $("<label/>", {
      for: "toggle-timeSkip-" + season,
      text: ucfirst(iseason),
    });

    const input = $("<input/>", {
      id: "toggle-timeSkip-" + season,
      type: "checkbox",
    }).data("option", option);

    if (option[season]) {
      input.prop("checked", true);
    }

    input.on("change", () => {
      if (input.is(":checked") && option[season] == false) {
        option[season] = true;
        this._host.imessage("time.skip.season.enable", [iseason]);
      } else if (!input.is(":checked") && option[season] == true) {
        option[season] = false;
        this._host.imessage("time.skip.season.disable", [iseason]);
      }
      kittenStorage.items[input.attr("id")] = option[season];
      this._host.saveToKittenStorage();
    });

    element.append(input, label);

    return element;
  }

  getOption(name: string, option: unknown, iname?: string): UiOptionElement {
    const element = $("<li/>");
    const elementLabel = iname || option.label || ucfirst(name);

    const label = $("<label/>", {
      for: "toggle-" + name,
      text: elementLabel,
      css: { display: "inline-block", minWidth: "80px" },
    });

    const input = $("<input/>", {
      id: "toggle-" + name,
      type: "checkbox",
    }).data("option", option);

    if (option.enabled) {
      input.prop("checked", true);
    }

    input.on("change", () => {
      if (input.is(":checked") && option.enabled == false) {
        option.enabled = true;
        if (option.filter) {
          this._host.imessage("filter.enable", [elementLabel]);
        } else if (option.misc) {
          this._host.imessage("status.sub.enable", [elementLabel]);
        } else {
          this._host.imessage("status.auto.enable", [elementLabel]);
        }
      } else if (!input.is(":checked") && option.enabled == true) {
        option.enabled = false;
        if (option.filter) {
          this._host.imessage("filter.disable", [elementLabel]);
        } else if (option.misc) {
          this._host.imessage("status.sub.disable", [elementLabel]);
        } else {
          this._host.imessage("status.auto.disable", [elementLabel]);
        }
      }
      kittenStorage.items[input.attr("id")] = option.enabled;
      this._host.saveToKittenStorage();
    });

    element.append(input, label);

    return element;
  }

  getLimitedOption(name: string, option: unknown, iname: string): UiOptionElement {
    const element = $("<li/>");
    const elementLabel = iname || option.label || ucfirst(name);

    const label = $("<label/>", {
      for: "toggle-" + name,
      text: elementLabel,
      css: { display: "inline-block", minWidth: "80px" },
    });

    const input = $("<input/>", {
      id: "toggle-" + name,
      type: "checkbox",
    }).data("option", option);

    if (option.enabled) {
      input.prop("checked", true);
    }

    input.on("change", () => {
      if (input.is(":checked") && option.enabled == false) {
        option.enabled = true;
        if (option.filter) {
          this._host.imessage("filter.enable", [elementLabel]);
        } else if (option.misc) {
          this._host.imessage("status.sub.enable", [elementLabel]);
        } else {
          this._host.imessage("status.auto.enable", [elementLabel]);
        }
      } else if (!input.is(":checked") && option.enabled == true) {
        option.enabled = false;
        if (option.filter) {
          this._host.imessage("filter.disable", [elementLabel]);
        } else if (option.misc) {
          this._host.imessage("status.sub.disable", [elementLabel]);
        } else {
          this._host.imessage("status.auto.disable", [elementLabel]);
        }
      }
      kittenStorage.items[input.attr("id")] = option.enabled;
      this._host.saveToKittenStorage();
    });

    const maxButton = $("<div/>", {
      id: "set-" + name + "-max",
      text: this._host.i18n("ui.max", [option.max]),
      title: option.max,
      css: {
        cursor: "pointer",
        display: "inline-block",
        float: "right",
        paddingRight: "5px",
        textShadow: "3px 3px 4px gray",
      },
    }).data("option", option);

    maxButton.on("click", () => {
      const value = window.prompt(this._host.i18n("ui.max.set", [option.label]), option.max);

      if (value !== null) {
        option.max = parseInt(value);
        kittenStorage.items[maxButton.attr("id")] = option.max;
        this._host.saveToKittenStorage();
        maxButton[0].title = option.max;
        maxButton[0].innerText = i18n("ui.max", [option.max]);
      }
    });

    element.append(input, label, maxButton);

    return element;
  }

  getCraftOption(name: string, option: unknown): UiOptionElement {
    const iname = ucfirst(this._host.i18n("$resources." + name + ".title"));

    const element = this.getOption(name, option, iname);

    const label = $("<label/>", {
      for: "toggle-limited-" + name,
      text: this._host.i18n("ui.limit"),
    });

    const input = $("<input/>", {
      id: "toggle-limited-" + name,
      type: "checkbox",
    }).data("option", option);

    if (option.limited) {
      input.prop("checked", true);
    }

    input.on("change", () => {
      if (input.is(":checked") && option.limited == false) {
        option.limited = true;
        this._host.imessage("craft.limited", [iname]);
      } else if (!input.is(":checked") && option.limited == true) {
        option.limited = false;
        this._host.imessage("craft.unlimited", [iname]);
      }
      kittenStorage.items[input.attr("id")] = option.limited;
      this._host.saveToKittenStorage();
    });

    element.append(input, label);

    return element;
  }

  getCycle(index: number, option: unknown): UiOptionElement {
    const cycle = this._host.gamePage.calendar.cycles[index];

    const element = $("<li/>");

    const label = $("<label/>", {
      for: "toggle-timeSkip-" + index,
      text: cycle.title,
    });

    const input = $("<input/>", {
      id: "toggle-timeSkip-" + index,
      type: "checkbox",
    }).data("option", option);

    if (option[index]) {
      input.prop("checked", true);
    }

    input.on("change", () => {
      if (input.is(":checked") && option[index] == false) {
        option[index] = true;
        this._host.imessage("time.skip.cycle.enable", [cycle.title]);
      } else if (!input.is(":checked") && option[index] == true) {
        option[index] = false;
        this._host.imessage("time.skip.cycle.disable", [cycle.title]);
      }
      kittenStorage.items[input.attr("id")] = option[index];
      this._host.saveToKittenStorage();
    });

    element.append(input, label);

    return element;
  }

  getResetOption(name: string, type: unknown, option: unknown): UiOptionElement {
    const element = $("<li/>");
    const elementLabel = option.label;

    const label = $("<label/>", {
      for: "toggle-reset-" + type + "-" + name,
      text: elementLabel,
      css: { display: "inline-block", minWidth: "80px" },
    });

    const input = $("<input/>", {
      id: "toggle-reset-" + type + "-" + name,
      type: "checkbox",
    }).data("option", option);

    if (option.checkForReset) {
      input.prop("checked", true);
    }

    input.on("change", () => {
      if (input.is(":checked") && option.checkForReset == false) {
        option.checkForReset = true;
        this._host.imessage("status.reset.check.enable", [elementLabel]);
      } else if (!input.is(":checked") && option.checkForReset == true) {
        option.checkForReset = false;
        this._host.imessage("status.reset.check.disable", [elementLabel]);
      }
      kittenStorage.items[input.attr("id")] = option.checkForReset;
      this._host.saveToKittenStorage();
    });

    const minButton = $("<div/>", {
      id: "set-reset-" + type + "-" + name + "-min",
      text: this._host.i18n("ui.min", [option.triggerForReset]),
      title: option.triggerForReset,
      css: {
        cursor: "pointer",
        display: "inline-block",
        float: "right",
        paddingRight: "5px",
        textShadow: "3px 3px 4px gray",
      },
    }).data("option", option);

    minButton.on("click", () => {
      const value = window.prompt(
        this._host.i18n("reset.check.trigger.set", [option.label]),
        option.triggerForReset
      );

      if (value !== null) {
        option.triggerForReset = parseInt(value);
        kittenStorage.items[minButton.attr("id")] = option.triggerForReset;
        this._host.saveToKittenStorage();
        minButton[0].title = option.triggerForReset;
        minButton[0].innerText = this._host.i18n("ui.min", [option.triggerForReset]);
      }
    });

    element.append(input, label, minButton);

    return element;
  }

  getTimeCtrlOption(name: string, option: unknown): UiOptionElement {
    const element = this.getOption(name, option);

    if (name == "timeSkip") {
      const triggerButton = $("<div/>", {
        id: "set-timeSkip-subTrigger",
        text: this._host.i18n("ui.trigger"),
        title: option.subTrigger,
        css: {
          cursor: "pointer",
          display: "inline-block",
          float: "right",
          paddingRight: "5px",
          textShadow: "3px 3px 4px gray",
        },
      }).data("option", option);
      triggerButton.on("click", () => {
        const value = window.prompt(
          this._host.i18n("time.skip.trigger.set", []),
          option.subTrigger
        );

        if (value !== null) {
          option.subTrigger = parseFloat(value);
          kittenStorage.items[triggerButton.attr("id")] = option.subTrigger;
          this._host.saveToKittenStorage();
          triggerButton[0].title = option.subTrigger;
        }
      });

      const maximunButton = $("<div/>", {
        id: "set-timeSkip-maximum",
        text: this._host.i18n("ui.maximum"),
        title: option.max,
        css: {
          cursor: "pointer",
          display: "inline-block",
          float: "right",
          paddingRight: "5px",
          textShadow: "3px 3px 4px gray",
        },
      }).data("option", option);
      maximunButton.on("click", () => {
        const value = window.prompt(
          this._host.i18n("ui.max.set", [this._host.i18n("option.time.skip")]),
          option.maximum
        );

        if (value !== null) {
          option.maximum = parseFloat(value);
          kittenStorage.items[maximunButton.attr("id")] = option.maximum;
          this._host.saveToKittenStorage();
          maximunButton[0].title = option.maximum;
        }
      });

      const cyclesButton = $("<div/>", {
        id: "toggle-cycle-" + name,
        text: this._host.i18n("ui.cycles"),
        css: {
          cursor: "pointer",
          display: "inline-block",
          float: "right",
          paddingRight: "5px",
          textShadow: "3px 3px 4px gray",
        },
      });

      const cyclesList = $("<ul/>", {
        id: "cycles-list-" + name,
        css: { display: "none", paddingLeft: "20px" },
      });

      for (const i in this._host.gamePage.calendar.cycles) {
        cyclesList.append(this.getCycle(i, option));
      }

      const seasonsButton = $("<div/>", {
        id: "toggle-seasons-" + name,
        text: this._host.i18n("trade.seasons"),
        css: {
          cursor: "pointer",
          display: "inline-block",
          float: "right",
          paddingRight: "5px",
          textShadow: "3px 3px 4px gray",
        },
      });

      const seasonsList = $("<ul/>", {
        id: "seasons-list-" + name,
        css: { display: "none", paddingLeft: "20px" },
      });

      // fill out the list with seasons
      seasonsList.append(this.getSeasonForTimeSkip("spring", option));
      seasonsList.append(this.getSeasonForTimeSkip("summer", option));
      seasonsList.append(this.getSeasonForTimeSkip("autumn", option));
      seasonsList.append(this.getSeasonForTimeSkip("winter", option));

      cyclesButton.on("click", function () {
        cyclesList.toggle();
        seasonsList.toggle(false);
      });

      seasonsButton.on("click", function () {
        cyclesList.toggle(false);
        seasonsList.toggle();
      });

      element.append(
        cyclesButton,
        seasonsButton,
        maximunButton,
        triggerButton,
        cyclesList,
        seasonsList
      );
    } else if (name == "reset") {
      const resetBuildList = this.getOptionHead("reset-build");
      const resetSpaceList = this.getOptionHead("reset-space");
      const resetResourcesList = this.getResourceOptions(true);
      const resetReligionList = this.getOptionHead("reset-religion");
      const resetTimeList = this.getOptionHead("reset-time");

      for (const item in this._host.options.auto.build.items) {
        resetBuildList.append(
          this.getResetOption(item, "build", this._host.options.auto.build.items[item])
        );
      }
      for (const item in this._host.options.auto.space.items) {
        resetSpaceList.append(
          this.getResetOption(item, "space", this._host.options.auto.space.items[item])
        );
      }
      for (const item in this._host.options.auto.unicorn.items) {
        resetReligionList.append(
          this.getResetOption(item, "unicorn", this._host.options.auto.unicorn.items[item])
        );
      }
      for (const item in this._host.options.auto.faith.items) {
        resetReligionList.append(
          this.getResetOption(item, "faith", this._host.options.auto.faith.items[item])
        );
      }
      for (const item in this._host.options.auto.time.items) {
        resetTimeList.append(
          this.getResetOption(item, "time", this._host.options.auto.time.items[item])
        );
      }

      const buildButton = $("<div/>", {
        id: "toggle-reset-build",
        text: this._host.i18n("ui.build"),
        css: {
          cursor: "pointer",
          display: "inline-block",
          float: "right",
          paddingRight: "5px",
          textShadow: "3px 3px 4px gray",
        },
      });
      const spaceButton = $("<div/>", {
        id: "toggle-reset-space",
        text: this._host.i18n("ui.space"),
        css: {
          cursor: "pointer",
          display: "inline-block",
          float: "right",
          paddingRight: "5px",
          textShadow: "3px 3px 4px gray",
        },
      });
      const resourcesButton = $("<div/>", {
        id: "toggle-reset-resources",
        text: this._host.i18n("ui.craft.resources"),
        css: {
          cursor: "pointer",
          display: "inline-block",
          float: "right",
          paddingRight: "5px",
          textShadow: "3px 3px 4px gray",
        },
      });
      const religionButton = $("<div/>", {
        id: "toggle-reset-religion",
        text: this._host.i18n("ui.faith"),
        css: {
          cursor: "pointer",
          display: "inline-block",
          float: "right",
          paddingRight: "5px",
          textShadow: "3px 3px 4px gray",
        },
      });
      const timeButton = $("<div/>", {
        id: "toggle-reset-time",
        text: this._host.i18n("ui.time"),
        css: {
          cursor: "pointer",
          display: "inline-block",
          float: "right",
          paddingRight: "5px",
          textShadow: "3px 3px 4px gray",
        },
      });

      buildButton.on("click", function () {
        resetBuildList.toggle();
        resetSpaceList.toggle(false);
        resetResourcesList.toggle(false);
        resetReligionList.toggle(false);
        resetTimeList.toggle(false);
      });
      spaceButton.on("click", function () {
        resetBuildList.toggle(false);
        resetSpaceList.toggle();
        resetResourcesList.toggle(false);
        resetReligionList.toggle(false);
        resetTimeList.toggle(false);
      });
      resourcesButton.on("click", function () {
        resetBuildList.toggle(false);
        resetSpaceList.toggle(false);
        resetResourcesList.toggle();
        resetReligionList.toggle(false);
        resetTimeList.toggle(false);
      });
      religionButton.on("click", function () {
        resetBuildList.toggle(false);
        resetSpaceList.toggle(false);
        resetResourcesList.toggle(false);
        resetReligionList.toggle();
        resetTimeList.toggle(false);
      });
      timeButton.on("click", function () {
        resetBuildList.toggle(false);
        resetSpaceList.toggle(false);
        resetResourcesList.toggle(false);
        resetReligionList.toggle(false);
        resetTimeList.toggle();
      });

      element.append(
        buildButton,
        spaceButton,
        resourcesButton,
        religionButton,
        timeButton,
        resetBuildList,
        resetSpaceList,
        resetResourcesList,
        resetReligionList,
        resetTimeList
      );
    } else {
      const triggerButton = $("<div/>", {
        id: "set-" + name + "-subTrigger",
        text: this._host.i18n("ui.trigger"),
        title: option.subTrigger,
        css: {
          cursor: "pointer",
          display: "inline-block",
          float: "right",
          paddingRight: "5px",
          textShadow: "3px 3px 4px gray",
        },
      }).data("option", option);

      triggerButton.on("click", function () {
        const value = window.prompt(
          this._host.i18n("ui.trigger.set", [option.label]),
          option.subTrigger
        );

        if (value !== null) {
          option.subTrigger = parseFloat(value);
          kittenStorage.items[triggerButton.attr("id")] = option.subTrigger;
          this._host.saveToKittenStorage();
          triggerButton[0].title = option.subTrigger;
        }
      });
      element.append(triggerButton);
    }

    return element;
  }

  getOptionsOption(name: string, option: unknown): unknown {
    const element = this.getOption(name, option);

    // hack for style.
    // If there are more UI options, split it to "getUIOption"
    if (name == "style") {
      const input = element.children("input");
      input.unbind("change");
      input.on("change", () => {
        option.enabled = input.prop("checked");
        kittenStorage.items[input.attr("id")] = option.enabled;
        this._host.saveToKittenStorage();
        if (option.enabled) {
          document.body.setAttribute("data-ks-style", "");
        } else {
          document.body.removeAttribute("data-ks-style");
        }
      });
    }

    if (option.subTrigger !== undefined) {
      const triggerButton = $("<div/>", {
        id: "set-" + name + "-subTrigger",
        text: this._host.i18n("ui.trigger"),
        title: option.subTrigger,
        css: {
          cursor: "pointer",
          display: "inline-block",
          float: "right",
          paddingRight: "5px",
          textShadow: "3px 3px 4px gray",
        },
      }).data("option", option);

      triggerButton.on("click", () => {
        let value;
        if (name == "crypto") {
          value = window.prompt(
            this._host.i18n("ui.trigger.crypto.set", [option.label]),
            option.subTrigger
          );
        } else {
          value = window.prompt(
            this._host.i18n("ui.trigger.set", [option.label]),
            option.subTrigger
          );
        }

        if (value !== null) {
          option.subTrigger = parseFloat(value);
          kittenStorage.items[triggerButton.attr("id")] = option.subTrigger;
          this._host.saveToKittenStorage();
          triggerButton[0].title = option.subTrigger;
        }
      });

      element.append(triggerButton);
    }

    return element;
  }

  getDistributeOption(name: string, option: unknown): UiOptionElement {
    const iname = ucfirst(this._host.i18n("$village.job." + name));

    const element = this.getOption(name, option, iname);
    element.css("borderBottom", "1px solid rgba(185, 185, 185, 0.7)");

    //Limited Distribution
    const label = $("<label/>", {
      for: "toggle-limited-" + name,
      text: this._host.i18n("ui.limit"),
    });

    const input = $("<input/>", {
      id: "toggle-limited-" + name,
      type: "checkbox",
    }).data("option", option);

    if (option.limited) {
      input.prop("checked", true);
    }

    input.on("change", () => {
      if (input.is(":checked") && option.limited == false) {
        option.limited = true;
        this._host.imessage("distribute.limited", [iname]);
      } else if (!input.is(":checked") && option.limited == true) {
        option.limited = false;
        this._host.imessage("distribute.unlimited", [iname]);
      }
      kittenStorage.items[input.attr("id")] = option.limited;
      this._host.saveToKittenStorage();
    });

    element.append(input, label);

    const maxButton = $("<div/>", {
      id: "set-" + name + "-max",
      text: this._host.i18n("ui.max", [option.max]),
      title: option.max,
      css: {
        cursor: "pointer",
        display: "inline-block",
        float: "right",
        paddingRight: "5px",
        textShadow: "3px 3px 4px gray",
      },
    }).data("option", option);

    maxButton.on("click", () => {
      const value = window.prompt(this._host.i18n("ui.max.set", [iname]), option.max);

      if (value !== null) {
        option.max = parseInt(value);
        kittenStorage.items[maxButton.attr("id")] = option.max;
        this._host.saveToKittenStorage();
        maxButton[0].title = option.max;
        maxButton[0].innerText = this._host.i18n("ui.max", [option.max]);
      }
    });

    element.append(maxButton);

    return element;
  }
}
