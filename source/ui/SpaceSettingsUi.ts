import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import type { SupportedLocale } from "../Engine.js";
import type { SettingOptions } from "../settings/Settings.js";
import { SpaceSettings } from "../settings/SpaceSettings.js";
import { BuildSectionTools } from "./BuildSectionTools.js";
import { Dialog } from "./components/Dialog.js";
import { HeaderListItem } from "./components/HeaderListItem.js";
import { SettingsList } from "./components/SettingsList.js";
import { SettingsPanel } from "./components/SettingsPanel.js";
import { SettingTriggerListItem } from "./components/SettingTriggerListItem.js";
import type { UiComponent } from "./components/UiComponent.js";
import { MissionSettingsUi } from "./MissionSettingsUi.js";

export class SpaceSettingsUi extends SettingsPanel<SpaceSettings, SettingTriggerListItem> {
  private readonly _missionsUi: MissionSettingsUi;

  constructor(
    parent: UiComponent,
    settings: SpaceSettings,
    locale: SettingOptions<SupportedLocale>,
  ) {
    const label = parent.host.engine.i18n("ui.space");
    super(
      parent,
      settings,
      new SettingTriggerListItem(parent, settings, locale, label, {
        onCheck: (isBatchProcess?: boolean) => {
          parent.host.engine.imessage("status.auto.enable", [label]);
        },
        onRefreshTrigger() {
          this.triggerButton.element[0].title = parent.host.engine.i18n("ui.trigger.section", [
            settings.trigger < 0
              ? parent.host.engine.i18n("ui.trigger.section.inactive")
              : parent.host.renderPercentage(settings.trigger, locale.selected, true),
          ]);
        },
        onSetTrigger: async () => {
          const value = await Dialog.prompt(
            parent,
            parent.host.engine.i18n("ui.trigger.prompt.percentage"),
            parent.host.engine.i18n("ui.trigger.section.prompt", [
              label,
              settings.trigger !== -1
                ? parent.host.renderPercentage(settings.trigger, locale.selected, true)
                : parent.host.engine.i18n("ui.infinity"),
            ]),
            settings.trigger !== -1 ? parent.host.renderPercentage(settings.trigger) : "",
            parent.host.engine.i18n("ui.trigger.section.promptExplainer"),
          );

          if (value === undefined) {
            return;
          }

          if (value === "" || value.startsWith("-")) {
            settings.trigger = -1;
            return;
          }

          settings.trigger = parent.host.parsePercentage(value);
        },
        onUnCheck: (isBatchProcess?: boolean) => {
          parent.host.engine.imessage("status.auto.disable", [label]);
        },
        renderLabelTrigger: false,
      }),
      {
        onRefreshRequest: () => {
          this.settingItem.triggerButton.inactive = !settings.enabled || settings.trigger === -1;
          this.settingItem.triggerButton.ineffective =
            settings.enabled &&
            settings.trigger < 0 &&
            Object.values(settings.buildings).some(_ => _.enabled && 0 < _.max && _.trigger < 0);

          this.expando.ineffective =
            settings.enabled &&
            (Object.values(settings.buildings).some(
              _ => _.enabled && (0 === _.max || (0 < _.trigger && 0 < settings.trigger)),
            ) ||
              (!Object.values(settings.buildings).some(_ => _.enabled) &&
                !settings.unlockMissions.enabled) ||
              this._missionsUi.expando.ineffective);
        },
      },
    );

    this.addChildContent(
      new SettingsList(this, {
        onReset: () => {
          this.setting.load({ buildings: new SpaceSettings().buildings });
        },
      }).addChildren(
        this.host.game.space.planets
          .filter(planet => 0 < planet.buildings.length)
          .flatMap((planet, indexPlanet, arrayPlant) => [
            new HeaderListItem(this, this.host.engine.labelForPlanet(planet.name)),
            ...planet.buildings
              .filter(item => !isNil(this.setting.buildings[item.name]))
              .map((building, indexBuilding, arrayBuilding) =>
                BuildSectionTools.getBuildOption(
                  this,
                  this.setting.buildings[building.name],
                  locale,
                  this.setting,
                  building.label,
                  label,
                  {
                    delimiter:
                      indexPlanet < arrayPlant.length - 1 &&
                      indexBuilding === arrayBuilding.length - 1,
                    renderLabelTrigger: false,
                  },
                ),
              ),
          ]),
      ),
    );

    const listAddition = new SettingsList(this, {
      hasDisableAll: false,
      hasEnableAll: false,
    });
    listAddition.addChild(new HeaderListItem(this, this.host.engine.i18n("ui.additional")));

    this._missionsUi = new MissionSettingsUi(
      this,
      this.setting.unlockMissions,
      locale,
      this.setting,
    );
    listAddition.addChild(this._missionsUi);
    this.addChildContent(listAddition);
  }
}
