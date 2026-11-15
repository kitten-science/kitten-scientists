import { UiComponent, type UiComponentOptions } from "./UiComponent.js";

export type SpanOptions = ThisType<Span> &
	UiComponentOptions & {
		readonly classes?: Array<string>;
	};

export class Span extends UiComponent {
	declare readonly options: SpanOptions;

	/**
	 * Constructs a span.
	 *
	 * @param host - A reference to the host.
	 * @param text - The text inside the span.
	 * @param options - Options for the UI element.
	 */
	constructor(parent: UiComponent, text: string, options?: SpanOptions) {
		super(parent, { ...options });

		this.element = $<HTMLSpanElement>("<span/>").text(text);

		for (const className of options?.classes ?? []) {
			this.element.addClass(className);
		}
	}

	toString(): string {
		return `[${Span.name}#${this.componentId}]`;
	}
}
