
items.copperOre = {
    'name': 'Copper Ore',
    'helpText': 'Raw copper ore.',
    'value': 10
};
items.copperIngot = {
    'name': 'Copper Ingot',
    'helpText': 'Refined copper that can be used for crafting.',
    'value': 150
};
items.tin = {
    'name': 'Tin',
    'helpText': 'Raw tin.',
    'value': 50
};
items.bronzePlating = {
    'name': 'Bronze Plating',
    'helpText': 'An alloy of copper and tin suitable for crafting armor',
    'value': 250
};
items.ironOre = {
    'name': 'Iron Ore',
    'helpText': 'Raw iron ore.',
    'value': 30
};
items.ironIngot = {
    'name': 'Iron Ingot',
    'helpText': 'Refined iron that can be used for crafting.',
    'value': 300
};
items.steelPlating = {
    'name': 'Steel Plating',
    'helpText': 'Plates of an alloy of iron and carbon for crafting armor.',
    'value': 1600
};
items.silverOre = {
    'name': 'Silver Ore',
    'helpText': 'Raw silver ore.',
    'value': 200
};
items.silverIngot = {
    'name': 'Silver Ingot',
    'helpText': 'Refined silver that can be used for crafting, but it isn\'t very hard.',
    'value': 2000
};
items.steeledSilver = {
    'name': 'Steeled Silver',
    'helpText': 'A stronger silver alloy. Weaker than regular steel but it repels evil.',
    'value': 4000
};
items.mithrilSilver = {
    'name': 'Mithril Silver',
    'helpText': 'A silver alloy that is even stronger than steel.',
    'value': 8000
};
items.goldOre = {
    'name': 'Gold Ore',
    'helpText': 'Raw gold ore.',
    'value': 400
};
items.goldIngot = {
    'name': 'Gold Ingot',
    'helpText': 'Refined gold that can be used for crafting. It is quite soft for a metal.',
    'value': 4000
};
items.orchialcum = {
    'name': 'Orchialcum',
    'helpText': 'An alloy that is more resilient than mithril yet easier to craft with.',
    'value': 10000
};
items.platinumOre = {
    'name': 'Platinum Ore',
    'helpText': 'Rare platinum ore.',
    'value': 1000
};
items.platinumIngot = {
    'name': 'Platinum Ingot',
    'helpText': 'Refined platinum that can be used for crafting. Somewhat harder than iron.',
    'value': 6000
};
items.titaniumOre = {
    'name': 'Titanium Ore',
    'helpText': 'Raw titanium ore.',
    'value': 5000
};
items.adamantiumOre = {
    'name': 'Adamantium Ore',
    'helpText': 'Raw adamantium ore.',
    'value': 20000
};
items.quartz = {
    'name': 'Quartz',
    'value': 14
};

var minerals = {};
function $mineralGraphic(name) {
    return $div('mineralGraphic '+name);
}

minerals.copper = {
    'item': items.copperOre,
    'time': 20,
    'damage' : 20,
    '$graphic': $mineralGraphic('copper')
};
minerals.tin = {
    'item': items.tin,
    'time': 30,
    'damage' : 40,
    '$graphic': $mineralGraphic('copper')
};
minerals.iron = {
    'item': items.ironOre,
    'time': 40,
    'damage' : 50,
    '$graphic': $mineralGraphic('iron')
};
minerals.silver = {
    'item': items.silverOre,
    'time': 60,
    'damage' : 100,
    '$graphic': $mineralGraphic('iron')
};
minerals.gold = {
    'item': items.goldOre,
    'time': 50,
    'damage' : 80,
    '$graphic': $mineralGraphic('copper')
};

//populate monster.key for all monsters
$.each(minerals, function (key, value) { value.key = key;});

var mining = null;
/**
 * Moves to the area with the given key. Throws an error if no such area exists
 * or if there is no route to that area.
 */
actions.mine = function (params) {
    checkParams(1, params);
    var action = targets.mine[params[0]];
    if (!action) {
        throw new ProgrammingError("There is no '" + params[0] + "' to mine here.");
    }
    action(params);
}
function MiningAction(mineral, slot, onCompleteFunction) {
    mineral.timeLeft = mineral.time;
    mineral.onCompleteFunction = onCompleteFunction;
    this.getDiv = function () {
        mineral.$element = $('.js-mineral').clone().removeClass('js-mineral').show();
        mineral.$element.find('.js-graphic').html(mineral.$graphic);
        mineral.$element.find('.js-name').text(mineral.item.name);
        updateMineral(mineral);
        return $div('action slot' + slot, mineral.$element).attr('helpText', 'You can mine here, but it will drain your health over time.');
    };
    this.action = function () {
        if (mining === mineral) {
            return "stop";
        }
        return "mine " + mineral.key;
    };
    this.addActions = function () {
        targets.mine[mineral.key] = function (params) {
            checkParams(1, params);
            var mineralKey = params[0];
            var mineral = minerals[mineralKey];
            if (player.health <= 0) {
                throw new ProgrammingError("You need more health to mine.");
            }
            mining = mineral;
            //these are stored on the mineral as a hack since we don't
            //track floating point life, but need to track floating point damage
            mineral.damageDealt = 0;
            mineral.initialPlayerHealth = player.health;
            uiNeedsUpdate.miningStats = true
        }
    };
}

function miningLoop(currentTime, deltaTime) {
    var mineral = mining;
    var miningSpeed = (1 + player.miningSkill + player.bonuses.miningSpeed.plus) * (player.bonuses.miningSpeed.multi) * (1 + getTotalEnchantment('miningSpeed'));
    var vigor = (1 + player.miningSkill) * (player.bonuses.vigor.multi) * (1 + getTotalEnchantment('vigor'));
    mineral.timeLeft -= miningSpeed * deltaTime / 1000;
    mineral.damageDealt += (player.getDamageOverTime() + mineral.damage / vigor) * deltaTime / 1000;
    player.health = Math.max(0, Math.round(mineral.initialPlayerHealth - mineral.damageDealt));
    if (mineral.timeLeft <= 0 || winInstantly) {
        var item = mineral.item;
        player.inventory[item.slot][item.key]++;
        uiNeedsUpdate[item.slot] = true;
        mineral.timeLeft = mineral.time;
        stopMining();
        if (mineral.onCompleteFunction) {
            mineral.onCompleteFunction();
        }
    }
    if (player.health <= 0) {
        stopMining();
    }
    uiNeedsUpdate.playerStats = true;
    uiNeedsUpdate.miningStats = true;
}

function stopMining() {
    if (mining) {
        var mineral = mining;
        mining = null;
        updateMineral(mineral);
        uiNeedsUpdate.miningStats = false;
        removeToolTip();
    }
}

function updateMineral(mineral) {
    var $mineral = mineral.$element;
    if (mineral === mining) {
        $mineral.find('.js-action').text('Mining');
    } else {
        $mineral.find('.js-action').text('Mine');
    }
    $mineral.show();
    var timePercent = mineral.timeLeft / mineral.time;
    $mineral.find('.js-timeFill').css('width', (100 * timePercent) + '%');
}