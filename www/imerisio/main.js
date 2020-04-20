///////////////////////////////////////////////////////////////////////////////@
//
// @BEGIN
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
// www/imerisio/main.js —— Πρόγραμμα οδήγησης σελίδας ελέγχου και διαχείρισης
// παρουσιολογίων.
// @FILE END
//
// @DESCRIPTION BEGIN
// Πρόκειται για το πρόγραμμα οδήγησης της βασικής σελίδας της εφαρμογής
// ελέγχου και διαχείρισης παρουσιολογίων "letrak". Ο χρήστης καταχωρεί
// κριτήρια επιλογής με βάση την ημερομηνία και την υπηρεσία και μετά την
// εμφάνιση των παρουσιολογίων που πληρούν τα κριτήρια επιλογής, μπορεί
// είτε να διαχειριστεί τα επιλεγμένα παρουσιολόγια, είτε να δημιουργήσει
// νέα παρουσιολόγια (συνήθως ως αντίγραφα ήδη υφισταμένων πρόσφατων
// σχετικών παρουσιολογίων).
// @DESCRIPTION END
//
// @HISTORY BEGIN
// Updated: 2020-04-20
// Updated: 2020-04-19
// Updated: 2020-04-18
// Updated: 2020-04-17
// Created: 2020-04-09
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
const imerisio = {};

imerisio.minima = {
	'filtraTabLabel': 'Φίλτρα',
	'filtraHideTitle': 'Απόκρυψη φίλτρων',
	'filtraShowTitle': 'Εμφάνιση φίλτρων',
	'filtraImerominiaLabel': 'Ημερομηνία',
	'filtraIpiresiaLabel': 'Υπηρεσία',
};

pnd.domInit(() => {
	pnd.
	toolbarSetup().
	fyiSetup().
	ofelimoSetup().
	ribbonSetup().
	domSetup().
	domFixup();

	imerisio.
	selidaSetup();
});

imerisio.selidaSetup = () => {
	letrak.
	toolbarTitlosSetup().
	toolbarXristisSetup().
	ribbonCopyrightSetup();

	if (letrak.noXristis())
	return letrak.arxikiSelida(imerisio);

	letrak.
	toolbarArxikiSetup();

	imerisio.
	filtraSetup().
	browserSetup();

	return imerisio;
};

///////////////////////////////////////////////////////////////////////////////@

imerisio.filtraSetup = () => {
	pnd.toolbarLeftDOM.
	append(imerisio.filtraTabDOM = letrak.tabDOM().
	attr('title', imerisio.minima.filtraShowTitle).
	data('status', 'hidden').
	append(imerisio.minima.filtraTabLabel).
	on('click', (e) => imerisio.filtraToggle(e)));

	pnd.bodyDOM.
	append(imerisio.filtraDOM = $('<div>').
	append($('<form>').
	attr('id', 'filtraForma').

	append($('<div>').
	addClass('letrak-inputLine').
	append(imerisio.filtraIpiresiaDOM = $('<label>').
	attr('for', 'ipiresiaFiltro').
	text(imerisio.minima.filtraIpiresiaLabel)).
	append(imerisio.filtraIpiresiaDOM = $('<input>').
	attr('id', 'ipiresiaFiltro').
	addClass('filtraInput'))).

	append($('<div>').
	addClass('letrak-inputLine').
	append($('<label>').
	attr('for', 'imerominiaFiltro').
	text(imerisio.minima.filtraImerominiaLabel)).
	append(imerisio.filtraImerominiaDOM = $('<input>').
	attr('id', 'imerominiaFiltro').
	addClass('filtraInput').
	datepicker())).

	append($('<div>').
	addClass('letrak-formaPanel').

	append($('<input>').
	addClass('letrak-formaPliktro').
	attr({
		'type': 'submit',
		'value': letrak.minima.ipovoliPliktroLabel,
	}).
	on('click', (e) => imerisio.filtraFormaIpovoli(e))).

	append($('<input>').
	addClass('letrak-formaPliktro').
	attr({
		'type': 'button',
		'value': letrak.minima.clearPliktroLabel,
	}).
	on('click', (e) => imerisio.filtraFormaClear(e))).

	append($('<input>').
	addClass('letrak-formaPliktro').
	attr({
		'type': 'button',
		'value': letrak.minima.cancelPliktroLabel,
	}).
	on('click', (e) => imerisio.filtraFormaCancel(e))))));

	imerisio.filtraDOM.dialog({
		'title': 'Κριτήρια επιλογής',
		'autoOpen': false,

		'width': 'auto',
		'height': 'auto',
		'position': {
			'my': 'left+100 top+100',
			'at': 'left top',
		},

		'open': () => imerisio.filtraEnable(),
		'show': {
			'effect': 'drop',
			'direction': 'up',
			'duration': 100,
		},

		'close': () => imerisio.filtraDisable(),
		'hide': {
			'effect': 'drop',
			'direction': 'up',
			'duration': 100,
		},
	});

	return imerisio;
};

imerisio.filtraToggle = function(e) {
	e.stopPropagation();

	if (imerisio.filtraDisabled())
	imerisio.filtraDOM.dialog('open');

	else
	imerisio.filtraDOM.dialog('close');

	return imerisio;
};

imerisio.filtraEnable = function() {
	imerisio.filtraTabDOM.
	data('status', 'visible').
	addClass('filtraTabEnabled').
	attr('title', imerisio.minima.filtraHideTitle);

	return imerisio;
};

imerisio.filtraDisable = function(act) {
	imerisio.filtraTabDOM.
	data('status', 'hidden').
	removeClass('filtraTabEnabled').
	attr('title', imerisio.minima.filtraShowTitle);

	return imerisio;
};

imerisio.filtraEnabled = function() {
	return (imerisio.filtraTabDOM.data('status') === 'visible');
};

imerisio.filtraDisabled = function() {
	return !imerisio.filtraEnabled();
};

// XXX
imerisio.filtraFormaIpovoli = (e) => {
	e.stopPropagation();
	return false;
};

imerisio.filtraFormaClear = (e) => {
	e.stopPropagation();
	imerisio.filtraIpiresiaDOM.val('').focus();
	imerisio.filtraImerominiaDOM.val('');

	return imerisio;
};

imerisio.filtraFormaCancel = (e) => {
	e.stopPropagation();
	imerisio.filtraDOM.dialog('close');

	return imerisio;
};

///////////////////////////////////////////////////////////////////////////////@

imerisio.browserSetup = () => {
	pnd.ofelimoDOM.
	empty().
	append(imerisio.browserDOM = $('<div>').
	addClass('browser'));

	for (let i = 0; i < 100; i++)
	imerisio.browserDOM.
	append($('<div>').text(i));

	return imerisio;
};

///////////////////////////////////////////////////////////////////////////////@
