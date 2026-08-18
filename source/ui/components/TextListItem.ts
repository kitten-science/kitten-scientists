import { Container } from "./Container.js";
import stylesLabelListItem from "./LabelListItem.module.css";
import { ListItem, type ListItemOptions } from "./ListItem.js";
import stylesListItem from "./ListItem.module.css";
import styles from "./TextListItem.module.css";
import type { UiComponent, UiComponentInterface } from "./UiComponent.js";

export type TextListItemOptions = ThisType<TextListItem> &
	ListItemOptions & {
		/**
		 * When set to an SVG path, will be used as an icon on the label.
		 */
		readonly icon?: string;
	};

export class TextListItem extends ListItem {
	declare readonly options: TextListItemOptions;
	readonly head: Container;
	readonly elementLabel: JQuery;

	/**
	 * Construct a new text list item.
	 *
	 * @param host The userscript instance.
	 * @param label The label on the text element.
	 * @param options Options for the list item.
	 */
	constructor(
		parent: UiComponent,
		label: string,
		options?: TextListItemOptions,
	) {
		super(parent, options);

		this.head = new Container(parent);
		this.head.element.addClass(stylesListItem.head);
		this.addChild(this.head);

		this.elementLabel = $("<span/>", {
			text: label,
		}).addClass(styles.span);
		this.head.element.append(this.elementLabel);

		if (options?.icon) {
			const iconElement = $("<div/>", {
				html: `<svg style="width: 15px; height: 15px;" viewBox="0 -960 960 960" fill="currentColor"><path d="${options.icon}"/></svg>`,
			}).addClass(stylesLabelListItem.iconLabel);
			this.elementLabel.prepend(iconElement);
		}
	}

	toString(): string {
		return `[${TextListItem.name}#${this.componentId}]: '${this.elementLabel.text()}'`;
	}

	addChildHead(child: UiComponentInterface): this {
		this.head.addChild(child);
		return this;
	}
	addChildrenHead(children?: Iterable<UiComponentInterface>): this {
		for (const child of children ?? []) {
			this.head.addChild(child);
		}
		return this;
	}
}
