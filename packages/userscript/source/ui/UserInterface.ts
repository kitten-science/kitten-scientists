import { isNil, mustExist } from "../tools/Maybe";
import { UserScript } from "../UserScript";
import { BonfireSettingsUi } from "./BonfireSettingsUi";
import { EngineSettingsUi } from "./EngineSettingsUi";
import { FiltersSettingsUi } from "./FilterSettingsUi";
import { ReligionSettingsUi } from "./ReligionSettingsUi";
import { ResourcesSettingsUi } from "./ResourcesSettingsUi";
import { ScienceSettingsUi } from "./ScienceSettingsUi";
import { SpaceSettingsUi } from "./SpaceSettingsUi";
import { TimeControlSettingsUi } from "./TimeControlSettingsUi";
import { TimeSettingsUi } from "./TimeSettingsUi";
import { TradeSettingsUi } from "./TradeSettingsUi";
import { VillageSettingsUi } from "./VillageSettingsUi";
import { WorkshopSettingsUi } from "./WorkshopSettingsUi";

export class UserInterface {
  private readonly _host: UserScript;

  private _engineUi: EngineSettingsUi;
  private _bonfireUi: BonfireSettingsUi;
  private _spaceUi: SpaceSettingsUi;
  private _craftUi: WorkshopSettingsUi;
  private _resourcesUi: ResourcesSettingsUi;
  private _unlockUi: ScienceSettingsUi;
  private _tradingUi: TradeSettingsUi;
  private _religionUi: ReligionSettingsUi;
  private _timeUi: TimeSettingsUi;
  private _timeCtrlUi: TimeControlSettingsUi;
  private _distributeUi: VillageSettingsUi;
  private _filterUi: FiltersSettingsUi;

  constructor(host: UserScript) {
    this._host = host;

    const engine = this._host.engine;
    this._engineUi = new EngineSettingsUi(this._host, engine.settings);
    this._bonfireUi = new BonfireSettingsUi(this._host, engine.bonfireManager.settings);
    this._spaceUi = new SpaceSettingsUi(this._host, engine.spaceManager.settings);
    this._craftUi = new WorkshopSettingsUi(this._host, engine.workshopManager.settings);
    this._resourcesUi = new ResourcesSettingsUi(this._host, engine.settings.resources);
    this._unlockUi = new ScienceSettingsUi(this._host, engine.scienceManager.settings);
    this._tradingUi = new TradeSettingsUi(this._host, engine.tradeManager.settings);
    this._religionUi = new ReligionSettingsUi(this._host, engine.religionManager.settings);
    this._timeUi = new TimeSettingsUi(this._host, engine.timeManager.settings);
    this._timeCtrlUi = new TimeControlSettingsUi(this._host, engine.timeControlManager.settings);
    this._distributeUi = new VillageSettingsUi(this._host, engine.villageManager.settings);
    this._filterUi = new FiltersSettingsUi(this._host, engine.settings.filters);
  }

  construct(): void {
    this._installCss();

    const version = "Kitten Scientists v" + (KS_VERSION ?? "(unknown)");

    const optionsElement = $("<div/>", { id: "ks" });
    const optionsTitleElement = $("<div/>", {
      id: "ks-version",
      text: version,
    });
    optionsElement.append(optionsTitleElement);

    const optionsListElement = $("<ul/>");
    optionsListElement.append(this._engineUi.element);
    optionsListElement.append(this._bonfireUi.element);
    optionsListElement.append(this._distributeUi.element);
    optionsListElement.append(this._unlockUi.element);
    optionsListElement.append(this._craftUi.element);
    optionsListElement.append(this._resourcesUi.element);
    optionsListElement.append(this._tradingUi.element);
    optionsListElement.append(this._religionUi.element);
    optionsListElement.append(this._spaceUi.element);
    optionsListElement.append(this._timeUi.element);
    optionsListElement.append(this._timeCtrlUi.element);
    optionsListElement.append(this._filterUi.element);

    // Make _engineUI's expando button hide/show the other option groups
    const expando = this._engineUi.expando;
    let sectionsVisible = false;
    expando.element.on("click", () => {
      sectionsVisible = !sectionsVisible;
      if (sectionsVisible) {
        expando.setExpanded();
      } else {
        expando.setCollapsed();
      }

      this._bonfireUi.toggle(sectionsVisible);
      this._spaceUi.toggle(sectionsVisible);
      this._craftUi.toggle(sectionsVisible);
      this._resourcesUi.toggle(sectionsVisible);
      this._unlockUi.toggle(sectionsVisible);
      this._tradingUi.toggle(sectionsVisible);
      this._religionUi.toggle(sectionsVisible);
      this._timeUi.toggle(sectionsVisible);
      this._timeCtrlUi.toggle(sectionsVisible);
      this._distributeUi.toggle(sectionsVisible);
      this._filterUi.toggle(sectionsVisible);
    });

    const copyButton = this._engineUi.copyButton;
    copyButton.element.on("click", () => {
      this._host.copySettings().catch(console.error);
    });
    this._engineUi.importButton.element.on("click", () => {
      const input = window.prompt("Paste your settings here");
      if (isNil(input)) {
        return;
      }
      this._host.importSettings(input);
    });

    // Set up the "show activity summary" area.
    const showActivity = $("<span/>", {
      html: '<svg style="width: 15px; height: 15px;" viewBox="0 0 48 48"><path fill="currentColor" d="M15.45 16.95q.6 0 1.05-.45.45-.45.45-1.05 0-.6-.45-1.05-.45-.45-1.05-.45-.6 0-1.05.45-.45.45-.45 1.05 0 .6.45 1.05.45.45 1.05.45Zm0 8.55q.6 0 1.05-.45.45-.45.45-1.05 0-.6-.45-1.05-.45-.45-1.05-.45-.6 0-1.05.45-.45.45-.45 1.05 0 .6.45 1.05.45.45 1.05.45Zm0 8.55q.6 0 1.05-.45.45-.45.45-1.05 0-.6-.45-1.05-.45-.45-1.05-.45-.6 0-1.05.45-.45.45-.45 1.05 0 .6.45 1.05.45.45 1.05.45ZM9 42q-1.2 0-2.1-.9Q6 40.2 6 39V9q0-1.2.9-2.1Q7.8 6 9 6h23.1l9.9 9.9V39q0 1.2-.9 2.1-.9.9-2.1.9Zm0-3h30V17.55h-8.55V9H9v30ZM9 9v8.55V9v30V9Z"/></svg>',
      title: this._host.engine.i18n("summary.show"),
    }).addClass("ks-show-activity");

    showActivity.on("click", () => this._host.engine.displayActivitySummary());

    $("#clearLog").prepend(showActivity);

    // add the options above the game log
    const right = $("#rightColumn");
    right.prepend(optionsElement.append(optionsListElement));
  }

  refreshUi(): void {
    this._engineUi.refreshUi();
    this._bonfireUi.refreshUi();
    this._spaceUi.refreshUi();
    this._craftUi.refreshUi();
    this._resourcesUi.refreshUi();
    this._unlockUi.refreshUi();
    this._tradingUi.refreshUi();
    this._religionUi.refreshUi();
    this._timeUi.refreshUi();
    this._timeCtrlUi.refreshUi();
    this._distributeUi.refreshUi();
    this._filterUi.refreshUi();
  }

  private _installCss(): void {
    // Basic layout for our own list-based options menus.
    this._addRule(
      `#ks {
        margin-bottom: 10px;
        padding-right: 10px;
      }`
    );
    this._addRule(
      `#ks #ks-version {
        margin: 2px 5px;
      }`
    );
    this._addRule("#ks ul { list-style: none; margin: 0 0 5px; padding: 0; }");
    this._addRule('#ks ul:after { clear: both; content: " "; display: block; height: 0; }');
    this._addRule(
      `#ks ul li { 
        float: left;
        width: 100%;
        border-bottom: 1px solid transparent;
        transition: .3s;
      }`
    );
    // Hover guides
    this._addRule(
      `#ks ul .ks-setting:not(.ks-expanded):hover { 
        border-bottom: 1px solid rgba(185, 185, 185, 0.5);
      }`
    );

    // Setting: Label
    this._addRule(
      `#ks ul li.ks-setting .ks-label {
        display: inline-block;
        min-width: 120px;
      }`
    );
    // Setting: +/- Expando Toggle
    this._addRule(
      `#ks ul li.ks-setting .ks-expando-button {
        border: 1px solid rgba(255, 255, 255, 0.2);
        cursor: pointer;
        display: block;
        float: right;
        min-width: 10px;
        padding: 0px 3px;
        text-align: center;
      }`
    );
    // Setting: Icon Button
    this._addRule(
      `#ks ul li.ks-setting .ks-icon-button {
        cursor: pointer;
        display: block;
        float: right;
        padding-right: 5px;
        padding-top: 2px;
      }`
    );
    this._addRule(
      `#ks ul li.ks-setting .ks-icon-label {
        display: inline-block;
        margin-right: 10px;
        margin-left: 3px;
        vertical-align: middle;
      }`
    );
    // Setting: Text Button
    this._addRule(
      `#ks ul li.ks-setting .ks-text-button {
        cursor: pointer;
        display: inline-block;
        user-select: none;
      }`
    );

    // Setting: Header
    this._addRule(
      `#ks ul li.ks-setting .ks-header {
        color: grey;
        display: inline-block;
        min-width: 100px;
        user-select: none;
      }`
    );
    // Setting: Explainer
    this._addRule(
      `#ks ul li.ks-setting .ks-explainer {
        color: #888;
        display: inline-block;
        min-width: 100px;
        user-select: none;
        padding: 4px;
        user-select: none;
      }`
    );

    // Setting: List
    this._addRule(
      `#ks ul li.ks-setting .ks-list {
        display: none;
        padding-left: 20px;
      }`
    );
    // Items lists have additional padding due to the "enable/disable all" buttons.
    this._addRule(
      `#ks ul li.ks-setting .ks-list.ks-items-list {
        padding-top: 4px;
        user-select: none;
      }`
    );
    this._addRule(
      `#ks ul li.ks-setting .ks-max-button {
        float: right;
        padding-right: 5px;
        padding-top: 2px;
      }`
    );
    // The stock buttons should layout similarly to ks-label.
    this._addRule(
      `#ks ul li.ks-setting .ks-stock-button {
        display: inline-block;
        min-width: 120px;
      }`
    );

    // Style settings that act as UI delimiters.
    this._addRule(
      `#ks ul li.ks-setting.ks-delimiter {
        margin-bottom: 10px;
      }`
    );

    // Rules needed to enable stock warning.
    this._addRule(`
      #ks #toggle-list-resources .stockWarn *,
      #ks #toggle-reset-list-resources .stockWarn * {
        color: #DD1E00;
      }`);

    this._addRule(
      `#game .ks-show-activity {
        cursor: pointer;
        display: inline-block;
        vertical-align: middle;
      }`
    );

    // Ensure the right column gets a scrollbar, when our content extends it too far down.
    this._addRule("#game #rightColumn { overflow-y: auto }");

    this._addRule("#game .res-row .res-cell.ks-stock-above { color: green; }");
    this._addRule("#game .res-row .res-cell.ks-stock-below { color: red; }");
  }

  private _addRule(rule: string) {
    const styleSheetId = "kitten-scientists-styles";
    let styleSheet = document.getElementById(styleSheetId) as HTMLStyleElement;
    if (isNil(styleSheet)) {
      styleSheet = document.createElement("style");
      styleSheet.id = styleSheetId;
      document.head.appendChild(styleSheet);
    }
    const sheet = mustExist(styleSheet.sheet);
    sheet.insertRule(rule);
  }
}
