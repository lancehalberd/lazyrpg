function healthSkill(health, open) {
    return {'name': '<span class="icon health"></span> +' + health, 'open' : open, 'activate': function () {player.maxHealth += health; player.health += health;}, 'helpText' : 'Gain ' + health + ' health.'};
}
function armorMultiSkill(multi, open) {
    var percent =  (100*multi)+'%';
    return {'name': '<span class="icon shield"></span> ' + percent, 'open' : open, 'activate': function () {player.bonuses.armor.multi += multi;}, 'helpText' : 'Increase armor by ' + percent + '.'};
}
function armorPlusSkill(amount, open) {
    return {'name': '<span class="icon shield"></span> +' + amount, 'open' : open, 'activate': function () {player.bonuses.armor.plus += amount;}, 'helpText' : 'Increase armor by ' + amount + '.'};
}
function damageMultiSkill(multi, open) {
    var percent =  (100*multi)+'%';
    return {'name': 'DAMAGE ' + percent, 'open' : open, 'activate': function () {player.bonuses.damage.multi += multi;}, 'helpText' : 'Increase damage by ' + percent + '.'};
}
function damagePlusSkill(amount, open) {
    return {'name': 'DAMAGE +' + amount, 'open' : open, 'activate': function () {player.bonuses.damage.plus += amount;}, 'helpText' : 'Increase damage by ' + amount + '.'};
}
function speedMultiSkill(multi, open) {
    var percent =  (100*multi)+'%';
    return {'name': '<span class="icon speed"></span> ' + percent, 'open' : open, 'activate': function () {player.bonuses.attackSpeed.multi += multi;}, 'helpText' : 'Increase attacks per second by ' + percent + '.'};
}
function speedPlusSkill(amount, open) {
    return {'name': '<span class="icon speed"></span> +' + amount, 'open' : open, 'activate': function () {player.bonuses.attackSpeed.plus += amount;}, 'helpText' : 'Increase attacks per second by ' + amount + '.'};
}
function basicSkill(name, open) {
    return {'name': name, 'open' : open, 'activate': function () {}, 'helpText' : 'This is the starting node for this skill tree.'};
}
function craftSkill(open) {
    return {'name': 'CRAFT', 'open' : open, 'activate': function () {player.craftingSkill++;}, 'helpText' : 'Increases your crafting skill, unlocking new recipes.'};
}
function mineSkill(open) {
    return {'name': 'MINE', 'open' : open, 'activate': function () {player.miningSkill++;}, 'helpText' : 'Increases your mining skill so you mine faster and lose less health over time.'};
}
function poachSkill(open) {
    return {'name': 'POACH', 'open' : open, 'activate': function () {player.poachingSkill++;}, 'helpText' : 'Increases your poaching skill allowing you to damage enemies more without degrading their item quality.'};
}
function weaponSkill(type, open) {
    return {'name': '<span class="icon ' + type +'"></span> +LVL', 'open' : open, 'activate': function () {player.weaponLevels[type]++; refreshInventoryPanel('weapons');}, 'helpText' : 'Increases the level of ' + type+' class weapons you can equip.'};
}
function specialSkill(type, open) {
    return {'name': type.toUpperCase(), 'open' : open, 'activate': function () {player.specialSkills[type] = true;}, 'helpText' : specialSkills[type]};
}
function fistDamage(amount, open) {
    return {'name': '<span class="icon fist"></span> +' + amount, 'open' : open, 'activate': function () {player.bonuses.fist.damage.plus += amount;}, 'helpText' : 'Increase damage with fists by ' + amount + '.'}
}
function fistSpeed(amount, open) {
    var percent = (100*amount)+'%';
    return {'name': '<span class="icon fist"></span> ' + percent, 'open' : open, 'activate': function () {player.bonuses.fist.attackSpeed.multi += amount;}, 'helpText' : 'Increase attack speed with fists by ' + percent + '.'}
}
function clubDamage(amount, open) {
    return {'name': '<span class="icon club"></span> +' + amount, 'open' : open, 'activate': function () {player.bonuses.club.damage.plus += amount;}, 'helpText' : 'Increase damage with clubs by ' + amount + '.'}
}
function clubDamageMulti(amount, open) {
    var percent =  (100 * amount)+'%';
    return {'name': '<span class="icon club"></span> x' + (1 + amount), 'open' : open, 'activate': function () {player.bonuses.club.damage.multi += amount;}, 'helpText' : 'Increase attack damage with clubs by ' + percent + '.'}
}
function clubsSpeed(amount, open) {
    var percent =  (100*amount)+'%';
    return {'name': '<span class="icon club"></span> ' + percent, 'open' : open, 'activate': function () {player.bonuses.club.attackSpeed.multi += amount;}, 'helpText' : 'Increase attack speed with clubs by ' + percent + '.'}
}
function bowDamage(amount, open) {
    return {'name': '<span class="icon bow"></span> +' + amount, 'open' : open, 'activate': function () {player.bonuses.bow.damage.plus += amount;}, 'helpText' : 'Increase damage with bows by ' + amount + '.'}
}
function bowDamageMulti(amount, open) {
    var percent =  (100 * amount)+'%';
    return {'name': '<span class="icon bow"></span> x' + (1 + amount), 'open' : open, 'activate': function () {player.bonuses.bow.damage.multi += amount;}, 'helpText' : 'Increase attack damage with bows by ' + percent + '.'}
}
function bowSpeed(amount, open) {
    var percent =  (100*amount)+'%';
    return {'name': '<span class="icon bow"></span> ' + percent, 'open' : open, 'activate': function () {player.bonuses.bow.attackSpeed.multi += amount;}, 'helpText' : 'Increase attack speed with bows by ' + percent + '.'}
}
function swordDamage(amount, open) {
    return {'name': '<span class="icon sword"></span> +' + amount, 'open' : open, 'activate': function () {player.bonuses.sword.damage.plus += amount;}, 'helpText' : 'Increase damage with swords by ' + amount + '.'}
}
function swordSpeed(amount, open) {
    var percent =  (100*amount)+'%';
    return {'name': '<span class="icon sword"></span> ' + percent, 'open' : open, 'activate': function () {player.bonuses.sword.attackSpeed.multi += amount;}, 'helpText' : 'Increase attack speed with swords by ' + percent + '.'}
}
function miningVitality(amount, open) {
    var percent =  (100*amount)+'%';
    return {'name': 'VIGOR ' + percent, 'open' : open, 'activate': function () {player.bonuses.miningVitality.multi += amount;}, 'helpText' : 'Increase mining endurance by ' + percent + '.'}
}
function miningSpeed(amount, open) {
    var percent =  (100*amount)+'%';
    return {'name': 'MINE ' + percent, 'open' : open, 'activate': function () {player.bonuses.miningSpeed.multi += amount;}, 'helpText' : 'Increase mining speed by ' + percent + '.'}
}

var specialSkills = {
    'focus': 'Halves your attack speed so you can carefully plan each blow for double damage.',
    'fury': 'Unleash your inner fury, doubling your damage, but rendering your armor useless.'
};

var skillTree = [
    [armorMultiSkill(.65, 4), mineSkill(1),         healthSkill(200, 7),      miningSpeed(.5, 3),      healthSkill(500, 3),     miningVitality(.5, 3),  craftSkill(2)],
    [healthSkill(500, 12),    craftSkill(5),        mineSkill(11),            weaponSkill('club', 6),  poachSkill(5),           damagePlusSkill(10, 3), specialSkill('focus', 6)],
    [armorPlusSkill(10, 12),  healthSkill(200, 9),  weaponSkill('club', 2),   craftSkill(12),          damagePlusSkill(20, 9),  poachSkill(2),          healthSkill(200, 12)],
    [healthSkill(300, 12),    armorPlusSkill(5, 5), healthSkill(100, 7),      basicSkill('Youth', 15), weaponSkill('bow', 3),   healthSkill(100, 3),    poachSkill(14)],
    [armorMultiSkill(.25, 9), healthSkill(300, 10), speedMultiSkill(.25, 12), fistDamage(3, 12),       weaponSkill('bow', 5),   bowSpeed(.5, 3),        bowDamage(10, 10)],
    [swordDamage(10, 5),       healthSkill(200, 3), weaponSkill('sword', 10), healthSkill(100, 12),    bowDamageMulti(1, 8),    fistDamage(15, 5),      healthSkill(500, 6)],
    [swordSpeed(.5, 9),       armorPlusSkill(5, 3), weaponSkill('sword', 2),  weaponSkill('fist', 9),  healthSkill(200, 3),     fistSpeed(.5, 10),       weaponSkill('fist', 8)]
];

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
            skill.$element.css('left', col*50+'px').css('top', row*50+'px');
            $('.js-skillContainer').append(skill.$element);
            skill.$element.on('click', function () {
                chooseSkill($(this).data('skill'));
            });
        }
    }
}

function resetSkillTree() {
    allSkills.forEach(function (skill) {
        skill.activated = false;
        skill.available = false;
        skill.distance = 9999;
        skill.lastSkill = null;
    });
    var startingSkill = skillTree[3][3];
    startingSkill.available = true;
    startingSkill.activated = true;
    revealSkillsAround(startingSkill.col, startingSkill.row);
    updateSkillTree();
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
                        if (skill.distance * player.skillCost <= player.skillPoints) {
                            skill.$element.addClass('purchaseable');
                            skill.$element.attr('helpText', skill.helpText + '<br/><br/>Learn for ' + skill.distance * player.skillCost + ' skill points.');
                        } else {
                            skill.$element.attr('helpText', skill.helpText + '<br/><br/>You need ' + skill.distance * player.skillCost + ' skill points to learn this.');
                        }
                    } else {
                        skill.$element.attr('helpText', 'You cannot reach this skill yet.<br/>' + skill.helpText);
                    }
                }
            } else {
                skill.$element.attr('helpText', "This skill is still a mystery.");
            }
        }
    }
}

actions.learn = function (params, successCallback, errorCallback) {
    if (paramError(2, params, errorCallback)) return;
    var col = params[0];
    var row = params[1];
    var skill = getSkill(col, row);
    if (!skill) {
        errorCallback("There is no skill at coords (" + col +"," + row + ").");
        return;
    }
    if (!skill.available) {
        errorCallback("That skill is not available yet.");
        return;
    }
    if (skill.activated) {
        errorCallback("You already learned the skill at (" + col +"," + row + ").");
    }
    if (skill.distance * player.skillCost > player.skillPoints) {
        errorCallback("You need more skill points to learn the skill at (" + col +"," + row + ").");
        return;
    }
    chooseSkill(skill);
    successCallback();
}

function chooseSkill(skill) {
    //make sure skill is revealed and purchaseable
    if (!skill.available || skill.distance * player.skillCost > player.skillPoints) {
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
    updatePlayerStats();
    updateSkillTree();
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
            //marks skill as purchasable for this round
            skill.available = true;
            if (!skill.activated && i < skill.distance) {
                skill.distance = i;
                skill.lastSkill = lastSkill;
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