import type { KittenScientists } from "./KittenScientists.js";
import type { GameTab, TabId } from "./types/index.js";
export declare class TabManager<TTab extends GameTab = GameTab> {
  private readonly _host;
  tab: TTab;
  constructor(host: KittenScientists, name: TabId);
  render(): this;
}
//# sourceMappingURL=TabManager.d.ts.map
