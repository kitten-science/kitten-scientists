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

    var i18nData = {
        'en': {
            'option.observe': 'Observe Astro Events',
            'option.festival': 'Hold Festivals',
            'option.praise': 'Auto Praise',
            'option.shipOverride': 'Force Ships to 243',
            'option.autofeed': 'Feed Leviathans',
            'option.hunt': 'Hunt',
            'option.crypto': 'Trade Blackcoin',
            'option.embassies': 'Build Embassies (Beta)',
            'option.explore': 'Explore (Deprecated)',
            'option.style': 'View Full Width',
            'option.steamworks': 'Turn on Steamworks',

            'filter.build': 'Building',
            'filter.craft': 'Crafting',
            'filter.upgrade': 'Upgrading',
            'filter.research': 'Researching',
            'filter.trade': 'Trading',
            'filter.hunt': 'Hunting',
            'filter.praise': 'Praising',
            'filter.faith': 'Order of the Sun',
            'filter.festival': 'Festivals',
            'filter.star': 'Astronomical Events',
            'filter.misc': 'Miscellaneous',

            'dispose.necrocorn': 'Kittens disposed of inefficient necrocorns',
            'blackcoin.buy': 'Kittens sold your Relics and bought {0} Blackcoins',
            'blackcoin.sell': 'Kittens sold your Blackcoins and bought {0} Relics',
            'act.explore': 'Your kittens started exploring node {0}-{1} of the map.',
            'act.feed': 'Kittens fed the Elders. The elders are pleased',
            'act.observe': 'Kitten Scientists have observed a star',
            'act.hunt': 'Sent kittens on {0} hunts',
            'act.build': 'Kittens have built a new {0}',
            'act.builds': 'Kittens have built a new {0} {1} times.',
            'act.craft': 'Kittens have crafted {0} {1}',
            'act.trade': 'Kittens have traded {0}x with {1}',

            'upgrade.space.mission': 'Kittens conducted a mission to {0}',
            'upgrade.space': 'Kittens conducted a {0}',
            'upgrade.race': 'Kittens met the {0}',
            'upgrade.building.pasture': 'Upgraded pastures to solar farms!',
            'upgrade.building.aqueduct': 'Upgraded aqueducts to hydro plants!',
            'upgrade.building.library': 'Upgraded libraries to data centers!',
            'upgrade.building.amphitheatre': 'Upgraded amphitheatres to broadcast towers!',
            'upgrade.upgrade': 'Kittens have bought the upgrade {0}',
            'upgrade.tech': 'Kittens have bought the tech {0}',

            'festival.hold': 'Kittens begin holding a festival',
            'festival.extend': 'Kittens extend the festival',

            'build.embassy': 'Built {0} embassy for {1}',
            'build.embassies': 'Built {0} embassies for {1}',

            'act.praise': 'Praised the sun! Accumulated {0} faith to {1} worship',
            'act.sun.discover': 'Kittens have discovered {0}',
            'act.sun.discovers': 'Kittens have discovered {0} {1} times.',

            'ui.items': 'items',
            'ui.disable.all': 'disable all',
            'ui.enable.all': 'enable all',
            'ui.craft.resources': 'resources',
            'ui.trigger': 'trigger',
            'ui.trigger.set': 'Enter a new trigger value for {0}. Should be in the range of 0 to 1.',
            'ui.limit': 'Limited',
            'ui.trigger.crypto.set': 'Enter a new trigger value for {0}. Corresponds to the amount of Relics needed before the exchange is made.',
            'ui.engine':'Enable Scientists',
            'ui.build': 'Bonfire',
            'ui.space': 'Space',
            'ui.craft': 'Crafting',
            'ui.upgrade': 'Unlocking',
            'ui.trade': 'Trading',
            'ui.faith': 'Religion',
            'ui.time': 'Time',
            'ui.options': 'Options',
            'ui.filter': 'Filters',
            'ui.distribute': 'Kitten Resources',
            'ui.max': 'Max: {0}',

            'ui.upgrade.upgrades': 'Upgrades',
            'ui.upgrade.techs': 'Techs',
            'ui.upgrade.races': 'Races',
            'ui.upgrade.missions': 'Missions',
            'ui.upgrade.buildings': 'Buildings',
            
            'ui.faith.addtion': 'addition',
            'option.faith.best.unicorn': 'Build Best Unicorn Building First',
            'option.faith.best.unicorn.desc': 'Include auto Sacrifice Unicorns if tears are not enough to build the best unicorn building',
            'option.faith.transcend': 'Auto Transcend',
            'act.transcend': 'Spend {0} epiphany, Transcend to T-level: {1}',
            'summary.transcend': 'Transcend {0} times',
            'filter.transcend': 'Transcend',
            'option.faith.adore': 'Auto Adore the Galaxy',
            'act.adore': 'Adore the galaxy! Accumulated {0} worship to {1} epiphany',
            'summary.adore': 'Accumulated {0} epiphany by adore the galaxy',
            'filter.adore': 'Adoring',
            'adore.trigger.set': 'Enter a new trigger value for AutoAdore. Should be in the range of 0 to 1.\nKS will AutoAdore if the Solor Revolutuin Bonus brought by praising the sun once after adore can reach the trigger of maximum.\n\nNote: The solar revolution bonus will diminish after reaching 75% of the maximum.',

            'resources.add': 'add resources',
            'resources.clear.unused': 'clear unused',
            'resources.stock': 'Stock: {0}',
            'resources.consume': 'Comsume: {0}',
            'resources.del': 'del',
            'resources.stock.set': 'Stock for {0}',
            'resources.consume.set': 'Consume rate for {0}',
            'resources.del.confirm': 'Delete resource controls for {0}?',

            'status.ks.enable': 'Enabling the kitten scientists!',
            'status.ks.disable': 'Disabling the kitten scientists!',
            'status.sub.enable': 'Enabled {0}',
            'status.auto.enable': 'Enable Auto {0}',
            'status.sub.disable': 'Disabled {0}',
            'status.auto.disable': 'Disable Auto {0}',

            'trade.limited': 'Trading with {0}: limited to only occur when profitable based off relative production time',
            'trade.unlimited': 'Trading with {0}: unlimited',
            'trade.seasons': 'seasons',
            'trade.season.enable': 'Enabled trading with {0} in the {1}',
            'trade.season.disable': 'Disabled trading with {0} in the {1}',

            'filter.enable': 'Enable {0} Filter',
            'filter.disable': 'Disabled {0} Filter',

            'craft.limited': 'Crafting {0}: limited to be proportional to cost ratio',
            'craft.unlimited': 'Crafting {0}: unlimited',

            'distribute.limited': 'Distribute to {0}: stop when reach max',
            'distribute.unlimited': 'Distribute to {0}: unlimited',
            'act.distribute': 'Distribute a kitten to {0}',
            'ui.max.set': 'Maximum for {0}',
            'summary.distribute': 'Help {0} kittens to find job',
            'filter.distribute': 'Distribute',

            'option.promote': 'Promote Leader',
            'act.promote': 'Kittens\' leader has been promoted to rank {0}',
            'filter.promote': 'Promote leader',
            'summary.promote': 'Promoted leader {0} times',

            'ui.timeCtrl': 'Time Control',
            'option.accelerate': 'Tempus Fugit',
            'act.accelerate': 'Accelerate time!',
            'filter.accelerate': 'Tempus Fugit',
            'summary.accelerate': 'Accelerate time {0} times',
            'option.time.skip': 'Time Skip',
            'act.time.skip': 'Kittens combuste Time crystal, {0} years skiped!',
            'ui.cycles': 'cycles',
            'ui.maximum': 'Maximum',
            'time.skip.cycle.enable': 'Enable time skip in cycle {0} and allow skip over this cycle',
            'time.skip.cycle.disable': 'Disable time skip in cycle {0} and disallow skip over this cycle',
            'time.skip.season.enable': 'Enable time skip in the {0}',
            'time.skip.season.disable': 'Disable time skip in the {0}',
            'time.skip.trigger.set': 'Enter a new trigger value for Time Skip (Combust time crystal). Should be a positive integer.',
            'summary.time.skip': 'Skip {0} years',
            'filter.time.skip': 'Time Skip',
            'option.time.reset': 'Reset Timeline (Danger!)',
            'status.reset.check.enable': 'Enable check {0} before Reset Timeline',
            'status.reset.check.disable': 'Disable check {0} before Reset Timeline',
            'ui.min': 'Min: {0}',
            'reset.check.trigger.set': 'Enter a new trigger value for {0}.\n-1 meaning must build this building until exceeding resource limit.',
            'reset.check': 'Trigger for {0} : {1}, you have {2}',
            'reset.checked': 'All conditions are met, the timeline will restart in next few seconds!',
            'reset.tip': 'You can cancel this reset by disable "Kitten Scientists" or "Time Control" or "Reset Timeline"',
            'reset.countdown.10': '10 - Harvesting catnip',
            'reset.countdown.9': '&nbsp;9 - Sacrificing Unicorns',
            'reset.countdown.8': '&nbsp;8 - Releasing lizards',
            'reset.countdown.7': '&nbsp;7 - Disassembling railguns',
            'reset.countdown.6': '&nbsp;6 - Starting time engines',
            'reset.countdown.5': '&nbsp;5 - Melting blackcoins',
            'reset.countdown.4': '&nbsp;4 - Turning off satellite',
            'reset.countdown.3': '&nbsp;3 - Opening temporal rifts',
            'reset.countdown.2': '&nbsp;2 - Boosting the chronoforge',
            'reset.countdown.1': '&nbsp;1 - Time engine start',
            'reset.countdown.0': '&nbsp;0 - Temporal rifts opened!',
            'reset.last.message': 'See you next poincaré recurrence',
            'reset.after': 'Nice to meet you, the cute Kittens Scientists will serve you',
            'reset.cancel.message': 'Timeline Reset canceled.',
            'reset.cancel.activity': 'Meoston, We Have a Problem.',
            'summary.time.reset.title': 'Summary of the last {0} timelines',
            'summary.time.reset.content': 'Gain {0} Karma.<br>Gain {1} Paragon.',
            'ui.close': 'close',

            'option.fix.cry': 'Fix Cryochamber',
            'act.fix.cry': 'Kittens fix {0} Cryochambers',
            'summary.fix.cry': 'Fix {0} Cryochambers',

            'summary.festival': 'Held {0} festivals',
            'summary.stars': 'Observed {0} stars',
            'summary.praise': 'Accumulated {0} worship by praising the sun',
            'summary.hunt': 'Sent adorable kitten hunters on {0} hunts',
            'summary.embassy': 'Built {0} embassies',
            'summary.feed': 'Fed the elders {0} necrocorns',
            'summary.tech': 'Researched: {0}',
            'summary.upgrade': 'Upgraded: {0}',
            'summary.building': 'Built: +{0} {1}',
            'summary.sun': 'Discovered: +{0} {1}',
            'summary.craft': 'Crafted: +{0} {1}',
            'summary.trade': 'Traded: {0}x {1}',
            'summary.year': 'year',
            'summary.years': 'years',
            'summary.separator': ' and ',
            'summary.day': 'day',
            'summary.days': 'days',
            'summary.head': 'Summary of the last {0}',
            'summary.show': 'Show activity',
        },
        'zh': {
            'option.observe': '观测天文事件',
            'option.festival': '举办节日',
            'option.praise': '赞美太阳',
            'option.shipOverride': '强制243船',
            'option.autofeed': '献祭上古神',
            'option.hunt': '狩猎',
            'option.crypto': '黑币交易',
            'option.embassies': '建造大使馆 (Beta)',
            'option.explore': '探索 (废弃)',
            'option.style': '占满屏幕',
            'option.steamworks': '启动蒸汽工房',

            'filter.build': '建筑',
            'filter.craft': '工艺',
            'filter.upgrade': '升级',
            'filter.research': '研究',
            'filter.trade': '贸易',
            'filter.hunt': '狩猎',
            'filter.praise': '赞美太阳',
            'filter.faith': '太阳秩序',
            'filter.festival': '节日',
            'filter.star': '天文事件',
            'filter.misc': '杂项',

            'dispose.necrocorn': '小猫处理掉了影响效率的多余死灵兽',
            'blackcoin.buy': '小猫出售遗物并买入 {0} 黑币',
            'blackcoin.sell': '小猫出售黑币并买入了 {0} 遗物',
            'act.explore': '小猫开始探索地图上的节点 {0}-{1}',
            'act.feed': '小猫向上古神献上祭品。上古神很高兴',
            'act.observe': '小猫珂学家观测到一颗流星',
            'act.hunt': '派出 {0} 波小猫去打猎',
            'act.build': '小猫建造了一个 {0}',
            'act.builds': '小猫建造了 {1} 个新的 {0}',
            'act.craft': '小猫制作了 {0} {1}',
            'act.trade': '小猫与 {1} 交易 {0} 次',

            'upgrade.space.mission': '小猫执行了 {0} 的任务',
            'upgrade.space': '小猫执行了 {0}',
            'upgrade.race': '小猫遇到了 {0}',
            'upgrade.building.pasture': '牧场 升级为 太阳能发电站 !',
            'upgrade.building.aqueduct': '水渠 升级为 水电站 !',
            'upgrade.building.library': '图书馆 升级为 数据中心!',
            'upgrade.building.amphitheatre': '剧场 升级为 广播塔!',
            'upgrade.upgrade': '小猫发明了 {0}',
            'upgrade.tech': '小猫掌握了 {0}',

            'festival.hold': '小猫开始举办节日',
            'festival.extend': '小猫延长了节日',

            'build.embassy': '在 {1} 设立了 {0} 个大使馆',
            'build.embassies': '在 {1} 设立了 {0} 个大使馆',

            'act.praise': '赞美太阳! 转化 {0} 信仰为 {1} 虔诚',
            'act.sun.discover': '小猫在 {0} 方面获得顿悟',
            'act.sun.discovers': '小猫在 {0} 方面获得 {1} 次顿悟',

            'ui.items': '项目',
            'ui.disable.all': '全部禁用',
            'ui.enable.all': '全部启用',
            'ui.craft.resources': '资源',
            'ui.trigger': '触发条件',
            'ui.trigger.set': '输入新的 {0} 触发值，取值范围为 0 到 1 的小数。',
            'ui.limit': '限制',
            'ui.trigger.crypto.set': '输入一个新的 {0} 触发值,\n遗物数量达到触发值时会进行黑笔交易。',
            'ui.engine':'启用小猫珂学家',
            'ui.build': '营火',
            'ui.space': '太空',
            'ui.craft': '工艺',
            'ui.upgrade': '升级',
            'ui.trade': '贸易',
            'ui.faith': '宗教',
            'ui.time': '时间',
            'ui.options': '选项',
            'ui.filter': '日志过滤',
            'ui.distribute': '猫力资源',
            'ui.max': 'Max: {0}',

            'ui.upgrade.upgrades': '升级',
            'ui.upgrade.techs': '科技',
            'ui.upgrade.races': '探险队出发!',
            'ui.upgrade.missions': '探索星球',
            'ui.upgrade.buildings': '建筑',

            'ui.faith.addtion': '附加',
            'option.faith.best.unicorn': '优先最佳独角兽建筑',
            'option.faith.best.unicorn.desc': '当眼泪不够建造最佳独角兽建筑时也会自动献祭独角兽',
            'option.faith.transcend': '自动超越',
            'act.transcend': '消耗 {0} 顿悟，达到超越 {1}',
            'summary.transcend': '超越了 {0} 次',
            'filter.transcend': '超越',
            'option.faith.adore': '赞美群星',
            'act.adore': '赞美群星! 转化 {0} 虔诚为 {1} 顿悟',
            'summary.adore': '通过赞美群星积累了 {0} 顿悟',
            'filter.adore': '赞美群星',
            'adore.trigger.set': '为自动赞美群星设定一个新触发值，取值范围为 0 到 1 的小数。\n如果赞美群星后第一次赞美太阳可将太阳革命加成恢复到(触发值*太阳革命太阳革命极限加成)，那么珂学家将自动赞美群星。\n\n注意：太阳革命加成在到达上限的75%后便会收益递减。',

            'resources.add': '添加资源',
            'resources.clear.unused': '清除未使用',
            'resources.stock': '库存: {0}',
            'resources.consume': '消耗率: {0}',
            'resources.del': '删除',
            'resources.stock.set': '设置 {0} 的库存',
            'resources.consume.set': '设置 {0} 的消耗率',
            'resources.del.confirm': '确定要取消 {0} 的库存控制?',

            'status.ks.enable': '神说，要有猫猫珂学家!',
            'status.ks.disable': '太敬业了，该歇了',
            'status.sub.enable': '启用 {0}',
            'status.auto.enable': '启用自动化 {0}',
            'status.sub.disable': '禁用 {0}',
            'status.auto.disable': '禁用自动化 {0}',

            'trade.limited': '与 {0} 的交易限制为比产量更优时才会触发',
            'trade.unlimited': '取消与 {0} 交易的限制',
            'trade.seasons': '季节',
            'trade.season.enable': '启用在 {1} 与 {0} 的交易',
            'trade.season.disable': '停止在 {1} 与 {0} 的交易',

            'filter.enable': '过滤 {0}',
            'filter.disable': '取消过滤 {0}',

            'craft.limited': '制作 {0} 受库存消耗比率的限制',
            'craft.unlimited': '制作 {0} 不受限制',

            'distribute.limited': '分配 {0} 受限于最大值',
            'distribute.unlimited': '分配 {0} 不受限',
            'act.distribute': '分配一只猫猫成为 {0}',
            'ui.max.set': '设置 {0} 的最大值',
            'summary.distribute': '帮助 {0} 只猫猫找到工作',
            'filter.distribute': '猫口分配',

            'option.promote': '提拔领袖',
            'act.promote': '领袖被提拔到 {0} 级',
            'filter.promote': '提拔领袖',
            'summary.promote': '提拔领袖 {0} 次',

            'ui.timeCtrl': '时间操纵',
            'option.accelerate': '时间加速',
            'act.accelerate': '固有时制御，二倍速!',
            'filter.accelerate': '时间加速',
            'summary.accelerate': '加速时间 {0} 次',
            'option.time.skip': '时间跳转',
            'act.time.skip': '燃烧时间水晶, 跳过接下来的 {0} 年!',
            'ui.cycles': '周期',
            'ui.maximum': '上限',
            'time.skip.cycle.enable': '启用在 {0} 跳转时间并允许跳过该周期',
            'time.skip.cycle.disable': '停止在 {0} 跳转时间并禁止跳过该周期',
            'time.skip.season.enable': '启用在 {0} 跳转时间',
            'time.skip.season.disable': '停止在 {0} 跳转时间',
            'time.skip.trigger.set': '为跳转时间(燃烧时间水晶)设定一个新触发值，取值范围为正整数',
            'summary.time.skip': '跳过 {0} 年',
            'filter.time.skip': '时间跳转',
            'option.time.reset': '重启时间线 (危险!)',
            'status.reset.check.enable': '在重启时间线前检查 {0}',
            'status.reset.check.disable': '在重启时间线前不检查 {0}',
            'ui.min': 'Min: {0}',
            'reset.check.trigger.set': '为 {0} 设置新的触发值.\n-1 表示必须将此建筑建造至超过资源上限为止',
            'reset.check': '{0} 的触发值: {1}, 现在共有 {2}',
            'reset.checked': '所有条件都已满足，时间线将在几秒后重启!',
            'reset.tip': '你可以通过取消 "启用小猫珂学家" 或 "时间操控" 或 "重启时间线" 以取消此次重启',
            'reset.countdown.10': '10 - 正在收获猫薄荷',
            'reset.countdown.9': '&nbsp;9 - 正在献祭独角兽',
            'reset.countdown.8': '&nbsp;8 - 正在放生蜥蜴',
            'reset.countdown.7': '&nbsp;7 - 正在拆解电磁炮',
            'reset.countdown.6': '&nbsp;6 - 正在启动时间引擎',
            'reset.countdown.5': '&nbsp;5 - 正在融化黑币',
            'reset.countdown.4': '&nbsp;4 - 正在关闭卫星',
            'reset.countdown.3': '&nbsp;3 - 正在打开时空裂隙',
            'reset.countdown.2': '&nbsp;2 - 正在启动时间锻造',
            'reset.countdown.1': '&nbsp;1 - 时间引擎已启动!',
            'reset.countdown.0': '&nbsp;0 - 时空裂缝已打开!',
            'reset.last.message': '我们下个庞加莱回归再见',
            'reset.after': '初次见面，可爱的猫猫科学家为您服务',
            'reset.cancel.message': '重启时间线计划取消.',
            'reset.cancel.activity': '喵斯顿，我们有麻烦了.',
            'summary.time.reset.title': '过去 {0} 个时间线的总结',
            'summary.time.reset.content': '获得 {0} 业.<br>获得 {1} 领导力.',
            'ui.close': '关闭',

            'option.fix.cry': '修复冷冻仓',
            'act.fix.cry': '小猫修复了 {0} 个冷冻仓',
            'summary.fix.cry': '修复了 {0} 个冷冻仓',

            'summary.festival': '举办了 {0} 次节日',
            'summary.stars': '观测了 {0} 颗流星',
            'summary.praise': '通过赞美太阳积累了 {0} 虔诚',
            'summary.hunt': '派出了 {0} 批可爱的小猫猎人',
            'summary.embassy': '设立了 {0} 个大使馆',
            'summary.feed': '向上古神献祭 {0} 只死灵兽',
            'summary.tech': '掌握了 {0}',
            'summary.upgrade': '发明了 {0}',
            'summary.building': '建造了 {0} 个 {1}',
            'summary.sun': '在 {1} 方面顿悟 {0} 次',
            'summary.craft': '制作了 {0} 个 {1}',
            'summary.trade': '与 {1} 贸易了 {0} 次',
            'summary.year': '年',
            'summary.years': '年',
            'summary.separator': ' ',
            'summary.day': '天',
            'summary.days': '天',
            'summary.head': '过去 {0} 的总结',
            'summary.show': '总结',
        },
    };
    if (!i18nData[lang]) {
        console.error(lang + ' not found')
        i18nData[lang] = i18nData['en'];
    }

    var i18n = function(key, args) {
        if (key[0] == "$")
            return i18ng(key.slice(1));
        value = i18nData[lang][key];
        if (typeof value === 'undefined') {
            value = i18nData['en'][key];
            if (!value) {
                console.error('key "' + key + '" not found')
                return '$' + key;
            }
            console.error('Key "' + key + '" not found in ' + lang)
        }
        if (args)
            for (var i = 0; i < args.length; i++)
                value = value.replace('{' + i + '}', args[i])
        return value;
    }

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
