function emptyEnchantments() {
    return {
        'count': 0,
        'attackSpeed': 0, //implemented
        'miningSpeed': 0, //implemented
        'lifeSteal': 0, //implemented
        'poison': 0, //implemented
        'armorBreak': 0, //implemented
        'parry': 0, //implemented
        'armorPierce': 0, //implemented
        'damage': 0, //implemented
        'poach': 0, //implemented
        'cripple': 0, //implemented
        'vigor': 0, //implemented for mining
        'health': 0, //implemented
        'armor': 0, //implemented
        'reflect': 0, //implemented
        'experience': 0, //implemented
        'tenacity': 0, //implemented
        'travelSpeed': 0
    };
}

function setupEnchantments() {
    $('.js-inventoryPanel.js-items').on('click', '.js-enchantment', function () {
        var key = $(this).data('key');
        var itemKey = $(this).data('itemKey');
        try {
            useEnchantment(key, itemKey);
        } catch(e) {
            throw e;
            //ignore this error, only used for programming alerts
        }
    });
}

function useEnchantment(key, itemKey) {
    var item = allItems[itemKey];
    if (!item || !player.inventory[item.slot][item.key]) {
        throw new ProgrammingError('You don\'t own a ' + itemKey + '.');
    }
    var data = enchantmentMap[key];
    if (!data) {
        throw new ProgrammingError('Unrecognized enchantment key: ' + key + '.');
    }
    if (!key || !item[key]) {
        throw new ProgrammingError(item.name + ' cannot be used to enchant your ' + data.slot + '.');
    }
    var currentEnchantments = player.enchantments[data.slot];
    if (currentEnchantments.count > player.level) {
        throw new ProgrammingError('You are not high enough level to enchant your ' + data.slot + ' any further.');
    }
    if (player[data.slot] == baseEquipment[data.slot]) {
        throw new ProgrammingError('You have no ' + data.slot + ' equipped to enchant.');
    }
    if (data.type && player[data.slot].type == !data.type) {
        throw new ProgrammingError('You can only enchant a ' + data.type + ' class weapon with this item.');
    }
    var appliedEnchantment = item[key];
    var ratio = 1 / (1 + currentEnchantments.count);
    $.each(appliedEnchantment, function (key, data) {
        currentEnchantments[key] += appliedEnchantment[key] * ratio;
    });
    currentEnchantments.count++;
    player.inventory[item.slot][item.key]--;
    uiNeedsUpdate.items = true;
    uiNeedsUpdate.playerStats = true;
    removeToolTip();
}

var enchantmentMap = {
    'enchantFist': {'label': 'Enchant Glove', 'slot': 'weapon', 'type': 'fist'},
    'enchantSword': {'label': 'Enchant Sword', 'slot': 'weapon', 'type': 'sword'},
    'enchantClub': {'label': 'Enchant Club', 'slot': 'weapon', 'type': 'club'},
    'enchantBow': {'label': 'Enchant Bow', 'slot': 'weapon', 'type': 'bow'},
    'enchantArmor': {'label': 'Enchant Armor', 'slot': 'armor'},
    'enchantHelmet': {'label': 'Enchant Helmet', 'slot': 'helmet'},
    'enchantBoots': {'label': 'Enchant Boots', 'slot': 'boots'}
}
function $makeEnchantButton(item) {
    var $button = null;
    $.each(enchantmentMap, function (key, data) {
        if (item[key]) {
            $button = $('<button class="js-enchantment" helpText="' + enchantmentHelp(data, item[key]) + '">' + data.label + '</button>');
            $button.data('key', key);
            $button.data('itemKey', item.key);
            return false; //break loop
        }
        return true;
    });
    return $button;
}
function updatEnchantmentState(item) {
    $.each(enchantmentMap, function (key, data) {
        if (item[key]) {
            var $button = item.$element.find('.js-enchantment');
            $button.attr('helpText', enchantmentHelp(data, item[key]));
            //add data back since data is lost when the item was last remove from the dom
            $button.data('key', key);
            $button.data('itemKey', item.key)
            return false; //break loop
        }
        return true;
    });
}
function enchantmentHelp(data, enchantment) {
    var sections = [];
    if (player[data.slot] == baseEquipment[data.slot]) {
        sections.push('You have no ' + data.slot + ' equipped to enchant.<br/>');
    } else if (data.type && player[data.slot].type != data.type) {
        sections.push('You can only enchant a ' + data.type + ' class weapon with this item.<br/>');
    } else {
        var enchantmentsLeft = (1 + player.level - player.enchantments[data.slot].count);
        if (enchantmentsLeft > 1) {
            sections.push('You can add ' + enchantmentsLeft + ' more enchantments to your ' + data.slot + '.<br/>');
        } else if (enchantmentsLeft == 1) {
            sections.push('You can add 1 more enchantment to your ' + data.slot + '.<br/>');
        } else {
            sections.push('You must be a higher level to enchant your ' + data.slot + ' any further.<br/>');
        }
    }
    sections = sections.concat(enchantmentEffectsHelp(enchantment));
    if (player.enchantments[data.slot].count > 0) {
        sections.push('<br/>The next enchantment you add to your ' + data.slot + ' will have ' + percent(1 / (1 + player.enchantments[data.slot].count)) + ' effectiveness.');
    }
    var currentEnchantments = enchantmentEffectsHelp(player.enchantments[data.slot]);
    if (currentEnchantments.length > 0) {
        sections.push('<br/>Your current ' + data.slot + ' enchantments give you:');
        sections = sections.concat(currentEnchantments);
    }
    return sections.join('<br/>');
}

function getItemHelpTextWithEnchantments(item) {
    var sections = [];
    $.each(enchantmentMap, function (key, data) {
        if (item[key]) {
            sections = enchantmentEffectsHelp(item[key]);
            return false; //break loop
        }
        return true;
    });
    sections.unshift(item.helpText + '<br/>');
    return sections.join('<br/>')
}
function enchantmentEffectsHelp(enchantment) {
    var sections =[]
    if (enchantment.attackSpeed) {
        sections.push('Increase your attack speed  by ' + percent(enchantment.attackSpeed) + '.');
    }
    if (enchantment.miningSpeed) {
        sections.push('Increase your attack speed  by ' + percent(enchantment.miningSpeed) + '.');
    }
    if (enchantment.lifeSteal) {
        sections.push('Absorb ' + percent(enchantment.lifeSteal) + ' of your damage as life.');
    }
    if (enchantment.poison) {
        sections.push('Deal ' + enchantment.poison + ' damage over time on hit.');
    }
    if (enchantment.armorBreak) {
        sections.push('Weaken your enemies armor by ' + enchantment.armorBreak + ' each hit.');
    }
    if (enchantment.parry) {
        sections.push(percent(enchantment.parry) + ' of your weapon damage is added to your armor.');
    }
    if (enchantment.armorPierce) {
        sections.push('Your attacks ignore ' + percent(enchantment.armorPierce) + ' of your opponents armor.');
    }
    if (enchantment.damage) {
        sections.push('Increase your damage by ' + percent(enchantment.damage) + '.');
    }
    if (enchantment.poach) {
        sections.push('Slow your attacks and increase your damage by a factor of ' + (1 + enchantment.poach) + '.');
    }
    if (enchantment.cripple) {
        sections.push('Increased the crippling effect of your attacks ' + percent(enchantment.cripple) + ', slowing the attack speed of your opponents.');
    }
    if (enchantment.vigor) {
        sections.push('Increase your vigor by ' + percent(enchantment.vigor) + '. Vigor reduces the health lost while mining and traveling.');
    }
    if (enchantment.health) {
        sections.push('Increase your health by ' + percent(enchantment.health) + '.');
    }
    if (enchantment.armor) {
        sections.push('Increase your armor by ' + percent(enchantment.armor) + '.');
    }
    if (enchantment.reflect) {
        sections.push('Reflect ' + percent(enchantment.reflect) + ' of the damage prevented by your armor.');
    }
    if (enchantment.experience) {
        sections.push('Increase the experience you gain by ' + percent(enchantment.experience) + '.');
    }
    if (enchantment.tenacity) {
        sections.push('Reduce the effects of enemy special abilities by ' + percent(enchantment.tenacity) + '.');
    }
    if (enchantment.travelSpeed) {
        sections.push('Increase your travel speed by ' + percent(enchantment.travelSpeed) + '.');
    }
    return sections;
}

function percent(decimal) {
    return Math.floor(decimal * 100) + '%';
}

function resetEnchantment(slot) {
    player.enchantments[slot] = emptyEnchantments();
}

function getTotalEnchantment(type) {
    return player.enchantments.weapon[type] + player.enchantments.armor[type] + player.enchantments.helmet[type] + player.enchantments.boots[type];
}