import { mustExist } from "@oliversalzburg/js-utils/data/nil.js";
import type { SupportedLocale } from "../Engine.js";
import { ActivitySections } from "../helper/ActivitySummary.js";
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

		const sections = new Set(
			this.host.engine.activitySummary.activities
				.keys()
				.map((activity) => ActivitySections[activity]),
		);

		uiElements.push(
			new TextListItem(
				this,
				this.host.engine.i18n("summary.head", [
					this.host.engine.activitySummary.getDuration(),
				]),
			),
		);

		if (sections.has("Bonfire")) {
			uiElements.push(
				new Delimiter(this),
				new HeaderListItem(this, this.host.engine.i18n("ui.build")),
			);

			const section = mustExist(
				this.host.engine.activitySummary.activities
					.entries()
					.filter(([activity]) => ActivitySections[activity] === "Bonfire"),
			);
			for (const [activity, entries] of section) {
				for (const [label, count] of entries) {
					uiElements.push(
						new TextListItem(
							this,
							this.host.engine.i18n(`summary.${activity}`, [
								this.host.game.getDisplayValueExt(count),
								ucfirst(label),
							]),
						),
					);
				}
			}
		}

		if (sections.has("Village")) {
			uiElements.push(
				new Delimiter(this),
				new HeaderListItem(this, this.host.engine.i18n("ui.distribute")),
			);

			const section = mustExist(
				this.host.engine.activitySummary.activities
					.entries()
					.filter(([activity]) => ActivitySections[activity] === "Village"),
			);
			for (const [activity, entries] of section) {
				for (const [label, count] of entries) {
					uiElements.push(
						new TextListItem(
							this,
							this.host.engine.i18n(`summary.${activity}`, [
								this.host.game.getDisplayValueExt(count),
								ucfirst(label),
							]),
						),
					);
				}
			}
		}

		if (sections.has("Science")) {
			uiElements.push(
				new Delimiter(this),
				new HeaderListItem(this, this.host.engine.i18n("ui.upgrade")),
			);

			const section = mustExist(
				this.host.engine.activitySummary.activities
					.entries()
					.filter(([activity]) => ActivitySections[activity] === "Science"),
			);
			for (const [activity, entries] of section) {
				for (const [label, count] of entries) {
					uiElements.push(
						new TextListItem(
							this,
							this.host.engine.i18n(`summary.${activity}`, [
								this.host.game.getDisplayValueExt(count),
								ucfirst(label),
							]),
						),
					);
				}
			}
		}

		if (sections.has("Workshop")) {
			uiElements.push(
				new Delimiter(this),
				new HeaderListItem(this, this.host.engine.i18n("ui.craft")),
			);

			const section = mustExist(
				this.host.engine.activitySummary.activities
					.entries()
					.filter(([activity]) => ActivitySections[activity] === "Workshop"),
			);
			for (const [activity, entries] of section) {
				for (const [label, count] of entries) {
					uiElements.push(
						new TextListItem(
							this,
							this.host.engine.i18n(`summary.${activity}`, [
								this.host.game.getDisplayValueExt(count),
								ucfirst(label),
							]),
						),
					);
				}
			}
		}

		if (sections.has("Trade")) {
			uiElements.push(
				new Delimiter(this),
				new HeaderListItem(this, this.host.engine.i18n("ui.trade")),
			);

			const section = mustExist(
				this.host.engine.activitySummary.activities
					.entries()
					.filter(([activity]) => ActivitySections[activity] === "Trade"),
			);
			for (const [activity, entries] of section) {
				for (const [label, count] of entries) {
					uiElements.push(
						new TextListItem(
							this,
							this.host.engine.i18n(`summary.${activity}`, [
								this.host.game.getDisplayValueExt(count),
								ucfirst(label),
							]),
						),
					);
				}
			}
		}

		if (sections.has("Religion")) {
			uiElements.push(
				new Delimiter(this),
				new HeaderListItem(this, this.host.engine.i18n("ui.faith")),
			);

			const section = mustExist(
				this.host.engine.activitySummary.activities
					.entries()
					.filter(([activity]) => ActivitySections[activity] === "Religion"),
			);
			for (const [activity, entries] of section) {
				for (const [label, count] of entries) {
					uiElements.push(
						new TextListItem(
							this,
							this.host.engine.i18n(`summary.${activity}`, [
								this.host.game.getDisplayValueExt(count),
								ucfirst(label),
							]),
						),
					);
				}
			}
		}

		if (sections.has("Space")) {
			uiElements.push(
				new Delimiter(this),
				new HeaderListItem(this, this.host.engine.i18n("ui.space")),
			);

			const section = mustExist(
				this.host.engine.activitySummary.activities
					.entries()
					.filter(([activity]) => ActivitySections[activity] === "Space"),
			);
			for (const [activity, entries] of section) {
				for (const [label, count] of entries) {
					uiElements.push(
						new TextListItem(
							this,
							this.host.engine.i18n(`summary.${activity}`, [
								this.host.game.getDisplayValueExt(count),
								ucfirst(label),
							]),
						),
					);
				}
			}
		}

		if (sections.has("Time")) {
			uiElements.push(
				new Delimiter(this),
				new HeaderListItem(this, this.host.engine.i18n("ui.time")),
			);

			const section = mustExist(
				this.host.engine.activitySummary.activities
					.entries()
					.filter(([activity]) => ActivitySections[activity] === "Time"),
			);
			for (const [activity, entries] of section) {
				for (const [label, count] of entries) {
					uiElements.push(
						new TextListItem(
							this,
							this.host.engine.i18n(`summary.${activity}`, [
								this.host.game.getDisplayValueExt(count),
								ucfirst(label),
							]),
						),
					);
				}
			}
		}

		this._activityList.removeChildren(this._activityList.children);
		this._activityList.addChildren(uiElements);
	}
}
