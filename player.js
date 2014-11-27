
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
        'time': 0,
        'bonusPoints': 0,
        'programs': [{'name': 'Find Village', 'description': 'This sample program moves you from the shore to the village and rests there.', 'text': "move forest\nmove village\nrest"}]
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
        'defeatedMonsters': copy(player.defeatedMonsters),
        'unlockedClasses' : copy(player.unlockedClasses),
        'gold': player.gold,
        'time': player.time,
        'bonusPoints': player.bonusPoints,
        'programs': player.programs,
        'name': player.name
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
        } else {
            player[key] = value;
        }
    });
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

var allItems = {};
var startingItems = 0;
$.each(items, function(key, value) {
    player.inventory.items[key] = player.inventory.items[key] ? player.inventory.items[key] : startingItems;
    allItems[key] = value;
    value.key = key;
    value.slot = 'items';
});
$.each(weapons, function(key, value) {
    player.inventory.weapons[key] = player.inventory.weapons[key] ? player.inventory.weapons[key] : startingItems;
    allItems[key] = value;
    value.key = key;
    value.isWeapon = true;
    value.slot = 'weapons';
    value.equipmentSlot = 'weapon';
});
$.each(armors, function(key, value) {
    player.inventory.armors[key] = player.inventory.armors[key] ? player.inventory.armors[key] : startingItems;
    allItems[key] = value;
    value.key = key;
    value.isArmor = true;
    value.slot = 'armors';
    value.equipmentSlot = 'armor';
});
$.each(helmets, function(key, value) {
    player.inventory.helmets[key] = player.inventory.helmets[key] ? player.inventory.helmets[key] : startingItems;
    allItems[key] = value; value.key =
    key; value.isArmor = true;
    value.slot = 'helmets';
    value.equipmentSlot = 'helmet';
});
$.each(boots, function(key, value) {
    player.inventory.boots[key] = player.inventory.boots[key] ? player.inventory.boots[key] : startingItems;
    allItems[key] = value;
    value.key = key;
    value.isArmor = true;
    value.slot = 'boots';
    value.equipmentSlot = 'boots';
});

$.each(allRecipes, function (key, recipe) {
    if (key.indexOf(recipe.result) != 0) {
        console.log("broken recipe: " + [key, recipe.result]);
    }
    if (!allItems[recipe.result]) {
        console.log("Missing item " + recipe.result);
    }
    $.each(recipe.ingredients, function (ingredientKey, amount) {
        if (!allItems[ingredientKey]) {
            console.log("Missing item " + ingredientKey);
        }
    });
});


applySavedData(newGameData());
player.isPlayer =  true,
player.battleStatus = freshBattleStatus();
var baseEquipment = {
    'weapon' : weapons.fists,
    'armor': armors.shirt,
    'helmet': helmets.hair,
    'boots': boots.bareFeet
};
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
    return applyCripple(total, player.battleStatus.crippled);
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
}
player.getMaxHealth = function () {
    return player.maxHealth * (player.specialSkills.tank ? 2 : 1) * (1 + getTotalEnchantment('health'));
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
    $.each(monsters, function (key, value) {
        player.defeatedMonsters[key] = player.defeatedMonsters[key] ? player.defeatedMonsters[key] : 0;
    });
    player.health = 200;
    player.maxHealth = 200;
    player.level = 0;
    player.experience = 0;
    player.enchantingSkill = 0;
    player.craftingSkill = 0;
    player.poachingSkill = 0;
    player.miningSkill = 0;
    player.skillPoints = player.bonusPoints;
    player.skillCost = 1;
    player.weapon = weapons.fists;
    player.armor = armors.shirt;
    player.helmet = helmets.hair;
    player.boots = boots.bareFeet;
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
        'miningVitality': zeroBonus(),
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

function updatePlayerStats() {
    $('.js-characterStats .js-currentHealth').text(Math.floor(player.health));
    $('.js-characterStats .js-maxHealth').text(Math.floor(player.getMaxHealth()));
    $('.js-characterStats .js-healthFill').css('width', (100 * player.health / player.getMaxHealth()) + '%');
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