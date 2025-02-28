import type { KittenScientists } from "./KittenScientists.js";
import type { TabManager } from "./TabManager.js";
export declare abstract class UpgradeManager {
  protected readonly _host: KittenScientists;
  abstract manager: TabManager;
  constructor(host: KittenScientists);
  upgrade(
    upgrade: {
      label: string;
    },
    variant: "policy" | "science" | "workshop",
  ): Promise<boolean>;
  /**
   * Run a piece of code that might invoke UI confirmation and
   * skip that UI confirmation.
   *
   * @param action The function to run without UI confirmation.
   * @returns Whatever `action` returns.
   */
  static skipConfirm<T>(action: () => Promise<T>): Promise<T>;
  private _getUpgradeButton;
}
//# sourceMappingURL=UpgradeManager.d.ts.map
