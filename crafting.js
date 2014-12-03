actions.craft = function (params, successCallback, errorCallback) {
    checkParams(0, params);
    var craftAction = getAreaAction('craft', null);
    if (!craftAction) {
        throw new ProgrammingError("You cannot craft here.");
    }
    successCallback();
}
actions.enchant = function (params, successCallback, errorCallback) {
    checkParams(0, params);
    var enchantAction = getAreaAction('enchant', null);
    if (!enchantAction) {
        throw new ProgrammingError("You cannot craft enchantments here.");
    }
    successCallback();
}
actions.make = function (params, successCallback, errorCallback) {
    checkParams(1, params);
    var recipeKey = params[0];
    var recipe = allRecipes[recipeKey];
    if (!recipe || (recipe.type == 'crafting' && recipe.level > player.craftingSkill) || (recipe.type == 'enchanting' && recipe.level > player.enchantingSkill)) {
        throw new ProgrammingError("There is no unlocked recipe called '" + recipeKey+"'.");
    }
    if (recipe.type == 'crafting') {
        var craftAction = getAreaAction('craft', null);
        if (!craftAction) {
            throw new ProgrammingError("You cannot craft here.");
        }
    } else if (recipe.type == 'enchanting') {
        var enchantAction = getAreaAction('enchant', null);
        if (!enchantAction) {
            throw new ProgrammingError("You cannot enchant here.");
        }
    }
    if (!canCraft(recipe)) {
        throw new ProgrammingError("You don't have the necessary ingredients to craft '" + recipeKey+"'.");
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
        displyCraftingPage($('.js-craftContainer'), player.craftingSkill, craftingRecipes);
        recordAction(this.actionName, this.actionTarget);
    };
}
function EnchantAction(slot) {
    this.actionName = "enchant";
    this.getDiv = function () {
        return $div('action slot' + slot, $div('box', 'Enchant')).attr('helpText', 'Craft enchantments that can be used later to power up the gear you are wearing. Enchantments are lost when the enchanted item is unequiped or when you rest. Learn more Enchantment skills in the skill tree to unlock new recipes.');
    };
    this.perform = function () {
        displyCraftingPage($('.js-enchantContainer'), player.enchantingSkill, enchantingRecipes);
        recordAction(this.actionName, this.actionTarget);
    };
};

function displyCraftingPage($container, skillLevel, recipeList) {
    closeAll();
    $container.addClass('open');
    $('.js-inventoryContainer').addClass('open');
    $('.js-inventoryPanel').removeClass('selected');
    $('.js-inventoryPanel.js-items').addClass('selected');
    $container.find('.js-body').empty();
    for (var i = 0; i < recipeList.length && i <= skillLevel; i++) {
        $('.js-enchantContainer .js-body').append($div('heading', 'Level ' + i));
        $.each(recipeList[i], function (key, recipe) {
            //{'result': 'fur', 'ingredients': {'furScrap': 5}},
            var item = allItems[recipe.result];
            var $recipe = $container.find('.js-baseRecipe').clone().removeClass('js-baseRecipe').show();
            $recipe.find('.js-result').html(getItemName(item)).attr('helpText', getItemHelpTextWithEnchantments(item));
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
                $ingredient.toggleClass('enoughOwned', amountOwned >= amount);
                canCraft = canCraft && (amountOwned >= amount);
            });
            $recipe.toggleClass('canCraft', canCraft);
            $recipe.data('recipe', recipe);
            $container.find('.js-body').append($recipe);
        });
    }
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
    $('.js-enchantContainer').on('click', '.js-enchant', function () {
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
    uiNeedsUpdate.inventory = true;
    //show the inventory page that the item was added to
    $('.js-inventoryPanel').removeClass('selected');
    $('.js-inventoryPanel.js-' + item.slot).addClass('selected');
    //update buy buttons now that you have less gold
    uiNeedsUpdate.craft = true;
    uiNeedsUpdate.enchant = true;
    recordAction('make', recipe.key);
}

function updateCrafting($container) {
    $container.find('.js-body .js-recipe').each(function () {
        var $recipe = $(this);
        var canCraft = true;
        $recipe.find('.js-ingredient').each(function () {
            var $ingredient = $(this);
            var ingredient = $ingredient.data('ingredient');
            var amount = $ingredient.data('amount');
            var amountOwned = player.inventory[ingredient.slot][ingredient.key];
            canCraft = canCraft && (amountOwned >= amount);
            $ingredient.toggleClass('enoughOwned', amountOwned >= amount);
            $ingredient.find('.js-current').text(amountOwned);
        });
        $recipe.toggleClass('canCraft', canCraft);
    });
}

function canCraft(recipe) {
    if ((recipe.type == 'crafting' && recipe.level > player.craftingSkill) || (recipe.type == 'enchanting' && recipe.level > player.enchantingSkill) ) {
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
