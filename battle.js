
var fighting = null;
var winInstantly = false;

actions.wait = function (params) {
    checkParams(1, params);
    player.delay = 1000 * parseFloat(params[0]);
};
actions.attack = function (params) {
    if (params.length < 1) {
        throw new ProgrammingError("You must specify what you are attacking");
    }
    if (params.length > 2) {
        throw new ProgrammingError("Expected at most 2 values, found " + params.length);
    }
    var type = params[0];
    if (!currentArea.agentsByKey[type]) {
        throw new ProgrammingError("There is no " + type + " here for you to attack.");
    }
    var index = 0;
    if (params.length == 2) {
        index = parseInt(params[1]);
    } else {
        for (index = 0; index < currentArea.agentsByKey[type].length; index++) {
            if (currentArea.agentsByKey[type][index].active) {
                break;
            }
        }
        if (index >= currentArea.agentsByKey[type].length) {
            index = 0;
        }
    }
    if (!currentArea.agentsByKey[type][index].active) {
        throw new ProgrammingError("That target has already been defeated.");
    }
    player.delay = (1000 / player.getAttackSpeed());
    player.method = function () {
        attackTarget(currentArea.agentsByKey[type][index]);
    }
};

function attackTarget(monster) {
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
    monster.damageDisplay.updated = true;
    if (damage > 0) {
        monster.health = Math.max(0, monster.health - damage);
        if (!player.specialSkills.poach) {
            monster.damaged++;
        }
        monster.damageDisplay.amount += damage;
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
        player.gainLife(Math.floor(damage * lifeSteal));
    }
    player.health = Math.max(0, player.health);
    scheduleMonsterForUpdate(monster);
}

function MonsterAgent(data) {
    var monster = this;
    this.area = null; //Will be set when this agent is placed in an area
    this.agentType = 'monster';
    this.active = true;
    this.top = data.top;
    this.left = data.left;
    if (!data.monster || !monsters[data.monster.key]) {
        throw new Exception("Battle Action expects a monster: " + data.monster);
    }
    //copy the values from the monster onto this agent
    $.each(data.monster, function (key, value) {
        monster[key] = copy(value);
    });
    this.maxHealth = this.health;
    //used to trigger special results when bosses are defeated
    this.victoryFunction = data.victoryFunction;
    this.reset = function () {
        this.health = this.maxHealth;
        this.damaged = 0;
        this.battleStatus = freshBattleStatus();
        this.active = true;
        this.timeDefeated = 0;
        this.damageDisplay = new DamageDisplay(this);
        scheduleMonsterForUpdate(this);
    };
    this.update = function () {
        if (this.area != currentArea) {
            return;
        }
        if (!this.$element) {
            this.$element = $('.js-monster').clone().removeClass('js-monster').show();
            this.$element.find('.js-graphic')
                .html(this.$graphic)
                .attr('helpText', this.helpText);
            this.$wrapper = $div('', this.$element).css('position', 'absolute').css('left', (data.left - 480) + 'px').css('top', (data.top - 300) + 'px');
        }
        var $monster = this.$element;
        if (this.active) {
            var $container = $('.js-areaAgents');
            if (!this.$wrapper.closest($container).length) {
                $container.append(this.$wrapper);
            }
            var index = this.area.agentsByKey[this.key].indexOf(this);
            this.$element.find('.js-graphic').attr('code', 'attack ' + this.key + ' ' + index);
        } else {
            this.$wrapper.remove();
            this.$element.find('.js-graphic').removeAttr('code');
        }
        this.needsUpdate = false;
        if (this.plague) {
            $monster.find('.js-plagueFill').css('width', (100 * this.plague / maxPlague(this)) + '%');
        } else {
            $monster.find('.js-plagueFill').css('width', 0 + '%');
        }
        if (this.health < this.maxHealth) {
            $monster.addClass('damaged');
        } else {
            $monster.removeClass('damaged');
        }
        $monster.find('.js-name').text('Lvl ' + this.level + ' ' + this.name);
        $monster.find('.js-experience').text(this.experience + ' XP');
        $monster.find('.js-currentHealth').text(Math.ceil(this.health));
        $monster.find('.js-maxHealth').text(Math.ceil(this.maxHealth));
        $monster.find('.js-damage').text(this.damage);
        $monster.find('.js-attackSpeed').text(monsterAttackSpeed(this).toFixed(2));
        $monster.find('.js-armor').text(Math.max(0, this.armor - this.battleStatus.armorReduction));
        var healthPercent = this.health / this.maxHealth;
        $monster.find('.js-healthFill').css('width', (100 * healthPercent) + '%');
        healthPercent = Math.min(1, (this.health + getRecover(this)) / this.maxHealth);
        $monster.find('.js-recoverFill').css('width', (100 * healthPercent) + '%');
        var $itemRow = $monster.find('.js-spoils').remove().first();
        for (var i = 0; i < this.spoils.length; i++) {
            item = this.spoils[i];
            if (!item) {
                continue;
            }
            if (typeof(item) === 'string' && allItems[item]) {
                $itemRow.find('.js-item').text(allItems[item].name);
            } else if (typeof(item) === 'number') {
                $itemRow.find('.js-icon').removeClass('item').addClass('gold');
                $itemRow.find('.js-item').text(item);
            } else {
                $itemRow.find('.js-item').text(typeof(item));
            }
            var chance = getDropChance(this, i, this.spoils.length, true);
            $itemRow.find('.chance').text((100 * chance).toFixed(0) + '%');
            $monster.find('.js-spoilsContainer').append($itemRow.clone());
        }
    }
    this.reset();
}
function addMonsterAgent(area, monsterAgent) {
    if (!area.agentsByKey[monsterAgent.key]) {
        area.agentsByKey[monsterAgent.key] = [];
    }
    var placed = false;
    for (var i = 0; i < area.agentsByKey[monsterAgent.key].length; i++) {
        if (!area.agentsByKey[monsterAgent.key][i]) {
            area.agentsByKey[monsterAgent.key][i] = monsterAgent;
            placed = true;
            break;
        }
    }
    if (!placed) {
        area.agentsByKey[monsterAgent.key].push(monsterAgent);
    }
    area.agents.push(monsterAgent);
    monsterAgent.area = area;
}
function applyCripple(attackSpeed, cripple) {
    return attackSpeed / (1 + Math.log(1 + cripple / 6));
}
function attackPlayer(monster, deltaTime) {
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
/**
 * Shows a number on the enemy graphic indicating how much damage has happened
 * since the last time this method has been called (or the start of battle),
 * if the player has hit the monster since then. Damage will show even if 0,
 * although 0 damage may not be possible in the game any longer
 */
function showAccruedDamage() {
    for (var i = 0; i < damageDisplays.length; i++) {
        var damageDisplay = damageDisplays[i];
        if (damageDisplay.counter > 0) {
            damageDisplay.counter--;
            continue;
        }
        if (!damageDisplay.updated) {
            if (!damageDisplay.agent.active) {
                damageDisplays.splice(i--, 1);
            }
            continue;
        }
        //show damage animation only when the game speed is below 30
        var $damage = $('<span style="color: #f04; font-size: 30px; font-weight: bold;">' + damageDisplay.amount + '</span>');
        $damage.css('position', 'absolute').css('top', (damageDisplay.top - 300) + 'px').css('left', (damageDisplay.left - 480) + 'px');
        $('.js-areaOverlay').append($damage);
        $damage.animate({top: "-=50"}, 500,
            function () {
                $damage.remove();
            }
        );
        damageDisplay.counter = 3;
        damageDisplay.updated = false;
        damageDisplay.amount = 0;
    }
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

function getRecover(monster) {
    return Math.max(0, (monster.recover ? monster.recover : 0) - monster.battleStatus.poisonDamage)
}

function monsterAttackSpeed(monster) {
    var attackSpeed = applyCripple(monster.attackSpeed, monster.battleStatus.crippled);
    if (fighting == monster && player.helmet == helmets.proudHat) {
        attackSpeed *= .9;
    }
    return attackSpeed;
}
function scheduleMonsterForUpdate(monster) {
    monster.needsUpdate = true;
}

function getDropChance(monster, index, total, getForNextHit) {
    //last item in the list has 100% drop chance
    if (index === total - 1) {
        return 1;
    }
    var slot = total - index - 1;
    var damage = monster.damaged ? monster.damaged : 0;
    // We use damage + 1 since this most accurately shows what the % will be when
    // the enemy is defeated since the player most likely needs to hit it once more
    // before it is beaten. If the player has the special poach skill, then we do
    // not do this since damage is always 0.
    if (getForNextHit && !player.specialSkills.poach) {
        damage++;
    }
    var power = Math.floor(damage / (Math.pow(2, total - slot - 1) * (1 + player.poachingSkill)));
    return Math.min(1, Math.max(.01, Math.pow(.5 + .1 * player.poachingSkill, power)));
}