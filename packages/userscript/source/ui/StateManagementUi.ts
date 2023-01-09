import { formatDistanceToNow } from "date-fns";
import { EngineState } from "../Engine";
import { Icons } from "../images/Icons";
import { StateSettings } from "../settings/StateSettings";
import { cerror } from "../tools/Log";
import { isNil } from "../tools/Maybe";
import { SavegameLoader } from "../tools/SavegameLoader";
import { UserScript } from "../UserScript";
import { ButtonListItem } from "./components/ButtonListItem";
import { CopyButton } from "./components/buttons-icon/CopyButton";
import { DeleteButton } from "./components/buttons-icon/DeleteButton";
import { ExplainerListItem } from "./components/ExplainerListItem";
import { HeaderListItem } from "./components/HeaderListItem";
import { LabelListItem } from "./components/LabelListItem";
import { SettingListItem } from "./components/SettingListItem";
import { SettingsList } from "./components/SettingsList";
import { SettingsPanel } from "./components/SettingsPanel";
import { TextButton } from "./components/TextButton";

export type StoredState = {
  label?: string;
  state: EngineState;
  timestamp: string;
};

export class StateManagementUi extends SettingsPanel<StateSettings> {
  readonly states = new Array<StoredState>();
  readonly stateList: SettingsList;

  constructor(host: UserScript, settings: StateSettings) {
    super(host, "State Management", settings, {
      settingItem: new LabelListItem(host, "State Management", { icon: Icons.State }),
    });

    this.stateList = new SettingsList(host, {
      hasEnableAll: false,
      hasDisableAll: false,
    });

    this.addChild(
      new SettingsList(host, {
        children: [
          new ExplainerListItem(
            host,
            "This is highly experimental.\nAbsolutely BACKUP YOUR GAME before even looking at anything here, or you will regret it!"
          ),
          new SettingListItem(
            host,
            "Do NOT confirm destructive actions. (Danger!)",
            this.setting.noConfirm,
            { delimiter: true }
          ),

          new HeaderListItem(host, "Copy to clipboard"),
          new ButtonListItem(
            host,
            new TextButton(host, "KS settings only", {
              onClick: () => void this.copySettings().catch(console.error),
              title: "Copy only the settings of Kitten Scientists",
            })
          ),
          new ButtonListItem(
            host,
            new TextButton(host, "KG save game", {
              onClick: () => void this.copySaveGame().catch(console.error),
              title: "Copy the entire Kittens Game save.",
            }),
            { delimiter: true }
          ),
          new SettingListItem(host, "Compress data", this.setting.compress, { delimiter: true }),

          new HeaderListItem(host, "Load from clipboard"),
          new ButtonListItem(
            host,
            new TextButton(host, "KS settings only", {
              onClick: () => this.loadSettings(),
              title: "Load only the settings of Kitten Scientists",
            })
          ),
          new ButtonListItem(
            host,
            new TextButton(host, "KG save game", {
              onClick: () => void this.loadSaveGame()?.catch(console.error),
              title: "Load an entire Kittens Game save.",
            }),
            { delimiter: true }
          ),

          new HeaderListItem(host, "Local states"),
          new ButtonListItem(
            host,
            new TextButton(host, "Store current", {
              onClick: () => this.storeState(),
              title: "Create a new state snapshot.",
            })
          ),
          new ButtonListItem(
            host,
            new TextButton(host, "Import from clipboard", {
              onClick: () => this.importState(),
              title: "Store a state that you have in your clipboard.",
            }),
            { delimiter: true }
          ),
          new ButtonListItem(
            host,
            new TextButton(host, "Reset to factory defaults", {
              onClick: () => this.resetState(),
              title: "Reset absolutely all KS settings to factory defaults.",
            }),
            { delimiter: true }
          ),

          new HeaderListItem(host, "Load stored state"),
          this.stateList,
        ],
        hasDisableAll: false,
        hasEnableAll: false,
      })
    );

    this._loadStates();
  }

  private _loadStates() {
    let stateIndex = 0;
    let state = localStorage.getItem(`ks.state.${stateIndex}`);
    this.states.splice(0);
    try {
      while (!isNil(state)) {
        const stateObject = JSON.parse(state) as StoredState;
        this._host.unknownAsEngineStateOrThrow(stateObject.state);
        this.states.push(stateObject);
        state = localStorage.getItem(`ks.state.${++stateIndex}`);
      }
    } catch (error) {
      cerror(error);
    }
  }
  private _storeStates() {
    let stateIndex = 0;
    let state = localStorage.getItem(`ks.state.${stateIndex}`);
    while (!isNil(state)) {
      localStorage.removeItem(`ks.state.${stateIndex}`);
      state = localStorage.getItem(`ks.state.${++stateIndex}`);
    }

    stateIndex = 0;
    for (const state of this.states) {
      localStorage.setItem(`ks.state.${stateIndex++}`, JSON.stringify(state));
    }
  }

  refreshUi(): void {
    super.refreshUi();

    this.stateList.removeChildren(this.stateList.children);
    for (const state of this.states) {
      const button = new TextButton(
        this._host,
        `${state.label ?? "unlabeled state"} (${formatDistanceToNow(new Date(state.timestamp), {
          addSuffix: true,
        })})`,
        { onClick: () => this.loadState(state.state), title: state.timestamp }
      );

      const listItem = new ButtonListItem(this._host, button);

      const deleteButton = new DeleteButton(this._host);
      deleteButton.element.on("click", () => this.deleteState(state));
      listItem.addChild(deleteButton);

      const copyButton = new CopyButton(this._host);
      copyButton.element.on(
        "click",
        () => void this.copySettings(state.state).catch(console.error)
      );
      listItem.addChild(copyButton);

      this.stateList.addChild(listItem);
    }
  }

  async copySettings(state?: EngineState) {
    return this._host.copySettings(state, this.setting.compress.enabled);
  }

  async copySaveGame() {
    const saveData = this._host.gamePage.save();
    const saveDataString = JSON.stringify(saveData);
    const encodedData = this.setting.compress.enabled
      ? this._host.gamePage.compressLZData(saveDataString)
      : saveDataString;

    await window.navigator.clipboard.writeText(encodedData);

    this._host.engine.imessage("savegame.copied");
  }

  loadSettings() {
    const input = window.prompt(
      "Your current settings will be replaced!\nPaste your settings here:"
    );
    if (isNil(input)) {
      return;
    }

    if (
      !this.setting.noConfirm.enabled &&
      !window.confirm(this._host.engine.i18n("state.confirmDestruction"))
    ) {
      return;
    }

    this._host.importSettings(input);

    this._host.engine.imessage("settings.loaded");
  }

  async loadSaveGame() {
    const input = window.prompt(
      "⚠ YOU WILL LOSE YOUR CURRENT SAVE IF YOU DO THIS! ⚠\nPaste your (un/compressed) savegame here:"
    );
    if (isNil(input)) {
      return;
    }

    if (
      !this.setting.noConfirm.enabled &&
      !window.confirm(this._host.engine.i18n("state.confirmDestruction"))
    ) {
      return;
    }

    let subjectData = input;
    try {
      JSON.parse(input) as Record<string, unknown>;
      // No parser exception? This is plain JSON. We need to compress it for the savegame loader.
      const compressed = this._host.gamePage.compressLZData(input);
      subjectData = compressed;
    } catch (error) {
      /* expected, as we assume compressed input */
    }

    await new SavegameLoader(this._host.gamePage).load(subjectData);

    this._host.engine.imessage("savegame.loaded");
  }

  resetState() {
    if (
      !this.setting.noConfirm.enabled &&
      !window.confirm(this._host.engine.i18n("state.confirmDestruction"))
    ) {
      return;
    }

    this._host.engine.stateReset();
    this._host.refreshUi();
  }

  storeState(state?: EngineState) {
    let label = window.prompt("Label for this state") ?? undefined;
    // Normalize empty string to "no label".
    label = label === "" ? undefined : label;

    // Ensure labels aren't excessively long.
    if (!isNil(label)) {
      label = label.substring(0, 127);
    }

    this.states.push({
      label,
      state: state ?? this._host.engine.stateSerialize(),
      timestamp: new Date().toISOString(),
    });

    this._storeStates();

    this.refreshUi();
  }

  importState() {
    const input = window.prompt("Paste your (un/compressed) settings here :");
    if (isNil(input)) {
      return;
    }

    const state = this._host.decodeSettings(input);

    this.storeState(state);
  }

  loadState(state: EngineState) {
    if (
      !this.setting.noConfirm.enabled &&
      !window.confirm(this._host.engine.i18n("state.confirmDestruction"))
    ) {
      return;
    }

    this._host.engine.stateLoad(state);
    this._host.refreshUi();

    this._host.engine.imessage("state.loaded");
  }

  deleteState(state: StoredState) {
    if (
      !this.setting.noConfirm.enabled &&
      !window.confirm(this._host.engine.i18n("state.confirmDestruction"))
    ) {
      return;
    }

    const index = this.states.indexOf(state);
    if (index < 0) {
      return;
    }

    this.states.splice(index, 1);
    this._storeStates();
    this.refreshUi();

    this._host.engine.imessage("state.deleted");
  }
}
