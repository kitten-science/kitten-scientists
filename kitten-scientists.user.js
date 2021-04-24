// ==UserScript==
// @name        Kitten Scientists
// @namespace   http://www.reddit.com/r/kittensgame/comments/34gb2u/kitten_scientists_automation_script/
// @description Launch Kitten Scientists
// @include     *bloodrizer.ru/games/kittens/*
// @include     file:///*kitten-game*
// @include     *kittensgame.com/web/*
// @include     *kittensgame.com/beta/*
// @include     *kittensgame.com/alpha/*
// @version     1.5.0
// @grant       none
// @copyright   2015, cameroncondry
// ==/UserScript==

// ==========================================
// Begin Kitten Scientist's Automation Engine
// ==========================================

var kg_version = 'Kitten Scientists version 1.5.0';
var address = '1HDV6VEnXH9m8PJuT4eQD7v8jRnucbneaq';

// Game will be referenced in loadTest function
var game = null;
var i18ng = null;
var lang = 'en';

var run = function() {

    var i18nData = {/*snipped*/};
    
    var i18n = function(key, args) {/*snipped*/}

    var options = {/*snipped*/};

    // GameLog Modification
    // ====================

    var printoutput = function (args) {/*snipped*/};

    // Used for option change messages and other special notifications
    var message = function () {};

    var activity = function () {};

    var summary = function () {};

    var warning = function () {};

    // i18n support
    var imessage = function(key, args, t) { message(i18n(key, args), t); }
    var iactivity = function(key, args, t) { activity(i18n(key, args), t); }
    var isummary = function(key, args, t) { summary(i18n(key, args), t); }
    var iwarning = function(key, args, t) { warning(i18n(key, args), t); }

    // Core Engine for Kitten Scientists
    // =================================

    var Engine = function () {
        this.upgradeManager = new UpgradeManager();
        this.buildManager = new BuildManager();
        this.spaceManager = new SpaceManager();
        this.craftManager = new CraftManager();
        this.bulkManager = new BulkManager();
        this.tradeManager = new TradeManager();
        this.religionManager = new ReligionManager();
        this.timeManager = new TimeManager();
        this.explorationManager = new ExplorationManager();
        this.villageManager = new TabManager('Village');
        this.cacheManager = new CacheManager();
    };

    Engine.prototype = {
        upgradeManager: undefined,
        buildManager: undefined,
        spaceManager: undefined,
        craftManager: undefined,
        bulkManager: undefined,
        tradeManager: undefined,
        religionManager: undefined,
        timeManager: undefined,
        explorationManager: undefined,
        villageManager: undefined,
        cacheManager: undefined,
        loop: undefined,
        start: function (msg=true) {},
        stop: function (msg=true) {},
        iterate: async function () {},
        reset: async function () {},
        timeCtrl: function () {},
        promote: function () {},
        distribute: function () {},
        autofeed: function () {},
        crypto: function () {},
        explore: function () {},
        worship: function () {},
        _worship: function (builds) {},
        chrono: function () {},
        upgrade: function () {},
        build: function (builds) {},
        space: function () {},
        craft: function () {},
        holdFestival: function () {},
        observeStars: function () {},
        hunt: function () {},
        trade: function () {},
        miscOptions: function () {},
        // ref: https://github.com/Bioniclegenius/NummonCalc/blob/112f716e2fde9956dfe520021b0400cba7b7113e/NummonCalc.js#L490
        getBestUnicornBuilding: function () {}
    };

    // Tab Manager
    // ===========

    var TabManager = function (name) {
        this.setTab(name);
    };

    TabManager.prototype = {
        tab: undefined,
        render: function () {},
        setTab: function (name) {}
    };

    // Exploration Manager
    // ===================

    var ExplorationManager = function () {
        this.manager = new TabManager('Village');
    };

    ExplorationManager.prototype = {
        manager: undefined,
        currentCheapestNode: null,
        currentCheapestNodeValue: null,
        cheapestNodeX: null,
        cheapestNodeY: null,
        explore: function(x, y) {},
        getCheapestNode: function () {},
        getNodeValue: function (x, y){}
    };

    // Religion manager
    // ================

    var ReligionManager = function () {
        this.manager = new TabManager('Religion');
        this.crafts = new CraftManager();
        this.bulkManager = new BulkManager();
    };

    ReligionManager.prototype = {
        manager: undefined,
        crafts: undefined,
        bulkManager: undefined,
        build: function (name, variant, amount) {},
        getBuild: function (name, variant) {},
        getBuildButton: function (name, variant) {}
    };

    // Time manager
    // ============

    var TimeManager = function () {
        this.manager = new TabManager('Time');
        this.crafts = new CraftManager();
        this.bulkManager = new BulkManager();
    };

    TimeManager.prototype = {
        manager: undefined,
        crafts: undefined,
        bulkManager: undefined,
        build: function (name, variant, amount) {},
        getBuild: function (name, variant) {},
        getBuildButton: function (name, variant) {}
    };

    // Upgrade manager
    // ============

    var UpgradeManager = function () {
        this.workManager = new TabManager('Workshop');
        this.sciManager = new TabManager('Science');
        this.spaManager = new TabManager('Space');
        this.crafts = new CraftManager();
    };

    UpgradeManager.prototype = {
        manager: undefined,
        crafts: undefined,
        build: function (upgrade, variant) {},
        getBuildButton: function (upgrade, variant) {}
    };

    // Building manager
    // ================

    var BuildManager = function () {
        this.manager = new TabManager('Bonfire');
        this.crafts = new CraftManager();
        this.bulkManager = new BulkManager();
    };

    BuildManager.prototype = {
        manager: undefined,
        crafts: undefined,
        bulkManager: undefined,
        build: function (name, stage, amount) {},
        getBuild: function (name) {},
        getBuildButton: function (name, stage) {}
    };

    // Space manager
    // ================

    var SpaceManager = function () {
        this.manager = new TabManager('Space');
        this.crafts = new CraftManager();
        this.bulkManager = new BulkManager();
    };

    SpaceManager.prototype = {
        manager: undefined,
        crafts: undefined,
        bulkManager: undefined,
        build: function (name, amount) {},
        getBuild: function (name) {},
        getBuildButton: function (name) {}
    };

    // Crafting Manager
    // ================

    var CraftManager = function () {
        this.cacheManager = new CacheManager();
    };

    CraftManager.prototype = {
        craft: function (name, amount) {},
        canCraft: function (name, amount) {},
        getCraft: function (name) {},
        singleCraftPossible: function (name) {},
        getLowestCraftAmount: function (name, limited, limRat, aboveTrigger) {},
        getMaterials: function (name) {},
        getTickVal: function (res, preTrade) {},
        getAverageHunt: function() {},
        getResource: function (name) {},
        getValue: function (name) {},
        getStock: function (name) {},
        getValueAvailable: function (name, all, typeTrigger) {},
        getPotentialCatnip: function (worstWeather, pastures, aqueducts) {}
    };

    // Bulk Manager
    // ============

    var BulkManager = function () {
        this.craftManager = new CraftManager();
    };

    BulkManager.prototype = {
        craftManager: undefined,
        bulk: function (builds, metaData, trigger, source) {},
        construct: function (model, button, amount) {},
        getPriceRatio: function (data, source) {},
        singleBuildPossible: function (data, prices, priceRatio, source) {}
    };

    // Trading Manager
    // ===============

    var TradeManager = function () {
        this.craftManager = new CraftManager();
        this.manager = new TabManager('Trade');
    };

    TradeManager.prototype = {
        craftManager: undefined,
        manager: undefined,
        trade: function (name, amount) {},
        getProfitability: function (name) {},
        getAverageTrade: function (race) {},
        isValidTrade: function (item, race) {},
        getLowestTradeAmount: function (name, limited, trigConditions) {},
        getMaterials: function (name) {},
        getRace: function (name) {},
        getTradeButton: function (race) {},
        singleTradePossible: function (name) {}
    };

    // Cache Manager
    // ===============

    var CacheManager = function () {};

    CacheManager.prototype = {
        pushToCache: function (data) {},
        getResValue: function (res) {}
    };

    // ==============================
    // Configure overall page display
    // ==============================

    

    // Local Storage
    // =============

    var kittenStorageVersion = 2;

    var kittenStorage = {
        version: kittenStorageVersion,
        toggles: {},
        items: {},
        resources: {},
        triggers: {},
        reset: {
            reset: false,
            times: 0,
            paragonLastTime: 0,
            pargonTotal: 0,
            karmaLastTime: 0,
            karmaTotal: 0
        }
    };

    var initializeKittenStorage = function () {};

    var saveToKittenStorage = function () {};

    var loadFromKittenStorage = function () {};

    // Add options element
    // ===================

    var ucfirst = function (string) {};

    var roundToTwo = function (n) {};


    // Grab button labels for religion options
    var religionManager = new ReligionManager();
    for (var buildOption in options.auto.faith.items) {
        var buildItem = options.auto.faith.items[buildOption];
        var build = religionManager.getBuild(buildItem.name || buildOption, buildItem.variant);
        if (build) {
            options.auto.faith.items[buildOption].label = build.label;
        }
    }

    // Grab button labels for time options
    var timeManager = new TimeManager();
    for (var buildOption in options.auto.time.items) {
        var buildItem = options.auto.time.items[buildOption];
        var build = timeManager.getBuild(buildItem.name || buildOption, buildItem.variant);
        if (build) {
            options.auto.time.items[buildOption].label = build.label;
        }
    }

    // Grab button labels for build options
    var buildManager = new BuildManager();
    for (var buildOption in options.auto.build.items) {
        var buildItem = options.auto.build.items[buildOption];
        var build = buildManager.getBuild(buildItem.name || buildOption);
        if (build) {
            if ("stage" in buildItem) {
                options.auto.build.items[buildOption].label = build.meta.stages[buildItem.stage].label;
            } else {
                options.auto.build.items[buildOption].label = build.meta.label;
            }
        }
    }

    // Grab button labels for space options
    var spaceManager = new SpaceManager();
    for (var spaceOption in options.auto.space.items) {
        var build = spaceManager.getBuild(spaceOption);
        if (build) {
            // It's changed to label in 1.3.0.0
            var title = build.title ? build.title : build.label;
            options.auto.space.items[spaceOption].label = title;
        }
    }

    var optionsElement = $('<div/>', {id: 'ks-options', css: {marginBottom: '10px'}});
    var optionsListElement = $('<ul/>');
    var optionsTitleElement = $('<div/>', {
        css: { bottomBorder: '1px solid gray', marginBottom: '5px' },
        text: kg_version
    });

    optionsElement.append(optionsTitleElement);

    optionsListElement.append(getToggle('engine'));
    optionsListElement.append(getToggle('build'));
    optionsListElement.append(getToggle('space'));
    optionsListElement.append(getToggle('craft'));
    optionsListElement.append(getToggle('upgrade'));
    optionsListElement.append(getToggle('trade'));
    optionsListElement.append(getToggle('faith'));
    optionsListElement.append(getToggle('time'));
    optionsListElement.append(getToggle('timeCtrl'));
    optionsListElement.append(getToggle('distribute'));
    optionsListElement.append(getToggle('options'));
    optionsListElement.append(getToggle('filter'));

    // add activity button
    // ===================

    var activitySummary = {};
    var resetActivitySummary = function () { };

    var storeForSummary = function (name, amount, section) {};

    var displayActivitySummary = function () {};

    resetActivitySummary();

    var activityBox = $('<div/>', {
        id: 'activity-box',
        css: {
            display: 'inline-block',
            verticalAlign: 'top'
        }
    });

    var showActivity = $('<a/>', {
        id: 'showActivityHref',
        text: i18n('summary.show'),
        href: '#',
        css: {
            verticalAlign: 'top'
        }
    });

    showActivity.on('click', displayActivitySummary);

    activityBox.append(showActivity);

    $('#clearLog').append(activityBox);

    var messageBox = $('<div/>', {
        id: 'important-msg-box',
        class: 'dialog help',
        css: {
            display: 'none',
            width: 'auto',
            height: 'auto'
        }
    });
    var mbClose = $('<a/>', {text: i18n('ui.close'), href: '#', css: {position: 'absolute', top: '10px', right: '15px'}});
    mbClose.on('click', function () {messageBox.toggle(); });
    var mbTitle = $('<h1/>', {id: 'mb-title', text: 'test text'});
    var mbContent = $('<h1/>', {id: 'mb-content', text: 'test text'});
    messageBox.append(mbClose, mbTitle, mbContent);
    $('#gamePageContainer').append(messageBox);

    var showMessageBox = (title, content) => {
        mbTitle.html(title);
        mbContent.html(content);
        messageBox.toggle();
    }

    // Donation Button
    // ===============

    var donate = $('<li/>', {id: "ks-donate"}).append($('<a/>', {
        href: 'bitcoin:' + address + '?amount=0.00048&label=Kittens Donation',
        target: '_blank',
        text: address
    })).prepend($('<img/>', {
        css: {
            height: '15px',
            width: '15px',
            padding: '3px 4px 0 4px',
            verticalAlign: 'bottom'
        },
        src: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIgogICB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sbnM6c29kaXBvZGk9Imh0dHA6Ly9zb2RpcG9kaS5zb3VyY2Vmb3JnZS5uZXQvRFREL3NvZGlwb2RpLTAuZHRkIgogICB4bWxuczppbmtzY2FwZT0iaHR0cDovL3d3dy5pbmtzY2FwZS5vcmcvbmFtZXNwYWNlcy9pbmtzY2FwZSIKICAgdmVyc2lvbj0iMS4xIgogICB3aWR0aD0iNTEycHgiCiAgIGhlaWdodD0iNTEycHgiCiAgIHZpZXdCb3g9IjAgMCAxIDEiCiAgIHByZXNlcnZlQXNwZWN0UmF0aW89InhNaWRZTWlkIgogICBpZD0ic3ZnMiIKICAgaW5rc2NhcGU6dmVyc2lvbj0iMC40OC4yIHI5ODE5IgogICBzb2RpcG9kaTpkb2NuYW1lPSJiaXRjb2luLWxvZ28tbm9zaGFkb3cuc3ZnIj4KICA8bWV0YWRhdGEKICAgICBpZD0ibWV0YWRhdGEyMiI+CiAgICA8cmRmOlJERj4KICAgICAgPGNjOldvcmsKICAgICAgICAgcmRmOmFib3V0PSIiPgogICAgICAgIDxkYzpmb3JtYXQ+aW1hZ2Uvc3ZnK3htbDwvZGM6Zm9ybWF0PgogICAgICAgIDxkYzp0eXBlCiAgICAgICAgICAgcmRmOnJlc291cmNlPSJodHRwOi8vcHVybC5vcmcvZGMvZGNtaXR5cGUvU3RpbGxJbWFnZSIgLz4KICAgICAgICA8ZGM6dGl0bGU+PC9kYzp0aXRsZT4KICAgICAgPC9jYzpXb3JrPgogICAgPC9yZGY6UkRGPgogIDwvbWV0YWRhdGE+CiAgPHNvZGlwb2RpOm5hbWVkdmlldwogICAgIHBhZ2Vjb2xvcj0iI2ZmZmZmZiIKICAgICBib3JkZXJjb2xvcj0iIzY2NjY2NiIKICAgICBib3JkZXJvcGFjaXR5PSIxIgogICAgIG9iamVjdHRvbGVyYW5jZT0iMTAiCiAgICAgZ3JpZHRvbGVyYW5jZT0iMTAiCiAgICAgZ3VpZGV0b2xlcmFuY2U9IjEwIgogICAgIGlua3NjYXBlOnBhZ2VvcGFjaXR5PSIwIgogICAgIGlua3NjYXBlOnBhZ2VzaGFkb3c9IjIiCiAgICAgaW5rc2NhcGU6d2luZG93LXdpZHRoPSIxNDQ3IgogICAgIGlua3NjYXBlOndpbmRvdy1oZWlnaHQ9Ijg2MSIKICAgICBpZD0ibmFtZWR2aWV3MjAiCiAgICAgc2hvd2dyaWQ9ImZhbHNlIgogICAgIGlua3NjYXBlOnpvb209IjAuOTIxODc1IgogICAgIGlua3NjYXBlOmN4PSIyMTIuNTE0MzciCiAgICAgaW5rc2NhcGU6Y3k9IjIzMy4yNDYxNyIKICAgICBpbmtzY2FwZTp3aW5kb3cteD0iMCIKICAgICBpbmtzY2FwZTp3aW5kb3cteT0iMCIKICAgICBpbmtzY2FwZTp3aW5kb3ctbWF4aW1pemVkPSIwIgogICAgIGlua3NjYXBlOmN1cnJlbnQtbGF5ZXI9InN2ZzIiIC8+CiAgPCEtLSBBbmRyb2lkIGxhdW5jaGVyIGljb25zOiB2aWV3Qm94PSItMC4wNDUgLTAuMDQ1IDEuMDkgMS4wOSIgLS0+CiAgPGRlZnMKICAgICBpZD0iZGVmczQiPgogICAgPGZpbHRlcgogICAgICAgaWQ9Il9kcm9wLXNoYWRvdyIKICAgICAgIGNvbG9yLWludGVycG9sYXRpb24tZmlsdGVycz0ic1JHQiI+CiAgICAgIDxmZUdhdXNzaWFuQmx1cgogICAgICAgICBpbj0iU291cmNlQWxwaGEiCiAgICAgICAgIHJlc3VsdD0iYmx1ci1vdXQiCiAgICAgICAgIHN0ZERldmlhdGlvbj0iMSIKICAgICAgICAgaWQ9ImZlR2F1c3NpYW5CbHVyNyIgLz4KICAgICAgPGZlQmxlbmQKICAgICAgICAgaW49IlNvdXJjZUdyYXBoaWMiCiAgICAgICAgIGluMj0iYmx1ci1vdXQiCiAgICAgICAgIG1vZGU9Im5vcm1hbCIKICAgICAgICAgaWQ9ImZlQmxlbmQ5IiAvPgogICAgPC9maWx0ZXI+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIGlkPSJjb2luLWdyYWRpZW50IgogICAgICAgeDE9IjAlIgogICAgICAgeTE9IjAlIgogICAgICAgeDI9IjAlIgogICAgICAgeTI9IjEwMCUiPgogICAgICA8c3RvcAogICAgICAgICBvZmZzZXQ9IjAlIgogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojZjlhYTRiIgogICAgICAgICBpZD0ic3RvcDEyIiAvPgogICAgICA8c3RvcAogICAgICAgICBvZmZzZXQ9IjEwMCUiCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiNmNzkzMWEiCiAgICAgICAgIGlkPSJzdG9wMTQiIC8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogIDwvZGVmcz4KICA8ZwogICAgIHRyYW5zZm9ybT0ic2NhbGUoMC4wMTU2MjUpIgogICAgIGlkPSJnMTYiPgogICAgPHBhdGgKICAgICAgIGlkPSJjb2luIgogICAgICAgZD0ibSA2My4wMzU5LDM5Ljc0MSBjIC00LjI3NCwxNy4xNDMgLTIxLjYzNywyNy41NzYgLTM4Ljc4MiwyMy4zMDEgLTE3LjEzOCwtNC4yNzQgLTI3LjU3MSwtMjEuNjM4IC0yMy4yOTUsLTM4Ljc4IDQuMjcyLC0xNy4xNDUgMjEuNjM1LC0yNy41NzkgMzguNzc1LC0yMy4zMDUgMTcuMTQ0LDQuMjc0IDI3LjU3NiwyMS42NCAyMy4zMDIsMzguNzg0IHoiCiAgICAgICBzdHlsZT0iZmlsbDp1cmwoI2NvaW4tZ3JhZGllbnQpIiAvPgogICAgPHBhdGgKICAgICAgIGlkPSJzeW1ib2wiCiAgICAgICBkPSJtIDQ2LjEwMDksMjcuNDQxIGMgMC42MzcsLTQuMjU4IC0yLjYwNSwtNi41NDcgLTcuMDM4LC04LjA3NCBsIDEuNDM4LC01Ljc2OCAtMy41MTEsLTAuODc1IC0xLjQsNS42MTYgYyAtMC45MjMsLTAuMjMgLTEuODcxLC0wLjQ0NyAtMi44MTMsLTAuNjYyIGwgMS40MSwtNS42NTMgLTMuNTA5LC0wLjg3NSAtMS40MzksNS43NjYgYyAtMC43NjQsLTAuMTc0IC0xLjUxNCwtMC4zNDYgLTIuMjQyLC0wLjUyNyBsIDAuMDA0LC0wLjAxOCAtNC44NDIsLTEuMjA5IC0wLjkzNCwzLjc1IGMgMCwwIDIuNjA1LDAuNTk3IDIuNTUsMC42MzQgMS40MjIsMC4zNTUgMS42NzksMS4yOTYgMS42MzYsMi4wNDIgbCAtMS42MzgsNi41NzEgYyAwLjA5OCwwLjAyNSAwLjIyNSwwLjA2MSAwLjM2NSwwLjExNyAtMC4xMTcsLTAuMDI5IC0wLjI0MiwtMC4wNjEgLTAuMzcxLC0wLjA5MiBsIC0yLjI5Niw5LjIwNSBjIC0wLjE3NCwwLjQzMiAtMC42MTUsMS4wOCAtMS42MDksMC44MzQgMC4wMzUsMC4wNTEgLTIuNTUyLC0wLjYzNyAtMi41NTIsLTAuNjM3IGwgLTEuNzQzLDQuMDE5IDQuNTY5LDEuMTM5IGMgMC44NSwwLjIxMyAxLjY4MywwLjQzNiAyLjUwMywwLjY0NiBsIC0xLjQ1Myw1LjgzNCAzLjUwNywwLjg3NSAxLjQzOSwtNS43NzIgYyAwLjk1OCwwLjI2IDEuODg4LDAuNSAyLjc5OCwwLjcyNiBsIC0xLjQzNCw1Ljc0NSAzLjUxMSwwLjg3NSAxLjQ1MywtNS44MjMgYyA1Ljk4NywxLjEzMyAxMC40ODksMC42NzYgMTIuMzg0LC00LjczOSAxLjUyNywtNC4zNiAtMC4wNzYsLTYuODc1IC0zLjIyNiwtOC41MTUgMi4yOTQsLTAuNTI5IDQuMDIyLC0yLjAzOCA0LjQ4MywtNS4xNTUgeiBtIC04LjAyMiwxMS4yNDkgYyAtMS4wODUsNC4zNiAtOC40MjYsMi4wMDMgLTEwLjgwNiwxLjQxMiBsIDEuOTI4LC03LjcyOSBjIDIuMzgsMC41OTQgMTAuMDEyLDEuNzcgOC44NzgsNi4zMTcgeiBtIDEuMDg2LC0xMS4zMTIgYyAtMC45OSwzLjk2NiAtNy4xLDEuOTUxIC05LjA4MiwxLjQ1NyBsIDEuNzQ4LC03LjAxIGMgMS45ODIsMC40OTQgOC4zNjUsMS40MTYgNy4zMzQsNS41NTMgeiIKICAgICAgIHN0eWxlPSJmaWxsOiNmZmZmZmYiIC8+CiAgPC9nPgo8L3N2Zz4='
    }));

    // Add some padding above the donation item
    donate.css('padding', '5px');

    optionsListElement.append(donate);

    // add the options above the game log
    right.prepend(optionsElement.append(optionsListElement));

    // Initialize and set toggles for Engine
    // =====================================

    var engine = new Engine();
    var toggleEngine = $('#toggle-engine');

    toggleEngine.on('change', function () {
        if (toggleEngine.is(':checked')) {
            options.auto.engine.enabled = true;
            engine.start();
        } else {
            options.auto.engine.enabled = false;
            engine.stop();
        }
    });

    loadFromKittenStorage();

    // hack for style. 
    // If there are more UI options, split it to "updateUI"
    $('#toggle-style').trigger('change');

    if (console && console.log) console.log(kg_version + " loaded");
    game._publish("kitten_scientists/ready", kg_version);
    
    if (kittenStorage.reset && kittenStorage.reset.reset) {
        // calc paragon and karma
        kittenStorage.reset.karmaTotal += game.resPool.get('karma').value - Number(kittenStorage.reset.karmaLastTime);
        kittenStorage.reset.pargonTotal += game.resPool.get('paragon').value - Number(kittenStorage.reset.paragonLastTime);
        kittenStorage.reset.reset = false;

        // show messagebox
        showMessageBox(
            i18n('summary.time.reset.title', [kittenStorage.reset.times]),
            i18n('summary.time.reset.content', [kittenStorage.reset.karmaTotal, kittenStorage.reset.pargonTotal])
        );
        // auto start
        toggleEngine.prop('checked', true);
        toggleEngine.trigger('change');
        imessage('reset.after');
    } else {
        kittenStorage.reset = {
            reset: false,
            times: 0,
            paragonLastTime: 0,
            pargonTotal: 0,
            karmaLastTime: 0,
            karmaTotal: 0
        }
    }
    saveToKittenStorage();

}

var loadTest = function() {
    if (typeof gamePage === 'undefined') {
        // Test if kittens game is already loaded or wait 2s and try again
        setTimeout(function(){
            loadTest();
        }, 2000);
    } else {
        // Kittens loaded, run Kitten Scientist's Automation Engine
        game = gamePage;
        i18ng = $I;
        lang = localStorage['com.nuclearunicorn.kittengame.language'] ? localStorage['com.nuclearunicorn.kittengame.language'] : lang;
        run();
    }
}

loadTest();
