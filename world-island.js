
areas.pirateShip =  {
    'name': 'Pirate Ship',
    'travelTime': 60,
    'travelDamage': 5,
    '$graphic': $img('ship.png'),
    'actions': [
        new BattleAction(monsters.firstMate, 1, refreshArea),
        new ToggleAction(new BattleAction(monsters.pirateCaptain, 2, refreshArea), function() {
            return player.defeatedMonsters.firstMate > 0 && player.defeatedMonsters.pirateCaptain <= 0;
        }),
        new MoveAction('ship', 4),
        new ToggleAction(new MoveAction('beach', 6), function() {
            return player.defeatedMonsters.pirateCaptain > 0;
        })
    ]
};
areas.beach =  {
    'name': 'Beach',
    'travelTime': 20,
    'travelDamage': 2,
    '$graphic': $img('shore.png'),
    'actions': [
        new BattleAction(monsters.giantClam, 1),
        new BattleAction(monsters.pangolin, 2),
        new MoveAction('jungle', 3),
        new MoveAction('pirateShip', 4)
    ]
};
areas.jungle =  {
    'name': 'Jungle',
    'travelTime': 30,
    'travelDamage': 5,
    '$graphic': $img('forest.png'),
    'actions': [
        new BattleAction(monsters.giantBoar, 1),
        new BattleAction(monsters.woolyRhino, 2),
        new MoveAction('volcano', 3),
        new MoveAction('beach', 4),
        new MoveAction('islandVillage', 5)
    ]
};
areas.islandVillage =  {
    'name': 'Island Village',
    'travelTime': 5,
    'travelDamage': 0,
    '$graphic': $img('poorVillage.png'),
    'actions': [
        new CraftAction(1),
        new MoveAction('jungle', 2),
        new EnchantAction(3),
        new RestAction(4),
        new ShopAction([items.largePotion, items.mediumPotion, weapons.silverSword, weapons.silverMallet, helmets.silverHelmet, armors.silverMail], 6)
    ]
};
/**
 * Molten Golem and silver mines can be found in 4 areas. Initially the molten
 * golem is always in the crater and there is no silver. Each time the molten
 * golem is defeated, a new one spawns in one of the other three areas, and
 * silver spawns in the remaining two areas.
 */
var silverMiningAction = new ToggleAction(new MiningAction(minerals.silver, 4, function () {
    currentArea.silver--;
    refreshArea();
}), function() {
    return currentArea.silver > 0;
});
var moltenGolemAction = new ToggleAction(new BattleAction(monsters.moltenGolem, 1, function () {
    currentArea.moltenGolem = false;
    var choices = [areas.volcano, areas.volcanoCave, areas.magmaFlow, areas.volcanoCrater];
    choices.splice(choices.indexOf(currentArea), 1);
    var golemArea = Math.floor(Math.random() * choices.length);
    choices[golemArea].moltenGolem = true;
    choices.splice(golemArea, 1);
    choices.pop().silver++;
    choices.pop().silver++;
    refreshArea();
}), function() {
    return currentArea.moltenGolem;
});
areas.volcano =  {
    'name': 'Volcano',
    'silver': 0,
    'travelTime': 30,
    'travelDamage': 10,
    '$graphic': $img('volcano.png'),
    'actions': [
        moltenGolemAction,
        silverMiningAction,
        new MoveAction('volcanoCave', 2),
        new BattleAction(monsters.silverSnake, 3),
        new MoveAction('jungle', 5),
        new MoveAction('magmaFlow', 8)
    ]
};
areas.volcanoCave =  {
    'name': 'Volcano Cave',
    'silver': 0,
    'travelTime': 20,
    'travelDamage': 15,
    '$graphic': $img('cave.png'),
    'actions': [
        moltenGolemAction,
        silverMiningAction,
        new MoveAction('volcanoCrater', 2),
        new BattleAction(monsters.mithrilEater, 3),
        new MoveAction('volcano', 5)
    ]
};
areas.volcanoCrater =  {
    'name': 'Volcano Crater',
    'silver': 0,
    'moltenGolem': true,
    'travelTime': 20,
    'travelDamage': 20,
    '$graphic': $img('volcano.png'),
    'actions': [
        moltenGolemAction,
        silverMiningAction,
        new ToggleAction(new BattleAction(monsters.magmaTitan, 2, refreshArea), function() {
            return !(player.defeatedMonsters.magmaTitan > 0);
        }),
        new MoveAction('volcanoCave', 5)
    ]
};
areas.magmaFlow =  {
    'name': 'Magma Flow',
    'silver': 0,
    'travelTime': 20,
    'travelDamage': 10,
    '$graphic': $img('volcano.png'),
    'actions': [
        moltenGolemAction,
        silverMiningAction,
        new BattleAction(monsters.imp, 2),
        new MoveAction('volcano', 7),
        new ToggleAction(new MoveAction('cove', 6), function() {
            return player.defeatedMonsters.magmaTitan > 0;
        })
    ]
};
areas.cove =  {
    'name': 'Cove',
    'travelTime': 30,
    'travelDamage': 5,
    '$graphic': $img('shore.png'),
    'actions': [
        new ToggleAction(new BattleAction(monsters.neptune, 3, refreshArea), function() {
            return !(player.defeatedMonsters.neptune > 0);
        }),
        new MoveAction('magmaFlow', 4)
    ]
};
$.each(areas, function (key, area) { area.key = key;});