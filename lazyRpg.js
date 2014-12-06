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
    $('.js-optimize').on('click', optimizeArmor);
    $('.js-faq').on('click', function () {
        window.open('manual.html', '_blank', 'location=no,scrollbars=yes,width=500,height=400');
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
    $('.js-gameContainer').on('mouseover mousemove', '[helpText]', function (event) {
        if (!showTooltips || $popup) {
            return;
        }
        removeToolTip();
        var $currentHelpTarget = $(this);
        var x = event.pageX - $('.js-gameContainer').offset().left;
        var y = event.pageY - $('.js-gameContainer').offset().top;
        //console.log([event.pageX,event.pageY]);
        $popup = $div('toolTip js-toolTip', $currentHelpTarget.attr('helpText'));
        updateToolTip(x, y, $popup);
        $('.js-gameContainer').append($popup);
    });
    $('.js-gameContainer').on('mouseout', '[helpText]', function (event) {
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
    setupCrafting();
    setupEnchantments();
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
    $('.js-enchantContainer').removeClass('open');
    $('.js-shopContainer').removeClass('open');
    $('.js-inventoryPanel .js-sellActions').hide();
    $('.js-programContainer').removeClass('open');
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
    for (var i = 0; i < gameSpeed && (fighting || mining || targetArea); i++) {
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
        if (fighting) {
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
    'shop': false
};

function updateUI() {
    if (uiNeedsUpdate.playerStats) {
        updatePlayerStats();
        uiNeedsUpdate.playerStats = false;
    }
    if (uiNeedsUpdate.monsterStats) {
        if (fighting) {
            updateMonster(fighting);
        }
        uiNeedsUpdate.monsterStats = false;
    }
    if (uiNeedsUpdate.miningStats) {
        if (mining) {
            updateMineral(mining);
        }
        uiNeedsUpdate.miningStats = false;
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