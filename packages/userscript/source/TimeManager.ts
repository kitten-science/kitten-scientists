import { TickContext } from "./Engine";
import { BulkPurchaseHelper } from "./helper/BulkPurchaseHelper";
import { TimeItem, TimeSettings, TimeSettingsItem } from "./settings/TimeSettings";
import { TabManager } from "./TabManager";
import { cwarn } from "./tools/Log";
import { mustExist } from "./tools/Maybe";
import {
  BuildButton,
  ButtonModernController,
  ButtonModernModel,
  ChronoForgeUpgradeInfo,
  ChronoForgeUpgrades,
  FixCryochamberBtnController,
  TimeItemVariant,
  TimeTab,
  VoidSpaceUpgradeInfo,
  VoidSpaceUpgrades,
} from "./types";
import { UserScript } from "./UserScript";
import { WorkshopManager } from "./WorkshopManager";

export class TimeManager {
  private readonly _host: UserScript;
  readonly settings: TimeSettings;
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

    if (this.settings.fixCryochambers.enabled) {
      this.fixCryochambers();
    }
    if (this.settings.turnOnChronoFurnace.enabled) {
      this.turnOnChronoFurnace();
    }
  }

  /**
   * Try to build as many of the passed buildings as possible.
   * Usually, this is called at each iteration of the automation engine to
   * handle the building of items on the Time tab.
   *
   * @param builds The buildings to build.
   */
  autoBuild(builds: Partial<Record<TimeItem, TimeSettingsItem>> = this.settings.buildings) {
    const bulkManager = this._bulkManager;
    const trigger = this.settings.trigger;

    // Render the tab to make sure that the buttons actually exist in the DOM.
    // TODO: Is this really required?
    this.manager.render();

    // Get the current metadata for all the referenced buildings.
    const metaData: Partial<Record<TimeItem, ChronoForgeUpgradeInfo | VoidSpaceUpgradeInfo>> = {};
    for (const build of Object.values(builds)) {
      metaData[build.building] = mustExist(this.getBuild(build.building, build.variant));

      const model = mustExist(this.getBuildButton(build.building, build.variant)).model;
      const panel =
        build.variant === TimeItemVariant.Chronoforge
          ? this.manager.tab.cfPanel
          : this.manager.tab.vsPanel;

      const buildingMetaData = mustExist(metaData[build.building]);
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
  ): BuildButton<string, ButtonModernModel, ButtonModernController> | null {
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
        return button as BuildButton<string, ButtonModernModel, ButtonModernController>;
      }
    }

    return null;
  }

  fixCryochambers() {
    // Fix used cryochambers
    // If the option is enabled and we have used cryochambers...
    if (0 < this._host.gamePage.time.getVSU("usedCryochambers").val) {
      let fixed = 0;
      const btn = this.manager.tab.vsPanel.children[0].children[0]; //check?
      // doFixCryochamber will check resources
      while (
        (btn.controller as FixCryochamberBtnController).doFixCryochamber(
          btn.model as ButtonModernModel
        )
      ) {
        ++fixed;
      }
      if (0 < fixed) {
        this._host.engine.iactivity("act.fix.cry", [fixed], "ks-fixCry");
        this._host.engine.storeForSummary("fix.cry", fixed);
      }
    }
  }

  turnOnChronoFurnace() {
    const chronoFurnace = this._host.gamePage.time.getCFU("blastFurnace");
    if (!mustExist(chronoFurnace.isAutomationEnabled)) {
      const button = mustExist(this.getBuildButton("blastFurnace", TimeItemVariant.Chronoforge));
      button.controller.handleToggleAutomationLinkClick(button.model);
    }
  }
}
