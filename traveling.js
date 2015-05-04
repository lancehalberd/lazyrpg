var $travelBar = $div('travel healthBar', $div('js-timeFill healthFill')).append($div('js-name name', 'traveling'));
var $plagueBar = $div('plague healthBar', '')
    .append($div('js-maxPlagueFill maxPlagueFill'))
    .append($div('js-plagueFill plagueFill'))
    .append($div('js-name name', 'plague'));

function PathAction(data) {
    this.pointsString = data.points;
    this.target = data.target;
    /* @type {string} The key used to target this path from the current area */
    this.key = data.key ? data.key : data.target;
    /* @type {string} The key of the path this connects to in the target area */
    this.connectedPathKey = data.connectedPathKey;
    this.damage = data.damage ? data.damage : 0;
    this.time = data.time ? data.time : 1000;
    //average point of the map area is used to position the travel bar when traveling
    this.averagePoint = getAveragePoint(this.pointsString.split(','))

    this.update = function () {
        if (this.area != currentArea) {
            return;
        }
        if (!this.$area) {
            this.$area = $('<area shape="poly" class="path actionArea"></area>');
            this.$area.attr('coords', this.pointsString);
            this.$area.attr('helpText', 'Click here to move to the ' + this.key + '.<br/></br> Traveling takes time and may drain your health.');
        }
        if (player.destination == this.key) {
            $('.js-areaOverlay').append($travelBar);
            updateTravelBar();
            this.$area.attr('code', 'stop');
        } else {
            this.$area.attr('code', 'move ' + this.key);
        }
        var $container = $('.js-areaMaps')
        if (!this.$area.closest($container).length) {
            $container.append(this.$area);
        }
    };
}


/**
 * Sets the destination path of the agent to the given key. While the destination
 * is set, the agent will move towards the path over time.
 */
actions.move = function (params, agent) {
    checkParams(1, params);
    var value = params[0];
    /* @type PathAction */
    var pathAction = agent.area.paths[value];
    if (!pathAction) {
        throw new ProgrammingError("There is no path to '" + params[0] + "' from here.");
    }
    //Display the travel overlay on the path if the agent moving is the player
    if (agent == player) {
        $('.js-areaOverlay').append($travelBar);
        $travelBar.css('left', (pathAction.averagePoint[0] - 480) + 'px').css('top', (pathAction.averagePoint[1] - 300) + 'px');
        uiNeedsUpdate.area = true;
        uiNeedsUpdate.travelingStats = true;
    }
    agent.destination = pathAction.key;
    if (!agent.pathKey || !agent.area.paths[agent.pathKey]) {
        agent.pathKey = agent.destination;
    }
}

function moveAgent(agent, deltaTime) {
    if (agent.destination) {
        var amount = deltaTime * agent.getTravelingSpeed();
        if (agent.agentType == 'player') {
            uiNeedsUpdate.travelingStats = true;
        }
        if (agent.pathKey == agent.destination) {
            var path = agent.area.paths[agent.pathKey];
            agent.health = Math.max(0, agent.health - ((path.damage * deltaTime / path.time) / agent.getVigor()));
            agent.pathTime += amount;
            if (agent.pathTime >= path.time) {
                changeAreas(agent, areas[path.target]);
                var newPath = agent.area.paths[path.connectedPathKey];
                agent.pathKey = newPath.key;
                agent.pathTime = newPath.time * .9;
                agent.destination = null;
            }
        } else {
            var path = agent.area.paths[agent.pathKey];
            agent.pathTime -= amount;
            agent.health = Math.max(0, agent.health - ((path.damage * deltaTime / path.time) / agent.getVigor()));
            if (agent.pathTime <= 0) {
                agent.pathTime = -agent.pathTime;
                agent.pathKey = agent.destination;
            }
        }
    }
}
function changeAreas(agent, newArea) {
    if (agent.agentType == 'player') {
        setArea(newArea);
    } else {
        removeAgentFromArea(agent);
        addAgentToArea(newArea, agent);
    }
}

function updateTravelBar() {
    if (!player.destination) {
        $travelBar.remove();
        return;
    }
    if (!player.pathKey) {
        player.pathKey = player.destination;
    }
    $travelBar.show();
    var timePercent;
    var currentPath = player.area.paths[player.pathKey];
    //Current path is not defined after leaving this area
    var destinationPath = player.area.paths[player.destination];
    if (currentPath == destinationPath) {
        timePercent = .5 - .5 * (player.pathTime / currentPath.time);
    } else {
        timePercent = .5 + .5 * (player.pathTime / currentPath.time);
    }
    $travelBar.find('.js-timeFill').css('width', (100 * timePercent) + '%');
}

function getAveragePoint(points) {
    var averagePoint = [0, 0];
    for (var i = 0; i < points.length; i += 2) {
        averagePoint[0] += Number(points[i]);
        averagePoint[1] += Number(points[i + 1]);
    }
    averagePoint[0] /= (points.length / 2);
    averagePoint[1] /= (points.length / 2);
    return averagePoint;
}