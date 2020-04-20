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
// www/main.js —— Πρόγραμμα οδήγησης αρχικής σελίδας εφαρμογής "letrak"
// @FILE END
//
// @HISTORY BEGIN
// Created: 2020-04-20
// @HISTORY END
//
// @END
//
///////////////////////////////////////////////////////////////////////////////@

"use strict";

const pnd =
require('./mnt/pandora/lib/pandora.js');
require('./mnt/pandora/lib/pandoraJQueryUI.js')(pnd);
const letrak =
require('./lib/letrak.js');
const welcome = {};

pnd.domInit(() => {
	pnd.
	toolbarSetup().
	fyiSetup().
	ofelimoSetup().
	ribbonSetup().
	domSetup().
	domFixup();

	welcome.
	selidaSetup();
});

welcome.selidaSetup = () => {
	letrak.
	toolbarTitlosSetup().
	toolbarXristisSetup().
	ribbonCopyrightSetup();

	$('#welcome').
	css('display', 'block').
	appendTo(pnd.ofelimoDOM);

	if (letrak.noXristis())
	return welcome.anonimiXrisi();

	pnd.toolbarLeftDOM.
	append(letrak.tabDOM().
	text(letrak.minima.imerisioSelidaLabel).
	on('click', (e) => self.location = 'imerisio'));

	$('#eponimiXrisi').css('display', 'inline');
	return welcome;
};

welcome.anonimiXrisi = () => {
	$('#anonimiXrisi').css('display', 'inline');
	return welcome;
};

///////////////////////////////////////////////////////////////////////////////@
