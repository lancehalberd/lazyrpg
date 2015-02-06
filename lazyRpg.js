function $div(classes, content) {
    return $('<div></div').attr('class', classes).html(content ? content : '');
}
function $img(source) {
    return $('<img src="gfx/' + source + '" />');
}
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}
/**
 * A service for utility methods involving randomness. Can be created with a prng
 * to make the results random but deterministic.
 *
 * @param {Function} rng  An object with a .random() method for generating numbers
 *     in the range [0, 1)
 */
function RandomService(random) {
    /** @type Function */
    this.random = random ? random : Math.random;

    /**
     * @param {Number} min  The smallest returned value
     * @param {Number} max  The largest returned value
     * @return {Number}  a number in the range [min, max]
     */
    this.range = function (min, max) {
        return Math.floor(this.random() * (max + 1 - min)) + min;
    };

    /**
     * @param {Array}  (or object) the collection to get a random element from
     * @return {*}  A randomly chosen element from the collection
     */
    this.element = function (collection) {
        if (collection.constructor == Object) {
            var keys = Object.keys(collection);
            return collection[this.element(keys)];
        }
        if (collection.constructor == Array) {
            return collection[this.range(0, collection.length - 1)];
        }
        console.log("Warning @ Random.element: "+ collection + " is neither Array or Object");
        return null;
    }
}
var random = new RandomService(Math.random);
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
    if (object.constructor == Object) {
        return jQuery.extend(true, [], object);
    }
    return object;
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
var $popup = null;
var $popupTarget = null;
var drawing = false;
var drawingPoints = [];
$(function () {
    //disable delete/backspace so users don't accidentally navigate away
    //if they press it when not focused on a textarea/input
    $('body').on('keydown', function (event) {
        if (!$(event.target).closest('textarea, input').length) {
            if (event.which == 8) {
                event.preventDefault();
            }
            if (String.fromCharCode(event.which) == 'S') {
                drawing = !drawing;
                if (drawing) {
                    drawingPoints = [];
                } else {
                    console.log(JSON.stringify(drawingPoints));
                }
                console.log("drawing " + drawing);
            }
        }
    });
    $('body').on('click', '.illustration', function (event) {
        if (!drawing) {
            return;
        }
        var x = event.pageX - $(this).offset().left;
        var y = event.pageY - $(this).offset().top;
        drawingPoints.push(x);
        drawingPoints.push(y);
        console.log(JSON.stringify(drawingPoints));
    });
    $('.js-loadingScene').hide();
    $('.js-titleScene').show();
    $('.js-healthContainer').data('helpFunction', describeHealthBar);

    setupInventory();
    $('.js-characterStats').on('click', function () {
        if ($('.js-characterStatsContainer').is('.open')) {
            closeAll();
        } else {
            closeAll();
            $('.js-characterStatsContainer').toggleClass('open');
        }
    });
    $('.js-closeButton').on('click', closeAll);
    $('.js-gameContainer').on('mousedown', '[code]', function (event) {
        runCodeFromUI($(this).attr('code'));
        removeToolTip();
    });
    $('.js-gameContainer').on('mouseover', '.monster .graphic', function (event) {
        $(this).closest('.monster').addClass('over');
    });
    $('.js-gameContainer').on('mouseout', '.monster .graphic', function (event) {
        $(this).closest('.monster').removeClass('over');
    });
    $('.js-gameContainer').on('mouseover mousemove', '[helpText],[code]', function (event) {
        if (!showTooltips || $popup) {
            return;
        }
        removeToolTip();
        $popupTarget = $(this);
        var x = event.pageX - $('.js-gameContainer').offset().left;
        var y = event.pageY - $('.js-gameContainer').offset().top;
        //console.log([event.pageX,event.pageY]);
        $popup = $div('toolTip js-toolTip', getHelpText($popupTarget));
        updateToolTip(x, y, $popup);
        $('.js-gameContainer').append($popup);
    });
    $('.js-gameContainer').on('mouseout', '[helpText],[code]', function (event) {
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
    setupProgrammingWindow();
});
function getHelpText($element) {
    var sections = [];
    var baseText = $element.attr('helpText');
    if (baseText && baseText.length) {
        sections.push(baseText);
    }
    var helpFunction = $element.data('helpFunction');
    var text = helpFunction ? helpFunction() : '';
    if (text && text.length) {
        sections.push(text);
    }
    var code = $element.attr('code');
    if (code && code.length) {
        sections.push('code: [' + code + ']');
    }
    return sections.join('<br/><br/>');
}
function checkRemoveToolTip() {
    if (!$popupTarget || !$popupTarget.closest('body').length) {
        removeToolTip();
    }
}
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
    $('.js-enchantContainer').removeClass('open');
    $('.js-shopContainer').removeClass('open');
    $('.js-inventoryPanel .js-sellActions').hide();
    removeToolTip();
}
function stopAll() {
    stopTraveling();
    removeToolTip();
}

var uiNeedsUpdate = {
    'playerStats': false,
    'monsterStats': false,
    'miningStats': false,
    'travelingStats': false,
    'inventory': false,
    'items': false,
    'weapon': false,
    'weapons': false,
    'helmet': false,
    'helmets': false,
    'armor': false,
    'armors': false,
    'boots': false,
    'skillTree': false,
    'craft': false,
    'shop': false,
    'monsters': {}
};

function updateUI() {
    if (uiNeedsUpdate.playerStats) {
        updatePlayerStats();
        uiNeedsUpdate.playerStats = false;
    }
    if (currentArea) {
        currentArea.agents.forEach(function (agent) {
            if (agent.needsUpdate) {
                agent.update();
            }
        });
    }
    if (uiNeedsUpdate.miningStats) {
        if (mining) {
            updateMineral(mining);
        }
        uiNeedsUpdate.miningStats = false;
    }
    if (uiNeedsUpdate.area) {
        refreshArea();
        uiNeedsUpdate.area = false;
    }
    if (uiNeedsUpdate.travelingStats) {
        updateTravelBar();
        uiNeedsUpdate.travelingStats = false;
    }
    if (uiNeedsUpdate.inventory && $('.js-inventoryContainer').is('.open')) {
        refreshAllInventoryPanels();
        uiNeedsUpdate.inventory = false;
        uiNeedsUpdate.items = false;
        uiNeedsUpdate.weapon = false;
        uiNeedsUpdate.weapons = false;
        uiNeedsUpdate.helmet = false;
        uiNeedsUpdate.helmets = false;
        uiNeedsUpdate.armor = false;
        uiNeedsUpdate.armors = false;
        uiNeedsUpdate.boots = false;
    }
    if (uiNeedsUpdate.items && $('.js-inventoryContainer').is('.open') && $('.js-inventoryPanel.js-items').is('.selected')) {
        refreshInventoryPanel('items');
        uiNeedsUpdate.items = false;
    }
    if ((uiNeedsUpdate.weapon || uiNeedsUpdate.weapons) && $('.js-inventoryContainer').is('.open') && $('.js-inventoryPanel.js-weapons').is('.selected')) {
        refreshInventoryPanel('weapons');
        uiNeedsUpdate.weapon = false;
        uiNeedsUpdate.weapons = false;
    }
    if ((uiNeedsUpdate.helmet || uiNeedsUpdate.helmets)  && $('.js-inventoryContainer').is('.open') && $('.js-inventoryPanel.js-helmets').is('.selected')) {
        refreshInventoryPanel('helmets');
        uiNeedsUpdate.helmet = false;
        uiNeedsUpdate.helmets = false;
    }
    if ((uiNeedsUpdate.armor || uiNeedsUpdate.armors)  && $('.js-inventoryContainer').is('.open') && $('.js-inventoryPanel.js-armors').is('.selected')) {
        refreshInventoryPanel('armors');
        uiNeedsUpdate.armor = false;
        uiNeedsUpdate.armors = false;
    }
    if (uiNeedsUpdate.boots && $('.js-inventoryContainer').is('.open') && $('.js-inventoryPanel.js-boots').is('.selected')) {
        refreshInventoryPanel('boots');
        uiNeedsUpdate.boots = false;
    }
    if (uiNeedsUpdate.skillTree && $('.js-characterStatsContainer').is('.open')) {
        updateSkillTree();
        uiNeedsUpdate.skillTree = false;
    }
    if (uiNeedsUpdate.craft && $('.js-craftContainer').is('.open')) {
        updateCrafting($('.js-craftContainer'));
        uiNeedsUpdate.craft = false;
    }
    if (uiNeedsUpdate.enchant && $('.js-enchantContainer').is('.open')) {
        updateCrafting($('.js-enchantContainer'));
        uiNeedsUpdate.enchant = false;
    }
    if (uiNeedsUpdate.shop && $('.js-shopContainer').is('.open')) {
        updateShop();
        uiNeedsUpdate.shop = false;
    }
}

var currentTrack = "DayFour"
function setMusic(trackName) {
    if (currentTrack === trackName) {
        return;
    }
    currentTrack = trackName;
    $(".js-bgm source").attr('src', 'sound/' + trackName + '.mp3');
    $(".js-bgm")[0].load();
}
