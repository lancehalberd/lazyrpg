
/**
 * Moves to the area with the given key. Throws an error if no such area exists
 * or if there is no route to that area.
 */
actions.move = function (params, successCallback, errorCallback) {
    if (paramError(1, params, errorCallback)) return;
    var areaKey = params[0];
    var moveAction = getAreaAction('move', areaKey);
    if (!moveAction) {
        errorCallback("There is no path to '" + areaKey + "' from here.");
        return;
    }
    moveAction.perform();
    successCallback();
}
actions.shop = function (params, successCallback, errorCallback) {
    if (paramError(0, params, errorCallback)) return;
    var shopAction = getAreaAction('shop', null);
    if (!shopAction) {
        errorCallback("There is no shop here.");
        return;
    }
    shopAction.perform();
    successCallback();
}
actions.rest = function (params, successCallback, errorCallback) {
    if (paramError(0, params, errorCallback)) return;
    var restAction = getAreaAction('rest', null);
    if (!restAction) {
        errorCallback("You cannot rest here.");
        return;
    }
    restAction.perform();
    successCallback();
}

function getAreaAction(name, target) {
    for (var i = 0; i < currentArea.actions.length; i++) {
        var action = currentArea.actions[i];
        if (action.actionName == name && (!target || action.actionTarget == target)) {
            return action;
        }
    }
    return null;
}

var currentArea = null;

function MoveAction(target, slot) {
    this.actionName = "move";
    this.actionTarget = target;
    this.getDiv = function () {
        return $div('action slot' + slot, areas[target].$graphic).attr('helpText', 'Click here to move to the ' + areas[target].name);
    };
    this.perform = function () {
        stopFighting();
        closeAll();
        setArea(areas[target]);
        recordAction(this.actionName, this.actionTarget);
        player.time += 5000;
        updateTime();
    }
}

function RestAction(slot) {
    this.actionName = "rest";
    this.getDiv = function () {
        return $div('action slot' + slot, $div('box', 'Rest')).attr('helpText', 'Resting will restore your health, but you will also lose all your experience and skills and unequip all items.');
    };
    this.perform = function () {
        resetCharacter();
        player.time += 10000;
        recordAction(this.actionName, this.actionTarget);
    };
}

function updateShop() {
    $('.js-shopContainer .js-body .js-shopItem').each(function () {
        var item = $(this).data('item');
        $(this).toggleClass('canBuy', item.value * 2 <= player.gold);
    });
}

function ShopAction(items, slot) {
    this.actionName = "shop";
    var itemsForSale = {};
    this.itemsForSale = itemsForSale;
    items.forEach(function (item) {
        itemsForSale[item.key] = item;
    });
    this.getDiv = function () {
        return $div('action slot' + slot, $div('box', 'Shop')).attr('helpText', 'Spend gold here to buy items and equipment.');
    };
    this.perform = function () {
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
            $shopItem.find('.js-goldBuy').text(item.value * 2);
            $shopItem.data('item', item);
            $shopItem.toggleClass('canBuy', item.value * 2 <= player.gold);
            $('.js-shopContainer .js-body').append($shopItem);
        });
        recordAction(this.actionName, this.actionTarget);
    };
}

function setArea(area) {
    currentArea = area;
    $('.js-currentArea').empty().append(currentArea.$graphic);
    currentArea.actions.forEach(function (action) {
        var $actionDiv = action.getDiv();
        $('.js-currentArea').append($actionDiv);
        $actionDiv.on('click', function () {
            action.perform();
            removeToolTip();
        });
    });
}

var areas = {};
areas.shore =  {
    'name': 'Shore',
    '$graphic': $img('shore.png'),
    'actions': [
        new BattleAction(monsters.turtus, 2),
        new MoveAction('cave', 4),
        new MoveAction('forest', 6)
    ]
};
areas.cave =  {
    'name': 'Cave',
    '$graphic': $img('cave.png'),
    'actions': [
        new BattleAction(monsters.bat, 2),
        new MiningAction(minerals.copper, 1),
        new MoveAction('shore', 3)
    ]
};
areas.forest =  {
    'name': 'Forest',
    '$graphic': $img('forest.png'),
    'actions': [
        new BattleAction(monsters.rat, 2),
        new BattleAction(monsters.bandit, 3),
        new MoveAction('shore', 1),
        new MoveAction('village', 4)
    ]
};
areas.village =  {
    'name': 'Village',
    '$graphic': $img('town.png'),
    'actions': [
        new MoveAction('forest', 3),
        new RestAction(4),
        new ShopAction([items.smallPotion, weapons.shortBow, weapons.club], 2),
        new CraftAction(1),
        new MoveAction('river', 5)
    ]
};
areas.river =  {
    'name': 'River',
    '$graphic': $img('river.png'),
    'actions': [
        new BattleAction(monsters.troll, 1, function () {
            //remove the troll boss, add the volcano location
            areas.river.actions[0] = new MoveAction('savanna', 5);
            setArea(areas.river);
        }),
        new MoveAction('village', 3)
        //new MoveAction('savanna', 5)
    ]
};
areas.savanna = {
    'name': 'Savanna',
    '$graphic': $img('field.png'),
    'actions': [
        new MoveAction('river', 2),
        new BattleAction(monsters.lion, 3),
        new BattleAction(monsters.hyena, 1),
        new BattleAction(monsters.fowler, 6),
        new MoveAction('portTown', 5)
    ]
};
areas.portTown = {
    'name': 'Port Town',
    '$graphic': $img('town.png'),
    'actions': [
        new MoveAction('savanna', 2),
        new RestAction(4),
        new ShopAction([items.smallPotion, items.mediumPotion, weapons.crossbow, armors.bronzeArmor], 3),
        new CraftAction(1),
        new MoveAction('ship', 5)
    ]
};
areas.ship = {
    'name': 'Ship',
    '$graphic': $img('volcano.png'),
    'actions': [
        new MoveAction('portTown', 2),
        new BattleAction(monsters.pirate, 3, function () {
            //player can pass now that they defeated the pirate.
            //TD: this should happen each time they travel by ship
            areas.ship.actions[2] = new MoveAction('city', 5),
            setArea(areas.ship);
        })
    ]
};
areas.city = {
    'name': 'City',
    '$graphic': $img('town.png'),
    'actions': [
        new MoveAction('castleGates', 1),
        new MoveAction('ship', 2),
        new RestAction(3),
        new CraftAction(4),
        //Shop has limited iron equipment because the dark knight has taken over the iron mines
        new ShopAction([items.smallPotion, items.mediumPotion, weapons.claws, weapons.cudgel, armors.chainMail], 5),
        new MoveAction('field', 6)
    ]
};
areas.field = {
    'name': 'Field',
    '$graphic': $img('field.png'),
    'actions': [
        new BattleAction(monsters.mercenary, 1),
        new BattleAction(monsters.woodGolem, 3),
        new MoveAction('city', 2),
        new MoveAction('desert', 6),
        new MoveAction('marsh', 4)
    ]
};
areas.desert = {
    'name': 'Desert',
    '$graphic': $img('field.png'),
    'actions': [
        new BattleAction(monsters.scorpion, 1),
        new BattleAction(monsters.giantTortoise, 3),
        new MoveAction('field', 4),
        new MoveAction('desertCave', 6)
    ]
};
areas.desertCave = {
    'name': 'Desert Cave',
    '$graphic': $img('cave.png'),
    'actions': [
        new BattleAction(monsters.vampireBat, 1),
        new BattleAction(monsters.bear, 3),
        new MoveAction('desert', 4),
        new BattleAction(monsters.darkKnight, 6, function () {
            //remove the dark knight and open the iron mine
            areas.desertCave.actions[3] = new MoveAction('ironMine', 6),
            setArea(areas.desertCave);
        }),
        //new MoveAction('ironMine', 6)
    ]
};
areas.ironMine = {
    'name': 'Iron Mine',
    '$graphic': $img('cave.png'),
    'actions': [
        new MiningAction(minerals.iron, 1),
        new BattleAction(monsters.whelp, 2),
        new BattleAction(monsters.golem, 3),
        new MoveAction('desertCave', 4)
    ]
};
areas.marsh = {
    'name': 'Marsh',
    '$graphic': $img('river.png'),
    'actions': [
        new BattleAction(monsters.crocodile, 1),
        new BattleAction(monsters.mudGolem, 3),
        new MoveAction('field', 2),
        new MoveAction('marshCave', 4),
        new MoveAction('remoteAbode', 6)
    ]
};
areas.marshCave = {
    'name': 'Marsh Cave',
    '$graphic': $img('cave.png'),
    'actions': [
        new BattleAction(monsters.spider, 1),
        new BattleAction(monsters.maverick, 3),
        new MiningAction(minerals.tin, 4),
        new MoveAction('marsh', 6)
    ]
};
areas.remoteAbode = {
    'name': 'Remote Abode',
    '$graphic': $img('remoteAbode.png'),
    'actions': [
        new MoveAction('marsh', 4),
        new BattleAction(monsters.giantRat, 1),
        new BattleAction(monsters.witch, 3, function () {
            //remove the witch and open the cellar
            areas.remoteAbode.actions[2] = new MoveAction('cellar', 6),
            //replace enchantedKing with imposterKing now that the witch is defeated
            areas.throneRoom.actions[0] = new BattleAction(monsters.imposterKing, 2, function () {
                //remove the trex boss, add the castle location
                areas.throneRoom.actions.shift();
                setArea(areas.throneRoom);
                alert("You defeated the imposter king, but just what was he plotting anyway?");
            });
            setArea(areas.remoteAbode);
        }),
        //new MoveAction('cellar', 6)
    ]
};
areas.cellar = {
    'name': 'Cellar',
    '$graphic': $img('cave.png'),
    'actions': [
        new BattleAction(monsters.doomFlower, 1),
        new BattleAction(monsters.gargoyle, 3),
        new MoveAction('remoteAbode', 4)
    ]
};

areas.castleGates = {
    'name': 'Castle Gates',
    '$graphic': $img('castle.png'),
    'actions': [
        new BattleAction(monsters.possessedGuard, 1, function () {
            //can fight possessed captain after defeating possessed guard
            areas.castleGates.actions[2] = new BattleAction(monsters.possessedCaptain, 2, function () {
                //can move to the courtyard after defeating possessed captain
                areas.castleGates.actions[3] = new MoveAction('courtyard', 4),
                setArea(areas.castleGates);
            });
            setArea(areas.castleGates);
        }),
        new MoveAction('city', 6)
    ]
};
areas.courtyard = {
    'name': 'Courtyard',
    '$graphic': $img('field.png'),
    'actions': [
        new BattleAction(monsters.tRex, 2, function () {
            //remove the trex boss, add the castle location
            areas.courtyard.actions[0] = new MoveAction('castle', 4),
            setArea(areas.courtyard);
        }),
        //new MoveAction('castle', 4),
        new MoveAction('castleGates', 6)
    ]
};
areas.castle = {
    'name': 'Castle',
    '$graphic': $img('castle.png'),
    'actions': [
        new BattleAction(monsters.royalGuard, 1, function () {
            //remove the trex boss, add the castle location
            areas.castle.actions[3] = new MoveAction('throneRoom', 4);
            setArea(areas.castle);
        }),
        new BattleAction(monsters.giantSpider, 2),
        new MoveAction('courtyard', 6)
    ]
};
areas.throneRoom = {
    'name': 'Throne Room',
    '$graphic': $img('castle.png'),
    'actions': [
        //enchanted king cannot actually be defeated, defeat the witch to fight imposterKing instead
        new BattleAction(monsters.enchantedKing, 2),
        new MoveAction('castle', 6)
    ]
};