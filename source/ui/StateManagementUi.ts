import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { redirectErrorsToConsole } from "@oliversalzburg/js-utils/errors/console.js";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import { type Locale, de, enUS, he, zhCN } from "date-fns/locale";
import { Engine, type EngineState, type SupportedLocale } from "../Engine.js";
import { KittenScientists } from "../KittenScientists.js";
import { Icons } from "../images/Icons.js";
import type { SettingOptions } from "../settings/Settings.js";
import type { StateSettings } from "../settings/StateSettings.js";
import { Unique } from "../tools/Entries.js";
import { cl } from "../tools/Log.js";
import { SavegameLoader } from "../tools/SavegameLoader.js";
import type { KGSaveData } from "../types/_save.js";
import { Button } from "./components/Button.js";
import { ButtonListItem } from "./components/ButtonListItem.js";
import { Container } from "./components/Container.js";
import { Delimiter } from "./components/Delimiter.js";
import { HeaderListItem } from "./components/HeaderListItem.js";
import { IconButton } from "./components/IconButton.js";
import { LabelListItem } from "./components/LabelListItem.js";
import stylesLabelListItem from "./components/LabelListItem.module.css";
import { ListItem } from "./components/ListItem.js";
import { SettingListItem } from "./components/SettingListItem.js";
import stylesSettingListItem from "./components/SettingListItem.module.css";
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
    locale: SettingOptions<SupportedLocale>,
  ) {
    const label = host.engine.i18n("state.title");
    super(
      host,
      settings,
      new LabelListItem(host, label, {
        childrenHead: [
          new Container(host, {
            classes: [stylesLabelListItem.fillSpace],
          }),
        ],
        classes: [stylesSettingListItem.checked, stylesSettingListItem.setting],
        icon: Icons.State,
      }),
    );

    this.gameList = new SettingsList(host, {
      hasEnableAll: false,
      hasDisableAll: false,
    });
    this.stateList = new SettingsList(host, {
      hasEnableAll: false,
      hasDisableAll: false,
    });

    this.locale =
      locale.selected === "zh-CN"
        ? zhCN
        : locale.selected === "he-IL"
          ? he
          : locale.selected === "de-DE"
            ? de
            : enUS;

    this.addChild(
      new SettingsList(host, {
        children: [
          new SettingListItem(host, this.setting.noConfirm, host.engine.i18n("state.noConfirm")),
          new ListItem(host, { children: [new Delimiter(host)] }),

          new HeaderListItem(host, host.engine.i18n("state.local")),
          new ToolbarListItem(host, [
            new Button(host, host.engine.i18n("state.import"), Icons.Import, {
              onClick: () => {
                this.import();
              },
              title: host.engine.i18n("state.importTitle"),
            }),
          ]),
          new ListItem(host, { children: [new Delimiter(host)] }),

          new HeaderListItem(host, host.engine.i18n("state.localStates")),
          new ToolbarListItem(host, [
            new Button(host, host.engine.i18n("state.store"), Icons.SaveAs, {
              onClick: () => {
                this.storeState();
              },
              title: host.engine.i18n("state.storeState"),
            }),
            new Button(host, host.engine.i18n("copy"), Icons.Copy, {
              onClick: () => {
                this.copyState().catch(redirectErrorsToConsole(console));
                host.engine.imessage("state.copied.stateCurrent");
              },
              title: host.engine.i18n("state.copy.stateCurrent"),
            }),
            new Button(host, host.engine.i18n("state.new"), Icons.Draft, {
              onClick: () => {
                this.storeStateFactoryDefaults();
                host.engine.imessage("state.stored.state");
              },
              title: host.engine.i18n("state.storeFactory"),
            }),
            new Button(host, host.engine.i18n("state.exportAll"), Icons.Sync, {
              onClick: () => {
                this.exportStateAll();
              },
              title: host.engine.i18n("state.exportAllTitle"),
            }),
          ]),
          new ListItem(host, { children: [this.stateList] }),
          new ListItem(host, { children: [new Delimiter(host)] }),

          new HeaderListItem(host, host.engine.i18n("state.localGames")),
          new ToolbarListItem(host, [
            new Button(host, host.engine.i18n("state.store"), Icons.SaveAs, {
              onClick: () => {
                this.storeGame();
                host.engine.imessage("state.stored.game");
              },
              title: host.engine.i18n("state.storeGame"),
            }),
            new Button(host, host.engine.i18n("copy"), Icons.Copy, {
              onClick: () => {
                this.copyGame().catch(redirectErrorsToConsole(console));
                host.engine.imessage("state.copied.gameCurrent");
              },
              title: host.engine.i18n("state.copy.gameCurrent"),
            }),
          ]),
          new ListItem(host, { children: [this.gameList] }),
          new SettingListItem(host, this.setting.compress, host.engine.i18n("state.compress")),
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
      console.error(cl(error));
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
      console.error(cl(error));
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
                  new Container(this._host, { classes: [stylesLabelListItem.fillSpace] }),
                  new IconButton(
                    this._host,
                    Icons.Save,
                    this._host.engine.i18n("state.update.game"),
                    {
                      onClick: () => {
                        this.updateGame(gameSlot, this._host.game.save());
                        this._host.engine.imessage("state.updated.game", [game.label]);
                      },
                    },
                  ),
                  new IconButton(
                    this._host,
                    Icons.Edit,
                    this._host.engine.i18n("state.edit.game"),
                    {
                      onClick: () => {
                        this.storeGame(game.game);
                        this.deleteGame(gameSlot, true);
                        this._host.engine.imessage("state.updated.game", [game.label]);
                      },
                    },
                  ),
                  new IconButton(
                    this._host,
                    Icons.Copy,
                    this._host.engine.i18n("state.copy.game"),
                    {
                      onClick: () => {
                        this.copyGame(game.game).catch(redirectErrorsToConsole(console));
                        this._host.engine.imessage("state.copied.game", [game.label]);
                      },
                    },
                  ),
                  new IconButton(
                    this._host,
                    Icons.Delete,
                    this._host.engine.i18n("state.delete.game"),
                    {
                      onClick: () => {
                        this.deleteGame(gameSlot);
                        this._host.engine.imessage("state.deleted.game", [game.label]);
                      },
                    },
                  ),
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
                  new Container(this._host, { classes: [stylesLabelListItem.fillSpace] }),
                  new IconButton(
                    this._host,
                    Icons.Save,
                    this._host.engine.i18n("state.update.state"),
                    {
                      onClick: () => {
                        this.updateState(stateSlot, this._host.engine.stateSerialize());
                        this._host.engine.imessage("state.updated.state", [state.label]);
                      },
                    },
                  ),
                  new IconButton(
                    this._host,
                    Icons.Edit,
                    this._host.engine.i18n("state.edit.state"),
                    {
                      onClick: () => {
                        this.storeState(state.state);
                        this.deleteState(stateSlot, true);
                        this._host.engine.imessage("state.updated.state", [state.label]);
                      },
                    },
                  ),
                  new IconButton(
                    this._host,
                    Icons.Copy,
                    this._host.engine.i18n("state.copy.state"),
                    {
                      onClick: () => {
                        this.copyState(state.state).catch(redirectErrorsToConsole(console));
                        this._host.engine.imessage("state.copied.state", [state.label]);
                      },
                    },
                  ),
                  new IconButton(
                    this._host,
                    Icons.Delete,
                    this._host.engine.i18n("state.delete.state"),
                    {
                      onClick: () => {
                        this.deleteState(stateSlot);
                        this._host.engine.imessage("state.deleted.state", [state.label]);
                      },
                    },
                  ),
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
    let subjectData: KGSaveData;
    try {
      subjectData = JSON.parse(input) as KGSaveData;
    } catch (_error) {
      /* expected, as we assume compressed input */
      const uncompressed = this._host.game.decompressLZData(input);
      subjectData = JSON.parse(uncompressed) as KGSaveData;
    }

    // If game contains KS settings, import those separately.
    let stateLabel: string | undefined;
    if ("ks" in subjectData && !isNil(subjectData.ks)) {
      const state = subjectData.ks.state[0];
      stateLabel = this.storeState(state) ?? undefined;
      this._host.engine.imessage("state.imported.state");
      subjectData.ks = undefined;
    }

    this.storeGame(subjectData, stateLabel);
    this._host.engine.imessage("state.imported.game");
  }

  storeGame(game?: KGSaveData, label?: string): string | null {
    let gameLabel = label;

    if (isNil(gameLabel)) {
      gameLabel = window.prompt(this._host.engine.i18n("state.storeGame.prompt")) ?? undefined;
    }

    if (isNil(gameLabel)) {
      return null;
    }

    // Normalize empty string to "no label".
    gameLabel =
      (gameLabel === "" ? undefined : gameLabel) ?? this._host.engine.i18n("state.unlabeledGame");

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

    return gameLabel;
  }

  storeState(state?: EngineState, label?: string): string | null {
    let stateLabel = label;

    if (isNil(stateLabel)) {
      stateLabel = window.prompt(this._host.engine.i18n("state.storeState.prompt")) ?? undefined;
    }

    if (isNil(stateLabel)) {
      return null;
    }

    // Normalize empty string to "no label".
    stateLabel =
      (stateLabel === "" ? undefined : stateLabel) ??
      this._host.engine.i18n("state.unlabeledState");

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

    return stateLabel;
  }

  storeStateFactoryDefaults() {
    this.storeState(Engine.DEFAULT_STATE);
  }

  storeAutoSave(state: EngineState) {
    const existing = this.states.find(state => state.unwrap().label === "Auto-Save");
    if (!isNil(existing)) {
      console.info(cl("Updating existing Auto-Save..."));
      existing.replace({
        ...existing.unwrap(),
        state,
        timestamp: new Date().toISOString(),
      });

      this._storeStates();
      this.refreshUi();

      return;
    }

    console.info(cl("Storing new Auto-Save..."));
    this.storeState(state, "Auto-Save");
  }

  exportStateAll() {
    const statesJson = this.states
      .map(state => state.unwrap())
      .map(state => ({
        label: state.label,
        state: KittenScientists.encodeSettings(state.state, false),
        timestamp: state.timestamp,
      }))
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

  loadAutoSave() {
    if (this._host.engine.isLoaded) {
      console.info(cl("Not attempting to load Auto-Save, because a state is already loaded."));
      return;
    }

    const existing = this.states.find(state => state.unwrap().label === "Auto-Save");
    if (isNil(existing)) {
      console.info(cl("No Auto-Save settings found."));
      return;
    }

    console.info(cl("Loading Auto-Save..."));
    this._host.engine.stateLoad(existing.unwrap().state, false);
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
