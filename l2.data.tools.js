window.l2 = window.l2 || {};
window.l2.data = window.l2.data || {};
window.l2.data.tools = window.l2.data.tools || {};

l2.data.tools.getItem = function (id) {
	for (var i = 0; i < l2.data.items.length; i++)
		if (l2.data.items[i].id == id)
			return l2.data.items[i];
	return null;
};
l2.data.tools.getSkill = function (id) {
	for (var i = 0; i < l2.data.skills.length; i++)
		if (l2.data.skills[i].id == id)
			return l2.data.skills[i];
	return null;
};
l2.data.tools.getSet = function (id) {
	for (var i = 0; i < l2.data.armorSets.length; i++)
		if (l2.data.armorSets[i].id == id)
			return l2.data.armorSets[i];
	return null;	
};
l2.data.tools.getClass = function (id) {
	for (var i = 0; i < l2.data.classes.length; i++)
		if (l2.data.classes[i].id == id)
			return l2.data.classes[i];
	return null;
};
l2.data.tools.getBaseClasses = function (classId) {
	var classesId = [];
	var currClassId = parseInt(classId);
	while (currClassId != null) {
		var _class = l2.data.tools.getClass(currClassId);
		classesId.push(_class.id);
		currClassId = _class.parent;
	}
	return classesId;
};
l2.data.tools.getSkillTree = function (classId) {
	for (var i = 0; i < l2.data.skillTree.length; i++)
		if (l2.data.skillTree[i].classId == classId)
			return l2.data.skillTree[i].skills;
	return null;
};
l2.data.tools.getBaseHPCoefs = function (classId) {
	for (var i = 0; i < l2.data.baseHPCoef.length; i++)
		if (l2.data.baseHPCoef[i].id == classId)
			return l2.data.baseHPCoef[i];
	return null;
};
l2.data.tools.isMystic = function (classId) {
	var base = l2.data.tools.getBaseClasses(classId);
	var baseClassId = base[base.length - 1];
	return [10, 25, 38, 49].indexOf(baseClassId) >= 0;
};
l2.data.tools.getBaseCritital = function (weaponType) {
	for (var i = 0; i < l2.data.weaponBaseData.length; i++)
		if (l2.data.weaponBaseData[i].name == weaponType)
			return l2.data.weaponBaseData[i].baseCritical;
	throw 'Unknown weapon type';
};
l2.data.tools.getBaseAtkSpeed = function (weaponType) {
	for (var i = 0; i < l2.data.weaponBaseData.length; i++)
		if (l2.data.weaponBaseData[i].name == weaponType)
			return l2.data.weaponBaseData[i].baseAtkSpeed;
	throw 'Unknown weapon type';
};
l2.data.tools.sortItems = function (items) {
	items.sort(function (i1, i2) {
		if (i1.name < i2.name) return -1;
		if (i1.name > i2.name) return 1;
		return 0;
	});
};
l2.data.tools.findWeapons = function (grade, type) {
	var weapons = l2.data.items.filter(function (item) {
		if (item.weaponType != type)
			return false;
		return (item.grade || 'none') == grade;
	});
	l2.data.tools.sortItems(weapons);
	return weapons;
};
l2.data.tools.findShields = function (grade) {
	var shields = l2.data.items.filter(function (item) {
		if (item.bodyPart != 'lhand' || item.sDef == null)
			return false;
		return (item.grade || 'none') == grade;
	});
	l2.data.tools.sortItems(shields);
	return shields;
};
l2.data.tools.findBodyUppers = function (grade) {
	var bu = l2.data.items.filter(function (item) {
		if (item.bodyPart != 'chest' && item.bodyPart != 'onepiece')
			return false;
		return (item.grade || 'none') == grade;
	});
	l2.data.tools.sortItems(bu);
	return bu;
};
l2.data.tools.findBodyLowers = function (grade) {
	var bl = l2.data.items.filter(function (item) {
		if (item.bodyPart != 'legs')
			return false;
		return (item.grade || 'none') == grade;
	});
	l2.data.tools.sortItems(bl);
	return bl;
};
l2.data.tools.findHelmets = function (grade) {
	var helmets = l2.data.items.filter(function (item) {
		if (item.bodyPart != 'head')
			return false;
		return (item.grade || 'none') == grade;
	});
	l2.data.tools.sortItems(helmets);
	return helmets;
};
l2.data.tools.findGloves = function (grade) {
	var gloves = l2.data.items.filter(function (item) {
		if (item.bodyPart != 'gloves')
			return false;
		return (item.grade || 'none') == grade;
	});
	l2.data.tools.sortItems(gloves);
	return gloves;
};
l2.data.tools.findBoots = function (grade) {
	var boots = l2.data.items.filter(function (item) {
		if (item.bodyPart != 'feet')
			return false;
		return (item.grade || 'none') == grade;
	});
	l2.data.tools.sortItems(boots);
	return boots;
};
l2.data.tools.findNecklaces = function (grade) {
	var necklaces = l2.data.items.filter(function (item) {
		if (item.bodyPart != 'neck')
			return false;
		return (item.grade || 'none') == grade;
	});
	l2.data.tools.sortItems(necklaces);
	return necklaces;
};