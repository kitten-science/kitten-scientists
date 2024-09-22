import { EngineState } from "@kitten-science/kitten-scientists/Engine.js";
import { Game } from "@kitten-science/kitten-scientists/types/game.js";
import {
  Building,
  BuildingEffects,
  Resource,
} from "@kitten-science/kitten-scientists/types/index.js";
import { coalesceArray, mustExist } from "@oliversalzburg/js-utils/data/nil.js";
import { TreeNode } from "@oliversalzburg/js-utils/data/tree.js";
import { GraphJudge } from "../GraphJudge.js";
import { Operator, SnapshotCollection, Solution } from "../GraphSolver.js";
import { priceArrayToRecord } from "../tools/Prices.js";

export const effectToRequirement = (effect: keyof BuildingEffects) => {
  switch (effect) {
    case "alicornPerTickCon":
      return "alicorn";
    case "catnipPerTickCon":
      return "catnip";
    case "coalPerTickCon":
      return "coal";
    case "energyConsumption":
      return "energy";
    case "fursDemandRatio":
      return "furs";
    case "goldPerTickCon":
      return "gold";
    case "ironPerTickCon":
      return "iron";
    case "ivoryPerTickCon":
      return "ivory";
    case "magnetoBoostRatio":
    case "magnetoRatio":
      return "magneto";
    case "manpowerPerTickCon":
      return "manpower";
    case "oilPerTickCon":
      return "oil";
    case "reactorThoriumPerTick":
      return "thorium";
    case "spicePerTickCon":
      return "spice";
    case "titaniumPerTickCon":
      return "titanium";
    case "woodPerTickCon":
      return "wood";

    default:
      return undefined;
  }
};
export const effectToSolution = (effect: keyof BuildingEffects) => {
  switch (effect) {
    case "alicornChance":
    case "alicornPerTick":
      return "alicorn";
    case "beaconRelicsPerDay":
      return "relic";
    case "biofuelRatio":
      return "oil";
    case "blsCorruptionRatio":
    case "blsLimit":
      return "sorrow";
    case "broadcastTowerRatio":
      return "culture";
    case "cadBlueprintCraftRatio":
      return "blueprint";
    case "catnipDemandRatio":
    case "catnipMax":
    case "catnipPerTickBase":
    case "catnipRatio":
      return "catnip";
    case "coalPerTickAutoprod":
    case "coalPerTickBase":
    case "coalRatioGlobal":
      return "coal";
    case "corruptionBoostRatio":
    case "corruptionRatio":
      return "necrocorn";
    case "cultureMax":
    case "cultureMaxRatio":
    case "cultureMaxRatioBonus":
    case "culturePerTickBase":
      return "culture";
    case "energyProduction":
      return "energy";
    case "faithMax":
    case "faithPerTickBase":
    case "faithRatioReligion":
      return "faith";
    case "fursPerTickProd":
      return "furs";
    case "gflopsPerTickBase":
      return "gflops";
    case "goldMax":
    case "goldMaxRatio":
    case "goldPerTickAutoprod":
      return "gold";
    case "happiness":
      return "happiness";
    case "hunterRatio":
      return "hunter";
    case "hutPriceRatio":
      return "hut";
    case "ironMax":
    case "ironPerTickAutoprod":
      return "iron";
    case "ivoryMeteorChance":
    case "ivoryMeteorRatio":
    case "ivoryPerTickProd":
      return "ivory";
    case "manpowerMax":
      return "manpower";
    case "manuscriptPerTickProd":
      return "manuscript";
    case "maxKittens":
      return "kittens";
    case "mineralsMax":
    case "mineralsPerTickProd":
    case "mineralsRatio":
      return "minerals";
    case "necrocornPerDay":
      return "necrocorn";
    case "oilMax":
    case "oilPerTickBase":
    case "oilPerTickProd":
    case "oilWellRatio":
      return "oil";
    case "reactorEnergyRatio":
      return "reactor";
    case "refineRatio":
      return "catnip";
    case "scienceMax":
    case "scienceRatio":
      return "science";
    case "smelterRatio":
      return "smelter";
    case "solarFarmRatio":
    case "solarFarmSeasonRatio":
      return "solarfarm";
    case "spaceScienceRatio":
      return "science";
    case "starchartGlobalRatio":
      return "starchart";
    case "steelPerTickProd":
      return "steel";
    case "temporalFluxProductionChronosphere":
    case "temporalParadoxDayBonus":
      return "temporalFlux";
    case "tMythrilCraftRatio":
    case "tMythrilPerTick":
      return "tMythril";
    case "temporalFluxProduction":
      return "temporalFlux";
    case "thoriumPerTick":
      return "thorium";
    case "titaniumMax":
    case "titaniumPerTickAutoprod":
      return "titanium";
    case "unicornsGlobalRatio":
    case "unicornsPerTickBase":
      return "unicorns";
    case "unobtainiumPerTickSpace":
      return "unobtainium";
    case "uplinkDCRatio":
    case "uplinkLabRatio":
      return "science";
    case "uraniumMax":
    case "uraniumPerTick":
    case "uraniumPerTickAutoprod":
    case "uraniumPerTickBase":
    case "uraniumRatio":
      return "uranium";
    case "woodJobRatio":
    case "woodMax":
    case "woodRatio":
      return "wood";
    default:
      return undefined;
  }
};

export const BuildBonfireFactory = function* (items: Iterable<Building>) {
  for (const item of items) {
    yield class extends TreeNode<Operator> implements Operator {
      name = `build ${item}`;

      meta = mustExist(
        game.bld.meta[0].meta.find(meta => meta.name === item),
        item,
      );
      requires = coalesceArray([
        ...(this.meta.prices ?? this.meta.stages?.[0]?.prices ?? []).map(price => price.name),
        ...Object.keys(this.meta.effects ?? this.meta.stages?.[0]?.effects ?? {}).map(effect =>
          effectToRequirement(effect as keyof BuildingEffects),
        ),
        "solarRevolution" as const,
      ]);
      solves = coalesceArray([
        ...Object.keys(this.meta.effects ?? this.meta.stages?.[0]?.effects ?? {}).map(effect =>
          effectToSolution(effect as keyof BuildingEffects),
        ),
        item,
        item === "chronosphere" ? ("void" as const) : undefined,
      ]);

      ancestors = new Set<Operator>();

      scoreSolution(
        _solution: Solution,
        judge: GraphJudge<Operator>,
        game: Game,
        state: EngineState,
        snapshots: SnapshotCollection,
      ): number {
        const prices = priceArrayToRecord(mustExist(this.meta.prices));
        return this.requires
          .map(
            requirement =>
              judge.judgeChildren(this, requirement, game, state, snapshots).sort()[0] *
              (requirement in prices ? mustExist(prices[requirement as Resource]).val : 1),
          )
          .reduce((score, childScore) => score + childScore, 0);
      }

      execute(_game: Game, state: EngineState, _snapshots: SnapshotCollection) {
        return state;
      }
    };
  }
};
