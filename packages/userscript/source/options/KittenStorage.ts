import { Job, Race, Resource, Season } from "../types";
import { BuildItem } from "./BonfireSettings";
import { FilterItem } from "./FilterSettings";
import { AllItems } from "./Options";
import { OptionsItem } from "./OptionsSettings";
import { FaithItem, ReligionAdditionItem, UnicornItem } from "./ReligionSettings";
import { SpaceItem } from "./SpaceSettings";
import { TimeControlItem } from "./TimeControlSettings";
import { TimeItem } from "./TimeSettings";
import { UnlockItem } from "./UnlockingSettings";

type SetMaxBuildingItem = `set-${AllItems}-max`;
type SetMaxJobItem = `set-${Job}-max`;
type SetMaxResourceItem = `set-${Resource}-max`;
type SetMinResetBuildingItem = `set-reset-build-${Exclude<BuildItem, "unicornPasture">}-min`;
type SetMinResetFaithItem = `set-reset-faith-${FaithItem | UnicornItem}-min`;
type SetMinResetSpaceItem = `set-reset-space-${SpaceItem}-min`;
type SetMinResetTimeItem = `set-reset-time-${TimeItem}-min`;
type SetMinResetUnicornItem = `set-reset-unicorn-${UnicornItem}-min`;
type SetSubtriggerOptionItem = `set-${OptionsItem}-subTrigger`;
type SetSubtriggerReligionItem = `set-${ReligionAdditionItem}-subTrigger`;
type SetSubtriggerTimeCtrlItem = `set-${"accelerateTime" | "timeSkip"}-subTrigger`;
type ToggleBuildingItem = `toggle-${AllItems}`;
type ToggleFaithUnicornItem = `toggle-${FaithItem | UnicornItem}`;
type ToggleFilterItem = `toggle-${FilterItem}`;
type ToggleJobItem = `toggle-${Job}`;
type ToggleLimitedJobItem = `toggle-limited-${Job}`;
type ToggleLimitedRaceItem = `toggle-limited-${Race}`;
type ToggleLimitedResourceItem = `toggle-limited-${Resource}`;
type ToggleOptionsItem = `toggle-${OptionsItem}`;
type ToggleRaceItem = `toggle-${Race}`;
type ToggleRaceSeasonItem = `toggle-${Race}-${Season}`;
type ToggleReligionAdditionItem = `toggle-${ReligionAdditionItem}`;
type ToggleResetBuildingItem = `toggle-reset-build-${Exclude<BuildItem, "unicornPasture">}`;
type ToggleResetFaithItem = `toggle-reset-faith-${FaithItem | UnicornItem}`;
type ToggleResetSpaceItem = `toggle-reset-space-${SpaceItem}`;
type ToggleResetTimeItem = `toggle-reset-time-${TimeItem}`;
type ToggleResetUnicornItem = `toggle-reset-unicorn-${UnicornItem}`;
type ToggleResourceItem = `toggle-${Resource}`;
type ToggleTimeControlItem = `toggle-${TimeControlItem}`;
type ToggleTimeControlCycleItem = `toggle-timeSkip-${0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}`;
type ToggleTimeControlSeasonItem = `toggle-timeSkip-${Season}`;
type ToggleTimeItem = `toggle-${TimeItem}`;
type ToggleUnlockItem = `toggle-${UnlockItem}`;

export type KittenStorageType = {
  version: number;
  toggles: Record<string, boolean>;
  items: Partial<Record<SetMaxBuildingItem, number>> &
    Partial<Record<SetMaxJobItem, number>> &
    Partial<Record<SetMaxResourceItem, number>> &
    Partial<Record<SetMinResetBuildingItem, number>> &
    Partial<Record<SetMinResetFaithItem, number>> &
    Partial<Record<SetMinResetSpaceItem, number>> &
    Partial<Record<SetMinResetTimeItem, number>> &
    Partial<Record<SetMinResetUnicornItem, number>> &
    Partial<Record<SetSubtriggerOptionItem, number>> &
    Partial<Record<SetSubtriggerReligionItem, number>> &
    Partial<Record<SetSubtriggerTimeCtrlItem, number>> &
    Partial<Record<ToggleBuildingItem, boolean>> &
    Partial<Record<ToggleFaithUnicornItem, boolean>> &
    Partial<Record<ToggleFilterItem, boolean>> &
    Partial<Record<ToggleJobItem, boolean>> &
    Partial<Record<ToggleLimitedJobItem, boolean>> &
    Partial<Record<ToggleLimitedRaceItem, boolean>> &
    Partial<Record<ToggleLimitedResourceItem, boolean>> &
    Partial<Record<ToggleOptionsItem, boolean>> &
    Partial<Record<ToggleRaceItem, boolean>> &
    Partial<Record<ToggleRaceSeasonItem, boolean>> &
    Partial<Record<ToggleReligionAdditionItem, boolean>> &
    Partial<Record<ToggleResetBuildingItem, boolean>> &
    Partial<Record<ToggleResetFaithItem, boolean>> &
    Partial<Record<ToggleResetSpaceItem, boolean>> &
    Partial<Record<ToggleResetTimeItem, boolean>> &
    Partial<Record<ToggleResetUnicornItem, boolean>> &
    Partial<Record<ToggleResourceItem, boolean>> &
    Partial<Record<ToggleTimeControlCycleItem, boolean>> &
    Partial<Record<ToggleTimeControlItem, boolean>> &
    Partial<Record<ToggleTimeControlSeasonItem, boolean>> &
    Partial<Record<ToggleTimeItem, boolean>> &
    Partial<Record<ToggleUnlockItem, boolean>>;
  resources: Partial<
    Record<
      Resource,
      {
        /**
         * This indicates if the resource option relates to the timeControl.reset automation.
         * If it's `false`, it's a resource option in the craft settings.
         */
        checkForReset: boolean;
        consume?: number;
        enabled: boolean;
        stock: number;
        stockForReset: number;
      }
    >
  >;
  triggers: {
    build: number;
    craft: number;
    faith: number;
    space: number;
    time: number;
    trade: number;
  };
  reset: {
    reset: boolean;
    times: number;
    paragonLastTime: number;
    pargonTotal: number;
    karmaLastTime: number;
    karmaTotal: number;
  };
};
