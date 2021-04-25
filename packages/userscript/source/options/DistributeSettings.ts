import { Jobs } from "../types";

export type DistributeSettingsItem = { enabled: boolean; limited: boolean; max: number };
export class DistributeSettings {
  enabled = false;

  items: {
    [item in Jobs]: DistributeSettingsItem;
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
