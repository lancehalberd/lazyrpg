
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

//populate monster.key for all monsters
$.each(minerals, function (key, value) { value.key = key;});

actions.mine = function (params, successCallback, errorCallback) {
    if (paramError(1, params, errorCallback)) return;
    var mineralKey = params[0];
    var mineral = minerals[mineralKey];
    var mineAction = getAreaAction('mine', mineralKey);
    if (!mineAction) {
        errorCallback("There is no '" + mineralKey + "' to mine here.");
        return;
    }
    mineAction.perform();
    endMiningCallback = successCallback;
}

var mining = null;
var endMiningCallback = null;

function MiningAction(mineral, slot) {
    mineral.timeLeft = mineral.time;
    this.actionName = "mine";
    this.actionTarget = mineral.key;
    this.getDiv = function () {
        mineral.$element = $('.js-mineral').clone().removeClass('js-mineral').show();
        mineral.$element.find('.js-graphic').html(mineral.$graphic);
        mineral.$element.find('.js-name').text(mineral.item.name);
        updateMineral(mineral);
        return $div('action slot' + slot, mineral.$element).attr('helpText', 'You can mine here, but it will drain your health over time.');
    };
    this.perform = function () {
        if (mining === mineral) {
            closeAll();
        } else {
            closeAll();
            mining = mineral;
            //these are stored on the mineral as a hack since we don't
            //track floating point life, but need to track floating point damage
            mineral.damageDealt = 0;
            mineral.initialPlayerHealth = player.health;
            updateMineral(mineral);
        }
    };
}

function miningLoop(currentTime, deltaTime) {
    var mineral = mining;
    var miningSpeed = (1 + player.miningSkill + player.bonuses.miningSpeed.plus) * (player.bonuses.miningSpeed.multi);
    var miningVitality = (1 + player.miningSkill + player.bonuses.miningVitality.plus) * (player.bonuses.miningVitality.multi);
    mineral.timeLeft -= miningSpeed * deltaTime / 1000;
    mineral.damageDealt += mineral.damage * deltaTime / 1000 / miningVitality;
    player.health = Math.max(0, Math.round(mineral.initialPlayerHealth - mineral.damageDealt));
    if (mineral.timeLeft <= 0) {
        var item = mineral.item;
        player.inventory[item.slot][item.key]++;
        refreshInventoryPanel(item.slot);
        stopMining();
        recordAction('mine', mineral.key);
    }
    if (player.health <= 0) {
        stopMining();
    }
}

function stopMining() {
    if (mining) {
        var mineral = mining;
        mining = null;
        mineral.timeLeft = mineral.time;
        updateMineral(mineral);
        if (endMiningCallback) {
            endMiningCallback();
            endMiningCallback = null;
        }
    }
}

function updateMineral(mineral) {
    var $mineral = mineral.$element;
    if (mineral === mining) {
        $mineral.find('.js-action').text('Mining');
    } else {
        $mineral.find('.js-action').text('Mine');
    }
    var timePercent = mineral.timeLeft / mineral.time;
    $mineral.find('.js-timeFill').css('width', (100 * timePercent) + '%');
}