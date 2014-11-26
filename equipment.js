var armors = {}
armors.shirt = {
    'name': 'Shirt',
    'armor': 0,
    'level': 0,
    'value': 0
};
armors.furCoat = {
    'name': 'Fur Coat',
    'helpText': 'A warm fur coat.',
    'armor': 8,
    'level': 0,
    'value': 150
};
armors.bronzeArmor = {
    'name': 'Bronze Armor',
    'helpText': 'Armor made from an alloy of copper and tin.',
    'armor': 20,
    'level': 10,
    'value': 1000
};
armors.chainMail = {
    'name': 'Chain Mail',
    'helpText': 'Armor made from thousands of iron links.',
    'armor': 40,
    'level': 15,
    'value': 2200
};
armors.plateArmor = {
    'name': 'Plate Armor',
    'helpText': 'Armor made of large iron plates.',
    'armor': 65,
    'level': 25,
    'value': 9000
};
armors.steelArmor = {
    'name': 'Steel Armor',
    'helpText': 'Steel mail with embedded plates.',
    'armor': 100,
    'level': 35,
    'value': 27000
};
armors.mithrilMail = {
    'name': 'Mithril Mail',
    'helpText': 'Chain mail made from Mithril links.',
    'armor': 120,
    'level': 45,
    'value': 65000
};
armors.mithrilPlate = {
    'name': 'Mithril Plate',
    'helpText': 'Full plate armor forged from Mithril.',
    'armor': 150,
    'level': 55,
    'value': 110000
};
armors.holyArmor = {
    'name': 'Holy Armor',
    'helpText': 'Holy armor that repels evil.',
    'armor': 220,
    'level': 70,
    'value': 290000
};
armors.adamantArmor = {
    'name': 'Adamant Armor',
    'helpText': 'Mythical armor that is light and impenetrable.',
    'armor': 260,
    'level': 80,
    'value': 680000
};

var helmets = {}
helmets.hair = {
    'name': 'Hair',
    'armor': 0,
    'level': 0,
    'value': 0
};
helmets.cap = {
    'name': 'Cap',
    'helpText': 'A small cloth cap.',
    'armor': 2,
    'level': 0,
    'value': 5
};
helmets.shellHat = {
    'name': 'Shell Hat',
    'helpText': 'A hard hat made from shells.',
    'armor': 10,
    'level': 2,
    'value': 700
};
helmets.proudHat = {
    'name': 'Proud Hat',
    'helpText': 'Inspires fear in all enemies reducing their attack speed by 10%.',
    'armor': 15,
    'level': 8,
    'value': 1000
};
helmets.bronzeHelmet = {
    'name': 'Bronze Helmet',
    'helpText': 'A bronze helmet.',
    'armor': 25,
    'level': 18,
    'value': 3000
};
helmets.fullHelm = {
    'name': 'Full Helm',
    'helpText': 'A plate iron helm the covers the entire head.',
    'armor': 30,
    'level': 27,
    'value': 6000
};
helmets.steelHelmet = {
    'name': 'Steel Helmet',
    'helpText': 'A steel helmet.',
    'armor': 40,
    'level': 33,
    'value': 15000
};
helmets.silverHelmet = {
    'name': 'Silver Helmet',
    'helpText': 'A helmet made from silver.',
    'armor': 50,
    'level': 41,
    'value': 30000
};
helmets.mithrilHelmet = {
    'name': 'Mithril Helmet',
    'helpText': 'A helmet made from a magical silver alloy.',
    'armor': 60,
    'level': 50,
    'value': 100000
};
helmets.goldenHelmet = {
    'name': 'Golden Helmet',
    'helpText': 'A helmet made from a durable gold and silver alloy.',
    'armor': 80,
    'level': 60,
    'value': 200000
};
helmets.damascusHelmet = {
    'name': 'Damascus Helmet',
    'helpText': 'A helmet made of an incredibly strong material.',
    'armor': 100,
    'level': 78,
    'value': 600000
};
helmets.ribbon = {
    'name': 'Ribbon',
    'helpText': 'A magical ribbon that stops the special abilities of monsters.',
    'armor': 110,
    'level': 90,
    'value': 700000
};

var boots = {}
boots.bareFeet = {
    'name': 'Bare Feet',
    'armor': 0,
    'level': 0,
    'value': 0
};
boots.leatherBoots = {
    'name': 'Leather Boots',
    'helpText': 'Leather boots to protect your feet.',
    'armor': 7,
    'level': 0,
    'value': 200
};
boots.copperGreaves = {
    'name': 'Copper Greaves',
    'helpText': 'Leather boots with copper greaves to protect your legs.',
    'armor': 15,
    'level': 5,
    'value': 1000
};
boots.bronzeLeggings = {
    'name': 'Bronze Leggings',
    'helpText': 'Bronze armor that covers your legs.',
    'armor': 20,
    'level': 13,
    'value': 3000
};
boots.ironBoots = {
    'name': 'Iron Boots',
    'helpText': 'Boots of iron great for protecting your feet.',
    'armor': 35,
    'level': 22,
    'value': 6000
};
boots.steelLeggings = {
    'name': 'Steel Leggings',
    'helpText': 'Steel armor that covers your legs.',
    'armor': 40,
    'level': 30,
    'value': 10000
};
boots.ninjaTabi = {
    'name': 'Ninja Tabi',
    'helpText': 'Leg wear from a far off land that reduces the damage from a monsters first attack by ten percent.',
    'armor': 60,
    'level': 37,
    'value': 30000
};
boots.mithrilGreaves = {
    'name': 'Mithril Greaves',
    'helpText': 'Mithril greaves that protect your lower legs.',
    'armor': 70,
    'level': 53,
    'value': 60000
};
boots.wingedBoots = {
    'name': 'Winged Boots',
    'helpText': 'Winged boots that allow you to attack faster.',
    'armor': 80,
    'level': 65,
    'value': 100000
};
boots.giantBoots = {
    'name': 'Giant Boots',
    'helpText': 'Boots that let you cover vast distances in a single step.',
    'armor': 90,
    'level': 76,
    'value': 300000
};
boots.crystalBoots = {
    'name': 'Crystal Boots',
    'helpText': 'Boots forged from living crystal that enhance the special abilities of the wearer.',
    'armor': 130,
    'level': 85,
    'value': 1000000
};
