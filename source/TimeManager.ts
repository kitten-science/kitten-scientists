import { mustExist } from "@oliversalzburg/js-utils/data/nil.js";
import type { FrameContext } from "./Engine.js";
import { BulkPurchaseHelper } from "./helper/BulkPurchaseHelper.js";
import type { KittenScientists } from "./KittenScientists.js";
import { type TimeItem, TimeSettings, type TimeSettingsItem } from "./settings/TimeSettings.js";
import { cl } from "./tools/Log.js";
import { type ChronoForgeUpgrade, TimeItemVariant, type VoidSpaceUpgrade } from "./types/index.js";
import type {
  ChronoforgeBtnController,
  UnsafeChronoForgeUpgrade,
  UnsafeVoidSpaceUpgrade,
  VoidSpaceBtnController,
} from "./types/time.js";
import type { WorkshopManager } from "./WorkshopManager.js";

export class TimeManager {
  private readonly _host: KittenScientists;
  readonly settings: TimeSettings;
  private readonly _bulkManager: BulkPurchaseHelper;
  private readonly _workshopManager: WorkshopManager;

  constructor(
    host: KittenScientists,
    workshopManager: WorkshopManager,
    settings = new TimeSettings(),
  ) {
    this._host = host;
    this.settings = settings;
    this._bulkManager = new BulkPurchaseHelper(this._host, workshopManager);
    this._workshopManager = workshopManager;
  }

  tick(context: FrameContext) {
    if (!this.settings.enabled) {
      return;
    }

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
    const metaData: Partial<
      Record<TimeItem, Required<UnsafeChronoForgeUpgrade | UnsafeVoidSpaceUpgrade>>
    > = {};
    for (const build of Object.values(builds)) {
      const buildMeta =
        build.variant === TimeItemVariant.Chronoforge
          ? this._host.game.time.getCFU(build.building as ChronoForgeUpgrade)
          : this._host.game.time.getVSU(build.building as VoidSpaceUpgrade);
      metaData[build.building] = mustExist(buildMeta);

      const buildButton =
        build.variant === TimeItemVariant.Chronoforge
          ? this._host.game.time.queue.getQueueElementControllerAndModel({
              name: build.building,
              type: "chronoforge",
            })
          : this._host.game.time.queue.getQueueElementControllerAndModel({
              name: build.building,
              type: "voidSpace",
            });

      const model = buildButton.model;
      const panel =
        build.variant === TimeItemVariant.Chronoforge
          ? this._host.game.timeTab.cfPanel
          : this._host.game.timeTab.vsPanel;

      const buildingMetaData = mustExist(metaData[build.building]);
      buildingMetaData.tHidden = !model?.visible || !model.enabled || !panel.visible;
    }

    // Let the bulkmanager determine the builds we can make.
    const buildList = bulkManager.bulk(builds, metaData, sectionTrigger);

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
    let amountConstructed = 0;
    let label: string;
    if (variant === TimeItemVariant.Chronoforge) {
      const itemMetaRaw = game.getUnlockByName(name, "chronoforge");
      const controller = new classes.ui.time.ChronoforgeBtnController(
        this._host.game,
      ) as ChronoforgeBtnController;
      const model = controller.fetchModel({ controller, id: itemMetaRaw.name });
      amountConstructed = this._bulkManager.construct(model, controller, amount);
      label = itemMetaRaw.label;
    } else {
      const itemMetaRaw = game.getUnlockByName(name, "voidSpace");
      const controller = new classes.ui.time.VoidSpaceBtnController(
        this._host.game,
      ) as VoidSpaceBtnController;
      const model = controller.fetchModel({ controller, id: itemMetaRaw.name });
      amountConstructed = this._bulkManager.construct(model, controller, amount);
      label = itemMetaRaw.label;
    }

    if (amount !== amountConstructed) {
      console.warn(
        ...cl(`${label} Amount ordered: ${amount} Amount Constructed: ${amountConstructed}`),
      );
      // Bail out to not flood the log with garbage.
      if (amountConstructed === 0) {
        return;
      }
    }
    this._host.engine.storeForSummary(label, amountConstructed, "build");

    if (amountConstructed === 1) {
      this._host.engine.iactivity("act.build", [label], "ks-build");
    } else {
      this._host.engine.iactivity(
        "act.builds",
        [label, this._host.renderAbsolute(amountConstructed)],
        "ks-build",
      );
    }
  }

  getBuild(name: ChronoForgeUpgrade | VoidSpaceUpgrade, variant: TimeItemVariant) {
    if (variant === TimeItemVariant.Chronoforge) {
      return this._host.game.time.getCFU(name as ChronoForgeUpgrade);
    }
    return this._host.game.time.getVSU(name as VoidSpaceUpgrade);
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

    const controller = new classes.ui.time.FixCryochamberBtnController(this._host.game);
    const model = controller.fetchModel({});

    let fixed = 0;
    let fixHappened: boolean;
    do {
      fixHappened = false;
      const buyResult = controller.buyItem(model);
      fixHappened = buyResult.itemBought;
      fixed += fixHappened ? 1 : 0;
    } while (fixHappened);

    if (0 < fixed) {
      this._host.engine.iactivity("act.fix.cry", [this._host.renderAbsolute(fixed)], "ks-fixCry");
      this._host.engine.storeForSummary("fix.cry", fixed);
    }
  }
}
