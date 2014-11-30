
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
    $('.js-inventoryPanel').on('click', '.js-use', function () {
        //get the amount to make sure it can be sold
        var item = $(this).closest('.js-item').data('item');
        useItem(item);
    });
    $('.js-inventoryPanel').on('click', '.js-equip', function () {
        //get the amount to make sure it can be sold
        var item = $(this).closest('.js-item').data('item');
        equipItem(item);
    });
    $('.js-inventoryPanel').on('click', '.js-unequip', function () {
        //get the amount to make sure it can be sold
        var item = $(this).closest('.js-item').data('item');
        removeItem(item);
    });
    $('.js-inventoryPanel').on('click', '.js-sellOne', function () {
        var item = $(this).closest('.js-item').data('item');
        sellItem(item, 1);
    });
    $('.js-inventoryPanel').on('click', '.js-sellAll', function () {
        var item = $(this).closest('.js-item').data('item');
        sellItem(item, player.inventory[item.slot][item.key]);
    });
    $('.js-shopContainer').on('click', '.js-buy', function () {
        //get the amount to make sure it can be sold
        var item = $(this).closest('.js-item').data('item');
        buyItem(item, 1);
    });
}

function useItem(item) {
    if (!item.use) {
        return;
    }
    var amount = player.inventory[item.slot][item.key];
    if (amount <= 0) {
        return;
    }
    amount--;
    player.inventory[item.slot][item.key] = amount;
    item.use();
    if (amount) {
        if (item.$element) {
            item.$element.find('.js-itemQuantity').text(amount + 'x');
        }
    } else {
        loseLastItem(item);
    }
    recordAction("use " + item.key);
}

function equipItem(item) {
    if (!player.inventory[item.slot][item.key]) {
        return;
    }
    if (!item.equipmentSlot) {
        return;
    }
    var amount = player.inventory[item.slot][item.key];
    if (amount <= 0) {
        return;
    }
    player[item.equipmentSlot] = item;
    uiNeedsUpdate.playerStats = true;
    uiNeedsUpdate[item.slot] = true;
    //need to update items to adjust enchantment help text
    uiNeedsUpdate.items = true;
    //enchantments where off when changing or removing equipment
    resetEnchantment(item.equipmentSlot);
    recordAction("equip " + item.key);
}

function removeItem(item) {
    if (!player.inventory[item.slot][item.key]) {
        return;
    }
    if (!item.equipmentSlot) {
        return;
    }
    player[item.equipmentSlot] = baseEquipment[item.equipmentSlot];
    uiNeedsUpdate.playerStats = true;
    uiNeedsUpdate[item.slot] = true;
    //need to update items to adjust enchantment help text
    uiNeedsUpdate.items = true;
    //enchantments where off when changing or removing equipment
    resetEnchantment(item.equipmentSlot);
    recordAction("remove " + item.key);
}

function buyItem(item, quantity) {
    if (quantity * getBuyPrice(item) > player.gold) {
        return;
    }
    player.gold -= quantity * getBuyPrice(item);
    player.inventory[item.slot][item.key] += quantity;
    uiNeedsUpdate[item.slot] = true;
    //show the inventory page that the item was added to
    $('.js-inventoryPanel').removeClass('selected');
    $('.js-inventoryPanel.js-' + item.slot).addClass('selected');
    uiNeedsUpdate.playerStats = true;
    //update buy buttons now that you have less gold
    uiNeedsUpdate.shop = true;
    recordAction("buy " + quantity + " " + item.key);
}

function sellItem(item, quantity) {
    var owned = player.inventory[item.slot][item.key];
    if (quantity > 0 && owned < quantity) {
        return;
    }
    owned -= quantity;
    player.gold += getSellPrice(item) * quantity;
    player.inventory[item.slot][item.key] = owned;
    if (owned) {
        uiNeedsUpdate[item.slot] = true;
    } else {
        loseLastItem(item);
    }
    uiNeedsUpdate.playerStats = true;
    //update buy buttons now that you have more gold
    uiNeedsUpdate.shop = true;
    recordAction("sell " + quantity + " " + item.key);
}

actions.buy = function (params, successCallback, errorCallback) {
    checkParams(2, params);
    var shopAction = getAreaAction('shop');
    if (!shopAction) {
        throw new ProgrammingError("There is no shop here.");
    }
    var item = shopAction.itemsForSale[params[1]];
    if (!item) {
        throw new ProgrammingError("'" + params[1]+"' is not for sale here.");
    }
    var quantity = parseInt(params[0]);
    if (isNaN(quantity)) {
        throw new ProgrammingError("Expected a number, but got '" + params[0] + "'");
    }
    if (quantity < 1) {
        throw new ProgrammingError('Quantity must be at least 1');
    }
    if (quantity * getBuyPrice(item) > player.gold) {
        throw new ProgrammingError("You don't have enough gold for this purchase.");
    }
    buyItem(item, quantity);
    successCallback();
};
actions.buyMax = function (params, successCallback, errorCallback) {
    checkParams(1, params);
    var shopAction = getAreaAction('shop');
    if (!shopAction) {
        throw new ProgrammingError("There is no shop here.");
    }
    var item = shopAction.itemsForSale[params[0]];
    if (!item) {
        throw new ProgrammingError("'" + params[0] + "' is not for sale here.");
    }
    var quantity = Math.floor(player.gold / getBuyPrice(item));
    if (quantity) {
        buyItem(item, quantity);
    }
    successCallback();
};

actions.sell = function (params, successCallback, errorCallback) {
    checkParams(2, params);
    var shopAction = getAreaAction('shop');
    if (!shopAction) {
        throw new ProgrammingError("There is no shop here.");
    }
    var item = allItems[params[1]];
    if (!item || player.inventory[item.slot][item.key] == 0) {
        throw new ProgrammingError("You don't have a '" + params[1] + "'.");
    }
    if (item.value <= 0) {
        throw new ProgrammingError("You cannot sell '" + params[0] + "'.");
    }
    var quantity = parseInt(params[0]);
    if (isNaN(quantity)) {
        throw new ProgrammingError("Expected a number, but got '" + params[0] + "'");
    }
    if (quantity < 1) {
        throw new ProgrammingError('Quantity must be at least 1');
    }
    if (player.inventory[item.slot][item.key] < quantity) {
        throw new ProgrammingError("You don't own " + quantity + " '" + params[1] + "'.");
    }
    sellItem(item, quantity);
    successCallback();
};
actions.sellAll = function (params, successCallback, errorCallback) {
    checkParams(1, params);
    var shopAction = getAreaAction('shop');
    if (!shopAction) {
        throw new ProgrammingError("There is no shop here.");
    }
    var item = allItems[params[0]];
    if (!item || player.inventory[item.slot][item.key] == 0) {
        throw new ProgrammingError("You don't have any '" + params[0] + "'.");
    }
    if (item.value <= 0) {
        throw new ProgrammingError("You cannot sell '" + params[0] + "'.");
    }
    var quantity = player.inventory[item.slot][item.key];
    sellItem(item, quantity);
    successCallback();
};

actions.use = function (params, successCallback, errorCallback) {
    checkParams(1, params);
    var key = params[0];
    var item = allItems[key];
    if (!item || player.inventory[item.slot][item.key] == 0) {
        throw new ProgrammingError("You don't have a '" + key + "'.");
    }
    if (!item.use) {
        throw new ProgrammingError("You cane use that item.");
    }
    useItem(item);
    successCallback();
}

actions.equip = function (params, successCallback, errorCallback) {
    checkParams(1, params);
    var key = params[0];
    var item = allItems[key];
    if (!item || player.inventory[item.slot][item.key] == 0) {
        throw new ProgrammingError("You don't have a '" + key + "'.");
    }
    if (!canEquip(item)) {
        throw new ProgrammingError("You aren't skilled enough to equip that.");
    }
    equipItem(item);
    successCallback();
}

actions.remove = function (params, successCallback, errorCallback) {
    checkParams(1, params);
    var key = params[0];
    var item = allItems[key];
    if (!item || !item.equipmentSlot || player[item.equipmentSlot] != item) {
        throw new ProgrammingError("You don't have that equipped.");
    }
    removeItem(item);
    successCallback();
}

function optimizeArmor() {
    $.each(player.inventory.armors, equipArmorIfBetter);
    $.each(player.inventory.helmets, equipArmorIfBetter);
    $.each(player.inventory.boots, equipArmorIfBetter);
    uiNeedsUpdate.playerStats = true;
    uiNeedsUpdate.inventory = true;
    recordAction('optimizeArmor');
}

actions.optimizeArmor = function (params, successCallback, errorCallback) {
    optimizeArmor();
    successCallback();
}

function equipArmorIfBetter(key, amount) {
    var item = allItems[key];
    if (amount <= 0) {
        return;
    }
    if (item.level > player.level || item.level < player[item.equipmentSlot].level) {
        return;
    }
    player[item.equipmentSlot] = item;
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
            console.log("missing item " + key);
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