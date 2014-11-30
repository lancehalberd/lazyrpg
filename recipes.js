
var craftingRecipes = [
{
    'fur': {'result': 'fur', 'ingredients': {'furScrap': 5}},
    'fur2': {'result': 'fur', 'ingredients': {'smallPelt': 2}},
    'shellPlating': {'result': 'shellPlating', 'ingredients': {'brokenShell': 10}},
    'shellPlating2': {'result': 'shellPlating', 'ingredients': {'smallShell': 5}},
    'furCoat': {'result': 'furCoat', 'ingredients': {'fur': 5}},
    'copperIngot': {'result': 'copperIngot', 'ingredients': {'copperOre': 10}},
    'leather': {'result': 'leather', 'ingredients': {'smallPelt': 5}},
    'leather2': {'result': 'leather', 'ingredients': {'largePelt': 1}},
    'leatherGloves': {'result': 'leatherGloves', 'ingredients': {'leather': 2}},
    'leatherBoots': {'result': 'leatherBoots', 'ingredients': {'leather': 5}},
    'shellHat': {'result': 'shellHat', 'ingredients': {'shellPlating': 5}},
    'brassKnuckles': {'result': 'brassKnuckles', 'ingredients': {'copperIngot': 2}},
    'copperSword': {'result': 'copperSword', 'ingredients': {'copperIngot': 5}},
    'copperGreaves': {'result': 'copperGreaves', 'ingredients': {'copperIngot': 5, 'leatherBoots': 1, 'fur': 2}},
    'proudHat': {'result': 'proudHat', 'ingredients': {'shellHat': 1, 'lionMane': 1, 'largePelt': 3}}
},{
    'mediumPotion': {'result': 'mediumPotion','ingredients': {'smallPotion': 3}},
    'tin': {'result': 'tin', 'ingredients': {'tinScraps': 2}},
    'longSword': {'result': 'longSword', 'ingredients': {'copperOre': 100, 'tin': 12}},
    'bronzePlating': {'result': 'bronzePlating','ingredients': {'copperOre': 15, 'tin': 2}},
    'bronzeArmor': {'result': 'bronzeArmor','ingredients': {'bronzePlating': 10, 'leather': 5}},
    'bronzeHelmet': {'result': 'bronzeHelmet', 'ingredients': {'bronzePlating': 5, 'copperIngot': 5, 'leather': 3}},
    'bronzeLeggings': {'result': 'bronzeLeggings', 'ingredients': {'bronzePlating': 6, 'leather': 3}},
    'ironIngot': {'result': 'ironIngot', 'ingredients': {'ironOre': 10}},
    'broadSword': {'result': 'broadSword', 'ingredients': {'ironIngot': 15}},
    'hammer': {'result': 'hammer', 'ingredients': {'timber': 5, 'ironIngot': 10}},
    'longBow': {'result': 'longBow', 'ingredients': {'timber': 5, 'ironIngot': 2}},
    'chainMail': {'result': 'chainMail','ingredients': {'ironIngot': 10}},
    'ironBoots': {'result': 'ironBoots', 'ingredients': {'ironIngot': 10, 'leather': 3}},
    'plateArmor': {'result': 'plateArmor', 'ingredients': {'ironIngot': 50, 'leather': 5}},
    'fullHelm': {'result': 'fullHelm', 'ingredients': {'ironIngot': 20, 'leather': 5}},
},{
    'largePotion': {'result': 'largePotion','ingredients': {'mediumPotion': 4}},
    'steelPlating': {'result': 'steelPlating', 'ingredients': {'ironOre': 20, 'charcoal': 10}},
    'steelArmor': {'result': 'steelArmor', 'ingredients': {'steelPlating': 15, 'leather': 5}},
    'steelHelmet': {'result': 'steelHelmet', 'ingredients': {'steelPlating': 5, 'ironIngot': 5, 'leather': 3}},
    'steelLeggings': {'result': 'steelLeggings', 'ingredients': {'steelPlating': 5, 'leather': 5}},
    'claymore': {'result': 'claymore', 'ingredients': {'steelPlating': 5, 'copperOre': 40, 'tin': 5}},
    'mace': {'result': 'mace', 'ingredients': {'ironOre': 100, 'charcoal': 30}},
    'compositeBow': {'result': 'compositeBow', 'ingredients': {'suppleTimber': 6, 'sturdyTimber': 6, 'ironOre': 10, 'charcoal': 5}},
    'silverIngot': {'result': 'silverIngot', 'ingredients': {'silverOre': 10}},
    'steeledSilver': {'result': 'steeledSilver', 'ingredients': {'silverOre': 10, 'ironOre': 4, 'charcoal': 1}},
    'cestus': {'result': 'cestus', 'ingredients': {'leatherGloves': 1, 'steelPlating': 2, 'steeledSilver': 1}},
    'silverSword': {'result': 'silverSword', 'ingredients': {'steeledSilver': 5, 'copperOre': 40, 'tin': 5}},
    'silk': {'result': 'silk', 'ingredients': {'strongWeb': 10}},
    'ninjaTabi': {'result': 'ninjaTabi', 'ingredients': {'leather': 5, 'silk': 5}},
},{
    'mithrilSilver': {'result': 'mithrilSilver', 'ingredients': {'silverOre': 40, 'ironOre': 8, 'charcoal': 2, 'copperOre': 4, 'tin': 1}}
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
    ['poacher', 'enchantClub', 'poach', .25],
    ['miner', 'enchantClub', 'miningSpeed', .25],
    ['gangster', 'enchantClub', 'cripple', 5],
    ['sauron', 'enchantClub', 'armorBreak', 10],

    ['archer', 'enchantBow', 'damage', .25],
    ['hunter', 'enchantBow', 'poach', .25],
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

    ['traveler', 'enchantBoots', 'travelSpeed', .25],
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
    'tigerCharm': {'ingredients': {'ratClaw': 10}},
    'ninjaCharm': {'ingredients': {'feather': 10}},
    'minerCharm': {'ingredients': {'brokenShell': 10}},
    'hunterCharm': {'ingredients': {'guano': 10}},
    'giantCharm': {'ingredients': {'smallPelt': 10}},
    'squireCharm': {'ingredients': {'furScrap': 10}},
    'travelerCharm': {'ingredients': {'batWing': 10}}, //7 7
},
{
    'moleCharm': {'ingredients': {'moleClaw': 10}},
    'leechCharm': {'ingredients': {'batFang': 10}},
    'warriorCharm': {'ingredients': {'charcoal': 10}},
    'duelistCharm': {'ingredients': {'brine': 10}},
    'warlordCharm': {'ingredients': {'spikyShell': 10}},
    'poacherCharm': {'ingredients': {'smallShell': 10}},
    'gangsterCharm': {'ingredients': {'crackedShell': 10}},
    'archerCharm': {'ingredients': {'spiderWeb': 10}},
    'assassinCharm': {'ingredients': {'venom': 10}},
    'monkCharm': {'ingredients': {'largePelt': 10}},
    'knightCharm': {'ingredients': {'reptileSkin': 10}},
    'trackerCharm': {'ingredients': {'lionMane': 10}},
    'prospectorCharm': {'ingredients': {'moleFur': 10}},
    'dancerCharm': {'ingredients': {'birdWing': 10}},
    'satyrCharm': {'ingredients': {'leather': 10}},
    'hunterBlessing': {'ingredients': {'unobtanium': 1}},
    'squireBlessing': {'ingredients': {'unobtanium': 1}}, //17 24
}, {
    'viperCharm': {'ingredients': {'whelpTooth': 10}},
    'bearCharm': {'ingredients': {'sharpTooth': 10}},
    'fencerCharm': {'ingredients': {'peatSoil': 10}},
    'vampireCharm': {'ingredients': {'bone': 10}},
    'sauronCharm': {'ingredients': {'hardShell': 10}},
    'sniperCharm': {'ingredients': {'acid': 10}},
    'trapperCharm': {'ingredients': {'strongWeb': 10}},
    'urchinCharm': {'ingredients': {'spikyScales': 10}},
    'healerCharm': {'ingredients': {'stoneHead': 10}},
    'thiefCharm': {'ingredients': {'magicRubble': 10}},
    'tigerBlessing': {'ingredients': {'unobtanium': 1}},
    'moleBlessing': {'ingredients': {'unobtanium': 1}},
    'ninjaBlessing': {'ingredients': {'unobtanium': 1}},
    'warriorBlessing': {'ingredients': {'unobtanium': 1}},
    'warlordBlessing': {'ingredients': {'unobtanium': 1}},
    'poacherBlessing': {'ingredients': {'unobtanium': 1}},
    'minerBlessing': {'ingredients': {'unobtanium': 1}},
    'archerBlessing': {'ingredients': {'unobtanium': 1}},
    'monkBlessing': {'ingredients': {'unobtanium': 1}},
    'giantBlessing': {'ingredients': {'unobtanium': 1}},
    'trackerBlessing': {'ingredients': {'unobtanium': 1}},
    'prospectorBlessing': {'ingredients': {'unobtanium': 1}},
    'travelerBlessing': {'ingredients': {'unobtanium': 1}},
    'dancerBlessing': {'ingredients': {'unobtanium': 1}},
    'satyrBlessing': {'ingredients': {'unobtanium': 1}}, //25 49
}, {
    'leechBlessing': {'ingredients': {'unobtanium': 1}},
    'viperBlessing': {'ingredients': {'unobtanium': 1}},
    'bearBlessing': {'ingredients': {'unobtanium': 1}},
    'fencerBlessing': {'ingredients': {'unobtanium': 1}},
    'vampireBlessing': {'ingredients': {'unobtanium': 1}},
    'duelistBlessing': {'ingredients': {'unobtanium': 1}},
    'gangsterBlessing': {'ingredients': {'unobtanium': 1}},
    'sauronBlessing': {'ingredients': {'unobtanium': 1}},
    'sniperBlessing': {'ingredients': {'unobtanium': 1}},
    'assassinBlessing': {'ingredients': {'unobtanium': 1}},
    'trapperBlessing': {'ingredients': {'unobtanium': 1}},
    'knightBlessing': {'ingredients': {'unobtanium': 1}},
    'urchinBlessing': {'ingredients': {'unobtanium': 1}},
    'healerBlessing': {'ingredients': {'unobtanium': 1}},
    'thiefBlessing': {'ingredients': {'unobtanium': 1}},
    'moleSoul': {'ingredients': {'unobtanium': 1}},
    'ninjaSoul': {'ingredients': {'unobtanium': 1}},
    'poacherSoul': {'ingredients': {'unobtanium': 1}},
    'minerSoul': {'ingredients': {'unobtanium': 1}},
    'hunterSoul': {'ingredients': {'unobtanium': 1}},
    'monkSoul': {'ingredients': {'unobtanium': 1}},
    'trackerSoul': {'ingredients': {'unobtanium': 1}},
    'prospectorSoul': {'ingredients': {'unobtanium': 1}},
    'travelerSoul': {'ingredients': {'unobtanium': 1}},
    'satyrSoul': {'ingredients': {'unobtanium': 1}}, //25 74
}, {
    'tigerSoul': {'ingredients': {'unobtanium': 1}},
    'leechSoul': {'ingredients': {'unobtanium': 1}},
    'viperSoul': {'ingredients': {'unobtanium': 1}},
    'bearSoul': {'ingredients': {'unobtanium': 1}},
    'warriorSoul': {'ingredients': {'unobtanium': 1}},
    'fencerSoul': {'ingredients': {'unobtanium': 1}},
    'vampireSoul': {'ingredients': {'unobtanium': 1}},
    'duelistSoul': {'ingredients': {'unobtanium': 1}},
    'warlordSoul': {'ingredients': {'unobtanium': 1}},
    'gangsterSoul': {'ingredients': {'unobtanium': 1}},
    'sauronSoul': {'ingredients': {'unobtanium': 1}},
    'archerSoul': {'ingredients': {'unobtanium': 1}},
    'sniperSoul': {'ingredients': {'unobtanium': 1}},
    'assassinSoul': {'ingredients': {'unobtanium': 1}},
    'trapperSoul': {'ingredients': {'unobtanium': 1}},
    'giantSoul': {'ingredients': {'unobtanium': 1}},
    'knightSoul': {'ingredients': {'unobtanium': 1}},
    'urchinSoul': {'ingredients': {'unobtanium': 1}},
    'squireSoul': {'ingredients': {'unobtanium': 1}},
    'healerSoul': {'ingredients': {'unobtanium': 1}},
    'dancerSoul': {'ingredients': {'unobtanium': 1}},
    'thiefSoul': {'ingredients': {'unobtanium': 1}}, //22 96
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
            }
            if (level == 1 && result.value < 200) {
                console.log(key + ' recipe should not be worth less than 200, is currently ' + result.value);
            }
            if (level == 1 && result.value > 1500) {
                console.log(key + ' recipe should not be worth more than 1500, is currently ' + result.value);
            }
            if (level == 2 && result.value < 1500) {
                console.log(key + ' recipe should not be worth less than 1500, is currently ' + result.value);
            }
            if (level == 2 && result.value > 3000) {
                console.log(key + ' recipe should not be worth more than 2000, is currently ' + result.value);
            }
        }
    });
});