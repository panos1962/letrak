///////////////////////////////////////////////////////////////////////////////@
//
// @COPYRIGHT BEGIN
// Copyright (C) 2020 Panos I. Papadopoulos <panos1962_AT_gmail_DOT_com>
// @COPYRIGHT END
//
// @FILETYPE BEGIN
// javascipt
// @FILETYPE END
//
// @FILE BEGIN
// www/parspec/main.js —— Πρόγραμμα οδήγησης σελίδας επιλογής υπαλλήλου για
// έλεγχο παρουσιών
// @FILE END
//
// @DESCRIPTION BEGIN
// Ο χρήστης επιλέγει υπάλληλο και διάστημα προκειμένου να επιλεγούν οι
// παρουσίες του συγκεκριμένου υπαλλήλου για το συγκεκριμένο χρονικό διάστημα.
// @DESCRIPTION END
//
// @HISTORY BEGIN
// Updated: 2026-01-19
// Created: 2026-01-18
// @HISTORY END
//
// @END
//
///////////////////////////////////////////////////////////////////////////////@

"use strict";

const pnd =
require('../mnt/pandora/lib/pandora.js');
require('../mnt/pandora/lib/pandoraJQueryUI.js')(pnd);
const letrak =
require('../lib/letrak.js');
const parspec = {};

// Χρησιμοποιούμε το global singleton "LETRAK" ως μέσο κοινοποίησης constant
// αντικειμένων προκειμένου να είναι αυτά προσπελάσιμα από children windows,
// όπως είναι η σελίδα "parlist" κλπ.

self.LETRAK = {};

parspec.minima = {
	"kritiriaIpalilosLabel": "Υπάλληλος",
	"kritiriaApoLabel": "Από",
	"kritiriaEosLabel": "Έως",
};

pnd.domInit(() => {
	if (letrak.noXristis())
	return letrak.arxikiSelida(parspec);

	// Πρόσβαση στο γενικό ευρετήριο προσωπικού έχουν όσοι διαθέτουν
	// δικαιώματα "UPDATE" και "ADMIN", ασχέτως υπηρεσίας.

	switch (letrak.xristisProsvasiGet()) {
	case 'VIEW':
	case 'UPDATE':
	case 'ADMIN':
		break;
	default:
		self.location = '../mnt/pandora/lib/radioActive.html';
		return parspec;
	}

	pnd.
	toolbarSetup().
	fyiSetup().
	ofelimoSetup().
	ribbonSetup().
	domSetup().
	domFixup();

	parspec.
	selidaSetup();
});

parspec.selidaSetup = () => {
	letrak.
	toolbarTitlosSetup().
	toolbarXristisSetup().
	ribbonCopyrightSetup();

	parspec.
	kritiriaSetup().
	ilistSetup();

	pnd.bodyDOM.css('display', 'block');

	return parspec;
};

///////////////////////////////////////////////////////////////////////////////@

parspec.kritiriaSetup = () => {
	pnd.bodyDOM.
	append(parspec.kritiriaFormaDOM = $('<div>').
	append($('<form>').
	attr('id', 'kritiriaForma').

	append($('<div>').
	addClass('letrak-inputLine').
	append($('<label>').
	attr('for', 'kritiriaIpalilos').
	text(parspec.minima.kritiriaIpalilosLabel)).
	append(parspec.kritiriaIpalilosDOM = $('<input>').
	attr('id', 'kritiriaIpalilos').
	addClass('kritiriaInput'))).

	append($('<div>').
	addClass('letrak-inputLine').
	append($('<label>').
	attr('for', 'kritiriaApo').
	text(parspec.minima.kritiriaApoLabel)).
	append(parspec.kritiriaApoDOM = $('<input>').
	attr('id', 'kritiriaApo').
	addClass('kritiriaInput').
	datepicker())).

	append($('<div>').
	addClass('letrak-inputLine').
	append($('<label>').
	attr('for', 'kritiriaEos').
	text(parspec.minima.kritiriaEosLabel)).
	append(parspec.kritiriaEosDOM = $('<input>').
	attr('id', 'kritiriaEos').
	addClass('kritiriaInput').
	datepicker())).

	append($('<div>').
	addClass('letrak-formaPanel').

	append($('<input>').
	addClass('letrak-formaPliktro').
	attr({
		'type': 'submit',
		'value': letrak.minima.ipovoliPliktroLabel,
	})).

	append($('<input>').
	addClass('letrak-formaPliktro').
	attr({
		'type': 'button',
		'value': letrak.minima.clearPliktroLabel,
	}).
	on('click', (e) => parspec.kritiriaFormaClear(e))))));

	parspec.kritiriaFormaDOM.dialog({
		'title': 'Κριτήρια επιλογής',
		'autoOpen': true,
		'closeOnEscape': false,
		'draggable': false,
		'resizable': false,

		'width': 'auto',
		'height': 'auto',
		'position': {
			'my': 'left+10 top+63',
			'at': 'left top',
		},
	});

	let kritiriaDialogDOM = parspec.kritiriaFormaDOM.closest('.ui-dialog');

	kritiriaDialogDOM.
	find('.ui-dialog-titlebar-close').
	css('display', 'none');

	kritiriaDialogDOM.
	find('.ui-dialog-title').
	css('text-align', 'center');

	pnd.ofelimoDOM.
	on('mouseover', '.ilistRow', function(e) {
		e.stopPropagation();
		$(this).addClass('candiRow');
	}).
	on('mouseleave', '.ilistRow', function(e) {
		e.stopPropagation();

		if ($(this).data('epilogi'))
		return;

		$(this).removeClass('candiRow');
	}).
	on('click', '.ilistRow', function(e) {
		e.stopPropagation();
	});

	parspec.ipalilosSetup();
	parspec.kritiriaFormaDOM.
	on('submit', function(e) {
		e.stopPropagation();
		e.preventDefault();

		parspec.kritiriaFormaIpovoli();
	});


	return parspec;
};

parspec.ipalilosSetup = function() {
	parspec.kritiriaIpalilosDOM.
	on('keyup', function(e) {
		return parspec.ipalilosHotkey(e);
	});

	setTimeout(() => {
		parspec.kritiriaIpalilosDOM.focus();
	}, 0);

	return parspec;
};

parspec.kritiriaFormaIpovoli = function() {
	parspec.ipalilosSearch();

	return parspec;
};

///////////////////////////////////////////////////////////////////////////////@

parspec.ipalilosSearchTimer = undefined;

parspec.ipalilosSearchTimerClear = function() {
	if (!parspec.ipalilosSearchTimer)
	return parspec;

	clearTimeout(parspec.ipalilosSearchTimer);
	parspec.ipalilosSearchTimer = undefined;

	return parspec;
};

parspec.ipalilosHotkey = function(e) {
	e.stopPropagation();

	parspec.ipalilosSearchTimerClear();

	let imask = parspec.kritiriaIpalilosDOM.val();

	if (!imask)
	return parspec;

	parspec.ipalilosSearchTimer = setTimeout(function() {
		parspec.ipalilosSearch(imask);
	}, 500);
	
	return parspec;
};

parspec.ipalilosSearch = function(mask) {
	parspec.ipalilosSearchTimerClear();

	if (!mask)
	mask = parspec.kritiriaIpalilosDOM.val();

	console.log('>>>', mask);

	return parspec;
}

///////////////////////////////////////////////////////////////////////////////@

parspec.ilistSetup = function() {
	return parspec;
};
