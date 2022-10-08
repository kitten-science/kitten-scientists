import { TickContext } from "./Engine";
import { BulkPurchaseHelper } from "./helper/BulkPurchaseHelper";
import { TimeItem, TimeSettings, TimeSettingsItem } from "./options/TimeSettings";
import { TabManager } from "./TabManager";
import { objectEntries } from "./tools/Entries";
import { cwarn } from "./tools/Log";
import { mustExist } from "./tools/Maybe";
import {
  BuildButton,
  ChronoForgeUpgradeInfo,
  ChronoForgeUpgrades,
  TimeItemVariant,
  TimeTab,
  VoidSpaceUpgradeInfo,
  VoidSpaceUpgrades,
} from "./types";
import { UserScript } from "./UserScript";
import { WorkshopManager } from "./WorkshopManager";

export class TimeManager {
  private readonly _host: UserScript;
  settings: TimeSettings;
  readonly manager: TabManager<TimeTab>;
  private readonly _bulkManager: BulkPurchaseHelper;

  constructor(host: UserScript, workshopManager: WorkshopManager, settings = new TimeSettings()) {
    this._host = host;
    this.settings = settings;
    this.manager = new TabManager(this._host, "Time");
    this._bulkManager = new BulkPurchaseHelper(this._host, workshopManager);
  }

  tick(context: TickContext) {
    if (!this.settings.enabled) {
      return;
    }

    this.autoBuild();
  }

  load(settings: TimeSettings) {
    this.settings.load(settings);
  }

  /**
   * Try to build as many of the passed buildings as possible.
   * Usually, this is called at each iteration of the automation engine to
   * handle the building of items on the Time tab.
   *
   * @param builds The buildings to build.
   */
  autoBuild(builds: Partial<Record<TimeItem, TimeSettingsItem>> = this.settings.items) {
    const bulkManager = this._bulkManager;
    const trigger = this.settings.trigger;

    // Render the tab to make sure that the buttons actually exist in the DOM.
    // TODO: Is this really required?
    this.manager.render();

    // Get the current metadata for all the referenced buildings.
    const metaData: Partial<Record<TimeItem, ChronoForgeUpgradeInfo | VoidSpaceUpgradeInfo>> = {};
    for (const [name, build] of objectEntries(builds)) {
      metaData[name] = mustExist(this.getBuild(name, build.variant));

      const model = mustExist(this.getBuildButton(name, build.variant)).model;
      const panel =
        build.variant === TimeItemVariant.Chronoforge
          ? this.manager.tab.cfPanel
          : this.manager.tab.vsPanel;

      const buildingMetaData = mustExist(metaData[name]);
      buildingMetaData.tHidden = !model.visible || !model.enabled || !panel?.visible;
    }

    // Let the bulkmanager determine the builds we can make.
    const buildList = bulkManager.bulk(builds, metaData, trigger);

    let refreshRequired = false;
    for (const build of buildList) {
      if (build.count > 0) {
        this.build(
          build.id as ChronoForgeUpgrades | VoidSpaceUpgrades,
          build.variant as TimeItemVariant,
          build.count
        );
        refreshRequired = true;
      }
    }

    if (refreshRequired) {
      this._host.gamePage.ui.render();
    }
  }

  build(
    name: ChronoForgeUpgrades | VoidSpaceUpgrades,
    variant: TimeItemVariant,
    amount: number
  ): void {
    const build = mustExist(this.getBuild(name, variant));
    const button = this.getBuildButton(name, variant);

    if (!button || !button.model.enabled) {
      return;
    }
    const amountTemp = amount;
    const label = build.label;
    amount = this._bulkManager.construct(button.model, button, amount);
    if (amount !== amountTemp) {
      cwarn(`${label} Amount ordered: ${amountTemp} Amount Constructed: ${amount}`);
    }
    this._host.engine.storeForSummary(label, amount, "build");

    if (amount === 1) {
      this._host.engine.iactivity("act.build", [label], "ks-build");
    } else {
      this._host.engine.iactivity("act.builds", [label, amount], "ks-build");
    }
  }

  getBuild(
    name: ChronoForgeUpgrades | VoidSpaceUpgrades,
    variant: TimeItemVariant
  ): ChronoForgeUpgradeInfo | VoidSpaceUpgradeInfo | null {
    if (variant === TimeItemVariant.Chronoforge) {
      return this._host.gamePage.time.getCFU(name as ChronoForgeUpgrades) ?? null;
    } else {
      return this._host.gamePage.time.getVSU(name as VoidSpaceUpgrades) ?? null;
    }
  }

  getBuildButton(
    name: ChronoForgeUpgrades | VoidSpaceUpgrades,
    variant: TimeItemVariant
  ): BuildButton | null {
    let buttons: Array<BuildButton>;
    if (variant === TimeItemVariant.Chronoforge) {
      buttons = this.manager.tab.children[2].children[0].children;
    } else {
      buttons = this.manager.tab.children[3].children[0].children;
    }

    const build = this.getBuild(name, variant);
    if (build === null) {
      throw new Error(`Unable to retrieve build information for '${name}'`);
    }

    for (const button of buttons) {
      const haystack = button.model.name;
      if (haystack.indexOf(build.label) !== -1) {
        return button;
      }
    }

    return null;
  }
}
