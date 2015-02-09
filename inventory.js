
function getSellPrice(item) {
    return Math.round(item.value * (player.specialSkills.gouge ? 1.5 : 1));
}
function getBuyPrice(item) {
    return Math.round(item.value * 2 * (player.specialSkills.haggle ? .8 : 1));
}

function setupInventory() {
    $('.js-inventoryPanel .js-inventoryTab').on('click', function () {
        if (!$('.js-inventoryContainer').is('.open')) {
            //if this click is opening the inventory, close all other open windows
            closeAll();
            $('.js-inventoryContainer').addClass('open');
        } else if ($(this).closest('.js-inventoryPanel.selected').length > 0) {
            //clicking the selected panel when open closes everything
            closeAll();
            return;
        }
        //mark the clicked panel as selected
        $('.js-inventoryPanel').removeClass('selected');
        $(this).closest('.js-inventoryPanel').addClass('selected');
    });
}
actions.use = function (params) {
    checkParams(1, params);
    var key = params[0];
    var item = allItems[key];
    if (!item || player.inventory[item.slot][item.key] == 0) {
        throw new ProgrammingError("You don't have a '" + key + "'.");
    }
    if (!item.use) {
        throw new ProgrammingError("You cannot use that item.");
    }
    item.use();
    player.inventory[item.slot][item.key]--;
    if (player.inventory[item.slot][item.key]) {
        if (item.$element) {
            item.$element.find('.js-itemQuantity').text(player.inventory[item.slot][item.key] + 'x');
        }
    } else {
        loseLastItem(item);
    }
}

actions.equip = function (params) {
    checkParams(1, params);
    var key = params[0];
    var item = allItems[key];
    if (!item || player.inventory[item.slot][item.key] == 0) {
        throw new ProgrammingError("You don't have a  '" + key + "'.");
    }
    if (!item.equipmentSlot) {
        throw new ProgrammingError("A '" + key + "' is not an equippable item.");
    }
    if (!canEquip(item)) {
        throw new ProgrammingError("You aren't skilled enough to equip a '" + key + "'.");
    }
    player[item.equipmentSlot] = item;
    uiNeedsUpdate.playerStats = true;
    uiNeedsUpdate[item.slot] = true;
    //need to update items to adjust enchantment help text
    uiNeedsUpdate.items = true;
    //enchantments where off when changing or removing equipment
    resetEnchantment(item.equipmentSlot);
};
actions.remove = function (params) {
    checkParams(1, params);
    var key = params[0];
    var item = allItems[key];
    if (!item || !item.equipmentSlot || player[item.equipmentSlot] != item) {
        throw new ProgrammingError("You don't have that equipped.");
    }
    player[item.equipmentSlot] = baseEquipment[item.equipmentSlot];
    uiNeedsUpdate.playerStats = true;
    uiNeedsUpdate[item.slot] = true;
    //need to update items to adjust enchantment help text
    uiNeedsUpdate.items = true;
    //enchantments where off when changing or removing equipment
    resetEnchantment(item.equipmentSlot);
};
actions.optimizeArmor = function (params) {
    checkParams(0, params);
    $.each(player.inventory.armors, equipArmorIfBetter);
    $.each(player.inventory.helmets, equipArmorIfBetter);
    $.each(player.inventory.boots, equipArmorIfBetter);
}

function equipArmorIfBetter(key, amount) {
    var item = allItems[key];
    if (amount <= 0) {
        return;
    }
    if (item.level > player.level || item.armor < player[item.equipmentSlot].armor) {
        return;
    }
    player[item.equipmentSlot] = item;
    uiNeedsUpdate.playerStats = true;
    uiNeedsUpdate[item.slot] = true;
}

function loseLastItem(item) {
    //unequip this item if it was equipped
    if (item.equipmentSlot && player[item.equipmentSlot] == item) {
        player[item.equipmentSlot] = baseEquipment[item.equipmentSlot];
        uiNeedsUpdate.playerStats = true;
    }
    if (item.$element) {
        item.$element.remove();
    }
}

function $baseInventoryItem() {
    return $('.js-baseItem').clone().removeClass('js-baseItem').show();
}

function $baseShopItem() {
    return $('.js-baseShopItem').clone().removeClass('js-baseShopItem').show();
}

function $item(item, $item) {
    $item.find('.js-itemName').html(getItemName(item));
    if (!item.isWeapon) {
        $item.find('.js-weaponDetails').remove();
    } else {
        $item.find('.js-level').text('Level ' + item.level);
        $item.find('.js-type').text(item.type);
        $item.find('.js-damage').text(item.damage);
        $item.find('.js-attackSpeed').text(item.attackSpeed);
    }
    if (!item.isArmor) {
        $item.find('.js-armorDetails').remove();
    } else {
        $item.find('.js-level').text('Level ' + item.level);
        $item.find('.js-armor').text(item.armor);
    }
    if (!item.equipmentSlot) {
        $item.find('.equipAction').remove();
        $item.find('.unequipAction').remove();
    }
    var $enchantButton = $makeEnchantButton(item);
    $item.find('.js-use').attr('code', 'use ' + item.key);
    $item.find('.js-equip').attr('code', 'equip ' + item.key);
    $item.find('.js-unequip').attr('code', 'remove ' + item.key);
    $item.find('.js-sellOne').attr('code', 'sell 1 ' + item.key);
    $item.find('.js-sellAll').attr('code', 'sellAll ' + item.key);
    $item.find('.js-buy').attr('code', 'buy 1 ' + item.key);
    if ($enchantButton) {
        $item.find('.js-use').after($enchantButton);
    }
    if (!item.use) {
        $item.find('.js-use').remove();
    }
    return $item;
}

function refreshAllInventoryPanels() {
    refreshInventoryPanel('items');
    refreshInventoryPanel('weapons');
    refreshInventoryPanel('armors');
    refreshInventoryPanel('helmets');
    refreshInventoryPanel('boots');
}

function refreshInventoryPanel(typeKey) {
    $('.js-inventoryPanel.js-' + typeKey + ' .js-body').empty();
    $.each(player.inventory[typeKey], function (key, amount) {
        if (amount == 0) {
            return;
        }
        var item = allItems[key];
        if (!item) {
            //console.log("missing item " + key);
            return;
        }
        var helpText = item.helpText;
        if (!item.$element) {
            item.$element = $item(item, $baseInventoryItem());
        }
        if (item.equipmentSlot) {
            var equipped = (item == player[item.equipmentSlot]);
            item.$element.toggleClass('isEquipped', equipped);
            var canEquipItem = canEquip(item);
            item.$element.toggleClass('canEquip', canEquipItem);
            if (item.armorBreak) {
                helpText += "<br/><br/>This weapon reduces the armor of enemies each time it hits.";
            }
            if (item.armorPierce) {
                helpText += "<br/><br/>This weapon ignores some of the armor of enemies.";
            }
            if (item.lifeSteal) {
                helpText += "<br/><br/>This weapon steals a percentage of the damage dealt as life.";
            }
            if (item.cripple) {
                helpText += "<br/><br/>Attacks from this weapon reduces the attack speed of enemies.";
            }
            if (item.parry) {
                helpText += "<br/><br/>You can block using this weapon, increasing your armor.";
            }
            if (item.poison) {
                helpText += "<br/><br/>This weapon deals damage over time to enemies.";
            }
            if (!canEquipItem) {
                helpText += "<br/><br/>" + (item.isWeapon ? "Your " + item.type+" skill is not high enough to equip this yet." : "Your level is not high enough to equip this yet.");
            }
            if (player[item.equipmentSlot] == item) {
                var currentEnchantments = enchantmentEffectsHelp(player.enchantments[item.equipmentSlot]);
                if (currentEnchantments.length > 0) {
                    helpText += '<br/><br/>Enchantment bonuses:<br/>';
                    helpText += currentEnchantments.join('<br/>');
                }
            }
        }
        item.$element.find('.js-itemQuantity').text(amount + 'x');
        item.$element.find('.js-goldOne').text(getSellPrice(item));
        item.$element.find('.js-goldAll').text(getSellPrice(item) * amount);
        if (item.value <= 0) {
            item.$element.find('.js-sellActions').remove();
        }
        item.$element.find('.js-itemName').attr('helpText', helpText);
        item.$element.data('item', item);
        updatEnchantmentState(item);
        $('.js-inventoryPanel.js-' + typeKey + ' .js-body').append(item.$element);
    });
    //show the sell actions on all these items if the shop is open
    $('.js-inventoryPanel.js-' + typeKey + ' .js-body').find('.js-sellActions').toggle($('.js-shopContainer').is('.open'));
}

function canEquip(item) {
    if (!item.equipmentSlot) {
        return false;
    }
    if (item.isWeapon) {
        return player.weaponLevels[item.type] >= item.level;
    } else if (item.level > player.level) {
        return false;
    }
    return true;
}