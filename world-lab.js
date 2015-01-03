function alwaysTrue() {
    return true;
}
areas.airlock =  {
    'name': 'Airlock',
    'travelTime': 30,
    'travelDamage': 0,
    '$graphic': $img('castle.png'),
    'actions': [
        new RebirthAction(1, function () {
            if (player.plague) {
                return "I can't leave while infected, but if I regenerate my body here it should destroy the virus in my body.";
            }
            return null;
        }),
        new DoorAction(new MoveAction('cellar', 2), function() {
            return player.flags.openedLab && !player.plague;
        }),
        new DoorAction(new MoveAction('quarters', 5), alwaysTrue)
    ],
    'trackName': 'LosingSleep',
};
areas.quarters =  {
    'name': 'Quarters',
    'travelTime': 15,
    'travelDamage': 0,
    '$graphic': $img('town.png'),
    'actions': [
        new BattleAction(monsters.zombie, 1),
        new DoorAction(new MoveAction('airlock', 2), alwaysTrue),
        new DoorAction(new ShopAction(['largePotion', 'mediumPotion', 'smallPotion', 'morningStar', 'gasMask', 'rubberBoots', 'mithrilGreaves'], 3), alwaysTrue),
        new CraftAction({'slot': 7, 'recipes': [recipes.common]}),
        new DoorAction(new MoveAction('aridUnit', 4), alwaysTrue),
        new EnchantAction(8),
        new DoorAction(new MoveAction('aquarium', 6), alwaysTrue)
    ]
};
areas.aridUnit =  {
    'name': 'Arid Unit',
    'travelTime': 15,
    'travelDamage': 0,
    '$graphic': $img('field.png'),
    'actions': [
        new BattleAction(monsters.hawk, 1),
        new BattleAction(monsters.rat, 2),
        new DoorAction(new MoveAction('quarters', 3), alwaysTrue),
        new BattleAction(monsters.lion, 7),
        new DoorAction(new MoveAction('desertUnit', 4), alwaysTrue),
        new DoorAction(new MoveAction('pharmacy', 6), alwaysTrue)
    ]
};
areas.aquarium =  {
    'name': 'Aquarium',
    'travelTime': 15,
    'travelDamage': 0,
    '$graphic': $img('marsh.png'),
    'actions': [
        new DoorAction(new MoveAction('quarters', 1), alwaysTrue),
        new BattleAction(monsters.turtus, 2),
        new BattleAction(monsters.snappingTurtus, 3),
        new BattleAction(monsters.crocodile, 8),
        new DoorAction(new MoveAction('pharmacy', 4), alwaysTrue),
        new DoorAction(new MoveAction('nocturnalUnit', 6), alwaysTrue)
    ]
};
areas.desertUnit =  {
    'name': 'Desert Unit',
    'travelTime': 15,
    'travelDamage': 0,
    '$graphic': $img('desert.png'),
    'actions': [
        new BattleAction(monsters.giantTortoise, 1),
        new BattleAction(monsters.armadilloLizard, 2),
        new DoorAction(new MoveAction('aridUnit', 3), alwaysTrue),
        new BattleAction(monsters.scorpion, 4),
        new DoorAction(new MoveAction('hydroponics', 6), alwaysTrue)
    ]
};
areas.pharmacy =  {
    'name': 'Pharmacy',
    'travelTime': 15,
    'travelDamage': 0,
    '$graphic': $img('castle.png'),
    'actions': [
        new DoorAction(new MoveAction('aridUnit', 1), alwaysTrue),
        new BattleAction(monsters.vampire, 2),
        new DoorAction(new MoveAction('aquarium', 3), alwaysTrue),
        new DoorAction(new MoveAction('hydroponics', 4), alwaysTrue),
        new CraftAction({'slot': 5, 'label': 'Compound', 'helpText': 'I can use my crafting skills with the equipment here to create vaccines and medications.', 'recipes': [recipes.lab]}),
        new DoorAction(new MoveAction('tropicalUnit', 6), alwaysTrue)
    ]
};
areas.nocturnalUnit =  {
    'name': 'Nocturnal Unit',
    'travelTime': 15,
    'travelDamage': 0,
    '$graphic': $img('cave.png'),
    'actions': [
        new DoorAction(new MoveAction('aquarium', 1), alwaysTrue),
        new BattleAction(monsters.bat, 2),
        new BattleAction(monsters.vampireBat, 3),
        new BattleAction(monsters.bear, 8),
        new DoorAction(new MoveAction('tropicalUnit', 4), alwaysTrue),
        new BattleAction(monsters.mole, 5)
    ]
};
areas.hydroponics =  {
    'name': 'Hydroponics',
    'travelTime': 15,
    'travelDamage': 0,
    '$graphic': $img('cave.png'),
    'actions': [
        new DoorAction(new MoveAction('desertUnit', 1), alwaysTrue),
        new BattleAction(monsters.fowler, 2),
        new DoorAction(new MoveAction('pharmacy', 3), alwaysTrue),
        new BattleAction(monsters.doomFlower, 7),
        new BattleAction(monsters.spider, 4),
        new BattleAction(monsters.giantSpider, 5),
        new DoorAction(new MoveAction('operatingRoom', 6), alwaysTrue),
    ]
};
areas.tropicalUnit =  {
    'name': 'Tropical Unit',
    'travelTime': 15,
    'travelDamage': 0,
    '$graphic': $img('forest.png'),
    'actions': [
        new DoorAction(new MoveAction('pharmacy', 1), alwaysTrue),
        new BattleAction(monsters.giantRat, 2),
        new DoorAction(new MoveAction('nocturnalUnit', 3), alwaysTrue),
        new BattleAction(monsters.pangolin, 8),
        new DoorAction(new MoveAction('operatingRoom', 4), alwaysTrue),
        new BattleAction(monsters.giantBoar, 6),
    ]
};
areas.operatingRoom =  {
    'name': 'Operating Room',
    'travelTime': 15,
    'travelDamage': 0,
    '$graphic': $img('town.png'),
    'actions': [
        new DoorAction(new MoveAction('hydroponics', 1), alwaysTrue),
        new BattleAction(monsters.aerico, 2),
        new DoorAction(new MoveAction('tropicalUnit', 3), alwaysTrue),
        new BattleAction(monsters.whelp, 7),
        new BattleAction(monsters.mithrilEater, 8),
        new DoorAction(new MoveAction('controlRoom', 5), function () {
            return player.defeatedMonsters.aerico > 0;
        }),
    ]
};
var plagueAction;
function resetLab() {
    player.plague = 0;
    uiNeedsUpdate.playerStats = true;
    labMonsters.forEach(function (monster) {
        monster.plague = 0;
        updateLabMonsterStats(monster);
    });
    plagueAction = new BattleAction(monsters.plague, 8, function () {
        player.plague = Math.min(100, player.plague + areas.controlRoom.plagueLevel);
        player.health = Math.floor(player.health * (1 - areas.controlRoom.plagueLevel / 100));
        areas.controlRoom.plagueLevel = 0;
        uiNeedsUpdate.playerStats = true;
    });
    areas.controlRoom =  {
        'plagueLevel': 100,
        'key': 'controlRoom',
        'name': 'Control Room',
        'travelTime': 15,
        'travelDamage': 0,
        '$graphic': $img('castle.png'),
        'actions': [
            new DoorAction(new MoveAction('operatingRoom', 2), alwaysTrue),
            new ToggleAction(new BattleAction(monsters.labWitch, 8), function() {
                return !(player.defeatedMonsters.labWitch > 0);
            }),
            new ToggleAction(plagueAction, function() {
                return player.defeatedMonsters.labWitch > 0 && areas.controlRoom.plagueLevel > 0 && !player.flags.plagueDefeated;
            }),
            new ToggleAction(
                new DoorAction(new SpecialAction(5, function () {
                        if (player.flags.labTreasureTaken) {
                            return '';
                        }
                        return 'retrieve';
                    }, 'Lab Core', function () {
                        if (player.flags.labTreasureTaken) {
                            return 'There is nothing left of interest here.';
                        }
                        return 'It appears the lab was being powered by a Power Crystal taken from the Ancient Continent. There is also a Memory Crystal here as well.'
                    }, function () {
                        if (player.flags.labTreasureTaken) {
                            throw new ProgrammingError('There is nothing left to retrieve here.');
                        }
                        player.flags.labTreasureTaken = true;
                        player.inventory.items.powerCrystal++;
                        player.inventory.items.memoryCrystal++;
                        uiNeedsUpdate.items = true;
                        uiNeedsUpdate.area = true;
                }), function () {
                    //door is sealed until the plague is eliminated
                    return player.flags.plagueDefeated;
                }, 'Biohazard has been detected in the lab. Access to the power core is prohibited to prevent contamination.'), function () {
                    //player cannot reach the door to the core while plague is alive
                    return player.flags.plagueDefeated || areas.controlRoom.plagueLevel === 0;
                }
            )
        ]
    };
    labMonsters.forEach(function (monster) {
       monster.plague = 0;
       monster.timesInfected = 0;
    });
    labAreas.forEach(function (area) {
        area.plagueLevel = 0;
    });
}
function infectMonsters(monsters, amount) {
    monsters.forEach(function (monster) {
        infectMonster(monster, amount);
    });
}
function infectMonster(monster, amount) {
    if (areas.controlRoom.plagueLevel >= 100) {
        return;
    }
    if (monster == fighting) {
        return;
    }
    if (!monster.nearbyMonsters) {
        monster.nearbyMonsters = getMonstersForAreas(getNearbyAreas(monster.area));
    }
    if (monster.plague <= 0) {
        var sourceMonster = random.element(monster.nearbyMonsters);
        if (!monster.timesInfected) {
            monster.timesInfected = 0;
        }
        monster.timesInfected++;
        //a monster can only be a source if it is also infected. If the random
        //chosen monster is not infected, the monster just gets spliced with itself.
        if (sourceMonster.plague <= 0) {
            sourceMonster = monster;
        }
        monster.sourceMonster = monsters[sourceMonster.key];
    }
    monster.plague += amount;
    var baseMonster = monsters[monster.key];
    // A monster can only get to a certain level of infection before it explodes
    // regenerating part of the original plague body and infecting all the monsters
    // nearby (including a new copy of the current monster)
    if (monster.plague > maxPlague(monster)) {
        var infectAmount = monster.plague / 20;
        monster.plague = 0;
        infectMonsters(monster.nearbyMonsters, infectAmount);
    } else {
        updateLabMonsterStats(monster);
    }
}
function getNearbyAreas(area) {
    var nearbyAreas = [area];
    area.actions.forEach(function (action) {
        var actionCode = evaluateAction(action.action);
        var parts = actionCode.split(' ');
        if (parts[0] == 'move') {
            var area = areas[parts[1]];
            if (labAreas.indexOf(area) < 0) {
                return;
            }
            nearbyAreas.push(area);
        }
    });
    return nearbyAreas;
}
function getMonstersForAreas(areas) {
    var monsters = [];
    areas.forEach(function (nearbyArea) {
        monsters = monsters.concat(getMonstersInArea(nearbyArea))
    });
    return monsters;
}
function getMonstersInArea(area) {
    var monsters = [];
    area.actions.forEach(function (action) {
        if (action.monster) {
            action.monster.area = area;
            monsters.push(action.monster);
        }
    });
    return monsters;
}
function updateLabMonsterStats(monster) {
    if (monster.area !== currentArea) {
        return
    }
    var baseMonster = monsters[monster.key];
    monster.health = monster.maxHealth = Math.round(baseMonster.health);
    copiedStats.forEach(function (key) {
        monster[key] = baseMonster[key];
    })
    if (monster.plague <= 0) {
        monster.level = baseMonster.level;
        monster.name = baseMonster.name;
        monster.spoils = baseMonster.spoils;
        return;
    }
    var amount = monster.plague / 10;
    var sourceMonster = monster.sourceMonster;
    monster.health = monster.maxHealth = monster.health + Math.round(sourceMonster.health * amount);
    copiedStats.forEach(function (key) {
        monster[key] = monster[key] + sourceMonster[key] * amount;
    });
    integerStats.forEach(function (key) {
        monster[key] = Math.round(monster[key]);
    });
    //monster XP gets doubled for being infected at all.
    if (monster.plague < 8) {
        monster.name = "Hybrid " + baseMonster.name;
        monster.experience *= 3;
        monster.spoils = ['antibodies', 'antigen', 'antigen'];
    } else if (monster.plague < 12) {
        monster.name = "Chimera " + baseMonster.name;
        monster.experience *= 5;
        monster.spoils = ['antibodies', 'antibodies', 'antigen'];
    } else { // max plague is 15
        monster.name = "Mutant " + baseMonster.name;
        monster.experience *= 10;
        monster.spoils = ['antibodies', 'antibodies', 'antibodies'];
    }
    monster.level = Math.round(baseMonster.level + monster.plague)
    scheduleMonsterForUpdate(monster);
}
function maxPlague(monster) {
    return monster.timesInfected + 4 + monsters[monster.key].level / 5;
}
function labLoop(deltaTime) {
    if (player.flags.plagueDefeated || areas.controlRoom.plagueLevel >= 100) {
        return;
    }
    var finished = (areas.controlRoom.plagueLevel <= 0) && (player.plague <= 0);
    labAreas.forEach(function (area) {
        area.plagueLevel = 0;
    });
    //plagued monsters gain 1 plague every 30 seconds
    labMonsters.forEach(function (monster) {
        if (monster.plague) {
            infectMonster(monster, deltaTime / 1000 / 30);
            monster.area.plagueLevel += monster.plague;
            finished = false;
        }
    });
    if (finished) {
        player.flags.plagueDefeated = true;
    } else {
        //The player has to restart the lab if any area reaches a plague level of 100
        labAreas.forEach(function (area) {
            if (area.plagueLevel >= 100) {
                resetLab();
            }
        });
    }
    uiNeedsUpdate.area = true;
}
var copiedStats = ['recover', 'attackSpeed', 'damage', 'armor', 'parry', 'armorBreak', 'armorPierce', 'lifeSteal', 'cripple', 'poison', 'experience'];
var integerStats = ['recover', 'damage', 'armor', 'parry', 'armorBreak', 'poison', 'experience'];
var labAreas = [
    areas.quarters,
    areas.aridUnit,
    areas.aquarium,
    areas.desertUnit,
    areas.pharmacy,
    areas.nocturnalUnit,
    areas.hydroponics,
    areas.tropicalUnit,
    areas.operatingRoom
];
labAreas.forEach(function (area) {
    area.loop = labLoop;
});
var labMonsters = getMonstersForAreas(labAreas);
resetLab();
$.each(areas, function (key, area) { area.key = key;});
