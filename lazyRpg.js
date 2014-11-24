function $div(classes, content) {
    return $('<div></div').attr('class', classes).html(content ? content : '');
}
function $img(source) {
    return '<img src="gfx/' + source + '" />';
}
function $window(classes, content) {
    return $div(classes, content)
    .css('display', 'none')
    .css('position', 'absolute')
    .css('overflow', 'hidden')
    .css('left', '0').css('right', '0').css('top', '0').css('bottom', '0')
    .css('background-color', '#fff')
}
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}
//http://stackoverflow.com/questions/783818/how-do-i-create-a-custom-error-in-javascript
function ProgrammingError() {
    var tmp = Error.apply(this, arguments);
    tmp.name = this.name = 'MyError';
    this.stack = tmp.stack;
    this.message = tmp.message;
    return this;
}
var IntermediateInheritor = function() {};
IntermediateInheritor.prototype = Error.prototype;
ProgrammingError.prototype = new IntermediateInheritor();

/**
 * Makes a deep copy of an object. Note that this will not make deep copies of
 * objects with prototypes.
 */
function copy(object) {
    if (typeof(object) == 'undefined' || object === null) {
        return null;
    }
    if (object.constructor == Array) {
        return jQuery.extend(true, [], object);
    }
    return jQuery.extend(true, {}, object);
}

function timeSpan(value) {
    if (value === null) {
        return iconSpan('clock', '-:--');
    }
    var seconds = value % 60;
    var minutes = ((value - seconds) / 60) % 60;
    var hours = (value - minutes * 60 - seconds) / 3600;
    if (seconds < 10) {
        seconds = "0" + seconds;
    }
    if (hours == 0) {
        return iconSpan('clock', minutes + ":" + seconds);
    }
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    return iconSpan('clock', hours+":"+ minutes+":"+seconds);
}
$(function () {
    $('.js-loadingScene').hide();
    $('.js-titleScene').show();
    $('.js-optimize').on('click', optimizeArmor);
    setupInventory();
    $('.js-characterStats').on('click', function () {
        if ($('.js-characterStatsContainer').is('.open')) {
            closeAll();
        } else {
            closeAll();
            $('.js-characterStatsContainer').toggleClass('open');
        }
    });
    var $popup = null;
    $('.js-gameContainer').on('mouseover mouseout', '[helpText]', function (event) {
        if (!showTooltips) {
            return;
        }
        var $currentHelpTarget = $(this);
        var x = event.pageX - $('.js-gameContainer').offset().left;
        var y = event.pageY - $('.js-gameContainer').offset().top;
        //console.log([event.pageX,event.pageY]);
        $popup = $div('toolTip js-toolTip', $currentHelpTarget.attr('helpText'));
        updateToolTip(x, y, $popup);
        $('.js-gameContainer').append($popup);
    });
    $('.js-gameContainer').on('mouseout', '[helpText]', function (event) {
        var x = event.pageX - $('.js-gameContainer').offset().left;
        var y = event.pageY - $('.js-gameContainer').offset().top;
        removeToolTip();
    });
    $('.js-gameContainer').on('mousemove', function (event) {
        if (!$popup) {
            return;
        }
        var x = event.pageX - $('.js-gameContainer').offset().left;
        var y = event.pageY - $('.js-gameContainer').offset().top;
        updateToolTip(x, y, $popup);
    });
    setInterval(mainLoop, 20);
    initializeTitleScene();
    initializeSkillTree();
    resetCharacter();
    updateSkillTree();
    refreshAllInventoryPanels();
    setupCrafting();
    setupProgrammingWindow();
    $('body').append('<style type="text/css" >.icon { background-image: url("gfx/iconSet.png");}</style>');
});

function removeToolTip() {
    $('.js-toolTip').remove();
    $popup = null;
}

function updateToolTip(x, y, $popup) {
    var top = y + 10;
    if (top + $popup.outerHeight() >= 600) {
        top = y - 10 - $popup.outerHeight();
    }
    var left = x + 10;
    if (left + $popup.outerWidth() >= 800) {
        left = x - 10 - $popup.outerWidth();
    }
    $popup.css('left', left + "px").css('top', top + "px");
}

function closeAll() {
    $('.js-characterStatsContainer').removeClass('open');
    $('.js-inventoryContainer').removeClass('open');
    $('.js-craftContainer').removeClass('open');
    $('.js-shopContainer').removeClass('open');
    $('.js-inventoryPanel .js-sellActions').hide();
    $('.js-programContainer').removeClass('open');
    stopFighting();
    stopMining();
    removeToolTip();
}

function now() {
    return new Date().getTime();
}
var lastTime = 0;
function mainLoop() {
    if (!lastTime) {
        lastTime = now();
    }
    var currentTime = now();
    var deltaTime = currentTime - lastTime;
    var mineral = mining;
    for (var i = 0; i < gameSpeed; i++) {
        if (fighting) {
            fightLoop(currentTime, deltaTime);
            player.time += deltaTime;
        }
        if (mining) {
            miningLoop(currentTime, deltaTime);
            player.time += deltaTime;
        }
    }
    if (mineral) {
        updateMineral(mineral);
        updatePlayerStats();
    }
    lastTime = now();
}
