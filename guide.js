function $div(classes, content) {
    return $('<div></div').attr('class', classes).html(content ? content : '');
}
function $img(source) {
    return $('<img src="gfx/' + source + '" />');
}

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

var $popup = null;
$(function () {
    $('.js-gameContainer').on('mouseover mousemove', '[helpText]', function (event) {
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
$(function () {
    var $monsterTemplate = $('.js-monsterSource').remove().clone()
        .removeClass('js-monsterSource').addClass('js-monster');
    $.each(monsters, function (key, monster) {
        var $monster = $monsterTemplate.clone();
        $('.js-monsters').append($monster);
        monster.$element = $monster;
        monster.maxHealth = monster.health;
        monster.damaged = 0;
        monster.battleStatus = freshBattleStatus();
        monster.$element.attr('helpText', monster.$graphic[0].outerHTML);
        $monster.find('.js-name').text("Lvl " + monster.level + " " + monster.name).css('font-weight','bold');
        $monster.find('.js-experience').text(monster.experience);
        var health = monster.health + '<br/>(' + (monster.recover ? monster.recover : 0) + ')'
        $monster.find('.js-currentHealth').html(health);
        $monster.find('.js-damage').text(monster.damage);
        $monster.find('.js-attackSpeed').text(monster.attackSpeeds);
        $monster.find('.js-armor').text(monster.armor);
        var $itemRow = $monster.find('.js-spoils').remove().first();
        for (var i = 0; i < monster.spoils.length; i++) {
            item = monster.spoils[i];
            if (typeof(item) === 'string' && allItems[item]) {
                $itemRow.find('.js-item').text(allItems[item].name);
            } else if (typeof(item) === 'number') {
                $itemRow.find('.js-icon').removeClass('item').addClass('gold');
                $itemRow.find('.js-item').text(item);
            } else {
                $itemRow.find('.js-item').text(typeof(item));
            }
            $monster.find('.js-spoilsContainer').append($itemRow.clone());
        }
        var elements = [];
        ['poison', 'cripple', 'parry', 'lifesteal', 'armorPierce', 'armorBreak'].forEach(function (key) {
            if (monster[key]) {
                elements.push(monster[key] + ' ' + key);
            }
        });
        if (elements.length) {
            $monster.find('.js-extra').append('<span>' + elements.join(', ') + '</span>')
        }
    });
})
uiNeedsUpdate = {};