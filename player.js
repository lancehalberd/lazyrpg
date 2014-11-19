var player = {
    'inventory': {
        'items' : {},
        'weapons' : {},
        'armors' : {},
        'helmets' : {},
        'boots' : {}
    },
    'skillTrees' : {
        'youth' : true
    },
    'gold': 10,
    'poachingSkill': 0
};
var baseEquipment = {
    'weapon' : weapons.fists,
    'armor': armors.shirt,
    'helmet': helmets.hair,
    'boots': boots.bareFeet,
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
    //double damage, 0 armor
    if (player.specialSkills.fury) {
        total = total * 2;
    }
    return Math.floor(total);
};
player.getAttackSpeed = function () {
    var attackSpeedBonus = player.bonuses.attackSpeed;
    var weaponBonus = player.bonuses[player.weapon.type];
    var sum = player.weapon.attackSpeed + attackSpeedBonus.plus + weaponBonus.attackSpeed.plus;
    var total = sum * attackSpeedBonus.multi * weaponBonus.attackSpeed.multi;
    //focus double damage, half attack speed
    if (player.specialSkills.focus) {
        total = total / 2;
    }
    return total;
};
player.getArmor = function () {
    //double damage, 0 armor
    if (player.specialSkills.fury) {
        return 0;
    }
    var armorBonus = player.bonuses.armor;
    var baseValue = player.armor.armor + player.helmet.armor + player.boots.armor + armorBonus.plus;
    return Math.floor(baseValue * armorBonus.multi);
};

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

var allItems = {};
var startingItems = 0;
$.each(items, function(key, value) {player.inventory.items[key] = startingItems; allItems[key] = value; value.key = key; value.slot = 'items';});
$.each(weapons, function(key, value) {player.inventory.weapons[key] = startingItems; allItems[key] = value; value.key = key; value.isWeapon = true; value.slot = 'weapons'; value.equipmentSlot = 'weapon';});
$.each(armors, function(key, value) {player.inventory.armors[key] = startingItems; allItems[key] = value; value.key = key; value.isArmor = true; value.slot = 'armors'; value.equipmentSlot = 'armor';});
$.each(helmets, function(key, value) {player.inventory.helmets[key] = startingItems; allItems[key] = value; value.key = key; value.isArmor = true; value.slot = 'helmets'; value.equipmentSlot = 'helmet';});
$.each(boots, function(key, value) {player.inventory.boots[key] = startingItems; allItems[key] = value; value.key = key; value.isArmor = true; value.slot = 'boots'; value.equipmentSlot = 'boots';});



function resetCharacter() {
    player.health = 200;
    player.maxHealth = 200;
    player.level = 0;
    player.experience = 0;
    player.craftingSkill = 0;
    player.poachingSkill = 0;
    player.miningSkill = 0;
    player.skillPoints = 0;
    player.skillCost = 1;
    player.weapon = weapons.fists;
    player.armor = armors.shirt;
    player.helmet = helmets.hair;
    player.boots = boots.bareFeet;
    player.weaponLevels = {
        'fist': 0,
        'club': 0,
        'sword': 0,
        'bow': 0,
        'spear': 0
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
    };
    player.specialSkills = [];
    resetSkillTree();
    updatePlayerStats();
    refreshAllInventoryPanels();
}

function updatePlayerStats() {
    $('.js-characterStats .js-currentHealth').text(player.health);
    $('.js-characterStats .js-maxHealth').text(player.maxHealth);
    $('.js-characterStats .js-healthFill').css('width', (100 * player.health / player.maxHealth) + '%');
    $('.js-characterStats .js-damage').text(player.getDamage());
    $('.js-characterStats .js-attackSpeed').text(player.getAttackSpeed().toFixed(2));
    $('.js-characterStats .js-armor').text(player.getArmor());
    $('.js-characterStats .js-level').text(player.level);
    var expForNextLevel = experienceForNextLevel(player.level);
    var expPercent = Math.min(1, player.experience / expForNextLevel);
    $('.js-characterStats .js-experienceFill').css('width', (100 * expPercent) + '%');
    $('.js-characterStats .js-experienceBar').attr('helpText', 'You have ' + player.experience + ' of ' + expForNextLevel + ' experience needed for your next level.');
    updateGold();
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
}

function updateGold() {
    $('.js-characterStats .js-gold').text(player.gold);
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
            refreshAllInventoryPanels();
        }
        updatePlayerStats();
    }
    updateSkillTree();
}

function zeroBonus() {
    return {'plus': 0, 'multi': 1};
}