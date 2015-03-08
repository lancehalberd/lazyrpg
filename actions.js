//holds all actions that can be used from a macro
var actions = {};

actions.stop = function (params, agent) {
    checkParams(0, params);
    agent.delay = 0;
    agent.method = null;
    if (agent.destination && agent.agentType == 'player') {
        uiNeedsUpdate.travelingStats = true;
        uiNeedsUpdate.area = true;
    }
    agent.destination = null;
};

actions.hideTabs = function (params) {
    checkParams(0, params);
    closeAll();
};

actions.toggleHints = function (params) {
    checkParams(0, params);
    showTooltips = !showTooltips;
    removeToolTip();
};
actions.popupWindow = function (params) {
    checkParams(1, params);
    window.open(params[0], '_blank', 'location=no,scrollbars=yes,width=500,height=600');
};

actions.setSpeed = function (params) {
    checkParams(1, params);
    var speed = parseInt(params[0]);
    if (speed < 1) {
        player.gameSpeed = 1;
        throw new ProgrammingError("Speed cannot be less than 1.");
    }
    if (speed > 500) {
        player.gameSpeed = 500;
        throw new ProgrammingError("Speed cannot be higher than 500");
    }
    if (speed < 1 || speed > 500) {
        return;
    }
    player.gameSpeed = Math.floor(speed);
    if (player.gameSpeed < 1 || player.gameSpeed >= 500) {
        $('.js-changeSpeed').attr('code', 'setSpeed 1')
    } else if (player.gameSpeed < 4) {
        $('.js-changeSpeed').attr('code', 'setSpeed 4')
    } else if (player.gameSpeed < 50) {
        $('.js-changeSpeed').attr('code', 'setSpeed 50')
    } else if (player.gameSpeed < 500) {
        $('.js-changeSpeed').attr('code', 'setSpeed 500')
    }
    updateProgramButtons();
};
actions.wait = function (params, agent) {
    checkParams(1, params);
    var seconds = parseFloat(params[0]);
    if (isNaN(seconds)) {
        throw new ProgrammingError("Expected a number, found: " + params[0]);
    }
    agent.delay = 1000 * seconds;
    if (agent.area != currentArea) {
        agent.active = false;
    }
};
actions.attack = function (params, agent) {
    checkParams(1, params);
    var target = getAreaTarget(params[0], agent);
    if (!target) {
        throw new ProgrammingError("Invalid target: " + params[0]);
    }
    agent.timeNextAttack = player.time + 1000 / agent.getAttackSpeed();
    assignDelayedAction(agent, 1000 / agent.getAttackSpeed(), function () {
        agentAttacksTarget(agent, target);
    });
};
actions.take = function (params, agent) {
    checkParams(1, params);
    var target = getAreaTarget(params[0], agent);
    if (!target || target.agentType != 'item') {
        throw new ProgrammingError("Invalid target: " + params[0]);
    }
    assignDelayedAction(agent, 100, function () {
        agentTakesItem(agent, target);
    });
};

/**
 * tokenizes/parses a line of code into a sequences of tokens and expressions.
 * Usually parsing is done after tokenizing, but for my purposes here, it seemed
 * easiest to just evaluate top level expressions, which must be wrapped on
 * parentheses as individual tokens.
 *
 * @param {String} code  The line of code to parse
 * @return {Array}  The array of tokens/expressions
 */
function tokenize(code) {
    var index = 0;
    var tokens = [];
    while (index < code.length) {
        var nextSpace = code.indexOf(' ', index);
        if (nextSpace < 0) {
            nextSpace = code.length;
        }
        if (nextSpace == index) {
            index++;
            continue;
        }
        var nextOpen = code.indexOf('(', index);
        var nextClose = code.indexOf(')', index);
        if (nextClose < nextOpen || (nextClose >= 0 && nextOpen < 0)) {
            throw new ProgrammingError("Mismatched parenthesis, found more ')' with no corresponding '('");
        }
        if (nextOpen < 0 || (nextSpace < nextOpen)) {
            var value = $.trim(code.substring(index, nextSpace));
            if (value.length) {
                tokens.push(value);
            }
            index = nextSpace + 1;
        } else {
            //first add everything up to the (
            var value = $.trim(code.substring(index, nextOpen));
            if (value.length) {
                tokens.push(value);
            }
            //then add everything in between (...) as a single token
            var closingIndex = findClosingParenthesis(code, nextOpen);
            tokens.push($.trim(code.substring(nextOpen, closingIndex + 1)));
            //then move index to the end
            index = closingIndex + 1;
        }
    }
    return tokens;
}
function findClosingParenthesis(string, index) {
    //assuming we are starting on the character with the (
    var parenDepth = 0;
    while (index < string.length) {
        var character = string.charAt(index);
        if (character == '(') parenDepth++;
        else if (character == ')') parenDepth--;
        if (parenDepth == 0) {
            return index;
        }
        index++;
    }
    throw new ProgrammingError("Mismatched parenthesis, found more '(' than ')'");
}

function getPlayerStats(parts) {
    //parts[0] is either my, or the variable set to 'my'
    switch (parts[0]) {
        case 'health':
        case 'currentHealth': return player.health;
        case 'maxHealth': return player.getMaxHealth();
        case 'level': return player.level;
        case 'gold': return player.gold;
        case 'area': return player.area.key;
        case 'damage': return player.damage;
        case 'attackSpeed': return player.attackSpeed;
        case 'skillPoints': return player.skillPoints;
        case 'items':
            if (parts.length < 3) {
                throw new ProgrammingError("Invalid expression: '" + expression + "'.");
            }
            var item = allItems[parts[2]];
            if (!item) {
                return 0;
            }
            return player.inventory[item.slot][item.key];
        default:
            throw new ProgrammingError("Invalid expression: '" + expression + "'.");
    }
}

function runOperation(A, operator, B) {
    switch (operator.toLowerCase()) {
        case 'and':
        case '&&':
            return A && B;
        case 'or':
        case '||':
            return A || B;
        case '+': return A + B;
        case '-': return A - B;
        case '/': return A / B;
        case '*': return A * B;
        case '=': return A == B;
        case '!=': return A != B;
        case '<': return A < B;
        case '<=': return A <= B;
        case '>': return A > B;
        case '>=': return A >= B;
    }
    throw new ProgrammingError("Unrecognized operator: '" + tokens[1] + "'");
}

/**
 * Removes comments and outside white space from a line of code.
 *
 * @param {String} lineOfCode  The line of code to remove comments+whitespace from
 * @return {String}  The trimmed line of code
 */
function trimComments(lineOfCode) {
    return $.trim(lineOfCode.split('#')[0]);
}

function checkParams(expected, params) {
    if (expected == params.length) {
        return;
    }
    throw new ProgrammingError("Expected " + expected + " parameter(s) but found " + params.length + ": " + params.join(','));
}
