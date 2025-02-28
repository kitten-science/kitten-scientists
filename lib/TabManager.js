import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
export class TabManager {
  _host;
  tab;
  constructor(host, name) {
    this._host = host;
    const tab = this._host.game.tabs.find(subject => subject.tabId === name);
    if (isNil(tab)) {
      throw new Error(`Unable to find tab ${name}`);
    }
    this.tab = tab;
    this.render();
  }
  render() {
    if (this._host.game.ui.activeTabId !== this.tab.tabId) {
      this.tab.render();
    }
    return this;
  }
}
//# sourceMappingURL=TabManager.js.map
