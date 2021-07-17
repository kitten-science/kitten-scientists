import { Options } from "../options/Options";
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

  private _engineUi: EngineSettingsUi;
  private _bonfireUi: BonfireSettingsUi;
  private _spaceUi: SpaceSettingsUi;
  private _craftUi: CraftSettingsUi;
  private _unlockUi: UnlockingSettingsUi;
  private _tradingUi: TradingSettingsUi;
  private _religionUi: ReligionSettingsUi;
  private _timeUi: TimeSettingsUi;
  private _timeCtrlUi: TimeControlSettingsUi;
  private _distributeUi: DistributeSettingsUi;
  private _optionsUi: OptionsSettingsUi;
  private _filterUi: FiltersSettingsUi;

  constructor(host: UserScript) {
    this._host = host;

    this._engineUi = new EngineSettingsUi(this._host);
    this._bonfireUi = new BonfireSettingsUi(this._host);
    this._spaceUi = new SpaceSettingsUi(this._host);
    this._craftUi = new CraftSettingsUi(this._host);
    this._unlockUi = new UnlockingSettingsUi(this._host);
    this._tradingUi = new TradingSettingsUi(this._host);
    this._religionUi = new ReligionSettingsUi(this._host);
    this._timeUi = new TimeSettingsUi(this._host);
    this._timeCtrlUi = new TimeControlSettingsUi(this._host);
    this._distributeUi = new DistributeSettingsUi(this._host);
    this._optionsUi = new OptionsSettingsUi(this._host);
    this._filterUi = new FiltersSettingsUi(this._host);
  }

  construct(): void {
    this._installCss();

    const kg_version = "Kitten Scientists v2.0.0-alpha1";
    const optionsElement = $("<div/>", { id: "ks-options", css: { marginBottom: "10px" } });
    const optionsListElement = $("<ul/>");
    const optionsTitleElement = $("<div/>", {
      css: { bottomBorder: "1px solid gray", marginBottom: "5px" },
      text: kg_version,
    });

    optionsElement.append(optionsTitleElement);

    optionsListElement.append(this._engineUi.element);
    optionsListElement.append(this._bonfireUi.element);
    optionsListElement.append(this._spaceUi.element);
    optionsListElement.append(this._craftUi.element);
    optionsListElement.append(this._unlockUi.element);
    optionsListElement.append(this._tradingUi.element);
    optionsListElement.append(this._religionUi.element);
    optionsListElement.append(this._timeUi.element);
    optionsListElement.append(this._timeCtrlUi.element);
    optionsListElement.append(this._distributeUi.element);
    optionsListElement.append(this._optionsUi.element);
    optionsListElement.append(this._filterUi.element);

    // Set up the "show activity summary" area.
    const activityBox = $("<div/>", {
      id: "activity-box",
      css: {
        display: "inline-block",
        verticalAlign: "bottom",
      },
    });

    const showActivity = $("<a/>", {
      id: "showActivityHref",
      text: "📝",
      title: this._host.i18n("summary.show"),
      href: "#",
    });

    showActivity.on("click", () => this._host.displayActivitySummary());

    activityBox.append(showActivity);

    $("#clearLog").prepend(activityBox);

    // add the options above the game log
    const right = $("#rightColumn");
    right.prepend(optionsElement.append(optionsListElement));
  }

  setState(state: Options): void {
    this._engineUi.setState(state.auto.engine);
    this._bonfireUi.setState(state.auto.build);
    this._spaceUi.setState(state.auto.space);
    this._craftUi.setState(state.auto.craft);
    this._unlockUi.setState(state.auto.unlock);
    this._tradingUi.setState(state.auto.trade);
    this._religionUi.setState(state.auto.religion);
    this._timeUi.setState(state.auto.time);
    this._timeCtrlUi.setState(state.auto.timeCtrl);
    this._distributeUi.setState(state.auto.distribute);
    this._optionsUi.setState(state.auto.options);
    this._filterUi.setState(state.auto.filters);
  }

  refreshUi(): void {
    this._engineUi.refreshUi();
    this._bonfireUi.refreshUi();
    this._spaceUi.refreshUi();
    this._craftUi.refreshUi();
    this._unlockUi.refreshUi();
    this._tradingUi.refreshUi();
    this._religionUi.refreshUi();
    this._timeUi.refreshUi();
    this._timeCtrlUi.refreshUi();
    this._distributeUi.refreshUi();
    this._optionsUi.refreshUi();
    this._filterUi.refreshUi();
  }

  private _installCss(): void {
    // Basic layout for our own list-based options menus.
    this._addRule(`#ks-options ul { list-style: none; margin: 0 0 5px; padding: 0; }`);
    this._addRule(`#ks-options ul:after { clear: both; content: " "; display: block; height: 0; }`);
    this._addRule(`#ks-options ul li { display: block; float: left; width: 100%; }`);

    // Rules needed to enable stock warning.
    this._addRule(`
      #ks-options #toggle-list-resources .stockWarn *,
      #ks-options #toggle-reset-list-resources .stockWarn * {
        color: #DD1E00;
      }`);

    // Ensure the right column gets a scrollbar, when our content extends it too far down.
    this._addRule(`body #gamePageContainer #game #rightColumn { overflow-y: auto }`);

    // Set the entire UI to a monospace font.
    //this._addRule(
    //  "body {" + // low priority. make sure it can be covered by the theme
    //    "font-family: monospace;" +
    //    "font-size: 12px;" +
    //    "}"
    //);

    // Ignore remaining rules for now, until their use becomes clear.
    return;

    const defaultSelector = "body[data-ks-style]:not(.scheme_sleek)";

    this._addRule(`${defaultSelector} #game { min-width: 1300px; top: 32px; }`);

    this._addRule(
      `${defaultSelector} .column {
        min-height: inherit;
        max-width: inherit !important;
        padding: 1%;
        margin: 0;
        overflow-y: auto; }`
    );

    this._addRule(`${defaultSelector} #leftColumn { height: 92%; width: 26%; }`);

    this._addRule(
      `${defaultSelector} #midColumn { margin-top: 1% !important; height: 90%; width: 48%; }`
    );

    this._addRule(`${defaultSelector} #rightColumn { overflow-y: auto; height: 92%; width: 19%; }`);

    this._addRule(
      `${defaultSelector} #gameLog { overflow-y: hidden !important; width: 100% !important; padding-top: 5px !important; }`
    );

    this._addRule(`${defaultSelector} #resContainer .maxRes { color: #676766; }`);

    this._addRule(
      `${defaultSelector} #game .btn {
        border-radius: 0px;
        font-family: monospace;
        font-size: 12px !important;
        margin: 0 5px 7px 0;
        width: 290px; }`
    );

    // TODO: Sound related to exploration. Should likely be removed.
    this._addRule(
      `${defaultSelector} #game .map-viewport {
        height: 340px;
        max-width: 500px;
        overflow: visible; }`
    );
    this._addRule(`#game .map-dashboard { height: 120px; width: 292px; }`);

    this._addRule(`.right-tab { height: unset !important; }`);
  }

  private _addRule(rule: string) {
    const sheets = document.styleSheets;
    sheets[0].insertRule(rule, 0);
  }
}
