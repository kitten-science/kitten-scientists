import { Jobs } from "../types";
import { SettingsSection } from "./SettingsSection";

export type DistributeItems = Jobs;
export type DistributeSettingsItem = {
  enabled: boolean;
  $enabled?: JQuery<HTMLElement>;

  limited: boolean;
  $limited?: JQuery<HTMLElement>;

  max: number;
  $max?: JQuery<HTMLElement>;
};
export class DistributeSettings extends SettingsSection {
  items: {
    [item in DistributeItems]: DistributeSettingsItem;
  } = {
    woodcutter: { enabled: true, limited: true, max: 1 },
    farmer: { enabled: true, limited: true, max: 1 },
    scholar: { enabled: true, limited: true, max: 1 },
    hunter: { enabled: true, limited: true, max: 1 },
    miner: { enabled: true, limited: true, max: 1 },
    priest: { enabled: true, limited: true, max: 1 },
    geologist: { enabled: true, limited: true, max: 1 },
    engineer: { enabled: true, limited: true, max: 1 },
  };
}
