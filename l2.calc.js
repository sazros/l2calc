window.l2 = window.l2 || {};
window.l2.calc = window.l2.calc || {};

l2.calc.forEachEffect = function (char, stat, callback) {
	char.effects.forEach(function (s) {
		var skill = l2.data.tools.getSkill(s.id);
		if (skill.effects == null)
			return;
		for (var j = 0; j < skill.effects.length; j++)
			if (skill.effects[j].stat == stat) {
				var val = (typeof skill.effects[j].val == 'number' ? skill.effects[j].val : skill.effects[j].val[s.lvl - 1]);
				if (l2.calc.checkConditions(char, skill.effects[j].using, skill.effects[j].hp, skill.effects[j].atkFrom))
					callback(skill.effects[j].op, val);
			}
	});
};

l2.calc.checkUsing = function (char, using) {
	if (!using)
		return true;
	if (!char.weapon)
		return false;
	switch (using) {
		case 'Pole': return char.weapon.weaponType == 'pole';
		case 'Sword': return char.weapon.weaponType == 'sword';
		case 'Big Sword': return char.weapon.weaponType == 'bigsword';
		case 'Blunt': return char.weapon.weaponType == 'blunt';
		case 'Big Blunt': return char.weapon.weaponType == 'bigblunt';
		case 'Dual Fist': return char.weapon.weaponType == 'dualfist';
		case 'Bow': return char.weapon.weaponType == 'bow';
		case 'Dagger': return char.weapon.weaponType == 'dagger';
		case 'Dual Dagger': return char.weapon.weaponType == 'dualdagger';
		case 'Rapier': return char.weapon.weaponType == 'rapier';
		case 'Ancient': return char.weapon.weaponType == 'ancientsword';
		case 'Dual Sword': return char.weapon.weaponType == 'dual';
		case 'Crossbow': return char.weapon.weaponType == 'crossbow';
		case 'Light': return char.armorType == 'light';
		case 'Heavy': return char.armorType == 'heavy';
		case 'Magic': return char.armorType == 'magic';
		case 'not(Magic)': return char.armorType != 'magic';
		case 'Sigil': return false;
		default: throw 'Using [' + using + '] not implemented';
	}
};

l2.calc.checkConditions = function (char, usings, hp, atkFrom) {
	if (usings) {
		var ok = false;
		var parts = usings.split(',');
		for (var i = 0; i < parts.length; i++)
			ok = ok || l2.calc.checkUsing(char, parts[i]);
		if (!ok)
			return false;
	}
	if (hp && char.hpPerc > hp)
		return false;
	if (atkFrom && char.atkFrom != atkFrom)
		return false;
	return true;
};

l2.calc.baseStats = function (char) {
	l2.calc.forEachEffect(char, 'STR', function (op, val) {
		if (op == 'add') { char.baseStats.str += val; return; }
		throw 'not implemented';
	});
	l2.calc.forEachEffect(char, 'DEX', function (op, val) {
		if (op == 'add') { char.baseStats.dex += val; return; }
		throw 'not implemented';
	});
	l2.calc.forEachEffect(char, 'CON', function (op, val) {
		if (op == 'add') { char.baseStats.con += val; return; }
		throw 'not implemented';
	});
	l2.calc.forEachEffect(char, 'INT', function (op, val) {
		if (op == 'add') { char.baseStats.int += val; return; }
		throw 'not implemented';
	});
	l2.calc.forEachEffect(char, 'WIT', function (op, val) {
		if (op == 'add') { char.baseStats.wit += val; return; }
		throw 'not implemented';
	});
	l2.calc.forEachEffect(char, 'MEN', function (op, val) {
		if (op == 'add') { char.baseStats.men += val; return; }
		throw 'not implemented';
	});
};

l2.calc.HP = function (char) {
	var _class = char._class;
	if (_class.prof == 3)
		_class = l2.data.tools.getClass(_class.parent);
	if (_class.prof == 2 && char.lvl < 40)
		_class = l2.data.tools.getClass(_class.parent);
	if (_class.prof == 1 && char.lvl < 20)
		_class = l2.data.tools.getClass(_class.parent);
	var coefs = l2.data.tools.getBaseHPCoefs(_class.id);
	var baseHP = coefs.a + coefs.b * char.lvl + coefs.c * char.lvl * char.lvl;
	var addHP = 0;
	var multHP = 1;
	l2.calc.forEachEffect(char, 'maxHp', function (op, val) {
		if (op == 'add') { addHP += val; return; }
		if (op == 'sub') { addHP -= val; return; }
		if (op == 'mul') { multHP *= val; return; }
		throw 'not implemented';
	});
	['shield', 'helmet', 'bodyUpper', 'bodyLower', 'gloves', 'boots', 'underwear', 'belt'].forEach(function (part) {
		if (char[part] && char[part].grade) {
			if (char.enchants[part] >= 4)
				if (char[part].bodyPart == 'onepiece')
					addHP += l2.data.oeArmorHPBonus[char[part].grade.charAt(0)].fullbody[char.enchants[part] - 4];
				else
					addHP += l2.data.oeArmorHPBonus[char[part].grade.charAt(0)].single[char.enchants[part] - 4];
		}
	});
	var conBonus = l2.data.statBonus['con'][char.baseStats.con];
	return Math.floor(baseHP * conBonus * multHP + addHP);
};

l2.calc.CP = function (char) {
	var _class = char._class;
	if (_class.prof == 3)
		_class = l2.data.tools.getClass(_class.parent);
	if (_class.prof == 2 && char.lvl < 40)
		_class = l2.data.tools.getClass(_class.parent);
	if (_class.prof == 1 && char.lvl < 20)
		_class = l2.data.tools.getClass(_class.parent);
	var coefs = l2.data.tools.getBaseHPCoefs(_class.id);
	var baseHP = coefs.a + coefs.b * char.lvl + coefs.c * char.lvl * char.lvl;
	var addCP = 0;
	var multCP = 1;
	l2.calc.forEachEffect(char, 'maxCp', function (op, val) {
		if (op == 'add') { addCP += val; return; }
		if (op == 'mul') { multCP *= val; return; }
		throw 'not implemented';
	});
	var conBonus = l2.data.statBonus['con'][char.baseStats.con];
	return Math.floor(baseHP * conBonus * coefs.cpMod * multCP + addCP);
};

l2.calc.applyArmorEnchant = function (pDef, grade, enchant) {
	if (!grade)
		return pDef;
	else {
		var delta = 0;
		delta += Math.min(3, enchant) * 1;
		delta += Math.max(0, enchant - 3) * 3;
		return pDef + delta;
	}
};

l2.calc.helmetPDef = function (char) {
	if (char.helmet)
		return l2.calc.applyArmorEnchant(char.helmet.pDef, char.helmet.grade, char.enchants.helmet);
	else
		return 12;
};

l2.calc.bodyUpperPdef = function (char) {
	if (char.bodyUpper)
		return l2.calc.applyArmorEnchant(char.bodyUpper.pDef, char.bodyUpper.grade, char.enchants.bodyUpper);
	else
		return l2.data.tools.isMystic(char._class.id) ? 15 : 31;
};

l2.calc.bodyLowerPDef = function (char) {
	if (char.bodyUpper == null || char.bodyUpper.bodyPart != 'onepiece') {
		if (char.bodyLower)
			return l2.calc.applyArmorEnchant(char.bodyLower.pDef, char.bodyLower.grade, char.enchants.bodyLower);
		else
			return l2.data.tools.isMystic(char._class.id) ? 8 : 18;
	} else
		return 0;
};

l2.calc.glovesPDef = function (char) {
	if (char.gloves)
		return l2.calc.applyArmorEnchant(char.gloves.pDef, char.gloves.grade, char.enchants.gloves);
	else
		return 8;
};

l2.calc.bootsPDef = function (char) {
	if (char.boots)
		return l2.calc.applyArmorEnchant(char.boots.pDef, char.boots.grade, char.enchants.boots);
	else
		return 7;
};

l2.calc.pDef = function (char) {
	var armorPdef = 0;
	armorPdef += l2.calc.helmetPDef(char);
	armorPdef += l2.calc.bodyUpperPdef(char);
	armorPdef += l2.calc.bodyLowerPDef(char);
	armorPdef += l2.calc.glovesPDef(char);
	armorPdef += l2.calc.bootsPDef(char);
	var addPdef = 0;
	var multPdef = 1;
	l2.calc.forEachEffect(char, 'pDef', function (op, val) {
		if (op == 'add') { addPdef += val; return; }
		if (op == 'mul') { multPdef *= val; return; }
		throw 'not implemented';
	});
	return Math.floor((4 + armorPdef) * char.lm * multPdef + addPdef);
};

l2.calc.weaponPAtk = function (char) {
	if (char.weapon) {
		var enchant = l2.model.weapon.enchant;
		var delta = 0;
		if (char.weapon.grade) {
			var d = 0;
			if (['bow', 'crossbow'].indexOf(char.weapon.weaponType) >= 0)
				d = l2.data.weaponEnchant[char.weapon.grade].bow;
			if (['bigsword', 'bigblunt', 'dualsword', 'dualfist'].indexOf(char.weapon.weaponType) >= 0)
				d = l2.data.weaponEnchant[char.weapon.grade].twoHand;
			if (d == 0)
				d = l2.data.weaponEnchant[char.weapon.grade].oneHand;
			delta += Math.min(3, enchant) * d;
			delta += Math.max(0, enchant - 3) * 2 * d;
		};
		return char.weapon.pAtk + delta;
	} else
		if (l2.data.subRace[char._class.subRace].fighter)
			return 4;
		else
			return 3;
};

l2.calc.pAtk = function (char) {
	var addPAtk = 0;
	var multPAtk = 1;
	l2.calc.forEachEffect(char, 'pAtk', function (op, val) {
		if (op == 'add') { addPAtk += val; return; }
		if (op == 'mul') { multPAtk *= val; return; }
		throw 'not implemented';
	});
	var strBonus = l2.data.statBonus['str'][char.baseStats.str];
	return Math.floor(l2.calc.weaponPAtk(char) * char.lm * strBonus * multPAtk + addPAtk);
};

l2.calc.pCritical = function (char) {
	var weaponBaseCritical = char.weapon == null ? 40 : l2.data.tools.getBaseCritical(char.weapon.weaponType);
	var dexBonus = l2.data.statBonus['dex'][char.baseStats.dex];
	var baseCritial = weaponBaseCritical * dexBonus;
	var addCritial = 0;
	l2.calc.forEachEffect(char, 'rCrit', function (op, val) {
		if (op == 'basemul') { addCritial += baseCritial * val; return; }
		if (op == 'add') { addCritial += val; return; }
		throw 'not implemented';
	});
	return Math.min(Math.round(baseCritial + addCritial), 500);
};

l2.calc.pCritMultiplier = function (char) {
	var mult = 2;
	l2.calc.forEachEffect(char, 'cAtk', function (op, val) {
		if (op == 'mul') { mult *= val; return; }
		throw 'not implemented';
	});
	return mult;
};

l2.calc.pCritAtk = function (char, stats) {
	var addCritPAtk = 0;
	l2.calc.forEachEffect(char, 'cAtkAdd', function (op, val) {
		if (op == 'add') { addCritPAtk += val; return; };
		throw 'not implemented';
	});
	return Math.floor(stats.pAtk * stats.pCritMultiplier + addCritPAtk);
};

l2.calc.atkSpeed = function (char) {
	var baseWeaponAtkSpeed = char.weapon == null ? 325 : l2.data.tools.getBaseAtkSpeed(char.weapon.weaponType);
	var dexBonus = l2.data.statBonus['dex'][char.baseStats.dex];
	var multAtkSpeed = 1;
	l2.calc.forEachEffect(char, 'pAtkSpd', function (op, val) {
		if (op == 'mul') { multAtkSpeed *= val; return; }
		throw 'not implemented';
	});
	return Math.min(Math.floor(dexBonus * baseWeaponAtkSpeed * multAtkSpeed), 1500);
};

l2.calc.accuracy = function (char) {
	var addAcc = 0;
	if (char.weapon) {
		if (['dagger', 'bow', 'pole', 'dualdagger'].indexOf(char.weapon.weaponType) >= 0)
			addAcc -= 3.75;
		if (['blunt', 'bigblunt', 'dualfist'].indexOf(char.weapon.weaponType) >= 0)
			addAcc += 4.75;
	}
	l2.calc.forEachEffect(char, 'accCombat', function (op, val) {
		if (op == 'add') { addAcc += val; return; }
		if (op == 'sub') { addAcc -= val; return; }
		throw 'not implemented';
	});
	return Math.floor(Math.sqrt(char.baseStats.dex) * 6 + char.lvl + addAcc) + l2.data.accuracyFix[char.lvl];
};

l2.calc.pDPS = function (char) {
	return (char.pAtk * (1 - char.pCritical / 1000) + char.pCritAtk * char.pCritical / 1000) * char.atkSpeed / 100;
};

l2.calc.weaponMAtk = function (char) {
	if (char.weapon) {
		var enchant = l2.model.weapon.enchant;
		var delta = 0;
		if (char.weapon.grade) {
			var d = l2.data.weaponEnchant[char.weapon.grade].mAtk;
			delta += Math.min(3, enchant) * d;
			delta += Math.max(0, enchant - 3) * 2 * d;
		};
		return char.weapon.pAtk + delta;
	} else
		return 6;
};

l2.calc.mAtk = function (char) {
	var addMAtk = 0;
	var multMAtk = 1;
	l2.calc.forEachEffect(char, 'mAtk', function (op, val) {
		if (op == 'add') { addMAtk += val; return; }
		if (op == 'mul') { multMAtk *= val; return; }
		throw 'not implemented';
	});
	var intBonus = l2.data.statBonus['int'][char.baseStats.int];
	return Math.floor(l2.calc.weaponMAtk(char) * char.lm * char.lm * intBonus * intBonus * multMAtk + addMAtk);
};

l2.calc.castSpeed = function (char) {
	var addCSpeed = 0;
	var multCSpeed = 1;
	l2.calc.forEachEffect(char, 'mAtkSpd', function (op, val) {
		if (op == 'add') { addCSpeed += val; return; }
		if (op == 'mul') { multCSpeed *= val; return; }
		throw 'not implemented';
	});
	var witBonus = l2.data.statBonus['wit'][char.baseStats.wit];
	return Math.floor(333 * witBonus * multCSpeed + addCSpeed);
};

l2.calc.speed = function (char) {
	var addSpeed = 0;
	var multSpeed = 1;
	l2.calc.forEachEffect(char, 'runSpd', function (op, val) {
		if (op == 'add') { addSpeed += val; return; }
		if (op == 'mul') { multSpeed *= val; return; }
		throw 'not implemented';
	});
	var dexBonus = l2.data.statBonus['dex'][char.baseStats.dex];
	return Math.floor(l2.data.subRace[char._class.subRace].baseSpeed * dexBonus * multSpeed + addSpeed);
};

l2.calc.evasion = function (char) {
	var addEva = 0;
	l2.calc.forEachEffect(char, 'rEvas', function (op, val) {
		if (op == 'add') { addEva += val; return; }
		if (op == 'sub') { addEva -= val; return; }
		throw 'not implemented';
	});
	return Math.floor(Math.sqrt(char.baseStats.dex) * 6 + char.lvl + addEva);
};

l2.calc.necklaceMDef = function (char) {
	if (char.necklace)
		return l2.calc.applyArmorEnchant(char.necklace.mDef, char.necklace.grade, char.enchants.necklace);
	else
		return 13;
};

l2.calc.earring1MDef = function (char) {
	if (char.earring1)
		return l2.calc.applyArmorEnchant(char.earring1.mDef, char.earring1.grade, char.enchants.earring1);
	else
		return 9;
};

l2.calc.earring2MDef = function (char) {
	if (char.earring2)
		return l2.calc.applyArmorEnchant(char.earring2.mDef, char.earring2.grade, char.enchants.earring2);
	else
		return 9;
};

l2.calc.ring1MDef = function (char) {
	if (char.ring1)
		return l2.calc.applyArmorEnchant(char.ring1.mDef, char.ring1.grade, char.enchants.ring1);
	else
		return 5;
};

l2.calc.ring2MDef = function (char) {
	if (char.ring2)
		return l2.calc.applyArmorEnchant(char.ring2.mDef, char.ring2.grade, char.enchants.ring2);
	else
		return 5;
};

l2.calc.mDef = function (char) {
	var jewelryMdef = 0;
	jewelryMdef += l2.calc.necklaceMDef(char);
	jewelryMdef += l2.calc.earring1MDef(char);
	jewelryMdef += l2.calc.earring2MDef(char);
	jewelryMdef += l2.calc.ring1MDef(char);
	jewelryMdef += l2.calc.ring2MDef(char);
	var addMdef = 0;
	var multMdef = 1;
	l2.calc.forEachEffect(char, 'mDef', function (op, val) {
		if (op == 'add') { addMdef += val; return; }
		if (op == 'mul') { multMdef *= val; return; }
		throw 'not implemented';
	});
	var menBonus = l2.data.statBonus['men'][char.baseStats.men];
	return Math.floor(jewelryMdef * char.lm * menBonus * multMdef + addMdef);
};

l2.calc.checkSet = function (char) {
	var equipedSet = null;
	l2.data.armorSets.forEach(function (set) {
		if (set.chest.indexOf(l2.model.bodyUpper.id) == -1)
			return;
		if (set.legs && set.legs.indexOf(l2.model.bodyLower.id) == -1)
			return;
		if (set.head && set.head.indexOf(l2.model.helmet.id) == -1)
			return;
		if (set.gloves && set.gloves.indexOf(l2.model.gloves.id) == -1)
			return;
		if (set.feet && set.feet.indexOf(l2.model.boots.id) == -1)
			return;
		equipedSet = set;
	});

	if (equipedSet == null)
		return;

	char.effects.push({ id: equipedSet.skill[1], lvl: 1, skill: l2.data.tools.getSkill(equipedSet.skill[1]) });
	if (equipedSet.shield && equipedSet.shield.indexOf(l2.model.shield.id) >= 0 && equipedSet.shieldSkill != null)
		char.passives.push({ id: equipedSet.shieldSkill, lvl: 1, skill: l2.data.tools.getSkill(equipedSet.shieldSkill) });

	if (equipedSet.str) char.baseStats.str += equipedSet.str;
	if (equipedSet.dex) char.baseStats.dex += equipedSet.dex;
	if (equipedSet.con) char.baseStats.con += equipedSet.con;
	if (equipedSet.int) char.baseStats.int += equipedSet.int;
	if (equipedSet.wit) char.baseStats.wit += equipedSet.wit;
	if (equipedSet.men) char.baseStats.men += equipedSet.men;
};

l2.calc.parseSkills = function (array, str) {
	if (!str)
		return;
	str.split(';').forEach(function (s) {
		var ss = s.split('-');
		var id = parseInt(ss[0]);
		var lvl = parseInt(ss[1]);
		var prevSkill = array.filter(function (skill) {
			return skill.id == id;
		});
		if (prevSkill.length == 0)
			array.push({ id: id, lvl: lvl, skill: l2.data.tools.getSkill(id) });
		else
			if (prevSkill[0].lvl < lvl)
				prevSkill[0].lvl = lvl;
	})
};

l2.calc.stats = function () {
	var _class = l2.data.tools.getClass(l2.model.classId);
	var baseStats = l2.data.subRace[_class.subRace];
	var char = {
		classId: l2.model.classId,
		_class: _class,
		baseStats: $.extend({}, baseStats.stats),
		lvl: l2.model.level,
		lm: (l2.model.level + 89) / 100,
		hpPerc: l2.model.hpPercent,
		atkFrom: l2.model.position,
		effects: [],
		weapon: l2.model.weapon.item
	};

	l2.ui.modelEquipments.forEach(function (model) {
		if (l2.model[model].id) {
			var item = l2.model[model].item;
			if (item.ench4 && l2.model[model].enchant >= 4)
				l2.calc.parseSkills(char.effects, item.ench4);
			l2.calc.parseSkills(char.effects, item.skill);
		}
	});

	l2.calc.checkSet(char);

	var skillCallback = function (s) {
		if (s.level > 0)
			char.effects.push({
				id: s.id,
				lvl: s.level,
				skill: s.skill
			});
	};

	l2.model.selfBuffs.forEach(skillCallback);
	l2.model.toggles.forEach(skillCallback);
	l2.model.commonBuffs.forEach(skillCallback);
	l2.model.songs.forEach(skillCallback);
	l2.model.dances.forEach(skillCallback);
	l2.model.clanSkills.forEach(skillCallback);
	l2.model.passives.forEach(skillCallback);

	l2.calc.baseStats(char);

	var delta = { str: 0, dex: 0, con: 0, int: 0, wit: 0, men: 0 };
	for (var i = 1; i <= 3; i++) {
		var slot = l2.model['tatoo' + i];
		if (slot.checked) {
			delta[slot.add.stat] += slot.add.value;
			delta[slot.sub.stat] -= slot.sub.value;
		}
	}

	for (var stat in delta) {
		if (delta[stat] > 5)
			delta[stat] = 5;
		char.baseStats[stat] += delta[stat];
		if (char.baseStats[stat] <= 0)
			char.baseStats[stat] = 1;
	}

	var stats = {
		baseStats: char.baseStats,
		hp: l2.calc.HP(char),
		//mp: l2.calc.MP(char),
		cp: l2.calc.CP(char),
		pDef: l2.calc.pDef(char),
		pAtk: l2.calc.pAtk(char),
		mAtk: l2.calc.mAtk(char),
		accuracy: l2.calc.accuracy(char),
		pCritical: l2.calc.pCritical(char),
		pCritMultiplier: l2.calc.pCritMultiplier(char),
		atkSpeed: l2.calc.atkSpeed(char),
		castSpeed: l2.calc.castSpeed(char),
		speed: l2.calc.speed(char),
		evasion: l2.calc.evasion(char),
		mDef: l2.calc.mDef(char)
	};

	stats.pCritAtk = l2.calc.pCritAtk(char, stats);
	stats.pDPS = l2.calc.pDPS(stats);

	return stats;
};