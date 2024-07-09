import { PayloadBuildings } from "@kitten-science/kitten-analysts/KittenAnalysts.js";
import { EngineState } from "@kitten-science/kitten-scientists/Engine.js";
import { Game } from "@kitten-science/kitten-scientists/types/game.js";
import { cdebug } from "../tools/Log.js";

export default (_game: Game, state: EngineState, snapshots: { buildings: PayloadBuildings }) => {
  cdebug(
    "Solar Revolution is currently at value:",
    snapshots.buildings.find(b => b.name === "solarRevolution")?.value,
  );
  return state;
};
