import { Setting } from "./Settings";

export class ResourcesSettingsItem extends Setting {
  consume?: number;
  $consume?: JQuery<HTMLElement>;

  stock = 0;
  $stock?: JQuery<HTMLElement>;

  constructor(enabled: boolean, consume: number | undefined, stock: number) {
    super(enabled);
    this.consume = consume;
    this.stock = stock;
  }
}

export class ResourceSettings {
  alloy = new ResourcesSettingsItem(false, 1, 0);
  antimatter = new ResourcesSettingsItem(false, 1, 0);
  beam = new ResourcesSettingsItem(false, 1, 0);
  blackcoin = new ResourcesSettingsItem(false, 1, 0);
  bloodstone = new ResourcesSettingsItem(false, 1, 0);
  blueprint = new ResourcesSettingsItem(false, 1, 0);
  catnip = new ResourcesSettingsItem(false, 1, 0);
  coal = new ResourcesSettingsItem(false, 1, 0);
  compedium = new ResourcesSettingsItem(false, 1, 0);
  concrate = new ResourcesSettingsItem(false, 1, 0);
  culture = new ResourcesSettingsItem(false, 1, 0);
  eludium = new ResourcesSettingsItem(false, 1, 0);
  faith = new ResourcesSettingsItem(false, 1, 0);
  furs = new ResourcesSettingsItem(true, undefined, 1000);
  gear = new ResourcesSettingsItem(false, 1, 0);
  gold = new ResourcesSettingsItem(false, 1, 0);
  iron = new ResourcesSettingsItem(false, 1, 0);
  ivory = new ResourcesSettingsItem(false, 1, 0);
  karma = new ResourcesSettingsItem(false, 1, 0);
  kerosene = new ResourcesSettingsItem(false, 1, 0);
  manpower = new ResourcesSettingsItem(false, 1, 0);
  manuscript = new ResourcesSettingsItem(false, 1, 0);
  megalith = new ResourcesSettingsItem(false, 1, 0);
  minerals = new ResourcesSettingsItem(false, 1, 0);
  necrocorn = new ResourcesSettingsItem(false, 1, 0);
  oil = new ResourcesSettingsItem(false, 1, 0);
  paragon = new ResourcesSettingsItem(false, 1, 0);
  parchment = new ResourcesSettingsItem(false, 1, 0);
  plate = new ResourcesSettingsItem(false, 1, 0);
  relic = new ResourcesSettingsItem(false, 1, 0);
  scaffold = new ResourcesSettingsItem(false, 1, 0);
  science = new ResourcesSettingsItem(false, 1, 0);
  ship = new ResourcesSettingsItem(false, 1, 0);
  slab = new ResourcesSettingsItem(false, 1, 0);
  spice = new ResourcesSettingsItem(false, 1, 0);
  steel = new ResourcesSettingsItem(false, 1, 0);
  tanker = new ResourcesSettingsItem(false, 1, 0);
  tears = new ResourcesSettingsItem(false, 1, 0);
  temporalFlux = new ResourcesSettingsItem(false, 1, 0);
  thorium = new ResourcesSettingsItem(false, 1, 0);
  timeCrystal = new ResourcesSettingsItem(false, 1, 0);
  titanium = new ResourcesSettingsItem(false, 1, 0);
  unicorns = new ResourcesSettingsItem(false, 1, 0);
  unobtainium = new ResourcesSettingsItem(false, 1, 0);
  uranium = new ResourcesSettingsItem(false, 1, 0);
  void = new ResourcesSettingsItem(false, 1, 0);
  wood = new ResourcesSettingsItem(false, 1, 0);
  zebras = new ResourcesSettingsItem(false, 1, 0);
}
