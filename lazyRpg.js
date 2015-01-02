function $div(classes, content) {
    return $('<div></div').attr('class', classes).html(content ? content : '');
}
function $img(source) {
    return $('<img src="gfx/' + source + '" />');
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
var $popup = null;
$(function () {
    $('.js-loadingScene').hide();
    $('.js-titleScene').show();
    $('.js-healthContainer').data('helpFunction', describeHealthBar);
    $('.js-faq').on('click', function () {
        window.open('manual.html', '_blank', 'location=no,scrollbars=yes,width=500,height=400');
    });
    $('.js-chat').on('click', function () {
        window.open('http://tlk.io/lazyrpg', '_blank', 'location=no,scrollbars=yes,width=400,height=600');
    });

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
    $('.js-gameContainer').on('click', '[code]', function (event) {
        runCodeFromUI($(this).attr('code'));
        removeToolTip();
    });
    $('.js-gameContainer').on('mouseover mousemove', '[helpText],[code]', function (event) {
        if (!showTooltips || $popup) {
            return;
        }
        removeToolTip();
        var $currentHelpTarget = $(this);
        var x = event.pageX - $('.js-gameContainer').offset().left;
        var y = event.pageY - $('.js-gameContainer').offset().top;
        //console.log([event.pageX,event.pageY]);
        $popup = $div('toolTip js-toolTip', getHelpText($currentHelpTarget));
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
    stopFighting();
    stopMining();
    stopTraveling();
    removeToolTip();
}

function now() {
    return new Date().getTime();
}
var damageCounterRefresh = 0;
function mainLoop() {
    var deltaTime = 20;
    for (var i = 0; i < player.gameSpeed && (fighting || mining || targetArea); i++) {
        player.time += deltaTime;
        if (player.inventory.items.coolingMagma > 0) {
            items.coolingMagma.timer -= deltaTime;
            if (items.coolingMagma.timer <= 0) {
                var amountLost = Math.ceil(player.inventory.items.coolingMagma / 2);
                player.inventory.items.coolingMagma -= amountLost;
                player.inventory.items.lavaStone += amountLost;
                uiNeedsUpdate.items = true;
                items.coolingMagma.timer = 30000;
            }
        }
        if (currentArea.loop) {
            currentArea.loop(deltaTime);
        }
        if (fighting) {
            scheduleMonsterForUpdate(fighting);
            fightLoop(player.time, deltaTime);
        }
        if (mining) {
            miningLoop(player.time, deltaTime);
        }
        if (targetArea) {
            travelingLoop(player.time, deltaTime);
        }
        uiNeedsUpdate.playerStats = true;
    }
    //show a damage indicator at most once a frame
    if (fighting) {
        damageCounterRefresh--;
        showAccruedDamageOnMonster();
    }
    updateUI();
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
    $.each(uiNeedsUpdate.monsters, function (key, monster) {
        updateMonster(monster);
    });
    uiNeedsUpdate.monsters = {};
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
