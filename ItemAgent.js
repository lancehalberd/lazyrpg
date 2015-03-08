
function ItemAgent(data) {
    var item = this;
    if (typeof(item.gold) != 'undefined') {
        item.key = 'gold';
        item.goldAmount = item.gold;
        item.$graphic = $div('icon gold action');
    } else {
        if (!data.key || !allItems[data.key]) {
            throw new Exception("ItemAgent expects an item key or gold value: " + data.key);
        }
        item.key = data.key;
        item.item = allItems[data.key];
        item.$graphic = $div('icon item action');
    }
    item.$graphic.attr('helpText', item.item.helpText);
    item.area = null; //Will be set when this agent is placed in an area
    item.agentType = 'item';
    item.top = data.top;
    item.left = data.left;
    item.spawnType = data.spawnType;
    item.angle = data.angle;
    item.controlLoop = enemyCode.basicLoop;
    this.reset = function () {
        item.active = true; //this needs to be true for state checks to be run...
        item.alive = false; //item cannot be targeted until its spawn time finishes
        item.timeTaken = 0;
        item.timeSpawned = player.time;
    };
    this.update = function () {
        if (this.area != currentArea) {
            return;
        }
        var $container = $('.js-areaAgents');
        if (!item.$graphic.closest($container).length) {
            $container.append(item.$graphic);
        }
        if (this.alive) {
            var index = item.area.agentsByKey[item.key].indexOf(item);
            item.$graphic.attr('code', 'take area.' + item.key + '.' + index);
        } else {
            item.$graphic.attr('code', null);
            if (!item.timeTaken) {
                if (item.spawnType == 'scale') {
                    if (scaleSpawn(item, item.$graphic)) {
                        item.alive = true;
                    }
                } else if (item.spawnType == 'arc') {
                    if (arcSpawn(item, item.$graphic, item.angle)) {
                        item.alive = true;
                    }
                }
            } else if (player.time - item.timeTaken <  500) {
                var p = Math.min(1, (player.time - item.timeTaken) / 500);
                var x = item.left * (1 - p) + 1000 * p;
                var y = item.top * (1 - p) + 150 * p;
                item.$graphic.css('left', (x - 480) + 'px').css('top', (y - 300) + 'px');
            } else {
                item.$graphic.remove();
            }
        }
    }
    this.reset();
    this.getAttackSpeed = function () {
        return 1;
    };
    this.stateCheck = function () {
        if (item.timeTaken && player.time - item.timeTaken > 500) {
            removeAgentFromArea(item);
            item.$graphic.remove();
        }
    };
    //None of these are used presently, but might be used in the future
    this.hasSkill = function () {
        return false;
    };
    this.getDamage = function () {
        return (this.damage ? this.damage : 0);
    }
    this.getArmor = function () {
        return (this.parry ? this.parry : 0) + Math.max(0, this.armor - this.battleStatus.armorReduction);
    };
    this.getArmorPierce = function () {
        return (this.armorPierce ? this.armorPierce : 0);
    };
    this.getReflect = function () {
        return (this.reflect ? this.reflect : 0);
    };
    this.getArmorBreak = function () {
        return (this.armorBreak ? this.armorBreak : 0);
    };
    this.getCripple = function () {
        return (this.cripple ? this.cripple : 0);
    };
    this.getPoison = function () {
        return (this.poison ? this.poison : 0);
    };
    this.getLifeSteal = function () {
        return (this.lifeSteal ? this.lifeSteal : 0);
    };
    this.getTravelingSpeed = function () {
        return (this.travelingSpeed ? this.travelingSpeed : 1);
    };
    this.getVigor = function () {
        return (this.vigor ? this.vigor : 1);
    };
}