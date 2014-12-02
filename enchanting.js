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
        'travelingSpeed': 0
    };
}

function setupEnchantments() {
    $('.js-inventoryPanel.js-items').on('click', '.js-enchantment', function () {
        var key = $(this).data('key');
        var itemKey = $(this).data('itemKey');
        try {
            useEnchantment(key, itemKey);
        } catch(e) {
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
    uiNeedsUpdate[data.slot] = true;
    uiNeedsUpdate.playerStats = true;
    removeToolTip();
    recordAction(key + ' ' + itemKey);
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
$.each(enchantmentMap, function (key, data) {
    actions[key] = function (params, successCallback, errorCallback) {
        checkParams(1, params);
        var itemKey = params[0];
        useEnchantment(key, itemKey);
        successCallback();
    }
});
function $makeEnchantButton(item) {
    var enchantmentKey = getEnchantmentKey(item);
    if (enchantmentKey) {
        var $button = $('<button class="js-enchantment" helpText="' + enchantmentHelp(enchantmentMap[enchantmentKey], item[enchantmentKey]) + '">' + enchantmentMap[enchantmentKey].label + '</button>');
        $button.data('key', enchantmentKey);
        $button.data('itemKey', item.key);
        return $button;
    }
    return null;
}
function updatEnchantmentState(item) {
    var enchantmentKey = getEnchantmentKey(item);
    if (enchantmentKey) {
        var $button = item.$element.find('.js-enchantment');
        $button.attr('helpText', enchantmentHelp(enchantmentMap[enchantmentKey], item[enchantmentKey]));
        //add data back since data is lost when the item was last remove from the dom
        $button.data('key', enchantmentKey);
        $button.data('itemKey', item.key)
    }
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
    var enchantmentKey = getEnchantmentKey(item);
    sections = [];
    if (enchantmentKey) {
        sections = enchantmentEffectsHelp(item[enchantmentKey]);
        sections.unshift(enchantmentMap[enchantmentKey].label);
    }
    if (item.helpText) {
        sections.unshift(item.helpText + '<br/>');
    }
    return sections.join('<br/>')
}
function enchantmentEffectsHelp(enchantment) {
    var sections = [];
    if (enchantment.health) {
        sections.push('+' + percent(enchantment.health) + ' health.');
    }
    if (enchantment.armor) {
        sections.push('+' + percent(enchantment.armor) + ' armor.');
    }
    if (enchantment.reflect) {
        sections.push('+' + percent(enchantment.reflect) + ' of damage prevented by armor is reflect to enemies.');
    }
    if (enchantment.damage) {
        sections.push('+' + percent(enchantment.damage) + ' damage.');
    }
    if (enchantment.attackSpeed) {
        sections.push('+' + percent(enchantment.attackSpeed) + ' attack speed.');
    }
    if (enchantment.poison) {
        sections.push('+' + Math.floor(enchantment.poison) + ' damage over time on hit.');
    }
    if (enchantment.lifeSteal) {
        sections.push('+' + percent(enchantment.lifeSteal) + ' life steal.');
    }
    if (enchantment.armorPierce) {
        sections.push('+' + percent(enchantment.armorPierce) + ' of armor pierce.');
    }
    if (enchantment.armorBreak) {
        sections.push('+' + Math.floor(enchantment.armorBreak) + ' armor shred on hit.');
    }
    if (enchantment.cripple) {
        sections.push('+' + enchantment.cripple.toFixed() + ' crippling attacks, slowing enemy attack speed on hit.');
    }
    if (enchantment.parry) {
        sections.push('+' + percent(enchantment.parry) + ' of weapon damage added to armor.');
    }
    if (enchantment.experience) {
        sections.push('+' + percent(enchantment.experience) + ' experience gained.');
    }
    if (enchantment.poach) {
        sections.push((1 + enchantment.poach).toFixed(2) + 'x increased damage and reduced attack speed. Useful for poaching.');
    }
    if (enchantment.tenacity) {
        sections.push('+' + percent(enchantment.tenacity) + ' increased resistance to enemy special abilities.');
    }
    if (enchantment.travelingSpeed) {
        sections.push('+' + percent(enchantment.travelingSpeed) + ' travel speed.');
    }
    if (enchantment.vigor) {
        sections.push('+' + percent(enchantment.vigor) + ' vigor. Vigor reduces the health lost while mining and traveling.');
    }
    if (enchantment.miningSpeed) {
        sections.push('+' + percent(enchantment.miningSpeed) + ' increased mining speed.');
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
function getEnchantmentKey(item) {
    var enchantmentKey = null;
    $.each(enchantmentMap, function (key, data) {
        if (item[key]) {
            enchantmentKey = key;
            return false;
        }
        return true;
    });
    return enchantmentKey;
}