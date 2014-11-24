

var recipes = [
{
    'fur': {'result': 'fur', 'ingredients': {'furScrap': 5}},
    'fur2': {'result': 'fur', 'ingredients': {'smallPelt': 2}},
    'shellPlating': {'result': 'shellPlating', 'ingredients': {'brokenShell': 10}},
    'shellPlating2': {'result': 'shellPlating', 'ingredients': {'smallShell': 5}},
    'furCoat': {'result': 'furCoat', 'ingredients': {'fur': 5}},
    'copperIngot': {'result': 'copperIngot', 'ingredients': {'copperOre': 10}},
    'leather': {'result': 'leather', 'ingredients': {'smallPelt': 5}},
    'leather2': {'result': 'leather', 'ingredients': {'largePelt': 2}},
    'leatherGloves': {'result': 'leatherGloves', 'ingredients': {'leather': 6}},
    'leatherBoots': {'result': 'leatherBoots', 'ingredients': {'leather': 5}},
    'shellHat': {'result': 'shellHat', 'ingredients': {'shellPlating': 5}},
    'brassKnuckles': {'result': 'brassKnuckles', 'ingredients': {'copperIngot': 2}},
    'copperSword': {'result': 'copperSword', 'ingredients': {'copperIngot': 5}},
    'copperGreaves': {'result': 'copperGreaves', 'ingredients': {'copperIngot': 5, 'leatherBoots': 1, 'fur': 2}},
    'proudHat': {'result': 'proudHat', 'ingredients': {'shellHat': 1, 'lionsMane': 1, 'largePelt': 3}}
},{
    'mediumPotion': {'result': 'mediumPotion','ingredients': {'smallPotion': 3}},
    'bronzePlating': {'result': 'bronzePlating','ingredients': {'copperOre': 40, 'tin': 5}},
    'bronzeArmor': {'result': 'bronzeArmor','ingredients': {'bronzePlating': 20, 'leather': 5}},
    'bronzeHelmet': {'result': 'bronzeHelmet', 'ingredients': {'bronzePlating': 5, 'copperIngot': 5, 'leather': 3}},
    'bronzeLeggings': {'result': 'bronzeLeggings', 'ingredients': {'bronzePlating': 5, 'leather': 2}},
    'longSword': {'result': 'longSword', 'ingredients': {'copperOre': 100, 'tin': 12}},
    'ironIngot': {'result': 'ironIngot', 'ingredients': {'ironOre': 10}},
    'chainMail': {'result': 'chainMail','ingredients': {'ironIngot': 10}},
    'ironBoots': {'result': 'ironBoots', 'ingredients': {'ironIngot': 10, 'leather': 3}},
    'plateArmor': {'result': 'plateArmor', 'ingredients': {'ironIngot': 50, 'leather': 5}},
    'fullHelm': {'result': 'fullHelm', 'ingredients': {'ironIngot': 30, 'leather': 5}},
    'broadSword': {'result': 'longSword', 'ingredients': {'ironIngot': 30}},
    'hammer': {'result': 'hammer', 'ingredients': {'timber': 5, 'ironIngot': 10}},
    'longBow': {'result': 'longBow', 'ingredients': {'suppleTimber': 10, 'ironIngot': 5}},
},{
    'steelPlating': {'result': 'steelPlating', 'ingredients': {'ironOre': 20, 'charcoal': 10}},
    'steelArmor': {'result': 'steelArmor', 'ingredients': {'steelPlating': 20, 'leather': 5}},
    'steelHelmet': {'result': 'steelHelmet', 'ingredients': {'steelPlating': 5, 'ironIngot': 5, 'leather': 3}},
    'steelLeggings': {'result': 'steelLeggings', 'ingredients': {'steelPlating': 5, 'leather': 5}},
    'claymore': {'result': 'claymore', 'ingredients': {'steelPlating': 5, 'copperOre': 40, 'tin': 5}},
    'mace': {'result': 'mace', 'ingredients': {'ironOre': 100, 'charcoal': 30}},
    'compositeBow': {'result': 'compositeBow', 'ingredients': {'suppleTimber': 3, 'sturdyTimber': 3, 'ironOre': 10, 'charcoal': 5}},
    'silverIngot': {'result': 'silverIngot', 'ingredients': {'silverOre': 10}},
    'steeledSilver': {'result': 'steeledSilver', 'ingredients': {'silverOre': 10, 'ironOre': 4, 'charcoal': 1}},
    'cestus': {'result': 'cestus', 'ingredients': {'leatherGloves': 1, 'steelPlating': 2, 'steeledSilver': 1}},
    'silverSword': {'result': 'silverSword', 'ingredients': {'steeledSilver': 5, 'copperOre': 40, 'tin': 5}},
    'silk': {'result': 'silk', 'ingredients': {'strongWeb': 10}},
    'ninjaTabi': {'result': 'ninjaTabi', 'ingredients': {'leather': 5, 'silk': 3}},
},{
    'mithrilSilver': {'result': 'mithrilSilver', 'ingredients': {'silverOre': 40, 'ironOre': 8, 'charcoal': 2, 'copperOre': 4, 'tin': 1}}
}];

//populate allRecipes, and key/level on each recipe
var allRecipes = {};
recipes.forEach(function (recipeLevelList, level) {
    $.each(recipeLevelList, function (key, recipe) {
        recipe.key = key;
        recipe.level = level;
        allRecipes[key] = recipe;
    });
});

actions.craft = function (params, successCallback, errorCallback) {
    if (paramError(0, params, errorCallback)) return;
    var craftAction = getAreaAction('craft', null);
    if (!craftAction) {
        errorCallback("You cannot craft here.");
        return;
    }
    successCallback();
}
actions.make = function (params, successCallback, errorCallback) {
    if (paramError(1, params, errorCallback)) return;
    var craftAction = getAreaAction('craft', null);
    if (!craftAction) {
        errorCallback("You cannot craft here.");
        return;
    }
    var recipeKey = params[0];
    var recipe = allRecipes[recipeKey];
    if (!recipe || recipe.level > player.craftingSkill) {
        errorCallback("There is no unlocked recipe called '" + recipeKey+"'.");
        return;
    }
    if (!canCraft(recipe)) {
        errorCallback("You don't have the necessary ingredients to craft '" + recipeKey+"'.");
        return;
    }
    craftRecipe(recipe);
    successCallback();
}

function CraftAction(slot) {
    this.actionName = "craft";
    this.getDiv = function () {
        return $div('action slot' + slot, $div('box', 'Craft')).attr('helpText', 'Craft items from the ingredients you have bought or collected. Learn more Craft skills in the skill tree to unlock new recipes.');
    };
    this.perform = function () {
        closeAll();
        $('.js-craftContainer').addClass('open');
        $('.js-inventoryContainer').addClass('open');
        $('.js-inventoryPanel').removeClass('selected');
        $('.js-inventoryPanel.js-items').addClass('selected');
        $('.js-craftContainer .js-body').empty();
        for (var i = 0; i < recipes.length && i <= player.craftingSkill; i++) {
            $('.js-craftContainer .js-body').append($div('heading', 'Level ' + i));
            $.each(recipes[i], function (key, recipe) {
                //{'result': 'fur', 'ingredients': {'furScrap': 5}},
                var item = allItems[recipe.result];
                var $recipe = $('.js-baseRecipe').clone().removeClass('js-baseRecipe').show();
                $recipe.find('.js-result').html(getItemName(item));
                var canCraft = true;
                var $ingredient = $recipe.find('.js-ingredient').remove();
                $.each(recipe.ingredients, function (key, amount) {
                    amount = ingredientAmount(amount);
                    $ingredient = $ingredient.clone();
                    var ingredient = allItems[key];
                    var amountOwned = player.inventory[ingredient.slot][key];
                    $ingredient.find('.js-current').text(amountOwned);
                    $ingredient.find('.js-cost').text(amount);
                    $ingredient.find('.js-name').html(getItemName(ingredient));
                    $ingredient.data('ingredient', ingredient);
                    $ingredient.data('amount', amount);
                    $recipe.append($ingredient);
                    canCraft = canCraft && (amountOwned >= amount);
                });
                $recipe.toggleClass('canCraft', canCraft);
                $recipe.data('recipe', recipe);
                $('.js-craftContainer .js-body').append($recipe);
            });
        }
        recordAction(this.actionName, this.actionTarget);
    };
}

function ingredientAmount(baseAmount) {
    //the 'care' skill reduces crafting costs by 25%
    return Math.max(1, Math.round(baseAmount * (player.specialSkills.care ? .75 : 1)));
}

function setupCrafting() {
    $('.js-craftContainer').on('click', '.js-craft', function () {
        //get the amount to make sure it can be sold
        var recipe = $(this).closest('.js-recipe').data('recipe');
        craftRecipe(recipe);
    });
}

function craftRecipe(recipe) {
    if (!canCraft(recipe)) {
        return;
    }
    var item = allItems[recipe.result];
    player.inventory[item.slot][item.key]++;
    //copy duplicates items you craft
    if (player.specialSkills.copy) {
        player.inventory[item.slot][item.key]++;
    }
    $.each(recipe.ingredients, function (key, amount) {
        amount = ingredientAmount(amount);
        var ingredient = allItems[key];
        player.inventory[ingredient.slot][ingredient.key] -= amount;
    });
    refreshAllInventoryPanels();
    //show the inventory page that the item was added to
    $('.js-inventoryPanel').removeClass('selected');
    $('.js-inventoryPanel.js-' + item.slot).addClass('selected');
    //update buy buttons now that you have less gold
    updateCrafting();
    recordAction('make', recipe.key);
}

function updateCrafting() {
    $('.js-craftContainer .js-body .js-recipe').each(function () {
        var $recipe = $(this);
        var canCraft = true;
        $recipe.find('.js-ingredient').each(function () {
            var $ingredient = $(this);
            var ingredient = $ingredient.data('ingredient');
            var amount = $ingredient.data('amount');
            var amountOwned = player.inventory[ingredient.slot][ingredient.key];
            canCraft = canCraft && (amountOwned >= amount);
            $ingredient.find('.js-current').text(amountOwned);
        });
        $recipe.toggleClass('canCraft', canCraft);
    });
}

function canCraft(recipe) {
    if (recipe.level > player.craftingSkill) {
        return false;
    }
    var canCraft = true;
    $.each(recipe.ingredients, function (key, amount) {
        amount = ingredientAmount(amount);
        var ingredient = allItems[key];
        var amountOwned = player.inventory[ingredient.slot][ingredient.key];
        if (amountOwned < amount) {
            canCraft = false;
            return false;
        }
        return true;
    });
    return canCraft;
}
