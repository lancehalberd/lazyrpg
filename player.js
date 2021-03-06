
function freshBattleStatus() {
    return {
        'armorReduction': 0,
        'dealtPoisonDamage': 0,
        'poisonDamage': 0,
        'poisonRate': 0,
        'crippled': 0
    }
}

/**
 * Returns the data used to create a new game.
 */
function newGameData() {
    var data = {
        'area': 'shore',
        'inventory': {
            'items' : {},
            'weapons' : {},
            'armors' : {},
            'helmets' : {},
            'boots' : {}
        },
        'visibleSkills': [],
        'defeatedMonsters': {},
        'unlockedClasses' : {'youth' : true},
        'gold': 10,
        'experience': 0,
        'level': 0,
        'learnedSkills': [],
        'skillPoints': 0,
        'skillCost': 1,
        'time': 0,
        'gameSpeed': 1,
        'bonusPoints': 0,
        'programs': [],
        'weapon': baseEquipment.weapon.key,
        'helmet': baseEquipment.helmet.key,
        'boots': baseEquipment.boots.key,
        'armor': baseEquipment.armor.key,
        'enchantments': {
            'weapon': emptyEnchantments(),
            'armor': emptyEnchantments(),
            'helmet': emptyEnchantments(),
            'boots': emptyEnchantments()
        },
        'flags': {}
    };
    for (var i = 0; i < 13; i++) {
        data.visibleSkills[i] = [];
        for (var j = 0; j < 13; j++) {
            data.visibleSkills[i][j] = false;
        }
    }
    return data;
}
/**
 * Returns the data to be saved for the current state of the game. Characters
 * level and skills are reset.
 */
function getSavedData() {
    return {
        'area': player.area,
        'inventory': copy(player.inventory),
        'visibleSkills': copy(player.visibleSkills),
        'learnedSkills': copy(player.learnedSkills),
        'defeatedMonsters': copy(player.defeatedMonsters),
        'unlockedClasses' : copy(player.unlockedClasses),
        'gold': player.gold,
        'experience': player.experience,
        'level': player.level,
        'time': player.time,
        'gameSpeed': player.gameSpeed,
        'bonusPoints': player.bonusPoints,
        'skillPoints': player.skillPoints,
        'skillCost': player.skillCost,
        'programs': player.programs,
        'name': player.name,
        'weapon': player.weapon.key,
        'helmet': player.helmet.key,
        'boots': player.boots.key,
        'armor': player.armor.key,
        'enchantments': copy(player.enchantments),
        'flags': copy(player.flags)
    };
}
function applySavedData(savedData) {
    $.each(savedData, function (key, value) {
        if (key == 'inventory') {
            //special code to populate inventory so that we don't mess up
            //the given item order. Otherwise items the player has on load
            //are always above items they gain while playing
            $.each(value, function (itemSlot, items) {
                $.each(items, function (itemKey, amount) {
                    player.inventory[itemSlot][itemKey] = amount;
                });
            });
        } else if (['weapon', 'helmet', 'boots', 'armor'].indexOf(key) >= 0) {
            player[key] = allItems[value];
        } else {
            player[key] = value;
        }
    });
    //initialize the skill tree with unlocked class info
    resetSkillTree();
    //apply all the players learned abilities to the fresh tree
    player.learnedSkills.forEach(function (coords) {
        var skill = skillTree[coords[1]][coords[0]];
        skill.activated = true;
        skill.activate();
        revealSkillsAround(skill);
    });
    //fill in any wholes in the players defeated monsters data
    initializeDefeatedMonsters();
    initializeInventoryCounts();
}

function applyBonus(value, bonus) {
    return (value + bonus.plus) * bonus.multi;
}
//setup player here (even though most of this will get overwritten on loading game)
//just in case some of the initialization code panics without the player populated
var player = {'inventory': {
        'items' : {},
        'weapons' : {},
        'armors' : {},
        'helmets' : {},
        'boots' : {}
    }
};

function initializeInventoryCounts() {
    $.each(allItems, function(key, value) {
        player.inventory[value.slot][value.key] = player.inventory[value.slot][value.key] ? player.inventory[value.slot][value.key] :  0;
    });
}
function initializeDefeatedMonsters() {
    $.each(monsters, function (key, value) {
        player.defeatedMonsters[key] = player.defeatedMonsters[key] ? player.defeatedMonsters[key] : 0;
    });
}

var baseEquipment = {
    'weapon' : weapons.fists,
    'armor': armors.shirt,
    'helmet': helmets.hair,
    'boots': boots.bareFeet
};
applySavedData(newGameData());
player.isPlayer =  true,
player.battleStatus = freshBattleStatus();
player.getDamage = function () {
    var damageBonus = player.bonuses.damage;
    var weaponBonus = player.bonuses[player.weapon.type];
    var sum = player.weapon.damage + damageBonus.plus + weaponBonus.damage.plus;
    var total = sum * damageBonus.multi * weaponBonus.damage.multi;
    //focus double damage, half attack speed
    if (player.specialSkills.focus) {
        total = total * 2;
    }
    total *= (1 + getTotalEnchantment('damage'));
    total *= (1 + getTotalEnchantment('poach'));
    //double damage, 0 armor
    if (player.specialSkills.fury) {
        total = total * 2;
    }
    if (player.specialSkills.haste) {
        total = total / 2;
    }
    if (player.specialSkills.curse) {
        total *= .1;
    }
    if (player.specialSkills.poach) {
        total *= .1;
    }
    return Math.floor(total);
};
player.getAttackSpeed = function () {
    var attackSpeedBonus = player.bonuses.attackSpeed;
    var weaponBonus = player.bonuses[player.weapon.type];
    var sum = player.weapon.attackSpeed + attackSpeedBonus.plus + weaponBonus.attackSpeed.plus;
    var total = sum * attackSpeedBonus.multi * weaponBonus.attackSpeed.multi;
    total *= (1 + getTotalEnchantment('attackSpeed'));
    total /= (1 + getTotalEnchantment('poach'));
    if (player.specialSkills.haste) {
        total = total * 2;
    }
    //focus double damage, half attack speed
    if (player.specialSkills.focus) {
        total = total / 2;
    }
    if (player.specialSkills.scan) {
        total = total / 2;
    }
    if (player.specialSkills.tank) {
        total = total / 2;
    }
    var cripplingEffect = player.battleStatus.crippled;
    if (currentArea && currentArea.cripplingTentacles > .5) {
        cripplingEffect += 2 * currentArea.cripplingTentacles;
    }
    return applyCripple(total, cripplingEffect);
};
player.getArmor = function () {
    //double damage, 0 armor
    if (player.specialSkills.fury) {
        return 0;
    }
    var armorBonus = player.bonuses.armor;
    var baseValue = player.armor.armor + player.helmet.armor + player.boots.armor + armorBonus.plus;
    baseValue *= (1 + getTotalEnchantment('armor'));
    return Math.floor(player.getParry()) + Math.max(0, Math.floor(baseValue * armorBonus.multi) - player.battleStatus.armorReduction);
};
player.getArmorPierce = function () {
    if (player.weapon.type != 'bow' && player.weapon.type != 'sword') {
        return 0;
    }
    var base = player.weapon.armorPierce ? player.weapon.armorPierce : 0;
    if (player.specialSkills.pierce) {
        base += .1;
    }
    if (player.specialSkills.snipe) {
        base += .2;
    }
    base += getTotalEnchantment('armorPierce');
    if (player.specialSkills.curse) {
        base *= 2;
    }
    return applyBonus(base, player.bonuses.armorPierce);
}
player.getArmorBreak = function () {
    if (player.weapon.type != 'fist' && player.weapon.type != 'club') {
        return 0;
    }
    var base = player.weapon.armorBreak ? player.weapon.armorBreak : 0;
    if (player.specialSkills.rend) {
        base += 5;
    }
    base += getTotalEnchantment('armorBreak');
    if (player.specialSkills.curse) {
        base *= 2;
    }
    if (player.specialSkills.smash) {
        base *= 2;
    }
    return applyBonus(base, player.bonuses.armorBreak);
}
player.getLifeSteal = function () {
    if (player.weapon.type != 'fist' && player.weapon.type != 'sword') {
        return 0;
    }
    var base = player.weapon.lifeSteal ? player.weapon.lifeSteal : 0;
    if (player.specialSkills.leech) {
        base += .1;
    }
    base += getTotalEnchantment('lifeSteal');
    if (player.specialSkills.curse) {
        base *= 2;
    }
    return applyBonus(base, player.bonuses.lifeSteal);
}
player.getPoison = function () {
    if (player.weapon.type != 'fist' && player.weapon.type != 'bow') {
        return 0;
    }
    var base = player.weapon.poison ? player.weapon.poison : 0;
    if (player.specialSkills.ignite) {
        base += 20;
    }
    base += getTotalEnchantment('poison');
    if (player.specialSkills.venom) {
        base *= 2;
    }
    if (player.specialSkills.curse) {
        base *= 2;
    }
    return applyBonus(base, player.bonuses.poison);
}
player.getCripple = function () {
    if (player.weapon.type != 'bow' && player.weapon.type != 'club') {
        return 0;
    }
    var base = player.weapon.cripple ? player.weapon.cripple : 0;
    if (player.specialSkills.stun) {
        base += 2;
    }
    base += getTotalEnchantment('cripple');
    if (player.specialSkills.curse) {
        base *= 2;
    }
    return applyBonus(base, player.bonuses.cripple);
}
player.getParry = function () {
    if (player.weapon.type != 'sword' && player.weapon.type != 'club') {
        return 0;
    }
    var base = player.weapon.parry ? player.weapon.parry : 0;
    if (player.specialSkills.parry) {
        base += .2 * player.weapon.damage;
    }
    base += getTotalEnchantment('parry');
    if (player.specialSkills.curse) {
        base *= 2;
    }
    return applyBonus(base, player.bonuses.parry);
};
player.getMaxHealth = function () {
    return player.maxHealth * (player.specialSkills.tank ? 2 : 1) * (1 + getTotalEnchantment('health'));
};
/**
 * Certain circumstances put a dot on the player, such as carrying cooling magma
 * or being in the contaminated lab with no hazmat suit on.
 */
player.getDamageOverTime = function () {
    var total = 0;
    total += 10 * player.inventory.items.coolingMagma;
    if (currentArea && currentArea.poisoningTentacles > .5) {
        total += 50 * currentArea.poisoningTentacles;
    }
    if (currentArea && currentArea.leechingTentacles > .5) {
        total += 100 * currentArea.leechingTentacles;
    }
    return total;
};
player.getTenacity = function () {
    var tenacity = (1 + (player.specialSkills.stoic ? .5 : 0) + getTotalEnchantment('tenacity'));
    if (player.boots == boots.ninjaTabi) {
        tenacity *= 1.2;
    }
    return tenacity;
};
player.gainLife = function (amount) {
    //plague of 100 renders all healing for the player innefective except for rebirthing
    amount *= Math.max(0, 1 - player.plague / 100);
    player.health = Math.min(player.getMaxHealth(), player.health + amount);
    uiNeedsUpdate.playerStats = true;
};
player.infectWithPlague = function (amount) {
    player.plague = Math.min(100, player.plague + amount * (1 - player.getPlagueResistance()));
    uiNeedsUpdate.playerStats = true;
};
player.getPlagueResistance = function () {
    var armorResistance = 0;
    if (player.helmet == helmets.gasMask) {
        armorResistance += .2;
    }
    if (player.boots == boots.rubberBoots) {
        armorResistance += .1;
    }
    if (player.armor == armors.hazmatSuit) {
        armorResistance += .2;
    }
    return (1 - (1 - armorResistance) * (1 - player.plagueResistance));
}

function getItemName(item) {
    if (item.slot == 'armors') {
        return '<span class="icon armor"></span><span class="value">' + item.name + '</span>';
    }
    if (item.slot == 'helmets') {
        return '<span class="icon helmet"></span><span class="value">' + item.name + '</span>';
    }
    if (item.slot == 'boots') {
        return '<span class="icon boots"></span><span class="value">' + item.name + '</span>';
    }
    if (item.slot == 'weapons') {
        return '<span class="icon ' + item.type + '"></span><span class="value">' + item.name + '</span>';
    }
    return '<span class="value">' + item.name + '</span>';
}

function resetCharacter() {
    player.health = 200;
    player.maxHealth = 200;
    player.level = 0;
    player.experience = 0;
    player.enchantingSkill = 0;
    player.craftingSkill = 0;
    player.poachingSkill = 0;
    player.miningSkill = 0;
    player.learnedSkills = [];
    player.skillPoints = player.bonusPoints;
    player.skillCost = 1;
    player.weapon = weapons.fists;
    player.armor = armors.shirt;
    player.helmet = helmets.hair;
    player.boots = boots.bareFeet;
    player.plague = 0;
    player.plagueResistance = 0;
    player.enchantments = {
        'weapon': emptyEnchantments(),
        'armor': emptyEnchantments(),
        'helmet': emptyEnchantments(),
        'boots': emptyEnchantments()
    };;
    player.weaponLevels = {
        'fist': 0,
        'sword': 0,
        'club': 0,
        'bow': 0
    };
    player.bonuses = {
        'damage': zeroBonus(),
        'miningSpeed': zeroBonus(),
        'vigor': zeroBonus(), //used for reducing damage from mining and traveling
        'attackSpeed': zeroBonus(),
        'fist': {'damage': zeroBonus(), 'attackSpeed': zeroBonus()},
        'sword': {'damage': zeroBonus(), 'attackSpeed': zeroBonus()},
        'club': {'damage': zeroBonus(), 'attackSpeed': zeroBonus()},
        'bow': {'damage': zeroBonus(), 'attackSpeed': zeroBonus()},
        'armor': zeroBonus(),
        'armorPierce': zeroBonus(),
        'armorBreak': zeroBonus(),
        'poison': zeroBonus(),
        'cripple': zeroBonus(),
        'parry': zeroBonus(),
        'lifeSteal': zeroBonus()
    };
    player.specialSkills = [];
    resetSkillTree();
    uiNeedsUpdate.playerStats = true;
    uiNeedsUpdate.inventory = true;
}

function describeHealthBar() {
    var sections = [];
    var plagueResistance = player.getPlagueResistance();
    if (plagueResistance) {
        sections.push('You are ' + Math.round(plagueResistance * 100) + '% resitant to diseases.');
    }
    if (player.plague) {
        sections.push('The plague has reduced your ability to regain health by ' + Math.round(player.plague) + '%. The plague can only be removed by rebirthing or using special items.');
    }
    return sections.join('<br />');
}

function updatePlayerStats() {
    $('.js-characterStats .js-currentHealth').text(Math.floor(player.health));
    $('.js-characterStats .js-maxHealth').text(Math.floor(player.getMaxHealth()));
    $('.js-characterStats .js-healthFill').css('width', (100 * player.health / player.getMaxHealth()) + '%');
    $('.js-characterStats .js-plagueFill').css('width', player.plague + '%');
    $('.js-characterStats .js-plagueResistanceFill').css('width', (100 * player.getPlagueResistance()) + '%');
    $('.js-characterStats .js-damage').text(player.getDamage());
    $('.js-characterStats .js-attackSpeed').text(player.getAttackSpeed().toFixed(2));
    $('.js-characterStats .js-armor').text(player.getArmor());
    $('.js-characterStats .js-level').text(player.level);
    var expForNextLevel = experienceForNextLevel(player.level);
    var expPercent = Math.min(1, player.experience / expForNextLevel);
    $('.js-characterStats .js-experienceFill').css('width', (100 * expPercent) + '%');
    $('.js-characterStats .js-experienceBar').attr('helpText', 'You have ' + player.experience + ' of ' + expForNextLevel + ' experience needed for your next level.');
    $('.js-characterStats .js-gold').text(player.gold);
    $('.js-skillPoints').show();
    if (player.skillPoints > 1) {
        $('.js-skillPoints').text('+' + player.skillPoints + ' skill pt');
    } else if (player.skillPoints) {
        $('.js-skillPoints').text('+' + player.skillPoints + ' skill pts');
    } else {
        $('.js-skillPoints').hide();
    }
    $('.js-characterStatsContainer .js-weaponName').html(getItemName(player.weapon));
    $('.js-characterStatsContainer .js-armorName').html(getItemName(player.armor));
    $('.js-characterStatsContainer .js-helmetName').html(getItemName(player.helmet));
    $('.js-characterStatsContainer .js-bootsName').html(getItemName(player.boots));
    $('.js-characterStatsContainer .js-craftingSkill').text(player.craftingSkill);
    $('.js-characterStatsContainer .js-poachingSkill').text(player.poachingSkill);
    $('.js-characterStatsContainer .js-miningSkill').text(player.miningSkill);
    $('.js-characterStatsContainer .js-fistSkill').text(player.weaponLevels['fist']);
    $('.js-characterStatsContainer .js-swordSkill').text(player.weaponLevels['sword']);
    $('.js-characterStatsContainer .js-clubSkill').text(player.weaponLevels['club']);
    $('.js-characterStatsContainer .js-bowSkill').text(player.weaponLevels['bow']);
    updateTime();
}

function experienceForNextLevel(currentLevel) {
    return (currentLevel + 1) * (currentLevel + 1) * 10;
}

function gainExperience(experience, level) {
    while (level > player.level && experience > 0) {
        var xpToNext = experienceForNextLevel(player.level);
        var chunk = Math.min(experience, xpToNext - player.experience);
        player.experience += chunk;
        experience -= chunk;
        if (player.experience >= xpToNext) {
            player.experience = 0;
            player.level++;
            player.skillPoints += player.level;
            uiNeedsUpdate.inventory = true;
        }
        uiNeedsUpdate.playerStats = true;
        uiNeedsUpdate.skillTree = true;
    }
}

function zeroBonus() {
    return {'plus': 0, 'multi': 1};
}

function updateTime(args) {
    var parts = [Math.floor(player.time / 1000)];
    parts.unshift(Math.floor(parts[0] / 60));
    parts[1] = parts[1] % 60;
    if (parts[1] < 10) {
        parts[1] = '0' + parts[1];
    }
    if (parts[0] > 60) {
        parts.unshift(Math.floor(parts[0] / 60));
        parts[1] = parts[1] % 60;
        if (parts[1] < 10) {
            parts[1] = '0' + parts[1];
        }
    }
    $('.js-time').text(parts.join(':'));
}