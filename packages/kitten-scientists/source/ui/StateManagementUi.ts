import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { redirectErrorsToConsole } from "@oliversalzburg/js-utils/errors/console.js";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import { Locale, de, enUS, he, zhCN } from "date-fns/locale";
import { Engine, EngineState, SupportedLanguage } from "../Engine.js";
import { KittenScientists } from "../KittenScientists.js";
import { Icons } from "../images/Icons.js";
import { SettingOptions } from "../settings/Settings.js";
import { StateSettings } from "../settings/StateSettings.js";
import { Unique } from "../tools/Entries.js";
import { cerror } from "../tools/Log.js";
import { SavegameLoader } from "../tools/SavegameLoader.js";
import { KGSaveData } from "../types/index.js";
import { Button } from "./components/Button.js";
import { ButtonListItem } from "./components/ButtonListItem.js";
import { Delimiter } from "./components/Delimiter.js";
import { HeaderListItem } from "./components/HeaderListItem.js";
import { IconButton } from "./components/IconButton.js";
import { LabelListItem } from "./components/LabelListItem.js";
import { SettingListItem } from "./components/SettingListItem.js";
import { SettingsList } from "./components/SettingsList.js";
import { SettingsPanel } from "./components/SettingsPanel.js";
import { TextButton } from "./components/TextButton.js";
import { ToolbarListItem } from "./components/ToolbarListItem.js";

export type StoredGame = {
  label: string;
  game: KGSaveData;
  timestamp: string;
};
export type StoredState = {
  label: string;
  state: EngineState;
  timestamp: string;
};

export class StateManagementUi extends SettingsPanel<StateSettings> {
  readonly games = new Array<Unique<StoredGame>>();

  /**
   * The states persisted to local storage. They use Unique<T> so that when we
   * provide a state to the engine to load or get a state from the engine to
   * save, we are not accidentally sharing a reference to a live object.
   */
  readonly states = new Array<Unique<StoredState>>();

  readonly gameList: SettingsList;
  readonly stateList: SettingsList;
  readonly locale: Locale;

  constructor(
    host: KittenScientists,
    settings: StateSettings,
    language: SettingOptions<SupportedLanguage>,
  ) {
    const label = host.engine.i18n("state.title");
    super(host, label, settings, {
      settingItem: new LabelListItem(host, label, { icon: Icons.State }),
    });

    this.gameList = new SettingsList(host, {
      hasEnableAll: false,
      hasDisableAll: false,
    });
    this.stateList = new SettingsList(host, {
      hasEnableAll: false,
      hasDisableAll: false,
    });

    this.locale =
      language.selected === "zh"
        ? zhCN
        : language.selected === "he"
          ? he
          : language.selected === "de"
            ? de
            : enUS;

    this.addChild(
      new SettingsList(host, {
        children: [
          new SettingListItem(
            host,
            this._host.engine.i18n("state.noConfirm"),
            this.setting.noConfirm,
          ),
          new Delimiter(host),

          new HeaderListItem(host, this._host.engine.i18n("state.local")),
          new ButtonListItem(
            host,
            new Button(host, this._host.engine.i18n("state.import"), Icons.Import, {
              onClick: () => {
                this.import();
              },
              title: this._host.engine.i18n("state.importTitle"),
            }),
          ),
          new Delimiter(host),

          new HeaderListItem(host, this._host.engine.i18n("state.localStates")),
          new ToolbarListItem(host, [
            new Button(host, this._host.engine.i18n("state.store"), Icons.SaveAs, {
              onClick: () => {
                this.storeState();
              },
              title: this._host.engine.i18n("state.storeState"),
            }),
            new Button(host, this._host.engine.i18n("state.copy"), Icons.Copy, {
              onClick: () => {
                this.copyState().catch(redirectErrorsToConsole(console));
                this._host.engine.imessage("state.copied.stateCurrent");
              },
              title: this._host.engine.i18n("state.copy.state"),
            }),
            new Button(host, this._host.engine.i18n("state.new"), Icons.Draft, {
              onClick: () => {
                this.storeStateFactoryDefaults();
                this._host.engine.imessage("state.stored.state");
              },
              title: this._host.engine.i18n("state.storeFactory"),
            }),
            new Button(host, host.engine.i18n("state.exportAll"), Icons.Sync, {
              onClick: () => {
                this.exportStateAll();
              },
              title: this._host.engine.i18n("state.exportAllTitle"),
            }),
          ]),
          this.stateList,
          new Delimiter(host),

          new HeaderListItem(host, this._host.engine.i18n("state.localGames")),
          new ToolbarListItem(host, [
            new Button(host, this._host.engine.i18n("state.store"), Icons.SaveAs, {
              onClick: () => {
                this.storeGame();
                this._host.engine.imessage("state.stored.game");
              },
              title: this._host.engine.i18n("state.storeGame"),
            }),
            new Button(host, this._host.engine.i18n("state.copy"), Icons.Copy, {
              onClick: () => {
                this.copyGame().catch(redirectErrorsToConsole(console));
                this._host.engine.imessage("state.copied.gameCurrent");
              },
              title: this._host.engine.i18n("state.copy.game"),
            }),
          ]),
          this.gameList,
          new SettingListItem(
            host,
            this._host.engine.i18n("state.compress"),
            this.setting.compress,
          ),
        ],
        hasDisableAll: false,
        hasEnableAll: false,
      }),
    );

    this._loadGames();
    this._loadStates();
  }

  private _loadGames() {
    let index = 0;
    let game = localStorage.getItem(`ks.game.${index}`);
    this.games.splice(0);
    try {
      while (!isNil(game)) {
        const gameObject = JSON.parse(game) as StoredGame;
        this.games.push(new Unique(gameObject));
        game = localStorage.getItem(`ks.game.${++index}`);
      }
    } catch (error) {
      cerror(error);
    }
  }
  private _storeGames() {
    let index = 0;
    let game = localStorage.getItem(`ks.game.${index}`);
    while (!isNil(game)) {
      localStorage.removeItem(`ks.game.${index}`);
      game = localStorage.getItem(`ks.game.${++index}`);
    }

    index = 0;
    for (const game of this.games) {
      localStorage.setItem(`ks.game.${index++}`, JSON.stringify(game));
    }
  }

  private _loadStates() {
    let stateIndex = 0;
    let state = localStorage.getItem(`ks.state.${stateIndex}`);
    this.states.splice(0);
    try {
      while (!isNil(state)) {
        const stateObject = JSON.parse(state) as StoredState;
        KittenScientists.unknownAsEngineStateOrThrow(stateObject.state);
        this.states.push(new Unique(stateObject));
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
    this._refreshGameList();
    this._refreshStateList();
  }

  private _refreshGameList() {
    this.gameList.removeChildren(this.gameList.children);
    this.gameList.addChildren(
      this.games
        .sort(
          (a, b) =>
            new Date(a.unwrap().timestamp).getTime() - new Date(b.unwrap().timestamp).getTime(),
        )
        .map(game => [game.unwrap(), game] as const)
        .map(
          ([game, gameSlot]) =>
            new ButtonListItem(
              this._host,
              new TextButton(
                this._host,
                `${game.label} (${formatDistanceToNow(new Date(game.timestamp), {
                  addSuffix: true,
                  locale: this.locale,
                })})`,
                {
                  onClick: () => {
                    this.loadGame(game.game).catch(redirectErrorsToConsole(console));
                    this._host.engine.imessage("state.loaded.game", [game.label]);
                  },
                  title: new Date(game.timestamp).toLocaleString(),
                },
              ),
              {
                children: [
                  new IconButton(this._host, Icons.Delete, this._host.engine.i18n("delete"), {
                    onClick: () => {
                      this.deleteGame(gameSlot);
                      this._host.engine.imessage("state.deleted.game", [game.label]);
                    },
                  }),
                  new IconButton(this._host, Icons.Copy, this._host.engine.i18n("copy"), {
                    onClick: () => {
                      this.copyGame(game.game).catch(redirectErrorsToConsole(console));
                      this._host.engine.imessage("state.copied.game", [game.label]);
                    },
                  }),
                  new IconButton(this._host, Icons.Edit, this._host.engine.i18n("state.edit"), {
                    onClick: () => {
                      this.storeGame(game.game);
                      this.deleteGame(gameSlot, true);
                      this._host.engine.imessage("state.updated.game", [game.label]);
                    },
                  }),
                  new IconButton(this._host, Icons.Save, this._host.engine.i18n("update"), {
                    onClick: () => {
                      this.updateGame(gameSlot, this._host.game.save());
                      this._host.engine.imessage("state.updated.game", [game.label]);
                    },
                  }),
                ],
              },
            ),
        ),
    );
  }
  private _refreshStateList() {
    this.stateList.removeChildren(this.stateList.children);
    this.stateList.addChildren(
      this.states
        .sort(
          (a, b) =>
            new Date(a.unwrap().timestamp).getTime() - new Date(b.unwrap().timestamp).getTime(),
        )
        .map(stateSlot => [stateSlot.unwrap(), stateSlot] as const)
        .map(
          ([state, stateSlot]) =>
            new ButtonListItem(
              this._host,
              new TextButton(
                this._host,
                `${state.label} (${formatDistanceToNow(new Date(state.timestamp), {
                  addSuffix: true,
                  locale: this.locale,
                })})`,
                {
                  onClick: () => {
                    this.loadState(state.state);
                    this._host.engine.imessage("state.loaded.state", [state.label]);
                  },
                  title: new Date(state.timestamp).toLocaleString(),
                },
              ),
              {
                children: [
                  new IconButton(this._host, Icons.Delete, this._host.engine.i18n("delete"), {
                    onClick: () => {
                      this.deleteState(stateSlot);
                      this._host.engine.imessage("state.deleted.state", [state.label]);
                    },
                  }),
                  new IconButton(this._host, Icons.Copy, this._host.engine.i18n("copy"), {
                    onClick: () => {
                      this.copyState(state.state).catch(redirectErrorsToConsole(console));
                      this._host.engine.imessage("state.copied.state", [state.label]);
                    },
                  }),
                  new IconButton(this._host, Icons.Edit, this._host.engine.i18n("state.edit"), {
                    onClick: () => {
                      this.storeState(state.state);
                      this.deleteState(stateSlot, true);
                      this._host.engine.imessage("state.updated.state", [state.label]);
                    },
                  }),
                  new IconButton(this._host, Icons.Save, this._host.engine.i18n("update"), {
                    onClick: () => {
                      this.updateState(stateSlot, this._host.engine.stateSerialize());
                      this._host.engine.imessage("state.updated.state", [state.label]);
                    },
                  }),
                ],
              },
            ),
        ),
    );
  }

  async copyState(state?: EngineState) {
    await this._host.copySettings(state, false);
  }

  async copyGame(game?: KGSaveData) {
    const saveData = game ?? this._host.game.save();
    const saveDataString = JSON.stringify(saveData);
    const encodedData = this.setting.compress.enabled
      ? this._host.game.compressLZData(saveDataString)
      : saveDataString;

    await window.navigator.clipboard.writeText(encodedData);
  }

  import() {
    const input = window.prompt(this._host.engine.i18n("state.loadPrompt"));
    if (isNil(input)) {
      return;
    }

    if (this._destructiveActionPrevented()) {
      return;
    }

    try {
      // decodeSettings throws if the input is not a valid engine state.
      const state = KittenScientists.decodeSettings(input);
      this.storeState(state);
      this._host.engine.imessage("state.imported.state");
      return;
    } catch (_error) {
      // Not a valid Kitten Scientists state.
    }

    // Attempt to parse as KG save.
    let subjectData;
    try {
      subjectData = JSON.parse(input) as KGSaveData;
    } catch (_error) {
      /* expected, as we assume compressed input */
      const uncompressed = this._host.game.decompressLZData(input);
      subjectData = JSON.parse(uncompressed) as KGSaveData;
    }

    // If game contains KS settings, import those separately.
    if ("ks" in subjectData && !isNil(subjectData.ks)) {
      const state = subjectData.ks.state[0];
      this.storeState(state);
      this._host.engine.imessage("state.imported.state");
      delete subjectData.ks;
    }

    this.storeGame(subjectData);
    this._host.engine.imessage("state.imported.game");
  }

  storeGame(game?: KGSaveData, label?: string) {
    let gameLabel =
      label ?? window.prompt(this._host.engine.i18n("state.storeGame.prompt")) ?? undefined;

    // Normalize empty string to "no label".
    gameLabel =
      (gameLabel === "" ? undefined : gameLabel) ?? this._host.engine.i18n("state.unlabledGame");

    // Ensure labels aren't excessively long.
    gameLabel = gameLabel.substring(0, 127);

    this.games.push(
      new Unique({
        label: gameLabel,
        game: game ?? this._host.game.save(),
        timestamp: new Date().toISOString(),
      }),
    );

    this._storeGames();
    this.refreshUi();
  }

  storeState(state?: EngineState, label?: string) {
    let stateLabel =
      label ?? window.prompt(this._host.engine.i18n("state.storeState.prompt")) ?? undefined;

    // Normalize empty string to "no label".
    stateLabel =
      (stateLabel === "" ? undefined : stateLabel) ?? this._host.engine.i18n("state.unlabledState");

    // Ensure labels aren't excessively long.
    stateLabel = stateLabel.substring(0, 127);

    this.states.push(
      new Unique({
        label: stateLabel,
        state: state ?? this._host.engine.stateSerialize(),
        timestamp: new Date().toISOString(),
      }),
    );

    this._storeStates();
    this.refreshUi();
  }

  storeStateFactoryDefaults() {
    this.storeState(Engine.DEFAULT_STATE);
  }

  exportStateAll() {
    const statesJson = this.states
      .map(state => KittenScientists.encodeSettings(state.unwrap().state, false))
      .join("\n");
    const a = document.createElement("a");
    const blob = new Blob([statesJson], { type: "application/x-ndjson" });
    const url = URL.createObjectURL(blob);
    a.setAttribute("href", url);
    a.setAttribute("download", `ks-local-states-${new Date().getTime()}.ndjson`);
    a.click();
  }

  async loadGame(game: KGSaveData) {
    if (this._destructiveActionPrevented()) {
      return;
    }

    await new SavegameLoader(this._host.game).loadRaw(game);
  }

  loadState(state: EngineState) {
    if (this._destructiveActionPrevented()) {
      return;
    }

    this._host.engine.stateLoad(state, true);
    this._host.refreshUi();
  }

  updateGame(game: Unique<StoredGame>, newGame: KGSaveData) {
    if (this._destructiveActionPrevented()) {
      return;
    }

    const label = game.unwrap().label;
    game.replace({
      label,
      game: newGame,
      timestamp: new Date().toISOString(),
    });
    this._storeGames();
    this.refreshUi();
  }

  updateState(state: Unique<StoredState>, newState: EngineState) {
    if (this._destructiveActionPrevented()) {
      return;
    }

    const label = state.unwrap().label;
    state.replace({
      label,
      state: newState,
      timestamp: new Date().toISOString(),
    });
    this._storeStates();
    this.refreshUi();
  }

  deleteGame(game: Unique<StoredGame>, force = false) {
    if (!force && this._destructiveActionPrevented()) {
      return;
    }

    const index = this.games.indexOf(game);
    if (index < 0) {
      return;
    }

    this.games.splice(index, 1);
    this._storeGames();
    this.refreshUi();
  }

  deleteState(state: Unique<StoredState>, force = false) {
    if (!force && this._destructiveActionPrevented()) {
      return;
    }

    const index = this.states.indexOf(state);
    if (index < 0) {
      return;
    }

    this.states.splice(index, 1);
    this._storeStates();
    this.refreshUi();
  }

  private _destructiveActionPrevented(): boolean {
    if (
      !this.setting.noConfirm.enabled &&
      !window.confirm(this._host.engine.i18n("state.confirmDestruction"))
    ) {
      return true;
    }

    return false;
  }
}
