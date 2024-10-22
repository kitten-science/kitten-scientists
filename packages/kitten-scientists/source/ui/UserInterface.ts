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

    const ks = $("<div/>", { id: "ks" }).addClass("ks-ui");

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
        font-size: 14px;
      }`,
    );
    this._addRule(".ks-ui ul { list-style: none; margin: 0; padding: 0; }");
    this._addRule('.ks-ui ul:after { clear: both; content: " "; display: block; height: 0; }');
    this._addRule(
      `.ks-ui .ks-checkbox {
        margin: 1px 5px 2px 2px;
       }`,
    );
    this._addRule(
      `.ks-ui .ks-fieldset {
        border-bottom: none;
        border-right: none;
        border-top: none;
       }`,
    );

    // List Item Generic
    this._addRule(
      `.ks-head {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        width: 100%;

        border-bottom: 1px solid transparent;
        transition: .3s;
      }`,
    );
    this._addRule(
      `.ks-head .ks-label {
        align-items: flex-start;
        display: flex;
        flex: 1;
        white-space: nowrap;
      }`,
    );
    this._addRule(
      `.ks-head .ks-fill-space {
        flex: *;
      }`,
    );
    this._addRule(
      `.ks-head > .ks-button {
        flex: 1;
        margin-right: 8px;
      }`,
    );
    this._addRule(
      `.ks-head > .ks-text-button {
        flex: 1;
        margin-right: 8px;
      }`,
    );
    this._addRule(
      `.ks-panel-content {
        border-left: 1px dashed grey;
        padding-left: 16px;
        margin-left: 8px;
        margin-top: 5px;
      }`,
    );
    this._addRule(
      `.ks-ui ul li.ks-expanded {
        margin-bottom: 10px;
      }`,
    );
    // Hover guides
    this._addRule(
      `.ks-ui ul .ks-setting {
        border-bottom: 1px solid transparent;
      }`,
    );
    this._addRule(
      `.ks-ui ul .ks-setting:not(.ks-expanded):hover {
        border-bottom: 1px solid rgba(185, 185, 185, 0.5);
      }`,
    );

    // Setting: Label
    this._addRule(
      `.ks-label {
        display: inline-block;
        flex: 1;
        min-width: 120px;
        opacity: 0.8;
      }`,
    );
    this._addRule(
      `.ks-label:hover {
        opacity: 1;
      }`,
    );
    // Setting: +/- Expando Toggle
    this._addRule(
      `.ks-expando-button:not(.expanded) .up {
        display: none;
      }`,
    );
    this._addRule(
      `.ks-expando-button.expanded .down {
        display: none;
      }`,
    );
    // Setting: Toolbar
    this._addRule(
      `.ks-ui ul li.ks-toolbar {
        padding: 0 0 2px 0;
        margin: 0 0 3px 0;
      }`,
    );
    this._addRule(
      `.ks-ui .ks-toolbar > * {
        margin: 0 3px 0 0;
      }`,
    );
    // Setting: Button
    this._addRule(
      `.ks-button {
        border: 1px solid rgba(255, 255, 255, 0.2);
        cursor: pointer;
        display: inline-block;
        padding: 0 2px;
        transition: border .3s;
        opacity: 0.8;
      }`,
    );
    this._addRule(
      `.ks-button.large {
        padding: 5px 10px;
      }`,
    );
    this._addRule(
      `.ks-button.ks-consume-button {
        border: 1px solid transparent;
      }`,
    );
    this._addRule(
      `.ks-button.ks-stock-button {
        border: 1px solid transparent;
      }`,
    );
    this._addRule(
      `.ks-button:hover {
        border: 1px solid rgba(255, 255, 255, 1);
        opacity: 1;
      }`,
    );
    this._addRule(
      `.ks-button .ks-button-icon {
        margin: 0 2px 0 0;
        vertical-align: sub;
      }`,
    );
    // Setting: Icon Button
    this._addRule(
      `.ks-icon-button {
        cursor: pointer;
        display: block;
        padding-right: 3px;
        line-height: 0;
        opacity: 0.8;
        transition: .3s;
      }`,
    );
    this._addRule(
      `.ks-icon-button.ks-inactive {
        opacity: 0.2;
      }`,
    );
    this._addRule(
      `.ks-icon-button:hover {
        opacity: 1;
      }`,
    );
    this._addRule(
      `.ks-icon-button.ks-inactive:hover {
        opacity: 0.4;
      }`,
    );
    this._addRule(
      `.ks-icon-label {
        display: inline-block;
        margin-right: 4px;
        margin-left: 2px;
        vertical-align: middle;
      }`,
    );
    // Setting: Text Button
    this._addRule(
      `.ks-text-button {
        display: inline-block;
        white-space: nowrap;
        opacity: 0.8;

        cursor: pointer;
        user-select: none;
      }`,
    );
    this._addRule(
      `.ks-text-button:hover {
        opacity: 1;
      }`,
    );

    // Setting: Header
    this._addRule(
      `.ks-header {
        display: block;
        margin-bottom: 3px;
        min-width: 100px;

        border-bottom: 1px dashed rgba(255, 255, 255, 0.1);

        font-weight: bold;
        user-select: none;
      }`,
    );
    // Setting: Explainer
    this._addRule(
      `.ks-explainer {
        color: #888;
        display: inline-block;
        min-width: 100px;
        user-select: none;
        padding: 4px;
        user-select: none;
        white-space: break-spaces;
      }`,
    );
    this._addRule(
      `.ks-explainer p {
        margin: 0;
      }`,
    );

    // Setting: List
    this._addRule(
      // This compensates the floating tools below the list.
      `.ks-list-container {
        margin-bottom: 4px;
      }`,
    );
    this._addRule(
      `.ks-list.ks-items-list {
        user-select: none;
      }`,
    );
    this._addRule(
      `.ks-list ~ .ks-list-tools {
        border-top: 1px dotted grey;
        margin-left: 0px;
        margin-top: 2px;
      }`,
    );
    this._addRule(
      `.ks-list ~ .ks-list-tools .ks-icon-button {
        display: inline-block;
      }`,
    );
    this._addRule(
      `.ks-max-button {
        padding-right: 5px;
        padding-top: 2px;
      }`,
    );
    // The stock buttons should layout similarly to ks-label.
    this._addRule(
      `.ks-stock-button {
        display: inline-block;
      }`,
    );
    // blackcoin buy/sell threshold buttons
    this._addRule(
      `.ks-buy-button {
        display: inline-block;
        padding-right: 10px;
        min-width: 86px;
      }`,
    );
    this._addRule(
      `.ks-sell-button {
        display: inline-block;
        padding-right: 10px;
        min-width: 86px;
      }`,
    );

    // Style settings that act as UI delimiters.
    this._addRule(
      `.ks-delimiter {
        clear: left;
        margin-bottom: 10px;
      }`,
    );

    // Dialogs
    this._addRule(
      `.dialog.ks-dialog {
        display: flex;
        flex-direction: column;
        height: fit-content !important;
        box-shadow: none;
      }`,
    );
    this._addRule(
      `.dialog.ks-dialog .close {
        position: absolute;
        top: 10px;
        right: 15px;
      }`,
    );

    // Rules needed to enable stock warning.
    this._addRule(`
      .ks-ui #toggle-list-resources .stockWarn *,
      .ks-ui #toggle-reset-list-resources .stockWarn * {
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
