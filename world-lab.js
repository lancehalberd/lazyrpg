
areas.airlock =  {
    'name': 'Airlock',
    'travelTime': 30,
    'travelDamage': 0,
    '$graphic': $img('castle.png'),
    'actions': [
        new RebirthAction(1, function () {
            if (player.infected) {
                return "I can't leave while infected, but if I regenerate my body here it should destroy the virus in my body.";
            }
            return null;
        }),
        new MoveAction('quarters', 5)
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
$.each(areas, function (key, area) { area.key = key;});