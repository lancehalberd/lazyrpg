function Agent() {
    this.delay = 0;
    this.method = null;
    this.area = null;
    this.agentType = 'default';
    this.active = false;
    this.top = 0;
    this.left = 0;
    this.controlLoop = enemyCode.basicLoop;
    this.delay = 0;
    this.method = null;
    this.executionContext = new ExecutionContext(this);
    this.damageDisplay = new NumericDisplay(this, 'damageDisplay');
    this.healingDisplay = new NumericDisplay(this, 'healingDisplay');
    this.getActionMethod = function (action) {
    }
    this.contextValues = {};
    this.destination = null;
    this.pathKey = '';
    /* @type Number */
    this.pathTime = 0;
}

function damageAgent(agent, damage) {
    agent.damageDisplay.updated = true;
    if (damage > 0) {
        agent.health = Math.max(0, agent.health - damage);
        agent.damageDisplay.amount += damage;
    }
}
function healAgent(agent, amount) {
    //plague of 100 renders all healing innefective except for rebirthing
    amount *= Math.max(0, 1 - agent.plague / 100);
    scheduleAgentForUpdate(agent);
    agent.healingDisplay.updated = true;
    if (amount > 0) {
        agent.health = Math.min(agent.getMaxHealth(), agent.health + amount);
        agent.healingDisplay.amount += amount;
    }
}

function applyCripple(attackSpeed, cripple) {
    return attackSpeed / (1 + Math.log(1 + cripple / 6));
}
function applyArmorToDamage(damage, armor) {
    //This equation looks a bit funny but is designed to have the following properties:
    //100% damage at 0 armor
    //50% damage when armor is 1/3 of base damage
    //25% damage when armor is 2/3 of base damage
    //1/(2^N) damage when armor is N/3 of base damage
    return Math.max(1, Math.round(damage / Math.pow(2, 3 * armor / damage)));
}

function agentAttacksTarget(agent, target) {
    var damage = agent.getDamage();
    var dealtDamage = damage;
    agent.animateAttack();
    if (!agent.hasSkill('scan')) {
        var parry = target.parry ? target.parry : 0;
        dealtDamage = applyArmorToDamage(damage, Math.max(0, target.getArmor() * (1 - agent.getArmorPierce())));
        var mitigatedDamage = damage - dealtDamage;
        var reflectedDamage = Math.floor(mitigatedDamage * target.getReflect());
        if (reflectedDamage) {
            agent.health = agent.health - reflectedDamage;
        }
    }
    if (dealtDamage > 0 && !agent.hasSkill('poach')) {
        target.damaged++;
    }
    damageAgent(target, dealtDamage);
    var armorBreak = agent.getArmorBreak();
    if (armorBreak) {
        target.battleStatus.armorReduction += armorBreak;
    }
    var cripple = agent.getCripple();
    if (cripple) {
        target.battleStatus.crippled += cripple;
    }
    var poison = agent.getPoison();
    if (poison) {
        target.battleStatus.poisonDamage += poison;
        target.battleStatus.poisonRate++;
    }
    var lifeSteal = agent.getLifeSteal();
    if (lifeSteal) {
        agent.gainLife(Math.floor(damage * lifeSteal));
    }
    agent.health = Math.max(0, agent.health);
    target.needsUpdate = true;
}


function processStatusEffects(target, deltaTime) {
    //always process this for player in case the player has a special DOT on them
    if (target.battleStatus.poisonDamage || target.getDamageOverTime) {
        var damage = Math.min(target.battleStatus.poisonDamage, target.battleStatus.poisonRate * deltaTime / 100);
        //dealtPoisonDamage accrues the floating point damage from poison over time
        target.battleStatus.dealtPoisonDamage += damage;
        //use the dealt poison damage to accrue extra DOT from cooling magma and other sources during battles
        if (target.getDamageOverTime) {
            target.battleStatus.dealtPoisonDamage += player.getDamageOverTime() * deltaTime / 1000;
        }
        //when it is greater than 1 damage is dealt to the targets health and remove from dealtPoisonDamage
        if (target.battleStatus.dealtPoisonDamage > 1) {
            target.health = Math.max(0, target.health - Math.floor(target.battleStatus.dealtPoisonDamage));
            target.battleStatus.dealtPoisonDamage = target.battleStatus.dealtPoisonDamage % 1;
        }
        target.battleStatus.poisonDamage -= damage;
    } else {
        //poison rate is reduced back to 0 if poison ever clears the target's system
        target.battleStatus.poisonRate = 0;
    }
    if (target.battleStatus.crippled) {
        target.battleStatus.crippled = Math.max(0, target.battleStatus.crippled - deltaTime / 1000);
    }
}


function scheduleAgentForUpdate(agent) {
    agent.needsUpdate = true;
}

function getAreaTarget(value, agent) {
    if (typeof value != 'string') {
        throw new ProgrammingError('Expected a target string found: ' + value);
    }
    var parts = value.split('.');
    if (parts[0] == 'myself') {
        return agent;
    }
    if (parts[0] == 'player') {
        if (player.area == agent.area) {
            return player;
        }
        return null;
    }
    var type = parts[0];
    if (!agent.area.agentsByKey[type]) {
        return null;
    }
    var index = 0;
    if (parts.length == 2) {
        index = parseInt(parts[1]);
    } else {
        for (index = 0; index < agent.area.agentsByKey[type].length; index++) {
            if (agent.area.agentsByKey[type][index].active) {
                break;
            }
        }
        if (index >= agent.area.agentsByKey[type].length) {
            index = 0;
        }
    }
    if (agent.area.agentsByKey[type][index].alive) {
        return agent.area.agentsByKey[type][index];
    }
    return null;
}

function assignDelayedAction(agent, delay, method) {
    agent.destination = null;
    agent.delay = delay;
    agent.method = method;
}