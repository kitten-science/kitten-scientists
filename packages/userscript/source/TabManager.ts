import { isNil } from "./tools/Maybe";
import { GameTab, TabId } from "./types";
import { UserScript } from "./UserScript";

export class TabManager {
  private readonly _host: UserScript;
  tab: GameTab;

  constructor(host: UserScript, name: TabId) {
    this._host = host;

    const tab = this._host.gamePage.tabs.find(subject => subject.tabId === name);
    if (isNil(tab)) {
      throw new Error(`Unable to find tab ${name}`);
    }

    this.tab = tab;
    this.render();
  }

  render(): this {
    if ( this._host.gamePage.ui.activeTabId !== this.tab.tabId) {
      this.tab.render();
    }

    return this;
  }
}
