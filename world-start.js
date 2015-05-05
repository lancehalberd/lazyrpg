function $illustration(source, extraClass) {
    return $img(source).addClass('illustration' + (extraClass ? ' ' + extraClass : ''));
}

areas.shore = new WorldArea({
    'name': 'Shore',
    '$graphic': $illustration('noahBeach.jpg'),
    'initialize': function () {
        addAgentToArea(this, new MonsterAgent({'monster': monsters.turtus, 'left': 500, 'top': 450}));
        addAgentToArea(this, new MonsterAgent({'monster': monsters.turtus, 'left': 330, 'top': 450}));
        addPath(this, new PathAction({'target': 'cave', 'points': '68.5,484,56.5,226,159.5,196,263.5,412', 'damage': 10}));
        addPath(this, new PathAction({'target': 'forest', 'points': '957.5,93,693.5,164,633.5,377,728.5,473,956.5,550'}));
    },
    'loop': function () {
        this.agentsByKey.turtus.forEach(function (turtus) {
            if (turtus.timeDefeated && (player.time - turtus.timeDefeated) > 2000) {
                turtus.reset();
            }
        });
    },
    'story': 'Was I in a shipwreck? I can remember no events only the impression of suffering and loss remains. And yet I woke up on this shore completely healthy, as if reborn.',
    'trackName': 'ReboundInsomnia'
});
areas.forest = new WorldArea({
    'name': 'Forest',
    '$graphic': $illustration('simpleForest.png'),
    'initialize': function () {
        addAgentToArea(this, new MonsterAgent({'monster': monsters.rat, 'left': 400, 'top': 450}));
        addPath(this, new PathAction({'target': 'shore', 'points': '3.5,228,136.5,246,120.5,277,2.5,261'}));
        addPath(this, new PathAction({'target': 'village', 'points': '320.5,600,338.5,514,630.5,514,669.5,600'}));
    },
    'loop': function () {
        this.agentsByKey.rat.forEach(function (rat) {
            if (rat.timeDefeated && (player.time - rat.timeDefeated) > 1000) {
                rat.reset();
            }
        });
    },
    'story': 'There is something soulless and alien about the creatures I have encountered since waking. It is almost as if their only purpose is to act as adversaries and obstacles to my progress.'
});
areas.cave = new WorldArea({
    'name': 'Cave',
    'travelTime': 5,
    'travelDamage': 2,
    '$graphic': $illustration('cave.png', 'stretch'),
    'initialize': function () {
        addAgentToArea(this, new MonsterAgent({'monster': monsters.bat, 'left': 700, 'top': 60}));
        addAgentToArea(this, new MonsterAgent({'monster': monsters.bat, 'left': 450, 'top': 50}));
        addAgentToArea(this, new MonsterAgent({'monster': monsters.bat, 'left': 200, 'top': 70}));
        addPath(this, new PathAction({'target': 'shore', 'points': '957.5,93,693.5,164,633.5,377,728.5,473,956.5,550'}));
    },
    'loop': function () {
        var lastBatDefeated = 0;
        this.agentsByKey.bat.forEach(function (bat) {
            if (bat.timeDefeated) {
                lastBatDefeated = Math.max(bat.timeDefeated, lastBatDefeated);
            } else {
                lastBatDefeated = player.time;
            }
        });
        if ((player.time - lastBatDefeated) > 1000) {
            this.agentsByKey.bat.forEach(function (bat) {
                bat.reset();
            });
        }
    },
    'story': 'The ore deposits in this cave resonate with something lost to me. I once made things, things of quality and beauty. If I can find the strength to harvest this ore, perhaps I will once more.'
});
areas.village = new WorldArea({
    'name': 'Village',
    'travelTime': 5,
    'travelDamage': 0,
    '$graphic': $illustration('simpleVillage.png'),
    'initialize': function () {
        addPath(this, new PathAction({'target': 'forest', 'points': '511.5,156,512.5,238,609.5,237,590.5,169'}));
        //addPath(this, new PathAction({'target': 'river', 'points': '284.5,600,353.5,530,564.5,541,524.5,600'}));
    },
    'loop': function () {
    },
    'story': 'Civilization, at last! I can take refuge here and get some idea of where in the world I am.'
});
/*
areas.village =  {
    'name': 'Village',
    'travelTime': 2,
    'travelDamage': 0,
    '$graphic': $img('poorVillage.png'),
    'actions': [
        new CraftAction({'slot': 1, 'recipes': [recipes.common, recipes.copper]}),
        new ShopAction(['smallPotion', 'cap', 'clothGloves', 'shortBow', 'club'], 2),
        new MoveAction('forest', 3),
        new MoveAction('river', 7),
        new RestAction(4),
        new SaveAction(5),
        new RebirthAction(6)
    ],
    'story': 'This small village will serve well as a safe haven while I get my bearings. I will need to find a larger city to have any chance at figuring out what happened to me.',
    'trackName': 'ReboundInsomnia'
};
areas.river =  {
    'name': 'River',
    'travelTime': 3,
    'travelDamage': 0,
    '$graphic': $img('river.png'),
    'actions': [
        new ToggleAction(new BattleAction(monsters.troll, 2, refreshArea), function() {
            return !(player.defeatedMonsters.troll > 0);
        }),
        new ToggleAction(new MoveAction('savanna', 4), function() {
            return (player.defeatedMonsters.troll > 0);
        }),
        new MoveAction('village', 8)
    ],
    'story': 'I am told there is a port south of here beyond this river where I can find a ship to the capitol. An intimidating brute of a monster is guarding the only route across though...'
};
areas.savanna = {
    'name': 'Savanna',
    'travelTime': 10,
    'travelDamage': 2,
    '$graphic': $img('field.png'),
    'actions': [
        new MoveAction('river', 3),
        new BattleAction(monsters.lion, 2),
        new BattleAction(monsters.hawk, 1),
        new BattleAction(monsters.fowler, 6),
        new MoveAction('portTown', 5)
    ]
};
areas.portTown = {
    'name': 'Port Town',
    'travelTime': 5,
    'travelDamage': 0,
    '$graphic': $img('town.png'),
    'actions': [
        new EnchantAction(1),
        new CraftAction({'slot': 7, 'recipes': [recipes.common, recipes.copper, recipes.bronze]}),
        new ShopAction(['smallPotion', 'mediumPotion', 'crossbow', 'bronzeArmor'], 4),
        new MoveAction('savanna', 2),
        new SaveAction(3),
        new RestAction(6),
        new MoveAction('ship', 5)
    ],
    'trackName': 'ReboundInsomnia'
};
areas.ship = {
    'name': 'Ship',
    'travelTime': 20,
    'travelDamage': 5,
    '$graphic': $img('ship.png'),
    'actions': [
        new BattleAction(monsters.barnacle, 1),
        new MoveAction('portTown', 2),
        new BattleAction(monsters.pirate, 3),
        new ToggleAction(new MoveAction('city', 5), function() {
            return (player.defeatedMonsters.pirate > 0);
        }),
        new ToggleAction(new MoveAction('pirateShip', 6), function() {
            return (player.defeatedMonsters.imposterKing > 0 ||  player.defeatedMonsters.enchantedKing > 0);
        }),
    ]
};
areas.city = {
    'name': 'City',
    'travelTime': 5,
    'travelDamage': 0,
    '$graphic': $img('town.png'),
    'actions': [
        new ToggleAction(new MoveAction('explorationShip', 1), function() {
            return (player.defeatedMonsters.imposterKing > 0 ||  player.defeatedMonsters.enchantedKing > 0);
        }),
        new MoveAction('ship', 2),
        new SaveAction(3),
        new RestAction(6),
        new MoveAction('castleGates', 7),
        new CraftAction({'slot': 8, 'recipes': [recipes.common, recipes.bronze, recipes.iron]}),
        //Shop has limited iron equipment because the dark knight has taken over the iron mines
        new ShopAction(['mediumPotion', 'largePotion', 'claws', 'cudgel', 'chainMail'], 4),
        new MoveAction('field', 5)
    ],
    'trackName': 'ReboundInsomnia'
};
areas.field = {
    'name': 'Field',
    'travelTime': 10,
    'travelDamage': 0,
    '$graphic': $img('field.png'),
    'actions': [
        new BattleAction(monsters.mercenary, 1),
        new BattleAction(monsters.woodGolem, 3),
        new MoveAction('city', 2),
        new MoveAction('desert', 8),
        new MoveAction('marsh', 4)
    ]
};
areas.desert = {
    'name': 'Desert',
    'travelTime': 15,
    'travelDamage': 40,
    '$graphic': $img('desert.png'),
    'actions': [
        new BattleAction(monsters.scorpion, 4),
        new BattleAction(monsters.armadilloLizard, 2),
        new BattleAction(monsters.giantTortoise, 6),
        new MoveAction('field', 7),
        new MoveAction('desertCave', 8)
    ]
};
areas.desertCave = {
    'name': 'Desert Cave',
    'travelTime': 10,
    'travelDamage': 10,
    '$graphic': $img('cave.png'),
    'actions': [
        new BattleAction(monsters.vampireBat, 1),
        new BattleAction(monsters.bear, 3),
        new MoveAction('desert', 7),
        new ToggleAction(new BattleAction(monsters.darkKnight, 6, refreshArea), function() {
            return !(player.defeatedMonsters.darkKnight > 0);
        }),
        new ToggleAction(new MoveAction('ironMine', 6), function() {
            return (player.defeatedMonsters.darkKnight > 0);
        })
    ]
};
areas.ironMine = {
    'name': 'Iron Mine',
    'travelTime': 10,
    'travelDamage': 10,
    '$graphic': $img('cave.png'),
    'actions': [
        new MoveAction('desertCave', 1),
        new BattleAction(monsters.whelp, 2),
        new BattleAction(monsters.golem, 3),
        new MiningAction(minerals.iron, 6)
    ]
};
areas.marsh = {
    'name': 'Marsh',
    'travelTime': 20,
    'travelDamage': 20,
    '$graphic': $img('marsh.png'),
    'actions': [
        new BattleAction(monsters.crocodile, 1),
        new BattleAction(monsters.mudGolem, 2),
        new MoveAction('field', 3),
        new MoveAction('ancientRuins', 7),
        new MoveAction('remoteAbode', 6)
    ]
};
areas.ancientRuins = {
    'name': 'Ancient Ruins',
    'travelTime': 30,
    'travelDamage': 15,
    '$graphic': $img('cave.png'),
    'actions': [
        new BattleAction(monsters.spider, 1),
        new BattleAction(monsters.maverick, 3),
        new MiningAction(minerals.tin, 4),
        new MoveAction('marsh', 8)
    ]
};
areas.remoteAbode = {
    'name': 'Remote Abode',
    'travelTime': 5,
    'travelDamage': 0,
    '$graphic': $img('remoteAbode.png'),
    'actions': [
        new MoveAction('marsh', 1),
        new BattleAction(monsters.giantRat, 7),
        new BattleAction(monsters.gargoyle, 2),
        new ToggleAction(new BattleAction(monsters.witch, 3, refreshArea), function() {
            return !(player.defeatedMonsters.witch > 0);
        }),
        new ToggleAction(new MoveAction('cellar', 6), function() {
            return (player.defeatedMonsters.witch > 0);
        })
    ]
};
areas.cellar = {
    'name': 'Cellar',
    'travelTime': 10,
    'travelDamage': 5,
    '$graphic': $img('cave.png'),
    'actions': [
        new BattleAction(monsters.doomFlower, 3),
        new MoveAction('remoteAbode', 1),
        new SaveAction(6),
        new ToggleAction(new BattleAction(monsters.cellarSentry, 4), function() {
            return !(player.defeatedMonsters.cellarSentry > 0);
        }),
        new ToggleAction(
            new SpecialAction(4, 'activate', 'Device', function () {
                    return 'There is a strange device that has a space for something to be inserted.'
                }, function () {
                    if (player.inventory.items.powerCrystal <= 0) {
                        throw new ProgrammingError('I do not have anything to activate this device with.');
                    }
                    if (player.flags.openedLab) {
                        player.flags.openedLab = false;
                    } else {
                        player.flags.openedLab = true;
                    }
            }), function() {
                return player.defeatedMonsters.cellarSentry > 0;
            }
        ),
        new DoorAction(new MoveAction('airlock', 5), function() {
            return player.flags.openedLab;
        })
    ],
    'trackName': 'ReboundInsomnia'
};

areas.castleGates = {
    'name': 'Castle Gates',
    'travelTime': 5,
    'travelDamage': 0,
    '$graphic': $img('castle.png'),
    'actions': [
        new BattleAction(monsters.possessedGuard, 1, refreshArea),
        new ToggleAction(new BattleAction(monsters.possessedCaptain, 2, refreshArea), function() {
            return player.defeatedMonsters.possessedGuard > 0;
        }),
        new ToggleAction(new MoveAction('courtyard', 4), function() {
            return (player.defeatedMonsters.possessedCaptain > 0);
        }),
        new MoveAction('city', 6)
    ]
};
areas.courtyard = {
    'name': 'Courtyard',
    'travelTime': 10,
    'travelDamage': 0,
    '$graphic': $img('field.png'),
    'actions': [
        new ToggleAction(new BattleAction(monsters.tRex, 2, refreshArea), function() {
            return !(player.defeatedMonsters.tRex > 0);
        }),
        new ToggleAction(new MoveAction('castle', 4), function() {
            return (player.defeatedMonsters.tRex > 0);
        }),
        new MoveAction('castleGates', 6)
    ]
};
areas.castle = {
    'name': 'Castle',
    'travelTime': 30,
    'travelDamage': 0,
    '$graphic': $img('castle.png'),
    'actions': [
        new BattleAction(monsters.royalGuard, 1, refreshArea),
        new ToggleAction(new MoveAction('throneRoom', 4), function() {
            return (player.defeatedMonsters.royalGuard > 0);
        }),
        new BattleAction(monsters.giantSpider, 2),
        new MoveAction('courtyard', 6)
    ]
};
function defeatImposterKing() {
    refreshArea();
}
areas.throneRoom = {
    'name': 'Throne Room',
    'travelTime': 5,
    'travelDamage': 0,
    '$graphic': $img('castle.png'),
    'actions': [
        new ToggleAction(new BattleAction(monsters.enchantedKing, 2, defeatImposterKing), function() {
            return !(player.defeatedMonsters.witch > 0) && !(player.defeatedMonsters.enchantedKing > 0);
        }),
        new ToggleAction(new BattleAction(monsters.imposterKing, 2, defeatImposterKing), function() {
            return player.defeatedMonsters.witch > 0 && !(player.defeatedMonsters.imposterKing > 0 || player.defeatedMonsters.enchantedKing > 0);
        }),
        new MoveAction('castle', 6)
    ]
};*/

$.each(areas, function (key, area) { area.key = key;});