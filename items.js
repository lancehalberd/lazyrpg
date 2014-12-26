
var items = {};
items.giantPotion = {
    'name': 'Giant Potion',
    'use': function () {
        player.health = Math.min(player.getMaxHealth(), player.health + 10000);
        uiNeedsUpdate.playerStats = true;
    },
    'helpText': 'Drink this to recover 10000 health.',
    'value': 500
};
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
items.goldenWeb = {
    'name': 'Golden Web',
    'helpText': 'Gold laced spider web.',
    'value': 400
};

items.timber = {
    'name': 'Timber',
    'helpText': 'Wood for crafting.',
    'value': 90
}
items.sturdyTimber = {
    'name': 'Sturdy Timber',
    'helpText': 'Strong, rigid wood.',
    'value': 200
}
items.suppleTimber = {
    'name': 'Supple Timber',
    'helpText': 'Strong wood that can bend a lot without breaking.',
    'value': 250
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
    'value': 20
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
};
items.goldenLeather = {
    'name': 'Golden Leather',
    'helpText': 'A strong luxuriant fabric that has many of the same properties as orchialcum.',
    'value': 7000
};

items.coolingMagma = {
    'name': "Cooling Magma",
    'helpText': 'This shell of cooling magma is so hot you take extra damage while holding it. Some will turn into Lava Stone after 30 seconds of game time, or you can use it to cool all of it immediatly.',
    'use': function () {
        //add one because 'using' the magma consumes one by default
        player.inventory.items.lavaStone += (player.inventory.items.coolingMagma + 1);
        player.inventory.items.coolingMagma = 0;
        uiNeedsUpdate.items = true;
    },
    'timer': 30000,
    'value': 200
};

items.pearl = {
    'name': 'Pearl',
    'helpText': 'A fine lustrous pearl.',
    'value': 200
};
items.clamShell = {
    'name': 'Clam Shell',
    'helpText': 'The shell of a giant clam.',
    'value': 150
};
items.pangolinScales = {
    'name': 'Pangolin Scales',
    'helpText': 'The sharp keratin scales of a pangolin.',
    'value': 150
};
items.boarTusk = {
    'name': 'Boar Tusk',
    'helpText': 'Tusk that was once used for digging.',
    'value': 200
};
items.snout = {
    'name': 'Snout',
    'helpText': 'The snout of a pig.',
    'value': 150
};
items.woolyScrap = {
    'name': 'Wooly Scrap',
    'helpText': 'A scrap of thick, wooly hide.',
    'value': 50
};
items.horn = {
    'name': 'Horn',
    'helpText': 'A large rhinocerous horn.',
    'value': 200
};
items.woolyPelt = {
    'name': 'Wooly Pelt',
    'helpText': 'A thick, wooly hide.',
    'value': 150
};
items.silverScales = {
    'name': 'Silver Scales',
    'helpText': 'Silver snake scales.',
    'value': 200
};
items.lavaStone = {
    'name': 'Lava Stone',
    'helpText': 'A stone formed from cooled magma.',
    'value': 100
};
items.mithrilShell = {
    'name': 'Mithril Shell',
    'helpText': 'A large snail shell containing mithril silver.',
    'value': 250
};
items.mithrilPieces = {
    'name': 'Mithril Pieces',
    'helpText': 'Pieces of a mithril eater\'s shell.',
    'value': 200
};
items.mithrilDust = {
    'name': 'Mithril Dust',
    'helpText': 'A dust that contains trace amounts of mithril.',
    'value': 150
};
items.solvent = {
    'name': 'Solvent',
    'helpText': 'A secretion that can dissolve mithril.',
    'value': 180
};
items.impWing = {
    'name': 'Imp Wing',
    'helpText': 'The wings of a mischevious imp.',
    'value': 250
};
items.impTail = {
    'name': 'Imp Tail',
    'helpText': 'The barbed tail of an imp.',
    'value': 150
};
items.coral = {
    'name': 'Coral',
    'helpText': 'Fossilized remains of various aquatic creatures.',
    'value': 180
};
items.toxin = {
    'name': 'Toxin',
    'helpText': 'A chemical that interferes with neuroligical functions.',
    'value': 300
};
items.urchinNeedle = {
    'name': 'Urchin Needle',
    'helpText': 'An incredible sharp barb from an urchin.',
    'value': 200
};
items.tigerClaw = {
    'name': 'Tiger Claw',
    'helpText': 'A razor sharp saber tooth tiger claw.',
    'value': 200
};
items.saberTooth = {
    'name': 'Saber Tooth',
    'helpText': 'An oversized saber shaped canine.',
    'value': 300
};
items.giantPelt = {
    'name': 'Giant Pelt',
    'helpText': 'An unwieldy mammoth hide.',
    'value': 250
};
items.giantBone = {
    'name': 'Giant Bone',
    'helpText': 'A gigantic mammoth bone.',
    'value': 250
};
items.rocFeather = {
    'name': 'Roc Feather',
    'helpText': 'A giant feather from a Roc.',
    'value': 200
};
items.rocPinion = {
    'name': 'Roc Pinion',
    'helpText': 'The Roc\'s flight feather is longer than your arm span.',
    'value': 300
};
items.magicSoil = {
    'name': 'Magic Soil',
    'helpText': 'Enchanted soil from a defeated earth golem.',
    'value': 200
};
items.rocPinion = {
    'name': 'Roc Pinion',
    'helpText': 'The Roc\'s flight feather is longer than your arm span.',
    'value': 300
};
items.pollen = {
    'name': 'Pollen',
    'helpText': 'This pollen can cause hallucinations.',
    'value': 150
};
items.lodeStone = {
    'name': 'Lode Stone',
    'helpText': 'A magnetized stone that seems to be a core component of many constructs.',
    'value': 300
};
items.gear = {
    'name': 'Gear',
    'helpText': 'A gear from a machine.',
    'value': 250
};
items.pulley = {
    'name': 'Pulley',
    'helpText': 'A simple machine often employed to lift heavy loads.',
    'value': 250
};
items.carbonFiber = {
    'name': 'Carbon Fiber',
    'helpText': 'An incredibly strong fiber found in some machine components.',
    'value': 300
};
items.viperFang = {
    'name': 'Viper Fang',
    'helpText': 'The fang of a venomous snake.',
    'value': 350
};
items.vampireFang = {
    'name': 'Vampire Fang',
    'helpText': 'The fang of a bloodsucking vampire.',
    'value': 350
};

items.fireCrystal = {
    'name': 'Fire Crystal',
    'helpText': 'The essence of fire distilled into the form of a crystal.',
    'value': 1000
};
items.dreamStone = {
    'name': 'Dream Stone',
    'helpText': 'The stuff dreams are made of.',
    'value': 1000
};
items.goldenFleece = {
    'name': 'Golden Fleece',
    'helpText': 'The hide of the legendary golden hind.',
    'value': 5000
};

items.unobtanium = {
    'name': 'Unobtanium',
    'helpText': 'A material said to be unobtainable in this version of the game.',
    'value': 0
};
