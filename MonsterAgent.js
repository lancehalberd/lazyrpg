var enemyCode = {
    'basicLoop': "\
        while (my.health = my.maxHealth) { \n\
            wait .2\n\
        }\n\
        if area.player {\n\
            attack player\n\
        } else {\n\
            rest\n\
        }"
};

function getMonsterStats(monster, parts) {
    switch (parts[0]) {
        case 'health': return monster.health;
        case 'maxHealth': return monster.maxHealth;
        case 'damage': return monster.damage;
        case 'attackSpeed': return monster.attackSpeed;
        case 'armor': return monster.armor;
        case 'level': return monster.level;
        case 'experience': return monster.experience;
        default:
            throw new ProgrammingError("Invalid expression: '" + expression + "'.");
    }
}
function MonsterAgent(data) {
    var monster = this;
    if (!data.monster || !monsters[data.monster.key]) {
        throw new Exception("Battle Action expects a monster: " + data.monster);
    }
    //copy the values from the monster onto this agent
    $.each(data.monster, function (key, value) {
        monster[key] = copy(value);
    });
    this.maxHealth = this.health;
    this.area = null; //Will be set when this agent is placed in an area
    this.agentType = 'monster';
    this.active = true;
    this.top = data.top;
    this.left = data.left;
    this.controlLoop = enemyCode.basicLoop;
    this.delay = 0;
    this.method = null;
    if (typeof this.regenerate == 'undefined') {
        this.regenerate = Math.ceil(this.maxHealth / 10);
    }
    this.getActionMethod = function (action) {
        //console.log("monster action " + action);
        if (action == 'attack') {
            return actions.attack;
        }
        if (action == 'wait') {
            return actions.wait;
        }
        if (action == 'rest') {
            return function (params) {
                checkParams(0, params);
                assignDelayedAction(monster, 1000, function () {
                    monster.health = Math.min(monster.health + monster.regenerate, monster.maxHealth);
                });
            };
        }
        return null;
    };
    this.contextValues = {
        'my' : function (parts) {
            return getMonsterStats(monster, parts);
        },
        'area': function (parts) {
            return getAreaTarget(parts.join('.'), monster) != null;
        }
    };
    this.executionContext = new ExecutionContext(this);
    this.reset = function () {
        this.health = this.maxHealth;
        this.damaged = 0;
        this.battleStatus = freshBattleStatus();
        this.active = true;
        this.alive = true;
        this.timeDefeated = 0;
        this.damageDisplay = new NumericDisplay(this, 'damageDisplay');
        this.healingDisplay = new NumericDisplay(this, 'healingDisplay');
        scheduleAgentForUpdate(this);
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
            this.$element.find('.js-graphic').attr('code', 'attack area.' + this.key + '.' + index);
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
        $monster.find('.js-attackSpeed').text(this.getAttackSpeed().toFixed(2));
        $monster.find('.js-armor').text(Math.max(0, this.getArmor()));
        var healthPercent = this.health / this.maxHealth;
        $monster.find('.js-healthFill').css('width', (100 * healthPercent) + '%');
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
    this.getAttackSpeed = function () {
        var attackSpeed = applyCripple(monster.attackSpeed, monster.battleStatus.crippled);
        if (player.helmet == helmets.proudHat) {
            attackSpeed *= .9;
        }
        return attackSpeed;
    };
    this.stateCheck = function () {
        if (monster.health <= 0) {
            monster.timeDefeated = player.time;
            monster.active = false;
            monster.alive = false;
            monster.damageDisplay.counter = 0;
            monster.delay = 0;
            monster.method = null;
            scheduleAgentForUpdate(monster);
            gainExperience(Math.floor(monster.experience * (1 + getTotalEnchantment('experience'))), monster.level);
            player.defeatedMonsters[monster.key]++;
            for (var i = 0; i < monster.spoils.length; i++) {
                if (Math.random() > getDropChance(monster, i, monster.spoils.length, false)) {
                    continue;
                }
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
            if (monster.victoryFunction) {
                monster.victoryFunction();
            }
            return;
        }
    };
    this.hasSkill = function () {
        return false;
    };
    this.getDamage = function () {
        return (this.damage ? this.damage : 0);
    }
    this.getArmor = function () {
        return (this.parry ? this.parry : 0) + Math.max(0, this.armor - this.battleStatus.armorReduction);
    };
    this.getArmorPierce = function () {
        return (this.armorPierce ? this.armorPierce : 0);
    };
    this.getReflect = function () {
        return (this.reflect ? this.reflect : 0);
    };
    this.getArmorBreak = function () {
        return (this.armorBreak ? this.armorBreak : 0);
    };
    this.getCripple = function () {
        return (this.cripple ? this.cripple : 0);
    };
    this.getPoison = function () {
        return (this.poison ? this.poison : 0);
    };
    this.getLifeSteal = function () {
        return (this.lifeSteal ? this.lifeSteal : 0);
    };
    this.getTravelingSpeed = function () {
        return (this.travelingSpeed ? this.travelingSpeed : 1);
    };
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