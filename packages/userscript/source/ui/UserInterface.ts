import { Icons } from "../images/Icons";
import { isNil, mustExist } from "../tools/Maybe";
import { UserScript } from "../UserScript";
import { BonfireSettingsUi } from "./BonfireSettingsUi";
import { UiComponent } from "./components/UiComponent";
import { EngineSettingsUi } from "./EngineSettingsUi";
import { LogFiltersSettingsUi } from "./LogFilterSettingsUi";
import { ReligionSettingsUi } from "./ReligionSettingsUi";
import { ResourcesSettingsUi } from "./ResourcesSettingsUi";
import { ScienceSettingsUi } from "./ScienceSettingsUi";
import { SpaceSettingsUi } from "./SpaceSettingsUi";
import { TimeControlSettingsUi } from "./TimeControlSettingsUi";
import { TimeSettingsUi } from "./TimeSettingsUi";
import { TradeSettingsUi } from "./TradeSettingsUi";
import { VillageSettingsUi } from "./VillageSettingsUi";
import { WorkshopSettingsUi } from "./WorkshopSettingsUi";

export class UserInterface extends UiComponent {
  readonly element: JQuery<HTMLElement>;

  private _engineUi: EngineSettingsUi;
  private _sections: Array<
    | BonfireSettingsUi
    | SpaceSettingsUi
    | WorkshopSettingsUi
    | ResourcesSettingsUi
    | ScienceSettingsUi
    | TradeSettingsUi
    | ReligionSettingsUi
    | TimeSettingsUi
    | TimeControlSettingsUi
    | VillageSettingsUi
    | LogFiltersSettingsUi
  >;

  constructor(host: UserScript) {
    super(host);

    const engine = this._host.engine;
    this._engineUi = new EngineSettingsUi(this._host, engine.settings);
    this._sections = [
      new BonfireSettingsUi(this._host, engine.bonfireManager.settings),
      new VillageSettingsUi(this._host, engine.villageManager.settings),
      new ScienceSettingsUi(this._host, engine.scienceManager.settings),
      new WorkshopSettingsUi(this._host, engine.workshopManager.settings),
      new ResourcesSettingsUi(this._host, engine.settings.resources),
      new TradeSettingsUi(this._host, engine.tradeManager.settings),
      new ReligionSettingsUi(this._host, engine.religionManager.settings),
      new SpaceSettingsUi(this._host, engine.spaceManager.settings),
      new TimeSettingsUi(this._host, engine.timeManager.settings),
      new TimeControlSettingsUi(this._host, engine.timeControlManager.settings),
      new LogFiltersSettingsUi(this._host, engine.settings.filters),
    ];

    this._installCss();

    const version = "Kitten Scientists v" + (KS_VERSION ?? "(unknown)");

    const ks = $("<div/>", { id: "ks" });
    const optionsTitleElement = $("<div/>", {
      id: "ks-version",
      text: version,
    });
    ks.append(optionsTitleElement);

    const optionsListElement = $("<ul/>");
    optionsListElement.append(this._engineUi.element);
    this._sections.forEach(section => optionsListElement.append(section.element));

    // Make _engineUI's expando button hide/show the other option groups
    const expando = this._engineUi.expando;
    let sectionsVisible = false;
    expando.element.on("click", () => {
      sectionsVisible = !sectionsVisible;
      for (const section of this._sections) {
        section.toggle(sectionsVisible, true);
      }
    });

    // Keep track of open panels and adjust the state of the
    // expando accordingly.
    let panelsOpen = 0;
    for (const section of this._sections) {
      section.addEventListener("panelHidden", () => {
        --panelsOpen;
        if (panelsOpen === 0) {
          sectionsVisible = false;
        }
        if (!sectionsVisible) {
          expando.setCollapsed();
        }
      });
      section.addEventListener("panelShown", () => {
        ++panelsOpen;
        sectionsVisible = true;
        expando.setExpanded();
      });
    }

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
      html: `<svg style="width: 15px; height: 15px;" viewBox="0 0 48 48"><path fill="currentColor" d="${Icons.Summary}"/></svg>`,
      title: this._host.engine.i18n("summary.show"),
    }).addClass("ks-show-activity");

    showActivity.on("click", () => this._host.engine.displayActivitySummary());

    $("#clearLog").prepend(showActivity);

    // add the options above the game log
    const right = $("#rightColumn");
    right.prepend(ks.append(optionsListElement));

    this.element = ks;
  }

  refreshUi(): void {
    this._engineUi.refreshUi();
    for (const section of this._sections) {
      section.refreshUi();
    }
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
        margin: 2px 0 2px 2px;
      }`
    );
    this._addRule("#ks ul { list-style: none; margin: 0; padding: 0; }");
    this._addRule('#ks ul:after { clear: both; content: " "; display: block; height: 0; }');
    this._addRule(
      `#ks .ks-checkbox {
        margin: 1px 5px 2px 2px;
       }`
    );
    this._addRule(
      `#ks .ks-fieldset {
        border-bottom: none;
        border-right: none;
        border-top: none;
       }`
    );
    this._addRule(
      `#ks ul li { 
        float: left;
        width: 100%;
        border-bottom: 1px solid transparent;
        transition: .3s;
      }`
    );
    this._addRule(
      `#ks ul li .ks-panel-content { 
        border-left: 1px dashed grey;
        padding-left: 16px;
        margin-left: 8px;
        margin-top: 5px;
      }`
    );
    this._addRule(
      `#ks ul .ks-setting.ks-expanded { 
        margin-bottom: 10px;
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
        opacity: 0.8;
      }`
    );
    this._addRule(
      `#ks ul li.ks-setting .ks-label:hover {
        opacity: 1;
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
        padding-right: 3px;
        line-height: 0;
        opacity: 0.8;
      }`
    );
    this._addRule(
      `#ks ul li.ks-setting .ks-icon-button:hover {
        opacity: 1;
      }`
    );
    this._addRule(
      `#ks ul li.ks-setting .ks-icon-label {
        display: inline-block;
        margin-right: 4px;
        margin-left: 2px;
        vertical-align: middle;
      }`
    );
    // Setting: Text Button
    this._addRule(
      `#ks ul li.ks-setting .ks-text-button {
        cursor: pointer;
        display: inline-block;
        max-width: 315px;
        user-select: none;
        opacity: 0.8;
      }`
    );
    this._addRule(
      `#ks ul li.ks-setting .ks-text-button:hover {
        opacity: 1;
      }`
    );

    // Setting: Header
    this._addRule(
      `#ks ul li.ks-setting .ks-header {
        display: inline-block;
        font-weight: bold;
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
      // This compensates the floating tools below the list.
      `#ks ul li.ks-setting .ks-list-container {
        margin-bottom: 4px;
      }`
    );
    this._addRule(
      `#ks ul li.ks-setting .ks-list.ks-items-list {
        user-select: none;
      }`
    );
    this._addRule(
      `#ks ul li.ks-setting .ks-list ~ .ks-list-tools {
        border-top: 1px dotted grey;
        margin-left: 0px;
        margin-top: 2px;
      }`
    );
    this._addRule(
      `#ks ul li.ks-setting .ks-list ~ .ks-list-tools .ks-icon-button {
        display: inline-block;
        float: none;
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
        min-width: 86px;
      }`
    );
    // blackcoin buy/sell threshold buttons
    this._addRule(
      `#ks ul li.ks-setting .ks-buy-button {
        display: inline-block;
        float: right;
        padding-right: 10px;
        min-width: 86px;
      }`
    );
    this._addRule(
      `#ks ul li.ks-setting .ks-sell-button {
        display: inline-block;
        float: right;
        padding-right: 10px;
        min-width: 86px;
      }`
    );

    // Style settings that act as UI delimiters.
    this._addRule(
      `#ks ul .ks-delimiter {
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
