import type { SupportedLocale } from "../Engine.js";
import type { KittenScientists } from "../KittenScientists.js";
import type { SettingOptions, SettingTrigger, SettingTriggerMax } from "../settings/Settings.js";
import { SettingMaxTriggerListItem } from "./components/SettingMaxTriggerListItem.js";
export declare const BuildSectionTools: {
  getBuildOption: (
    host: KittenScientists,
    option: SettingTriggerMax,
    locale: SettingOptions<SupportedLocale>,
    sectionSetting: SettingTrigger,
    label: string,
    sectionLabel: string,
    delimiter?: boolean,
    upgradeIndicator?: boolean,
  ) => SettingMaxTriggerListItem<
    import("./components/UiComponent.js").UiComponentOptions<
      import("./components/UiComponent.js").UiComponent<
        import("./components/UiComponent.js").UiComponentOptions<
          import("./components/UiComponent.js").UiComponentInterface
        >
      >
    > & {
      readonly delimiter: boolean;
    } & {
      readonly childrenHead: Array<import("./components/UiComponent.js").UiComponent>;
      readonly icon: string;
      readonly upgradeIndicator: boolean;
    } & {
      readonly onCheck: () => void;
      readonly onUnCheck: () => void;
      readonly readOnly: boolean;
    } & import("./components/SettingMaxListItem.js").SettingListItemOptionsMax &
      import("./components/SettingTriggerListItem.js").SettingListItemOptionsTrigger
  >;
};
//# sourceMappingURL=BuildSectionTools.d.ts.map
