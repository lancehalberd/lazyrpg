var areas = {};
var placeActions = {};
var availableRecipes = {};
var currentArea = null;
var activeAreas = {};

function RebirthAction(slot) {
    this.getDiv = function () {
        return $div('action slot' + slot, $div('box', 'Rebirth')).attr('helpText', 'I can regenerate my body, resetting my level and skills. This will be useful if I need to train different abilities in the future.');
    };
    this.action = "rebirth";
    this.addActions = function () {
        placeActions.rebirth = function (params) {
            checkParams(0, params);
            resetCharacter();
            uiNeedsUpdate.area = true;
        };
    };
}
function RestAction(slot) {
    this.getDiv = function () {
        return $div('action slot' + slot, $div('box', 'Rest')).attr('helpText', 'I can restore my health by resting here.').data('helpFunction', function() {
            var healthLost = player.maxHealth - player.health;
            if (healthLost <= 0) {
                return 'My health is full, so there is no reason to rest.';
            }
            return 'Resting will take ' + Math.ceil(healthLost / 10) + ' seconds.';
        });
    };
    this.action = "rest";
    this.addActions = function () {
        placeActions.rest = function (params) {
            checkParams(0, params);
            var healthLost = player.maxHealth - player.health;
            player.time += 1000 * Math.ceil(healthLost / 10);
            player.health = player.maxHealth;
            uiNeedsUpdate.playerStats = true;
        };
    };
}
function SaveAction(slot) {
    this.getDiv = function () {
        return $div('action slot' + slot, $div('box', 'Save')).attr('helpText', 'Save my current progress.');
    };
    this.action = "save";
    this.addActions = function () {
        placeActions.save = function (params) {
            checkParams(0, params);
            saveCurrentGame();
        };
    };
}

function evaluateAction(action) {
    if (typeof(action) === 'function') {
        return action();
    }
    return action;
}

//action only available if the condition method returns true
function ToggleAction(innerAction, condition) {
    this.innerAction = innerAction;
    this.getDiv = function () {
        return condition() ? innerAction.getDiv() : $div('').hide();
    };
    this.action = function () {
        if (!condition()) {
            return '';
        }
        return evaluateAction(innerAction.action);
    }
    this.addActions = function () {
        if (!condition()) {
            return;
        }
        innerAction.addActions();
    };
}
//action only available if the condition method returns true
function DoorAction(innerAction, condition, helpText) {
    this.innerAction = innerAction;
    this.getDiv = function () {
        if (condition()) {
            var $innerDiv = innerAction.getDiv();
            //clone to get help info off of the inner action
            var $doorDiv = $innerDiv.clone().empty();
            $doorDiv.data('helpFunction', $innerDiv.data('helpFunction'));
            return $doorDiv.append($div('innerActionContainer', $innerDiv)).append($div('door open'));
        }
        if (typeof(helpText) == 'undefined') {
            helpText = 'There is a sealed door. Perhaps there is a mechanism for opening it somewhere.';
        }
        return $div('action slot' + innerAction.slot).append($div('door closed')).attr('helpText', helpText);
    };
    this.action = function () {
        if (!condition()) {
            return '';
        }
        return evaluateAction(innerAction.action);
    }
    this.addActions = function () {
        if (!condition()) {
            return;
        }
        innerAction.addActions();
    };
}
//action only available if the condition method returns true
function SpecialAction(slot, actionKey, label, helpFunction, activate) {
    this.slot = slot;
    this.getDiv = function () {
        return $div('action slot' + slot, $div('box wide', label)).attr('helpText', '').data('helpFunction', helpFunction);
    };
    this.action = function () {
        return evaluateAction(actionKey);
    }
    this.addActions = function () {
        placeActions[evaluateAction(actionKey)] = activate;
    };
}

function updateShop() {
    $('.js-shopContainer .js-body .js-shopItem').each(function () {
        var item = $(this).data('item');
        $(this).toggleClass('canBuy', item.value * 2 <= player.gold);
    });
}

function setArea(area) {
    placeActions = {};
    availableRecipes = {};
    var changedAreas = (!currentArea || currentArea.key != area.key);
    currentArea = area;
    player.area = area;
    if (!area.initialized && area.initialize) {
        area.initialize();
        area.initialized = true;
    }
    activeAreas[currentArea.key] = currentArea;
    if (area.trackName) {
        setMusic(area.trackName);
    }
    $('.js-currentArea').empty().append(currentArea.$graphic);
    $('.js-currentArea').append($div('areaAgents js-areaAgents'));
    $('.js-currentArea').append($div('areaOverlay js-areaOverlay'));
    $('.js-currentArea').append($('<map class="js-areaMaps" name="actions"></map>'));
    currentArea.$graphic.attr('usemap', '#actions');
    //activate all agents in the area that are alive, in case any were deactivated
    currentArea.agents.forEach(function (agent) {
        if (agent.alive) {
            agent.active = true;
        }
    });
    refreshArea();
}
function refreshArea() {
    currentArea.agents.forEach(function (agent) {
        agent.update();
    });
    $.each(currentArea.paths, function (key, path) {
        path.update();
    });
}

function WorldArea(data) {
    var self = this;
    $.each(data, function (key, value) {
        self[key] = value;
    });
    this.active = false;
    this.initialized = false;
    this.agents = [];
    this.agentsByKey = {};
    this.paths = {};
}

function addPath(area, pathAction) {
    area.paths[pathAction.key] = pathAction;
    pathAction.area = area;
    if (!pathAction.connectedPathKey) {
        pathAction.connectedPathKey = area.key;
    }
}

function addAgentToArea(area, agent) {
    if (!area.agentsByKey[agent.key]) {
        area.agentsByKey[agent.key] = [];
    }
    var placed = false;
    for (var i = 0; i < area.agentsByKey[agent.key].length; i++) {
        if (!area.agentsByKey[agent.key][i]) {
            area.agentsByKey[agent.key][i] = agent;
            placed = true;
            break;
        }
    }
    if (!placed) {
        area.agentsByKey[agent.key].push(agent);
    }
    area.agents.push(agent);
    agent.area = area;
}

function removeAgentFromArea(agent) {
    spliceFromArray(agent.area.agents, agent);
    spliceFromArray(agent.area.agentsByKey[agent.key], agent);
}

function spliceFromArray(array, element) {
    array.splice(array.indexOf(element), 1);
}