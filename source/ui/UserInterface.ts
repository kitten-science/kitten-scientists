import { formatMilliseconds } from "@oliversalzburg/js-utils/format/milliseconds.js";
import { measure } from "@oliversalzburg/js-utils/measurement/performance.js";
import { Icons } from "../images/Icons.js";
import type { KittenScientists } from "../KittenScientists.js";
import { cl } from "../tools/Log.js";
import { UserScriptLoader } from "../UserScriptLoader.js";
import { BonfireSettingsUi } from "./BonfireSettingsUi.js";
import { UiComponent } from "./components/UiComponent.js";
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

export class UserInterface extends UiComponent {
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

  private _refreshTimeout: number | undefined;

  constructor(host: KittenScientists) {
    super({ host }, {});

    const engine = host.engine;
    this._engineUi = new EngineSettingsUi(this, engine.settings);
    this.stateManagementUi = new StateManagementUi(
      this,
      engine.settings.states,
      engine.settings.locale,
    );
    this._sections = [
      new BonfireSettingsUi(this, engine.bonfireManager.settings, engine.settings.locale),
      new VillageSettingsUi(this, engine.villageManager.settings, engine.settings.locale),
      new ScienceSettingsUi(this, engine.scienceManager.settings, engine.settings.locale),
      new WorkshopSettingsUi(this, engine.workshopManager.settings, engine.settings.locale),
      new ResourcesSettingsUi(this, engine.settings.resources, engine.settings.locale),
      new TradeSettingsUi(this, engine.tradeManager.settings, engine.settings.locale),
      new ReligionSettingsUi(this, engine.religionManager.settings, engine.settings.locale),
      new SpaceSettingsUi(this, engine.spaceManager.settings, engine.settings.locale),
      new TimeSettingsUi(this, engine.timeManager.settings, engine.settings.locale),
      new TimeControlSettingsUi(this, engine.timeControlManager.settings, engine.settings.locale),
      new LogFiltersSettingsUi(this, engine.settings.filters),
      this.stateManagementUi,
      new InternalsUi(this, engine.settings, engine.settings.locale),
    ];

    this.parent = this;
    this.element = $("<div/>").addClass(styles.ui);
    for (const section of [this._engineUi, ...this._sections]) {
      this.addChild(section);
    }

    const optionsListElement = $("<ul/>");
    optionsListElement.append(this._engineUi.element);
    for (const section of this._sections) {
      optionsListElement.append(section.element);
    }
    this.element.append(optionsListElement);

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
      section.element[0].addEventListener("panelHidden", () => {
        --panelsOpen;
        if (panelsOpen === 0) {
          sectionsVisible = false;
        }
        if (!sectionsVisible) {
          expando.setCollapsed();
        }
      });
      section.element[0].addEventListener("panelShown", () => {
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
        optionsPageContent.append(this.element);
        this.element.attr("style", "border-top:1px solid grey; padding:15px");
      }
    } else {
      right.prepend(this.element);
    }
    this.element = this.element;

    this._needsRefresh = false;
  }

  toString(): string {
    return `[${UserInterface.name}#${this.componentId}]`;
  }

  destroy() {
    if (this._refreshTimeout !== undefined) {
      UserScriptLoader.window.clearTimeout(this._refreshTimeout);
      this._refreshTimeout = undefined;
    }
    this.showActivity.remove();
    this.element.remove();
  }

  requestRefresh(withChildren = true, depth = 0, trace = false) {
    if (this._needsRefresh) {
      if (this._refreshTimeout === undefined) {
        console.error(...cl("User interface claims to have a refresh pending, but there isn't."));
      }
      return;
    }

    this._refreshTimeout = UserScriptLoader.window.setTimeout(() => {
      const [_, duration] = measure(() => this.refresh());
      console.info(...cl(`UI refresh took ${formatMilliseconds(duration)}.`));
      this._refreshTimeout = undefined;
    }, 0);

    super.requestRefresh(true, depth, false);
  }

  forceFullRefresh(): void {
    console.warn(...cl("Forcing refresh on all user interface components..."));
    this.requestRefresh();
    console.warn(...cl("Refresh on all user interface components enforced."));
  }
}
