function alwaysTrue() {
    return true;
}

//The exploration ship is blocked by the Kraken's tentacles. They are difficult (but possible) to beat
//if the kraken is not defeated since they regenerate 10x as quickly and start out more powerful
var explorationCripplingTentaclesAction = new ToggleAction(new BattleAction(monsters.tentacles, 2, function () {
    currentArea.cripplingTentacles /= 2;
    updateTentacleStats(explorationCripplingTentacles, monsters.tentacles, currentArea.cripplingTentacles);
}), function () {
    return currentArea.cripplingTentacles > .5;
});
var explorationCripplingTentacles = explorationCripplingTentaclesAction.innerAction.monster;

var explorationPoisoningTentaclesAction = new ToggleAction(new BattleAction(monsters.toxicStingers, 7, function () {
    currentArea.poisoningTentacles /= 2;
    updateTentacleStats(explorationPoisoningTentacles, monsters.toxicStingers, currentArea.poisoningTentacles);
}), function () {
    return currentArea.poisoningTentacles > .5;
});
var explorationPoisoningTentacles = explorationPoisoningTentaclesAction.innerAction.monster;

areas.explorationShip =  {
    'name': 'Exploration Ship',
    'travelTime': 40,
    'travelDamage': 0,
    '$graphic': $img('ship.png'),
    'initialize': function () {
        currentArea.cripplingTentacles = (player.defeatedMonsters.neptuneCore > 0) ? 2 : 5;
        currentArea.poisoningTentacles = (player.defeatedMonsters.neptuneCore > 0) ? 2 : 5;
        updateTentacleStats(explorationCripplingTentacles, monsters.tentacles, currentArea.cripplingTentacles);
        updateTentacleStats(explorationPoisoningTentacles, monsters.toxicStingers, currentArea.poisoningTentacles);
    },
    'loop': function (deltaTime) {
        var factor = (player.defeatedMonsters.neptuneCore > 0) ? .1 : 1;
        if (currentArea.cripplingTentacles > .5) {
            currentArea.cripplingTentacles += factor * .1 * deltaTime / 1000;
        }
        if (currentArea.poisoningTentacles > .5) {
            currentArea.poisoningTentacles += factor * .1 * deltaTime / 1000;
        }
        updateTentacleStats(explorationCripplingTentacles, monsters.tentacles, currentArea.cripplingTentacles);
        updateTentacleStats(explorationPoisoningTentacles, monsters.toxicStingers, currentArea.poisoningTentacles);
        uiNeedsUpdate.area = true;
    },
    'actions': [
        new ToggleAction(new MoveAction('archeologistCamp', 1), function () {
            return (currentArea.cripplingTentacles <.5 && currentArea.poisoningTentacles < .5);
        }),
        explorationCripplingTentaclesAction,
        explorationPoisoningTentaclesAction,
        new BattleAction(monsters.giantUrchin, 4),
        new BattleAction(monsters.seaAnemone, 5),
        new MoveAction('city', 6)
    ],
    'trackName': 'ReboundInsomnia',
};
areas.archeologistCamp =  {
    'name': 'Archeologist Camp',
    'travelTime': 5,
    'travelDamage': 0,
    '$graphic': $img('poorVillage.png'),
    'actions': [
        new MoveAction('tundra', 1),
        new ShopAction(['cestus', 'mithrilMail', 'largePotion', 'mediumPotion', 'smallPotion'], 2),
        new CraftAction({'slot': 3, 'recipes': [recipes.common, recipes.mithril, recipes.gold]}),
        new EnchantAction(8),
        new SaveAction(4),
        new RestAction(5),
        new MoveAction('explorationShip', 6)
    ],
    'trackName': 'DayTwelve',
};
areas.tundra =  {
    'name': 'Tundra',
    'travelTime': 20,
    'travelDamage': 40,
    '$graphic': $img('field.png'),
    'actions': [
        new ToggleAction(new MoveAction('ancientCity', 1), function () {
            return player.defeatedMonsters.simurgh > 0;
        }),
        new ToggleAction(new BattleAction(monsters.simurgh, 2), function () {
            return player.defeatedMonsters.simurgh <= 0;
        }),
        new BattleAction(monsters.mammoth, 7),
        new BattleAction(monsters.sabertooth, 8),
        new MoveAction('archeologistCamp', 6)
    ]
};
areas.ancientCity =  {
    'name': 'Ancient City',
    'travelTime': 15,
    'travelDamage': 30,
    '$graphic': $img('town.png'),
    'actions': [
        new MoveAction('centralStation', 1),
        new MoveAction('mountain', 3),
        new MoveAction('tundra', 4)
    ]
};
areas.mountain =  {
    'name': 'Mountain',
    'travelTime': 15,
    'travelDamage': 30,
    '$graphic': $img('volcano.png'),
    'actions': [
        new BattleAction(monsters.roc, 2),
        new ToggleAction(new MoveAction('woods', 8, function () {
            //player always starts the woods at depth 0
            areas.woods.depth = 0;
        }), function () {
            return player.defeatedMonsters.ladon > 0;
        }),
        new ToggleAction(new BattleAction(monsters.ladon, 8), function () {
            return player.defeatedMonsters.ladon <= 0;
        }),
        new MoveAction('ancientCity', 4)
    ]
};
areas.woods = {
    'name': 'Woods',
    'depth': 0,
    'travelTime': 10,
    'travelDamage': 0,
    '$graphic': $img('forest.png'),
    'initialize': function () {
        //mark 1 of 3 paths correct as the player enters the woods. Selecting
        //this path moves them deeper into the woods.
        //defeating the blue cap removes the incorrect paths
        var choices = [areas.pathA, areas.pathB, areas.pathC];
        areas.pathA.correct =  areas.pathB.correct = areas.pathC.correct = false;
        random.element(choices).correct = true;
        currentArea.revealed = false;
        //blue cap and golden hind only appear in the area for a brief amount of time
        currentArea.hindTimer = Math.random() < currentArea.depth * .05 ? 1000 : 0; //chance increases as depth increases
        currentArea.blueCapTimer = [12500, 2500, 500, 100, 20][Math.min(4, currentArea.depth)];
        //gold doesn't appear until depth > 2
        currentArea.gold = Math.max(0, currentArea.depth - 2);
    },
    'realTimeLoop': function (deltaTime) {
        if (currentArea.hindTimer > 0) {
            currentArea.hindTimer -= deltaTime;
            if (currentArea.hindTimer <= 0) {
                uiNeedsUpdate.area = true;
            }
        }
        if (currentArea.blueCapTimer > 0) {
            currentArea.blueCapTimer -= deltaTime;
            if (currentArea.blueCapTimer <= 0) {
                uiNeedsUpdate.area = true;
            }
        }
    },
    'actions': [
        new MoveAction('mountain', 7),
        new ToggleAction(new MoveAction('pathA', 3), function () {
            return !currentArea.revealed || areas.pathA.correct;
        }),
        new ToggleAction(new MoveAction('pathB', 8), function () {
            return !currentArea.revealed || areas.pathB.correct;
        }),
        new ToggleAction(new MoveAction('pathC', 6), function () {
            return !currentArea.revealed || areas.pathC.correct;
        }),
        new ToggleAction(new BattleAction(monsters.goldWeaver, 1), function () {
            return currentArea.depth > 1
        }),
        new ToggleAction(new BattleAction(monsters.goldDigger, 4), function () {
            return currentArea.depth > 0
        }),
        new ToggleAction(new BattleAction(monsters.blueCap, 2, function () {
            currentArea.revealed = true;
            currentArea.hindTimer = 0;
        }), function () {
            return currentArea.blueCapTimer > 0 && !currentArea.revealed;
        }),
        //golden hind replaces the gold mining when it is present
        new ToggleAction(new BattleAction(monsters.goldenHind, 5), function () {
            return currentArea.hindTimer > 0
        }),
        new ToggleAction(new MiningAction(minerals.gold, 5, function () {
                currentArea.gold--;
            }), function () {
            return currentArea.hindTimer <= 0 && currentArea.gold > 0
        }),
    ]
};
//the three areas from the woods are just proxies for the woods itself.
function initializeWoodsPath() {
    if (currentArea.correct) {
        areas.woods.depth++;
    } else {
        areas.woods.depth = Math.max(0, Math.min(2, areas.woods.depth - 1));
    }
    setArea(areas.woods);
}
areas.pathA = {
    'name': 'Woods',
    'correct': false,
    'travelTime': 10,
    'travelDamage': 0,
    '$graphic': $img('forest.png'),
    'initialize': initializeWoodsPath,
    'actions': []
};
areas.pathB = {
    'name': 'Woods',
    'correct': false,
    'travelTime': 10,
    'travelDamage': 0,
    '$graphic': $img('forest.png'),
    'initialize': initializeWoodsPath,
    'actions': []
};
areas.pathC = {
    'name': 'Woods',
    'correct': false,
    'travelTime': 10,
    'travelDamage': 0,
    '$graphic': $img('forest.png'),
    'initialize': initializeWoodsPath,
    'actions': []
};

areas.centralStation =  {
    'name': 'Central Station',
    'travelTime': 5,
    'travelDamage': 0,
    '$graphic': $img('castle.png'),
    'actions': [
        new MoveAction('ancientCity', 6)
    ]
};