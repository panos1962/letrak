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
// www/parousia/main.js —— Πρόγραμμα οδήγησης σελίδας επιλογής παρουσιών.
// @FILE END
//
// @DESCRIPTION BEGIN
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
const parousia = {};

// Χρησιμοποιούμε το global singleton "LETRAK" ως μέσο κοινοποίησης constant
// αντικειμένων προκειμένου να είναι αυτά προσπελάσιμα από children windows,
// όπως είναι η σελίδα "prosopa" κλπ.

self.LETRAK = {};

parousia.minima = {
	"kritiriaIpalilosLabel": "Υπάλληλος",
	"kritiriaApoLabel": "Από",
	"kritiriaEosLabel": "Έως",
};

pnd.domInit(() => {
	if (letrak.noXristis())
	return letrak.arxikiSelida(parousia);

	// Πρόσβαση στο γενικό ευρετήριο προσωπικού έχουν όσοι διαθέτουν
	// δικαιώματα "UPDATE" και "ADMIN", ασχέτως υπηρεσίας.

	switch (letrak.xristisProsvasiGet()) {
	case 'VIEW':
	case 'UPDATE':
	case 'ADMIN':
		break;
	default:
		self.location = '../mnt/pandora/lib/radioActive.html';
		return parousia;
	}

	pnd.
	toolbarSetup().
	fyiSetup().
	ofelimoSetup().
	ribbonSetup().
	domSetup().
	domFixup();

	parousia.
	selidaSetup();
});

parousia.selidaSetup = () => {
	letrak.
	toolbarTitlosSetup().
	toolbarXristisSetup().
	ribbonCopyrightSetup();

	parousia.
	kritiriaSetup().
	ilistSetup();

	pnd.bodyDOM.css('display', 'block');

	return parousia;
};

///////////////////////////////////////////////////////////////////////////////@

parousia.kritiriaSetup = () => {
	pnd.bodyDOM.
	append(parousia.kritiriaFormaDOM = $('<div>').
	append($('<form>').
	attr('id', 'kritiriaForma').

	append($('<div>').
	addClass('letrak-inputLine').
	append($('<label>').
	attr('for', 'kritiriaIpalilos').
	text(parousia.minima.kritiriaIpalilosLabel)).
	append(parousia.kritiriaIpalilosDOM = $('<input>').
	attr('id', 'kritiriaIpalilos').
	addClass('kritiriaInput'))).

	append($('<div>').
	addClass('letrak-inputLine').
	append($('<label>').
	attr('for', 'kritiriaApo').
	text(parousia.minima.kritiriaApoLabel)).
	append(parousia.kritiriaApoDOM = $('<input>').
	attr('id', 'kritiriaApo').
	addClass('kritiriaInput').
	datepicker())).

	append($('<div>').
	addClass('letrak-inputLine').
	append($('<label>').
	attr('for', 'kritiriaEos').
	text(parousia.minima.kritiriaEosLabel)).
	append(parousia.kritiriaEosDOM = $('<input>').
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
	}).
	on('click', (e) => parousia.kritiriaFormaIpovoli(e))).

	append($('<input>').
	addClass('letrak-formaPliktro').
	attr({
		'type': 'button',
		'value': letrak.minima.clearPliktroLabel,
	}).
	on('click', (e) => parousia.kritiriaFormaClear(e))))));

	parousia.kritiriaFormaDOM.dialog({
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

	let kritiriaDialogDOM = parousia.kritiriaFormaDOM.closest('.ui-dialog');

	kritiriaDialogDOM.
	find('.ui-dialog-titlebar-close').
	css('display', 'none');

	kritiriaDialogDOM.
	find('.ui-dialog-title').
	css('text-align', 'center');

	setTimeout(() => {
		parousia.kritiriaIpalilosDOM.focus();
	}, 0);

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

	return parousia;
};

parousia.ilistSetup = function() {
	return parousia;
};
