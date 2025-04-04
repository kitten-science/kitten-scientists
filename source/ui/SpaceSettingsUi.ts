import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { redirectErrorsToConsole } from "@oliversalzburg/js-utils/errors/console.js";
import type { SupportedLocale } from "../Engine.js";
import type { KittenScientists } from "../KittenScientists.js";
import type { SettingOptions } from "../settings/Settings.js";
import { SpaceSettings } from "../settings/SpaceSettings.js";
import { BuildSectionTools } from "./BuildSectionTools.js";
import { MissionSettingsUi } from "./MissionSettingsUi.js";
import { Dialog } from "./components/Dialog.js";
import { HeaderListItem } from "./components/HeaderListItem.js";
import type { SettingListItemOptions } from "./components/SettingListItem.js";
import { SettingTriggerListItem } from "./components/SettingTriggerListItem.js";
import { SettingsList } from "./components/SettingsList.js";
import { SettingsPanel, type SettingsPanelOptions } from "./components/SettingsPanel.js";

export class SpaceSettingsUi extends SettingsPanel<SpaceSettings, SettingTriggerListItem> {
  private readonly _missionsUi: MissionSettingsUi;

  constructor(
    host: KittenScientists,
    settings: SpaceSettings,
    locale: SettingOptions<SupportedLocale>,
    options?: SettingsPanelOptions<SettingTriggerListItem> & SettingListItemOptions,
  ) {
    const label = host.engine.i18n("ui.space");
    super(
      host,
      settings,
      new SettingTriggerListItem(host, settings, locale, label, {
        onCheck: (isBatchProcess?: boolean) => {
          host.engine.imessage("status.auto.enable", [label]);
          this.refreshUi();
          options?.onCheck?.(isBatchProcess);
        },
        onUnCheck: (isBatchProcess?: boolean) => {
          host.engine.imessage("status.auto.disable", [label]);
          this.refreshUi();
          options?.onUnCheck?.(isBatchProcess);
        },
        onRefresh: () => {
          this.settingItem.triggerButton.inactive = !settings.enabled || settings.trigger === -1;
        },
        onRefreshTrigger: item => {
          item.triggerButton.element[0].title = host.engine.i18n("ui.trigger.section", [
            settings.trigger < 0
              ? host.engine.i18n("ui.trigger.section.inactive")
              : host.renderPercentage(settings.trigger, locale.selected, true),
          ]);
        },
        onSetTrigger: () => {
          Dialog.prompt(
            host,
            host.engine.i18n("ui.trigger.prompt.percentage"),
            host.engine.i18n("ui.trigger.section.prompt", [
              label,
              settings.trigger !== -1
                ? host.renderPercentage(settings.trigger, locale.selected, true)
                : host.engine.i18n("ui.infinity"),
            ]),
            settings.trigger !== -1 ? host.renderPercentage(settings.trigger) : "",
            host.engine.i18n("ui.trigger.section.promptExplainer"),
          )
            .then(value => {
              if (value === undefined) {
                return;
              }

              if (value === "" || value.startsWith("-")) {
                settings.trigger = -1;
                return;
              }

              settings.trigger = host.parsePercentage(value);
            })
            .then(() => {
              this.refreshUi();
            })
            .catch(redirectErrorsToConsole(console));
        },
      }),
    );

    this.addChild(
      new SettingsList(host, {
        children: host.game.space.planets
          .filter(planet => 0 < planet.buildings.length)
          .flatMap((planet, indexPlanet, arrayPlant) => [
            new HeaderListItem(host, host.engine.labelForPlanet(planet.name)),
            ...planet.buildings
              .filter(item => !isNil(this.setting.buildings[item.name]))
              .map((building, indexBuilding, arrayBuilding) =>
                BuildSectionTools.getBuildOption(
                  host,
                  this.setting.buildings[building.name],
                  locale,
                  this.setting,
                  building.label,
                  label,
                  {
                    delimiter:
                      indexPlanet < arrayPlant.length - 1 &&
                      indexBuilding === arrayBuilding.length - 1,
                  },
                ),
              ),
          ]),
        onReset: () => {
          this.setting.load({ buildings: new SpaceSettings().buildings });
          this.refreshUi();
        },
      }),
    );

    const listAddition = new SettingsList(host, {
      hasDisableAll: false,
      hasEnableAll: false,
    });
    listAddition.addChild(new HeaderListItem(host, host.engine.i18n("ui.additional")));

    this._missionsUi = new MissionSettingsUi(
      host,
      this.setting.unlockMissions,
      locale,
      this.setting,
    );
    listAddition.addChild(this._missionsUi);
    this.addChild(listAddition);
  }
}
