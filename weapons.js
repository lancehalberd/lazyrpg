var weapons = {};
//Fists 1
weapons.fists = { //starting weapon
    'name': 'Fists',
    'helpText': 'Your barehands.',
    'damage': 5,
    'attackSpeed': 2,
    'type': 'fist',
    'level': 0,
    'value': 0
};
weapons.clothGloves = { //can be purchased in the village
    'name': 'Cloth Gloves',
    'helpText': 'Wearing these is a little bit better than fighting with your bare hands.',
    'damage': 7,
    'attackSpeed': 2,
    'type': 'fist',
    'level': 0,
    'value': 5
};
weapons.leatherGloves = { //can be crafted from leather by poaching rats
    'name': 'Leather Gloves',
    'helpText': 'These gloves protect your hands allowing you to punch harder and faster.',
    'damage': 20,
    'attackSpeed': 3,
    'type': 'fist',
    'level': 1,
    'value': 200
};
weapons.brassKnuckles = { //can be crafted from copper ingots by mining copper
    'name': 'Brass Knuckles',
    'helpText': 'These metal knuckles worn on your fingers can do some serious damage.',
    'damage': 40,
    'attackSpeed': 2,
    'type': 'fist',
    'level': 1,
    'value': 500,
    'armorBreak': 1
};
//Fists 2
weapons.claws = { //can be purchased when first arriving at the city
    'name': 'Claws',
    'helpText': 'Iron claws for hand to hand combat.',
    'damage': 70,
    'attackSpeed': 2,
    'type': 'fist',
    'level': 2,
    'value': 1000,
    'poison': 10
};
weapons.cestus = { //can be crafted from gloves, steel plating and silvered steel when silver can be mined
    'name': 'Cestus',
    'helpText': 'Fighting gloves lined with silver and iron. Easy on your hands, tough on monsters.',
    'damage': 80,
    'attackSpeed': 2.5,
    'type': 'fist',
    'level': 2,
    'value': 8000,
    'armorBreak': 2
};
weapons.tigerClaws = { //need claws from saver tooth tigers
    'name': 'Tiger Claws',
    'helpText': 'These razor sharp tiger claws are stronger and sharper than most metals.',
    'damage': 90,
    'attackSpeed': 3,
    'type': 'fist',
    'level': 2,
    'value': 20000,
    'lifeSteal': .1
};
//Fists 3
weapons.midasTouch = { //need to mine gold
    'name': 'The Midas Touch',
    'helpText': 'Gaudy gauntlets made of gold.',
    'damage': 110,
    'attackSpeed': 3,
    'type': 'fist',
    'level': 3,
    'value': 50000,
    'armorBreak': 2
};
weapons.titanFists = { //need to mine titanium
    'name': "Titan's Fists",
    'helpText': 'Lightweight gloves plated with titanium. Hit fast, hit hard.',
    'damage': 140,
    'attackSpeed': 3.5,
    'type': 'fist',
    'level': 3,
    'value': 100000,
    'armorBreak': 5
};
weapons.dragonFangs = { //need poached dragon fangs and adamantium
    'name': 'Dragon Fangs',
    'helpText': 'Claws made from the fangs of a venomous dragon.',
    'damage': 150,
    'attackSpeed': 4,
    'type': 'fist',
    'level': 3,
    'value': 500000,
    'poison': 100
};

//Swords 1
weapons.copperSword = { //mine copper
    'name': 'Copper Sword',
    'helpText': 'This copper blade is short but sturdy.',
    'damage': 40,
    'attackSpeed': 1.5,
    'type': 'sword',
    'level': 1,
    'value': 800
};
weapons.longSword = { //mine tin
    'name': 'Long Sword',
    'helpText': 'A sword made from bronze with a long blade.',
    'damage': 60,
    'attackSpeed': 1.5,
    'type': 'sword',
    'level': 1,
    'value': 2000
};
weapons.broadSword = { //mine iron
    'name': 'Broad Sword',
    'helpText': 'A large, two-handed sword made from iron.',
    'damage': 80,
    'attackSpeed': 1.5,
    'type': 'sword',
    'level': 1,
    'value': 5000
};
//Swords 2
weapons.claymore = { //charcoal from whelps
    'name': 'Claymore',
    'helpText': 'The cross hilt on this large sword can be used to deflect enemy attacks.',
    'damage': 90,
    'attackSpeed': 2,
    'type': 'sword',
    'level': 2,
    'value': 10000,
    'parry': 20
};
weapons.silverSword = { //mine silver
    'name': 'Silver Sword',
    'helpText': 'The silver alloy in this sword is anethema to monsters.',
    'damage': 120,
    'attackSpeed': 2,
    'type': 'sword',
    'level': 2,
    'value': 21000,
    'armorPierce': .4
};
weapons.katana = { //craft mithril
    'name': 'Katana',
    'helpText': 'A sword with a slender curved blade wielded by Samurai.',
    'damage': 150,
    'attackSpeed': 2,
    'type': 'sword',
    'level': 2,
    'value': 40000,
    'parry': 30,
    'armorPierce': .3
};
//Swords 3
weapons.kotetsu = { //platinum
    'name': 'Kotetsu',
    'helpText': 'A blood thirsty sword that feeds on the souls of monsters.',
    'damage': 180,
    'attackSpeed': 2.5,
    'type': 'sword',
    'level': 3,
    'value': 60000,
    'lifeSteal': .1
};
weapons.excalibur = { //titanium
    'name': 'Excalibur',
    'helpText': 'A famous sword of legend.',
    'damage': 240,
    'attackSpeed': 2.5,
    'type': 'sword',
    'level': 3,
    'value': 120000,
    'parry': 50
};
weapons.blackSwordYoru = { //adamantium
    'name': 'Black Sword Yoru',
    'helpText': 'A giant black sword wielded by the greatest swordsmen in the world.',
    'damage': 250,
    'attackSpeed': 3,
    'type': 'sword',
    'level': 3,
    'value': 400000,
    'armorPierce': .5
};

//Clubs 1
weapons.club = {//first shop
    'name': 'Club',
    'helpText': 'A club made from hard, durable wood.',
    'damage': 30,
    'attackSpeed': 1,
    'type': 'club',
    'level': 1,
    'value': 50
};
weapons.cudgel = {//city shop
    'name': 'Cudgel',
    'helpText': 'A larger club sporting iron spikes.',
    'damage': 70,
    'attackSpeed': 1,
    'type': 'club',
    'level': 1,
    'value': 1000,
    'armorBreak': 5
};
weapons.hammer = {//timber and iron
    'name': 'Hammer',
    'helpText': 'An iron hammer with a long wooden shaft.',
    'damage': 110,
    'attackSpeed': 1,
    'type': 'club',
    'level': 1,
    'value': 4000,
    'cripple': 1
};
//Clubs 2
weapons.mace = {//charcoal -> steel
    'name': 'Mace',
    'helpText': 'A steel club with a heavy studded ball on one end.',
    'damage': 150,
    'attackSpeed': 1.25,
    'type': 'club',
    'level': 1,
    'value': 7000,
    'armorBreak': 5
};
weapons.silverMallet = { //silver
    'name': 'Silver Mallet',
    'helpText': 'A hammer made from a silver alloy that monsters hate.',
    'damage': 190,
    'attackSpeed': 1.25,
    'type': 'club',
    'level': 2,
    'value': 20000,
    'cripple': 3
};
weapons.morningStar = { //mithril
    'name': 'Morning Star',
    'helpText': 'A club with a larged spiked ball on the end.',
    'damage': 230,
    'attackSpeed': 1.25,
    'type': 'club',
    'level': 2,
    'value': 35000,
    'armorBreak': 10
};
//Clubs 3
weapons.warHammer ={ //platinum
    'name': 'War Hammer',
    'helpText': 'A huge, heavy hammer made entirely out of a strong metal alloy.',
    'damage': 270,
    'attackSpeed': 1.5,
    'type': 'club',
    'level': 3,
    'value': 100000,
    'cripple': 5
};
weapons.maceOfTheDarkLord ={//titanium
    'name': 'Mace of the Dark Lord',
    'helpText': 'A powerful mace topped with violent jagged blades.',
    'damage': 330,
    'attackSpeed': 1.75,
    'type': 'club',
    'level': 3,
    'value': 200000,
    'parry': 30
};
weapons.mjolnir = {//adamantium
    'name': 'Mjolnir',
    'helpText': 'The hammer of a god, capable of breaking through any fortification.',
    'damage': 370,
    'attackSpeed': 2,
    'type': 'club',
    'level': 3,
    'value': 400000,
    'armorBreak': 15
};

//Bows 1
weapons.shortBow = { //village shop
    'name': 'Short Bow',
    'helpText': 'A simple bow, slow, but deadly.',
    'damage': 40,
    'attackSpeed': .5,
    'type': 'bow',
    'level': 1,
    'value': 40
};
weapons.crossbow = { //port shop
    'name': 'Hand Crossbow',
    'helpText': 'A small mechanized bow that shoots copper bolts. Easy to use but a little weak.',
    'damage': 50,
    'attackSpeed': 1,
    'type': 'bow',
    'level': 1,
    'value': 500
};
weapons.longBow = { //timber and iron
    'name': 'Long Bow',
    'helpText': 'A full sized bow. Powerful, but difficult to use.',
    'damage': 200,
    'attackSpeed': .5,
    'type': 'bow',
    'level': 1,
    'value': 2000,
    'cripple': 1
};
//Bows 2
weapons.compositeBow = { //supple+sturdy timber and iron
    'name': 'Composite Bow',
    'helpText': 'By combining materials, this compact bow is easier to use and more powerful than a simple long bow.',
    'damage': 220,
    'attackSpeed': .75,
    'type': 'bow',
    'level': 2,
    'value': 5000,
    'armorPierce': .2
};
weapons.handBalista = { //sturdy timber + steel
    'name': 'Hand Balista',
    'helpText': 'A siege weapon, shrunken so that it can be used by one person. Barely.',
    'damage': 450,
    'attackSpeed': .5,
    'type': 'bow',
    'level': 2,
    'value': 20000,
    'cripple': 3
};
weapons.vampireSlayer = { //timber + mithril
    'name': 'Vampire Slayer',
    'helpText': 'A stronger crossbow loaded with silver bolts.',
    'damage': 400,
    'attackSpeed': .75,
    'type': 'bow',
    'level': 2,
    'value': 30000,
    'poison': 40,
};
//Bows 3
weapons.compoundBow = { //gold
    'name': 'Compound Bow',
    'helpText': 'An engineering masterpiece, this bow uses pulleys to increase power and easy of use.',
    'damage': 500,
    'attackSpeed': .75,
    'type': 'bow',
    'level': 3,
    'value': 50000,
    'cripple': 2
};
weapons.deathBow = { //platinum
    'name': 'Death Bow',
    'helpText': 'The complex mechanism in this bow coats each arrow in the corrosive blood of the hydra as it is fired.',
    'damage': 1000,
    'attackSpeed': .5,
    'type': 'bow',
    'level': 3,
    'value': 300000,
    'poison': 200
};
weapons.runeBow = { //adamantium
    'name': 'Rune Bow',
    'helpText': 'This enchanted bow fires arrows of pure energy.',
    'damage': 600,
    'attackSpeed': 1,
    'type': 'bow',
    'level': 3,
    'value': 400000,
    'armorPierce': .4
};