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

    

    // add activity button
    // ===================

    var activitySummary = {};
    var resetActivitySummary = function () { };

    var storeForSummary = function (name, amount, section) {};

    var displayActivitySummary = function () {};

    resetActivitySummary();

   
    // Initialize and set toggles for Engine
    // =====================================

    var engine = new Engine();
    var toggleEngine = $("#toggle-engine");

    toggleEngine.on("change", function () {
      if (toggleEngine.is(":checked")) {
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
