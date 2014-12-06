
var targetArea = null;
var endMovingCallback = null;
var currentArea = null;

/**
 * Moves to the area with the given key. Throws an error if no such area exists
 * or if there is no route to that area.
 */
actions.move = function (params, successCallback, errorCallback) {
    checkParams(1, params);
    var areaKey = params[0];
    var moveAction = getAreaAction('move', areaKey);
    if (!moveAction) {
        throw new ProgrammingError("There is no path to '" + areaKey + "' from here.");
    }
    moveAction.perform();
    endMovingCallback = successCallback;
}
var $travelBar = $div('travel healthBar', $div('js-timeFill travel healthFill')).append($div('js-name name', 'traveling'));
function MoveAction(target, slot) {
    this.actionName = "move";
    this.actionTarget = target;
    this.getDiv = function () {
        return $div('action slot' + slot, areas[target].$graphic)
                .attr('helpText', 'Click here to move to the ' + areas[target].name + '.<br/></br> Traveling takes time and may drain your health. <br/>Travel time is doubled when your health is 0.');
    };
    this.perform = function () {
        if (targetArea == target) {
            closeAll();
        } else {
            closeAll();
            //attach the travel bar to this travel action to display the travel sequence
            $('.action.slot' + slot).append($travelBar);
            targetArea = target;
            //these are stored on the mineral as a hack since we don't
            //track floating point life, but need to track floating point damage
            player.travelDamage = 0;
            player.totalTravelTime = player.travelTimeLeft = Math.floor((currentArea.travelTime + areas[targetArea].travelTime) / 2);
            player.initialPlayerHealth = player.health;
            uiNeedsUpdate.travelingStats = true
        }
    }
}

function travelingLoop(currentTime, deltaTime) {
    var travelingSpeed = (1 + getTotalEnchantment('travelingSpeed'));
    var vigor = player.bonuses.vigor.multi * (1 + getTotalEnchantment('vigor'));
    var damageLevel = (currentArea.travelDamage + areas[targetArea].travelDamage) / 2;
    var factor = player.health > 0 ? 1 : .5;
    var timeTraveled = Math.min(player.travelTimeLeft, travelingSpeed * factor * deltaTime / 1000);
    player.travelTimeLeft -= timeTraveled;
    //divide by travelingSpeed because travelTime is actually the time traveled not taking into acount the traveling speed
    player.travelDamage += (player.getDamageOverTime() + damageLevel / vigor) * timeTraveled / travelingSpeed;
    player.health = Math.max(0, Math.round(player.initialPlayerHealth - player.travelDamage));
    if (player.travelTimeLeft <= 0) {
        setArea(areas[targetArea]);
        recordAction('move', targetArea);
        stopTraveling();
    }
    uiNeedsUpdate.playerStats = true;
    uiNeedsUpdate.travelingStats = true;
}

function stopTraveling() {
    if (targetArea) {
        targetArea = null;
        refreshArea();
        if (endMovingCallback) {
            endMovingCallback();
            endMovingCallback = null;
        }
    }
}

function updateTravelBar() {
    if (!targetArea) {
        $travelBar.remove();
        return;
    }
    var timePercent = player.travelTimeLeft / player.totalTravelTime;
    $travelBar.find('.js-timeFill').css('width', (100 * timePercent) + '%');
}