//holds all actions that can be used from a macro
var actions = {};

var lines = [];
var lineNumber = 0;
var timeoutId = -1;
var recording = false;
var runningProgram = false;
var gameSpeed = 1;
var showTooltips = true;
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
        if (gameSpeed < 1 || gameSpeed >= 30) {
            setSpeed(1);
        } else if (gameSpeed < 2) {
            setSpeed(2);
        } else {
            setSpeed(30)
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
        var name = $('.js-programName').val();
        $('.js-program.selected').data('program').name = name;
        $('.js-program.selected').text(name);
    });
    $('.js-programDescription').on('paste keyup', function () {
        var description = $.trim($('.js-programDescription').val());
        $('.js-program.selected').data('program').description = description;
        $('.js-program.selected').attr('helpText', (description ? description : 'This program has no description.') + '<br/><br/>Select this program to edit or run it.');
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
        $('.js-programs').append($('<button class="js-program program programButton" helpText="' + getProgramHelpText(program) + '">' + program.name + '</button>').data('program', program));
    });
    selectProgram($('.js-program').first());
}

function $programButton(program) {
    return $('<button class="js-program program programButton" helpText="'+ getProgramHelpText(program) + '">' + program.name + '</button>').data('program', program);
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
    var speed = params[0];
    if (speed < 1) {
        throw new ProgrammingError("Speed cannot be less than 1.");
    }
    if (speed > 100) {
        throw new ProgrammingError("Speed cannot be higher than 100");
    }
    setSpeed(speed);
    successCallback();
}

function setSpeed(speed) {
    if (speed < 1 || speed > 100) {
        return;
    }
    gameSpeed = Math.floor(speed);
    updateProgramButtons();
    recordAction("setSpeed " + speed);
}

function updateProgramButtons() {
    $('.js-changeSpeed').text("Speed x" + gameSpeed).attr('helpText', 'Click to change game speed');
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
    lines = program.split("\n");
    loopStack = [];
    lineNumber = 0;
    runningProgram = true;
    runNextLine();
    updateProgramButtons();
}
function stopProgram() {
    if (timeoutId >= 0) {
        clearTimeout(timeoutId);
        timeoutId = -1;
    }
    runningProgram = false;
    updateProgramButtons();
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

function runNextLine() {
    if (lineNumber >= lines.length) {
        if (loopStack.length) {
            onActionError("Expected end of loop '}' but reached end of program");
            return;
        }
        stopProgram();
        return;
    }
    if (!$.trim(lines[lineNumber]).length) {
        lineNumber++;
        runNextLine();
        return;
    }
    var tokens = $.trim(lines[lineNumber]).split(" ");
    lineNumber++;
    var action = tokens.shift();
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
        loopStack.push({'startingLine': lineNumber, 'loops': amount});
        runNextLine();
        return;
    }
    if (action == "}") {
        if (!loopStack.length) {
            onActionError("Found '}' with no matching '{'");
            return;
        }
        var loopDetails = loopStack[loopStack.length - 1];
        loopDetails.loops--;
        if (!loopDetails.loops) {
            loopStack.pop();
        } else {
            lineNumber = loopDetails.startingLine;
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

function onActionSuccess() {
    if (runningProgram) {
        timeoutId = setTimeout(runNextLine, 20);
    }
}

function onActionError(errorMessage) {
    stopProgram();
    alert('error on line ' + lineNumber + " (" + lines[lineNumber - 1] + "): " + errorMessage);
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