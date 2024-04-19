import { isNil } from "@oliversalzburg/js-utils/nil.js";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import { EngineState } from "../Engine.js";
import { UserScript } from "../UserScript.js";
import { Icons } from "../images/Icons.js";
import { StateSettings } from "../settings/StateSettings.js";
import { cerror } from "../tools/Log.js";
import { SavegameLoader } from "../tools/SavegameLoader.js";
import { ButtonListItem } from "./components/ButtonListItem.js";
import { HeaderListItem } from "./components/HeaderListItem.js";
import { LabelListItem } from "./components/LabelListItem.js";
import { SettingListItem } from "./components/SettingListItem.js";
import { SettingsList } from "./components/SettingsList.js";
import { SettingsPanel } from "./components/SettingsPanel.js";
import { TextButton } from "./components/TextButton.js";
import { CopyButton } from "./components/buttons-icon/CopyButton.js";
import { DeleteButton } from "./components/buttons-icon/DeleteButton.js";
import { UpdateButton } from "./components/buttons-icon/UpdateButton.js";

export type StoredState = {
  label?: string;
  state: EngineState;
  timestamp: string;
};

export class StateManagementUi extends SettingsPanel<StateSettings> {
  readonly states = new Array<StoredState>();
  readonly stateList: SettingsList;

  constructor(host: UserScript, settings: StateSettings) {
    const label = host.engine.i18n("state.title");
    super(host, label, settings, {
      settingItem: new LabelListItem(host, label, { icon: Icons.State }),
    });

    this.stateList = new SettingsList(host, {
      hasEnableAll: false,
      hasDisableAll: false,
    });

    this.addChild(
      new SettingsList(host, {
        children: [
          new SettingListItem(
            host,
            this._host.engine.i18n("state.noConfirm"),
            this.setting.noConfirm,
            { delimiter: true },
          ),

          new HeaderListItem(host, this._host.engine.i18n("state.copy")),
          new ButtonListItem(
            host,
            new TextButton(host, this._host.engine.i18n("state.ksOnly"), {
              onClick: () => void this.copySettings().catch(console.error),
              title: this._host.engine.i18n("state.ksOnlyTitleCopy"),
            }),
          ),
          new ButtonListItem(
            host,
            new TextButton(host, this._host.engine.i18n("state.kgSave"), {
              onClick: () => void this.copySaveGame().catch(console.error),
              title: this._host.engine.i18n("state.kgSaveTitleCopy"),
            }),
            { delimiter: true },
          ),
          new SettingListItem(
            host,
            this._host.engine.i18n("state.compress"),
            this.setting.compress,
            { delimiter: true },
          ),

          new HeaderListItem(host, this._host.engine.i18n("state.load")),
          new ButtonListItem(
            host,
            new TextButton(host, this._host.engine.i18n("state.ksOnly"), {
              onClick: () => this.loadSettings(),
              title: this._host.engine.i18n("state.ksOnlyTitleLoad"),
            }),
          ),
          new ButtonListItem(
            host,
            new TextButton(host, this._host.engine.i18n("state.kgSave"), {
              onClick: () => void this.loadSaveGame()?.catch(console.error),
              title: this._host.engine.i18n("state.kgSaveTitleLoad"),
            }),
            { delimiter: true },
          ),

          new HeaderListItem(host, this._host.engine.i18n("state.local")),
          new ButtonListItem(
            host,
            new TextButton(host, this._host.engine.i18n("state.storeCurrent"), {
              onClick: () => this.storeState(),
              title: this._host.engine.i18n("state.storeCurrentTitle"),
            }),
          ),
          new ButtonListItem(
            host,
            new TextButton(host, this._host.engine.i18n("state.import"), {
              onClick: () => this.importState(),
              title: this._host.engine.i18n("state.importTitle"),
            }),
            { delimiter: true },
          ),
          new ButtonListItem(
            host,
            new TextButton(host, this._host.engine.i18n("state.reset"), {
              onClick: () => this.resetState(),
              title: this._host.engine.i18n("state.resetTitle"),
            }),
            { delimiter: true },
          ),

          new HeaderListItem(host, this._host.engine.i18n("state.loadStored")),
          this.stateList,
        ],
        hasDisableAll: false,
        hasEnableAll: false,
      }),
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
        UserScript.unknownAsEngineStateOrThrow(stateObject.state);
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
    const unlabeled = this._host.engine.i18n("state.unlabled");
    for (const state of this.states) {
      const button = new TextButton(
        this._host,
        `${state.label ?? unlabeled} (${formatDistanceToNow(new Date(state.timestamp), {
          addSuffix: true,
        })})`,
        { onClick: () => this.loadState(state.state), title: state.timestamp },
      );

      const listItem = new ButtonListItem(this._host, button);

      const deleteButton = new DeleteButton(this._host);
      deleteButton.element.on("click", () => this.deleteState(state));
      listItem.addChild(deleteButton);

      const copyButton = new CopyButton(this._host);
      copyButton.element.on(
        "click",
        () => void this.copySettings(state.state).catch(console.error),
      );
      listItem.addChild(copyButton);

      const updateButton = new UpdateButton(this._host);
      updateButton.element.on(
        "click",
        () => void this.updateState(state, this._host.engine.stateSerialize()),
      );
      listItem.addChild(updateButton);

      this.stateList.addChild(listItem);
    }
  }

  async copySettings(state?: EngineState) {
    return this._host.copySettings(state, this.setting.compress.enabled);
  }

  async copySaveGame() {
    const saveData = this._host.game.save();
    const saveDataString = JSON.stringify(saveData);
    const encodedData = this.setting.compress.enabled
      ? this._host.game.compressLZData(saveDataString)
      : saveDataString;

    await window.navigator.clipboard.writeText(encodedData);

    this._host.engine.imessage("savegame.copied");
  }

  loadSettings() {
    const input = window.prompt(this._host.engine.i18n("state.loadPrompt"));
    if (isNil(input)) {
      return;
    }

    if (
      !this.setting.noConfirm.enabled &&
      !window.confirm(this._host.engine.i18n("state.confirmDestruction"))
    ) {
      return;
    }

    this._host.importSettingsFromString(input);

    this._host.engine.imessage("settings.loaded");
  }

  async loadSaveGame() {
    const input = window.prompt(this._host.engine.i18n("state.loadPromptGame"));
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
      const compressed = this._host.game.compressLZData(input);
      subjectData = compressed;
    } catch (error) {
      /* expected, as we assume compressed input */
    }

    await new SavegameLoader(this._host.game).load(subjectData);

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
    let label = window.prompt(this._host.engine.i18n("state.storeCurrent.prompt")) ?? undefined;
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
    const input = window.prompt(this._host.engine.i18n("state.paste"));
    if (isNil(input)) {
      return;
    }

    const state = UserScript.decodeSettings(input);

    this.storeState(state);
  }

  loadState(state: EngineState) {
    if (
      !this.setting.noConfirm.enabled &&
      !window.confirm(this._host.engine.i18n("state.confirmDestruction"))
    ) {
      return;
    }

    this._host.engine.stateLoad(state, true);
    this._host.refreshUi();

    this._host.engine.imessage("state.loaded");
  }

  updateState(state: StoredState, newState: EngineState) {
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

    this.states[index] = {
      label: state.label,
      state: newState,
      timestamp: new Date().toISOString(),
    };
    this._storeStates();
    this.refreshUi();

    this._host.engine.imessage("state.updated");
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
