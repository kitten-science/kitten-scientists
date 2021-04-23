import { TabManager } from "./TabManager";
import { mustExist } from "./tools/Maybe";
import { UserScript } from "./UserScript";

export class ExplorationManager {
  private readonly _host: UserScript;
  private readonly _manager: TabManager;

  private _currentCheapestNode: string | null = null;
  private _currentCheapestNodeValue: number | null = null;
  private _cheapestNodeX: number | null = null;
  private _cheapestNodeY: number | null = null;

  get cheapestNodeX(): number | null {
    return this.cheapestNodeX;
  }
  get cheapestNodeY(): number | null {
    return this.cheapestNodeY;
  }

  constructor(host: UserScript) {
    this._host = host;
    this._manager = new TabManager(host, "Village");
  }

  explore(x: number, y: number): void {
    this._host.gamePage.village.map.expeditionNode = { x, y };
    this._host.gamePage.village.map.explore(x, y);
  }

  getCheapestNode() {
    const tileArray = this._host.gamePage.village.map.villageData;
    let tileKey = "";

    this._currentCheapestNode = null;

    for (let tileIndex in tileArray) {
      tileKey = tileIndex;

      // Discards locked nodes
      if (tileIndex.unlocked == false) {
        break;
      }

      // Discards junk nodes
      if (tileKey.includes("-")) {
        break;
      }

      // Acquire node coordinates
      const regex = /(\d).(\d*)/g;
      const keyMatch = regex.exec(tileKey);
      const xCoord = parseInt(mustExist(keyMatch)[1]);
      const yCoord = parseInt(mustExist(keyMatch)[2]);

      if (this._currentCheapestNode == null) {
        this._currentCheapestNodeValue = this.getNodeValue(xCoord, yCoord);
        this._currentCheapestNode = tileIndex;
        this._cheapestNodeX = xCoord;
        this._cheapestNodeY = yCoord;
      }

      if (
        this._currentCheapestNode != null &&
        this.getNodeValue(xCoord, yCoord) < mustExist(this._currentCheapestNodeValue)
      ) {
        this._currentCheapestNodeValue = this.getNodeValue(xCoord, yCoord);
        this._currentCheapestNode = tileIndex;
        this._cheapestNodeX = xCoord;
        this._cheapestNodeY = yCoord;
      }
    }
  }

  getNodeValue(x: number, y: number): number {
    const nodePrice = this._host.gamePage.village.map.toLevel(x, y);
    const exploreCost = this._host.gamePage.village.map.getExplorationPrice(x, y);

    const tileValue = nodePrice / exploreCost;

    return tileValue;
  }
}
