
var items = {};
items.smallPotion = {
    'name': 'Small Potion',
    'use': function () {
        player.health = Math.min(player.getMaxHealth(), player.health + 100);
        updatePlayerStats();
    },
    'helpText': 'Drink this to recover 100 health.',
    'value': 5
};
items.mediumPotion = {
    'name': 'Medium Potion',
    'use': function () {
        player.health = Math.min(player.getMaxHealth(), player.health + 500);
        updatePlayerStats();
    },
    'helpText': 'Drink this to recover 500 health.',
    'value': 25
};
items.memoryCrystal = {
    'name': 'Memory Crystal',
    'helpText': 'Use this to recover a lost memory. <br/><br/> This will automatically be consumed to permanently unlock new starting classes on the skill tree if you attempt to unlock them.',
    'value': 0
};
items.copperOre = {
    'name': 'Copper Ore',
    'helpText': 'Raw copper ore.',
    'value': 7
};
items.copperIngot = {
    'name': 'Copper Ingot',
    'helpText': 'Refined copper that can be used for crafting.',
    'value': 100
};
items.tin = {
    'name': 'Tin',
    'helpText': 'Raw tin.',
    'value': 15
};
items.bronzePlating = {
    'name': 'Bronze Plating',
    'helpText': 'An alloy of copper and tin suitable for crafting armor',
    'value': 300
};
items.ironOre = {
    'name': 'Iron Ore',
    'helpText': 'Raw iron ore.',
    'value': 25
};
items.ironIngot = {
    'name': 'Iron Ingot',
    'helpText': 'Refined iron that can be used for crafting.',
    'value': 300
};
items.steelPlating = {
    'name': 'Steel Plating',
    'helpText': 'Plates of an alloy of iron and carbon for crafting armor.',
    'value': 300
};
items.silverOre = {
    'name': 'Silver Ore',
    'helpText': 'Raw silver ore.',
    'value': 50
};
items.silverIngot = {
    'name': 'Silver Ingot',
    'helpText': 'Refined silver that can be used for crafting, but it isn\'t very hard.',
    'value': 600
};
items.steeledSilver = {
    'name': 'Steeled Silver',
    'helpText': 'A stronger silver alloy. Weaker than regular steel but it repels evil.',
    'value': 800
};
items.mithrilSilver = {
    'name': 'Mithril Silver',
    'helpText': 'A silver alloy that is even stronger than steel.',
    'value': 4000
};
items.goldOre = {
    'name': 'Gold Ore',
    'helpText': 'Raw gold ore.',
    'value': 200
};
items.goldIngot = {
    'name': 'Gold Ingot',
    'helpText': 'Refined gold that can be used for crafting. It is quite soft for a metal.',
    'value': 1200
};
items.platinumOre = {
    'name': 'Platinum Ore',
    'helpText': 'Rare platinum ore.',
    'value': 1000
};
items.platinumIngot = {
    'name': 'Platinum Ingot',
    'helpText': 'Refined platinum that can be used for crafting. Somewhat harder than iron.',
    'value': 6000
};
items.titanimOre = {
    'name': 'Titanium Ore',
    'helpText': 'Raw titanium ore.',
    'value': 5000
};
items.adamantiumOre = {
    'name': 'Adamantium Ore',
    'helpText': 'Raw adamantium ore.',
    'value': 20000
};
items.quartz = {
    'name': 'Quartz',
    'value': 14
};
items.wingScraps = {
    'name': 'Wing Scraps',
    'helpText': 'Scraps of bat wings.',
    'value': 1
};
items.spiderWeb = {
    'name': 'Spider Web',
    'helpText': 'The web of a large spider.',
    'value': 30
};
items.strongWeb = {
    'name': 'Strong Web',
    'helpText': 'Surprisingly strong webbing.',
    'value': 100
};
items.timber = {
    'name': 'Timber',
    'helpText': 'Wood for crafting.',
    'value': 100
}
items.sturdyTimber = {
    'name': 'Sturdy Timber',
    'helpText': 'Strong, rigid wood.',
    'value': 200
}
items.suppleTimber = {
    'name': 'Supple Timber',
    'helpText': 'Strong wood that can bend a lot without breaking.',
    'value': 500
}
items.furScrap = {
    'name': 'Scrap of Fur',
    'helpText': 'Tattered animal fur.',
    'value': 1
};
items.smallPelt = {
    'name': 'Small Pelt',
    'helpText': 'A small but well preserved animal pelt.',
    'value': 3
};
items.fur = {
    'name': 'Fur',
    'helpText': 'Patched together animal furs that can be used for crafting.',
    'value': 10
};
items.leather = {
    'name': 'Leather',
    'helpText': 'Treated animal hide that can be used for crafting.',
    'value': 30
};
items.lionsMane = {
    'name': "Lion's Mane",
    'helpText': 'The magnificent beard of a lion.',
    'value': 50
}
items.largePelt = {
    'name': "Large Pelt",
    'helpText': 'A pelt from a large animal.',
    'value': 50
}
items.silk = {
    'name': "Silk",
    'helpText': 'A rare cloth of the finest quality',
    'value': 500
}
items.brokenShell = {
    'name': 'Broken Shell',
    'helpText': 'Broken pieces of shell.',
    'value': 5
};
items.smallShell = {
    'name': 'Small Shell',
    'helpText': 'An entire shell.',
    'value': 15
};
items.shellPlating = {
    'name': 'Shell Plating',
    'helpText': 'A hard material made from shells that can be used for crafting.',
    'value': 100
};
items.stinger = {
    'name': 'Stinger',
    'helpText': 'A scorpions stinger.',
    'value': 100
};
items.reptileSkin = {
    'name': 'Reptile Skin',
    'helpText': 'Scaley reptile leather.',
    'value': 100
};
items.tooth = {
    'name': 'Tooth',
    'helpText': 'A large predators tooth.',
    'value': 100
};
items.vampireFang = {
    'name': 'Vampire Fang',
    'helpText': 'The fang of a blood sucking creature.',
    'value': 100
};
items.largeShell = {
    'name': 'Large Shell',
    'helpText': 'The fang of a blood sucking creature.',
    'value': 100
};
items.tinScraps = {
    'name': 'Tin Scraps',
    'helpText': 'Scraps of tin that you should recycle.',
    'value': 100
};
items.dragonFang = {
    'name': 'Dragon Fang',
    'helpText': 'The fang of a dragon.',
    'value': 100
};
items.charcoal = {
    'name': 'Charcoal',
    'helpText': 'Might be useful for smelting ores.',
    'value': 100
};
items.stoneHead = {
    'name': 'Stone Head',
    'helpText': 'A once possessed stone head.',
    'value': 100
};
items.magicRubble = {
    'name': 'Rubble',
    'helpText': 'Rubble from a possessed statue',
    'value': 100
};

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
        item.$element.find('.js-itemQuantity').text(amount + 'x');
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
    updatePlayerStats();
    refreshInventoryPanel(item.slot);
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
    updatePlayerStats();
    refreshInventoryPanel(item.slot);
    recordAction("remove " + item.key);
}

function buyItem(item, quantity) {
    if (quantity * getBuyPrice(item) > player.gold) {
        return;
    }
    player.gold -= quantity * getBuyPrice(item);
    player.inventory[item.slot][item.key] += quantity;
    refreshInventoryPanel(item.slot);
    //show the inventory page that the item was added to
    $('.js-inventoryPanel').removeClass('selected');
    $('.js-inventoryPanel.js-' + item.slot).addClass('selected');
    updateGold();
    //update buy buttons now that you have less gold
    updateShop();
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
        item.$element.find('.js-itemQuantity').text(owned + 'x');
    } else {
        loseLastItem(item);
    }
    updateGold();
    //update buy buttons now that you have more gold
    updateShop();
    recordAction("sell " + quantity + " " + item.key);
}

actions.buy = function (params, successCallback, errorCallback) {
    if (paramError(2, params, errorCallback)) return;
    var shopAction = getAreaAction('shop');
    if (!shopAction) {
        errorCallback("There is no shop here.");
        return;
    }
    var item = shopAction.itemsForSale[params[1]];
    if (!item) {
        errorCallback("'" + params[1]+"' is not for sale here.");
        return;
    }
    var quantity = parseInt(params[0]);
    if (isNaN(quantity)) {
        errorCallback("Expected a number, but got '" + params[0] + "'");
        return
    }
    if (quantity < 1) {
        errorCallback('Quantity must be at least 1');
        return;
    }
    if (quantity * getBuyPrice(item) > player.gold) {
        errorCallback("You don't have enough gold for this purchase.");
        return;
    }
    buyItem(item, quantity);
    successCallback();
}

actions.sell = function (params, successCallback, errorCallback) {
    if (paramError(2, params, errorCallback)) return;
    var shopAction = getAreaAction('shop');
    if (!shopAction) {
        errorCallback("There is no shop here.");
        return;
    }
    var item = allItems[params[1]];
    if (!item || player.inventory[item.slot][item.key] == 0) {
        errorCallback("You don't have a '" + params[1] + "'.");
        return;
    }
    var quantity = parseInt(params[0]);
    if (isNaN(quantity)) {
        errorCallback("Expected a number, but got '" + params[0] + "'");
        return;
    }
    if (quantity < 1) {
        errorCallback('Quantity must be at least 1');
        return;
    }
    if (player.inventory[item.slot][item.key] < quantity) {
        errorCallback("You don't own " + quantity + " '" + params[1] + "'.");
        return;
    }
    sellItem(item, quantity);
    successCallback();
}

actions.use = function (params, successCallback, errorCallback) {
    if (paramError(1, params, errorCallback)) return;
    var key = params[0];
    var item = allItems[key];
    if (!item || player.inventory[item.slot][item.key] == 0) {
        errorCallback("You don't have a '" + key + "'.");
        return;
    }
    if (!item.use) {
        errorCallback("You cane use that item.");
        return;
    }
    useItem(item);
    successCallback();
}

actions.equip = function (params, successCallback, errorCallback) {
    if (paramError(1, params, errorCallback)) return;
    var key = params[0];
    var item = allItems[key];
    if (!item || player.inventory[item.slot][item.key] == 0) {
        errorCallback("You don't have a '" + key + "'.");
        return;
    }
    if (!canEquip(item)) {
        errorCallback("You aren't skilled enough to equip that.");
        return;
    }
    equipItem(item);
    successCallback();
}

actions.remove = function (params, successCallback, errorCallback) {
    if (paramError(1, params, errorCallback)) return;
    var key = params[0];
    var item = allItems[key];
    if (!item || !item.equipmentSlot || player[item.equipmentSlot] != item) {
        errorCallback("You don't have that equipped.");
        return;
    }
    removeItem(item);
    successCallback();
}

function optimizeArmor() {
    $.each(player.inventory.armors, equipArmorIfBetter);
    $.each(player.inventory.helmets, equipArmorIfBetter);
    $.each(player.inventory.boots, equipArmorIfBetter);
    updatePlayerStats();
    refreshAllInventoryPanels();
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
        updatePlayerStats();
    }
    item.$element.remove();
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
    var isShopOpen = $('.js-shopContainer').is('.open');
    $('.js-inventoryPanel.js-' + typeKey + ' .js-body').empty();
    $.each(player.inventory[typeKey], function (key, amount) {
        if (amount == 0) {
            return;
        }
        var item = allItems[key];
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
        }
        item.$element.find('.js-itemQuantity').text(amount + 'x');
        item.$element.find('.js-goldOne').text(getSellPrice(item));
        item.$element.find('.js-goldAll').text(getSellPrice(item) * amount);
        item.$element.find('.js-sellActions').toggle(isShopOpen);
        item.$element.attr('helpText', helpText);
        item.$element.data('item', item);
        $('.js-inventoryPanel.js-' + typeKey + ' .js-body').append(item.$element);
    });
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