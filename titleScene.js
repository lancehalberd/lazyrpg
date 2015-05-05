var savedGames;
var saveKey = 'lazyrpg-0.1-savedGames';
function initializeTitleScene() {
    loadData();
    //Update the state of the new game button based on the input field
    $('.js-newGameName').on('keyup change paste', updateNewGameButtons);
    //Create a new save file
    $('.js-startNewGame').on('click', function (event) {
        loadData();
        var newGame = new newGameData();
        newGame.name = $.trim($('.js-newGameName').val());
        $('.js-newGameName').val('');
        updateNewGameButtons();
        savedGames[newGame.name] = newGame;
        saveData();
        refreshSavedGamesDisplayed();
    });
    //Create a new save file
    $('.js-titleScene').on('click', '.js-copyGame', function (event) {
        loadData();
        var $game = $(this).closest('.js-savedGame');
        var newGame = $game.data('game');
        newGame.name = $.trim($('.js-newGameName').val());
        $('.js-newGameName').val('');
        updateNewGameButtons();
        savedGames[newGame.name] = newGame;
        saveData();
        refreshSavedGamesDisplayed();
        removeToolTip();
    });
    //Clicking on a saved game loads the game and sends them to the map
    $('.js-titleScene').on('click', '.js-playGame,.js-gameName', function (event) {
        var $game = $(this).closest('.js-savedGame');
        startGame($game.data('game'));
    });
    $('.js-titleScene').on('click', '.js-resetGame', function (event) {
        var $game = $(this).closest('.js-savedGame');
        //load the game as it is
        applySavedData($game.data('game'));
        //read the programs off of it
        var programs = player.programs;
        //create a new game, give it the same name+programs
        var newGame = new newGameData();
        newGame.name = player.name;
        newGame.programs = programs;
        //replace the old game with the new one
        $game.data('game', newGame)
        //now start the game as normal
        startGame($game.data('game'));
    });
    //Delete a saved game
    $('.js-titleScene').on('click', '.js-deleteGame', function (event) {
        loadData();
        var $game = $(this).closest('.js-savedGame');
        var game = $game.data('game');
        $game.remove();
        delete savedGames[game.name];
        saveData();
        refreshSavedGamesDisplayed();
    });
    refreshSavedGamesDisplayed();
}

function updateNewGameButtons() {
    var name = $.trim($('.js-newGameName').val());
    //name cannot be empty or already in use
    if (name != '' && !savedGames[name]) {
        $('.js-startNewGame').attr('disabled', null);
        $('.js-copyGame').attr('disabled', null);
    } else {
        $('.js-startNewGame').attr('disabled', 'disabled');
        $('.js-copyGame').attr('disabled', 'disabled');
    }
}

function startGame(savedData) {
    resetCharacter();
    //populate data from the saved file
    applySavedData(savedData);
    $('.js-titleScene').hide();
    updateSpecialPrograms();
    refreshPrograms();
    actions.setSpeed([player.gameSpeed]);
    updateProgramButtons();
    setArea(player.area);
    $('.js-mapScene').show();
}

function displaySavedGameOption(game) {
    var $option = $('.js-savedGame').first().clone();
    $option.data('game', game).show().find('.js-gameName').text(game.name);
    $('.js-newGame').before($option);
}

function loadData() {
    $.jStorage.reInit();
    savedGames = $.jStorage.get(saveKey);
    if (!savedGames) {
        savedGames = {};
    }
}

function refreshSavedGamesDisplayed() {
    //refresh the list of saved games in case it is different
    $('.js-savedGame').first().nextAll('.js-savedGame').remove();
    //show initial list of games
    $.each(savedGames, function (index, game) {
        displaySavedGameOption(game);
    });
    updateNewGameButtons();
}

function saveData() {
    $.jStorage.set(saveKey, savedGames);
}

function saveCurrentGame() {
    //the most recent changes to the current program are not stored yet, so
    //apply them before we save the game to avoid losing them
    applyChangesToCurrentProgram();
    player.programs = [];
    $('.js-program').each(function () {
        player.programs.push($(this).data('program'));
    })
    savedGames[player.name] = getSavedData();
    saveData();
}
