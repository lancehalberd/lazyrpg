//holds all actions that can be used from a macro
var actions = {};

var lines = [];
var timeoutId = -1;
var recording = false;
var runningProgram = false;
var showTooltips = true;
var callStack = [];
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
    $('.js-changeSpeed').on('click', function () {
        if (player.gameSpeed < 1 || player.gameSpeed >= 500) {
            setSpeed(1);
        } else if (player.gameSpeed < 2) {
            setSpeed(2);
        } else if (player.gameSpeed < 30) {
            setSpeed(30)
        } else if (player.gameSpeed < 100) {
            setSpeed(100)
        } else {
            setSpeed(500)
        }
    });
    $('.js-toggleHelp').on('click', function () {
        showTooltips = !showTooltips;
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
}

function getProgramHelpText(program) {
    return (program.description ? program.description : 'This program has no description.') + '<br/><br/>Select this program to edit or run it. <br/><br/>Click and drag to arrange programs.'
}

actions.setSpeed = function (params, successCallback, errorCallback) {
    checkParams(1, params);
    var speed = parseInt(params[0]);
    if (speed < 1) {
        throw new ProgrammingError("Speed cannot be less than 1.");
    }
    if (speed > 500) {
        throw new ProgrammingError("Speed cannot be higher than 500");
    }
    setSpeed(speed);
    successCallback();
}

function setSpeed(speed) {
    if (speed < 1 || speed > 500) {
        return;
    }
    player.gameSpeed = Math.floor(speed);
    updateProgramButtons();
    recordAction("setSpeed " + speed);
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
    $('.js-toggleHelp').text(showTooltips ? 'Disable Tooltips' : 'Enable Tooltips');
    $('.js-recordProgram').toggle(!runningProgram);
    $('.js-runProgram').toggle(!recording);
}

function runProgram(program) {
    //this is needed in case the program calls itself directly or otherwise
    applyChangesToCurrentProgram();
    runningProgram = true;
    updateProgramButtons();
    runMethod(program);
}
function stopProgram() {
    if (timeoutId >= 0) {
        clearTimeout(timeoutId);
        timeoutId = -1;
    }
    callStack = [];
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
        loopStack: []
    });
    onActionSuccess();
}
function stopMethod() {
    callStack.pop();
    if (callStack.length) {
        onActionSuccess();
    } else {
        stopProgram();
    }
}
function recordAction(name, target) {
    if (!recording) {
        return;
    }
    var program = $('.js-programText').val();
    var lines = program.length ? program.split("\n") : [];
    if (typeof(target) == 'object') {
        target = target.key;
    } else if (!target) {
        target = '';
    }
    lines.push(name + (target ? ' ' + target : ''));
    $('.js-programText').val(lines.join("\n"));
}
function moveToClosingBracket(functionContext) {
    //assuming we are starting on the line after the bracket opened
    var bracketDepth = 1;
    var currentLineNumber = functionContext.currentLine;
    while (currentLineNumber < functionContext.lines.length) {
        var currentLine = $.trim(functionContext.lines[currentLineNumber]);
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
function runNextLine() {
    var functionContext = callStack[callStack.length - 1];
    var lines = functionContext.lines;
    if (functionContext.currentLine >= lines.length) {
        if (functionContext.loopStack.length) {
            onActionError("Expected end of loop '}' but reached end of program");
            return;
        }
        stopMethod();
        return;
    }
    if (!$.trim(lines[functionContext.currentLine]).length) {
        functionContext.currentLine++;
        runNextLine();
        return;
    }
    var currentLine = $.trim(lines[functionContext.currentLine]);
    var tokens = currentLine.split(" ");
    functionContext.currentLine++;
    var action = tokens.shift();
    if (action == "runProgram") {
        var programName = $.trim(currentLine.substring(11));
        var $element = $('.js-program[programName="' + programName +'"]');
        if (!$element.length) {
            onActionError('You have no program named "' + programName +'".');
            return;
        }
        if ($element.length > 1) {
            onActionError('You have multiple programs named "' + programName +'".');
            return;
        }
        var program = $element.data('program');
        runMethod(program.text);
        return;
    }
    if (action == "try") {
        if (currentLine.charAt(currentLine.length - 1) != '{') {
            onActionError("a try block must be of the form 'try {'");
            return;
        }
        //just add to the context to indicate we are another code block deeper
        functionContext.loopStack.push({'startingLine': functionContext.currentLine, 'isTryBlock': true, 'loops': 1});
        runNextLine();
        return;
    }
    if (action == "if") {
        if (currentLine.charAt(currentLine.length - 1) != '{') {
            onActionError("if loop must be of the form 'if condition {'");
            return;
        }
        var condition = $.trim(currentLine.substring(2, currentLine.length - 1));
        if (isConditionTrue(condition)) {
            //just add to the context to indicate we are another code block deeper
            functionContext.loopStack.push({'startingLine': functionContext.currentLine, 'isIfBlock': true, 'loops': 1});
            runNextLine();
            return;
        } else {
            moveToClosingBracket(functionContext);
            var closingLine = $.trim(lines[functionContext.currentLine - 1]);
            if (closingLine == '} else {') {
                functionContext.loopStack.push({'startingLine': functionContext.currentLine, 'loops': 1});
            }
            runNextLine();
            return;
        }
    }
    if (action == "while") {
        if (currentLine.charAt(currentLine.length - 1) != '{') {
            onActionError("while loop must be of the form 'while condition {'");
            return;
        }
        var condition = $.trim(currentLine.substring(5, currentLine.length - 1));
        if (isConditionTrue(condition)) {
            functionContext.loopStack.push({'startingLine': functionContext.currentLine, 'condition': condition});
            runNextLine();
            return;
        } else {
            moveToClosingBracket(functionContext);
            runNextLine();
            return;
        }
    }
    if (action == "loop") {
        var amount = parseInt(tokens[0]);
        if (isNaN(amount) || amount < 1) {
            onActionError("Loops must repeat 1 or more times");
            return
        }
        if (tokens[1] != '{') {
            onActionError("Loops must be of the form 'loop # {'");
            return;
        }
        functionContext.loopStack.push({'startingLine': functionContext.currentLine, 'loops': amount});
        runNextLine();
        return;
    }
    if (currentLine == "} catch {") {
        if (!functionContext.loopStack.length) {
            onActionError("Found '} catch {' with no matching 'try {'");
            return;
        }
        var tryBlockData = functionContext.loopStack.pop();
        if (!tryBlockData.isTryBlock) {
            onActionError("Found '} catch {' with no matching 'try {'");
            return;
        }
        //if we read the catch line, that means we finished the try block
        //with no errors, so we should skip it.
        moveToClosingBracket(functionContext);
        runNextLine();
        return;
    }
    if (currentLine == "} else {") {
        if (!functionContext.loopStack.length) {
            onActionError("Found '} catch {' with no matching 'try {'");
            return;
        }
        var ifBlockData = functionContext.loopStack.pop();
        if (!ifBlockData.isIfBlock) {
            onActionError("Found '} catch {' with no matching 'if condition {'");
            return;
        }
        //if we read the else line, that means we were in the if body so we
        //should skip the else body
        moveToClosingBracket(functionContext);
        runNextLine();
        return;
    }
    if (currentLine == "}") {
        if (!functionContext.loopStack.length) {
            onActionError("Found '}' with no matching '{'");
            return;
        }
        var loopDetails = functionContext.loopStack[functionContext.loopStack.length - 1];
        if (loopDetails.condition) {
            //while loop
            if (!isConditionTrue(loopDetails.condition)) {
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
        runNextLine();
        return;
    }
    if (!actions[action]) {
        onActionError("uknown action '" + action+ "'");
        return;
    }
    try {
        actions[action](tokens, onActionSuccess, onActionError);
    } catch(e) {
        if (e instanceof ProgrammingError) {
            onActionError(e.message);
        } else {
            throw e;
        }
    }
}

function isConditionTrue(condition) {
    //console.log("condition " + condition);
    try {
        var tokens = condition.split(' ');
        if (tokens.length != 3) {
            throw new ProgrammingError("Invalid condition. Conditions must have exactly 3 parts, for instance 'my.health < 200'.");
        }
        var A = evaluateExpression(tokens[0]);
        var B = evaluateExpression(tokens[2]);
        switch (tokens[1]) {
            case '=': return A == B;
            case '!=': return A != B;
            case '<': return A < B;
            case '<=': return A <= B;
            case '>': return A > B;
            case '>=': return A >= B;
        }
        throw new ProgrammingError("Unrecognized comparison operator: '" + tokens[1] + "'");
    } catch(e) {
        if (e instanceof ProgrammingError) {
            onActionError(e.message);
        } else {
            throw e;
        }
    }
    return false;
}
function evaluateExpression(expression) {
    //console.log("expression " + expression);
    if (expression.indexOf('.') >= 0) {
        parts = expression.split('.');
        if (parts[0] == 'my') {
            switch (parts[1]) {
                case 'health':
                case 'currentHealth': return player.health;
                case 'maxHealth': return player.getMaxHealth();
                case 'level': return player.level;
                case 'gold': return player.gold;
                case 'area': return player.area;
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
        var monster = monsters[parts[0]];
        if (monster) {
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
    }
    var number = parseInt(expression);
    if (!isNaN(number)) {
        return number;
    }
    //just assume the expression is a string otherwise
    return expression;
}

function onActionSuccess() {
    if (runningProgram) {
        timeoutId = setTimeout(runNextLine, 20);
    }
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
                var closingLine = $.trim(functionContext.lines[functionContext.currentLine - 1]);
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
    alert('error on line ' + currentFunctionContext.currentLine + " (" + currentFunctionContext.lines[currentFunctionContext.currentLine - 1] + "): " + errorMessage);
}

function checkParams(expected, params, errorCallback) {
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

/*
//make a fur coat
setSpeed 100
loop 3 {
    move forest
    loop 5 {
      loop 3 {
        fight rat
      }
      learn 6 7
      loop 3 {
        fight rat
      }
      move village
      craft
      make fur
      rest
      move forest
    }
    move village
    craft
    make furCoat
}
shop
sell 2 furCoat
buy 1 shortBow
buy 1 club
buy 7 smallPotion
equip furCoat

*/