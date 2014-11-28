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
    'damage': 5,
    'attackSpeed': 1.5,
    'experience': 2,
    '$graphic': $ff2Monster('bee'),
    'spoils': ['wingScraps', 'wingScraps'],
    'helpText': 'A frenzied cave bat. I can fight this and other monsters to gain experience and become more powerful.'
};
monsters.zombie = {
    'name': 'Zombie',
    'level': 6,
    'health': 200,
    'armor': 0,
    'damage': 100,
    'attackSpeed': .5,
    'experience': 15,
    '$graphic': $ff2Monster('zombie'),
    'spoils': [10],
    'helpText': 'I should put this one back to rest.'
};
monsters.rat = {
    'name': 'Rat',
    'level': 3,
    'health': 20,
    'armor': 0,
    'damage': 20,
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
    'damage': 35,
    'attackSpeed': .5,
    'experience': 8,
    '$graphic': $hillaryMonster('turtle'),
    'spoils': ['smallShell', 'brokenShell', 'brokenShell', 'brokenShell'],
    'helpText': 'I\'ll need a strong weapon to pierce this monster\'s hard shell.'
};
monsters.bandit = {
    'name': 'Bandit',
    'level': 5,
    'health': 100,
    'armor': 5,
    'damage': 60,
    'attackSpeed': 1,
    'experience': 15,
    '$graphic': $ff2Monster('bandit'),
    'spoils': [30],
    'helpText': 'This should be a good test of my skills. Only monsters that are higher level than me will grant experience when I defeat them.'
};
monsters.troll = {
    'name': 'Troll',
    'level': 8,
    'health': 1000,
    'armor': 10,
    'damage': 80,
    'attackSpeed': .5,
    'experience':100,
    '$graphic': $ff2Monster('troll'),
    'spoils': [500],
    'helpText': 'This troll is guarding the only crossing of the river. Without proper gear and training, I won\'t be able to proceed.'
};
monsters.hyena = {
    'name': 'Hyena',
    'level': 6,
    'health': 160,
    'armor': 5,
    'damage': 40,
    'attackSpeed': 3,
    'experience': 20,
    '$graphic': $ff2Monster('hyena'),
    'spoils': ['largePelt', 'furScrap', 'furScrap'],
    'helpText': 'A wild hyena.'
};
monsters.lion = {
    'name': 'Lion',
    'level': 8,
    'health': 400,
    'armor': 13,
    'damage': 40,
    'attackSpeed': 1,
    'experience': 40,
    '$graphic': $ff2Monster('lion'),
    'spoils': ['lionsMane', 'largePelt', 'furScrap'],
    'armorBreak': 5,
    'helpText': 'A large cat with a beard. Its attacks are so powerful it can reduce the effectiveness of my armor over time.'
};
monsters.pirate = {
    'name': 'Pirate',
    'level': 9,
    'health': 250,
    'armor': 15,
    'damage': 80,
    'attackSpeed': 2,
    'experience': 50,
    '$graphic': $ff2Monster('pirate'),
    'spoils': [100],
    'helpText': 'Pirates have attacked the ship, I can\'t proceed unless I defeat them.'
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
    'spoils': ['reptileSkin', 'tooth', 'tooth'],
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
    'spoils': ['stinger'],
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
    '$graphic': $ff2Monster('bee'),
    'spoils': ['vampireFang', 'wingScraps', 'wingScraps'],
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
    'spoils': ['copperOre'],
    'helpText': 'Some of the mud here appears to be alive. This muck slows my attacks while the fumes deal damage over time.',
    'cripple': 2,
    'poison': 10
};
monsters.darkKnight = {
    'name': 'Dark Knight',
    'level': 15,
    'health': 10000,
    'armor': 30,
    'damage': 120,
    'attackSpeed': 3,
    'experience': 1000,
    '$graphic': $ff2Monster('darkKnight'),
    'spoils': ['memoryCrystal'],
    'helpText': 'This servant of the king has been posted here to prevent people from accessing the iron mines.',
    'armorPierce': .2
};
monsters.fowler = {
    'name': 'Fowler',
    'level': 14,
    'health': 600,
    'armor': 0,
    'damage': 120,
    'attackSpeed': 4,
    'experience': 170,
    '$graphic': $ff2Monster('flower'),
    'spoils': ['suppleTimber', 'timber'],
    'helpText': 'The pollen from this flower makes me dizzy and sneeze, reducing my opportunities to attack.',
    'cripple': 5
};
monsters.mercenary = {
    'name': 'Mercenary',
    'level': 14,
    'health': 800,
    'armor': 25,
    'damage': 100,
    'attackSpeed': 3,
    'experience': 160,
    '$graphic': $ff2Monster('mercenary'),
    'spoils': [200],
    'helpText': 'A formed soldier of the king, he now works for the highest bidder.'
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
    'spoils': ['largePelt'],
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
    'spoils': ['largeShell'],
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
    'spoils': ['tinScraps'],
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
    '$graphic': $ff2Monster('woodGolem'),
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
    'spoils': ['dragonFang', 'charcoal', 'charcoal'],
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
    'spoils': ['spiderWeb', 'spiderWeb'],
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
    'health': 15000,
    'armor': 0,
    'damage': 200,
    'attackSpeed': 2,
    'experience': 5000,
    '$graphic': $ff2Monster('witch'),
    'spoils': ['memoryCrystal'],
    'helpText': 'This witch is casting a spell to grant the evil king immense powers. Her magic spells ignore your armor entirely!',
    'armorPierce': 1
};
monsters.golem = {
    'name': 'Golem',
    'level': 27,
    'health': 10000,
    'armor': 80,
    'damage': 500,
    'attackSpeed': 1,
    'experience': 600,
    '$graphic': $ff2Monster('golem'),
    'spoils': ['ironOre', 'ironOre', 'copperOre', 'copperOre'],
    'helpText': 'A being made entirely of stone and metal.'
};
monsters.giantRat = {
    'name': 'Giant Rat',
    'level': 29,
    'health': 6000,
    'armor': 30,
    'damage': 300,
    'attackSpeed': 2,
    'experience': 800,
    '$graphic': $hillaryMonster('rat'),
    'spoils': ['largePelt', 'largePelt', 'smallPelt', 'smallPelt'],
    'helpText': 'The results of arcane magics, common pests, and boredom.'
};
monsters.gargoyle = {
    'name': 'Gargoyle',
    'level': 31,
    'health': 8000,
    'armor': 80,
    'damage': 200,
    'attackSpeed': 3,
    'experience': 900,
    '$graphic': $ff2Monster('gargoyle'),
    'spoils': ['stoneHead', 'magicRubble', 'magicRubble'],
    'helpText': 'Some strange magic has brought this statue to life.'
};
monsters.tRex = {
    'name': 'T-Rex',
    'level': 40,
    'health': 30000,
    'armor': 70,
    'damage': 500,
    'attackSpeed': 2,
    'experience': 10000,
    '$graphic': $ff2Monster('tRex'),
    'spoils': ['memoryCrystal'],
    'helpText': 'A giant prehistoric beast blocks my path further into the castle. Where did the king come by such a creature?'
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
    'spoils': ['suppleTimber', 'suppleTimber', 'timber'],
    'helpText': 'These flowers appear to have been... modified.',
    'poison': 10,
    'cripple': 5
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
    'health':10000,
    'armor': 80,
    'damage': 300,
    'attackSpeed': 4,
    'experience': 1500,
    '$graphic': $ff2Monster('royalGuard'),
    'spoils': [1500],
    'helpText': 'The elite guards of the king\'s inner sanctum. I will have to defeat them to proceed.'
};
monsters.enchantedKing = {
    'name': 'Enchanted King',
    'level': 50,
    'health': 1000000,
    'armor': 200,
    'damage': 1000,
    'attackSpeed': 2,
    'experience': 10000,
    '$graphic': $ff2Monster('king'),
    'spoils': ['memoryCrystal'],
    'helpText': 'The enchantment placed on this king makes him almost invulnerable. I should retreat and think of a way to defeat him.',
    'armorPierce': .5
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
    'helpText': 'With the enchantment gone, I may have a chance to do away with this imposter once and for all.'
};

//populate monster.key for all monsters
$.each(monsters, function (key, value) { value.key = key;});