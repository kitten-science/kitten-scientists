import { objectEntries } from "../tools/Entries";
import { Setting, SettingTrigger } from "./Settings";
import { SettingsSection } from "./SettingsSection";
import { KittenStorageType } from "./SettingsStorage";

export type OptionsItem = "autofeed" | "crypto" | "fixCry" | "observe";

export class OptionsSettingsItem extends Setting implements Partial<SettingTrigger> {
  trigger: number | undefined = undefined;
  $trigger: JQuery<HTMLElement> | undefined = undefined;

  constructor(enabled = false, trigger: number | undefined = undefined) {
    super(enabled);
    this.trigger = trigger;
  }
}

export class OptionsSettings extends SettingsSection {
  items: {
    [key in OptionsItem]: OptionsSettingsItem;
  } = {
    observe: new OptionsSettingsItem(true),
    autofeed: new OptionsSettingsItem(true),

    crypto: new OptionsSettingsItem(true, 10000),
    fixCry: new OptionsSettingsItem(false),
  };

  constructor(
    enabled = false,
    observe = new OptionsSettingsItem(true),
    autofeed = new OptionsSettingsItem(true),
    crypto = new OptionsSettingsItem(true, 10000),
    fixCry = new OptionsSettingsItem(false)
  ) {
    super(enabled);
    this.items.observe = observe;
    this.items.autofeed = autofeed;
    this.items.crypto = crypto;
    this.items.fixCry = fixCry;
  }

  static fromLegacyOptions(subject: KittenStorageType) {
    const options = new OptionsSettings();
    options.enabled = subject.toggles.options;
    for (const [name, item] of objectEntries(options.items)) {
      item.enabled = subject.items[`toggle-${name}` as const] ?? item.enabled;
      item.trigger = subject.items[`set-${name}-trigger` as const] ?? item.trigger;
    }
    return options;
  }
}
