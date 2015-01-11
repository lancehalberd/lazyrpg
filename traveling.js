
var targetArea = null;
var currentArea = null;

/**
 * Moves to the area with the given key. Throws an error if no such area exists
 * or if there is no route to that area.
 */
actions.move = function (params) {
    checkParams(1, params);
    var action = targets.move[params[0]];
    if (!action) {
        throw new ProgrammingError("There is no path to '" + params[0] + "' from here.");
    }
    action(params);
}
var $travelBar = $div('travel healthBar', $div('js-timeFill healthFill')).append($div('js-name name', 'traveling'));
var $plagueBar = $div('plague healthBar', '')
    .append($div('js-maxPlagueFill maxPlagueFill'))
    .append($div('js-plagueFill plagueFill'))
    .append($div('js-name name', 'plague'));
var onCompleteTravelFunction = null;
function MoveAction(target, slot, onCompleteFunction) {
    this.slot = slot;
    this.getDiv = function () {
        var $myDiv = $div('action slot' + slot, areas[target].$graphic)
                .attr('helpText', 'Click here to move to the ' + areas[target].name + '.<br/></br> Traveling takes time and may drain your health. <br/>Travel time is doubled when your health is 0.');
        //add the travel bar to this action if the player is in the middle of using this action.
        //This happens in areas where the area is updated whenever time passes (secret lab and kraken fight for example)
        if (areas[target].plagueLevel) {
            var $myPlagueBar = $plagueBar.clone();
            $myPlagueBar.find('.js-plagueFill').css('width', (100 * areas[target].plagueLevel / plagueLimit) + '%');
            $myPlagueBar.find('.js-maxPlagueFill').css('width', (100 * areas[target].maxPlagueLevel / plagueLimit) + '%');
            $myDiv.append($myPlagueBar);
        }
        if (targetArea == target) {
            $myDiv.append($travelBar);
            updateTravelBar();
        }
        return $myDiv;
    };
    this.action = function () {
        if (targetArea == target) {
            return 'stop';
        }
        return 'move ' + target;
    };
    this.addActions = function () {
        targets.move[target] = function (params) {
            stopAll();
            //attach the travel bar to this travel action to display the travel sequence
            $('.action.slot' + slot).append($travelBar.hide());
            $travelBar.css('top', '').css('left', '');
            targetArea = target;
            //called to run an action specific effect
            onCompleteTravelFunction = onCompleteFunction;
            //these are stored on the mineral as a hack since we don't
            //track floating point life, but need to track floating point damage
            player.travelDamage = 0;
            player.totalTravelTime = player.travelTimeLeft = Math.floor((currentArea.travelTime + areas[targetArea].travelTime) / 2);
            player.initialPlayerHealth = player.health;
            uiNeedsUpdate.travelingStats = true;
        }
    };
}
function MoveMapAction(data) {
    this.getArea = function () {
        if (targetArea == data.target) {
            $('.js-currentArea').append($travelBar);
            updateTravelBar();
        }
        var $area = $('<area shape="poly" class="actionArea"></area>');
        $area.attr('coords', data.points);
        $area.attr('helpText', 'Click here to move to the ' + areas[data.target].name + '.<br/></br> Traveling takes time and may drain your health. <br/>Travel time is doubled when your health is 0.');
        return $area;
    };
    this.action = function () {
        if (targetArea == data.target) {
            return 'stop';
        }
        return 'move ' + data.target;
    };
    //average point of the map area is used to position the travel bar when traveling
    var averagePoint = [0, 0];
    var points = data.points.split(',');
    for (var i = 0; i < points.length; i += 2) {
        averagePoint[0] += Number(points[i]);
        averagePoint[1] += Number(points[i + 1]);
    }
    averagePoint[0] /= (points.length / 2);
    averagePoint[1] /= (points.length / 2);
    this.addActions = function () {
        targets.move[data.target] = function (params) {
            stopAll();
            //attach the travel bar to this travel action to display the travel sequence
            $('.js-currentArea').append($travelBar);
            $travelBar.css('left', (averagePoint[0] - 480) + 'px').css('top', (averagePoint[1] - 300) + 'px');
            targetArea = data.target;
            //called to run an action specific effect
            onCompleteTravelFunction = data.onCompleteFunction;
            //these are stored on the mineral as a hack since we don't
            //track floating point life, but need to track floating point damage
            player.travelDamage = 0;
            player.totalTravelTime = player.travelTimeLeft = Math.floor((currentArea.travelTime + areas[targetArea].travelTime) / 2);
            player.initialPlayerHealth = player.health;
            uiNeedsUpdate.travelingStats = true;
        }
    };
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
        if (onCompleteTravelFunction) {
            onCompleteTravelFunction();
        }
        setArea(areas[targetArea]);
        stopTraveling();
    }
    uiNeedsUpdate.playerStats = true;
    uiNeedsUpdate.travelingStats = true;
}

function stopTraveling() {
    if (targetArea) {
        targetArea = null;
        refreshArea();
        removeToolTip();
    }
}

function updateTravelBar() {
    if (!targetArea) {
        $travelBar.remove();
        return;
    }
    $travelBar.show();
    var timePercent = player.travelTimeLeft / player.totalTravelTime;
    $travelBar.find('.js-timeFill').css('width', (100 * timePercent) + '%');
}