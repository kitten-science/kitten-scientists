import { Maybe } from "./tools/Maybe";
import { GameTab } from "./types";
import { UserScript } from "./UserScript";

export class TabManager {
  private readonly _host: UserScript;
  private _tab: Maybe<GameTab>;

  constructor(host: UserScript, name: string) {
    this._host = host;
    this.setTab(name);
  }

  render(): this {
    if (this._tab && this._host.gamePage.ui.activeTabId !== this._tab.tabId) {
      this._tab.render();
    }

    return this;
  }

  setTab(name: string): void {
    for (const tab of this._host.gamePage.tabs) {
      if (tab.tabId === name) {
        this._tab = tab;
        break;
      }
    }

    this._tab ? this.render() : this._host.warning("unable to find tab " + name);
  }
}
