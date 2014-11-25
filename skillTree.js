var skillTree;
function populateSkillTree () {
    function getSkillTree() {
        return [
[special('copy', 4),  enchant(5),               speed(.5, 3),        health(500, 3),      damage(30, 6),       health(500, 5),        enchant(6),            special('care', 1), health(500, 3),      speed(.5, 7),          damage(20, 3),          health(500, 3),      special('lucky', 6)],
[miningSpeed(.5, 13), health(500, 10),          enchant(5),          health(500, 3),      job('sage', 11),     armor(20, 10),         special('gouge', 12),  damage(10, 5),      job('artisan', 6),   craft(12),             special('scan', 5),     damage(20, 3),       health(500, 10)],
[health(1000, 9),     mine(6),                  vigor(.5, 9),        health(500, 6),      armor(20, 5),        special('curse', 2),   health(500, 12),       health(500, 12),    craft(12),           health(500, 12),       health(500, 12),        poach(5),            damage(20, 6)],
[vigor(.5, 1),        health(500, 15),          damage(20, 3),       miningSpeed(.5, 11), speed(.25, 10),      enchant(5),            special('haggle', 11), craft(14),          health(500, 9),      armor(20, 10),         damage(20, 9),          health(200, 14),     armor(20, 12)],
[health(500, 5),      job('miner', 15),         damage(20, 3),       health(500, 6),      health(200, 5),      damageMulti(.25, 11),  craft(6),              health(500, 13),    armor(10, 3),        damage(20, 7),         health(200, 3),         job('poacher', 10),  health(500, 12)],
[mine(12),            armor(10, 9),             vigor(.5, 6),        mine(9),             armor(10, 11),       special('stoic', 2),   health(100, 12),       poach(9),           special('poach', 2), health(200, 12),       poach(5),               special('snipe', 3), damage(20, 14)],
[special('tank', 9),  armor(20, 6),             health(500, 13),     miningSpeed(.5, 6),  mine(5),             health(200, 7),        job('youth', 15),      weapon('bow', 3),   health(100, 3),      poach(14),             health(500, 12),        health(500, 5),      special('focus', 10)],
[armorMulti(.6, 4),   health(500, 12),          swordSpeed(.5, 12),  armorMulti(.2, 9),   health(500, 10),     speed(.5, 12),         fistDamage(5, 12),     health(500, 5),     bowDamage(20, 3),    bowSpeed(.5, 11),      armor(10, 14),          weapon('bow', 13),   bowSpeed(.5, 2)],
[health(1000, 12),    job('knight', 13),        swordDamage(30, 11), health(500, 3),      armorMulti(.2, 6),   armor(5, 12),          health(100, 12),       weapon('bow', 8),   special('stun', 5),  health(200, 3),        bowDamageMulti(.5, 11), job('archer', 15),   bowDamage(10, 6)],
[armor(20, 12),       weapon('sword', 9),       armor(20, 6),        health(500, 5),      swordDamage(20, 11), weapon('sword', 10),   weapon('club', 9),     health(200, 7),     weapon('fist', 10),  fistSpeed(.5, 5),      health(500, 6),         health(200, 12),     health(500, 12)],
[swordSpeed(.5, 9),   special('pierce', 7),     health(500, 10),     swordSpeed(.5, 12),  health(500, 5),      clubDamage(30, 6),     special('smash', 5),   clubSpeed(.5, 14),  health(200, 5),      special('ignite', 10), special('venom', 9),    bowSpeed(.5, 10),   bowDamage(20, 12)],
[weapon('sword', 5),  swordDamageMulti(.5, 10), special('rend', 5),  clubDamage(50, 11),  job('warlord', 14),  health(500, 12),       health(500, 12),       health(500, 12),    job('monk', 13),     fistDamage(20, 3),     health(500, 3),         fistDamage(20, 6),   bowDamageMulti(1, 8)],
[special('parry', 9), health(1000, 3),          weapon('club', 10),  weapon('club', 1),   clubSpeed(.5, 10),   clubDamageMulti(1, 9), special('haste', 10),  fistDamage(20, 9),  weapon('fist', 11),  health(200, 3),        fistSpeed(.5, 2),       weapon('fist', 9),   special('fury', 2)],
        ];
    }

    function iconValue(iconClass, value) {
        return '<span class="icon ' + iconClass + '"></span> <span class="value">' + value + '</span>'
    }

    function health(health, open) {
        return {'name': iconValue('health', '+' + health), 'open' : open, 'activate': function () {player.maxHealth += health; player.health += health;}, 'helpText' : 'Gain ' + health + ' health.'};
    }
    function armorMulti(multi, open) {
        var percent =  (100*multi)+'%';
        return {'name': iconValue('shield', percent), 'open' : open, 'activate': function () {player.bonuses.armor.multi += multi;}, 'helpText' : 'Increase armor by ' + percent + '.'};
    }
    function armor(amount, open) {
        return {'name': iconValue('shield', '+' + amount), 'open' : open, 'activate': function () {player.bonuses.armor.plus += amount;}, 'helpText' : 'Increase armor by ' + amount + '.'};
    }
    function damageMulti(multi, open) {
        var percent =  (100*multi)+'%';
        return {'name': 'DMG ' + percent, 'open' : open, 'activate': function () {player.bonuses.damage.multi += multi;}, 'helpText' : 'Increase damage by ' + percent + '.'};
    }
    function damage(amount, open) {
        return {'name': 'DMG +' + amount, 'open' : open, 'activate': function () {player.bonuses.damage.plus += amount;}, 'helpText' : 'Increase damage by ' + amount + '.'};
    }
    function speed(multi, open) {
        var percent =  (100*multi)+'%';
        return {'name': iconValue('speed', percent), 'open' : open, 'activate': function () {player.bonuses.attackSpeed.multi += multi;}, 'helpText' : 'Increase attacks per second by ' + percent + '.'};
    }
    function job(name, open) {
        var skill = {'name': name, 'type': 'classSkill', 'open' : open, 'activate': function () {
            if (player.inventory.items.memoryCrystal > 0) {
                player.inventory.items.memoryCrystal--;
                //gain one bonus point for each class unlocked so far (1,+2,+3, etc)
                $.each(player.unlockedClasses, function (key, value) {
                    if (value) {
                        player.bonusPoints++;
                    }
                });
                player.unlockedClasses[name] = true;
                alert('You have used a memory crystal to permanently unlocked the ' + name + ' class!');
                skill.helpText = 'The starting node for the ' + name + ' class.';
            }
        }, 'helpText' : name == 'youth' ? 'The starting node for the ' + name + ' class.' : 'I will have to use a memory crystal to recover these memories.'};
        return skill;
    }
    function enchant(open) {
        return {'name': 'IMBUE', 'open' : open, 'activate': function () {player.enchantingSkill++;}, 'helpText' : 'Increases your enchanting skill, unlocking new recipes.'};
    }
    function craft(open) {
        return {'name': 'CRAFT', 'open' : open, 'activate': function () {player.craftingSkill++;}, 'helpText' : 'Increases your crafting skill, unlocking new recipes.'};
    }
    function mine(open) {
        return {'name': 'MINE', 'open' : open, 'activate': function () {player.miningSkill++;}, 'helpText' : 'Increases your mining skill so you mine faster and lose less health over time.'};
    }
    function poach(open) {
        return {'name': 'POACH', 'open' : open, 'activate': function () {player.poachingSkill++;}, 'helpText' : 'Increases your poaching skill allowing you to damage enemies more without degrading their item quality.'};
    }
    function weapon(type, open) {
        return {'name': iconValue(type, '+LVL'), 'open' : open, 'activate': function () {
            player.weaponLevels[type]++;
            uiNeedsUpdate.weapons = true;
        }, 'helpText' : 'Increases the level of ' + type+' class weapons you can equip.'};
    }
    function special(type, open) {
        return {'name': type.toUpperCase(), 'open' : open, 'activate': function () {player.specialSkills[type] = true;}, 'helpText' : specialSkills[type]};
    }
    function fistDamage(amount, open) {
        return {'name': iconValue('fist', '+' + amount), 'open' : open, 'activate': function () {player.bonuses.fist.damage.plus += amount;}, 'helpText' : 'Increase damage with fists by ' + amount + '.'}
    }
    function fistSpeed(amount, open) {
        var percent = (100*amount)+'%';
        return {'name': iconValue('fist', percent), 'open' : open, 'activate': function () {player.bonuses.fist.attackSpeed.multi += amount;}, 'helpText' : 'Increase attack speed with fists by ' + percent + '.'}
    }
    function clubDamage(amount, open) {
        return {'name': iconValue('club', '+' + amount), 'open' : open, 'activate': function () {player.bonuses.club.damage.plus += amount;}, 'helpText' : 'Increase damage with clubs by ' + amount + '.'}
    }
    function clubDamageMulti(amount, open) {
        var percent =  (100 * amount)+'%';
        return {'name': iconValue('club', 'x' + (1 + amount)), 'open' : open, 'activate': function () {player.bonuses.club.damage.multi += amount;}, 'helpText' : 'Increase attack damage with clubs by ' + percent + '.'}
    }
    function clubSpeed(amount, open) {
        var percent =  (100*amount)+'%';
        return {'name': iconValue('club', percent), 'open' : open, 'activate': function () {player.bonuses.club.attackSpeed.multi += amount;}, 'helpText' : 'Increase attack speed with clubs by ' + percent + '.'}
    }
    function bowDamage(amount, open) {
        return {'name': iconValue('bow', '+' + amount), 'open' : open, 'activate': function () {player.bonuses.bow.damage.plus += amount;}, 'helpText' : 'Increase damage with bows by ' + amount + '.'}
    }
    function bowDamageMulti(amount, open) {
        var percent =  (100 * amount)+'%';
        return {'name': iconValue('bow', 'x' + (1 + amount)), 'open' : open, 'activate': function () {player.bonuses.bow.damage.multi += amount;}, 'helpText' : 'Increase attack damage with bows by ' + percent + '.'}
    }
    function bowSpeed(amount, open) {
        var percent =  (100*amount)+'%';
        return {'name': iconValue('bow', percent), 'open' : open, 'activate': function () {player.bonuses.bow.attackSpeed.multi += amount;}, 'helpText' : 'Increase attack speed with bows by ' + percent + '.'}
    }
    function swordDamage(amount, open) {
        return {'name': iconValue('sword', '+' + amount), 'open' : open, 'activate': function () {player.bonuses.sword.damage.plus += amount;}, 'helpText' : 'Increase damage with swords by ' + amount + '.'}
    }
    function swordDamageMulti(amount, open) {
        var percent =  (100 * amount)+'%';
        return {'name': iconValue('sword', 'x' + (1 + amount)), 'open' : open, 'activate': function () {player.bonuses.sword.damage.multi += amount;}, 'helpText' : 'Increase attack damage with swords by ' + percent + '.'}
    }
    function swordSpeed(amount, open) {
        var percent =  (100*amount)+'%';
        return {'name': iconValue('sword', percent), 'open' : open, 'activate': function () {player.bonuses.sword.attackSpeed.multi += amount;}, 'helpText' : 'Increase attack speed with swords by ' + percent + '.'}
    }
    function vigor(amount, open) {
        var percent =  (100*amount)+'%';
        return {'name': 'VIGOR ' + percent, 'open' : open, 'activate': function () {player.bonuses.miningVitality.multi += amount;}, 'helpText' : 'Increase mining endurance by ' + percent + '.'}
    }
    function miningSpeed(amount, open) {
        var percent =  (100*amount)+'%';
        return {'name': 'MINE ' + percent, 'open' : open, 'activate': function () {player.bonuses.miningSpeed.multi += amount;}, 'helpText' : 'Increase mining speed by ' + percent + '.'}
    }
    skillTree = getSkillTree();
}

var specialSkills = {
    'copy': 'Create an extra item when crafting or enchanting at no additional cost.', //implemented for crafting
    'parry': '20% of weapon damage is applied to armor when wielding swords or clubs.', //implemented
    'venom': 'Double the effects of damage over time on fists and bows.', //implemented
    'gouge': 'Sell items for 50% more at shops.', //implemented
    'haggle': 'Buy items for 20% less at shops.', //implemented
    'lucky': 'Gain double the items when you defeat a monster.', //implemented
    'curse': 'Doubles the effect of all special attacks, but damage dealt is reduced by 90%.', //implemented
    'snipe': 'Attacks ignore 20% of the targets armor when using bows or swords.', //implemented
    'pierce': 'Attacks ignore 10% of the targets armor when using bows or swords.', //implemented
    'ignite': 'Attacks ignite the target dealing damage over time when using fists or bows.', //implemented
    'poach': 'Attacks never reduce the quality of items dropped, but damage dealt is reduced by 90%.',//implemented
    'rend': 'Attacks reduce the enemies armor by when using fists or clubs.', //implemented
    'smash': 'Doubles the effect of armor breaking when using fists or clubs.', //implemented
    'stoic': 'Halves the effects of monster\'s special abilities.', //implemented
    'stun': 'Attacks reduce the enemies attack speed when using clubs or bows.', //implemented
    'care': 'Use 25% less ingredients when crafting or enchanting.', //implemented for crafting
    'scan': 'Find a targets weak spot. Ignore all armor, but reduces attack speed by 50%.', //implemented
    'tank': 'Gain double health, but reduces attack speed by 50%.', //implemented
    'haste': 'Doubles attack speed, but halves damage.', //implemented
    'focus': 'Halves your attack speed so you can carefully plan each blow for double damage.', //implemented
    'fury': 'Unleash your inner fury, doubling your damage, but rendering your armor useless.' //implemented
};

populateSkillTree();
var allSkills = [];
skillTree.forEach(function (row) {allSkills = allSkills.concat(row)});

function initializeSkillTree() {
    for (var row = 0; row < skillTree.length; row++) {
        for (var col = 0; col < skillTree[row].length; col++) {
            var skill = skillTree[row][col];
            skill.row = row;
            skill.col = col;
            skill.$element = $div('skillSlot', '');
            skill.$element.data('skill', skill);
            skill.$element.css('left', col * 40 + 'px').css('top', row * 40 + 'px');
            $('.js-skillContainer').append(skill.$element);
            skill.$element.on('click', function () {
                chooseSkill($(this).data('skill'));
            });
        }
    }
}

//maps each class to its starting location on the skill tree
var classSkills = {
    'youth': [6, 6],
    'miner': [1, 4],
    'sage': [4, 1],
    'artisan': [8, 1],
    'poacher': [11, 4],
    'knight': [1, 8],
    'warlord': [4, 11],
    'monk': [8, 11],
    'archer': [11, 8]
};

function resetSkillTree() {
    allSkills.forEach(function (skill) {
        skill.activated = false;
        skill.available = false;
        skill.distance = 9999;
        skill.lastSkill = null;
    });
    //unlock the starting node for each class the player has unlocked
    $.each(player.unlockedClasses, function (key) {
        var coords = classSkills[key];
        var startingSkill = skillTree[coords[1]][coords[0]];
        startingSkill.available = true;
        startingSkill.activated = true;
        revealSkillsAround(startingSkill.col, startingSkill.row);
    });
    for (var i = 0; i < 13; i++) {
        for (var j = 0; j < 13; j++) {
            skillTree[i][j].revealed = player.visibleSkills[i][j];
        }
    }
    uiNeedsUpdate.skillTree = true;
}

function updateSkillTree() {
    for (var row = 0; row < skillTree.length; row++) {
        for (var col = 0; col < skillTree[row].length; col++) {
            var skill = skillTree[row][col];
            skill.$element.removeClass('revealed activated available purchaseable');
            if (skill.revealed) {
                skill.$element.html(skill.name ? skill.name : 'empty');
                skill.$element.addClass('revealed');

                if (skill.open & 8) {
                    skill.$element.css('border-top', 'none');
                }
                if (skill.open & 4) {
                    skill.$element.css('border-bottom', 'none');
                }
                if (skill.open & 2) {
                    skill.$element.css('border-left', 'none');
                }
                if (skill.open & 1) {
                    skill.$element.css('border-right', 'none');
                }
                if (skill.activated) {
                    skill.$element.addClass('activated');
                    skill.$element.attr('helpText', skill.helpText);
                } else {
                    if (skill.available) {
                        skill.$element.addClass('available');
                        skill.$element.append($div('skillCost', skill.distance * player.skillCost));
                        if (skill.distance * player.skillCost <= player.skillPoints) {
                            skill.$element.addClass('purchaseable');
                            skill.$element.attr('helpText', skill.helpText + '<br/><br/>Learn for ' + skill.distance * player.skillCost + ' skill points.');
                        } else {
                            skill.$element.attr('helpText', skill.helpText + '<br/><br/>You need ' + skill.distance * player.skillCost + ' skill points to learn this.');
                        }
                    } else {
                        skill.$element.attr('helpText', 'You cannot reach this skill yet.<br/><br/>You can only unlock skills that are in a straight path from a currently unlocked tiled.<br/><br/>' + skill.helpText);
                    }
                }
            } else {
                skill.$element.attr('helpText', "This skill is still a mystery.");
            }
        }
    }
}

actions.learn = function (params, successCallback, errorCallback) {
    checkParams(2, params);
    var col = params[0];
    var row = params[1];
    var skill = getSkill(col, row);
    if (!skill) {
        throw new ProgrammingError("There is no skill at coords (" + col +"," + row + ").");
    }
    if (!skill.available) {
        throw new ProgrammingError("That skill is not available yet.");
    }
    if (skill.activated) {
        throw new ProgrammingError("You already learned the skill at (" + col +"," + row + ").");
    }
    if (skill.distance * player.skillCost > player.skillPoints) {
        throw new ProgrammingError("You need more skill points to learn the skill at (" + col +"," + row + ").");
    }
    chooseSkill(skill);
    successCallback();
}

function chooseSkill(skill) {
    //make sure skill is revealed and purchaseable
    if (!skill.available || skill.distance * player.skillCost > player.skillPoints) {
        return;
    }
    if (skill.type == 'classSkill' && !player.inventory.items.memoryCrystal > 0) {
        return;
    }
    var learnedSkills = [];
    var nextSkill = skill;
    while (nextSkill && !nextSkill.activated) {
        nextSkill.activated = true;
        learnedSkills.push(nextSkill);
        nextSkill.activate();
        nextSkill = nextSkill.lastSkill;
        player.skillPoints -= player.skillCost;
    }
    learnedSkills.forEach(function (skill) {
        revealSkillsAround(skill.col, skill.row);
    });
    player.skillCost++;
    uiNeedsUpdate.playerStats = true;
    uiNeedsUpdate.skillTree = true;
    recordAction("learn " + skill.col + " " + skill.row);
}

function revealSkillsAround(col, row) {
    //reveal all open squares in a line from the activated skill
    [[0, -1, 8],[0, 1, 4],[-1, 0, 2],[1, 0, 1]].forEach(function (delta) {
        var lastSkill = null;
        for (var i = 0; i < 5; i++) {
            var skill = getSkill(col + delta[0] * i, row + delta[1] * i);
            if (!skill) {
                break;
            }
            //permanently marks skill as revealed
            skill.revealed = true;
            player.visibleSkills[skill.row][skill.col] = true;
            //marks skill as purchasable for this round
            skill.available = true;
            if (!skill.activated && i < skill.distance) {
                skill.distance = i;
                skill.lastSkill = lastSkill;
            }
            if (skill.type == 'classSkill' && !player.unlockedClasses[skill.name]) {
                break;
            }
            if (!(skill.open & delta[2])) {
                break;
            }
            lastSkill = skill;
        }
    });
}

function getSkill(col, row) {
    if (row < 0 || row >= skillTree.length || col < 0 || col >= skillTree[0].length) {
        return null;
    }
    return skillTree[row][col];
}