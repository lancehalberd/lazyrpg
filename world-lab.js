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
        new DoorAction(new MoveAction('aridUnit', 4), alwaysTrue),
        new EnchantAction(5),
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
        new CraftAction(5),
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
function resetLab() {
    player.plague = 0;
    uiNeedsUpdate.playerStats = true;
    labMonsters.forEach(function (monster) {
        monster.plague = 0;
        updateLabMonsterStats(monster);
    });
    var plagueAction = new BattleAction(monsters.plague, 8, function () {
        player.plague = areas.controlRoom.plagueBody;
        player.health = 0;
        areas.controlRoom.plagueBody = 0;
        uiNeedsUpdate.playerStats = true;
    });
    areas.controlRoom =  {
        'plagueBody': 100,
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
                return player.defeatedMonsters.labWitch > 0 && areas.controlRoom.plagueBody >= 1;
            }),
        ]
    };
}
function updatePlagueStats(monster, baseMonster, amount) {
    monster.health = monster.maxHealth = Math.round(baseMonster.health * amount);
    copiedStats.forEach(function (key) {
        monster[key] = baseMonster[key] * amount;
    });
    integerStats.forEach(function (key) {
        monster[key] = Math.round(monster[key]);
    });
    scheduleMonsterForUpdate(monster);
}
function infectAreas(areas, amount) {
    areas.forEach(function (area) {
        infectArea(area, amount);
    });
}
function infectArea(area, amount) {
    console.log("Infecting " + area.name + " with " + amount);
    var areaMonsters = getMonstersInArea(area);
    var nearbyAreas = getNearbyAreas(area);
    var nearbyMonsters = getMonstersForAreas(nearbyAreas);
    areaMonsters.forEach(function (monster) {
        if (areas.controlRoom.plagueBody >= 100) {
            return;
        }
        if (monster.plague <= 0) {
            monster.sourceMonster = random.element(nearbyMonsters);
        }
        monster.plague += amount;
        var baseMonster = monsters[monster.key];
        if ((baseMonster.level <= 20 && monster.plague > 5)
            || (baseMonster.level <= 40 && monster.plague > 10)
            || monster.plague > 15) {
            var infectAmount = monster.plague / 10;
            monster.plague = 0;
            infectAreas(nearbyAreas, infectAmount);
            areas.controlRoom.plagueBody += infectAmount;
            //The lab is reset if plague ever reaches full potential again
            if (areas.controlRoom.plagueBody > 100) {
                resetLab();
            }
        }
    });
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
            monsters.push(action.monster);
        }
    });
    return monsters;
}
function updateLabMonsterStats(monster) {
    var baseMonster = monsters[monster.key];
    monster.health = monster.maxHealth = Math.round(baseMonster.health);
    copiedStats.forEach(function (key) {
        monster[key] = baseMonster[key];
    })
    if (monster.plague <= 0) {
        monster.name = baseMonster.name;
        return;
    }
    if (monster.plague < 5) {
        monster.name = "Hybrid " + baseMonster.name;
    } else if (monster.plague < 10) {
        monster.name = "Chimera " + baseMonster.name;
    } else {
        monster.name = "Mutant " + baseMonster.name;
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
    monster.experience *= 2;
    scheduleMonsterForUpdate(monster);
}
function labLoop(deltaTime) {
    if (areas.controlRoom.plagueBody >= 100) {
        return;
    }
    //plagued monsters gain 1 plague every 30 seconds
    labMonsters.forEach(function (monster) {
        if (monster.plague && monster != fighting) {
            monster.plague += deltaTime / 1000 / 30;
            updateLabMonsterStats(monster);
        }
    });
}
var copiedStats = ['attackSpeed', 'damage', 'armor', 'parry', 'armorBreak', 'armorPierce', 'lifeSteal', 'cripple', 'poison', 'experience'];
var integerStats = ['damage', 'armor', 'parry', 'armorBreak', 'poison', 'experience'];
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