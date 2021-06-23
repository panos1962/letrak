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
	kritiriaSetup().
	dataGet();
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

	return adiarpt;
};

adiarpt.dataGet = () => {
	$.post({
		"url": "prepare.php",
		"dataType": "json",
		"data": {
			"dlist": adiarpt.dlist,
			"ipiresia": adiarpt.ipiresia,
			"apo": adiarpt.apo,
			"eos": adiarpt.eos,
		},
		"success": (rsp) => {
			adiarpt.dataProcess(rsp);
		},
		"error": (err) => {
			console.error(err);
		},
	});

	return adiarpt;
};

adiarpt.dataProcess = (rsp) => {
	if (rsp.hasOwnProperty("error")) {
		self.LETRAK.klisimoTabDOM.prependTo(pnd.toolbarLeftDOM);
		return pnd.fyiError(rsp.error);
	}

	const plist = [];

	for (let ipalilos in rsp) {
		for (let imera in rsp[ipalilos]) {
			adiarpt.imeraProcess(ipalilos, imera,
				rsp[ipalilos][imera], plist);
			delete rsp[ipalilos][imera];
		}

		delete rsp[ipalilos];
	}

	adiarpt.plist = plist.sort(adiarpt.pcmp);
	adiarpt.
	dataDisplay().
	reportEnable();

	return adiarpt;
};

adiarpt.dataDisplay = () => {
	const n = adiarpt.plist.length;

	for (let i = 0; i < n; i++) {
		const data = adiarpt.plist[i];
		const onomateponimo = adiarpt.ipalilosList[data.i];

		pnd.ofelimoDOM.append($('<div>').text(onomateponimo));
	}

	return adiarpt;
};

adiarpt.reportEnable = () => {
	pnd.toolbarLeftDOM.
	append(adiarpt.reportTabDOM = letrak.tabDOM().
	addClass('deltioTab').
	append(adiarpt.minima.reportTabLabel).
	on('click', (e) => adiarpt.report(e)));

	return adiarpt;
};

adiarpt.imeraProcess = (ipalilos, imera, data, list) => {
	data["i"] = parseInt(ipalilos);
	data["d"] = imera;
	list.push(data);
};

adiarpt.ipalilosList = {};

adiarpt.pcmp = (p1, p2) => {
	if (!adiarpt.ipalilosList.hasOwnProperty(p1.i))
	adiarpt.ipalilosListPush(p1.i);

	if (!adiarpt.ipalilosList.hasOwnProperty(p2.i))
	adiarpt.ipalilosListPush(p2.i);

	const i1 = adiarpt.ipalilosList[p1.i];
	const i2 = adiarpt.ipalilosList[p2.i];

	const d1 = p1.d;
	const d2 = p2.d;

	const cmp = i1.localeCompare(i2);

	if (cmp < 0)
	return -1;

	if (cmp > 0)
	return 1;

	if (p1.i < p2.i)
	return -1;

	if (p1.i > p2.i)
	return 1;

	if (d1 < d2)
	return -1;

	if (d1 > d2)
	return 1;

	return 0;
};

adiarpt.ipalilosListPush = (kodikos) => {
	const ipalilos = self.opener.LETRAK.ipalilosList[kodikos];
	return (adiarpt.ipalilosList[kodikos] = ipalilos.e + ' ' +
		ipalilos.o + ' ' + ipalilos.p.substr(0, 3));
};

adiarpt.report = (e) => {
	e.stopPropagation();
};
