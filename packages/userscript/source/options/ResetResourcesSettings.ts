import { Setting } from "./Settings";

export class TimeControlResourcesSettingsItem extends Setting {
  stock = 0;
  $stock?: JQuery<HTMLElement>;

  constructor(id: string, enabled: boolean, stock: number) {
    super(id, enabled);
    this.stock = stock;
  }
}

export class ResetResourcesSettings {
  alloy = new TimeControlResourcesSettingsItem("alloy", false, 0);
  antimatter = new TimeControlResourcesSettingsItem("antimatter", false, 0);
  beam = new TimeControlResourcesSettingsItem("beam", false, 0);
  blackcoin = new TimeControlResourcesSettingsItem("blackcoin", false, 0);
  bloodstone = new TimeControlResourcesSettingsItem("bloodstone", false, 0);
  blueprint = new TimeControlResourcesSettingsItem("blueprint", false, 0);
  catnip = new TimeControlResourcesSettingsItem("catnip", false, 0);
  coal = new TimeControlResourcesSettingsItem("coal", false, 0);
  compedium = new TimeControlResourcesSettingsItem("compedium", false, 0);
  concrate = new TimeControlResourcesSettingsItem("concrate", false, 0);
  culture = new TimeControlResourcesSettingsItem("culture", false, 0);
  eludium = new TimeControlResourcesSettingsItem("eludium", false, 0);
  faith = new TimeControlResourcesSettingsItem("faith", false, 0);
  furs = new TimeControlResourcesSettingsItem("furs", false, 0);
  gear = new TimeControlResourcesSettingsItem("gear", false, 0);
  gold = new TimeControlResourcesSettingsItem("gold", false, 0);
  iron = new TimeControlResourcesSettingsItem("iron", false, 0);
  ivory = new TimeControlResourcesSettingsItem("ivory", false, 0);
  karma = new TimeControlResourcesSettingsItem("karma", false, 0);
  kerosene = new TimeControlResourcesSettingsItem("kerosene", false, 0);
  manpower = new TimeControlResourcesSettingsItem("manpower", false, 0);
  manuscript = new TimeControlResourcesSettingsItem("manuscript", false, 0);
  megalith = new TimeControlResourcesSettingsItem("megalith", false, 0);
  minerals = new TimeControlResourcesSettingsItem("minerals", false, 0);
  necrocorn = new TimeControlResourcesSettingsItem("necrocorn", false, 0);
  oil = new TimeControlResourcesSettingsItem("oil", false, 0);
  paragon = new TimeControlResourcesSettingsItem("paragon", false, 0);
  parchment = new TimeControlResourcesSettingsItem("parchment", false, 0);
  plate = new TimeControlResourcesSettingsItem("plate", false, 0);
  relic = new TimeControlResourcesSettingsItem("relic", false, 0);
  scaffold = new TimeControlResourcesSettingsItem("scaffold", false, 0);
  science = new TimeControlResourcesSettingsItem("science", false, 0);
  ship = new TimeControlResourcesSettingsItem("ship", false, 0);
  slab = new TimeControlResourcesSettingsItem("slab", false, 0);
  spice = new TimeControlResourcesSettingsItem("spice", false, 0);
  steel = new TimeControlResourcesSettingsItem("steel", false, 0);
  tanker = new TimeControlResourcesSettingsItem("tanker", false, 0);
  tears = new TimeControlResourcesSettingsItem("tears", false, 0);
  temporalFlux = new TimeControlResourcesSettingsItem("temporalFlux", false, 0);
  thorium = new TimeControlResourcesSettingsItem("thorium", false, 0);
  timeCrystal = new TimeControlResourcesSettingsItem("timeCrystal", false, 0);
  titanium = new TimeControlResourcesSettingsItem("titanium", false, 0);
  unicorns = new TimeControlResourcesSettingsItem("unicorns", false, 0);
  unobtainium = new TimeControlResourcesSettingsItem("unobtainium", false, 0);
  uranium = new TimeControlResourcesSettingsItem("uranium", false, 0);
  void = new TimeControlResourcesSettingsItem("void", false, 0);
  wood = new TimeControlResourcesSettingsItem("wood", false, 0);
  zebras = new TimeControlResourcesSettingsItem("zebras", false, 0);
}
