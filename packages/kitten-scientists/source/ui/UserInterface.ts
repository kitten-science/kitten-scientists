import { isNil, mustExist } from "@oliversalzburg/js-utils/data/nil.js";
import { KittenScientists } from "../KittenScientists.js";
import { Icons } from "../images/Icons.js";
import { cwarn } from "../tools/Log.js";
import { BonfireSettingsUi } from "./BonfireSettingsUi.js";
import { EngineSettingsUi } from "./EngineSettingsUi.js";
import { InternalsUi } from "./InternalsUi.js";
import { LogFiltersSettingsUi } from "./LogFilterSettingsUi.js";
import { ReligionSettingsUi } from "./ReligionSettingsUi.js";
import { ResourcesSettingsUi } from "./ResourcesSettingsUi.js";
import { ScienceSettingsUi } from "./ScienceSettingsUi.js";
import { SpaceSettingsUi } from "./SpaceSettingsUi.js";
import { StateManagementUi } from "./StateManagementUi.js";
import { TimeControlSettingsUi } from "./TimeControlSettingsUi.js";
import { TimeSettingsUi } from "./TimeSettingsUi.js";
import { TradeSettingsUi } from "./TradeSettingsUi.js";
import { VillageSettingsUi } from "./VillageSettingsUi.js";
import { WorkshopSettingsUi } from "./WorkshopSettingsUi.js";
import { UiComponent } from "./components/UiComponent.js";

export class UserInterface extends UiComponent {
  readonly element: JQuery;
  readonly showActivity: JQuery;

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
    | StateManagementUi
    | InternalsUi
  >;

  constructor(host: KittenScientists) {
    super(host);

    const engine = this._host.engine;
    this._engineUi = new EngineSettingsUi(this._host, engine.settings);
    this._sections = [
      new BonfireSettingsUi(this._host, engine.bonfireManager.settings),
      new VillageSettingsUi(this._host, engine.villageManager.settings),
      new ScienceSettingsUi(this._host, engine.scienceManager.settings, engine.settings.language),
      new WorkshopSettingsUi(this._host, engine.workshopManager.settings, engine.settings.language),
      new ResourcesSettingsUi(this._host, engine.settings.resources, engine.settings.language),
      new TradeSettingsUi(this._host, engine.tradeManager.settings),
      new ReligionSettingsUi(this._host, engine.religionManager.settings),
      new SpaceSettingsUi(this._host, engine.spaceManager.settings),
      new TimeSettingsUi(this._host, engine.timeManager.settings),
      new TimeControlSettingsUi(
        this._host,
        engine.timeControlManager.settings,
        engine.settings.language,
      ),
      new LogFiltersSettingsUi(this._host, engine.settings.filters),
      new StateManagementUi(this._host, engine.settings.states, engine.settings.language),
      new InternalsUi(this._host, engine.settings),
    ];

    this._installCss();

    const ks = $("<div/>", { id: "ks" });

    const optionsListElement = $("<ul/>");
    optionsListElement.append(this._engineUi.element);
    this._sections.forEach(section => optionsListElement.append(section.element));
    ks.append(optionsListElement);

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

    // Set up the "show activity summary" area.
    this.showActivity = $("<span/>", {
      html: `<svg style="width: 15px; height: 15px;" viewBox="0 0 48 48"><path fill="currentColor" d="${Icons.Summary}"/></svg>`,
      title: this._host.engine.i18n("summary.show"),
    }).addClass("ks-show-activity");

    this.showActivity.on("click", () => {
      this._host.engine.displayActivitySummary();
    });

    $("#clearLog").prepend(this.showActivity);

    // Add Kitten Scientists above the game log.
    if (engine.settings.ksColumn.enabled) {
      $("#rightColumn").after(
        '<div id="ksColumn" class="column"><span class="ksSpacer"></span></div>',
      );
    } else {
      $("#ksColumn").remove();
    }
    const right = $(engine.settings.ksColumn.enabled ? "#ksColumn" : "#rightColumn");
    if (right.length === 0) {
      // Try to fall back to options page.
      const optionsPageContent = $("#optionsPage .full-screen-position .page .page-content");
      if (optionsPageContent.length === 0) {
        cwarn("Unable to find right column to inject UI into. Running headless.");
      } else {
        optionsPageContent.append(ks);
        ks.attr("style", "border-top:1px solid grey; padding:15px");
      }
    } else {
      right.prepend(ks);
    }
    this.element = ks;
  }

  destroy() {
    this.showActivity.remove();
    this.element.remove();
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
      `#ksColumn {
        min-width: 250px;
        max-width: 440px;
        vertical-align: top;
        padding-left: 8px;
        top: 20px;
        position: relative;
        overflow-y: auto;
      }`,
    );
    this._addRule(
      `.ksSpacer {
        display: block;
        margin-bottom: 100px;
      }`,
    );
    this._addRule(
      `#ks {
        margin: 5px 0 10px 0;
        padding-right: 10px;
      }`,
    );
    this._addRule("#ks ul { list-style: none; margin: 0; padding: 0; }");
    this._addRule('#ks ul:after { clear: both; content: " "; display: block; height: 0; }');
    this._addRule(
      `#ks .ks-checkbox {
        margin: 1px 5px 2px 2px;
       }`,
    );
    this._addRule(
      `#ks .ks-fieldset {
        border-bottom: none;
        border-right: none;
        border-top: none;
       }`,
    );
    this._addRule(
      `#ks ul li { 
        float: left;
        width: 100%;
        border-bottom: 1px solid transparent;
        transition: .3s;
      }`,
    );
    this._addRule(
      `#ks ul li .ks-panel-content { 
        border-left: 1px dashed grey;
        padding-left: 16px;
        margin-left: 8px;
        margin-top: 5px;
      }`,
    );
    this._addRule(
      `#ks ul .ks-setting.ks-expanded { 
        margin-bottom: 10px;
      }`,
    );
    // Hover guides
    this._addRule(
      `#ks ul .ks-setting:not(.ks-expanded):not(.ks-toolbar):hover { 
        border-bottom: 1px solid rgba(185, 185, 185, 0.5);
      }`,
    );

    // Setting: Label
    this._addRule(
      `#ks ul li.ks-setting .ks-label {
        display: inline-block;
        min-width: 120px;
        opacity: 0.8;
      }`,
    );
    this._addRule(
      `#ks ul li.ks-setting .ks-label:hover {
        opacity: 1;
      }`,
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
      }`,
    );
    // Setting: Toolbar
    this._addRule(
      `#ks ul li.ks-setting.ks-toolbar {
        border-bottom: 1px dotted rgba(255, 255, 255, 0.2);
        padding: 0 0 2px 0;
        margin: 0 0 3px 0;
      }`,
    );
    this._addRule(
      `#ks ul li.ks-setting.ks-toolbar > * {
        margin: 0 3px 0 0;
      }`,
    );
    // Setting: Button
    this._addRule(
      `#ks ul li.ks-setting .ks-button {
        border: 1px solid rgba(255, 255, 255, 0.2);
        cursor: pointer;
        display: inline-block;
        padding: 0 2px;
        transition: border .3s;
        opacity: 0.8;
      }`,
    );
    this._addRule(
      `#ks ul li.ks-setting .ks-button:hover {
        border: 1px solid rgba(255, 255, 255, 1);
        opacity: 1;
      }`,
    );
    this._addRule(
      `#ks ul li.ks-setting .ks-button .ks-button-icon {
        margin: 0 2px 0 0;
        vertical-align: sub;
      }`,
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
      }`,
    );
    this._addRule(
      `#ks ul li.ks-setting .ks-icon-button:hover {
        opacity: 1;
      }`,
    );
    this._addRule(
      `#ks ul li.ks-setting .ks-icon-label {
        display: inline-block;
        margin-right: 4px;
        margin-left: 2px;
        vertical-align: middle;
      }`,
    );
    // Setting: Text Button
    this._addRule(
      `#ks ul li.ks-setting .ks-text-button {
        cursor: pointer;
        display: inline-block;
        max-width: 315px;
        user-select: none;
        opacity: 0.8;
      }`,
    );
    this._addRule(
      `#ks ul li.ks-setting .ks-text-button:hover {
        opacity: 1;
      }`,
    );

    // Setting: Header
    this._addRule(
      `#ks ul li.ks-setting .ks-header {
        display: inline-block;
        font-weight: bold;
        min-width: 100px;
        user-select: none;
      }`,
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
        white-space: break-spaces;
      }`,
    );

    // Setting: List
    this._addRule(
      // This compensates the floating tools below the list.
      `#ks ul li.ks-setting .ks-list-container {
        margin-bottom: 4px;
      }`,
    );
    this._addRule(
      `#ks ul li.ks-setting .ks-list.ks-items-list {
        user-select: none;
      }`,
    );
    this._addRule(
      `#ks ul li.ks-setting .ks-list ~ .ks-list-tools {
        border-top: 1px dotted grey;
        margin-left: 0px;
        margin-top: 2px;
      }`,
    );
    this._addRule(
      `#ks ul li.ks-setting .ks-list ~ .ks-list-tools .ks-icon-button {
        display: inline-block;
        float: none;
      }`,
    );
    this._addRule(
      `#ks ul li.ks-setting .ks-max-button {
        float: right;
        padding-right: 5px;
        padding-top: 2px;
      }`,
    );
    // The stock buttons should layout similarly to ks-label.
    this._addRule(
      `#ks ul li.ks-setting .ks-stock-button {
        display: inline-block;
        min-width: 86px;
      }`,
    );
    // blackcoin buy/sell threshold buttons
    this._addRule(
      `#ks ul li.ks-setting .ks-buy-button {
        display: inline-block;
        float: right;
        padding-right: 10px;
        min-width: 86px;
      }`,
    );
    this._addRule(
      `#ks ul li.ks-setting .ks-sell-button {
        display: inline-block;
        float: right;
        padding-right: 10px;
        min-width: 86px;
      }`,
    );

    // Style settings that act as UI delimiters.
    this._addRule(
      `#ks ul .ks-delimiter {
        clear: left;
        margin-bottom: 10px;
      }`,
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
      }`,
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
