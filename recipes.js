
var craftingRecipes = [
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
    'largePotion': {'result': 'largePotion','ingredients': {'mediumPotion': 4}},
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

items.windCharm = {
    'name': 'Wind Charm',
    'helpText': 'A boots enchantment that makes you light on your feet.',
    'enchantBoots': {'attackSpeed' : .2},
    'value': 20
};
items.huntersCharm = {
    'name': 'Hunters Charm',
    'helpText': 'A helmet enchantment that bestows you with a hunter\'s patience.',
    'enchantHelmet': {'poach' : .2},
    'value': 20
};
items.minersCharm = {
    'name': 'Miners Charm',
    'helpText': 'A club enchantment that makes your club sturdy enough to mine ore with.',
    'enchantClub': {'miningSpeed' : .2},
    'value': 20
};
items.fightersCharm = {
    'name': 'Fighters Charm',
    'helpText': 'An fist enchantment that makes your punches hit harder.',
    'enchantFist': {'damage' : .2},
    'value': 20
};
items.vitalityCharm = {
    'name': 'Vitality Charm',
    'helpText': 'An armor enchantment that increases your health.',
    'enchantArmor': {'health' : .2},
    'value': 20
};

var enchantingRecipes = [
{
    'windCharm': {'ingredients': {'wingScraps': 10}},
    'huntersCharm': {'ingredients': {'furScrap': 10}},
    'minersCharm': {'ingredients': {'brokenShell': 10}},
},
{
    'fightersCharm': {'ingredients': {'smallShell': 5}},
    'vitalityCharm': {'ingredients': {'smallPelt': 5}},
}];

//populate allRecipes, and key/level on each recipe
var allRecipes = {};
craftingRecipes.forEach(function (recipeLevelList, level) {
    $.each(recipeLevelList, function (key, recipe) {
        recipe.key = key;
        recipe.level = level;
        recipe.type = 'crafting';
        allRecipes[key] = recipe;
    });
});
enchantingRecipes.forEach(function (recipeLevelList, level) {
    $.each(recipeLevelList, function (key, recipe) {
        recipe.key = key;
        recipe.result = key;
        recipe.level = level;
        recipe.type = 'enchanting';
        allRecipes[key] = recipe;
    });
});