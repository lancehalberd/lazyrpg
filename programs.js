var defaultPrograms = {
    'findVillage': {
        'name': 'findVillage',
        'description': 'This sample program moves you from the shore to the village and rests there.',
        'text': "move forest\nmove village\nrest"
    },
    'faq': {
        'name': 'viewFAQ',
        'description': 'Running this code will open a FAQ for this game in a new window.',
        'text': "popupWindow 'manual.html'"
    },
    'chat': {
        'name': 'chat',
        'description': 'Running this code will open a chat window where you may be able to chat with other players or developers.',
        'text': "popupWindow 'http://tlk.io/lazyrpg'"
    },
    'toggleToolTips': {
        'name': 'toggleHints',
        'description': 'Enables or disables tool tips.',
        'text': "toggleHints"
    },
    'optimizeArmor': {
        'name': 'equipBestArmor',
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
function setupProgrammingWindow() {
    $('.js-runProgram').on('click', function (){
        if (player.executionContext.running) {
            player.executionContext.reset();
        } else {
            var program = $('.js-programText').val();
            if (program.length) {
                //this is needed in case the program calls itself directly or otherwise
                applyChangesToCurrentProgram();
                player.executionContext.runProgram(program);
            }
        }
        updateProgramButtons();
    });
    $('.js-recordProgram').on('click', function (){
        player.executionContext.reset();
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

function updateProgramButtons() {
    $('.js-changeSpeed').text("Speed x" + player.gameSpeed).attr('helpText', 'Click to change game speed');
    if ($('.js-programContainer').is('.open')) {
        $('.js-editProgram').text('Close').attr('helpText', 'Click to close the program panel');
    } else {
        $('.js-editProgram').text('Edit').attr('helpText', 'Click to open the program panel');
    }
    if (player.executionContext.running) {
        $('.js-runProgram').text('Stop').attr('helpText', 'Click to stop running your program');
    } else {
        $('.js-runProgram').text('Run').attr('helpText', 'Click here to run your program');
    }
    if (recording) {
        $('.js-recordProgram').text('Stop').attr('helpText', 'Click to stop recording.');
    } else {
        $('.js-recordProgram').text('Record').attr('helpText', 'Click here to record your actions as a program that you can play back later.');
    }
    $('.js-recordProgram').toggle(!player.executionContext.running);
    $('.js-runProgram').toggle(!recording);
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
