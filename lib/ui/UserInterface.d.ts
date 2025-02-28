import type { KittenScientists } from "../KittenScientists.js";
import { StateManagementUi } from "./StateManagementUi.js";
import { UiComponent } from "./components/UiComponent.js";
export declare class UserInterface extends UiComponent {
  readonly element: JQuery;
  readonly showActivity: JQuery;
  private _engineUi;
  private _sections;
  stateManagementUi: StateManagementUi;
  constructor(host: KittenScientists);
  destroy(): void;
  refreshUi(): void;
}
//# sourceMappingURL=UserInterface.d.ts.map
