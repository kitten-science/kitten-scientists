import { type Maybe, isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { Setting } from "./Settings.js";

export class StateSettings extends Setting {
  readonly noConfirm: Setting;
  readonly compress: Setting;

  constructor(noConfirm = new Setting(), compress = new Setting(true)) {
    super(true);
    this.noConfirm = noConfirm;
    this.compress = compress;
  }

  load(settings: Maybe<Partial<StateSettings>>) {
    if (isNil(settings)) {
      return;
    }

    super.load(settings);

    this.noConfirm.load(settings.noConfirm);
    this.compress.load(settings.compress);
  }
}
