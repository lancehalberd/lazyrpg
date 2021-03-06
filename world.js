var areas = {};
var placeActions = {};
var targetedActions = ['move', 'fight', 'mine'];
var targets = {};
var availableRecipes = {};

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
    targetedActions.forEach(function(action) {
        targets[action] = {};
    });
    var changedAreas = (!currentArea || currentArea.key != area.key);
    currentArea = area;
    player.area = area.key;
    if (changedAreas && area.initialize) {
        area.initialize();
    }
    if (area.trackName) {
        setMusic(area.trackName);
    }
    $('.js-currentArea').empty().append(currentArea.$graphic);
    var $map = null;
    currentArea.actions.forEach(function (action) {
        action.addActions();
        if (action.getArea) {
            if (!$map) {
                $map = $('<map name="actions"></map>');
            }
            var $area = action.getArea();
            $map.append($area);
            var actionCode = evaluateAction(action.action);
            if (actionCode) {
                $area.attr('code', actionCode);
            }
        } else {
            var $actionDiv = action.getDiv();
            $('.js-currentArea').append($actionDiv);
            var actionCode = evaluateAction(action.action);
            if (actionCode) {
                if (action.getTarget) {
                    action.getTarget().attr('code', actionCode);
                } else {
                    $actionDiv.attr('code', actionCode);
                }
            }
        }
    });
    if ($map) {
        currentArea.$graphic.attr('usemap', '#actions');
        $('.js-currentArea').append($map);
    }
}
function refreshArea() {
    setArea(areas[player.area]);
}

function runCodeFromUI(code) {
    try {
        runLine(code);
        recordAction(code);
        uiNeedsUpdate.area = true;
    } catch(e) {
        if (e instanceof ProgrammingError) {
            alert(e.message);
        } else {
            console.log(e.stack);
            throw e;
        }
    }
}
