
var items = {};
items.largePotion = {
    'name': 'Large Potion',
    'use': function () {
        player.health = Math.min(player.getMaxHealth(), player.health + 3000);
        uiNeedsUpdate.playerStats = true;
    },
    'helpText': 'Drink this to recover 3000 health.',
    'value': 150
};
items.mediumPotion = {
    'name': 'Medium Potion',
    'use': function () {
        player.health = Math.min(player.getMaxHealth(), player.health + 500);
        uiNeedsUpdate.playerStats = true;
    },
    'helpText': 'Drink this to recover 500 health.',
    'value': 25
};
items.smallPotion = {
    'name': 'Small Potion',
    'use': function () {
        player.health = Math.min(player.getMaxHealth(), player.health + 100);
        uiNeedsUpdate.playerStats = true;
    },
    'helpText': 'Drink this to recover 100 health.',
    'value': 5
};
items.memoryCrystal = {
    'name': 'Memory Crystal',
    'helpText': 'Use this to recover a lost memory. <br/><br/> This will automatically be consumed to permanently unlock new starting classes on the skill tree if you attempt to unlock them.',
    'value': 0
};
items.batWing = {
    'name': 'Bat Wing',
    'helpText': 'A bat wing.',
    'value': 1
};
items.batFang = {
    'name': 'Bat Fang',
    'helpText': 'The fang of a blood sucking bat.',
    'value': 15
};
items.guano = {
    'name': 'Guano',
    'helpText': 'Bat refuse that some use for farming.',
    'value': 1
};

items.ratClaw = {
    'name': 'Rat Claw',
    'helpText': 'A sharp rat claw.',
    'value': 5
}
items.furScrap = {
    'name': 'Scrap of Fur',
    'helpText': 'Tattered animal fur.',
    'value': 2
};
items.smallPelt = {
    'name': 'Small Pelt',
    'helpText': 'A small but well preserved animal pelt.',
    'value': 8
};

items.brokenShell = {
    'name': 'Broken Shell',
    'helpText': 'Broken pieces of shell.',
    'value': 4
};
items.smallShell = {
    'name': 'Small Shell',
    'helpText': 'An entire shell.',
    'value': 15
};
items.spikyShell = {
    'name': 'Spiky Shell',
    'helpText': 'A shell covered with spikes.',
    'value': 30
};
items.crackedShell = {
    'name': 'Cracked Shell',
    'helpText': 'A hard shell that is cracked but still in tact.',
    'value': 20
};
items.hardShell = {
    'name': 'Hard Shell',
    'helpText': 'An especially tough shell.',
    'value': 100
};
items.shellPlating = {
    'name': 'Shell Plating',
    'helpText': 'A hard material made from shells that can be used for crafting.',
    'value': 80
};

items.moleClaw = {
    'name': 'Mole Claw',
    'helpText': 'A tough mole claw.',
    'value': 20
}
items.moleFur = {
    'name': 'Mole Fur',
    'helpText': 'A shiny mole pelt.',
    'value': 30
}

items.lionMane = {
    'name': "Lion's Mane",
    'helpText': 'The magnificent beard of a lion.',
    'value': 50
}
items.largePelt = {
    'name': "Large Pelt",
    'helpText': 'A pelt from a large animal.',
    'value': 50
}

items.brine = {
    'name': "Brine",
    'helpText': 'Particularly rich sea water.',
    'value': 20
}
items.peatSoil = {
    'name': "Peat Soil",
    'helpText': 'Nutrient rich soil found in some bogs and marshes.',
    'value':110
}

items.spiderWeb = {
    'name': 'Spider Web',
    'helpText': 'The web of a large spider.',
    'value': 30
};
items.strongWeb = {
    'name': 'Strong Web',
    'helpText': 'Surprisingly strong webbing.',
    'value': 100
};

items.timber = {
    'name': 'Timber',
    'helpText': 'Wood for crafting.',
    'value': 80
}
items.sturdyTimber = {
    'name': 'Sturdy Timber',
    'helpText': 'Strong, rigid wood.',
    'value': 150
}
items.suppleTimber = {
    'name': 'Supple Timber',
    'helpText': 'Strong wood that can bend a lot without breaking.',
    'value': 200
}
items.venom = {
    'name': 'Venom',
    'helpText': 'Extracted venom.',
    'value': 50
};

items.reptileSkin = {
    'name': 'Reptile Skin',
    'helpText': 'Scaley reptile leather.',
    'value': 40
};
items.spikyScales = {
    'name': 'Spiky Scales',
    'helpText': 'Scales from a spiky reptile.',
    'value': 100
};
items.sharpTooth = {
    'name': 'Sharp Tooth',
    'helpText': 'A sharp predator\'s tooth.',
    'value': 100
};
items.bone = {
    'name': 'Bone',
    'helpText': 'A large animal bone.',
    'value': 100
};
items.birdWing = {
    'name': 'Bird Wing',
    'helpText': 'The wing of a large bird.',
    'value': 60
};
items.feather = {
    'name': 'Feather',
    'helpText': 'A fine feather from a large bird.',
    'value': 10
};
items.acid = {
    'name': "Acid",
    'helpText': 'A corrosive compound ',
    'value': 200
}


items.tinScraps = {
    'name': 'Tin Scraps',
    'helpText': 'Scraps of tin that you should recycle.',
    'value': 10
};
items.whelpTooth = {
    'name': 'Whelp Tooth',
    'helpText': 'Deciduous tooth of a dragon.',
    'value': 100
};
items.charcoal = {
    'name': 'Charcoal',
    'helpText': 'Might be useful for smelting ores.',
    'value': 30
};
items.stoneHead = {
    'name': 'Stone Head',
    'helpText': 'A once possessed stone head.',
    'value': 100
};
items.magicRubble = {
    'name': 'Rubble',
    'helpText': 'Rubble from a possessed statue',
    'value': 100
};

items.fur = {
    'name': 'Fur',
    'helpText': 'Patched together animal furs that can be used for crafting.',
    'value': 16
};
items.leather = {
    'name': 'Leather',
    'helpText': 'Treated animal hide that can be used for crafting.',
    'value': 80
};
items.silk = {
    'name': "Silk",
    'helpText': 'A rare cloth of the finest quality',
    'value': 2000
}

items.unobtanium = {
    'name': 'Unobtanium',
    'helpText': 'A material said to be unobtainable in this version of the game.',
    'value': 0
}
