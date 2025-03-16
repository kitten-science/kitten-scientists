import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import type { KittenScientists } from "./KittenScientists.js";
import type { Tab } from "./types/core.js";
import type { TabId } from "./types/index.js";

export class TabManager<TTab extends Tab = Tab> {
  private readonly _host: KittenScientists;
  tab: TTab;

  constructor(host: KittenScientists, name: TabId) {
    this._host = host;

    const tab = this._host.game.tabs.find(subject => subject.tabId === name) as TTab;
    if (isNil(tab)) {
      throw new Error(`Unable to find tab ${name}`);
    }

    this.tab = tab;
    this.render();
  }

  render(): this {
    if (this._host.game.ui.activeTabId !== this.tab.tabId) {
      this.tab.render();
    }

    return this;
  }
}
