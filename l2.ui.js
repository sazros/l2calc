window.l2 = window.l2 || {};
window.l2.ui = window.l2.ui || {};

l2.ui.bindClasses = function () {
	$('#l2class').empty();
	var raceId = $('#race').val();
	var prof = $('#prof').val();
	$.each(l2.data.classes, function () {
		if (l2.data.subRace[this.subRace].race == raceId && this.prof == prof)
			l2.ui.tools.addOption('#l2class', this.id, this.name);
	});
	if (l2.ui.canChangeStorage)
		localStorage.classId = $('#l2class').val();
};

l2.ui.bindWeapons = function () {
	var grade = $('#weapon-grade').val();
	var type = $('#weapon-type').val();
	$('#weapon').empty();
	l2.ui.tools.addOption('#weapon', '', 'Unequipped');
	var weapons = l2.data.tools.findWeapons(grade, type);
	$.each(weapons, function () {
		l2.ui.tools.addOption('#weapon', this.id, this.name);
	});
};

l2.ui.bindShields = function () {
	var grade = $('#shield-grade').val();
	var type = $('#shield-type').val();
	$('#shield').empty();
	l2.ui.tools.addOption('#shield', '', 'Unequipped');
	var shields = l2.data.tools.findShields(grade);
	$.each(shields, function () {
		var name = this.name;
		if (this.skill != null)
			name = name + ' [Rare]';
		l2.ui.tools.addOption('#shield', this.id, name);
	});	
};

l2.ui.bindSets = function () {
	var grade = $('#set-grade').val();
	$('#set').empty();
	l2.ui.tools.addOption('#set', '', 'Unequipped');
	l2.data.armorSets.filter(function (s) {
		return (s.grade || 'none') == grade;
	}).sort(function (s1, s2) {
		var skill1 = l2.data.tools.getSkill(s1.skill[1]);
		var skill2 = l2.data.tools.getSkill(s2.skill[1]);
		if (skill1.name < skill2.name)
			return -1;
		if (skill1.name > skill2.name)
			return 1;
		return 0;
	}).forEach(function (s) {
		var skill = l2.data.tools.getSkill(s.skill[1]);
		l2.ui.tools.addOption('#set', s.id, skill.name);
	});
};

l2.ui.applySet = function () {
	var id = $('#set').val();
	var set = l2.data.tools.getSet(id);
	if (!set)
		return;
	if (set.chest != null) {
		var armor = l2.data.tools.getItem(set.chest[0]);
		$('#body-upper-grade').val(armor.grade || 'none');
		l2.ui.onBodyUpperGradeChange();
		$('#body-upper').val(set.chest[0]);
		l2.ui.onBodyUpperChange();
	}
	if (set.legs != null) {
		var armor = l2.data.tools.getItem(set.legs[0]);
		$('#body-lower-grade').val(armor.grade || 'none');
		l2.ui.onBodyLowerGradeChange();
		$('#body-lower').val(set.legs[0]);
	}
	if (set.head != null) {
		var armor = l2.data.tools.getItem(set.head[0]);
		$('#helmet-grade').val(armor.grade || 'none');
		l2.ui.onHelmetGradeChange();
		$('#helmet').val(set.head[0]);
	}
	if (set.gloves != null) {
		var armor = l2.data.tools.getItem(set.gloves[0]);
		$('#gloves-grade').val(armor.grade || 'none');
		l2.ui.onGlovesGradeChange();
		$('#gloves').val(set.gloves[0]);
	}
	if (set.feet != null) {
		var armor = l2.data.tools.getItem(set.feet[0]);
		$('#boots-grade').val(armor.grade || 'none');
		l2.ui.onBootsGradeChange();
		$('#boots').val(set.feet[0]);
	}

	$('#body-upper, #body-lower, #helmet, #gloves, #boots').each(l2.ui.onChangeSaveToStorage);
	$('#body-upper-grade, #body-lower-grade, #helmet-grade, #gloves-grade, #boots-grade').each(l2.ui.onChangeSaveToStorage);

	l2.ui.recalc();
};

l2.ui.checkSet = function (char) {
	var helmet = parseInt($('#helmet').val());
	var bodyUpper = parseInt($('#body-upper').val());
	var bodyLower = parseInt($('#body-lower').val());
	var gloves = parseInt($('#gloves').val());
	var boots = parseInt($('#boots').val());
	var shield = parseInt($('#shield').val());

	var equipedSet = null;
	l2.data.armorSets.forEach(function (set) {
		if (set.chest.indexOf(bodyUpper) == -1)
			return;
		if (set.legs && set.legs.indexOf(bodyLower) == -1)
			return;
		if (set.head && set.head.indexOf(helmet) == -1)
			return;
		if (set.gloves && set.gloves.indexOf(gloves) == -1)
			return;
		if (set.feet && set.feet.indexOf(boots) == -1)
			return;
		equipedSet = set;
	});

	if (equipedSet == null)
		return;

	char.passives.push({ id: equipedSet.skill[1], lvl: 1});
	if (equipedSet.shield && equipedSet.shield.indexOf(shield) >= 0 && equipedSet.shieldSkill != null)
		char.passives.push({ id: equipedSet.shieldSkill, lvl: 1});

	if (equipedSet.str) char.stats.str += equipedSet.str;
	if (equipedSet.dex) char.stats.dex += equipedSet.dex;
	if (equipedSet.con) char.stats.con += equipedSet.con;
	if (equipedSet.int) char.stats.int += equipedSet.int;
	if (equipedSet.wit) char.stats.wit += equipedSet.wit;
	if (equipedSet.men) char.stats.men += equipedSet.men;
};

l2.ui.bindHelmets = function () {
	var grade = $('#helmet-grade').val();
	$('#helmet').empty();
	l2.ui.tools.addOption('#helmet', '', 'Unequipped');
	var helmets = l2.data.tools.findHelmets(grade);
	$.each(helmets, function () {
		if (this.skill)
			l2.ui.tools.addOption('#helmet', this.id, '[Rare] ' + this.name);
		else
			l2.ui.tools.addOption('#helmet', this.id, this.name);
	});
};

l2.ui.bindBodyUpper = function () {
	var grade = $('#body-upper-grade').val();
	$('#body-upper').empty();
	l2.ui.tools.addOption('#body-upper', '', 'Unequipped');
	var bodyUppers = l2.data.tools.findBodyUppers(grade);
	$.each(bodyUppers, function () {
		l2.ui.tools.addOption('#body-upper', this.id, this.name);
	});
};

l2.ui.bindBodyLower = function () {
	var grade = $('#body-lower-grade').val();
	$('#body-lower').empty();
	l2.ui.tools.addOption('#body-lower', '', 'Unequipped');
	var bodyLowers = l2.data.tools.findBodyLowers(grade);
	$.each(bodyLowers, function () {
		l2.ui.tools.addOption('#body-lower', this.id, this.name);
	});
};

l2.ui.bindGloves = function () {
	var grade = $('#gloves-grade').val();
	$('#gloves').empty();
	l2.ui.tools.addOption('#gloves', '', 'Unequipped');
	var gloves = l2.data.tools.findGloves(grade);
	$.each(gloves, function () {
		l2.ui.tools.addOption('#gloves', this.id, this.name);
	});
};

l2.ui.bindBoots = function () {
	var grade = $('#boots-grade').val();
	$('#boots').empty();
	l2.ui.tools.addOption('#boots', '', 'Unequipped');
	var boots = l2.data.tools.findBoots(grade);
	$.each(boots, function () {
		l2.ui.tools.addOption('#boots', this.id, this.name);
	});
};

l2.ui.bindNecklaces = function () {
	var grade = $('#necklace-grade').val();
	$('#necklace').empty();
	l2.ui.tools.addOption('#necklace', '', 'Unequipped');
	var necklaces = l2.data.tools.findNecklaces(grade);
	$.each(necklaces, function () {
		l2.ui.tools.addOption('#necklace', this.id, this.name);
	});
};

l2.ui.bindEarrings = function (index) {
	var grade = $('#earring' + index + '-grade').val();
	$('#earring' + index).empty();
	l2.ui.tools.addOption('#earring' + index, '', 'Unequipped');
	var earrings = l2.data.tools.earrings(grade);
	$.each(earrings, function () {
		l2.ui.tools.addOption('#earring' + index, this.id, this.name);
	});
};

l2.ui.bindEarrings1 = function () {
	l2.ui.bindEarrings(1);
};

l2.ui.bindEarrings2 = function () {
	l2.ui.bindEarrings(2);
};

l2.ui.bindPassives = function () {
	var classId = $('#l2class').val();
	var lvl = $('#lvl').val();
	var skills = {};
	var classesId = l2.data.tools.getBaseClasses(classId);
	classesId.forEach(function (classId) {
		l2.data.tools.getSkillTree(classId).forEach(function (skill) {
			if (skills[skill.id])
				skills[skill.id].push(skill);
			else
				skills[skill.id] = [skill];
		});
	});
	$('#passives > div > div.passive-skill').remove();
	for (var id in skills) {
		var skill = l2.data.tools.getSkill(id);
		skills[id].sort(function (s1, s2) {
			return s1.lvl - s2.lvl;
		});
		if (skill && skill.operateType == 'P') {
			var div = $('<div>').addClass('left passive-skill');
			var select = $('<select>').attr('data-skill-id', skill.id);
			select.change(l2.ui.recalc);
			l2.ui.tools.addOption(select, '', '---');
			for (var j = 0; j < skills[id].length; j++)
				l2.ui.tools.addOption(select, skills[id][j].lvl, skills[id][j].lvl + ' [' + skills[id][j].minLvl + ']', function (option) {
					option.attr('data-min-lvl', skills[id][j].minLvl);
				});
			if ($('#auto-select-passives').is(':checked'))
				select.attr('disabled', 'disabled');
			div.append(select);
			div.append($('<span>').text(skill.name));
			$('#passives > div').append(div);
		}
	}

	l2.ui.autoSelectPassives();
};

l2.ui.autoSelectPassives = function () {
	if (!$('#auto-select-passives').is(':checked'))
		return;
	var classId = $('#l2class').val();
	var lvl = $('#lvl').val();
	var classesId = l2.data.tools.getBaseClasses(classId);
	$('#passives select').each(function () {
		var skillId = parseInt($(this).attr('data-skill-id'));
		var skillLevel = 0;
		$(this).children('option').each(function () {
			var minLvl = $(this).attr('data-min-lvl');
			if (!minLvl)
				return;
			minLvl = parseInt(minLvl);
			if (minLvl <= lvl)
				skillLevel = $(this).val();
		});
		if (skillLevel == 0)
			$(this).val('');
		else
			$(this).val(skillLevel);
	})
};

l2.ui.checkAbnormalType = function () {
	var select = $(this);
	if (select.val() == '')
		return;
	var abnormal = select.attr('data-abnormal');
	$('#selfbuffs > div > div.self-skill > select, #commonbuffs > div > div > div.common-skill > select').each(function () {
		if (this == select[0])
			return;
		if ($(this).attr('data-abnormal') == abnormal && $(this).val() != '') {
			$(this).val('');
			if ($(this).attr('data-storage'))
				l2.ui.onChangeSaveToStorage.call(this);
		}
	});
};

l2.ui.bindSelfBuffs = function () {
	var classId = $('#l2class').val();
	var skills = {};
	var classesId = l2.data.tools.getBaseClasses(classId);
	classesId.forEach(function (classId) {
		l2.data.tools.getSkillTree(classId).forEach(function (skill) {
			if (skills[skill.id])
				skills[skill.id].push(skill);
			else
				skills[skill.id] = [skill];
		});
	});
	$('#selfbuffs > div > div.self-skill').remove();
	for (var id in skills) {
		var skill = l2.data.tools.getSkill(id);
		skills[id].sort(function (s1, s2) {
			return s1.lvl - s2.lvl;
		});
		if (skill && skill.operateType.charAt(0) == 'A' && (skill.target == 'SELF' || skill.target == 'AURA') && skill.effects && skill.effectType != 'Debuff' && skill.effectType != 'Transformation') {
			var div = $('<div>').addClass('left self-skill');
			var select = $('<select>');
			select.attr('data-skill-id', skill.id);
			select.attr('data-abnormal', skill.abnormalType);
			select.attr('data-storage', 'self-' + skill.id);
			select.change(l2.ui.checkAbnormalType);
			select.change(l2.ui.onChangeSaveToStorage);
			select.change(l2.ui.recalc);
			l2.ui.tools.addOption(select, '', '---');
			for (var j = 0; j < skills[id].length; j++)
				l2.ui.tools.addOption(select, skills[id][j].lvl, skills[id][j].lvl + ' [' + skills[id][j].minLvl + ']');
			div.append(select);
			div.append($('<span>').text(skill.name));
			$('#selfbuffs > div').append(div);
		}
	}
};

l2.ui.bindToggles = function () {
	var classId = $('#l2class').val();
	var skills = {};
	var classesId = l2.data.tools.getBaseClasses(classId);
	classesId.forEach(function (classId) {
		l2.data.tools.getSkillTree(classId).forEach(function (skill) {
			if (skills[skill.id])
				skills[skill.id].push(skill);
			else
				skills[skill.id] = [skill];
		});
	});
	$('#toggles > div > div.toggle-skill').remove();
	for (var id in skills) {
		var skill = l2.data.tools.getSkill(id);
		skills[id].sort(function (s1, s2) {
			return s1.lvl - s2.lvl;
		});
		if (skill && skill.operateType == 'T') {
			var div = $('<div>').addClass('left toggle-skill');
			var select = $('<select>').attr('data-skill-id', skill.id);
			select.attr('data-storage', 'toggle-' + skill.id);
			select.change(l2.ui.onChangeSaveToStorage);
			select.change(l2.ui.recalc);
			l2.ui.tools.addOption(select, '', '---');
			for (var j = 0; j < skills[id].length; j++)
				l2.ui.tools.addOption(select, skills[id][j].lvl, skills[id][j].lvl + ' [' + skills[id][j].minLvl + ']');
			div.append(select);
			div.append($('<span>').text(skill.name));
			$('#toggles > div').append(div);
		}
	}
};

l2.ui.classChanged = function () {
	l2.ui.bindPassives();
	l2.ui.bindSelfBuffs();
	l2.ui.bindToggles();
	l2.ui.autoSelectPassives();
	l2.ui.recalc();
};

l2.ui.bindCommonBuffs = function () {
	l2.data.commonBuffs.forEach(function (group) {
		var stacks = {};
		var groupDiv = $('<div>').addClass('common-skill-group');
		groupDiv.append($('<div>').addClass('left common-skill-group-header').text(group.group));
		$('#commonbuffs > div').append(groupDiv);
		group.ids.forEach(function (id) {
			id = parseInt(id);
			var skill = l2.data.tools.getSkill(id);
			if (skill.abnormalType == null)
				throw 'not implemented';

			if (stacks[skill.abnormalType] == undefined) {
				var div = $('<div>').addClass('left common-skill');
				var select = $('<select>');
				select.attr('data-skill-id', skill.id);
				select.attr('data-abnormal', skill.abnormalType);
				select.attr('data-storage', 'selfbuff-' + skill.id);
				select.change(l2.ui.checkAbnormalType);
				select.change(l2.ui.recalc);
				l2.ui.tools.addOption(select, '', '---');
				if (skill.levels > 1)
					for (var j = 0; j < skill.levels; j++)
						l2.ui.tools.addOption(select, skill.id + ':' + (j + 1), skill.name + ' ' + (j + 1));
				else
					l2.ui.tools.addOption(select, skill.id + ':' + (j + 1), skill.name);
				div.append(select);
				groupDiv.append(div);
				stacks[skill.abnormalType] = { select: select };
			} else {
				if (skill.levels > 1)
					for (var j = 0; j < skill.levels; j++)
						l2.ui.tools.addOption(stacks[skill.abnormalType].select, skill.id + ':' + (j + 1), skill.name + ' ' + (j + 1));
				else
					l2.ui.tools.addOption(stacks[skill.abnormalType].select, skill.id + ':' + (j + 1), skill.name);
			}		
		});
		groupDiv.append($('<div>').addClass('clear'));
	});
};

l2.ui.bindCommonTriggers = function () {
	l2.data.commonTriggers.forEach(function (id) {
		var skill = l2.data.tools.getSkill(id);
		var div = $('<div>').addClass('left trigger-skill');
		var label = $('<label>');
		var input = $('<input>').attr('type', 'checkbox').attr('data-skill-id', id);
		input.change(l2.ui.recalc);
		label.append(input);
		label.append(skill.name);
		div.append(label);
		var select = $('<select>');
		[10, 20, 30, 40, 50, 60, 70, 80, 90, 100].forEach(function (perc) {
			l2.ui.tools.addOption(select, perc, perc + '% of time');
		});
		select.val(100);
		select.change(l2.ui.recalc);
		div.append(select);
		$('#commontriggers > div').append(div);
	});
};

l2.ui.bindSongs = function () {
	for (var i = 0; i < l2.data.songs.length; i++) {
		var skill = l2.data.tools.getSkill(l2.data.songs[i]);
		var div = $('<div>').addClass('left song-skill');
		var label = $('<label>');
		var input = $('<input>').attr('type', 'checkbox')
			.attr('data-skill-id', skill.id)
			.attr('data-storage', 'song-' + skill.id);
		input.change(l2.ui.recalc);
		label.append(input);
		label.append(skill.name);
		div.append(label);
		$('#songbuffs > div').append(div);
	}
};

l2.ui.bindDances = function () {
	for (var i = 0; i < l2.data.dances.length; i++) {
		var skill = l2.data.tools.getSkill(l2.data.dances[i]);
		var div = $('<div>').addClass('left dance-skill');
		var label = $('<label>');
		var input = $('<input>').attr('type', 'checkbox')
			.attr('data-skill-id', skill.id)
			.attr('data-storage', 'dance-' + skill.id);
		input.change(l2.ui.recalc);
		label.append(input);
		label.append(skill.name);
		div.append(label);
		$('#dancebuffs > div').append(div);
	}
};

l2.ui.bindBuffs = function () {
	l2.ui.bindCommonBuffs();
	l2.ui.bindCommonTriggers();
	l2.ui.bindSongs();
	l2.ui.bindDances();
};

l2.ui.canChangeStorage = false;
l2.ui.canShowDelta = false;
l2.ui.prevStats = null;

l2.ui.restoreSingleItem = function (element) {
	if ($(element).is('select')) {
		var value = localStorage[$(element).attr('data-storage')];
		if (value == undefined)
			$(element).val($(element).children('option:first').val());
		else
			$(element).val(value);
	}
	if ($(element).is('input[type=number]')) {
		var value = localStorage[$(element).attr('data-storage')];
		if (value == undefined)
			$(element).val(0);
		else
			$(element).val(value);
	}
	if ($(element).is('input[type=checkbox]'))
		if (localStorage[$(element).attr('data-storage')] == '1')
			$(element).prop('checked', true);
		else
			$(element).prop('checked', false);
};

l2.ui.onChangeSaveToStorage = function () {
	if (!l2.ui.canChangeStorage)
		return;
	if ($(this).is('select') || $(this).is('input[type=number]'))
		localStorage[$(this).attr('data-storage')] = $(this).val();
	if ($(this).is('input[type=checkbox]'))
		localStorage[$(this).attr('data-storage')] = $(this).is(':checked') ? 1 : 0;
};

l2.ui.restoreFromStorage = function () {
	l2.ui.restoreSingleItem('#race');
	l2.ui.restoreSingleItem('#prof');
	l2.ui.bindClasses();

	l2.ui.restoreSingleItem('#l2class');
	l2.ui.restoreSingleItem('#lvl');
	l2.ui.classChanged();

	l2.ui.restoreSingleItem('#hpperc');
	l2.ui.restoreSingleItem('#atkfrom');

	$('.tatoo-chb, .tatoo-stat, .tatoo-plus, .tatoo-minus').each(function () {
		l2.ui.restoreSingleItem(this);
	});

	l2.ui.restoreSingleItem('#weapon-grade');
	l2.ui.restoreSingleItem('#weapon-type');
	l2.ui.onWeaponGradeChange();
	l2.ui.restoreSingleItem('#weapon');

	l2.ui.restoreSingleItem('#shield-grade');
	l2.ui.onShieldGradeChange();
	l2.ui.restoreSingleItem('#shield');

	l2.ui.restoreSingleItem('#set-grade');
	l2.ui.bindSets();

	l2.ui.restoreSingleItem('#helmet-grade');
	l2.ui.onHelmetGradeChange();
	l2.ui.restoreSingleItem('#helmet');

	l2.ui.restoreSingleItem('#body-upper-grade');
	l2.ui.onBodyUpperGradeChange();
	l2.ui.restoreSingleItem('#body-upper');

	l2.ui.restoreSingleItem('#body-lower-grade');
	l2.ui.onBodyLowerGradeChange();
	l2.ui.restoreSingleItem('#body-lower')
	l2.ui.onBodyUpperChange();

	l2.ui.restoreSingleItem('#gloves-grade');
	l2.ui.onGlovesGradeChange();
	l2.ui.restoreSingleItem('#gloves');

	l2.ui.restoreSingleItem('#boots-grade');
	l2.ui.onBootsGradeChange();
	l2.ui.restoreSingleItem('#boots');

	l2.ui.restoreSingleItem('#necklace-grade');
	l2.ui.onNecklaceGradeChange();
	l2.ui.restoreSingleItem('#necklace');

	$('input[type=number]').each(function() {
		l2.ui.restoreSingleItem(this);
	});

	$('#commonbuffs > div > div > div.common-skill > select').each(function () {
		l2.ui.restoreSingleItem(this);
	});
	$('#songbuffs > div > div.song-skill > label > input').each(function () {
		l2.ui.restoreSingleItem(this);
	});
	$('#dancebuffs > div > div.dance-skill > label > input').each(function () {
		l2.ui.restoreSingleItem(this);
	});

	$('#selfbuffs > div > div.self-skill > select').each(function () {
		l2.ui.restoreSingleItem(this);
	});
	$('#toggles > div > div.toggle-skill > select').each(function () {
		l2.ui.restoreSingleItem(this);
	});

	l2.ui.recalc();
};

l2.ui.saveAllToStorage = function () {
	$('select[data-storage], input[type=checkbox][data-storage]').each(l2.ui.onChangeSaveToStorage);
};

l2.ui.toggleFieldSet = function () {
	var div = $(this).closest('fieldset').children('div');
	var btn = $(this).closest('label').next('span');
	if ($(this).is(':checked'))
		div.add(btn).show();
	else
		div.add(btn).hide();
};

l2.ui.clearEquipment = function () {
	$('#weapon').val('');
	$('#shield').val('');
	$('#set').val('');
	$('#helmet').val('');
	$('#body-upper').val('');
	$('#body-lower').val('');
	$('#gloves').val('');
	$('#boots').val('');
	$('#weapon-ench, #shield-ench, #helmet-ench, #body-upper-ench, #body-lower-ench, #gloves-ench, #boots-ench').val(0)
	l2.ui.onBodyUpperChange();
	l2.ui.saveAllToStorage();
	l2.ui.recalc();
};

l2.ui.clearSelfBuffs = function () {
	$('#selfbuffs > div > div.self-skill > select').val('');
	l2.ui.saveAllToStorage();
	l2.ui.recalc();
};

l2.ui.clearToggles = function () {
	$('#toggles > div > div.toggle-skill > select').val('');
	l2.ui.saveAllToStorage();
	l2.ui.recalc();
};

l2.ui.clearCommonBuffs = function () {
	$('#commonbuffs > div > div > div.common-skill > select').val('');
	l2.ui.saveAllToStorage();
	l2.ui.recalc();
};

l2.ui.clearCommonTriggers = function () {
	$('#commontriggers > div > div.trigger-skill > label > input').prop('checked', false);
	l2.ui.saveAllToStorage();
	l2.ui.recalc();
};

l2.ui.clearSongs = function () {
	$('#songbuffs > div > div.song-skill > label > input').prop('checked', false);
	l2.ui.saveAllToStorage();
	l2.ui.recalc();
};

l2.ui.clearDances = function () {
	$('#dancebuffs > div > div.dance-skill > label > input').prop('checked', false);
	l2.ui.saveAllToStorage();
	l2.ui.recalc();
};

l2.ui.onWeaponGradeChange = function () {
	l2.ui.bindWeapons();
	if ($('#weapon-grade').val() == 'none')
		$('#weapon-ench').val(0).attr('disabled', true);	
	else
		$('#weapon-ench').attr('disabled', false);
	l2.ui.onChangeSaveToStorage.call($('#weapon'));
	l2.ui.onChangeSaveToStorage.call($('#weapon-ench'));
	l2.ui.recalc();
};

l2.ui.onWeaponTypeChange = function () {
	l2.ui.bindWeapons();
	l2.ui.onChangeSaveToStorage.call($('#weapon'));
	l2.ui.recalc();
};

l2.ui.onShieldGradeChange = function () {
	l2.ui.bindShields();
	if ($('#shield-grade').val() == 'none')
		$('#shield-ench').val(0).attr('disabled', true);	
	else
		$('#shield-ench').attr('disabled', false);
	l2.ui.onChangeSaveToStorage.call($('#shield'));
	l2.ui.onChangeSaveToStorage.call($('#shield-ench'));
	l2.ui.recalc();
};

l2.ui.onHelmetGradeChange = function () {
	l2.ui.bindHelmets();
	if ($('#helmet-grade').val() == 'none')
		$('#helmet-ench').val(0).attr('disabled', true);	
	else
		$('#helmet-ench').attr('disabled', false);
	l2.ui.onChangeSaveToStorage.call($('#helmet'));
	l2.ui.onChangeSaveToStorage.call($('#helmet-ench'));
	l2.ui.recalc();
};

l2.ui.onBodyUpperGradeChange = function () {
	l2.ui.bindBodyUpper();
	if ($('#body-upper-grade').val() == 'none')
		$('#body-upper-ench').val(0).attr('disabled', true);	
	else
		$('#body-upper-ench').attr('disabled', false);
	l2.ui.onChangeSaveToStorage.call($('#body-upper'));
	l2.ui.onChangeSaveToStorage.call($('#body-upper-ench'));
	l2.ui.recalc();
};

l2.ui.onBodyLowerGradeChange = function () {
	l2.ui.bindBodyLower();
	if ($('#body-lower-grade').val() == 'none')
		$('#body-lower-ench').val(0).attr('disabled', true);
	else
		$('#body-lower-ench').attr('disabled', false);
	l2.ui.onChangeSaveToStorage.call($('#body-lower'));
	l2.ui.onChangeSaveToStorage.call($('#body-lower-ench'));
	l2.ui.recalc();
};

l2.ui.onGlovesGradeChange = function () {
	l2.ui.bindGloves();
	if ($('#gloves-grade').val() == 'none')
		$('#gloves-ench').val(0).attr('disabled', true);	
	else
		$('#gloves-ench').attr('disabled', false);
	l2.ui.onChangeSaveToStorage.call($('#gloves'));
	l2.ui.onChangeSaveToStorage.call($('#gloves-ench'));
	l2.ui.recalc();
};

l2.ui.onBootsGradeChange = function () {
	l2.ui.bindBoots();
	if ($('#boots-grade').val() == 'none')
		$('#boots-ench').val(0).attr('disabled', true);	
	else
		$('#boots-ench').attr('disabled', false);
	l2.ui.onChangeSaveToStorage.call($('#boots'));
	l2.ui.onChangeSaveToStorage.call($('#boots-ench'));
	l2.ui.recalc();
};

l2.ui.onBodyUpperChange = function () {
	var onePiece;
	if ($('#body-upper').val() == '')
		onePiece = false;
	else {
		var bodyUpper = l2.data.tools.getItem($('#body-upper').val());
		onePiece = bodyUpper.bodyPart == 'onepiece';
	}
	$('#body-lower-grade, #body-lower-ench, #body-lower').attr('disabled', onePiece);
	if (!onePiece)
		if ($('#body-lower-grade').val() == 'none')
			$('#body-lower-ench').val(0).attr('disabled', true);
		else
			$('#body-lower-ench').attr('disabled', false);
	else
		$('#body-lower').val('');
};

l2.ui.onNecklaceGradeChange = function () {
	l2.ui.bindNecklaces();
	if ($('#necklace-grade').val() == 'none')
		$('#necklace-ench').val(0).attr('disabled', true);	
	else
		$('#necklace-ench').attr('disabled', false);
	l2.ui.onChangeSaveToStorage.call($('#necklace'));
	l2.ui.onChangeSaveToStorage.call($('#necklace-ench'));
	l2.ui.recalc();
};

l2.ui.formatPercent = function (val) {
	if (val >= 10)
		return Math.round(val).toString();
	if (val >= 1)
		return val.toFixed(1);
	return val.toFixed(2);
};

l2.ui.highlightStat = function (oldStats, newStats, key, div) {
	var plus;
	div.removeClass('stat-plus stat-minus stat-equal');
	if (oldStats[key] == 0 && newStats[key] == 0)
		div.addClass('stat-equal').text('');
	else
		if (oldStats[key] == 0)
			div.addClass('stat-plus').text('+Inf');
		else
			if (oldStats[key] == newStats[key])
				div.addClass('stat-equal').text('');
			else
				if (oldStats[key] < newStats[key])
					div.addClass('stat-plus').text('+' + l2.ui.formatPercent(100 * (newStats[key] - oldStats[key]) / oldStats[key]) + '%');
				else
					div.addClass('stat-minus').text('-' + l2.ui.formatPercent(100 * (oldStats[key] - newStats[key]) / oldStats[key]) + '%');
	div.css({ opacity: 1 }).stop().animate({ opacity: 0 }, 3000);
};

l2.ui.parseSkills = function (array, str) {
	if (!str)
		return;
	str.split(';').forEach(function (s) {
		var ss = s.split('-');
		array.push({ id: parseInt(ss[0]), lvl: parseInt(ss[1]) });
	})
};

l2.ui.recalc = function () {
	var classId = parseInt($('#l2class').val());
	if (isNaN(classId))
		return;
	var $class = l2.data.tools.getClass(classId);
	var baseStats = l2.data.subRace[$class.subRace];
	var stats = $.extend({}, baseStats.stats);
	var hpPerc = parseInt($('#hpperc').val());

	var char = {
		classId: classId,
		$class: $class,
		stats: stats,
		lvl: parseInt($('#lvl').val()),
		hpPerc: hpPerc,
		atkFrom: $('#atkfrom').val(),
		passives: [],
		buffs: []
	};
	char.lm = (char.lvl + 89) / 100;

	if ($('#weapon').val()) {
		char.weapon = l2.data.tools.getItem($('#weapon').val());
		l2.ui.parseSkills(char.passives, char.weapon.skill);
	} else
		char.weapon = null;

	if ($('#helmet').val()) {
		char.helmet = l2.data.tools.getItem($('#helmet').val());
		l2.ui.parseSkills(char.passives, char.helmet.skill);
	}
	if ($('#body-upper').val()) {
		char.bodyUpper = l2.data.tools.getItem($('#body-upper').val());
		l2.ui.parseSkills(char.passives, char.bodyUpper.skill);
	}
	if ($('#body-lower').val()) {
		char.bodyLower = l2.data.tools.getItem($('#body-lower').val());
		l2.ui.parseSkills(char.passives, char.bodyLower.skill);
	}
	if ($('#gloves').val()) {
		char.gloves = l2.data.tools.getItem($('#gloves').val());
		l2.ui.parseSkills(char.passives, char.gloves.skill);
	}
	if ($('#boots').val()) {
		char.boots = l2.data.tools.getItem($('#boots').val());
		l2.ui.parseSkills(char.passives, char.boots.skill);
	}

	if (char.bodyUpper)
		if (char.bodyUpper.bodyPart == 'onepiece')
			char.armorType = char.bodyUpper.armorType;
		else
			if (char.bodyLower && char.bodyUpper.armorType == char.bodyLower.armorType)
				char.armorType = char.bodyUpper.armorType;

	char.enchants = {
		weapon: parseInt($('#weapon-ench').val()),
		shield: parseInt($('#shield-ench').val()),
		helmet: parseInt($('#helmet-ench').val()),
		bodyUpper: parseInt($('#body-upper-ench').val()),
		bodyLower: parseInt($('#body-lower-ench').val()),
		gloves: parseInt($('#gloves-ench').val()),
		boots: parseInt($('#boots-ench').val())
	};

	$('#passives > div > div.passive-skill').each(function () {
		var select = $(this).find('select');
		if (select.val() != '')
			char.passives.push({ id: parseInt(select.attr('data-skill-id')), lvl: parseInt(select.val()) })
	});

	$('#selfbuffs > div > div.self-skill').each(function () {
		var select = $(this).find('select');
		if (select.val() != '')
			char.passives.push({ id: parseInt(select.attr('data-skill-id')), lvl: parseInt(select.val()) })
	});
	$('#toggles > div > div.toggle-skill').each(function () {
		var select = $(this).find('select');
		if (select.val() != '')
			char.passives.push({ id: parseInt(select.attr('data-skill-id')), lvl: parseInt(select.val()) })
	});
	$('#commonbuffs > div > div > div.common-skill').each(function () {
		var select = $(this).find('select');
		if (select.val() != '') {
			var ss = select.val().split(':');
			char.buffs.push({ id: parseInt(ss[0]), lvl: parseInt(ss[1]) })
		}
	});
	$('#commontriggers > div > div.trigger-skill').each(function () {
		var input = $(this).find('input');
		var select = $(this).find('select');
		if (input.is(':checked') && select.val() == '100')
			char.buffs.push({ id : parseInt(input.attr('data-skill-id')), lvl: 1 });
	});
	$('#songbuffs > div > div.song-skill').each(function () {
		var input = $(this).find('input');
		if (input.is(':checked'))
			char.buffs.push({ id : parseInt(input.attr('data-skill-id')), lvl: 1 });
	});
	$('#dancebuffs > div > div.dance-skill').each(function () {
		var input = $(this).find('input');
		if (input.is(':checked'))
			char.buffs.push({ id : parseInt(input.attr('data-skill-id')), lvl: 1 });
	});

	l2.ui.checkSet(char);

	for (var i = 1; i <= 3; i++) {
		var div = $('#tatoo-slot-' + i);
		if (div.find('input[type=checkbox]').is(':checked')) {
			stats[div.find('select:eq(0)').val()] += parseInt(div.find('select:eq(1)').val());
			stats[div.find('select:eq(2)').val()] += parseInt(div.find('select:eq(3)').val());
		}
	}

	for (var stat in stats)
		if (stats[stat] < 0)
			stats[stat] = 0;

	$('#str').text(stats.str);
	$('#dex').text(stats.dex);
	$('#con').text(stats.con);
	$('#int').text(stats.int);
	$('#wit').text(stats.wit);
	$('#men').text(stats.men);

	char.hp = l2.calc.HP(char);
	char.cp = l2.calc.CP(char);
	char.pDef = l2.calc.pDef(char);
	char.pAtk = l2.calc.pAtk(char);
	char.mAtk = l2.calc.mAtk(char);
	char.accuracy = l2.calc.accuracy(char);
	char.pCritical = l2.calc.pCritical(char);
	char.pCritMultiplier = l2.calc.pCritMultiplier(char);
	char.pCritAtk = l2.calc.pCritAtk(char);
	char.atkSpeed = l2.calc.atkSpeed(char);
	char.castSpeed = l2.calc.castSpeed(char);
	char.speed = l2.calc.speed(char);
	char.evasion = l2.calc.evasion(char);
	char.pDPS = l2.calc.pDPS(char);
	$('#hp').text(char.hp);
	$('#cp').text(char.cp);
	$('#pdef').text(char.pDef);
	$('#patk').text(char.pAtk);
	$('#matk').text(char.mAtk);
	$('#accuracy').text(char.accuracy);
	$('#pcritical').text(char.pCritical);
	$('#pcritmult').text(char.pCritMultiplier.toFixed(5));
	$('#atkspd').text(char.atkSpeed);
	$('#castspd').text(char.castSpeed);
	$('#speed').text(char.speed);
	$('#evasion').text(char.evasion);
	$('#pdps').text(l2.ui.tools.formatNumber(Math.round(char.pDPS)));
	$('#patkcrit').text(char.pCritAtk);

	var prevStats = l2.ui.prevStats;
	l2.ui.prevStats = char;

	if (l2.ui.canShowDelta && prevStats) {
		l2.ui.highlightStat(prevStats, char, 'hp', $('#hp').next());
		l2.ui.highlightStat(prevStats, char, 'cp', $('#cp').next());
		l2.ui.highlightStat(prevStats, char, 'pDef', $('#pdef').next());
		l2.ui.highlightStat(prevStats, char, 'pAtk', $('#patk').next());
		l2.ui.highlightStat(prevStats, char, 'atkSpeed', $('#atkspd').next());
		l2.ui.highlightStat(prevStats, char, 'pDPS', $('#pdps').next());
		l2.ui.highlightStat(prevStats, char, 'mAtk', $('#matk').next());
		l2.ui.highlightStat(prevStats, char, 'castSpeed', $('#castspd').next());
	}
};

l2.ui.adjustContainer = function () {
	var height = $(window).height() - Math.round($('#container').position().top) - 28;
	$('#container').height(Math.max(200, height));
	var width = $('#equipment').outerWidth() + 32;
	$('#container').width(width);
};

$(function () {

	window.onerror = function (msg) {
		alert(msg);
	};

	$.each(l2.data.races, function () {
		l2.ui.tools.addOption('#race', this.id, this.name);
	});

	for (var i = 0; i <= 3; i++)
		l2.ui.tools.addOption('#prof', i, i);

	for (var i = 1; i <= 85; i++)
		l2.ui.tools.addOption('#lvl', i, i);

	[100, 60, 30].forEach(function (hp) {
		l2.ui.tools.addOption('#hpperc', hp, hp);
	});

	['front', 'side', 'behind'].forEach(function (from) {
		l2.ui.tools.addOption('#atkfrom', from, from);
	});

	$('#race').change(l2.ui.bindClasses);
	$('#race').change(l2.ui.classChanged);
	$('#prof').change(l2.ui.bindClasses);
	$('#prof').change(l2.ui.classChanged);
	l2.ui.bindClasses();
	$('#l2class').change(l2.ui.classChanged);
	$('#lvl').change(l2.ui.classChanged);
	l2.ui.classChanged();
	$('#hpperc').change(l2.ui.recalc);
	$('#atkfrom').change(l2.ui.recalc);

	$.each(['str', 'dex', 'con', 'int', 'wit', 'men'], function () {
		l2.ui.tools.addOption('.tatoo-stat', this, this.toUpperCase());
	});
	for (var i = 1; i <= 4; i++)
		l2.ui.tools.addOption('.tatoo-plus', i, '+' + i);
	for (var i = 1; i <= 6; i++)
		l2.ui.tools.addOption('.tatoo-minus', -i, '-' + i);
	$('.tatoo-chb').click(l2.ui.recalc);
	$('.tatoo-stat').change(l2.ui.recalc);
	$('.tatoo-plus').change(l2.ui.recalc);
	$('.tatoo-minus').change(l2.ui.recalc);

	$.each(l2.data.grades, function () {
		l2.ui.tools.addOption('.grade', this.code, this.name);
	});

	$.each(l2.data.weaponTypes, function () {
		l2.ui.tools.addOption('#weapon-type', this.code, this.name);
	});
	
	$('#weapon-grade').change(l2.ui.onWeaponGradeChange);
	$('#weapon-type').change(l2.ui.onWeaponTypeChange);
	l2.ui.bindWeapons();

	$('#shield-grade').change(l2.ui.onShieldGradeChange);
	$('#shield-type').change(l2.ui.bindShields);
	l2.ui.bindShields();
	$('#set-grade').change(l2.ui.bindSets);
	l2.ui.bindSets();
	$('#set').change(l2.ui.applySet);
	$('#helmet-grade').change(l2.ui.onHelmetGradeChange);
	l2.ui.bindHelmets();
	$('#body-upper-grade').change(l2.ui.onBodyUpperGradeChange);
	l2.ui.bindBodyUpper();
	$('#body-lower-grade').change(l2.ui.onBodyLowerGradeChange);
	l2.ui.bindBodyLower();
	$('#gloves-grade').change(l2.ui.onGlovesGradeChange);
	l2.ui.bindGloves();
	$('#boots-grade').change(l2.ui.onBootsGradeChange);
	l2.ui.bindBoots();
	$('#necklace-grade').change(l2.ui.onNecklaceGradeChange);
	l2.ui.onNecklaceGradeChange();

	$('#weapon').change(l2.ui.recalc);
	$('#shield').change(l2.ui.recalc);
	$('#helmet').change(l2.ui.recalc);
	$('#body-upper').change(l2.ui.onBodyUpperChange);
	$('#body-upper').change(l2.ui.recalc);
	$('#body-lower').change(l2.ui.recalc);
	$('#boots').change(l2.ui.recalc);
	$('#gloves').change(l2.ui.recalc);

	l2.ui.bindBuffs();

	$('#equipment-chb').click(l2.ui.toggleFieldSet);
	$('#selfbuffs-chb').click(l2.ui.toggleFieldSet);
	$('#toggles-chb').click(l2.ui.toggleFieldSet);
	$('#commonbuffs-chb').click(l2.ui.toggleFieldSet);
	$('#songbuffs-chb').click(l2.ui.toggleFieldSet);
	$('#dancebuffs-chb').click(l2.ui.toggleFieldSet);
	$('#passives-chb').click(l2.ui.toggleFieldSet);
	$('#commontriggers-chb').click(l2.ui.toggleFieldSet);

	$('#equipment span.clear-btn').click(l2.ui.clearEquipment);
	$('#selfbuffs span.clear-btn').click(l2.ui.clearSelfBuffs);
	$('#toggles span.clear-btn').click(l2.ui.clearToggles);
	$('#commonbuffs span.clear-btn').click(l2.ui.clearCommonBuffs);
	$('#commontriggers span.clear-btn').click(l2.ui.clearCommonTriggers);
	$('#songbuffs span.clear-btn').click(l2.ui.clearSongs);
	$('#dancebuffs span.clear-btn').click(l2.ui.clearDances);

	$('#auto-select-passives').click(function () {
		if ($(this).is(':checked')) {
			$('#passives > div > div.passive-skill > select').attr('disabled', true);
			l2.ui.autoSelectPassives();
		} else
			$('#passives > div > div.passive-skill > select').attr('disabled', false);
		l2.ui.recalc();
	});

	$('.eq-enchant > input').val('0').attr('disabled', true).change(function () {
		var val = parseInt($(this).val());
		if (isNaN(val) || val < 0)
			val = 0;
		if ($(this).val() != val.toString())
			$(this).val(val);
		l2.ui.recalc();
	});

	$(window).resize(l2.ui.adjustContainer);
	l2.ui.adjustContainer();

	$('select[data-storage]').change(l2.ui.onChangeSaveToStorage);
	$('input[type=number][data-storage]').change(l2.ui.onChangeSaveToStorage);
	$('input[type=checkbox][data-storage]').click(l2.ui.onChangeSaveToStorage);

	l2.ui.restoreFromStorage();

	l2.ui.canChangeStorage = true;
	l2.ui.canShowDelta = true;
});