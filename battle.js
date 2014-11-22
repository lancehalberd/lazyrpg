

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
var winInstantly = false;

function BattleAction(sourceMonster, slot, victoryFunction) {
    var monster = copy(sourceMonster);
    monster.maxHealth = monster.health;
    monster.damaged = 0;
    monster.battleStatus = freshBattleStatus();
    //used to trigger special results when bosses are defeated
    monster.victoryFunction = victoryFunction;
    this.actionName = "fight";
    this.actionTarget = sourceMonster;
    this.getDiv = function () {
        monster.$element = $('.js-monster').clone().removeClass('js-monster').show();
        monster.$element.find('.js-name').text("Lvl " + monster.level + " " + monster.name);
        monster.$element.find('.js-graphic').html(monster.$graphic);
        updateMonster(monster);
        return $div('action slot' + slot, monster.$element).attr('helpText', monster.helpText);
    };
    this.perform = function () {
        if (fighting === monster) {
            closeAll();
        } else {
            closeAll();
            fighting = monster;
            player.nextAttack = 1000 / player.getAttackSpeed();
            monster.nextAttack = 1000 / monster.attackSpeed;
            updateMonster(monster);
        }
    }
}
function fightLoop(currentTime, deltaTime) {
    var monster = fighting;
    processStatusEffects(player, deltaTime);
    processStatusEffects(monster, deltaTime);
    player.nextAttack -= deltaTime;
    if (player.nextAttack <= 0) {
        var armorPierce = player.getArmorPierce();
        var damage = player.getDamage();
        if (!player.specialSkills.scan) {
            damage = Math.max(0, damage - Math.max(0, (monster.armor - monster.battleStatus.armorReduction) * (1 - armorPierce)));
        }
        if (gameSpeed < 30) {
            //show damage animation only when the game speed is below 30
            var $damage = $('<span style="color: #f04; position: absolute; top: 0px; font-size: 30px; font-weight: bold;">' + damage + '</span>');
            monster.$element.find('.js-graphic').append($damage);
            $damage.animate({top: "-=50"}, 500,
                function () {
                    $damage.remove();
                }
            );
        }
        if (damage > 0) {
            monster.health = Math.max(0, monster.health - damage);
            if (!player.specialSkills.poach) {
                monster.damaged++;
            }
        }
        var armorBreak = player.getArmorBreak();
        if (armorBreak) {
            monster.battleStatus.armorReduction += armorBreak;
        }
        var cripple = player.getCripple();
        if (cripple) {
            monster.battleStatus.crippled += cripple;
        }
        var poison = player.getPoison();
        if (poison) {
            monster.battleStatus.poisonDamage += poison;
            monster.battleStatus.poisonRate++;
        }
        var lifeSteal = player.getLifeSteal();
        if (lifeSteal) {
            player.health = Math.min(player.getMaxHealth(), player.health + Math.floor(damage * lifeSteal));
            if (gameSpeed < 30) {
                updatePlayerLife();
            }
        }
        if (gameSpeed < 30) {
            updateMonster(monster);
        }
        player.nextAttack += 1000 / player.getAttackSpeed();
    }
    monster.nextAttack -= deltaTime;
    if (monster.nextAttack <= 0) {
        var factor = player.specialSkills.stoic ? .5 : 1;
        var armorPierce = monster.armorPierce ? (factor * monster.armorPierce) : 0;
        var damage = Math.max(0, monster.damage - player.getArmor() * (1 - armorPierce));
        player.health = Math.max(0, player.health - damage);
        if (monster.armorBreak) {
            player.battleStatus.armorReduction += Math.floor(factor * monster.armorBreak);
        }
        if (monster.cripple) {
            player.battleStatus.crippled += Math.floor(factor * monster.cripple);
        }
        if (monster.poison) {
            player.battleStatus.poisonDamage += Math.floor(factor * monster.poison);
            player.battleStatus.poisonRate += Math.floor(factor);
        }
        if (monster.lifeSteal) {
            monster.health = Math.min(monster.maxHealth, monster.health + Math.floor(damage * factor * monster.lifeSteal));
            if (gameSpeed < 30) {
                updateMonster(monster);
            }
        }
        monster.nextAttack += 1000 / applyCripple(monster.attackSpeed, monster.battleStatus.crippled);
        if (gameSpeed < 30) {
            updatePlayerStats();
        }
    }
    if (winInstantly || monster.health <= 0) {
        gainExperience(monster.experience, monster.level);

        var dropIndex = Math.min(monster.spoils.length - 1, Math.floor(monster.damaged / (1 + player.poachingSkill)));
        for (var i = dropIndex; i < monster.spoils.length; i++) {
            var dropValue = monster.spoils[i];
            if (typeof(dropValue) === 'string' && allItems[dropValue]) {
                var item = allItems[dropValue];
                player.inventory[item.slot][dropValue]++;
                if (player.specialSkills.lucky) {
                    player.inventory[item.slot][dropValue]++;
                }
                refreshInventoryPanel(item.slot);
            } else if (typeof(dropValue) === 'number') {
                player.gold += dropValue;
                if (player.specialSkills.lucky) {
                    player.gold += dropValue;
                }
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
function processStatusEffects(target, deltaTime) {
    if (target.battleStatus.poisonDamage) {
        var damage = Math.min(target.battleStatus.poisonDamage, target.battleStatus.poisonRate * deltaTime / 100);
        //console.log(target.battleStatus.dealtPoisonDamage + ' + ' + damage);
        //dealtPoisonDamage accrues the floating point damage from poison over time
        target.battleStatus.dealtPoisonDamage += damage;
        //when it is greater than 1 damage is dealt to the targets health and remove from dealtPoisonDamage
        if (target.battleStatus.dealtPoisonDamage > 1) {
            target.health = Math.max(0, target.health - Math.floor(target.battleStatus.dealtPoisonDamage));
            target.battleStatus.dealtPoisonDamage = target.battleStatus.dealtPoisonDamage % 1;
            if (gameSpeed < 30) {
                if (target.isPlayer) {
                    updatePlayerLife();
                } else {
                    updateMonster(target);
                }
            }
        }
        target.battleStatus.poisonDamage -= damage;
    } else {
        //poison rate is reduced back to 0 if poison ever clears the target's system
        target.battleStatus.poisonRate = 0;
    }
    if (target.battleStatus.crippled) {
        target.battleStatus.crippled = Math.max(0, target.battleStatus.crippled - deltaTime / 1000);
        if (gameSpeed < 30) {
            if (target.isPlayer) {
                updatePlayerStats();
            } else {
                updateMonster(target);
            }
        }
    }
}

function stopFighting() {
    player.battleStatus = freshBattleStatus();
    updatePlayerStats();
    if (fighting) {
        var oldMonster = fighting;
        fighting = null;
        oldMonster.health = oldMonster.maxHealth;
        oldMonster.damaged = 0;
        oldMonster.battleStatus = freshBattleStatus();
        updateMonster(oldMonster);
        if (endBattleCallback) {
            endBattleCallback();
            endBattleCallback = null;
        }
    }
}

function updateMonster(monster) {
    var $monster = monster.$element;
    $monster.find('.js-experience').text(monster.experience);
    $monster.find('.js-currentHealth').text(monster.health);
    $monster.find('.js-maxHealth').text(monster.maxHealth);
    $monster.find('.js-damage').text(monster.damage);
    $monster.find('.js-attackSpeed').text(applyCripple(monster.attackSpeed, monster.battleStatus.crippled).toFixed(2));
    $monster.find('.js-armor').text(Math.max(0, monster.armor - monster.battleStatus.armorReduction));
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