import { isNil, Maybe } from "../tools/Maybe";
import { Setting } from "./Settings";

export class StateSettings extends Setting {
  readonly noConfirm: Setting;
  readonly compress: Setting;

  constructor(noConfirm = new Setting(false), compress = new Setting(true)) {
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
