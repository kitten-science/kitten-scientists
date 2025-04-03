import type { KittenScientists } from "../KittenScientists.js";
import { Icons } from "../images/Icons.js";
import { cl } from "../tools/Log.js";
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
import styles from "./UserInterface.module.css";
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
  stateManagementUi: StateManagementUi;

  constructor(host: KittenScientists) {
    super(host, {});

    const engine = host.engine;
    this._engineUi = new EngineSettingsUi(host, engine.settings);
    this.stateManagementUi = new StateManagementUi(
      host,
      engine.settings.states,
      engine.settings.locale,
    );
    this._sections = [
      new BonfireSettingsUi(host, engine.bonfireManager.settings, engine.settings.locale),
      new VillageSettingsUi(host, engine.villageManager.settings, engine.settings.locale),
      new ScienceSettingsUi(host, engine.scienceManager.settings, engine.settings.locale),
      new WorkshopSettingsUi(host, engine.workshopManager.settings, engine.settings.locale),
      new ResourcesSettingsUi(host, engine.settings.resources, engine.settings.locale),
      new TradeSettingsUi(host, engine.tradeManager.settings, engine.settings.locale),
      new ReligionSettingsUi(host, engine.religionManager.settings, engine.settings.locale),
      new SpaceSettingsUi(host, engine.spaceManager.settings, engine.settings.locale),
      new TimeSettingsUi(host, engine.timeManager.settings, engine.settings.locale),
      new TimeControlSettingsUi(host, engine.timeControlManager.settings, engine.settings.locale),
      new LogFiltersSettingsUi(host, engine.settings.filters),
      this.stateManagementUi,
      new InternalsUi(host, engine.settings, engine.settings.locale),
    ];

    //this._installCss();

    const ks = $("<div/>").addClass(styles.ui);

    const optionsListElement = $("<ul/>");
    optionsListElement.append(this._engineUi.element);
    for (const section of this._sections) {
      optionsListElement.append(section.element);
    }
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
      html: `<svg style="width: 18px; height: 18px;" viewBox="0 -960 960 960" fill="currentColor"><path d="${Icons.Summary}"/></svg>`,
      title: host.engine.i18n("summary.show"),
    }).addClass(styles.showActivity);

    this.showActivity.on("click", () => {
      host.engine.displayActivitySummary();
    });

    $("#clearLog").prepend(this.showActivity);

    // Add Kitten Scientists above the game log.
    if (engine.settings.ksColumn.enabled) {
      $("#rightColumn").after(
        `<div id="ksColumn" class="column"><span class="${styles.spacer}"></span></div>`,
      );
    } else {
      $("#ksColumn").remove();
    }
    const right = $(engine.settings.ksColumn.enabled ? "#ksColumn" : "#rightColumn");
    if (right.length === 0) {
      // Try to fall back to options page.
      const optionsPageContent = $("#optionsPage .full-screen-position .page .page-content");
      if (optionsPageContent.length === 0) {
        console.warn(...cl("Unable to find right column to inject UI into. Running headless."));
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
}
