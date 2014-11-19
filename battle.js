

actions.fight = function (params, successCallback, errorCallback) {
    if (paramError(1, params, errorCallback)) return;
    var monsterKey = params[0];
    var monster = monsters[monsterKey];
    var fightAction = getAreaAction('fight', monster);
    if (!fightAction) {
        errorCallback("There is no '" + monsterKey + "' to fight here.");
        return;
    }
    fightAction.perform();
    endBattleCallback = successCallback;
}

var fighting = null;
var endBattleCallback = null;

function BattleAction(sourceMonster, slot, victoryFunction) {
    var monster = copy(sourceMonster);
    monster.maxHealth = monster.health;
    monster.damaged = 0;
    //used to trigger special results when bosses are defeated
    monster.victoryFunction = victoryFunction;
    this.actionName = "fight";
    this.actionTarget = sourceMonster;
    this.getDiv = function () {
        monster.$element = $('.js-monster').clone().removeClass('js-monster').show();
        updateMonster(monster);
        return $div('action slot' + slot, monster.$element).attr('helpText', 'Fight this monster to gain experience and ingredients or gold. The quality of the ingredients decreases the more you attack a monster. Increase your poaching skill and damage to obtain better ingredients.');
    };
    this.perform = function () {
        if (fighting === monster) {
            closeAll();
        } else {
            closeAll();
            fighting = monster;
            player.nextAttack = 1000 / player.getAttackSpeed();
            monster.nextAttack = 1000 / monster.attackSpeed;
            monster.damaged = 0;
            updateMonster(monster);
        }
    }
}
var winInstantly = false;
function fightLoop(currentTime, deltaTime) {
    var monster = fighting;
    player.nextAttack -= deltaTime;
    if (player.nextAttack <= 0) {
        var damage = Math.max(0, player.getDamage() - monster.armor);
        if (damage > 0) {
            monster.health = Math.max(0, monster.health - damage);
            player.nextAttack += 1000 / player.getAttackSpeed();
            monster.damaged++;
            updateMonster(monster);
        }
    }
    monster.nextAttack -= deltaTime;
    if (monster.nextAttack <= 0) {
        player.health = Math.max(0, player.health - Math.max(0, monster.damage - player.getArmor()));
        monster.nextAttack += 1000 / monster.attackSpeed;
        updatePlayerStats();
    }
    if (winInstantly || monster.health <= 0) {
        gainExperience(monster.experience, monster.level);

        var dropIndex = Math.min(monster.spoils.length - 1, Math.floor(monster.damaged / (1 + player.poachingSkill)));
        for (var i = dropIndex; i < monster.spoils.length; i++) {
            var dropValue = monster.spoils[i];
            if (typeof(dropValue) === 'string' && allItems[dropValue]) {
                var item = allItems[dropValue];
                player.inventory[item.slot][dropValue]++;
                refreshInventoryPanel(item.slot);
            } else if (typeof(dropValue) === 'number') {
                player.gold += dropValue;
                updateGold();
            }
        }
        stopFighting();
        if (monster.victoryFunction) {
            monster.victoryFunction();
        }
        recordAction('fight', monster.key);
    }
    if (player.health <= 0) {
        stopFighting();
    }
}

function stopFighting() {
    if (fighting) {
        var oldMonster = fighting;
        fighting = null;
        oldMonster.health = oldMonster.maxHealth;
        oldMonster.damaged = 0;
        updateMonster(oldMonster);
        if (endBattleCallback) {
            endBattleCallback();
            endBattleCallback = null;
        }
    }
}

function updateMonster(monster) {
    var $monster = monster.$element;
    if (monster === fighting) {
        $monster.find('.js-action').text('Retreat from ');
    } else {
        $monster.find('.js-action').text('Attack ');
    }
    $monster.find('.js-graphic').html(monster.$graphic);
    $monster.find('.js-name').text("Lvl " + monster.level+ " " + monster.name);
    $monster.find('.js-experience').text(monster.experience);
    $monster.find('.js-currentHealth').text(monster.health);
    $monster.find('.js-maxHealth').text(monster.maxHealth);
    $monster.find('.js-damage').text(monster.damage);
    $monster.find('.js-attackSpeed').text(monster.attackSpeed);
    $monster.find('.js-armor').text(monster.armor);
    var healthPercent = monster.health / monster.maxHealth;
    $monster.find('.js-healthFill').css('width', (100 * healthPercent) + '%');
    var index = Math.min(monster.spoils.length - 1, Math.floor(monster.damaged / (1 + player.poachingSkill)));
    var $itemRow = $monster.find('.js-spoils').remove().first();
    for (var i = index; i < monster.spoils.length; i++) {
        item = monster.spoils[i];
        if (typeof(item) === 'string' && allItems[item]) {
            $itemRow.find('.js-item').text(allItems[item].name);
        } else if (typeof(item) === 'number') {
            $itemRow.find('.js-icon').removeClass('item').addClass('gold');
            $itemRow.find('.js-item').text(item);
        } else {
            $itemRow.find('.js-item').text(typeof(item));
        }
        $monster.find('.js-spoilsContainer').append($itemRow.clone());
    }
}