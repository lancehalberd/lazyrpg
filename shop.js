
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
}

function sell(params) {
    checkParams(2, params);
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
};
function sellAll(params) {
    checkParams(1, params);
    var item = allItems[params[0]];
    if (!item || player.inventory[item.slot][item.key] == 0) {
        throw new ProgrammingError("You don't have any '" + params[0] + "'.");
    }
    if (item.value <= 0) {
        throw new ProgrammingError("You cannot sell '" + params[0] + "'.");
    }
    var quantity = player.inventory[item.slot][item.key];
    sellItem(item, quantity);
};

function ShopAction(itemKeys, slot) {
    var itemsForSale = {};
    var items = [];
    itemKeys.forEach(function (itemKey) {
        var item = allItems[itemKey];
        if (!item) {
            console.log("Missing Item: " + itemKey);
            return;
        }
        itemsForSale[itemKey] = item;
        items.push(item);
    });
    this.getDiv = function () {
        return $div('action slot' + slot, $div('box', 'Shop')).attr('helpText', 'Spend gold here to buy items and equipment.');
    };
    this.action = function () {
        if ($('.js-shopContainer').is('.open')) {
            return 'hideTabs';
        }
        return 'shop';
    }
    this.addActions = function () {
        placeActions.shop = function (params) {
            checkParams(0, params);
            if ($('.js-shopContainer').is('.open')) {
                closeAll();
                return;
            }
            closeAll();
            $('.js-shopContainer').addClass('open');
            $('.js-inventoryContainer').addClass('open');
            $('.js-inventoryPanel .js-sellActions').show();
            $('.js-shopContainer .js-body').empty();
            items.forEach(function (item) {
                var $shopItem = $item(item, $baseShopItem());
                $shopItem.attr('helpText', item.helpText);
                $shopItem.find('.js-goldBuy').text(item.value * 2);
                $shopItem.data('item', item);
                $shopItem.toggleClass('canBuy', item.value * 2 <= player.gold);
                $('.js-shopContainer .js-body').append($shopItem);
            });
        };
        placeActions.buy = function (params) {
            checkParams(2, params);
            var item = itemsForSale[params[1]];
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
        };
        placeActions.buyMax = function (params) {
            checkParams(1, params);
            var item = itemsForSale[params[0]];
            if (!item) {
                throw new ProgrammingError("'" + params[0] + "' is not for sale here.");
            }
            var quantity = Math.floor(player.gold / getBuyPrice(item));
            if (quantity) {
                buyItem(item, quantity);
            }
        };
        placeActions.sell = sell;
        placeActions.sellAll = sellAll;
    };
}