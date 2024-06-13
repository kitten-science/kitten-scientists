import { EngineState } from "@kitten-science/kitten-scientists/Engine.js";
import { JsonObject } from "@oliversalzburg/js-utils/core.js";
import "@shoelace-style/shoelace/dist/components/input/input.js";
import SlInput from "@shoelace-style/shoelace/dist/components/input/input.js";
import "@shoelace-style/shoelace/dist/components/switch/switch.js";
import "@shoelace-style/shoelace/dist/components/textarea/textarea.js";
import "@shoelace-style/shoelace/dist/components/tree-item/tree-item.js";
import "@shoelace-style/shoelace/dist/components/tree/tree.js";
import { LitElement, css, html } from "lit";
import { TemplateResult } from "lit-html";
import { customElement, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { when } from "lit/directives/when.js";
import { StateLoader } from "./StateLoader.js";

@customElement("ks-snapshot-analyzer")
export class SnapshotAnalyzer extends LitElement {
  private _snapshotInput = "";
  @state()
  private _snapshot: EngineState | null = null;
  private _snapshotRoot: EngineState | null = null;

  static get styles() {
    return css`
      .tree-item::part(label) {
        flex: 1;
        gap: 1em;
      }
      .label {
        flex: 1;

        &.from-root {
          font-weight: bold;
        }
      }
      .spacer {
        flex: 1;
      }
      .input {
        flex: 1;
        max-width: 50vw;
      }
    `;
  }

  render() {
    return [
      html`<sl-input
          type="text"
          placeholder="Paste KS settings export here."
          value="${this._snapshotInput}"
          @sl-change="${this.onInputChanged}"
        ></sl-input
        >${when(
          this._snapshot !== null,
          () =>
            html`<sl-tree
              >${this._iterateSnapshotBranch(
                this._snapshot as unknown as Record<string, JsonObject>,
                this._snapshotRoot as unknown as Record<string, JsonObject>,
              )}</sl-tree
            >`,
        )}`,
    ];
  }

  private _iterateSnapshotBranch(
    branch: string | Record<string, JsonObject>,
    branchRoot: string | Record<string, JsonObject> | undefined,
  ): Array<TemplateResult> | undefined {
    if (typeof branch !== "object") {
      return undefined;
    }

    const entries = Object.entries(branch);
    if (entries.length === 0) {
      return undefined;
    }

    return entries.map(
      ([key, value]) =>
        html`<sl-tree-item class="tree-item">
          ${typeof value === "string"
            ? html`<span
                  class="${classMap({
                    label: true,
                    "from-root": Boolean(
                      branchRoot && key in (branchRoot as Record<string, JsonObject>),
                    ),
                  })}"
                  >${key}</span
                ><sl-input class="input" value="${value}" readonly size="small"></sl-input>`
            : typeof value === "number"
              ? html`<span
                    class="${classMap({
                      label: true,
                      "from-root": Boolean(
                        branchRoot && key in (branchRoot as Record<string, JsonObject>),
                      ),
                    })}"
                    >${key}</span
                  ><span class="spacer"></span>
                  <sl-input
                    class="input"
                    type="number"
                    value="${value}"
                    readonly
                    size="small"
                  ></sl-input>`
              : typeof value === "boolean"
                ? html`<span
                      class="${classMap({
                        label: true,
                        "from-root": Boolean(
                          branchRoot && key in (branchRoot as Record<string, JsonObject>),
                        ),
                      })}"
                      >${key}</span
                    ><span class="spacer"></span
                    ><sl-switch ?checked=${value} disabled size="small"></sl-switch>`
                : html`<span
                      class="${classMap({
                        label: true,
                        "from-root": Boolean(
                          branchRoot && key in (branchRoot as Record<string, JsonObject>),
                        ),
                      })}"
                      >${key}</span
                    >${this._iterateSnapshotBranch(
                      value as string | Record<string, JsonObject>,
                      branchRoot
                        ? ((branchRoot as Record<string, JsonObject>)[key] as
                            | string
                            | Record<string, JsonObject>)
                        : undefined,
                    )}`}
        </sl-tree-item>`,
    );
  }

  onInputChanged = async (event: Event) => {
    this._snapshotInput = (event.target as SlInput).value;

    try {
      const anything = await new StateLoader().loadAnything(this._snapshotInput);
      this._snapshot = anything.engineState;
      this._snapshotRoot = anything.engineStateRoot as EngineState;
    } catch (_error) {
      this._snapshot = null;
    }

    /*
    try {
      // Pre-decompress
      const decompressed = decompressFromBase64(this._snapshotInput);
      this._snapshot = UserScript.decodeSettings(decompressed);
      //input.setCustomValidity("");
    } catch (error) {
      console.debug(error);
      //input.setCustomValidity("Invalid KS state");
    }
    */
  };
}
