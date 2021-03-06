function makeItem(params) {
    checkParams(1, params);
    var recipeKey = params[0];
    var recipe = availableRecipes[recipeKey];
    checkForCraftingErrors(recipe, recipeKey);
    craftRecipe(recipe);
}

function checkForCraftingErrors(recipe, key) {
    if (!recipe) {
        throw new ProgrammingError("There is no unlocked recipe called '" + key + "'.");
    }
    if (recipe.type == 'crafting' && recipe.level > player.craftingSkill) {
        throw new ProgrammingError("Your crafting skill must be higher to make '" + key + "'.");
    }
    if (recipe.type == 'enchanting' && recipe.level > player.enchantingSkill) {
        throw new ProgrammingError("Your imbuing skill must be higher to make '" + key + "'.");
    }
    if (recipe.type == 'crafting' && !placeActions.craft) {
        throw new ProgrammingError("You cannot craft here.");
    } else if (recipe.type == 'enchanting' && !placeActions.enchant) {
        throw new ProgrammingError("You cannot conjure enchantments here.");
    }
    if (!playerHasIngredientsFor(recipe)) {
        throw new ProgrammingError("You don't have the necessary ingredients to craft '" + key + "'.");
    }
}

function generateRecipeList(recipeLists) {
    var recipes = [{}, {}, {}, {}, {}];
    recipeLists.forEach(function (recipeList) {
        recipeList.forEach(function (levelList, index) {
            $.each(levelList, function (key, recipe) {
                recipes[index][key] = recipe;
            });
        });
    });
    return recipes;
}
function markRecipesAsAvailable(recipeList) {
    recipeList.forEach(function (levelList, index) {
        $.each(levelList, function (key, recipe) {
            availableRecipes[key] = recipe;
        });
    });
}
function ifseto(object, key, defaultValue) {
    if (typeof(object) == 'object') {
        if (typeof(object[key]) === 'undefined') {
            return defaultValue;
        }
        return object[key];
    }
    return defaultValue;
}
function CraftAction(data) {
    var recipes = generateRecipeList(data.recipes);
    var helpText = ifseto(data, 'helpText', 'Craft items from the ingredients you have bought or collected. Learn more Craft skills in the skill tree to unlock new recipes.');
    this.getDiv = function () {
        return $div('action slot' + ifseto(data, 'slot', 0), $div('box', ifseto(data, 'label', 'Craft'))).attr('helpText', helpText);
    };
    this.action = function () {
        if ($('.js-craftContainer').is('.open')) {
            return 'hideTabs';
        }
        return 'craft';
    }
    this.addActions = function () {
        placeActions.craft = function (params) {
            checkParams(0, params);
            displyCraftingPage($('.js-craftContainer'), player.craftingSkill, recipes);
        }
        placeActions.make = makeItem;
        markRecipesAsAvailable(recipes);
    }
}
function EnchantAction(slot) {
    this.getDiv = function () {
        return $div('action slot' + slot, $div('box', 'Enchant')).attr('helpText', 'Craft enchantments that can be used later to power up the gear you are wearing. Enchantments are lost when the enchanted item is unequiped or when you rest. Learn more Enchantment skills in the skill tree to unlock new recipes.');
    };
    this.action = function () {
        if ($('.js-craftContainer').is('.open')) {
            return 'hideTabs';
        }
        return 'enchant';
    }
    this.addActions = function () {
        placeActions.enchant = function (params) {
            checkParams(0, params);
            displyCraftingPage($('.js-enchantContainer'), player.enchantingSkill, enchantingRecipes);
        }
        placeActions.make = makeItem;
        markRecipesAsAvailable(enchantingRecipes);
    }
};

function displyCraftingPage($container, skillLevel, recipeList) {
    closeAll();
    $container.addClass('open');
    $('.js-inventoryContainer').addClass('open');
    $('.js-inventoryPanel').removeClass('selected');
    $('.js-inventoryPanel.js-items').addClass('selected');
    $container.find('.js-body').empty();
    for (var i = 0; i < recipeList.length; i++) {
        $container.find('.js-body').append($div('heading', 'Level ' + i));
        $.each(recipeList[i], function (key, recipe) {
            //{'result': 'fur', 'ingredients': {'furScrap': 5}},
            var item = allItems[recipe.result];
            var $recipe = $container.find('.js-baseRecipe').clone().removeClass('js-baseRecipe').show();
            $recipe.find('.js-result').html(getItemName(item)).attr('helpText', getItemHelpTextWithEnchantments(item)).data('helpFunction', function () {
                try {
                    checkForCraftingErrors(recipe, key);
                } catch (e) {
                    return e.message;
                }
                return '';
            });
            var canCraft = (i <= skillLevel);
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
            $recipe.data('recipe', recipe);
            $recipe.toggleClass('canCraft', canCraft);
            $recipe.find('.js-craft').attr('code', 'make ' + key);
            $container.find('.js-body').append($recipe);
        });
    }
}

function ingredientAmount(baseAmount) {
    //the 'care' skill reduces crafting costs by 25%
    return Math.max(1, Math.round(baseAmount * (player.specialSkills.care ? .75 : 1)));
}

function craftRecipe(recipe) {
    var item = allItems[recipe.result];
    player.inventory[item.slot][item.key]++;
    var time = 1000;
    //care+copy each double crafting time
    if (player.specialSkills.care) {
        time *= 2;
    }
    if (player.specialSkills.copy) {
        time *= 2;
    }
    player.time += time;
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
}

function updateCrafting($container) {
    $container.find('.js-body .js-recipe').each(function () {
        var $recipe = $(this);
        var recipe = $recipe.data('recipe');
        var canCraft = (recipe.type == 'crafting' && recipe.level <= player.craftingSkill)
            || (recipe.type == 'enchanting' && recipe.level <= player.enchantingSkill);
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

function playerHasIngredientsFor(recipe) {
    var hasIngredients = true;
    $.each(recipe.ingredients, function (key, amount) {
        amount = ingredientAmount(amount);
        var ingredient = allItems[key];
        var amountOwned = player.inventory[ingredient.slot][ingredient.key];
        if (amountOwned < amount) {
            hasIngredients = false;
            return false;
        }
        return true;
    });
    return hasIngredients;
}
