//holds all actions that can be used from a macro
var actions = {};

actions.stop = function (params) {
    checkParams(0, params);
    stopAll();
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

var defaultPrograms = {
    'findVillage': {
        'name': 'Find Village',
        'description': 'This sample program moves you from the shore to the village and rests there.',
        'text': "move forest\nmove village\nrest"
    },
    'faq': {
        'name': 'View FAQ',
        'description': 'Running this code will open a FAQ for this game in a new window.',
        'text': "popupWindow manual.html"
    },
    'chat': {
        'name': 'Chat',
        'description': 'Running this code will open a chat window where you may be able to chat with other players or developers.',
        'text': "popupWindow http://tlk.io/lazyrpg"
    },
    'toggleToolTips': {
        'name': 'Toggle Hints',
        'description': 'Enables or disables tool tips.',
        'text': "toggleHints"
    },
    'optimizeArmor': {
        'name': 'Best Armor',
        'description': 'Running this code will equip you with the strongest armor you have available.',
        'text': "optimizeArmor"
    }
};
var specialPrograms = {};
$.each(defaultPrograms, function (key, program) {
    program.specialFlag = key;
    specialPrograms[key] = program;
});

function updateSpecialPrograms() {
    var programs = player.programs;
    //update any existing special programs the user has.
    for (var i = 0; i < programs.length; i++) {
        if (programs[i].specialFlag) {
            programs[i] = specialPrograms[programs[i].specialFlag];
            if (!programs[i]) {
                programs.splice(i--, 1);
            }
        }
    }
    //make sure the player has all the default programs
    $.each(defaultPrograms, function (key, program) {
        addOrUpdateProgram(player.programs, program);
    });
}
function addOrUpdateProgram(programs, program) {
    for (var i = 0; i < programs.length; i++) {
        if (programs[i].specialFlag == program.specialFlag) {
            return;
        }
    }
    programs.push(program);
}

var recording = false;
var runningProgram = false;
var showTooltips = true;
var callStack = [];
var globalVariables = {};
function setupProgrammingWindow() {
    $('.js-runProgram').on('click', function (){
        if (runningProgram) {
            stopProgram();
        } else {
            var program = $('.js-programText').val();
            if (program.length) {
                runProgram(program);
            }
        }
    });
    $('.js-recordProgram').on('click', function (){
        stopProgram();
        recording = !recording;
        if (!recording) {
            var program = $('.js-programText').val();
            $('.js-programText').val(addLoopsToProgram(program));
        }
        updateProgramButtons();
    });
    $('.js-programContainer').on('mousedown', '.js-program', function (event) {
        applyChangesToCurrentProgram();
        selectProgram($(this));
    });
    $('.js-addProgram').on('click', function (event) {
        var $newProgram = $programButton({'name': 'New Program', 'description': '', 'text': ''});
        $('.js-programs').append($newProgram);
        applyChangesToCurrentProgram();
        selectProgram($newProgram);
    });
    $('.js-programName').on('paste keyup', function () {
        var name = $.trim($('.js-programName').val());
        $('.js-program.selected').data('program').name = name;
        $('.js-program.selected').text(name);
        $('.js-program.selected').attr('programName', name);
        $('.js-program.selected').attr('helpText', getProgramHelpText($('.js-program.selected').data('program')));
    });
    $('.js-programDescription').on('paste keyup', function () {
        var description = $.trim($('.js-programDescription').val());
        $('.js-program.selected').data('program').description = description;
        $('.js-program.selected').attr('helpText', getProgramHelpText($('.js-program.selected').data('program')));
    });
    $('.js-programs').sortable({
        'cancel': '',
        'helper': function (event, element) {
            return $(element).css({'width': $(element).outerWidth() + 'px', 'height': $(element).outerHeight() + 'px'});
        }
    });
    updateProgramButtons();
}

//commits the text of the current program to the selected program
//we don't do this every key stroke for performance, but this needs to be called
//when:
//the user selects a different program
//the user creates a new program
//the user saves the game
function applyChangesToCurrentProgram() {
    var currentProgram = $('.js-program.selected').data('program');
    currentProgram.text = $('.js-programText').val();
}
function refreshPrograms() {
    $('.js-program').remove();
    $.each(player.programs, function (index, program) {
        $('.js-programs').append($programButton(program));
    });
    selectProgram($('.js-program').first());
}

function $programButton(program) {
    return $('<button class="js-program program programButton" helpText="'+ getProgramHelpText(program) + '" programName="' + program.name + '">' + program.name + '</button>').data('program', program);
}

function selectProgram($program) {
    $('.js-program').removeClass('selected');
    $program.addClass('selected');
    var program = $program.data('program');
    $('.js-programName').val(program.name);
    $('.js-programDescription').val(program.description);
    $('.js-programText').val(program.text);
    if (program.specialFlag) {
        $('.js-programName, .js-programDescription, .js-programText').attr('disabled', 'disabled');
        $('.js-programName').closest('div').attr('helptext', 'This is a special program that cannot be edited. You can copy the text into a new program instead.');
        $('.js-programDescription').closest('div').attr('helptext', 'This is a special program that cannot be edited. You can copy the text into a new program instead.');
    } else {
        $('.js-programName, .js-programDescription, .js-programText').removeAttr('disabled', 'disabled');
        $('.js-programName').closest('div').removeAttr('helptext');
        $('.js-programDescription').closest('div').removeAttr('helptext');
    }
}

function getProgramHelpText(program) {
    return (program.description ? program.description : 'This program has no description.') + '<br/><br/>Select this program to edit or run it. <br/><br/>Click and drag to arrange programs.'
}

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
}

function updateProgramButtons() {
    $('.js-changeSpeed').text("Speed x" + player.gameSpeed).attr('helpText', 'Click to change game speed');
    if ($('.js-programContainer').is('.open')) {
        $('.js-editProgram').text('Close').attr('helpText', 'Click to close the program panel');
    } else {
        $('.js-editProgram').text('Edit').attr('helpText', 'Click to open the program panel');
    }
    if (runningProgram) {
        $('.js-runProgram').text('Stop').attr('helpText', 'Click to stop running your program');
    } else {
        $('.js-runProgram').text('Run').attr('helpText', 'Click here to run your program');
    }
    if (recording) {
        $('.js-recordProgram').text('Stop').attr('helpText', 'Click to stop recording.');
    } else {
        $('.js-recordProgram').text('Record').attr('helpText', 'Click here to record your actions as a program that you can play back later.');
    }
    $('.js-recordProgram').toggle(!runningProgram);
    $('.js-runProgram').toggle(!recording);
}

function runProgram(program) {
    //this is needed in case the program calls itself directly or otherwise
    applyChangesToCurrentProgram();
    runningProgram = true;
    updateProgramButtons();
    callStack = [];
    globalVariables = {};
    runMethod(program);
    runNextLine();
}
function stopProgram() {
    callStack = [];
    globalVariables = {};
    runningProgram = false;
    updateProgramButtons();
}
function runMethod(program) {
    if (callStack.length >= 100) {
        onActionError("Too much recursion, cannot nest more than 100 programs.");
        return;
    }
    callStack.push({
        lines: program.split("\n"),
        currentLine: 0,
        loopStack: [],
        variables: {}
    });
}
function stopMethod() {
    callStack.pop();
    if (!callStack.length) {
        stopProgram();
    }
}
function recordAction(action) {
    if (!recording) {
        return;
    }
    var program = $('.js-programText').val();
    var lines = program.length ? program.split("\n") : [];
    if (action === 'stop') {
        lines.pop();
    } else {
        lines.push(action);
    }
    $('.js-programText').val(lines.join("\n"));
}
function moveToClosingBracket(functionContext) {
    //assuming we are starting on the line after the bracket opened
    var bracketDepth = 1;
    var currentLineNumber = functionContext.currentLine;
    while (currentLineNumber < functionContext.lines.length) {
        var currentLine = trimComments(functionContext.lines[currentLineNumber]);
        if (currentLine.indexOf('}') >= 0) {
            bracketDepth--;
            if (bracketDepth <= 0) {
                functionContext.currentLine = currentLineNumber + 1;
                return;
            }
        }
        if (currentLine.indexOf('{') >= 0 ) {
            bracketDepth++;
        }
        currentLineNumber++
    }
    onActionError("Mismatched brackets, found more '{' than '}'");
}

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
function runNextLine() {
    for (var i = 0; i < player.gameSpeed; i++) {
        if (!runningProgram || callStack.length == 0) {
            return;
        }
        //If we are waiting for a process to complete (fighting, traveling, mining)
        //Pause for 20 ms and then try again.
        if (fighting || targetArea || mining) {
            setTimeout(runNextLine, 20);
            return;
        }
        var functionContext = callStack[callStack.length - 1];
        if (functionContext.currentLine >= functionContext.lines.length) {
            if (functionContext.loopStack.length) {
                onActionError("Expected end of loop '}' but reached end of program");
                return;
            }
            stopMethod();
            continue;
        }
        //skip over empty lines and lines containing only comments
        if (!trimComments(functionContext.lines[functionContext.currentLine]).length) {
            functionContext.currentLine++;
            continue;
        }
        var currentLine = trimComments(functionContext.lines[functionContext.currentLine]);
        functionContext.currentLine++;
        try {
            runLine(currentLine);
        } catch(e) {
            if (e instanceof ProgrammingError) {
                onActionError(e.message);
            } else {
                console.log(e.stack);
                throw e;
            }
        }
    }
    setTimeout(runNextLine, 20);
}

function runLine(currentLine) {
    var functionContext = callStack.length ? callStack[callStack.length - 1] : null;
    var tokens = tokenize(currentLine);
    var action = tokens.shift();
    if (action.charAt(0) === '$' || action.charAt(0) === '@') {
        if (tokens.length != 2 || tokens[0] != '=') {
            throw new ProgrammingError('Assignment statments must be of the form "$variable = expression" or "@variable = expression".');
        }
        var variableName = $.trim(action.substring(1));
        var value = evaluateExpression(tokens[1])
        if (action.charAt(0) === '$') {
            globalVariables[variableName] = value;
        } else {
            functionContext.variables[variableName] = value;
        }
        return;
    }
    if (action == "runProgram") {
        if (tokens.length != 1) {
            throw new ProgrammingError('Expected exactly 1 parameter, found: ' + tokens.length);
        }
        var programName = evaluateExpression(tokens[0]);
        var $element = $('.js-program[programName="' + programName +'"]');
        if (!$element.length) {
            throw new ProgrammingError('You have no program named "' + programName +'".');
        }
        if ($element.length > 1) {
            throw new ProgrammingError('You have multiple programs named "' + programName +'".');
        }
        var program = $element.data('program');
        runMethod(program.text);
        return;
    }
    if (action == "try") {
        if (tokens.length != 1 || tokens[0] != '{') {
            throw new ProgrammingError("a try block must be of the form 'try {'");
        }
        //just add to the context to indicate we are another code block deeper
        functionContext.loopStack.push({'startingLine': functionContext.currentLine, 'isTryBlock': true, 'loops': 1});
        return;
    }
    if (action == "if") {
        if (tokens.length != 2 || tokens[1] != '{') {
            throw new ProgrammingError("if block must be of the form 'if expression {'");
        }
        var condition = tokens[0];
        if (evaluateExpression(condition)) {
            //just add to the context to indicate we are another code block deeper
            functionContext.loopStack.push({'startingLine': functionContext.currentLine, 'isIfBlock': true, 'loops': 1});
            return;
        } else {
            moveToClosingBracket(functionContext);
            var closingLine = trimComments(functionContext.lines[functionContext.currentLine - 1]);
            if (closingLine == '} else {') {
                functionContext.loopStack.push({'startingLine': functionContext.currentLine, 'loops': 1});
            }
            return;
        }
    }
    if (action == "while") {
        if (tokens.length != 2 || tokens[1] != '{') {
            throw new ProgrammingError("while loop must be of the form 'while expression {'");
        }
        var condition = tokens[0];
        if (evaluateExpression(condition)) {
            functionContext.loopStack.push({'startingLine': functionContext.currentLine, 'condition': condition});
            return;
        } else {
            moveToClosingBracket(functionContext);
            return;
        }
    }
    if (action == "loop") {
        if (tokens.length != 2 || tokens[1] != '{') {
            throw new ProgrammingError("Loops must be of the form 'loop expression {'");
        }
        var amount = evaluateExpression(tokens[0]);
        if (isNaN(amount) || amount < 1) {
            throw new ProgrammingError("Loop number must be a value 1 or greater, but found value: " + amount);
        }
        functionContext.loopStack.push({'startingLine': functionContext.currentLine, 'loops': amount});
        return;
    }
    if (action == '}') {
        if (!functionContext.loopStack.length) {
            throw new ProgrammingError("Found '}' with no matching '{'");
        }
        if (tokens.length == 0) {
            var loopDetails = functionContext.loopStack[functionContext.loopStack.length - 1];
            if (loopDetails.condition) {
                //while loop
                if (!evaluateExpression(loopDetails.condition)) {
                    functionContext.loopStack.pop();
                } else {
                    functionContext.currentLine = loopDetails.startingLine;
                }
            } else {
                //basic loop
                loopDetails.loops--;
                if (!loopDetails.loops) {
                    functionContext.loopStack.pop();
                } else {
                    functionContext.currentLine = loopDetails.startingLine;
                }
            }
            return;
        }
        //if not just a '}' it is either a '} else {' or  '} catch {' line
        if (tokens.length > 2 || tokens[1] != '{' || (tokens[0] != 'else' && tokens[0] != 'catch')) {
            throw new ProgrammingError("'}' must appear on a line by itself or as part of either '} else {' or '} catch {'");
        }
        if (tokens[0] == 'catch') {
            var tryBlockData = functionContext.loopStack.pop();
            if (!tryBlockData.isTryBlock) {
                throw new ProgrammingError("Found '} catch {' with no matching 'try {'");
            }
            //if we read the catch line, that means we finished the try block
            //with no errors, so we should skip it.
            moveToClosingBracket(functionContext);
            return;
        }
        if (tokens[0] == 'else') {
            var ifBlockData = functionContext.loopStack.pop();
            if (!ifBlockData.isIfBlock) {
                throw new ProgrammingError("Found '} catch {' with no matching 'if expression {'");
            }
            //if we read the else line, that means we were in the if body so we
            //should skip the else body
            moveToClosingBracket(functionContext);
            return;
        }
    }
    var actionMethod = placeActions[action] ? placeActions[action] : actions[action];
    if (!actionMethod) {
        throw new ProgrammingError("uknown action '" + action+ "'");
    }
    //evaluate all expressions before sending them to the action
    //console.log("before: " + JSON.stringify(tokens));
    for (var i = 0; i < tokens.length; i++) {
        tokens[i] = evaluateExpression(tokens[i]);
    }
    //console.log("after: " + JSON.stringify(tokens));
    actionMethod(tokens);
}

function getGlobalVariable(name) {
    if (typeof globalVariables[name] != 'undefined') {
        return globalVariables[name];
    }
    return 0;
}
function getLocalVariable(name) {
    var stackIndex = callStack.length - 1;
    while (stackIndex >= 0) {
        if (typeof callStack[stackIndex].variables[name] != 'undefined') {
            return callStack[stackIndex].variables[name];
        }
        stackIndex--;
    }
    return 0;
}
function getMyStat(parts) {
    //parts[0] is either my, or the variable set to 'my'
    switch (parts[1]) {
        case 'health':
        case 'currentHealth': return player.health;
        case 'maxHealth': return player.getMaxHealth();
        case 'level': return player.level;
        case 'gold': return player.gold;
        case 'area': return player.area;
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
function getMonsterStat(monster, parts) {
    switch (parts[1]) {
        case 'health':
        case 'maxHealth': return monster.health;
        case 'damage': return monster.damage;
        case 'attackSpeed': return monster.attackSpeed;
        case 'armor': return monster.armor;
        case 'level': return monster.level;
        case 'experience': return monster.experience;
        default:
            throw new ProgrammingError("Invalid expression: '" + expression + "'.");
    }
}
function runOperation(leftExpression, operator, rightExpression) {
    var A = evaluateExpression(leftExpression);
    var B = evaluateExpression(rightExpression);
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
function evaluateExpression(expression) {
    expression = $.trim(expression);
    if (expression.charAt(0) == '(') {
        var parts = tokenize(expression.substring(1, expression.length - 1));
        if (parts.length == 1) {
            return evaluateExpression(parts[0]);
        }
        if (parts.length == 3) {
            return runOperation(parts[0], parts[1], parts[2]);
        }
        throw new ProgrammingError("Invalid expression: '" + expression + "'.");
    }
    if (expression.charAt(0) == '$' || expression.charAt(0) == '@') {
        var variableName = expression.substring(1);
        var parts = variableName.split('.');
        if (parts.length > 0) {
            variableName = parts[0];
        }
        var value = expression.charAt(0) == '$'
            ? getGlobalVariable(variableName)
            : getLocalVariable(variableName);
        //if this is a simple value, just return it
        if (parts.length == 1) {
            return value;
        }
        //otherwise it is a player or monster value, so attempt to read those off
        if (value == 'my') {
            return getMyStat(parts);
        }
        if (monsters[value]) {
            return getMonsterStat(monsters[value], parts);
        }
    }
    //console.log("expression " + expression);
    if (expression.indexOf('.') >= 0) {
        parts = expression.split('.');
        if (parts[0] == 'my') {
            return getMyStat(parts);
        }
        var monster = monsters[parts[0]];
        if (monster) {
            return getMonsterStat(monster, parts);
        }
    }
    var number = parseInt(expression);
    if (!isNaN(number)) {
        return number;
    }
    //just assume the expression is a string otherwise
    return expression;
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

function onActionError(errorMessage) {
    var currentFunctionContext = callStack[callStack.length - 1];
    //check the current call stack for any try blocks. If any are found
    //we proceed to the end of that block and continue execution
    while (callStack.length) {
        var functionContext = callStack.pop();
        while (functionContext.loopStack.length) {
            var blockDetails = functionContext.loopStack.pop();
            if (blockDetails.isTryBlock) {
                functionContext.currentLine = blockDetails.startingLine;
                moveToClosingBracket(functionContext);
                var closingLine = trimComments(functionContext.lines[functionContext.currentLine - 1]);
                if (closingLine == '} catch {') {
                    functionContext.loopStack.push({'startingLine': functionContext.currentLine, 'loops': 1});
                }
                callStack.push(functionContext);
                runNextLine();
                return;
            }
        }
    }
    stopProgram();
    if (currentFunctionContext) {
        alert('error on line ' + currentFunctionContext.currentLine + " (" + currentFunctionContext.lines[currentFunctionContext.currentLine - 1] + "): " + errorMessage);
    } else {
        alert('programming error caught outside of program context: ' + errorMessage);
    }
}

function checkParams(expected, params) {
    if (expected == params.length) {
        return;
    }
    throw new ProgrammingError("Expected " + expected + " parameter(s) but found " + params.length + ": " + params.join(','));
}

function addLoopsToProgram(program) {
    var lines = program.length ? program.split("\n") : [];
    for (var i = 0; i < lines.length; i++) {
        var line = lines[i];
        var count = 1;
        for (var j = i + 1; j < lines.length; j++) {
            if (lines[j] != line) {
                break;
            }
            count++;
        }
        if (count > 2) {
            lines.splice(i + 2, count - 3);
            lines[i] = 'loop ' + count + ' {';
            lines[i+1] = '  ' + line;
            lines[i+2] = '}';
            i = i + 2;
        }
    }
    return lines.join("\n");
}
