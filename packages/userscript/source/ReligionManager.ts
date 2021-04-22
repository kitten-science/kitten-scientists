import { TabManager } from "./TabManager";
import { UserScript } from "./UserScript";

export class ReligionManager {
  private readonly _host: UserScript;
  private readonly _manager: TabManager;

  constructor(host: UserScript) {
    this._host = host;
    this._manager = new TabManager(host, "Religion");
  }
}
