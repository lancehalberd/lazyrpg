function $ff2Monster(name) {
    return $div('ff2Monster '+name);
}
function $hillaryMonster(name) {
    return $div('hillaryMonster ' + name);
}

var monsters = {};

monsters.bat = {
    'name': 'Bat',
    'level': 1,
    'health': 20,
    'armor': 0,
    'damage': 5,
    'attackSpeed': 1.5,
    'experience': 2,
    '$graphic': $ff2Monster('bee'),
    'spoils': ['wingScraps', 'wingScraps']
};
monsters.zombie = {
    'name': 'Zombie',
    'level': 5,
    'health': 200,
    'armor': 0,
    'damage': 100,
    'attackSpeed': .5,
    'experience': 15,
    '$graphic': $ff2Monster('zombie'),
    'spoils': [10]
};
monsters.rat = {
    'name': 'Rat',
    'level': 2,
    'health': 20,
    'armor': 0,
    'damage': 20,
    'attackSpeed': 1,
    'experience': 4,
    '$graphic': $hillaryMonster('rat'),
    'spoils': ['smallPelt', 'furScrap', 'furScrap']
};
monsters.turtus = {
    'name': 'Turtus',
    'level': 3,
    'health': 50,
    'armor': 10,
    'damage': 35,
    'attackSpeed': .5,
    'experience': 8,
    '$graphic': $hillaryMonster('turtle'),
    'spoils': ['smallShell', 'brokenShell', 'brokenShell', 'brokenShell']
};
monsters.bandit = {
    'name': 'Bandit',
    'level': 4,
    'health': 100,
    'armor': 5,
    'damage': 60,
    'attackSpeed': 1,
    'experience': 15,
    '$graphic': $ff2Monster('bandit'),
    'spoils': [30]
};
monsters.troll = {
    'name': 'Troll',
    'level': 6,
    'health': 1000,
    'armor': 10,
    'damage': 80,
    'attackSpeed': .5,
    'experience':100,
    '$graphic': $ff2Monster('troll'),
    'spoils': [500]
};
monsters.hyena = {
    'name': 'Hyena',
    'level': 5,
    'health': 160,
    'armor': 5,
    'damage': 40,
    'attackSpeed': 3,
    'experience': 20,
    '$graphic': $ff2Monster('hyena'),
    'spoils': ['largePelt', 'furScrap', 'furScrap']
};
monsters.lion = {
    'name': 'Lion',
    'level': 7,
    'health': 200,
    'armor': 13,
    'damage': 60,
    'attackSpeed': 1,
    'experience': 40,
    '$graphic': $ff2Monster('lion'),
    'spoils': ['lionsMane', 'largePelt', 'furScrap']
};
monsters.pirate = {
    'name': 'Pirate',
    'level': 8,
    'health': 250,
    'armor': 15,
    'damage': 80,
    'attackSpeed': 2,
    'experience': 50,
    '$graphic': $ff2Monster('pirate'),
    'spoils': [100]
};
monsters.crocodile = {
    'name': 'Crocodile',
    'level': 9,
    'health': 400,
    'armor': 15,
    'damage': 100,
    'attackSpeed': 1,
    'experience': 80,
    '$graphic': $ff2Monster('crocodile'),
    'spoils': ['reptileSkin', 'tooth', 'tooth']
};
monsters.fowler = {
    'name': 'Fowler',
    'level': 10,
    'health': 600,
    'armor': 10,
    'damage': 100,
    'attackSpeed': 1,
    'experience': 90,
    '$graphic': $ff2Monster('flower'),
    'spoils': ['timber','timber']
};
monsters.scorpion = {
    'name': 'Scorpion',
    'level': 10,
    'health': 500,
    'armor': 5,
    'damage': 80,
    'attackSpeed': 2,
    'experience': 90,
    '$graphic': $ff2Monster('scorpion'),
    'spoils': ['stinger']
};
monsters.vampireBat = {
    'name': 'Vampire Bat',
    'level': 11,
    'health': 500,
    'armor': 0,
    'damage': 70,
    'attackSpeed': 4,
    'experience': 120,
    '$graphic': $ff2Monster('bee'),
    'spoils': ['vampireFang', 'wingScraps', 'wingScraps']
};
monsters.mudGolem = {
    'name': 'Mud Golem',
    'level': 12,
    'health': 1000,
    'armor': 10,
    'damage': 100,
    'attackSpeed': 2,
    'experience': 140,
    '$graphic': $ff2Monster('mudGolem'),
    'spoils': ['copperOre']
};
monsters.darkKnight = {
    'name': 'Dark Knight',
    'level': 12,
    'health': 10000,
    'armor': 30,
    'damage': 120,
    'attackSpeed': 3,
    'experience': 1000,
    '$graphic': $ff2Monster('darkKnight'),
    'spoils': ['ironIngot']
};
monsters.mercenary = {
    'name': 'Mercenary',
    'level': 13,
    'health': 800,
    'armor': 25,
    'damage': 100,
    'attackSpeed': 3,
    'experience': 160,
    '$graphic': $ff2Monster('mercenary'),
    'spoils': [200]
};
monsters.bear = {
    'name': 'Bear',
    'level': 14,
    'health': 1500,
    'armor': 20,
    'damage': 200,
    'attackSpeed': 2,
    'experience': 180,
    '$graphic': $ff2Monster('bear'),
    'spoils': ['largePelt']
};
monsters.giantTortoise = {
    'name': 'Giant Tortoise',
    'level': 15,
    'health': 3000,
    'armor': 50,
    'damage': 150,
    'attackSpeed': 1,
    'experience': 200,
    '$graphic': $hillaryMonster('turtle'),
    'spoils': ['largeShell']
};
monsters.possessedGuard = {
    'name': 'Possessed Guard',
    'level': 16,
    'health': 1500,
    'armor': 30,
    'damage': 180,
    'attackSpeed': 2,
    'experience': 250,
    '$graphic': $ff2Monster('guard'),
    'spoils': [300]
};
monsters.maverick = {
    'name': 'Maverick',
    'level': 17,
    'health': 2000,
    'armor': 25,
    'damage': 400,
    'attackSpeed': .8,
    'experience': 300,
    '$graphic': $ff2Monster('maverick'),
    'spoils': ['tinScraps']
};
monsters.woodGolem = {
    'name': 'Wood Golem',
    'level': 18,
    'health': 5000,
    'armor': 20,
    'damage': 200,
    'attackSpeed': 2,
    'experience': 350,
    '$graphic': $ff2Monster('woodGolem'),
    'spoils': ['sturdyTimber', 'sturdyTimber', 'timber']
};
monsters.whelp = {
    'name': 'Whelp',
    'level': 20,
    'health': 4000,
    'armor': 40,
    'damage': 200,
    'attackSpeed': 2,
    'experience': 400,
    '$graphic': $hillaryMonster('dragon'),
    'spoils': ['dragonFang', 'charcoal', 'charcoal']
};
monsters.spider = {
    'name': 'Spider',
    'level': 22,
    'health': 3000,
    'armor': 20,
    'damage': 200,
    'attackSpeed': 3,
    'experience': 1000,
    '$graphic': $ff2Monster('spider'),
    'spoils': ['spiderWeb', 'spiderWeb']
};
monsters.possessedCaptain = {
    'name': 'Possessed Captain',
    'level': 24,
    'health': 6000,
    'armor': 30,
    'damage': 200,
    'attackSpeed': 3,
    'experience': 450,
    '$graphic': $ff2Monster('captain'),
    'spoils': [500]
};
monsters.witch = {
    'name': 'Witch',
    'level': 30,
    'health': 20000,
    'armor': 0,
    'damage': 300,
    'attackSpeed': 2,
    'experience': 5000,
    '$graphic': $ff2Monster('witch'),
    'spoils': ['dragonFang']
};
monsters.golem = {
    'name': 'Golem',
    'level': 25,
    'health': 10000,
    'armor': 80,
    'damage': 500,
    'attackSpeed': 2,
    'experience': 600,
    '$graphic': $ff2Monster('golem'),
    'spoils': ['ironOre', 'ironOre', 'copperOre', 'copperOre']
};
monsters.giantRat = {
    'name': 'Giant Rat',
    'level': 28,
    'health': 6000,
    'armor': 30,
    'damage': 300,
    'attackSpeed': 2,
    'experience': 800,
    '$graphic': $hillaryMonster('rat'),
    'spoils': ['largePelt', 'smallPelt', 'smallPelt', 'furScrap']
};
monsters.gargoyle = {
    'name': 'Gargoyle',
    'level': 30,
    'health': 8000,
    'armor': 80,
    'damage': 200,
    'attackSpeed': 3,
    'experience': 900,
    '$graphic': $ff2Monster('gargoyle'),
    'spoils': ['stoneHead', 'magicRubble', 'magicRubble']
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
    'spoils': ['goldIngot']
};
monsters.doomFlower = {
    'name': 'Doom Flower',
    'level': 32,
    'health': 9000,
    'armor': 40,
    'damage': 200,
    'attackSpeed': 2,
    'experience': 1000,
    '$graphic': $ff2Monster('flower'),
    'spoils': ['suppleTimber', 'timber']
};
monsters.giantSpider = {
    'name': 'Giant Spider',
    'level': 34,
    'health': 12000,
    'armor': 50,
    'damage': 400,
    'attackSpeed': 3,
    'experience': 1200,
    '$graphic': $ff2Monster('spider'),
    'spoils': ['strongWeb', 'spiderWeb', 'spiderWeb']
};
monsters.royalGuard = {
    'name': 'Royal Guard',
    'level': 36,
    'health':10000,
    'armor': 80,
    'damage': 300,
    'attackSpeed': 4,
    'experience': 1500,
    '$graphic': $ff2Monster('royalGuard'),
    'spoils': [1500]
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
    'spoils': ['platinumIngot']
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
    'spoils': ['platinumIngot']
};

//populate monster.key for all monsters
$.each(monsters, function (key, value) { value.key = key;});