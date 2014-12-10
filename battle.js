

actions.fight = function (params, successCallback, errorCallback) {
    checkParams(1, params);
    var monsterKey = params[0];
    var monster = monsters[monsterKey];
    var fightAction = getAreaAction('fight', monster);
    if (!monster || !fightAction) {
        throw new ProgrammingError("There is no '" + monsterKey + "' to fight here.");
    }
    fightAction.perform();
    winBattleCallback = successCallback;
    loseBattleCallback = errorCallback;
}

var fighting = null;
var winBattleCallback = null;
var loseBattleCallback = null;
var winInstantly = false;

function BattleAction(sourceMonster, slot, victoryFunction) {
    var monster = copy(sourceMonster);
    if (!monsters[monster.key]) {
        throw new Exception("Battle Action expects a monster: " + sourceMonster);
    }
    monster.maxHealth = monster.health;
    monster.damaged = 0;
    monster.battleStatus = freshBattleStatus();
    //used to trigger special results when bosses are defeated
    monster.victoryFunction = victoryFunction;
    this.actionName = "fight";
    this.actionTarget = sourceMonster;
    this.monster = monster;
    this.getDiv = function () {
        monster.$element = $('.js-monster').clone().removeClass('js-monster').show();
        monster.$element.find('.js-name').text("Lvl " + monster.level + " " + monster.name);
        monster.$element.find('.js-graphic').html(monster.$graphic);
        updateMonster(monster);
        return $div('action slot' + slot, monster.$element).attr('helpText', monster.helpText);
    };
    this.perform = function () {
        //erase old win/lose callbacks
        winBattleCallback = null;
        loseBattleCallback = null;
        if (fighting === monster) {
            closeAll();
        } else {
            closeAll();
            fighting = monster;
            monster.accruedDamageForDisplay = 0;
            monster.hasHitsToDisplay = false;
            player.nextAttack = 1000 / player.getAttackSpeed();
            monster.nextAttack = 1000 / monster.attackSpeed;
        }
    }
}
function applyCripple(attackSpeed, cripple) {
    return attackSpeed / (1 + Math.log(1 + cripple / 6));
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
            var factor = 1 / player.getTenacity();
            var parry = monster.parry ? monster.parry : 0;
            damage = applyArmorToDamage(damage, Math.max(0, (parry * factor + Math.max(0, monster.armor - monster.battleStatus.armorReduction)) * (1 - armorPierce)));
            if (monster.reflect) {
                var mitigatedDamage = player.getDamage() - damage;
                var reflectedDamage = Math.floor(mitigatedDamage * monster.reflect);
                if (reflectedDamage) {
                    player.health = player.health - reflectedDamage;
                }
            }
        }
        monster.hasHitsToDisplay = true;
        if (damage > 0) {
            monster.health = Math.max(0, monster.health - damage);
            monster.accruedDamageForDisplay += damage;
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
        }
        player.health = Math.max(0, player.health);
        player.nextAttack += 1000 / player.getAttackSpeed();
    }
    monster.nextAttack -= deltaTime;
    if (monster.nextAttack <= 0) {
        var factor = 1 / player.getTenacity();
        var armorPierce = monster.armorPierce ? (factor * monster.armorPierce) : 0;
        var damage = applyArmorToDamage(monster.damage, Math.max(0, player.getArmor() * (1 - armorPierce)));
        var mitigatedDamage = monster.damage - damage;
        var reflectedDamage = Math.floor(mitigatedDamage * getTotalEnchantment('reflect'));
        if (reflectedDamage) {
            monster.health = Math.max(0, monster.health - reflectedDamage);
        }
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
        }
        monster.nextAttack += 1000 / monsterAttackSpeed(monster);
    }
    if (winInstantly || monster.health <= 0) {
        gainExperience(Math.floor(monster.experience * (1 + getTotalEnchantment('experience'))), monster.level);
        player.defeatedMonsters[monster.key]++;

        var dropIndex = getDropIndex(monster);
        for (var i = dropIndex; i < monster.spoils.length; i++) {
            var dropValue = monster.spoils[i];
            if (typeof(dropValue) === 'string' && allItems[dropValue]) {
                var item = allItems[dropValue];
                player.inventory[item.slot][dropValue]++;
                if (player.specialSkills.lucky) {
                    player.inventory[item.slot][dropValue]++;
                }
                //reset coolingMagma timer each time you gain one from battle
                if (item.key == 'coolingMagma') {
                    items.coolingMagma.timer = 30000;
                }
                uiNeedsUpdate[item.slot] = true;
            } else if (typeof(dropValue) === 'number') {
                player.gold += dropValue;
                if (player.specialSkills.lucky) {
                    player.gold += dropValue;
                }
            }
        }
        stopFighting(true);
        if (monster.victoryFunction) {
            monster.victoryFunction();
        }
        recordAction('fight', monster.key);
        return;
    }
    if (player.health <= 0) {
        stopFighting(false);
    }
}
/**
 * Shows a number on the enemy graphic indicating how much damage has happened
 * since the last time this method has been called (or the start of battle),
 * if the player has hit the monster since then. Damage will show even if 0,
 * although 0 damage may not be possible in the game any longer
 */
function showAccruedDamageOnMonster() {
    var monster = fighting;
    if (!monster || !monster.hasHitsToDisplay || damageCounterRefresh > 0) {
        return;
    }
    damageCounterRefresh = 3;
    //show damage animation only when the game speed is below 30
    var $damage = $('<span style="color: #f04; position: absolute; top: 0px; font-size: 30px; font-weight: bold;">' + monster.accruedDamageForDisplay + '</span>');
    monster.$element.find('.js-graphic').append($damage);
    $damage.animate({top: "-=50"}, 500,
        function () {
            $damage.remove();
        }
    );
    monster.hasHitsToDisplay = false;
    monster.accruedDamageForDisplay = 0;
}
function applyArmorToDamage(damage, armor) {
    //This equation looks a bit funny but is designed to have the following properties:
    //100% damage at 0 armor
    //50% damage when armor is 1/3 of base damage
    //25% damage when armor is 2/3 of base damage
    //1/(2^N) damage when armor is N/3 of base damage
    return Math.max(1, Math.round(damage / Math.pow(2, 3 * armor / damage)));
}
function processStatusEffects(target, deltaTime) {
    //always process this for player in case the player has a special DOT on them
    if (target.battleStatus.poisonDamage || target.isPlayer) {
        var damage = Math.min(target.battleStatus.poisonDamage, target.battleStatus.poisonRate * deltaTime / 100);
        //console.log(target.battleStatus.dealtPoisonDamage + ' + ' + damage);
        //dealtPoisonDamage accrues the floating point damage from poison over time
        target.battleStatus.dealtPoisonDamage += damage;
        //use the dealt poison damage to accrue extra DOT from cooling magma and other sources during battles
        if (target.isPlayer) {
            target.battleStatus.dealtPoisonDamage += player.getDamageOverTime() * deltaTime / 1000;
        }
        //when it is greater than 1 damage is dealt to the targets health and remove from dealtPoisonDamage
        if (target.battleStatus.dealtPoisonDamage > 1) {
            target.health = Math.max(0, target.health - Math.floor(target.battleStatus.dealtPoisonDamage));
            target.battleStatus.dealtPoisonDamage = target.battleStatus.dealtPoisonDamage % 1;
        }
        target.battleStatus.poisonDamage -= damage;
    } else {
        //poison rate is reduced back to 0 if poison ever clears the target's system
        target.battleStatus.poisonRate = 0;
    }
    if (target.battleStatus.crippled) {
        target.battleStatus.crippled = Math.max(0, target.battleStatus.crippled - deltaTime / 1000);
    }
}

function stopFighting(victory) {
    player.battleStatus = freshBattleStatus();
    if (fighting) {
        showAccruedDamageOnMonster();
        var oldMonster = fighting;
        fighting = null;
        if (!oldMonster.doNotRegenerate) {
            oldMonster.health = oldMonster.maxHealth;
        }
        oldMonster.damaged = 0;
        oldMonster.battleStatus = freshBattleStatus();
        updateMonster(oldMonster);
        if (victory && winBattleCallback) {
            winBattleCallback();
            winBattleCallback = null;
        }
        if (!victory && loseBattleCallback) {
            loseBattleCallback('You did not defeat the ' + oldMonster.name);
            loseBattleCallback = null;
        }
        removeToolTip();
    }
    uiNeedsUpdate.playerStats = true;
}

function updateMonster(monster) {
    var $monster = monster.$element;
    if (!$monster) {
        return;
    }
    $monster.find('.js-experience').text(monster.experience);
    $monster.find('.js-currentHealth').text(Math.ceil(monster.health));
    $monster.find('.js-maxHealth').text(Math.ceil(monster.maxHealth));
    $monster.find('.js-damage').text(monster.damage);
    $monster.find('.js-attackSpeed').text(monsterAttackSpeed(monster).toFixed(2));
    $monster.find('.js-armor').text(Math.max(0, monster.armor - monster.battleStatus.armorReduction));
    var healthPercent = monster.health / monster.maxHealth;
    $monster.find('.js-healthFill').css('width', (100 * healthPercent) + '%');
    var dropIndex = getDropIndex(monster)
    var $itemRow = $monster.find('.js-spoils').remove().first();
    for (var i = dropIndex; i < monster.spoils.length; i++) {
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
function monsterAttackSpeed(monster) {
    var attackSpeed = applyCripple(monster.attackSpeed, monster.battleStatus.crippled);
    if (fighting == monster && player.helmet == helmets.proudHat) {
        attackSpeed *= .9;
    }
    return attackSpeed;
}
function scheduleMonsterForUpdate(monster) {
    uiNeedsUpdate.monsters[monster.key] = monster;
}

function getDropIndex(monster) {
    return Math.min(Math.max(0, monster.spoils.length - 1), Math.floor(Math.log(1 + (monster.damaged ? monster.damaged : 0) / (1 + player.poachingSkill)) / Math.log(2)));
}