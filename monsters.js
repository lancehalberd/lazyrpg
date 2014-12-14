function $ff2Monster(name) {
    return $div('ff2Monster '+name);
}
function $hillaryMonster(name) {
    return $div('hillaryMonster ' + name);
}

var monsters = {};

monsters.bat = {
    'name': 'Bat',
    'level': 2,
    'health': 20,
    'armor': 0,
    'damage': 4,
    'attackSpeed': 1.5,
    'experience': 2,
    '$graphic': $hillaryMonster('small bat'),
    'spoils': ['batWing', 'guano', 'guano'],
    'helpText': 'A frenzied cave bat. I can fight this and other monsters to gain experience and become more powerful.'
};
monsters.rat = {
    'name': 'Rat',
    'level': 3,
    'health': 20,
    'armor': 0,
    'damage': 16,
    'attackSpeed': 1,
    'experience': 4,
    '$graphic': $hillaryMonster('rat'),
    'spoils': ['smallPelt', 'furScrap', 'furScrap'],
    'helpText': 'Fast with sharp teeth, but not very strong. Monsters may drop ingredients for crafting. Learning poaching and increasing my damage can improve the spoils I obtain.'
};
monsters.turtus = {
    'name': 'Turtus',
    'level': 4,
    'health': 50,
    'armor': 10,
    'damage': 30,
    'attackSpeed': .5,
    'experience': 8,
    '$graphic': $hillaryMonster('smallTurtle'),
    'spoils': ['smallShell', 'brokenShell', 'brokenShell', 'brokenShell'],
    'helpText': 'I\'ll need a strong weapon to pierce this monster\'s hard shell.'
};
monsters.bandit = {
    'name': 'Bandit',
    'level': 5,
    'health': 100,
    'armor': 5,
    'damage': 50,
    'attackSpeed': 1,
    'experience': 15,
    '$graphic': $hillaryMonster('medium bandit'),
    'spoils': [30],
    'helpText': 'This should be a good test of my skills. Only monsters that are higher level than me will grant experience when I defeat them.'
};
monsters.troll = {
    'name': 'Troll',
    'level': 8,
    'health': 2000,
    'armor': 10,
    'damage': 75,
    'attackSpeed': .5,
    'experience':100,
    '$graphic': $hillaryMonster('large troll'),
    'spoils': [500],
    'helpText': 'This troll is guarding the only crossing of the river. Without proper gear and training, I won\'t be able to proceed.',
    'recover': 500
};
monsters.hawk = {
    'name': 'Hawk',
    'level': 6,
    'health': 160,
    'armor': 5,
    'damage': 40,
    'attackSpeed': 3,
    'experience': 20,
    '$graphic': $hillaryMonster('small hawk'),
    'spoils': ['birdWing', 'feather', 'feather'],
    'helpText': 'A fierce bird of prey. It\'s keen eyes can spot weaknesses in my defense, ignoring some of my armor.',
    'armorPierce': .5
};
monsters.mole = {
    'name': 'Mole',
    'level': 7,
    'health': 400,
    'armor': 20,
    'damage': 30,
    'attackSpeed': 1.5,
    'experience': 40,
    '$graphic': $hillaryMonster('small mole'),
    'spoils': ['moleFur', 'moleClaw', 'moleClaw'],
    'helpText': 'This monster seems surprisingly powerful, maybe I should avoid it for now and come back when I\'m stronger.',
    'armorBreak': 5
};
monsters.lion = {
    'name': 'Lion',
    'level': 8,
    'health': 400,
    'armor': 13,
    'damage': 40,
    'attackSpeed': 1,
    'experience': 40,
    '$graphic': $hillaryMonster('small lion'),
    'spoils': ['lionMane', 'largePelt', 'furScrap'],
    'armorBreak': 5,
    'helpText': 'A large cat with a beard. Its attacks are so powerful it can reduce the effectiveness of my armor over time.'
};
monsters.barnacle = {
    'name': 'Barnacle',
    'level': 8,
    'health': 300,
    'armor': 30,
    'damage': 50,
    'attackSpeed': 1,
    'experience': 40,
    '$graphic': $hillaryMonster('small barnacle'),
    'spoils': ['brine', 'brine'],
    'helpText': 'Some kind of aquatic creature is attached to the hull of the ship. It seems to be secreting a toxic fluid.',
    'poison': 20
};
monsters.pirate = {
    'name': 'Pirate',
    'level': 9,
    'health': 400,
    'armor': 15,
    'damage': 80,
    'attackSpeed': 2,
    'experience': 50,
    '$graphic': $hillaryMonster('medium pirate'),
    'spoils': [100],
    'helpText': 'Pirates have attacked the ship, I can\'t proceed unless I defeat them.'
};
monsters.snappingTurtus = {
    'name': 'Snapping Turtus',
    'level': 10,
    'health': 400,
    'armor': 30,
    'damage': 50,
    'attackSpeed': .5,
    'experience': 70,
    '$graphic': $hillaryMonster('spikyTurtle'),
    'spoils': ['spikyShell', 'brokenShell', 'brokenShell', 'brokenShell'],
    'helpText': 'The adult turtus has a spiky shell that hurts me when I try to attack it. I should avoid it until I am much stronger.',
    'reflect': .5
};
monsters.crocodile = {
    'name': 'Crocodile',
    'level': 10,
    'health': 400,
    'armor': 15,
    'damage': 100,
    'attackSpeed': 1,
    'experience': 80,
    '$graphic': $ff2Monster('crocodile'),
    'spoils': ['sharpTooth', 'reptileSkin'],
    'helpText': 'A large lizard. Maybe? Its strong jaws can reduce my armor.',
    'armorBreak': 5
};
monsters.scorpion = {
    'name': 'Scorpion',
    'level': 11,
    'health': 500,
    'armor': 5,
    'damage': 80,
    'attackSpeed': 2,
    'experience': 90,
    '$graphic': $ff2Monster('scorpion'),
    'spoils': ['venom', 'venom'],
    'helpText': 'The poison in its tail makes this a deceptively dangerous foe.',
    'poison': 10
};
monsters.vampireBat = {
    'name': 'Vampire Bat',
    'level': 12,
    'health': 500,
    'armor': 0,
    'damage': 70,
    'attackSpeed': 4,
    'experience': 120,
    '$graphic': $hillaryMonster('small bat'),
    'spoils': ['batFang', 'batWing', 'batWing', 'guano'],
    'helpText': 'This bat will drain my life as it attacks me.',
    'lifeSteal': .1
};
monsters.mudGolem = {
    'name': 'Mud Golem',
    'level': 13,
    'health': 1000,
    'armor': 10,
    'damage': 100,
    'attackSpeed': 2,
    'experience': 140,
    '$graphic': $ff2Monster('mudGolem'),
    'spoils': ['peatSoil', 'copperOre'],
    'helpText': 'Some of the mud here appears to be alive. This muck slows my attacks while the fumes deal damage over time.',
    'cripple': 2,
    'poison': 10
};
monsters.darkKnight = {
    'name': 'Dark Knight',
    'level': 15,
    'health': 15000,
    'armor': 30,
    'damage': 120,
    'attackSpeed': 3,
    'experience': 1000,
    '$graphic': $ff2Monster('darkKnight'),
    'spoils': ['memoryCrystal'],
    'helpText': 'This servant of the king has been posted here to prevent people from accessing the iron mines.',
    'armorPierce': .2,
    'recover': 10000
};
monsters.fowler = {
    'name': 'Fowler',
    'level': 14,
    'health': 600,
    'armor': 0,
    'damage': 120,
    'attackSpeed': 4,
    'experience': 170,
    '$graphic': $hillaryMonster('small flower'),
    'spoils': ['suppleTimber', 'timber'],
    'helpText': 'The pollen from this flower makes me dizzy and sneeze, reducing my opportunities to attack.',
    'cripple': 5,
    'recover': 300
};
monsters.mercenary = {
    'name': 'Mercenary',
    'level': 14,
    'health': 800,
    'armor': 25,
    'damage': 100,
    'attackSpeed': 3,
    'experience': 160,
    '$graphic': $hillaryMonster('medium bandit'),
    'spoils': [200],
    'helpText': 'A formed soldier of the king, he now works for the highest bidder.'
};
monsters.armadilloLizard = {
    'name': 'Armadillo Lizard',
    'level': 15,
    'health': 600,
    'armor': 40,
    'damage': 80,
    'attackSpeed': 2,
    'experience': 90,
    '$graphic': $hillaryMonster('small armadilloLizard'),
    'spoils': ['spikyScales', 'reptileSkin'],
    'helpText': 'This odd lizard is covered in spikes that damage me when I attack it.',
    'reflect': 1
};
monsters.bear = {
    'name': 'Bear',
    'level': 16,
    'health': 1500,
    'armor': 20,
    'damage': 200,
    'attackSpeed': 2,
    'experience': 180,
    '$graphic': $ff2Monster('bear'),
    'spoils': ['bone', 'sharpTooth', 'sharpTooth', 'largePelt'],
    'helpText': 'I should think carefully before disturbing its slumber.'
};
monsters.giantTortoise = {
    'name': 'Giant Tortoise',
    'level': 17,
    'health': 3000,
    'armor': 50,
    'damage': 150,
    'attackSpeed': 1,
    'experience': 200,
    '$graphic': $hillaryMonster('turtle'),
    'spoils': ['hardShell', 'crackedShell', 'brokenShell', 'brokenShell'],
    'helpText': 'A bolder with legs. Maybe I shouldn\'t even bother with this one.'
};
monsters.possessedGuard = {
    'name': 'Possessed Guard',
    'level': 18,
    'health': 1500,
    'armor': 30,
    'damage': 180,
    'attackSpeed': 2,
    'experience': 250,
    '$graphic': $ff2Monster('guard'),
    'spoils': [300],
    'helpText': 'Something seems wrong with soldiers guarding the castle.'
};
monsters.maverick = {
    'name': 'Maverick',
    'level': 19,
    'health': 2000,
    'armor': 25,
    'damage': 400,
    'attackSpeed': .8,
    'experience': 300,
    '$graphic': $ff2Monster('maverick'),
    'spoils': ['tinScraps', 'tinScraps', 'tinScraps'],
    'helpText': 'An old malfunctioning robot. Not necessairly aggressive, but it could do a lot of damage if I\'m not careful.',
    'cripple': 10
};
monsters.woodGolem = {
    'name': 'Wood Golem',
    'level': 20,
    'health': 5000,
    'armor': 20,
    'damage': 200,
    'attackSpeed': 2,
    'experience': 350,
    '$graphic': $hillaryMonster('large woodGolem'),
    'spoils': ['sturdyTimber', 'sturdyTimber', 'timber'],
    'helpText': 'A golem made entirely of wood... should be a good source of timber.'
};
monsters.whelp = {
    'name': 'Whelp',
    'level': 22,
    'health': 4000,
    'armor': 40,
    'damage': 200,
    'attackSpeed': 2,
    'experience': 400,
    '$graphic': $hillaryMonster('dragon'),
    'spoils': ['whelpTooth', 'charcoal', 'charcoal'],
    'helpText': 'Even a baby dragon is a force to be reckoned with.',
    'poison': 20
};
monsters.spider = {
    'name': 'Spider',
    'level': 24,
    'health': 3000,
    'armor': 20,
    'damage': 200,
    'attackSpeed': 3,
    'experience': 1000,
    '$graphic': $ff2Monster('spider'),
    'spoils': ['venom', 'spiderWeb', 'spiderWeb'],
    'helpText': 'A large poisonous spider.',
    'poison': 20
};
monsters.possessedCaptain = {
    'name': 'Possessed Captain',
    'level': 26,
    'health': 6000,
    'armor': 30,
    'damage': 200,
    'attackSpeed': 3,
    'experience': 450,
    '$graphic': $ff2Monster('captain'),
    'spoils': [500],
    'helpText': 'If I can defeat the captain, I can gain entrance to the castle.'
};
monsters.witch = {
    'name': 'Witch',
    'level': 30,
    'health': 20000,
    'armor': 0,
    'damage': 200,
    'attackSpeed': 2,
    'experience': 5000,
    '$graphic': $ff2Monster('witch'),
    'spoils': ['memoryCrystal'],
    'helpText': 'This witch is casting a spell to grant the evil king immense powers. Her magic spells ignore your armor entirely!',
    'armorPierce': 1,
    'recover': 10000
};
monsters.giantRat = {
    'name': 'Giant Rat',
    'level': 27,
    'health': 6000,
    'armor': 30,
    'damage': 300,
    'attackSpeed': 2,
    'experience': 600,
    '$graphic': $hillaryMonster('rat'),
    'spoils': ['bone', 'ratClaw', 'smallPelt', 'furScrap'],
    'helpText': 'The results of arcane magics, common pests, and boredom.'
};
monsters.golem = {
    'name': 'Golem',
    'level': 29,
    'health': 10000,
    'armor': 80,
    'damage': 500,
    'attackSpeed': 1,
    'experience': 800,
    '$graphic': $ff2Monster('golem'),
    'spoils': ['ironOre', 'copperOre', 'ironOre', 'copperOre'],
    'helpText': 'A being made entirely of stone and metal.'
};
monsters.gargoyle = {
    'name': 'Gargoyle',
    'level': 31,
    'health': 8000,
    'armor': 80,
    'damage': 300,
    'attackSpeed': 3,
    'experience': 900,
    '$graphic': $ff2Monster('gargoyle'),
    'spoils': ['stoneHead', 'magicRubble', 'magicRubble'],
    'helpText': 'Some strange magic has brought this statue to life.'
};
monsters.tRex = {
    'name': 'T-Rex',
    'level': 40,
    'health': 40000,
    'armor': 70,
    'damage': 500,
    'attackSpeed': 2,
    'experience': 10000,
    '$graphic': $ff2Monster('tRex'),
    'spoils': ['memoryCrystal'],
    'helpText': 'A giant prehistoric beast blocks my path further into the castle. Where did the king come by such a creature?',
    'armorBreak': 1,
    'recover': 20000
};
monsters.doomFlower = {
    'name': 'Doom Flower',
    'level': 33,
    'health': 9000,
    'armor': 40,
    'damage': 200,
    'attackSpeed': 2,
    'experience': 1000,
    '$graphic': $ff2Monster('flower'),
    'spoils': ['acid', 'suppleTimber', 'timber'],
    'helpText': 'These flowers appear to have been... modified.',
    'poison': 10,
    'cripple': 5,
    'armorBreak': 2
};
monsters.giantSpider = {
    'name': 'Giant Spider',
    'level': 35,
    'health': 12000,
    'armor': 50,
    'damage': 400,
    'attackSpeed': 3,
    'experience': 1200,
    '$graphic': $ff2Monster('spider'),
    'spoils': ['strongWeb', 'spiderWeb', 'spiderWeb'],
    'helpText': 'Why are there giant spiders living in the castle?',
    'poison': 40,
};
monsters.royalGuard = {
    'name': 'Royal Guard',
    'level': 37,
    'health': 10000,
    'armor': 80,
    'damage': 300,
    'attackSpeed': 4,
    'experience': 1300,
    '$graphic': $ff2Monster('royalGuard'),
    'spoils': [1500],
    'helpText': 'The elite guards of the king\'s inner sanctum. I will have to defeat them to proceed.',
    'parry': 20,
    'armorPierce': .5,
    'lifeSteal': .05
};
monsters.enchantedKing = {
    'name': 'Enchanted King',
    'level': 50,
    'health': 1000000,
    'armor': 300,
    'damage': 1000,
    'attackSpeed': 2,
    'experience': 10000,
    '$graphic': $ff2Monster('king'),
    'spoils': ['memoryCrystal'],
    'helpText': 'The enchantment placed on the king makes him almost invulnerable. I should retreat and think of a way to defeat him.',
    'armorPierce': .8,
    'recover': 100000
};
monsters.imposterKing = {
    'name': 'Imposter King',
    'level': 50,
    'health': 50000,
    'armor': 100,
    'damage': 500,
    'attackSpeed': 3,
    'experience': 10000,
    '$graphic': $ff2Monster('king'),
    'spoils': ['memoryCrystal'],
    'helpText': 'With the enchantment gone, I may have a chance to do away with this imposter once and for all.',
    'recover': 50000
};
monsters.firstMate = {
    'name': 'First Mate',
    'level': 38,
    'health': 8000,
    'armor': 50,
    'damage': 200,
    'attackSpeed': 5,
    'experience': 1400,
    '$graphic': $ff2Monster('pirate'),
    'spoils': [2000],
    'helpText': 'I have to defeat the first mate before I can face the captain. His blades appear to be soaked in poison.',
    'poison': 100
};
monsters.pirateCaptain = {
    'name': 'Pirate Captain',
    'level': 40,
    'health': 50000,
    'armor': 50,
    'damage': 200,
    'attackSpeed': 4,
    'experience': 15000,
    '$graphic': $ff2Monster('pirate'),
    'spoils': ['dreamStone'],
    'helpText': 'He insists that he is going to be King of the Pirates...',
    'armorBreak': 10,
    'parry': 50,
    'recover': 50000
};
monsters.giantClam = {
    'name': 'Giant Clam',
    'level': 39,
    'health': 20000,
    'armor': 100,
    'damage': 300,
    'attackSpeed': 1,
    'experience': 1500,
    '$graphic': $hillaryMonster('turtle'),
    'spoils': ['pearl', 'clamShell', 'clamShell', 'brine'],
    'helpText': 'I could collect some beautiful pearls if I can defeat these clams carefully.',
    'parry': 50,
    'cripple': 10
};
monsters.pangolin = {
    'name': 'Pangolin',
    'level': 40,
    'health': 10000,
    'armor': 100,
    'damage': 80,
    'attackSpeed': 2,
    'experience': 1600,
    '$graphic': $hillaryMonster('small armadilloLizard'),
    'spoils': ['pangolinScales', 'pangolinScales', 'pangolinScales'],
    'helpText': 'It looks like an ant eater covered in sharp scales.',
    'parry': 100,
    'reflect': .8
};
monsters.giantBoar = {
    'name': 'Giant Boar',
    'level': 41,
    'health': 15000,
    'armor': 100,
    'damage': 80,
    'attackSpeed': 4,
    'experience': 1700,
    '$graphic': $hillaryMonster('rat'),
    'spoils': ['boarTusk', 'snout', 'woolyScrap'],
    'helpText': 'A giant boar covered in a thick, wooly pelt.',
    'parry': 100
};
monsters.woolyRhino = {
    'name': 'Wooly Rhino',
    'level': 42,
    'health': 20000,
    'armor': 200,
    'damage': 500,
    'attackSpeed': 1,
    'experience': 1800,
    '$graphic': $ff2Monster('rhino'),
    'spoils': ['horn', 'woolyPelt', 'woolyScrap'],
    'helpText': 'This pachyderm\'s charging attacks will render my armor useless after a few hits.',
    'armorBreak': 100
};
monsters.moltenGolem = {
    'name': 'Molten Golem',
    'level': 43,
    'health': 10000,
    'armor': 100,
    'damage': 200,
    'attackSpeed': 1,
    'experience': 1900,
    '$graphic': $ff2Monster('mudGolem'),
    'spoils': ['coolingMagma', 'coolingMagma', 'coolingMagma', 'lavaStone'],
    'helpText': 'A golem born from flowing magma. Defeating it seems to be the secret to mining silver.',
    'armorBreak': 20,
    'poison': 100
};
monsters.silverSnake = {
    'name': 'Silver Snake',
    'level': 44,
    'health': 15000,
    'armor': 200,
    'damage': 200,
    'attackSpeed': 2,
    'experience': 2000,
    '$graphic': $ff2Monster('snake'),
    'spoils': ['silverScales', 'silverScales', 'sharpTooth'],
    'helpText': 'A giant silver snake that constricts its prey.',
    'cripple': 5,
    'parry': 50
};
monsters.mithrilEater = {
    'name': 'Mithril Eater',
    'level': 45,
    'health': 20000,
    'armor': 300,
    'damage': 300,
    'attackSpeed': 1,
    'experience': 2100,
    '$graphic': $ff2Monster('mole'),
    'spoils': ['mithrilShell', 'mithrilPieces', 'solvent', 'mithrilDust'],
    'helpText': 'The solvent this giant snail produces allows it to break down mithril in the rocks and incorporate it into its shell.',
    'armorBreak': 10,
    'poison': 10,
    'cripple': 10,
    'armorPierce': .2,
    'lifeSteal': .1
};
monsters.magmaTitan = {
    'name': 'Magma Titan',
    'level': 60,
    'health': 200000,
    'armor': 300,
    'damage': 100,
    'attackSpeed': 1,
    'experience': 30000,
    '$graphic': $ff2Monster('golem'),
    'spoils': ['fireCrystal'],
    'helpText': 'This titan living in the crater must be the source of the increased volcanic activity.',
    'armorBreak': 20,
    'poison': 200,
    'recover': 50000
};
monsters.imp = {
    'name': 'Imp',
    'level': 47,
    'health': 20000,
    'armor': 200,
    'damage': 300,
    'attackSpeed': 5,
    'experience': 2300,
    '$graphic': $ff2Monster('gargoyle'),
    'spoils': ['impWing', 'impTail'],
    'helpText': 'Small fire demons that are attracted to magma.',
    'armorBreak': 1,
    'poison': 10
};
monsters.tentacle = {
    'name': 'Tentacle',
    'level': 50,
    'health': 5000,
    'armor': 200,
    'damage': 400,
    'attackSpeed': 1,
    'experience': 500,
    '$graphic': $ff2Monster('tentacle1'),
    'spoils': [],
    'helpText': 'A lone tentacle protrudes from the cove. Do I dare disturb the creature that dwells here?',
    'cripple': 2
};
monsters.tentacles = {
    'name': 'Tentacles',
    'level': 50,
    'health': 5000,
    'armor': 200,
    'damage': 400,
    'attackSpeed': 1,
    'experience': 500,
    '$graphic': $ff2Monster('tentacle1'),
    'spoils': [],
    'helpText': 'More tentacles keep emerging as I fight growing more powerful and interfering with my ability to attack while I\'m here. If these become too numerous I may have to retreat and try again.',
    'cripple': 2,
};
monsters.toxicStingers = {
    'name': 'Toxic Stingers',
    'level': 50,
    'health': 5000,
    'armor': 200,
    'damage': 400,
    'attackSpeed': 1,
    'experience': 500,
    '$graphic': $ff2Monster('tentacle2'),
    'spoils': [],
    'helpText': 'These stingers keep growing and splitting, dealing increasing poison damage over time as I fight in this area.',
    'poison': 50,
};
monsters.leechingTentacles = {
    'name': 'Leeching Tentacles',
    'level': 50,
    'health': 5000,
    'armor': 200,
    'damage': 400,
    'attackSpeed': 1,
    'experience': 500,
    '$graphic': $ff2Monster('tentacle3'),
    'spoils': [],
    'helpText': 'Some of the tentacles are now trying to drain my life to regenerate the core.',
    'lifesteal': 1,
};
monsters.neptuneBody = {
    'name': 'Neptune',
    'level': 50,
    'health': 250000,
    'armor': 300,
    'damage': 200,
    'attackSpeed': 2,
    'experience': 2000,
    '$graphic': $ff2Monster('hydra'),
    'spoils': [],
    'helpText': 'So this is the body of the beat. Its size is incomprehensible. Is it even possible to defeat this abomination?',
};
monsters.neptuneHead = {
    'name': 'Neptune\'s Head',
    'level': 50,
    'health': 30000,
    'armor': 300,
    'damage': 500,
    'attackSpeed': 1,
    'experience': 2000,
    '$graphic': $ff2Monster('neptuneHead'),
    'spoils': [],
    'helpText': 'The head seems to be directing the actions of all the tentacles. As long as it is present the rest of the tentacles regenerate much faster.',
};
monsters.neptuneCore = {
    'name': 'Neptune\'s Core',
    'level': 70,
    'health': 250000,
    'armor': 300,
    'damage': 2000,
    'attackSpeed': .5,
    'experience': 50000,
    '$graphic': $ff2Monster('neptuneCore'),
    'spoils': ['memoryCrystal'],
    'helpText': 'The core is exposed. I need to destroy it before the body regenerates. I will have to be quick or else it will regain all of its health.',
    'cripple': 5
};

//populate monster.key for all monsters
$.each(monsters, function (key, value) {
    value.key = key;
    value.spoils.forEach(function (value, index) {
        if (!allItems[value] && isNaN(parseInt(value))) {
            console.log("Missing item drop: " + key + ' : ' + value);
        }
    });
});