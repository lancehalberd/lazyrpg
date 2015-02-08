
var numericDisplays = [];
function NumericDisplay(agent, displayClass) {
    this.counter = 0;
    this.updated = false;
    this.amount = 0;
    this.left = agent.left;
    this.top = agent.top;
    this.agent = agent;
    this.displayClass = displayClass;
    numericDisplays.push(this);
}

/**
 * Shows a number on the enemy graphic indicating how much damage has happened
 * since the last time this method has been called (or the start of battle),
 * if the player has hit the monster since then. Damage will show even if 0,
 * although 0 damage may not be possible in the game any longer
 */
function showNumericDisplays() {
    for (var i = 0; i < numericDisplays.length; i++) {
        var numericDisplay = numericDisplays[i];
        if (numericDisplay.counter > 0) {
            numericDisplay.counter--;
            continue;
        }
        if (!numericDisplay.updated) {
            if (!numericDisplay.agent.active) {
                numericDisplays.splice(i--, 1);
            }
            continue;
        }
        //show damage animation only when the game speed is below 30
        var $damage = $('<span class="numericDisplay ' + numericDisplay.displayClass + '">' + numericDisplay.amount + '</span>');
        $damage.css('position', 'absolute').css('top', (numericDisplay.top - 300) + 'px').css('left', (numericDisplay.left - 480) + 'px');
        $('.js-areaOverlay').append($damage);
        $damage.animate({top: "-=50"}, 500,
            function () {
                $damage.remove();
            }
        );
        numericDisplay.counter = 3;
        numericDisplay.updated = false;
        numericDisplay.amount = 0;
    }
}