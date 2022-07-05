import { BulkManager } from "./BulkManager";
import { BonfireItem, BonfireSettingsItem } from "./options/BonfireSettings";
import { TabManager } from "./TabManager";
import { objectEntries } from "./tools/Entries";
import { isNil, mustExist } from "./tools/Maybe";
import { BuildButton, Building, BuildingExt, BuildingMeta, GameTab } from "./types";
import { UserScript } from "./UserScript";
import { WorkshopManager } from "./WorkshopManager";

export type BonfireTab = GameTab;

export class BonfireManager {
  private readonly _host: UserScript;
  readonly manager: TabManager<BonfireTab>;
  private readonly _bulkManager: BulkManager;
  private readonly _workshopManager: WorkshopManager;

  constructor(host: UserScript) {
    this._host = host;
    this.manager = new TabManager<BonfireTab>(this._host, "Bonfire");
    this._bulkManager = new BulkManager(this._host);
    this._workshopManager = new WorkshopManager(this._host);
  }

  /**
   * Try to build as many of the passed buildings as possible.
   * Usually, this is called at each iteration of the automation engine to
   * handle the building of items on the Bonfire tab.
   *
   * @param builds The buildings to build.
   */
  autoBuild(
    builds: Partial<Record<BonfireItem, BonfireSettingsItem>> = this._host.options.auto.build.items
  ) {
    // TODO: Refactor. See SpaceManager.autoBuild
    const bulkManager = this._bulkManager;
    const trigger = this._host.options.auto.build.trigger;

    // Render the tab to make sure that the buttons actually exist in the DOM.
    // TODO: Is this really required?
    this.manager.render();

    // Get the current metadata for all the referenced buildings.
    const metaData: Partial<Record<BonfireItem, BuildingMeta>> = {};
    for (const [name, build] of objectEntries(builds)) {
      metaData[name] = this.getBuild((build.name ?? name) as Building).meta;
    }

    // Let the bulkmanager determine the builds we can make.
    const buildList = bulkManager.bulk(builds, metaData, trigger, "bonfire");

    let refreshRequired = false;
    // Build all entries in the build list, where we can build any items.
    for (const build of buildList) {
      if (build.count > 0) {
        this.build((build.name || build.id) as Building, build.stage, build.count);
        refreshRequired = true;
      }
    }

    if (refreshRequired) {
      this._host.gamePage.ui.render();
    }
  }

  autoUpgrade() {
    // Get current count of pastures.
    const pastures =
      this._host.gamePage.bld.getBuildingExt("pasture").meta.stage === 0
        ? this._host.gamePage.bld.getBuildingExt("pasture").meta.val
        : 0;
    // Get current count of aqueducts.
    const aqueducts =
      this._host.gamePage.bld.getBuildingExt("aqueduct").meta.stage === 0
        ? this._host.gamePage.bld.getBuildingExt("aqueduct").meta.val
        : 0;

    const pastureMeta = this._host.gamePage.bld.getBuildingExt("pasture").meta;
    // If pastures haven't been upgraded to solar farms yet...
    if (pastureMeta.stage === 0) {
      if (mustExist(pastureMeta.stages)[1].stageUnlocked) {
        // If we would reduce our pastures to 0, by upgrading them, would we lose any catnip?
        if (this._workshopManager.getPotentialCatnip(true, 0, aqueducts) > 0) {
          const prices = mustExist(pastureMeta.stages)[1].prices;
          if (this._bulkManager.singleBuildPossible(pastureMeta, prices, 1)) {
            const button = mustExist(this.getBuildButton("pasture", 0));
            // We need to perform the process like this to avoid UI confirmations
            // for selling items.
            // Sell all pastures (to regain the resources).
            button.controller.sellInternal(button.model, 0);
            // Manually update the metadata, as we bypassed the full selling logic.
            pastureMeta.on = 0;
            pastureMeta.val = 0;
            pastureMeta.stage = 1;

            this._host.iactivity("upgrade.building.pasture", [], "ks-upgrade");

            // Upgrade the pasture.
            this._host.gamePage.ui.render();
            this.build("pasture", 1, 1);
            this._host.gamePage.ui.render();

            // TODO: Why do we return here and not just unlock more buildings?
            return;
          }
        }
      }
    }

    const aqueductMeta = this._host.gamePage.bld.getBuildingExt("aqueduct").meta;
    // If aqueducts haven't beeen upgraded to hydro plants yet...
    if (aqueductMeta.stage === 0) {
      if (mustExist(aqueductMeta.stages)[1].stageUnlocked) {
        // If we would reduce our aqueducts to 0, by upgrading them, would we lose any catnip?
        if (this._workshopManager.getPotentialCatnip(true, pastures, 0) > 0) {
          const prices = mustExist(aqueductMeta.stages)[1].prices;
          if (this._bulkManager.singleBuildPossible(aqueductMeta, prices, 1)) {
            const button = mustExist(this.getBuildButton("aqueduct", 0));
            button.controller.sellInternal(button.model, 0);
            aqueductMeta.on = 0;
            aqueductMeta.val = 0;
            aqueductMeta.stage = 1;

            // TODO: Why do we do this for the aqueduct and not for the pasture?
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            aqueductMeta.calculateEffects!(aqueductMeta, this._host.gamePage);

            this._host.iactivity("upgrade.building.aqueduct", [], "ks-upgrade");

            this._host.gamePage.ui.render();
            this.build("aqueduct", 1, 1);
            this._host.gamePage.ui.render();

            return;
          }
        }
      }
    }

    const libraryMeta = this._host.gamePage.bld.getBuildingExt("library").meta;
    if (libraryMeta.stage === 0) {
      if (mustExist(libraryMeta.stages)[1].stageUnlocked) {
        let energyConsumptionRate = this._host.gamePage.workshop.get("cryocomputing").researched
          ? 1
          : 2;
        if (this._host.gamePage.challenges.currentChallenge === "energy") {
          energyConsumptionRate *= 2;
        }

        // This indicates how valuable a data center is, compared to a single library.
        // We check for possible upgrades, that would make them more valuable.
        let libToDat = 3;
        if (this._host.gamePage.workshop.get("uplink").researched) {
          libToDat *=
            1 +
            this._host.gamePage.bld.get("biolab").val *
              this._host.gamePage.getEffect("uplinkDCRatio");
        }
        if (this._host.gamePage.workshop.get("machineLearning").researched) {
          libToDat *=
            1 +
            this._host.gamePage.bld.get("aiCore").on *
              this._host.gamePage.getEffect("dataCenterAIRatio");
        }

        // We now have the energy consumption of data centers and the value of data centers.
        // Assuming, we would upgrade to data centers and buy as many as we need to have value
        // equal to our current libraries, and that wouldn't cap our energy, upgrade them.
        if (
          this._host.gamePage.resPool.energyProd >=
          this._host.gamePage.resPool.energyCons +
            (energyConsumptionRate * libraryMeta.val) / libToDat
        ) {
          const prices = mustExist(libraryMeta.stages)[1].prices;
          if (this._bulkManager.singleBuildPossible(libraryMeta, prices, 1)) {
            const button = mustExist(this.getBuildButton("library", 0));
            button.controller.sellInternal(button.model, 0);
            libraryMeta.on = 0;
            libraryMeta.val = 0;
            libraryMeta.stage = 1;
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            libraryMeta.calculateEffects!(libraryMeta, this._host.gamePage);
            this._host.iactivity("upgrade.building.library", [], "ks-upgrade");
            this._host.gamePage.ui.render();
            this.build("library", 1, 1);
            this._host.gamePage.ui.render();
            return;
          }
        }
      }
    }

    const amphitheatreMeta = this._host.gamePage.bld.getBuildingExt("amphitheatre").meta;
    // If amphitheathres haven't been upgraded to broadcast towers yet...
    // This seems to be identical to the pasture upgrade.
    if (amphitheatreMeta.stage === 0) {
      if (mustExist(amphitheatreMeta.stages)[1].stageUnlocked) {
        // TODO: This is problematic. Upgrading from 50 amphitheatres to 1 broadcast tower sucks
        //       if you don't have enough resources to build several more.
        const prices = mustExist(amphitheatreMeta.stages)[1].prices;
        if (this._bulkManager.singleBuildPossible(amphitheatreMeta, prices, 1)) {
          const button = mustExist(this.getBuildButton("amphitheatre", 0));
          button.controller.sellInternal(button.model, 0);
          amphitheatreMeta.on = 0;
          amphitheatreMeta.val = 0;
          amphitheatreMeta.stage = 1;

          this._host.iactivity("upgrade.building.amphitheatre", [], "ks-upgrade");

          this._host.gamePage.ui.render();
          this.build("amphitheatre", 1, 1);
          this._host.gamePage.ui.render();

          return;
        }
      }
    }
  }

  build(name: Building, stage: number | undefined, amount: number): void {
    const build = this.getBuild(name);
    const button = this.getBuildButton(name, stage);

    if (!button || !button.model.enabled) {
      return;
    }
    const amountTemp = amount;
    const label = this._getBuildLabel(build.meta, stage);
    amount = this._bulkManager.construct(button.model, button, amount);
    if (amount !== amountTemp) {
      this._host.warning(`${label} Amount ordered: ${amountTemp} Amount Constructed: ${amount}`);
    }
    this._host.storeForSummary(label, amount, "build");

    if (amount === 1) {
      this._host.iactivity("act.build", [label], "ks-build");
    } else {
      this._host.iactivity("act.builds", [label, amount], "ks-build");
    }
  }

  private _getBuildLabel(meta: BuildingMeta, stage?: number): string {
    return meta.stages && !isNil(stage) ? meta.stages[stage].label : mustExist(meta.label);
  }

  getBuild(name: Building): BuildingExt {
    return this._host.gamePage.bld.getBuildingExt(name);
  }

  getBuildButton(name: Building, stage?: number): BuildButton | null {
    const buttons = this.manager.tab.children;
    const build = this.getBuild(name);
    const label = this._getBuildLabel(build.meta, stage);

    for (const button of buttons) {
      const haystack = button.model.name;
      if (haystack.indexOf(label) !== -1) {
        return button;
      }
    }

    return null;
  }
}
