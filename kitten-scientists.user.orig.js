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
    var message = function () {
        var args = Array.prototype.slice.call(arguments);
        args.push('ks-default');
        args.push(options.msgcolor);
        printoutput(args);
    };

    var activity = function () {
        var args = Array.prototype.slice.call(arguments);
        var activityClass = args.length > 1 ? ' type_' + args.pop() : '';
        args.push('ks-activity' + activityClass);
        args.push(options.activitycolor);
        printoutput(args);
    };

    var summary = function () {
        var args = Array.prototype.slice.call(arguments);
        args.push('ks-summary');
        args.push(options.summarycolor);
        printoutput(args);
    };

    var warning = function () {
        var args = Array.prototype.slice.call(arguments);
        args.unshift('Warning!');

        if (console) console.log(args);
    };

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

    var right = $('#rightColumn');

    var addRule = function (rule) {
        var sheets = document.styleSheets;
        sheets[0].insertRule(rule, 0);
    };

    var defaultSelector = 'body[data-ks-style]:not(.scheme_sleek)';

    addRule('body {' // low priority. make sure it can be covered by the theme
        + 'font-family: monospace;'
        + 'font-size: 12px;'
        + '}');
        
    addRule(defaultSelector + ' #game {'
        // + 'font-family: monospace;'
        // + 'font-size: 12px;'
        + 'min-width: 1300px;'
        + 'top: 32px;'
        + '}');

    // addRule(defaultSelector + ' {'
    //     + 'font-family: monospace;'
    //     + 'font-size: 12px;'
    //     + '}');

    addRule(defaultSelector + ' .column {'
        + 'min-height: inherit;'
        + 'max-width: inherit !important;'
        + 'padding: 1%;'
        + 'margin: 0;'
        + 'overflow-y: auto;'
        + '}');

    addRule(defaultSelector + ' #leftColumn {'
        + 'height: 92%;'
        + 'width: 26%;'
        + '}');

    addRule(defaultSelector + ' #midColumn {'
        + 'margin-top: 1% !important;'
        + 'height: 90%;'
        + 'width: 48%;'
        + '}');

    addRule(defaultSelector + ' #rightColumn {'
        + 'overflow-y: auto;'
        + 'height: 92%;'
        + 'width: 19%;'
        + '}');

    addRule('body #gamePageContainer #game #rightColumn {'
        + 'overflow-y: auto'
        + '}');

    // addRule(defaultSelector + ' #gameLog .msg {'
    //     + 'display: block;'
    //     + '}');

    addRule(defaultSelector + ' #gameLog {'
        + 'overflow-y: hidden !important;'
        + 'width: 100% !important;'
        + 'padding-top: 5px !important;'
        + '}');

    addRule(defaultSelector + ' #resContainer .maxRes {'
        + 'color: #676766;'
        + '}');

    addRule(defaultSelector + ' #game .btn {'
        + 'border-radius: 0px;'
        + 'font-family: monospace;'
        + 'font-size: 12px !important;'
        + 'margin: 0 5px 7px 0;'
        + 'width: 290px;'
        + '}');

    addRule(defaultSelector + ' #game .map-viewport {'
        + 'height: 340px;'
        + 'max-width: 500px;'
        + 'overflow: visible;'
        + '}');

    addRule(' #game .map-dashboard {'
        + 'height: 120px;'
        + 'width: 292px;'
        + '}');

    addRule('#ks-options ul {'
        + 'list-style: none;'
        + 'margin: 0 0 5px;'
        + 'padding: 0;'
        + '}');

    addRule('#ks-options ul:after {'
        + 'clear: both;'
        + 'content: " ";'
        + 'display: block;'
        + 'height: 0;'
        + '}');

    addRule('#ks-options ul li {'
        + 'display: block;'
        + 'float: left;'
        + 'width: 100%;'
        + '}');

    addRule('#ks-options #toggle-list-resources .stockWarn *,'
        + '#ks-options #toggle-reset-list-resources .stockWarn * {'
        + 'color: ' + options.stockwarncolor + ';'
        + '}');
    
    addRule('.right-tab {'
        + 'height: unset !important;'
        + '}');

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

    var initializeKittenStorage = function () {
        $("#items-list-build, #items-list-craft, #items-list-trade").find("input[id^='toggle-']").each(function () {
            kittenStorage.items[$(this).attr("id")] = $(this).prop("checked");
        });

        saveToKittenStorage();
    };

    var saveToKittenStorage = function () {
        kittenStorage.toggles = {
            build: options.auto.build.enabled,
            space: options.auto.space.enabled,
            craft: options.auto.craft.enabled,
            upgrade: options.auto.upgrade.enabled,
            trade: options.auto.trade.enabled,
            faith: options.auto.faith.enabled,
            time: options.auto.time.enabled,
            timeCtrl: options.auto.timeCtrl.enabled,
            distribute: options.auto.distribute.enabled,
            options: options.auto.options.enabled,
            filter: options.auto.filter.enabled
        };
        kittenStorage.resources = options.auto.resources;
        kittenStorage.triggers = {
            faith: options.auto.faith.trigger,
            time: options.auto.time.trigger,
            build: options.auto.build.trigger,
            space: options.auto.space.trigger,
            craft: options.auto.craft.trigger,
            trade: options.auto.trade.trigger
        };

        localStorage['cbc.kitten-scientists'] = JSON.stringify(kittenStorage);
    };

    var loadFromKittenStorage = function () {
        var saved = JSON.parse(localStorage['cbc.kitten-scientists'] || 'null');
        if (saved && saved.version == 1) {
            saved.version = 2;
            saved.reset = {
                reset: false,
                times: 0,
                paragonLastTime: 0,
                pargonTotal: 0,
                karmaLastTime: 0,
                karmaTotal: 0
            };
        }
        if (saved && saved.version == kittenStorageVersion) {
            kittenStorage = saved;

            if (saved.toggles) {
                for (var toggle in saved.toggles) {
                    if (toggle !== 'engine' && options.auto[toggle]) {
                        options.auto[toggle].enabled = !!saved.toggles[toggle];
                        var el = $('#toggle-' + toggle);
                        el.prop('checked', options.auto[toggle].enabled);
                    }
                }
            }

            for (var item in kittenStorage.items) {
                var value = kittenStorage.items[item];
                var el = $('#' + item);
                var option = el.data('option');
                var name = item.split('-');

                if (option === undefined) {
                    delete kittenStorage.items[item];
                    continue;
                }

                if (name[0] == 'set') {
                    el[0].title = value;
                    if (name[name.length -1] == 'max') {
                        el.text(i18n('ui.max', [value]));
                    } else if (name[name.length -1] == 'min') {
                        el.text(i18n('ui.min', [value]));
                    }
                } else {
                    el.prop('checked', value);
                }

                if (name.length == 2) {
                    option.enabled = value;
                } else if (name[1] == 'reset' && name.length >= 4) {
                    var type = name[2];
                    var itemName = name[3];
                    switch (name[0]) {
                        case 'toggle':
                            options.auto[type].items[itemName].checkForReset = value;
                            break;
                        case 'set':
                            options.auto[type].items[itemName].triggerForReset = value;
                            break;
                    }
                } else {
                    if (name[1] == 'limited') {
                        option.limited = value;
                    } else {
                        option[name[2]] = value;
                    }
                }
            }

            var resourcesList = $("#toggle-list-resources");
            var resetList = $("#toggle-reset-list-resources");
            for (var resource in kittenStorage.resources) {
                var res = kittenStorage.resources[resource];

                if (res.enabled) {
                    if ($('#resource-' + resource).length === 0)
                        resourcesList.append(addNewResourceOption(resource));
                    if ('stock' in res) setStockValue(resource, res.stock);
                    if ('consume' in res) setConsumeRate(resource, res.consume);
                }
                if (res.checkForReset) {
                    if ($('#resource-reset-' + resource).length === 0)
                        resetList.append(addNewResourceOption(resource, undefined, true));
                    if ('stockForReset' in res) setStockValue(resource, res.stockForReset ? res.stockForReset : Infinity, true);
                }
            }
            
            if (saved.triggers) {
                options.auto.faith.trigger = saved.triggers.faith;
                options.auto.time.trigger = saved.triggers.time;
                options.auto.build.trigger = saved.triggers.build;
                options.auto.space.trigger = saved.triggers.space;
                options.auto.craft.trigger = saved.triggers.craft;
                options.auto.trade.trigger = saved.triggers.trade;

                $('#trigger-faith')[0].title = options.auto.faith.trigger;
                $('#trigger-time')[0].title = options.auto.time.trigger;
                $('#trigger-build')[0].title = options.auto.build.trigger;
                $('#trigger-space')[0].title = options.auto.space.trigger;
                $('#trigger-craft')[0].title = options.auto.craft.trigger;
                $('#trigger-trade')[0].title = options.auto.trade.trigger;
            }

        } else {
            initializeKittenStorage();
        }
    };

    // Add options element
    // ===================

    var ucfirst = function (string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    var roundToTwo = function (n) {
        return +(Math.round(n + "e+2") + "e-2")
    };

    var setStockWarning = function(name, value, forReset=false) {
        // simplest way to ensure it doesn't stick around too often; always do
        // a remove first then re-add only if needed
        var path = forReset ? '#resource-reset-'+name : '#resource-'+name;
        $(path).removeClass("stockWarn");

        var maxValue = game.resPool.resources.filter(i => i.name == name)[0].maxValue;
        if ((value > maxValue && !(maxValue === 0)) || value === Infinity) $(path).addClass("stockWarn");
    }

    var setStockValue = function (name, value, forReset=false) {
        var n = Number(value);

        if (isNaN(n) || n < 0) {
            warning('ignoring non-numeric or invalid stock value ' + value);
            return;
        }

        if (!options.auto.resources[name]) options.auto.resources[name] = {};
        if (forReset) {
            var path = '#resource-reset-' + name + ' #stock-value-' + name;
            n = n<0 ? Infinity : n;
            options.auto.resources[name].checkForReset = true;
            options.auto.resources[name].stockForReset = n;
        } else {
            var path = '#resource-' + name + ' #stock-value-' + name;
            options.auto.resources[name].enabled = true;
            options.auto.resources[name].stock = n;
        }
        $(path).text(i18n('resources.stock', [n === Infinity ? '∞' : game.getDisplayValueExt(n)]));

        setStockWarning(name, n, forReset);
    };

    var setConsumeRate = function (name, value) {
        var n = parseFloat(value);

        if (isNaN(n) || n < 0.0 || n > 1.0) {
            warning('ignoring non-numeric or invalid consume rate ' + value);
            return;
        }

        if (!options.auto.resources[name]) options.auto.resources[name] = {};
        options.auto.resources[name].consume = n;
        $('#consume-rate-' + name).text(i18n('resources.consume', [n.toFixed(2)]));
    };

    var removeResourceControl = function (name, forReset=false) {
        var opt = options.auto.resources[name];
        if (forReset)
            opt.checkForReset = false;
        else
            opt.enabled = false;

        if (!opt.enabled && !opt.checkForReset)
            delete options.auto.resources[name];
    };

    var addNewResourceOption = function (name, title, forReset=false) {
        title = title || game.resPool.get(name).title || ucfirst(name);
        var res = options.auto.resources[name];
        if (forReset && res && res.stockForReset)
            var stock = res.stockForReset;
        else if (!forReset && res && res.stock)
            var stock = res.stock;
        else
            var stock = 0;
        var consume = res && (res.consume != undefined) ? res.consume : options.consume;

        var container = $('<div/>', {
            id: (forReset ? 'resource-reset-' : 'resource-') + name,
            css: {display: 'inline-block', width: '100%'},
        });

        var label = $('<div/>', {
            id: 'resource-label-' + name,
            text: title,
            css: {display: 'inline-block', width: '95px'},
        });

        var stock = $('<div/>', {
            id: 'stock-value-' + name,
            text: i18n('resources.stock', [stock === Infinity ? '∞' : game.getDisplayValueExt(stock)]),
            css: {cursor: 'pointer', display: 'inline-block', width: '80px'},
        });

        var consume = $('<div/>', {
            id: 'consume-rate-' + name,
            text: i18n('resources.consume', [consume.toFixed(2)]),
            css: {cursor: 'pointer', display: 'inline-block'},
        });

        var del = $('<div/>', {
            id: 'resource-delete-' + name,
            text: i18n('resources.del'),
            css: {cursor: 'pointer',
                display: 'inline-block',
                float: 'right',
                paddingRight: '5px',
                textShadow: '3px 3px 4px gray'},
        });

        if (forReset)
            container.append(label, stock, del);
        else
            container.append(label, stock, consume, del);

        // once created, set color if relevant
        if (res != undefined && res.stock != undefined) setStockWarning(name, res.stock);

        (function (stock, forReset) {
            stock.on('click', function () {
                var value = window.prompt(i18n('resources.stock.set', [title]));
                if (value !== null) {
                    setStockValue(name, value, forReset);
                    saveToKittenStorage();
                }
            })
        })(stock, forReset);

        consume.on('click', function () {
            var value = window.prompt(i18n('resources.consume.set', [title]));
            if (value !== null) {
                setConsumeRate(name, value);
                saveToKittenStorage();
            }
        });

        (function (del, forReset) {
            del.on('click', function () {
                if (window.confirm(i18n('resources.del.confirm', [title]))) {
                    container.remove();
                    removeResourceControl(name, forReset);
                    saveToKittenStorage();
                }
            })
        })(del, forReset);

        return container;
    };

    var getAvailableResourceOptions = function (forReset) {
        var items = [];
        var idPrefix = forReset ? '#resource-reset-' : '#resource-';

        for (var i in game.resPool.resources) {
            var res = game.resPool.resources[i];

            // Show only new resources that we don't have in the list and that are
            // visible. This helps cut down on total size.
            if (res.name && $(idPrefix + res.name).length === 0) {
                var item = $('<div/>', {
                    id: 'resource-add-' + res.name,
                    text: ucfirst(res.title ? res.title : res.name),
                    css: {cursor: 'pointer',
                        textShadow: '3px 3px 4px gray'},
                });

                // Wrapper function needed to make closure work
                (function (res, item, forReset) {
                    item.on('click', function () {
                        item.remove();
                        if (!options.auto.resources[res.name]) options.auto.resources[res.name] = {};
                        if (forReset) {
                            options.auto.resources[res.name].checkForReset = true;
                            options.auto.resources[res.name].stockForReset = Infinity;
                            $('#toggle-reset-list-resources').append(addNewResourceOption(res.name, res.title, forReset));

                        } else {
                            options.auto.resources[res.name].enabled = true;
                            options.auto.resources[res.name].stock = 0;
                            options.auto.resources[res.name].consume = options.consume;
                            $('#toggle-list-resources').append(addNewResourceOption(res.name, res.title, forReset));
                        }
                        saveToKittenStorage();
                    });
                })(res, item, forReset);

                items.push(item);
            }
        }

        return items;
    };

    var getResourceOptions = function (forReset=false) {
        var list = $('<ul/>', {
            id: forReset ? 'toggle-reset-list-resources' : 'toggle-list-resources',
            css: {display: 'none', paddingLeft: '20px'}
        });

        var add = $('<div/>', {
            id: 'resources-add',
            text: i18n('resources.add'),
            css: {cursor: 'pointer',
                display: 'inline-block',
                textShadow: '3px 3px 4px gray',
                borderBottom: '1px solid rgba(185, 185, 185, 0.7)' },
        });

        var clearunused = $('<div/>', {
            id: 'resources-clear-unused',
            text: i18n('resources.clear.unused'),
            css: {cursor: 'pointer',
                display: 'inline-block',
                float: 'right',
                paddingRight: '5px',
                textShadow: '3px 3px 4px gray' },
        });

        clearunused.on('click', function () {
            for (var name in options.auto.resources) {
                // Only delete resources with unmodified values. Require manual
                // removal of resources with non-standard values.
                if (!options.auto.resources[name].stock &&
                    options.auto.resources[name].consume == options.consume ||
                    options.auto.resources[name].consume == undefined) {
                    $('#resource-' + name).remove();
                }
            }
        });

        var allresources = $('<ul/>', {
            id: 'available-resources-list',
            css: {display: 'none', paddingLeft: '20px'}
        });

        (function (add, forReset) {
            add.on('click', function () {
                allresources.toggle();
                allresources.empty();
                allresources.append(getAvailableResourceOptions(forReset));
            });
        })(add, forReset);

        if (forReset)
            list.append(add, allresources);
        else
            list.append(add, clearunused, allresources);

        // Add all the current resources
        for (var name in options.auto.resources) {
            var res = options.auto.resources[name];
            if ((forReset && res.checkForReset) || (!forReset && res.enabled))
                list.append(addNewResourceOption(name, undefined, forReset));
        }

        return list;
    };

    var getOptionHead = function (toggleName) {
        var list = $('<ul/>', {
            id: 'items-list-' + toggleName,
            css: {display: 'none', paddingLeft: '20px'}
        });

        var disableall = $('<div/>', {
            id: 'toggle-all-items-' + toggleName,
            text: i18n('ui.disable.all'),
            css: {cursor: 'pointer',
                display: 'inline-block',
                textShadow: '3px 3px 4px gray',
                marginRight: '8px'}
        });

        disableall.on('click', function () {
            // can't use find as we only want one layer of checkboxes
            var items = list.children().children(':checkbox');
            items.prop('checked', false);
            items.change();
            list.children().children(':checkbox').change();
        });

        list.append(disableall);

        var enableall = $('<div/>', {
            id: 'toggle-all-items-' + toggleName,
            text: i18n('ui.enable.all'),
            css: {cursor: 'pointer',
                display: 'inline-block',
                textShadow: '3px 3px 4px gray'}
        });

        enableall.on('click', function () {
            // can't use find as we only want one layer of checkboxes
            var items = list.children().children(':checkbox');
            items.prop('checked', true);
            items.change();
            list.children().children(':checkbox').change();
        });

        list.append(enableall);
        return list
    }

    var getAdditionOptions = function () {
        var toggleName = 'faith-addition';
        var list = getOptionHead(toggleName);

        var addi = options.auto.faith.addition;
        for (var itemName in addi) {
            node = getOption(itemName, addi[itemName]);

            if (itemName == 'bestUnicornBuilding') {
                node.children('label').prop('title', i18n('option.faith.best.unicorn.desc'));
                input = node.children('input');
                input.unbind('change')
                var bub = addi.bestUnicornBuilding;
                input.on('change', function () {
                    if (input.is(':checked') && !bub.enabled) {

                        bub.enabled = true;
                        // enable all unicorn buildings
                        for (var unicornName in options.auto.unicorn.items) {
                            var building = $('#toggle-' + unicornName);
                            building.prop('checked', true);
                            building.trigger('change');
                        }
                        imessage('status.sub.enable', [i18n('option.faith.best.unicorn')]);

                    } else if ((!input.is(':checked')) && bub.enabled) {

                        bub.enabled = false;
                        imessage('status.sub.disable', [i18n('option.faith.best.unicorn')]);

                    }
                    kittenStorage.items[input.attr('id')] = bub.enabled;
                    saveToKittenStorage();
                });
            }

            if (addi[itemName].subTrigger !== undefined) {

                var triggerButton = $('<div/>', {
                    id: 'set-' + itemName + '-subTrigger',
                    text: i18n('ui.trigger'),
                    title: addi[itemName].subTrigger,
                    css: {cursor: 'pointer',
                        display: 'inline-block',
                        float: 'right',
                        paddingRight: '5px',
                        textShadow: '3px 3px 4px gray'}
                }).data('option', addi[itemName]);
            
                (function (itemName, triggerButton) {
                    if (itemName == 'adore') {
                        triggerButton.on('click', function () {
                            var value;
                            value = window.prompt(i18n('adore.trigger.set'), addi[itemName].subTrigger);
            
                            if (value !== null) {
                                addi[itemName].subTrigger = parseFloat(value);
                                kittenStorage.items[triggerButton[0].id] = addi[itemName].subTrigger;
                                saveToKittenStorage();
                                triggerButton[0].title = addi[itemName].subTrigger;
                            }
                        })
        
                    } else if (itemName == 'autoPraise') {
                        triggerButton.on('click', function () {
                            var value;
                            value = window.prompt(i18n('ui.trigger.set', [i18n('option.praise')]), addi[itemName].subTrigger);
            
                            if (value !== null) {
                                addi[itemName].subTrigger = parseFloat(value);
                                kittenStorage.items[triggerButton[0].id] = addi[itemName].subTrigger;
                                saveToKittenStorage();
                                triggerButton[0].title = addi[itemName].subTrigger;
                            }
                        });
                    }
                })(itemName, triggerButton);
                node.append(triggerButton);
            }

            list.append(node);
        }
        
        return list;
    }

    var getToggle = function (toggleName) {
        var itext = ucfirst(i18n('ui.' + toggleName));

        var auto = options.auto[toggleName];
        var element = $('<li/>', {id: 'ks-' + toggleName});

        var label = $('<label/>', {
            'for': 'toggle-' + toggleName,
            text: itext
        });

        var input = $('<input/>', {
            id: 'toggle-' + toggleName,
            type: 'checkbox'
        });

        if (auto.enabled) {
            input.prop('checked', true);
        }

        // engine needs a custom toggle
        if (toggleName !== 'engine') {
            input.on('change', function () {
                if (input.is(':checked') && auto.enabled == false) {
                    auto.enabled = true;
                    if (toggleName === 'filter' || toggleName === 'options') {
                        imessage('status.sub.enable', [itext]);
                    } else {
                        imessage('status.auto.enable', [itext]);
                    }
                    saveToKittenStorage();
                } else if ((!input.is(':checked')) && auto.enabled == true) {
                    auto.enabled = false;
                    if (toggleName === 'filter' || toggleName === 'options') {
                        imessage('status.sub.disable', [itext]);
                    } else {
                        imessage('status.auto.disable', [itext]);
                    }
                    saveToKittenStorage();
                }
            });
        }

        element.append(input, label);

        if (auto.items) {
            // Add a border on the element
            element.css('borderBottom', '1px  solid rgba(185, 185, 185, 0.7)');

            var toggle = $('<div/>', {
                css: {display: 'inline-block', float: 'right'}
            });

            var button = $('<div/>', {
                id: 'toggle-items-' + toggleName,
                text: i18n('ui.items'),
                css: {cursor: 'pointer',
                    display: 'inline-block',
                    float: 'right',
                    paddingRight: '5px',
                    textShadow: '3px 3px 4px gray'}
            });

            element.append(button);

            var list = getOptionHead(toggleName);

            // merge unicorn to faith
            if (toggleName == 'faith')
                for (var itemName in options.auto.unicorn.items)
                    list.append(getOption(itemName, options.auto.unicorn.items[itemName]));

            // fill out list with toggle items
            for (var itemName in auto.items) {
                switch (toggleName) {
                    case 'trade':
                        list.append(getTradeOption(itemName, auto.items[itemName]));
                        break;
                    case 'craft':
                        list.append(getCraftOption(itemName, auto.items[itemName]));
                        break;
                    case 'timeCtrl':
                        list.append(getTimeCtrlOption(itemName, auto.items[itemName]));
                        break;
                    case 'options':
                        list.append(getOptionsOption(itemName, auto.items[itemName]));
                        break;
                    case 'upgrade':
                        list.append(getOption(itemName, auto.items[itemName], i18n('ui.upgrade.' + itemName)));
                        break;
                    case 'distribute':
                        list.append(getDistributeOption(itemName, auto.items[itemName]));
                        break;
                    case 'build':
                    case 'space':
                        list.append(getLimitedOption(itemName, auto.items[itemName]));
                        break;
                    default:
                        list.append(getOption(itemName, auto.items[itemName]));
                        break;

                }
            }

            button.on('click', function () {
                list.toggle();
            });

            // Add resource controls for crafting, sort of a hack
            if (toggleName === 'craft') {
                var resources = $('<div/>', {
                    id: 'toggle-resource-controls',
                    text: i18n('ui.craft.resources'),
                    css: {cursor: 'pointer',
                        display: 'inline-block',
                        float: 'right',
                        paddingRight: '5px',
                        textShadow: '3px 3px 4px gray'},
                });

                var resourcesList = getResourceOptions();

                // When we click the items button, make sure we clear resources
                button.on('click', function () {
                    resourcesList.toggle(false);
                });

                resources.on('click', function () {
                    list.toggle(false);
                    resourcesList.toggle();
                });

                element.append(resources);
            }

            // Add additional controls for faith, sort of a hack again
            if (toggleName === 'faith') {
                var addition = $('<div/>', {
                    id: 'toggle-addition-controls',
                    text: i18n('ui.faith.addtion'),
                    css: {cursor: 'pointer',
                        display: 'inline-block',
                        float: 'right',
                        paddingRight: '5px',
                        textShadow: '3px 3px 4px gray'},
                });

                var additionList = getAdditionOptions();

                button.on('click', function () {
                    additionList.toggle(false);
                });

                addition.on('click', function () {
                    list.toggle(false);
                    additionList.toggle();
                });

                element.append(addition);

                // disable auto best unicorn building when unicorn building was disable
                for (var unicornName in options.auto.unicorn.items) {
                    var ub = list.children().children('#toggle-' + unicornName);
                    ub.on('change', function() {
                        if (!$(event.target).is(':checked')) {
                            var b = $('#toggle-bestUnicornBuilding');
                            b.prop('checked', false);
                            b.trigger('change');
                        }
                    });
                };
            }

        }

        if (auto.trigger !== undefined) {
            var triggerButton = $('<div/>', {
                id: 'trigger-' + toggleName,
                text: i18n('ui.trigger'),
                title: auto.trigger,
                css: {cursor: 'pointer',
                    display: 'inline-block',
                    float: 'right',
                    paddingRight: '5px',
                    textShadow: '3px 3px 4px gray'}
            });

            triggerButton.on('click', function () {
                var value;
                value = window.prompt(i18n('ui.trigger.set', [itext]), auto.trigger);

                if (value !== null) {
                    auto.trigger = parseFloat(value);
                    saveToKittenStorage();
                    triggerButton[0].title = auto.trigger;
                }
            });

            element.append(triggerButton);
        }

        if (toggleName === 'craft') {element.append(resourcesList);}
        else if (toggleName === 'faith') {element.append(additionList);}

        if (auto.items) {element.append(toggle, list);}

        return element;
    };

    var getTradeOption = function (name, option) {
        var iname = ucfirst(i18n('$trade.race.' + name));

        var element = getOption(name, option, iname);
        element.css('borderBottom', '1px solid rgba(185, 185, 185, 0.7)');

        //Limited Trading
        var label = $('<label/>', {
            'for': 'toggle-limited-' + name,
            text: i18n('ui.limit')
        });

        var input = $('<input/>', {
            id: 'toggle-limited-' + name,
            type: 'checkbox'
        }).data('option', option);

        if (option.limited) {
            input.prop('checked', true);
        }

        input.on('change', function () {
            if (input.is(':checked') && option.limited == false) {
                option.limited = true;
                imessage('trade.limited', [iname]);
            } else if ((!input.is(':checked')) && option.limited == true) {
                option.limited = false;
                imessage('trade.unlimited', [iname]);
            }
            kittenStorage.items[input.attr('id')] = option.limited;
            saveToKittenStorage();
        });

        element.append(input, label);
        //Limited Trading End

        var button = $('<div/>', {
            id: 'toggle-seasons-' + name,
            text: i18n('trade.seasons'),
            css: {cursor: 'pointer',
                display: 'inline-block',
                float: 'right',
                paddingRight: '5px',
                textShadow: '3px 3px 4px gray'},
        });

        var list = $('<ul/>', {
            id: 'seasons-list-' + name,
            css: {display: 'none', paddingLeft: '20px'}
        });

        // fill out the list with seasons
        list.append(getSeason(name, 'spring', option));
        list.append(getSeason(name, 'summer', option));
        list.append(getSeason(name, 'autumn', option));
        list.append(getSeason(name, 'winter', option));

        button.on('click', function () {
            list.toggle();
        });

        element.append(button, list);

        return element;
    };

    var getSeason = function (name, season, option) {
        var iname = ucfirst(i18n('$trade.race.' + name));
        var iseason = ucfirst(i18n('$calendar.season.' + season));

        var element = $('<li/>');

        var label = $('<label/>', {
            'for': 'toggle-' + name + '-' + season,
            text: ucfirst(iseason)
        });

        var input = $('<input/>', {
            id: 'toggle-' + name + '-' + season,
            type: 'checkbox'
        }).data('option', option);

        if (option[season]) {
            input.prop('checked', true);
        }

        input.on('change', function () {
            if (input.is(':checked') && option[season] == false) {
                option[season] = true;
                imessage('trade.season.enable', [iname, iseason]);
            } else if ((!input.is(':checked')) && option[season] == true) {
                option[season] = false;
                imessage('trade.season.disable', [iname, iseason]);
            }
            kittenStorage.items[input.attr('id')] = option[season];
            saveToKittenStorage();
        });

        element.append(input, label);

        return element;
    };

    var getSeasonForTimeSkip = function (season, option) {
        var iseason = ucfirst(i18n('$calendar.season.' + season));

        var element = $('<li/>');

        var label = $('<label/>', {
            'for': 'toggle-timeSkip-' + season,
            text: ucfirst(iseason)
        });

        var input = $('<input/>', {
            id: 'toggle-timeSkip-' + season,
            type: 'checkbox'
        }).data('option', option);

        if (option[season]) {
            input.prop('checked', true);
        }

        input.on('change', function () {
            if (input.is(':checked') && option[season] == false) {
                option[season] = true;
                imessage('time.skip.season.enable', [iseason]);
            } else if ((!input.is(':checked')) && option[season] == true) {
                option[season] = false;
                imessage('time.skip.season.disable', [iseason]);
            }
            kittenStorage.items[input.attr('id')] = option[season];
            saveToKittenStorage();
        });

        element.append(input, label);

        return element;
    };

    var getOption = function (name, option, iname) {
        var element = $('<li/>');
        var elementLabel = iname || option.label || ucfirst(name);

        var label = $('<label/>', {
            'for': 'toggle-' + name,
            text: elementLabel,
            css: {display: 'inline-block', minWidth: '80px'}
        });

        var input = $('<input/>', {
            id: 'toggle-' + name,
            type: 'checkbox'
        }).data('option', option);

        if (option.enabled) {
            input.prop('checked', true);
        }

        input.on('change', function () {
            if (input.is(':checked') && option.enabled == false) {
                option.enabled = true;
                if (option.filter) {
                    imessage('filter.enable', [elementLabel]);
                } else if (option.misc) {
                    imessage('status.sub.enable', [elementLabel]);
                } else {
                    imessage('status.auto.enable', [elementLabel]);
                }
            } else if ((!input.is(':checked')) && option.enabled == true) {
                option.enabled = false;
                if (option.filter) {
                    imessage('filter.disable', [elementLabel]);
                } else if (option.misc) {
                    imessage('status.sub.disable', [elementLabel]);
                } else {
                    imessage('status.auto.disable', [elementLabel]);
                }
            }
            kittenStorage.items[input.attr('id')] = option.enabled;
            saveToKittenStorage();
        });

        element.append(input, label);

        return element;
    };

    var getLimitedOption = function (name, option, iname) {
        var element = $('<li/>');
        var elementLabel = iname || option.label || ucfirst(name);

        var label = $('<label/>', {
            'for': 'toggle-' + name,
            text: elementLabel,
            css: {display: 'inline-block', minWidth: '80px'}
        });

        var input = $('<input/>', {
            id: 'toggle-' + name,
            type: 'checkbox'
        }).data('option', option);

        if (option.enabled) {
            input.prop('checked', true);
        }

        input.on('change', function () {
            if (input.is(':checked') && option.enabled == false) {
                option.enabled = true;
                if (option.filter) {
                    imessage('filter.enable', [elementLabel]);
                } else if (option.misc) {
                    imessage('status.sub.enable', [elementLabel]);
                } else {
                    imessage('status.auto.enable', [elementLabel]);
                }
            } else if ((!input.is(':checked')) && option.enabled == true) {
                option.enabled = false;
                if (option.filter) {
                    imessage('filter.disable', [elementLabel]);
                } else if (option.misc) {
                    imessage('status.sub.disable', [elementLabel]);
                } else {
                    imessage('status.auto.disable', [elementLabel]);
                }
            }
            kittenStorage.items[input.attr('id')] = option.enabled;
            saveToKittenStorage();
        });

        var maxButton = $('<div/>', {
            id: 'set-' + name + '-max',
            text: i18n('ui.max', [option.max]),
            title: option.max,
            css: {cursor: 'pointer',
                display: 'inline-block',
                float: 'right',
                paddingRight: '5px',
                textShadow: '3px 3px 4px gray'}
        }).data('option', option);

        maxButton.on('click', function () {
            var value;
            value = window.prompt(i18n('ui.max.set', [option.label]), option.max);

            if (value !== null) {
                option.max = parseInt(value);
                kittenStorage.items[maxButton.attr('id')] = option.max;
                saveToKittenStorage();
                maxButton[0].title = option.max;
                maxButton[0].innerText = i18n('ui.max', [option.max]);
            }
        });

        element.append(input, label, maxButton);

        return element;
    };

    var getCraftOption = function (name, option) {
        var iname = ucfirst(i18n('$resources.' + name + '.title'));

        var element = getOption(name, option, iname);

        var label = $('<label/>', {
            'for': 'toggle-limited-' + name,
            text: i18n('ui.limit')
        });

        var input = $('<input/>', {
            id: 'toggle-limited-' + name,
            type: 'checkbox'
        }).data('option', option);

        if (option.limited) {
            input.prop('checked', true);
        }

        input.on('change', function () {
            if (input.is(':checked') && option.limited == false) {
                option.limited = true;
                imessage('craft.limited', [iname]);
            } else if ((!input.is(':checked')) && option.limited == true) {
                option.limited = false;
                imessage('craft.unlimited', [iname]);
            }
            kittenStorage.items[input.attr('id')] = option.limited;
            saveToKittenStorage();
        });

        element.append(input, label);

        return element;
    };

    var getCycle = function (index, option) {
        var cycle = game.calendar.cycles[index];


        var element = $('<li/>');

        var label = $('<label/>', {
            'for': 'toggle-timeSkip-' + index,
            text: cycle.title
        });

        var input = $('<input/>', {
            id: 'toggle-timeSkip-' + index,
            type: 'checkbox'
        }).data('option', option);

        if (option[index]) {
            input.prop('checked', true);
        }

        input.on('change', function () {
            if (input.is(':checked') && option[index] == false) {
                option[index] = true;
                imessage('time.skip.cycle.enable', [cycle.title]);
            } else if ((!input.is(':checked')) && option[index] == true) {
                option[index] = false;
                imessage('time.skip.cycle.disable', [cycle.title]);
            }
            kittenStorage.items[input.attr('id')] = option[index];
            saveToKittenStorage();
        });

        element.append(input, label);

        return element;
    }

    var getResetOption = function (name, type, option) {
        var element = $('<li/>');
        var elementLabel = option.label;

        var label = $('<label/>', {
            'for': 'toggle-reset-' + type + '-' + name,
            text: elementLabel,
            css: {display: 'inline-block', minWidth: '80px'}
        });

        var input = $('<input/>', {
            id: 'toggle-reset-' + type + '-' + name,
            type: 'checkbox'
        }).data('option', option);

        if (option.checkForReset) {
            input.prop('checked', true);
        }

        input.on('change', function () {
            if (input.is(':checked') && option.checkForReset == false) {
                option.checkForReset = true;
                imessage('status.reset.check.enable', [elementLabel]);
            } else if ((!input.is(':checked')) && option.checkForReset == true) {
                option.checkForReset = false;
                imessage('status.reset.check.disable', [elementLabel]);
            }
            kittenStorage.items[input.attr('id')] = option.checkForReset;
            saveToKittenStorage();
        });
        
        var minButton = $('<div/>', {
            id: 'set-reset-' + type + '-' + name +'-min',
            text: i18n('ui.min', [option.triggerForReset]),
            title: option.triggerForReset,
            css: {cursor: 'pointer',
                display: 'inline-block',
                float: 'right',
                paddingRight: '5px',
                textShadow: '3px 3px 4px gray'}
        }).data('option', option);

        minButton.on('click', function () {
            var value;
            value = window.prompt(i18n('reset.check.trigger.set', [option.label]), option.triggerForReset);

            if (value !== null) {
                option.triggerForReset = parseInt(value);
                kittenStorage.items[minButton.attr('id')] = option.triggerForReset;
                saveToKittenStorage();
                minButton[0].title = option.triggerForReset;
                minButton[0].innerText = i18n('ui.min', [option.triggerForReset]);
            }
        });


        element.append(input, label, minButton);

        return element;
    }

    var getTimeCtrlOption = function (name, option) {
        var element = getOption(name, option);

        if (name == 'timeSkip') {
            var triggerButton = $('<div/>', {
                id: 'set-timeSkip-subTrigger',
                text: i18n('ui.trigger'),
                title: option.subTrigger,
                css: {cursor: 'pointer',
                    display: 'inline-block',
                    float: 'right',
                    paddingRight: '5px',
                    textShadow: '3px 3px 4px gray'}
            }).data('option', option);
            triggerButton.on('click', function () {
                var value;
                value = window.prompt(i18n('time.skip.trigger.set', []), option.subTrigger);

                if (value !== null) {
                    option.subTrigger = parseFloat(value);
                    kittenStorage.items[triggerButton.attr('id')] = option.subTrigger;
                    saveToKittenStorage();
                    triggerButton[0].title = option.subTrigger;
                }
            });

            var maximunButton = $('<div/>', {
                id: 'set-timeSkip-maximum',
                text: i18n('ui.maximum'),
                title: option.max,
                css: {cursor: 'pointer',
                    display: 'inline-block',
                    float: 'right',
                    paddingRight: '5px',
                    textShadow: '3px 3px 4px gray'}
            }).data('option', option);
            maximunButton.on('click', function () {
                var value;
                value = window.prompt(i18n('ui.max.set', [i18n('option.time.skip')]), option.maximum);

                if (value !== null) {
                    option.maximum = parseFloat(value);
                    kittenStorage.items[maximunButton.attr('id')] = option.maximum;
                    saveToKittenStorage();
                    maximunButton[0].title = option.maximum;
                }
            });

            var cyclesButton = $('<div/>', {
                id: 'toggle-cycle-' + name,
                text: i18n('ui.cycles'),
                css: {cursor: 'pointer',
                    display: 'inline-block',
                    float: 'right',
                    paddingRight: '5px',
                    textShadow: '3px 3px 4px gray'},
            });

            var cyclesList = $('<ul/>', {
                id: 'cycles-list-' + name,
                css: {display: 'none', paddingLeft: '20px'}
            });

            for (var i in game.calendar.cycles)
                cyclesList.append(getCycle(i, option));


            var seasonsButton = $('<div/>', {
                id: 'toggle-seasons-' + name,
                text: i18n('trade.seasons'),
                css: {cursor: 'pointer',
                    display: 'inline-block',
                    float: 'right',
                    paddingRight: '5px',
                    textShadow: '3px 3px 4px gray'},
            });
    

            var seasonsList = $('<ul/>', {
                id: 'seasons-list-' + name,
                css: {display: 'none', paddingLeft: '20px'}
            });
    
            // fill out the list with seasons
            seasonsList.append(getSeasonForTimeSkip('spring', option));
            seasonsList.append(getSeasonForTimeSkip('summer', option));
            seasonsList.append(getSeasonForTimeSkip('autumn', option));
            seasonsList.append(getSeasonForTimeSkip('winter', option));
    
            cyclesButton.on('click', function () {
                cyclesList.toggle();
                seasonsList.toggle(false);
            });

            seasonsButton.on('click', function () {
                cyclesList.toggle(false);
                seasonsList.toggle();
            });    

            element.append(cyclesButton, seasonsButton, maximunButton, triggerButton, cyclesList, seasonsList);

        } else if (name == 'reset') {

            var resetBuildList     = getOptionHead('reset-build')
            var resetSpaceList     = getOptionHead('reset-space')
            var resetResourcesList = getResourceOptions(true);
            var resetReligionList  = getOptionHead('reset-religion')
            var resetTimeList      = getOptionHead('reset-time')
            
            for (var item in options.auto.build.items)              resetBuildList.append(getResetOption(item, 'build', options.auto.build.items[item]));
            for (var item in options.auto.space.items)              resetSpaceList.append(getResetOption(item, 'space', options.auto.space.items[item]));
            for (var item in options.auto.unicorn.items)            resetReligionList.append(getResetOption(item, 'unicorn', options.auto.unicorn.items[item]));
            for (var item in options.auto.faith.items)              resetReligionList.append(getResetOption(item, 'faith', options.auto.faith.items[item]));
            for (var item in options.auto.time.items)               resetTimeList.append(getResetOption(item, 'time', options.auto.time.items[item]));

            var buildButton = $('<div/>', {id: 'toggle-reset-build', text: i18n('ui.build'),
                css: {cursor:'pointer',display:'inline-block',float:'right',paddingRight:'5px',textShadow:'3px 3px 4px gray'},});
            var spaceButton = $('<div/>', {id: 'toggle-reset-space', text: i18n('ui.space'),
                css: {cursor:'pointer',display:'inline-block',float:'right',paddingRight:'5px',textShadow:'3px 3px 4px gray'},});
            var resourcesButton = $('<div/>', {id: 'toggle-reset-resources', text: i18n('ui.craft.resources'),
                css: {cursor:'pointer',display:'inline-block',float:'right',paddingRight:'5px',textShadow:'3px 3px 4px gray'},});
            var religionButton = $('<div/>', {id: 'toggle-reset-religion', text: i18n('ui.faith'),
                css: {cursor:'pointer',display:'inline-block',float:'right',paddingRight:'5px',textShadow:'3px 3px 4px gray'},});
            var timeButton = $('<div/>', {id: 'toggle-reset-time', text: i18n('ui.time'),
                css: {cursor:'pointer',display:'inline-block',float:'right',paddingRight:'5px',textShadow:'3px 3px 4px gray'},});

            buildButton.on('click', function(){resetBuildList.toggle(); resetSpaceList.toggle(false); resetResourcesList.toggle(false); resetReligionList.toggle(false); resetTimeList.toggle(false);})
            spaceButton.on('click', function(){resetBuildList.toggle(false); resetSpaceList.toggle(); resetResourcesList.toggle(false); resetReligionList.toggle(false); resetTimeList.toggle(false);})
            resourcesButton.on('click', function(){resetBuildList.toggle(false); resetSpaceList.toggle(false); resetResourcesList.toggle(); resetReligionList.toggle(false); resetTimeList.toggle(false);})
            religionButton.on('click', function(){resetBuildList.toggle(false); resetSpaceList.toggle(false); resetResourcesList.toggle(false); resetReligionList.toggle(); resetTimeList.toggle(false);})
            timeButton.on('click', function(){resetBuildList.toggle(false); resetSpaceList.toggle(false); resetResourcesList.toggle(false); resetReligionList.toggle(false); resetTimeList.toggle();})

            element.append(buildButton, spaceButton, resourcesButton, religionButton, timeButton,
                resetBuildList, resetSpaceList, resetResourcesList, resetReligionList, resetTimeList);
        } else {
            var triggerButton = $('<div/>', {
                id: 'set-' + name +'-subTrigger',
                text: i18n('ui.trigger'),
                title: option.subTrigger,
                css: {cursor: 'pointer',
                    display: 'inline-block',
                    float: 'right',
                    paddingRight: '5px',
                    textShadow: '3px 3px 4px gray'}
            }).data('option', option);
    
            triggerButton.on('click', function () {
                var value;
                value = window.prompt(i18n('ui.trigger.set', [option.label]), option.subTrigger);
    
                if (value !== null) {
                    option.subTrigger = parseFloat(value);
                    kittenStorage.items[triggerButton.attr('id')] = option.subTrigger;
                    saveToKittenStorage();
                    triggerButton[0].title = option.subTrigger;
                }
            });
            element.append(triggerButton);
        }

        return element;
    };

    var getOptionsOption = function (name, option) {
        var element = getOption(name, option);

        // hack for style. 
        // If there are more UI options, split it to "getUIOption"
        if (name == 'style') {
            var input = element.children('input');
            input.unbind('change');
            input.on('change', function () {
                option.enabled = input.prop('checked');
                kittenStorage.items[input.attr('id')] = option.enabled;
                saveToKittenStorage();
                if (option.enabled) {
                    document.body.setAttribute('data-ks-style', '');
                } else {
                    document.body.removeAttribute('data-ks-style');
                }
            });
        }


        if (option.subTrigger !== undefined) {
            var triggerButton = $('<div/>', {
                id: 'set-' + name +'-subTrigger',
                text: i18n('ui.trigger'),
                title: option.subTrigger,
                css: {cursor: 'pointer',
                    display: 'inline-block',
                    float: 'right',
                    paddingRight: '5px',
                    textShadow: '3px 3px 4px gray'}
            }).data('option', option);

            triggerButton.on('click', function () {
                var value;
                if (name == 'crypto'){value = window.prompt(i18n('ui.trigger.crypto.set', [option.label]), option.subTrigger);}
                else{value = window.prompt(i18n('ui.trigger.set', [option.label]), option.subTrigger);}

                if (value !== null) {
                    option.subTrigger = parseFloat(value);
                    kittenStorage.items[triggerButton.attr('id')] = option.subTrigger;
                    saveToKittenStorage();
                    triggerButton[0].title = option.subTrigger;
                }
            });

            element.append(triggerButton);
        }

        return element;
    };

    var getDistributeOption = function (name, option) {
        var iname = ucfirst(i18n('$village.job.' + name));

        var element = getOption(name, option, iname);
        element.css('borderBottom', '1px solid rgba(185, 185, 185, 0.7)');

        //Limited Distribution
        var label = $('<label/>', {
            'for': 'toggle-limited-' + name,
            text: i18n('ui.limit')
        });

        var input = $('<input/>', {
            id: 'toggle-limited-' + name,
            type: 'checkbox'
        }).data('option', option);

        if (option.limited) {
            input.prop('checked', true);
        }

        input.on('change', function () {
            if (input.is(':checked') && option.limited == false) {
                option.limited = true;
                imessage('distribute.limited', [iname]);
            } else if ((!input.is(':checked')) && option.limited == true) {
                option.limited = false;
                imessage('distribute.unlimited', [iname]);
            }
            kittenStorage.items[input.attr('id')] = option.limited;
            saveToKittenStorage();
        });

        element.append(input, label);

        var maxButton = $('<div/>', {
            id: 'set-' + name +'-max',
            text: i18n('ui.max', [option.max]),
            title: option.max,
            css: {cursor: 'pointer',
                display: 'inline-block',
                float: 'right',
                paddingRight: '5px',
                textShadow: '3px 3px 4px gray'}
        }).data('option', option);

        (function (iname){
            maxButton.on('click', function () {
                var value;
                value = window.prompt(i18n('ui.max.set', [iname]), option.max);

                if (value !== null) {
                    option.max = parseInt(value);
                    kittenStorage.items[maxButton.attr('id')] = option.max;
                    saveToKittenStorage();
                    maxButton[0].title = option.max;
                    maxButton[0].innerText = i18n('ui.max', [option.max]);
                }
            })
        })(iname);

        element.append(maxButton);

        return element;
    };

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
    var resetActivitySummary = function () {
        activitySummary = {
            lastyear: game.calendar.year,
            lastday:  game.calendar.day,
            craft:    {},
            trade:    {},
            build:    {},
            other:    {}
        };
    };

    var storeForSummary = function (name, amount, section) {
        if (amount === undefined) amount = 1;
        if (section === undefined) section = 'other';

        if (activitySummary[section] === undefined)
            activitySummary[section] = {};

        if (activitySummary[section][name] === undefined) {
            activitySummary[section][name] = parseFloat(amount);
        } else {
            activitySummary[section][name] += parseFloat(amount);
        }
    };

    var displayActivitySummary = function () {

        for (var i in activitySummary.other) {
            if (activitySummary.other[i])
                isummary('summary.' + i , [game.getDisplayValueExt(activitySummary.other[i])]);
        }

        // Techs
        for (var name in activitySummary.research) {
            isummary('summary.tech', [ucfirst(name)]);
        }

        // Upgrades
        for (var name in activitySummary.upgrade) {
            isummary('summary.upgrade', [ucfirst(name)]);
        }

        // Buildings
        for (var name in activitySummary.build) {
            isummary('summary.building', [game.getDisplayValueExt(activitySummary.build[name]), ucfirst(name)]);
        }

        // Order of the Sun
        for (var name in activitySummary.faith) {
            isummary('summary.sun', [game.getDisplayValueExt(activitySummary.faith[name]), ucfirst(name)]);
        }

        // Crafts
        for (var name in activitySummary.craft) {
            isummary('summary.craft', [game.getDisplayValueExt(activitySummary.craft[name]), ucfirst(name)]);
        }

        // Trading
        for (var name in activitySummary.trade) {
            isummary('summary.trade', [game.getDisplayValueExt(activitySummary.trade[name]), ucfirst(name)]);
        }

        // Show time since last run. Assumes that the day and year are always higher.
        if (activitySummary.lastyear && activitySummary.lastday) {
            var years = game.calendar.year - activitySummary.lastyear;
            var days = game.calendar.day - activitySummary.lastday;

            if (days < 0) {
                years -= 1;
                days += 400;
            }

            var duration = '';
            if (years > 0) {
                duration += years + ' ';
                duration += (years == 1) ? i18n('summary.year') : i18n('summary.years');
            }

            if (days >= 0) {
                if (years > 0) duration += i18n('summary.separator');
                duration += roundToTwo(days) + ' ';
                duration += (days == 1) ? i18n('summary.day') : i18n('summary.days');
            }

            isummary('summary.head', [duration]);
        }

        // Clear out the old activity
        resetActivitySummary()
    };

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
