import { mustExist } from "@oliversalzburg/js-utils/data/nil.js";
import type { SupportedLocale } from "../Engine.js";
import type { ActivitySectionOther } from "../helper/ActivitySummary.js";
import { Icons } from "../images/Icons.js";
import type { EngineSettings } from "../settings/EngineSettings.js";
import type { SettingOptions } from "../settings/Settings.js";
import { ucfirst } from "../tools/Format.js";
import { cl } from "../tools/Log.js";
import { Button } from "./components/Button.js";
import { Container } from "./components/Container.js";
import { Delimiter } from "./components/Delimiter.js";
import { HeaderListItem } from "./components/HeaderListItem.js";
import stylesLabelListItem from "./components/LabelListItem.module.css";
import stylesSettingListItem from "./components/SettingListItem.module.css";
import { SettingsList } from "./components/SettingsList.js";
import { SettingsPanel } from "./components/SettingsPanel.js";
import { TextListItem } from "./components/TextListItem.js";
import { ToolbarListItem } from "./components/ToolbarListItem.js";
import type {
	UiComponent,
	UiComponentInterface,
} from "./components/UiComponent.js";

export class ActivityUi extends SettingsPanel<EngineSettings> {
	private _activityList: SettingsList;

	constructor(
		parent: UiComponent,
		settings: EngineSettings,
		_locale: SettingOptions<SupportedLocale>,
	) {
		console.debug(...cl(`Constructing ${ActivityUi.name}`));

		super(
			parent,
			settings,
			new TextListItem(parent, parent.host.engine.i18n("ui.activity"), {
				classes: [stylesSettingListItem.checked, stylesSettingListItem.setting],
				icon: Icons.Summary,
			}).addChildrenHead([
				new Container(parent, { classes: [stylesLabelListItem.fillSpace] }),
			]),
		);

		this._activityList = new SettingsList(this);

		this.addChildrenContent([
			new SettingsList(this, {
				hasDisableAll: false,
				hasEnableAll: false,
			}).addChildren([
				new ToolbarListItem(this).addChildren([
					new Button(
						this,
						this.host.engine.i18n("ui.activity.refresh"),
						Icons.Sync,
						{
							onClick: () => {
								this.refresh();
							},
						},
					),
					new Button(
						this,
						this.host.engine.i18n("ui.activity.reset"),
						Icons.Reset,
						{
							onClick: () => {
								this.host.engine.activitySummary.resetActivity();
								this.refresh();
							},
						},
					),
				]),
			]),
			this._activityList,
		]);
	}

	refresh() {
		super.refresh();

		const uiElements = new Array<UiComponentInterface>();

		uiElements.push(
			new TextListItem(
				this,
				this.host.engine.i18n("summary.head", [
					this.host.engine.activitySummary.getDuration(),
				]),
			),
		);

		// Technologies.
		if (this.host.engine.activitySummary.sections.has("research")) {
			uiElements.push(
				new Delimiter(this),
				new HeaderListItem(this, "Research"),
			);

			const section = mustExist(
				this.host.engine.activitySummary.sections.get("research"),
			);
			section.forEach((_amount, name) => {
				uiElements.push(
					new TextListItem(
						this,
						this.host.engine.i18n("summary.tech", [ucfirst(name)]),
					),
				);
			});
		}

		// Upgrades.
		if (this.host.engine.activitySummary.sections.has("upgrade")) {
			uiElements.push(
				new Delimiter(this),
				new HeaderListItem(this, "Upgrades"),
			);

			const section = mustExist(
				this.host.engine.activitySummary.sections.get("upgrade"),
			);
			section.forEach((_amount, name) => {
				uiElements.push(
					new TextListItem(
						this,
						this.host.engine.i18n("summary.upgrade", [ucfirst(name)]),
					),
				);
			});
		}

		// Buildings.
		if (this.host.engine.activitySummary.sections.has("build")) {
			uiElements.push(new Delimiter(this), new HeaderListItem(this, "Build"));

			const section = mustExist(
				this.host.engine.activitySummary.sections.get("build"),
			);
			section.forEach((amount, name) => {
				uiElements.push(
					new TextListItem(
						this,
						this.host.engine.i18n("summary.building", [
							this.host.game.getDisplayValueExt(amount),
							ucfirst(name),
						]),
					),
				);
			});
		}

		// Ziggurats
		if (this.host.engine.activitySummary.sections.has("refine")) {
			uiElements.push(new Delimiter(this), new HeaderListItem(this, "Refine"));

			const section = mustExist(
				this.host.engine.activitySummary.sections.get("refine"),
			);
			section.forEach((amount, name) => {
				uiElements.push(
					new TextListItem(
						this,
						this.host.engine.i18n("summary.refine", [
							this.host.game.getDisplayValueExt(amount),
							ucfirst(name),
						]),
					),
				);
			});
		}
		// Order of the sun.
		if (this.host.engine.activitySummary.sections.has("faith")) {
			uiElements.push(new Delimiter(this), new HeaderListItem(this, "Faith"));

			const section = mustExist(
				this.host.engine.activitySummary.sections.get("faith"),
			);
			section.forEach((amount, name) => {
				uiElements.push(
					new TextListItem(
						this,
						this.host.engine.i18n("summary.sun", [
							this.host.game.getDisplayValueExt(amount),
							ucfirst(name),
						]),
					),
				);
			});
		}

		// Crafts.
		if (this.host.engine.activitySummary.sections.has("craft")) {
			uiElements.push(new Delimiter(this), new HeaderListItem(this, "Craft"));

			const section = mustExist(
				this.host.engine.activitySummary.sections.get("craft"),
			);
			section.forEach((amount, name) => {
				uiElements.push(
					new TextListItem(
						this,
						this.host.engine.i18n("summary.craft", [
							this.host.game.getDisplayValueExt(amount),
							ucfirst(name),
						]),
					),
				);
			});
		}

		// Trades.
		if (this.host.engine.activitySummary.sections.has("trade")) {
			uiElements.push(new Delimiter(this), new HeaderListItem(this, "Trade"));

			const section = mustExist(
				this.host.engine.activitySummary.sections.get("trade"),
			);
			section.forEach((amount, name) => {
				uiElements.push(
					new TextListItem(
						this,
						this.host.engine.i18n("summary.trade", [
							this.host.game.getDisplayValueExt(amount),
							ucfirst(name),
						]),
					),
				);
			});
		}

		// Uncategorized items.
		if (this.host.engine.activitySummary.sections.has("other")) {
			uiElements.push(new Delimiter(this), new HeaderListItem(this, "Other"));

			const section = mustExist(
				this.host.engine.activitySummary.sections.get("other"),
			) as Map<ActivitySectionOther, number>;
			for (const [name, amount] of section) {
				uiElements.push(
					new TextListItem(
						this,
						this.host.engine.i18n(`summary.${name}` as const, [
							this.host.game.getDisplayValueExt(amount),
						]),
					),
				);
			}
		}

		this._activityList.removeChildren(this._activityList.children);
		this._activityList.addChildren(uiElements);
	}
}
