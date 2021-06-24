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
	addClass('noprint').

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
		"url": "dataGet.php",
		"dataType": "json",
		"data": {
			"dlist": adiarpt.dlist,
			"ipiresia": adiarpt.ipiresia,
			"apo": adiarpt.apo,
			"eos": adiarpt.eos,
		},
		"success": (rsp) => {
			adiarpt.
			processData(rsp).
			prepareReport();
		},
		"error": (err) => {
			console.error(err);
		},
	});

	return adiarpt;
};

adiarpt.processData = (rsp) => {
	if (rsp.hasOwnProperty("error")) {
		self.LETRAK.klisimoTabDOM.prependTo(pnd.toolbarLeftDOM);
		pnd.fyiError(rsp.error);
		return adiarpt;
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
	return adiarpt;
};

adiarpt.prepareReport = () => {
	if (!adiarpt.plist.length)
	pnd.fyiError('Δεν βρέθηκαν εγγραφές');

	adiarpt.
	epikefalidaSetup().
	plegmaSetup().
	adanalSetup().
	dataDisplay().
	reportEnable();

	return adiarpt;
};

adiarpt.epikefalidaSetup = () => {
	const ipiresiaList = self.opener.LETRAK.ipiresiaList;
	const die = adiarpt.ipiresia.substr(0, 3);
	const tmi = adiarpt.ipiresia.substr(0, 7);
	let ipiresiaDOM;

	pnd.ofelimoDOM.
	append(adiarpt.epikefalidaDOM = $('<div>').
	attr('id', 'epikefalida').

	append(ipiresiaDOM = $('<div>').
	attr('id', 'epikefalidaLeft').
	append($('<div id="epikefalidaOrganismos">').
	text(letrak.minima.organismos))).

	append($('<div>').
	attr('id', 'epikefalidaRight').
	append($('<div>').
	text('ΔΕΛΤΙΟ ΑΠΟΝΤΩΝ ΚΑΙ ΑΔΕΙΟΥΧΩΝ')).
	append($('<div>').
	append($('<div id="epikefalidaApo">').
	text(adiarpt.apo)).
	append($('<div id="epikefalidaEos">').
	text(adiarpt.eos)))));

	if (die)
	ipiresiaDOM.append($('<div>').text(ipiresiaList[die]));

	if (tmi !== die)
	ipiresiaDOM.append($('<div>').text(ipiresiaList[tmi]));

	return adiarpt;
};

adiarpt.plegmaSetup = () => {
	pnd.ofelimoDOM.
	append(adiarpt.plegmaDOM = $('<div>').
	attr('id', 'plegma'));

	return adiarpt;
};

adiarpt.adanalSetup = () => {
	pnd.ofelimoDOM.
	append(adiarpt.adanalDOM = $('<div>').
	attr('id', 'adanal'));

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
