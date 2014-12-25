var areas = {};
var placeActions = {};
var targetedActions = ['move', 'fight', 'mine'];
var targets = {};

function RebirthAction(slot) {
    this.getDiv = function () {
        return $div('action slot' + slot, $div('box', 'Rebirth')).attr('helpText', 'I can regenerate my body, resetting my level and skills. This will be useful if I need to train different abilities in the future.');
    };
    this.action = "rebirth";
    this.addActions = function () {
        placeActions.rebirth = function (params) {
            checkParams(0, params);
            resetCharacter();
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
        return $div('action slot' + slot, $div('box', 'Save')).attr('helpText', 'Save your current progress.');
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

function updateShop() {
    $('.js-shopContainer .js-body .js-shopItem').each(function () {
        var item = $(this).data('item');
        $(this).toggleClass('canBuy', item.value * 2 <= player.gold);
    });
}

function setArea(area) {
    placeActions = {};
    targetedActions.forEach(function(action) {
        targets[action] = {};
    });
    currentArea = area;
    player.area = area.key;
    $('.js-currentArea').empty().append(currentArea.$graphic);
    currentArea.actions.forEach(function (action) {
        var $actionDiv = action.getDiv();
        $('.js-currentArea').append($actionDiv);
        action.addActions();
        $actionDiv.on('mousedown', function () {
            var actionCode = evaluateAction(action.action);
            if (!actionCode || !actionCode.length) {
                return;
            }
            try {
                runLine(actionCode);
                recordAction(actionCode);
            }  catch(e) {
                if (e instanceof ProgrammingError) {
                    alert(e.message);
                } else {
                    throw e;
                }
            }
            removeToolTip();
        });
    });
}
function refreshArea() {
    setArea(areas[player.area]);
}
