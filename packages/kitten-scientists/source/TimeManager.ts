import { isNil, mustExist } from "@oliversalzburg/js-utils/data/nil.js";
import { FrameContext } from "./Engine.js";
import { KittenScientists } from "./KittenScientists.js";
import { TabManager } from "./TabManager.js";
import { WorkshopManager } from "./WorkshopManager.js";
import { BulkPurchaseHelper } from "./helper/BulkPurchaseHelper.js";
import { TimeItem, TimeSettings, TimeSettingsItem } from "./settings/TimeSettings.js";
import { cwarn } from "./tools/Log.js";
import {
  BuildButton,
  ButtonModernController,
  ButtonModernModel,
  ChronoForgeUpgrade,
  ChronoForgeUpgradeInfo,
  FixCryochamberBtnController,
  TimeItemVariant,
  TimeTab,
  VoidSpaceUpgrade,
  VoidSpaceUpgradeInfo,
} from "./types/index.js";

export class TimeManager {
  private readonly _host: KittenScientists;
  readonly settings: TimeSettings;
  readonly manager: TabManager<TimeTab>;
  private readonly _bulkManager: BulkPurchaseHelper;
  private readonly _workshopManager: WorkshopManager;

  constructor(
    host: KittenScientists,
    workshopManager: WorkshopManager,
    settings = new TimeSettings(),
  ) {
    this._host = host;
    this.settings = settings;
    this.manager = new TabManager(this._host, "Time");
    this._bulkManager = new BulkPurchaseHelper(this._host, workshopManager);
    this._workshopManager = workshopManager;
  }

  tick(context: FrameContext) {
    if (!this.settings.enabled) {
      return;
    }

    // Render the tab to make sure that the buttons actually exist in the DOM.
    // TODO: Is this really required?
    this.manager.render();

    this.autoBuild(context);

    if (this.settings.fixCryochambers.enabled) {
      this.fixCryochambers();
    }
  }

  /**
   * Try to build as many of the passed buildings as possible.
   * Usually, this is called at each iteration of the automation engine to
   * handle the building of items on the Time tab.
   *
   * @param builds The buildings to build.
   */
  autoBuild(
    context: FrameContext,
    builds: Partial<Record<TimeItem, TimeSettingsItem>> = this.settings.buildings,
  ) {
    const bulkManager = this._bulkManager;
    const sectionTrigger = this.settings.trigger;

    // Get the current metadata for all the referenced buildings.
    const metaData: Partial<Record<TimeItem, ChronoForgeUpgradeInfo | VoidSpaceUpgradeInfo>> = {};
    for (const build of Object.values(builds)) {
      const buildMeta = this.getBuild(build.building, build.variant);
      metaData[build.building] = mustExist(buildMeta);

      const buildButton = this.getBuildButton(build.building, build.variant);
      if (isNil(buildButton)) {
        // Not available in this build of KG.
        continue;
      }
      const model = buildButton.model;
      const panel =
        build.variant === TimeItemVariant.Chronoforge
          ? this.manager.tab.cfPanel
          : this.manager.tab.vsPanel;

      const buildingMetaData = mustExist(metaData[build.building]);
      buildingMetaData.tHidden = !model?.visible || !model.enabled || !panel.visible;
    }

    // Let the bulkmanager determine the builds we can make.
    const buildList = bulkManager.bulk(builds, metaData, sectionTrigger, "Time");

    for (const build of buildList) {
      if (build.count > 0) {
        this.build(
          build.id as ChronoForgeUpgrade | VoidSpaceUpgrade,
          build.variant as TimeItemVariant,
          build.count,
        );
        context.requestGameUiRefresh = true;
      }
    }
  }

  build(
    name: ChronoForgeUpgrade | VoidSpaceUpgrade,
    variant: TimeItemVariant,
    amount: number,
  ): void {
    const build = mustExist(this.getBuild(name, variant));
    const button = this.getBuildButton(name, variant);

    if (!button || !button.model?.enabled) {
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
      this._host.engine.iactivity(
        "act.builds",
        [label, this._host.renderAbsolute(amount)],
        "ks-build",
      );
    }
  }

  getBuild(
    name: ChronoForgeUpgrade | VoidSpaceUpgrade,
    variant: TimeItemVariant,
  ): ChronoForgeUpgradeInfo | VoidSpaceUpgradeInfo {
    if (variant === TimeItemVariant.Chronoforge) {
      return this._host.game.time.getCFU(name as ChronoForgeUpgrade);
    }
    return this._host.game.time.getVSU(name as VoidSpaceUpgrade);
  }

  getBuildButton(
    name: ChronoForgeUpgrade | VoidSpaceUpgrade,
    variant: TimeItemVariant,
  ): BuildButton<string, ButtonModernModel, ButtonModernController> | null {
    let buttons: Array<BuildButton>;
    if (variant === TimeItemVariant.Chronoforge) {
      buttons = this.manager.tab.children[2].children[0].children;
    } else {
      buttons = this.manager.tab.children[3].children[0].children;
    }

    const build = this.getBuild(name, variant);
    if (isNil(build)) {
      throw new Error(`Unable to retrieve build information for '${name}'`);
    }

    return (buttons.find(button => button.model?.name.startsWith(build.label)) ??
      null) as BuildButton<string, ButtonModernModel, ButtonModernController> | null;
  }

  fixCryochambers() {
    if (this._host.game.time.getVSU("usedCryochambers").val < 1) {
      return;
    }

    const prices = mustExist(this._host.game.time.getVSU("usedCryochambers").fixPrices);
    for (const price of prices) {
      const available = this._workshopManager.getValueAvailable(price.name);
      if (available < price.val) {
        return;
      }
    }

    const btn = this.manager.tab.vsPanel.children[0].children[0];

    let fixed = 0;
    let fixHappened;
    do {
      fixHappened = false;

      (btn.controller as FixCryochamberBtnController).buyItem(
        btn.model as ButtonModernModel,
        new MouseEvent("click"),
        // This callback is invoked at the end of the `buyItem` call.
        // Thus, the callback should be invoked before this loop ends.
        (didHappen: boolean) => {
          fixHappened = didHappen;
          fixed += didHappen ? 1 : 0;
        },
      );
    } while (fixHappened);

    if (0 < fixed) {
      this._host.engine.iactivity("act.fix.cry", [this._host.renderAbsolute(fixed)], "ks-fixCry");
      this._host.engine.storeForSummary("fix.cry", fixed);
    }
  }
}
