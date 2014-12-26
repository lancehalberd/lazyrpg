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
        new BattleAction(monsters.aerico, 2, refreshArea),
        new DoorAction(new MoveAction('tropicalUnit', 3), alwaysTrue),
        new BattleAction(monsters.whelp, 7),
        new BattleAction(monsters.mithrilEater, 8),
        new DoorAction(new MoveAction('controlRoom', 5), function () {
            return player.defeatedMonsters.aerico > 0;
        }),
    ]
};
function resetLab() {
    var plagueBody = 100;
    var plagueAction = new BattleAction(monsters.plague, 8, function () {
        player.plague = plagueBody;
        player.health = 0;
        plagueBody = 0;
        uiNeedsUpdate.playerStats = true;
        refreshArea();
    });
    areas.controlRoom =  {
        'name': 'Control Room',
        'travelTime': 15,
        'travelDamage': 0,
        '$graphic': $img('castle.png'),
        'actions': [
            new DoorAction(new MoveAction('operatingRoom', 2), alwaysTrue),
            new ToggleAction(new BattleAction(monsters.labWitch, 8, refreshArea), function() {
                return !(player.defeatedMonsters.labWitch > 0);
            }),
            new ToggleAction(plagueAction, function() {
                return player.defeatedMonsters.labWitch > 0 && plagueBody >= 1;
            }),
        ]
    };
}
resetLab();
function updatePlagueStats(monster, baseMonster, amount) {
    monster.health = monster.maxHealth = Math.round(baseMonster.health * amount);
    ['attackSpeed', 'damage', 'armor', 'parry', 'armorBreak', 'armorPierce', 'lifeSteal', 'cripple', 'poison'].forEach(function (key) {
        monster[key] = baseMonster[key] * amount;
    })
    scheduleMonsterForUpdate(monster);
}
$.each(areas, function (key, area) { area.key = key;});