import { isNil } from "../tools/Maybe";
import { BonfireSettings } from "./BonfireSettings";
import { CraftSettings } from "./CraftSettings";
import { DistributeSettings } from "./DistributeSettings";
import { FilterSettings } from "./FilterSettings";
import { OptionsSettings } from "./OptionsSettings";
import { ReligionSettings } from "./ReligionSettings";
import { SpaceSettings } from "./SpaceSettings";
import { TimeControlSettings } from "./TimeControlSettings";
import { TimeSettings } from "./TimeSettings";
import { TradingSettings } from "./TradingSettings";
import { UnlockingSettings } from "./UnlockingSettings";

export class OptionsExt {
  auto: {
    build: BonfireSettings;
    space: SpaceSettings;
    craft: CraftSettings;
    unlock: UnlockingSettings;
    trade: TradingSettings;
    religion: ReligionSettings;
    time: TimeSettings;
    timeCtrl: TimeControlSettings;
    distribute: DistributeSettings;
    options: OptionsSettings;
    filters: FilterSettings;
  } = {
    build: new BonfireSettings(),
    space: new SpaceSettings(),
    craft: new CraftSettings(),
    unlock: new UnlockingSettings(),
    trade: new TradingSettings(),
    religion: new ReligionSettings(),
    time: new TimeSettings(),
    timeCtrl: new TimeControlSettings(),
    distribute: new DistributeSettings(),
    options: new OptionsSettings(),
    filters: new FilterSettings(),
  };

  static parse(optionsObject: unknown): OptionsExt {
    const result = new OptionsExt();

    if (isNil(optionsObject)) {
      return result;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const subject = optionsObject as any;

    result.auto.build.enabled = subject.toggles.build;
    result.auto.space.enabled = subject.toggles.space;
    result.auto.craft.enabled = subject.toggles.craft;
    result.auto.unlock.enabled = subject.toggles.upgrade;
    result.auto.trade.enabled = subject.toggles.trade;
    result.auto.religion.enabled = subject.toggles.faith;
    result.auto.time.enabled = subject.toggles.time;
    result.auto.timeCtrl.enabled = subject.toggles.timeCtrl;
    result.auto.distribute.enabled = subject.toggles.distribute;
    result.auto.options.enabled = subject.toggles.options;
    result.auto.filters.enabled = subject.toggles.filter;

    result.auto.religion.trigger = subject.triggers.faith;
    result.auto.time.trigger = subject.triggers.time;
    result.auto.build.trigger = subject.triggers.build;
    result.auto.space.trigger = subject.triggers.space;
    result.auto.craft.trigger = subject.triggers.craft;
    result.auto.trade.trigger = subject.triggers.trade;

    return result;
  }
}
