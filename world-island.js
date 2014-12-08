
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
function resetCove() {

    //First the player sees a single tentacle. Defeating it reveals the
    //initial two tentacles. We don't display it after it is defeated
    //or if the entire battle is already over
    var firstTentacleBattleAction = new ToggleAction(new BattleAction(monsters.tentacle, 6, function () {
        //crippling tentacles starts at .5 because it is supposed to be
        //a continuation of the first tentacle
        areas.cove.cripplingTentacles = .5;
        areas.cove.poisoningTentacles = 1;
        areas.cove.leechingTentacles = 0;
        areas.cove.isTentacleDefeated = true;
        updateCove();
    }), function() {
        return !(player.defeatedMonsters.neptuneCore > 0) && !areas.cove.isTentacleDefeated;
    });
    //These two groups of tentacles appear after the first tentacle is defeated
    //They increase in # at a rate of .1 per second. Each time you defeat one
    //The # is reduced by half. When both are below 1, the body and head are revealed
    var cripplingTentacleBattleAction = new ToggleAction(new BattleAction(monsters.tentacles, 6, function () {
        areas.cove.cripplingTentacles /= 2;
        if (areas.cove.cripplingTentacles < .5 && areas.cove.poisoningTentacles < .5) {
            areas.cove.isBodyRevealed = true;
        }
        updateCove();
    }), function () {
        return areas.cove.isTentacleDefeated && areas.cove.cripplingTentacles > .5;
    });
    var poisonTentacleBattleAction = new ToggleAction(new BattleAction(monsters.toxicStingers, 1, function () {
        areas.cove.poisoningTentacles /= 2;
        if (areas.cove.cripplingTentacles < .5 && areas.cove.poisoningTentacles < .5) {
            areas.cove.isBodyRevealed = true;
        }
        updateCove();
    }), function () {
        return areas.cove.isTentacleDefeated && areas.cove.poisoningTentacles > .5;
    });
    //A final set of tentacles appears when neptune drops below 30% health. He
    //will no longer revive the body and head, but the tentacles start regenerating
    //at 50% rate like they do when the body was still alive
    var leechingTentacleBattleAction = new ToggleAction(new BattleAction(monsters.leechingTentacles, 5, function () {
        areas.cove.leechingTentacles /= 2;
        updateCove();
    }), function () {
        return areas.cove.isNeptuneDesperate && areas.cove.leechingTentacles > .5;
    });

    //Damage persists after battle for the head, the body and the core
    //So that the player can switch to defeat the tentacles as necessary
    //When the head is defeated, the rate of tentacle regneration is reduced
    //by half. The expectation is that the player will be unable to defeat
    //the body unless the head is defeated first. The head revives
    //after 20 seconds when it is defeated
    var headBattleAction = new ToggleAction(new BattleAction(monsters.neptuneHead, 2, function () {
        areas.cove.headTimer = 30000;
        updateCove();
    }), function () {
        return !areas.cove.isNeptuneDesperate && areas.cove.isBodyRevealed &&  areas.cove.headTimer <= 0 && areas.cove.bodyTimer <= 0;
    });
    //The body must be defeated to reveal the core. When the core is
    //revealed the tentacles stop regenerating for a while, but after
    //20 seconds, the core will consume 10% of its health to revive
    //the head and body assuming it is about 30% health. D
    var bodyBattleAction = new ToggleAction(new BattleAction(monsters.neptuneBody, 3, function () {
        areas.cove.bodyTimer = 20000;
        areas.cove.isCoreRevealed = true;
        updateCove();
    }), function () {
        return !areas.cove.isNeptuneDesperate && areas.cove.isBodyRevealed &&  areas.cove.bodyTimer <= 0;
    });
    var coreBattleAction = new ToggleAction(new BattleAction(monsters.neptuneCore, 8, function () {
        resetCove();
        refreshArea();
    }), function () {
        return areas.cove.isCoreRevealed;
    });
    headBattleAction.innerAction.monster.doNotRegenerate = true;
    bodyBattleAction.innerAction.monster.doNotRegenerate = true;
    coreBattleAction.innerAction.monster.doNotRegenerate = true;
    areas.cove =  {
        'name': 'Cove',
        'key': 'cove',
        'travelTime': 30,
        'travelDamage': 5,
        'bodyTimer': 0,
        'headTimer': 0,
        'isTentacleDefeated': false,
        'isCoreRevealed': false,
        'isBodyRevealed': false,
        'isNeptuneDesperate': false,
        'cripplingTentacles': 1,
        'poisoningTentacles': 0,
        'leechingTentacles': 0,
        'cripplingTentacleBattleAction': cripplingTentacleBattleAction.innerAction,
        'poisonTentacleBattleAction': poisonTentacleBattleAction.innerAction,
        'leechingTentacleBattleAction': leechingTentacleBattleAction.innerAction,
        'headBattleAction': headBattleAction.innerAction,
        'bodyBattleAction': bodyBattleAction.innerAction,
        'coreBattleAction': coreBattleAction.innerAction,
        '$graphic': $img('shore.png'),
        'actions': [
            //reset the state of the cove when the player leaves
            new MoveAction('magmaFlow', 4, resetCove),
            firstTentacleBattleAction,
            cripplingTentacleBattleAction,
            poisonTentacleBattleAction,
            headBattleAction,
            bodyBattleAction,
            coreBattleAction,
            leechingTentacleBattleAction
        ],
        'loop': function (deltaTime) {
            //can't fight the core while the body is up
            if (fighting && fighting.key == 'neptuneCore' && !areas.cove.isNeptuneDesperate && areas.cove.bodyTimer <= 0) {
                stopFighting();
            }
            //Neptune will regenerate its head and body over time if it isn't desperate
            if (!areas.cove.isNeptuneDesperate) {
                if (areas.cove.bodyTimer > 0) {
                    areas.cove.bodyTimer -= deltaTime;
                    if (areas.cove.bodyTimer <= 0) {
                        areas.cove.headTimer = 0;
                        //restore body+head to full health
                        areas.cove.headBattleAction.monster.health = areas.cove.headBattleAction.monster.maxHealth;
                        areas.cove.bodyBattleAction.monster.health = areas.cove.bodyBattleAction.monster.maxHealth;
                        //core loses 10% health to regenerate body+head
                        areas.cove.coreBattleAction.monster.health -= areas.cove.coreBattleAction.monster.maxHealth * .1;
                        updateCove();
                    }
                } else {
                    //head only regenerates if the body is alive
                    if (areas.cove.headTimer > 0) {
                        areas.cove.headTimer -= deltaTime;
                        if (areas.cove.headTimer <= 0) {
                            //restore head to full health
                            areas.cove.headBattleAction.monster.health = areas.cove.headBattleAction.monster.maxHealth;
                            updateCove();
                        }
                    }
                    //core only regenerates if the body is alive
                    areas.cove.coreBattleAction.monster.health = Math.min(areas.cove.coreBattleAction.monster.health + 1000 * deltaTime / 1000, areas.cove.coreBattleAction.monster.maxHealth);
                    scheduleMonsterForUpdate(areas.cove.coreBattleAction.monster);
                }
            }
            var factor = 1;//factor is 1 at start and when head is alive
            if (areas.cove.isNeptuneDesperate) {
                factor = .8;//factor is .8 during the last portion of the fight
            } else if (areas.cove.bodyTimer > 0) {
                factor = 0;//factor is 0 while the body is dead (until neptune becomes desperate)
            } else if (areas.cove.headTimer > 0) {
                factor = .1;//factor is .1 when the head is destroyed but the body is still up
            }
            //tentacles become more powerful as time passes
            if (areas.cove.isTentacleDefeated) {
                areas.cove.cripplingTentacles += factor * .08 * deltaTime / 1000;
                areas.cove.poisoningTentacles += factor * .08 * deltaTime / 1000;
                uiNeedsUpdate.area = true;
                updateTentacleStats(areas.cove.cripplingTentacleBattleAction.monster, monsters.tentacles, areas.cove.cripplingTentacles);
                updateTentacleStats(areas.cove.poisonTentacleBattleAction.monster, monsters.toxicStingers, areas.cove.poisoningTentacles);
            }
            if (areas.cove.isNeptuneDesperate) {
                areas.cove.leechingTentacles += .1 * deltaTime / 1000;
                areas.cove.coreBattleAction.monster.health = Math.min(areas.cove.coreBattleAction.monster.health + areas.cove.leechingTentacles * 2000 * deltaTime / 1000, areas.cove.coreBattleAction.monster.maxHealth);
                scheduleMonsterForUpdate(areas.cove.coreBattleAction.monster);
                updateTentacleStats(areas.cove.leechingTentacleBattleAction.monster, monsters.leechingTentacles, areas.cove.leechingTentacles);
            } else if (areas.cove.bodyTimer > 0 && areas.cove.coreBattleAction.monster.health < areas.cove.coreBattleAction.monster.maxHealth * .3) {
                //neptune becomes desperate when its health drops below 30%. It will no longer
                //regenerate the
                stopFighting();
                areas.cove.isNeptuneDesperate = true;
                areas.cove.leechingTentacles = 3;
                updateCove();
            }
        }
    };
}
function updateCove() {
    uiNeedsUpdate.area = true;
    scheduleMonsterForUpdate(areas.cove.headBattleAction.monster);
    scheduleMonsterForUpdate(areas.cove.bodyBattleAction.monster);
    scheduleMonsterForUpdate(areas.cove.coreBattleAction.monster);
    var $coreElement = areas.cove.coreBattleAction.monster.$element;
    if ($coreElement && !areas.cove.isNeptuneDesperate && areas.cove.bodyTimer <= 0) {
        $coreElement.closest('.action').attr('helpText', 'I need to destroy the body again in order to attack the core more.');
    }
    //scale the healh+attackSpeed of the tentacles based on their number
    updateTentacleStats(areas.cove.cripplingTentacleBattleAction.monster, monsters.tentacles, areas.cove.cripplingTentacles);
    updateTentacleStats(areas.cove.poisonTentacleBattleAction.monster, monsters.toxicStingers, areas.cove.poisoningTentacles);
    updateTentacleStats(areas.cove.leechingTentacleBattleAction.monster, monsters.leechingTentacles, areas.cove.leechingTentacles);
}
function updateTentacleStats(monster, baseMonster, amount) {
    if (fighting && fighting.key == monster.key) {
        monster.maxHealth = Math.round(baseMonster.health * amount);
    } else {
        monster.health = monster.maxHealth = Math.round(baseMonster.health * amount);
    }
    monster.attackSpeed = Math.round(100 * baseMonster.attackSpeed * amount) / 100;
    scheduleMonsterForUpdate(monster);
}
resetCove();
$.each(areas, function (key, area) { area.key = key;});