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
// www/adiarpt/main.js —— Πρόγραμμα οδήγησης σελίδας εκτύπωσης αδειών
// παρουσιολογίου.
// @FILE END
//
// @DESCRIPTION BEGIN
// @DESCRIPTION END
//
// @HISTORY BEGIN
// Created: 2021-06-21
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

const adiarpt = {
	"ipiresia": undefined,
	"apo": undefined,
	"eos": undefined,
	"dlist": undefined,
};

adiarpt.minima = {
	'reportTabLabel': 'Εκτύπωση',
};

(() => {
	if (!self.opener)
	return;

	if (!self.opener.hasOwnProperty('LETRAK'))
	return;

	if (self.opener.LETRAK.ipiresia)
	adiarpt.ipiresia = self.opener.LETRAK.ipiresia;

	if (self.opener.LETRAK.apo)
	adiarpt.apo = self.opener.LETRAK.apo;

	if (self.opener.LETRAK.eos)
	adiarpt.eos = self.opener.LETRAK.eos;

	if (self.opener.LETRAK.dlist)
	adiarpt.dlist = self.opener.LETRAK.dlist;
})();

pnd.domInit(() => {
	pnd.
	toolbarSetup().
	fyiSetup().
	ofelimoSetup().
	ribbonSetup().
	domSetup().
	domFixup();

	adiarpt.
	selidaSetup();
});

///////////////////////////////////////////////////////////////////////////////@

adiarpt.selidaSetup = () => {
	letrak.
	toolbarTitlosSetup('<b>Κατάσταση Αδειών</b>').
	toolbarXristisSetup().
	ribbonCopyrightSetup();

	adiarpt.
	toolbarSetup().
	kritiriaSetup();
};

adiarpt.toolbarSetup = () => {
	pnd.toolbarLeftDOM.

	append(adiarpt.reportTabDOM = letrak.tabDOM().
	addClass('deltioTab').
	append(adiarpt.minima.reportTabLabel).
	on('click', (e) => adiarpt.report(e)));

	return adiarpt;
};

adiarpt.kritiriaSetup = () => {
	pnd.ofelimoDOM.

	append($('<div>').
	attr('id', 'kritiria').

	append($('<div>').
	addClass('kritirio').

	append($('<div>').
	addClass('kritirioLabel').
	text('Υπηρεσία')).

	append($('<div>').
	addClass('kritirioValue').
	text(adiarpt.ipiresia))).

	append($('<div>').
	addClass('kritirio').

	append($('<div>').
	addClass('kritirioLabel').
	text('Από')).

	append($('<div>').
	addClass('kritirioValue').
	text(adiarpt.apo))).

	append($('<div>').
	addClass('kritirio').

	append($('<div>').
	addClass('kritirioLabel').
	text('Έως')).

	append($('<div>').
	addClass('kritirioValue').
	text(adiarpt.eos))));

console.log(adiarpt.ipiresia);
console.log(adiarpt.dlist);

	return adiarpt;
};

adiarpt.report = (e) => {
	e.stopPropagation();
};
