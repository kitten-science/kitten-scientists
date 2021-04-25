import { BonfireSettings } from "../options/BonfireSettings";
import { CraftSettings } from "../options/CraftSettings";
import { DistributeSettings } from "../options/DistributeSettings";
import { EngineSettings } from "../options/EngineSettings";
import { FilterSettings } from "../options/FilterSettings";
import { OptionsSettings } from "../options/OptionsSettings";
import { ReligionSettings } from "../options/ReligionSettings";
import { SpaceSettings } from "../options/SpaceSettings";
import { TimeControlSettings } from "../options/TimeControlSettings";
import { TimeSettings } from "../options/TimeSettings";
import { UserScript } from "../UserScript";
import { BonfireSettingsUi } from "./BonfireSettingsUi";
import { CraftSettingsUi } from "./CraftSettingsUi";
import { DistributeSettingsUi } from "./DistributeSettingsUi";
import { EngineSettingsUi } from "./EngineSettingsUi";
import { FiltersSettingsUi } from "./FilterSettingsUi";
import { OptionsSettingsUi } from "./OptionsSettingsUi";
import { ReligionSettingsUi } from "./ReligionSettingsUi";
import { SpaceSettingsUi } from "./SpaceSettingsUi";
import { TimeControlSettingsUi } from "./TimeControlSettingsUi";
import { TimeSettingsUi } from "./TimeSettingsUi";
import { TradingSettingsUi } from "./TradingSettingsUi";
import { UnlockingSettingsUi } from "./UnlockingSettingsUi";

export class UserInterface {
  private readonly _host: UserScript;

  constructor(host: UserScript) {
    this._host = host;
  }

  construct(): void {
    this._installCss();

    const engine = new EngineSettingsUi(this._host, new EngineSettings());
    const bonfire = new BonfireSettingsUi(this._host, new BonfireSettings());
    const space = new SpaceSettingsUi(this._host, new SpaceSettings());
    const craft = new CraftSettingsUi(this._host, new CraftSettings());
    const unlock = new UnlockingSettingsUi(this._host);
    const trading = new TradingSettingsUi(this._host);
    const religion = new ReligionSettingsUi(this._host, new ReligionSettings());
    const time = new TimeSettingsUi(this._host, new TimeSettings());
    const timeCtrl = new TimeControlSettingsUi(this._host, new TimeControlSettings());
    const distribute = new DistributeSettingsUi(this._host, new DistributeSettings());
    const options = new OptionsSettingsUi(this._host, new OptionsSettings());
    const filter = new FiltersSettingsUi(this._host, new FilterSettings());

    const kg_version = "Kitten Scientists v2.0.0-alpha0";
    const optionsElement = $("<div/>", { id: "ks-options", css: { marginBottom: "10px" } });
    const optionsListElement = $("<ul/>");
    const optionsTitleElement = $("<div/>", {
      css: { bottomBorder: "1px solid gray", marginBottom: "5px" },
      text: kg_version,
    });

    optionsElement.append(optionsTitleElement);

    optionsListElement.append(engine.element);
    optionsListElement.append(bonfire.element);
    optionsListElement.append(space.element);
    optionsListElement.append(craft.element);
    optionsListElement.append(unlock.element);
    optionsListElement.append(trading.element);
    optionsListElement.append(religion.element);
    optionsListElement.append(time.element);
    optionsListElement.append(timeCtrl.element);
    optionsListElement.append(distribute.element);
    optionsListElement.append(options.element);
    optionsListElement.append(filter.element);

    // add the options above the game log
    const right = $("#rightColumn");
    right.prepend(optionsElement.append(optionsListElement));
  }

  private _installCss(): void {
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
  }

  private _addRule(rule: string) {
    const sheets = document.styleSheets;
    sheets[0].insertRule(rule, 0);
  }
}
