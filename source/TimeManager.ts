import { isNil, mustExist } from "@oliversalzburg/js-utils/data/nil.js";
import type { FrameContext } from "./Engine.js";
import type { KittenScientists } from "./KittenScientists.js";
import { TabManager } from "./TabManager.js";
import type { WorkshopManager } from "./WorkshopManager.js";
import { BulkPurchaseHelper } from "./helper/BulkPurchaseHelper.js";
import { type TimeItem, TimeSettings, type TimeSettingsItem } from "./settings/TimeSettings.js";
import { cwarn } from "./tools/Log.js";
import {
  type BuildButton,
  type ButtonModernController,
  type ButtonModernModel,
  type BuyResultOperation,
  type ChronoForgeUpgrade,
  type ChronoForgeUpgradeInfo,
  type FixCryochamberBtnController,
  TimeItemVariant,
  type TimeTab,
  type VoidSpaceUpgrade,
  type VoidSpaceUpgradeInfo,
} from "./types/index.js";
import { BuyButton } from "./ui/components/buttons-text/BuyButton.js";

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
    let amountCalculated = amount;
    const build = mustExist(this.getBuild(name, variant));
    const button = this.getBuildButton(name, variant);

    if (!button || !button.model?.enabled) {
      return;
    }
    const amountTemp = amountCalculated;
    const label = build.label;
    amountCalculated = this._bulkManager.construct(button.model, button, amountCalculated);
    if (amountCalculated !== amountTemp) {
      cwarn(`${label} Amount ordered: ${amountTemp} Amount Constructed: ${amountCalculated}`);
    }
    this._host.engine.storeForSummary(label, amountCalculated, "build");

    if (amountCalculated === 1) {
      this._host.engine.iactivity("act.build", [label], "ks-build");
    } else {
      this._host.engine.iactivity(
        "act.builds",
        [label, this._host.renderAbsolute(amountCalculated)],
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

    return (buttons.find(button => button.id === name) ?? null) as BuildButton<
      string,
      ButtonModernModel,
      ButtonModernController
    > | null;
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
    let fixHappened: boolean;
    do {
      fixHappened = false;

      const buyResult = (btn.controller as FixCryochamberBtnController).buyItem(
        btn.model as ButtonModernModel,
        new MouseEvent("click"),
      );

      if (buyResult.def !== undefined) {
        // This callback is invoked at the end of the `buyItem` call.
        // Thus, the callback should be invoked before this loop ends.
        buyResult.def.then((didHappen: BuyResultOperation) => {
          fixHappened = didHappen.itemBought;
          fixed += didHappen ? 1 : 0;
        })
      } else {
        fixHappened = buyResult.itemBought;
      }
    } while (fixHappened);

    if (0 < fixed) {
      this._host.engine.iactivity("act.fix.cry", [this._host.renderAbsolute(fixed)], "ks-fixCry");
      this._host.engine.storeForSummary("fix.cry", fixed);
    }
  }
}
