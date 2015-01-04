var recipes = {};
recipes.common = [
{
    'fur': {'furScrap': 5}, 'fur-2': {'smallPelt': 2},
    'shellPlating': {'brokenShell': 10}, 'shellPlating-2': {'smallShell': 5},
    'leather': {'smallPelt': 5}, 'leather-2': {'largePelt': 1},
    'copperIngot': {'copperOre': 10}
},{
    'mediumPotion': {'smallPotion': 3},
    'tin': {'tinScraps': 2},
    'bronzePlating': {'copperOre': 15, 'tin': 2},
    'ironIngot': {'ironOre': 10}
},{
    'largePotion': {'mediumPotion': 4},
    'steelPlating': {'ironOre': 20, 'charcoal': 10},
    'silverIngot': {'silverOre': 10},
    'steeledSilver': {'silverOre': 10, 'ironOre': 4, 'charcoal': 1},
    'silk': {'strongWeb': 10},
    'ninjaTabi': {'leather': 5, 'silk': 5}
},{
    'giantPotion': {'largePotion': 3},
    'mithrilSilver': {'silverOre': 20, 'ironOre': 4, 'coolingMagma': 2, 'copperOre': 2, 'tin': 1},
    'goldIngot': {'goldOre': 10},
    'orchialcum': {'goldOre': 20, 'silverOre': 4, 'mithrilDust': 4, 'coolingMagma': 2, 'pearl': 1},
    'goldenLeather': {'goldenWeb': 10, 'carbonFiber': 5, 'silverOre': 2, 'mithrilDust': 2, 'solvent': 1, 'pearl': 1},
    'goldenLeather-2': {'goldenFleece': 1}
},{
},{
}
];

recipes.copper = [
{
    'furCoat': {'fur': 5},
    'leatherGloves': {'leather': 2},
    'leatherBoots': {'leather': 5},
    'shellHat': {'shellPlating': 5},
    'brassKnuckles': {'copperIngot': 2},
    'copperSword': {'copperIngot': 5},
    'copperGreaves': {'copperIngot': 5, 'leatherBoots': 1, 'fur': 2},
    'proudHat': {'shellHat': 1, 'lionMane': 1, 'largePelt': 3}
}
];
recipes.bronze = [
{
    'longSword': {'copperOre': 100, 'tin': 12},
    'longBow': {'timber': 10, 'copperOre': 15, 'tin': 2},
    'bronzeArmor': {'bronzePlating': 10, 'leather': 5},
    'bronzeHelmet': {'bronzePlating': 5, 'copperIngot': 5, 'leather': 3},
    'bronzeLeggings': {'bronzePlating': 6, 'leather': 3}
}
];
recipes.iron = [
{},
{
    'broadSword': {'ironIngot': 15},
    'hammer': {'timber': 5, 'ironIngot': 10},
    'compositeBow': {'suppleTimber': 6, 'timber': 6, 'ironIngot': 2},
    'chainMail': {'ironIngot': 10},
    'ironBoots': {'ironIngot': 10, 'leather': 3},
    'plateArmor': {'ironIngot': 50, 'leather': 5},
    'fullHelm': {'ironIngot': 20, 'leather': 5},
    'claymore': {'steelPlating': 5, 'copperOre': 40, 'tin': 5},
    'mace': {'ironOre': 100, 'charcoal': 30},
    'handBalista': {'sturdyTimber': 20, 'steelPlating': 5, 'ironOre': 4, 'charcoal': 2},
    'steelPlating': {'ironOre': 20, 'charcoal': 10},
    'steelArmor': {'steelPlating': 15, 'leather': 5},
    'steelHelmet': {'steelPlating': 5, 'ironIngot': 5, 'leather': 3},
    'steelLeggings': {'steelPlating': 5, 'leather': 5}
}
];
recipes.silver = [
    {},{},
{
    'cestus': {'leatherGloves': 1, 'steelPlating': 2, 'steeledSilver': 1},
    'silverSword': {'steeledSilver': 5, 'copperOre': 40, 'tin': 5},
    'silverMail': {'steeledSilver': 5},
    'silverHelmet': {'steeledSilver': 5, 'silverIngot': 5, 'silk': 3},
    'silverPlate': {'steeledSilver': 10, 'silk': 5}
}
];

recipes.mithril = [
    {},{},
{
    'tigerClaws': {'tigerClaw': 8, 'mithrilDust': 8, 'solvent': 2, 'mithrilSilver': 1, 'coolingMagma': 1, 'cestus': 1},
    'katana': {'silverOre': 80, 'ironOre': 30, 'mithrilDust': 10, 'coolingMagma': 10, 'copperOre': 10, 'tin': 5, 'solvent' : 2},
    'morningStar': {'silverOre': 60, 'mithrilPieces': 20, 'ironOre': 25, 'coolingMagma': 5, 'copperOre': 2, 'solvent' : 2, 'tin': 1},
    'vampireSlayer': {'rocPinion': 1, 'rocFeather': 4, 'goldenWeb': 4, 'mithrilDust': 4, 'mithrilSilver': 2, 'coolingMagma': 1, 'solvent': 1, 'crossbow': 1},
    'mithrilMail': {'mithrilSilver': 10},
    'mithrilHelmet': {'mithrilSilver': 5, 'silverIngot': 5, 'silk': 3},
    'mithrilGreaves': {'mithrilSilver': 5, 'silk': 5},
    'mithrilPlate': {'mithrilSilver': 15, 'silk': 5}
}
];

recipes.gold = [
    {},{},{},
{
    'midasTouch': {'orchialcum': 2, 'coolingMagma': 1, 'solvent': 1, 'cestus': 1},
    'compoundBow': {'gear': 8, 'carbonFiber': 6, 'pulley': 4, 'orchialcum': 2, 'coolingMagma': 1, 'solvent': 1},
    'goldenHelmet': {'orchialcum': 5, 'goldIngot': 5, 'goldenLeather': 3},
    'orchialcumMail': {'orchialcum': 15, 'goldenLeather': 5},
    'wingedBoots': {'rocPinion': 2, 'rocFeather': 4, 'goldenLeather': 8}
}
];

recipes.lab = [
    {'vaccine': {'antigen': 5}},
    {'medication': {'antibodies': 5}},
    {},
    {}
]

recipes.platinum = [
{},{},{},
{
    'holyArmor': {'unobtanium': 1},
    'platinumHelmet': {'unobtanium': 1},
    'cyberBoots': {'unobtanium': 1},
    'kotetsu': {'unobtanium': 1},
    'warHammer': {'unobtanium': 1},
}];

recipes.titanium = [
{},{},{},{},
{
    'titanFists': {'unobtanium': 1},
    'excalibur': {'unobtanium': 1},
    'maceOfTheDarkLord': {'unobtanium': 1},
    'deathBow': {'unobtanium': 1},
    'giantBoots': {'unobtanium': 1},
    'battleSuit': {'unobtanium': 1},
    'damascusHelmet': {'unobtanium': 1},
}];
recipes.adamantium = [
{},{},{},{},
{
    'dragonFangs': {'unobtanium': 1},
    'blackSwordYoru': {'unobtanium': 1},
    'mjolnir': {'unobtanium': 1},
    'runeBow': {'unobtanium': 1},
    'crystalBoots': {'unobtanium': 1},
    'adamantArmor': {'unobtanium': 1},
    'ribbon': {'unobtanium': 1},
}];

var enchantData = [
    ['tiger', 'enchantFist', 'attackSpeed', .25],
    ['mole', 'enchantFist', 'miningSpeed', .25],
    ['leech', 'enchantFist', 'lifeSteal', .05],
    ['viper', 'enchantFist', 'poison', 25],
    ['bear', 'enchantFist', 'armorBreak', 5],

    ['ninja', 'enchantSword', 'attackSpeed', .25],
    ['warrior', 'enchantSword', 'damage', .25],
    ['fencer', 'enchantSword', 'parry', .05],
    ['vampire', 'enchantSword', 'lifeSteal', .05],
    ['duelist', 'enchantSword', 'armorPierce', .05],

    ['warlord', 'enchantClub', 'damage', .25],
    ['poacher', 'enchantClub', 'poach', .5],
    ['miner', 'enchantClub', 'miningSpeed', .25],
    ['gangster', 'enchantClub', 'cripple', 5],
    ['sauron', 'enchantClub', 'armorBreak', 10],

    ['archer', 'enchantBow', 'damage', .25],
    ['hunter', 'enchantBow', 'poach', .5],
    ['sniper', 'enchantBow', 'armorPierce', .05],
    ['assassin', 'enchantBow', 'poison', 50],
    ['trapper', 'enchantBow', 'cripple', 5],

    ['monk', 'enchantArmor', 'vigor', .25],
    ['giant', 'enchantArmor', 'health', .25],
    ['knight', 'enchantArmor', 'armor', .2],
    ['urchin', 'enchantArmor', 'reflect', .15],

    ['tracker', 'enchantHelmet', 'poach', .25],
    ['squire', 'enchantHelmet', 'experience', .25],
    ['healer', 'enchantHelmet', 'tenacity', .05],
    ['prospector', 'enchantHelmet', 'miningSpeed', .25],

    ['traveler', 'enchantBoots', 'travelingSpeed', .25],
    ['dancer', 'enchantBoots', 'attackSpeed', .2],
    ['thief', 'enchantBoots', 'tenacity', .05],
    ['satyr', 'enchantBoots', 'armor', .1]
];

$.each(enchantData, function (index, data) {
    var key = data[0];
    var name = key.charAt(0).toUpperCase() + key.substring(1);
    var slot = data[1];
    var buff = data[2];
    var value = data[3];

    items[key + 'Charm'] = {
        'name': name + '\'s Charm',
        'value': 200
    };
    items[key + 'Charm'][slot] = {};
    items[key + 'Charm'][slot][buff] = value;
    items[key + 'Charm'].baseEnchantmentValue = value;

    items[key + 'Blessing'] = {
        'name': name + '\'s Blessing',
        'value': 2000
    };
    items[key + 'Blessing'][slot] = {};
    items[key + 'Blessing'][slot][buff] = value * 2;
    items[key + 'Blessing'].baseEnchantmentValue = value;

    items[key + 'Soul'] = {
        'name': name + '\'s Soul',
        'value': 20000
    };
    items[key + 'Soul'][slot] = {};
    items[key + 'Soul'][slot][buff] = value * 4;
    items[key + 'Soul'].baseEnchantmentValue = value;
});


var enchantingRecipes = [
{
    'tigerCharm': {'ratClaw': 10},
    'ninjaCharm': {'feather': 10},
    'minerCharm': {'brokenShell': 10},
    'hunterCharm': {'guano': 10},
    'giantCharm': {'smallPelt': 10},
    'squireCharm': {'furScrap': 10},
    'travelerCharm': {'batWing': 10}, //7 7
},
{
    'moleCharm': {'moleClaw': 10},
    'leechCharm': {'batFang': 10},
    'warriorCharm': {'charcoal': 10},
    'duelistCharm': {'brine': 10},
    'warlordCharm': {'spikyShell': 10},
    'poacherCharm': {'smallShell': 10},
    'gangsterCharm': {'crackedShell': 10},
    'archerCharm': {'spiderWeb': 10},
    'assassinCharm': {'venom': 10},
    'monkCharm': {'largePelt': 10},
    'knightCharm': {'reptileSkin': 10},
    'trackerCharm': {'lionMane': 10},
    'prospectorCharm': {'moleFur': 10},
    'dancerCharm': {'birdWing': 10},
    'satyrCharm': {'tinScraps': 10},
    'hunterBlessing': {'pollen': 10},
    'squireBlessing': {'woolyScrap': 10}, //17 24
}, {
    'viperCharm': {'whelpTooth': 10},
    'bearCharm': {'sharpTooth': 10},
    'fencerCharm': {'peatSoil': 10},
    'vampireCharm': {'bone': 10},
    'sauronCharm': {'hardShell': 10},
    'sniperCharm': {'acid': 10},
    'trapperCharm': {'strongWeb': 10},
    'urchinCharm': {'spikyScales': 10},
    'healerCharm': {'stoneHead': 10},
    'thiefCharm': {'magicRubble': 10},
    'tigerBlessing': {'tigerClaw': 10},
    'moleBlessing': {'boarTusk': 10},
    'ninjaBlessing': {'rocFeather': 10},
    'warriorBlessing': {'coolingMagma': 10},
    'warlordBlessing': {'pangolinScales': 10},
    'poacherBlessing': {'clamShell': 10},
    'minerBlessing': {'mithrilDust': 10},
    'archerBlessing': {'impTail': 10},
    'monkBlessing': {'giantPelt': 10},
    'giantBlessing': {'woolyPelt': 10},
    'trackerBlessing': {'horn': 10},
    'prospectorBlessing': {'snout': 10},
    'travelerBlessing': {'impWing': 10},
    'dancerBlessing': {'rocPinion': 10},
    'satyrBlessing': {'lavaStone': 10}, //25 49
}, {
    'leechBlessing': {'vampireFang': 10},
    'viperBlessing': {'viperFang': 10},
    'bearBlessing': {'unobtanium': 10},
    'fencerBlessing': {'magicSoil': 10},
    'vampireBlessing': {'giantBone': 10},
    'duelistBlessing': {'coral': 10},
    'gangsterBlessing': {'mithrilPieces': 10},
    'sauronBlessing': {'mithrilShell': 10},
    'sniperBlessing': {'solvent': 10},
    'assassinBlessing': {'toxin': 10},
    'trapperBlessing': {'goldenWeb': 10},
    'knightBlessing': {'silverScales': 10},
    'urchinBlessing': {'urchinNeedle': 10},
    'healerBlessing': {'pearl': 10},
    'thiefBlessing': {'lodeStone': 10},
    'moleSoul': {'unobtanium': 10},
    'ninjaSoul': {'windCrystal': 10},
    'poacherSoul': {'unobtanium': 10},
    'minerSoul': {'unobtanium': 10},
    'hunterSoul': {'unobtanium': 10},
    'monkSoul': {'unobtanium': 10},
    'trackerSoul': {'unobtanium': 10},
    'prospectorSoul': {'unobtanium': 10},
    'travelerSoul': {'unobtanium': 10},
    'satyrSoul': {'dreamStone': 10}, //25 74
}, {
    'tigerSoul': {'unobtanium': 10},
    'leechSoul': {'unobtanium': 10},
    'viperSoul': {'dragonFang': 10},
    'bearSoul': {'unobtanium': 10},
    'warriorSoul': {'fireCrystal': 10},
    'fencerSoul': {'unobtanium': 10},
    'vampireSoul': {'unobtanium': 10},
    'duelistSoul': {'unobtanium': 10},
    'warlordSoul': {'unobtanium': 10},
    'gangsterSoul': {'unobtanium': 10},
    'sauronSoul': {'unobtanium': 10},
    'archerSoul': {'unobtanium': 10},
    'sniperSoul': {'unobtanium': 10},
    'assassinSoul': {'unobtanium': 10},
    'trapperSoul': {'unobtanium': 10},
    'giantSoul': {'goldenFleece': 10},
    'knightSoul': {'unobtanium': 10},
    'urchinSoul': {'unobtanium': 10},
    'squireSoul': {'unobtanium': 10},
    'healerSoul': {'unobtanium': 10},
    'dancerSoul': {'unobtanium': 10},
    'thiefSoul': {'unobtanium': 10}, //22 96
}];

//populate allRecipes, and key/level on each recipe
var allRecipes = {};
$.each(recipes, function (key, recipeList) {
    recipeList.forEach(function (recipeLevelList, level) {
        $.each(recipeLevelList, function (key, ingredients) {
            allRecipes[key] = {
                'key': key,
                'result': key.split('-')[0],
                'level': level,
                'type': 'crafting',
                'ingredients': ingredients
            }
            recipeLevelList[key] = allRecipes[key];
        });
    });
});
enchantingRecipes.forEach(function (recipeLevelList, level) {
    $.each(recipeLevelList, function (key, ingredients) {
        var recipe = {
            'key': key,
            'result': key.split('-')[0],
            'level': level,
            'type': 'enchanting',
            'ingredients': ingredients
        }
        recipeLevelList[key] = allRecipes[key] = recipe;
        var totalValue = 0;
        var result = items[recipe.result];
        var enchantmentKey = getEnchantmentKey(result);
        $.each(recipe.ingredients, function (ingredientKey, amount) {
            if (!items[ingredientKey]) {
                console.log("Missing ingredient: " + ingredientKey);
                return;
            }
            totalValue += items[ingredientKey].value * amount;
            items[ingredientKey][enchantmentKey] = copy(result[enchantmentKey]);
            $.each(items[ingredientKey][enchantmentKey], function (effect, value) {
                if (result.baseEnchantmentValue >= 1) {
                    items[ingredientKey][enchantmentKey][effect] = Math.floor(result.baseEnchantmentValue * (level + 1) / 10);
                } else {
                    items[ingredientKey][enchantmentKey][effect] = Math.floor(100 * result.baseEnchantmentValue * (level + 1) / 10) / 100;
                }
            });
        });
        result.value = Math.floor(1.5 * totalValue);
        //some checks to make sure the value is set reasonably on recipe ingredients
        if (result.value) {
            if (level == 0 && result.value > 200) {
                console.log(key + ' recipe should not be worth more than 200, is currently ' + result.value);
            } else if (level == 1 && recipe.result.indexOf('Charm') >= 0) {
                logOutOfBounds(result, key, 200, 1500);
            } else if (level == 2 && recipe.result.indexOf('Charm') >= 0) {
                logOutOfBounds(result, key, 1500, 3000);
            } else if (level == 1 && recipe.result.indexOf('Blessing') >= 0) {
                logOutOfBounds(result, key, 500, 2500);
            } else if (level == 2 && recipe.result.indexOf('Blessing') >= 0) {
                logOutOfBounds(result, key, 1500, 5000);
            } else if (level == 3 && recipe.result.indexOf('Blessing') >= 0) {
                logOutOfBounds(result, key, 2500, 8000);
            } else if (level == 3 && recipe.result.indexOf('Soul') >= 0) {
                logOutOfBounds(result, key, 10000, 80000);
            } else if (level == 4 && recipe.result.indexOf('Soul') >= 0) {
                logOutOfBounds(result, key, 20000, 100000);
            }
        }
    });
});

function logOutOfBounds(result, key, min, max) {
    if (result.value < min) {
        console.log(key + ' recipe should not be worth less than ' + min + ', is currently ' + result.value);
    }
    if (result.value > max) {
        console.log(key + ' recipe should not be worth more than ' + max + ', is currently ' + result.value);
    }
}

var allItems = {};
$.each(items, function(key, value) {
    allItems[key] = value;
    value.key = key;
    value.slot = 'items';
});
$.each(weapons, function(key, value) {
    allItems[key] = value;
    value.key = key;
    value.isWeapon = true;
    value.slot = 'weapons';
    value.equipmentSlot = 'weapon';
});
$.each(armors, function(key, value) {
    allItems[key] = value;
    value.key = key;
    value.isArmor = true;
    value.slot = 'armors';
    value.equipmentSlot = 'armor';
});
$.each(helmets, function(key, value) {
    allItems[key] = value; value.key =
    key; value.isArmor = true;
    value.slot = 'helmets';
    value.equipmentSlot = 'helmet';
});
$.each(boots, function(key, value) {
    allItems[key] = value;
    value.key = key;
    value.isArmor = true;
    value.slot = 'boots';
    value.equipmentSlot = 'boots';
});


$.each(allRecipes, function (key, recipe) {
    if (!allItems[recipe.result]) {
        console.log("Missing item " + recipe.result);
    }
    var ingredientValue = 0;
    $.each(recipe.ingredients, function (ingredientKey, amount) {
        if (!allItems[ingredientKey]) {
            console.log("Missing item " + ingredientKey);
        } else {
            ingredientValue += amount * allItems[ingredientKey].value;
        }
    });
    //warning to make sure crafting always makes things more valuable
    if (ingredientValue && allItems[recipe.result] && ingredientValue > allItems[recipe.result].value) {
        console.log(key + ': ' + recipe.result + ' can be sold for ' + allItems[recipe.result].value + ' but its ingredients can be sold for ' + ingredientValue);
    }
    //warning to make sure crafting doesn't allow the user to make money
    if (ingredientValue && allItems[recipe.result] && ingredientValue * 2 < allItems[recipe.result].value) {
        console.log(key + ': ' + recipe.result + ' can be sold for ' + allItems[recipe.result].value + ' but its ingredients can be purchased for ' + (2 * ingredientValue));
    }
});