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
	"error": undefined,
	"deltioCountMax": 500,
};

adiarpt.minima = {
	'reportTabLabel': 'Εκτύπωση',
};

adiarpt.errorSet = (err) => {
	adiarpt.error = err;
	console.error(err);

	return adiarpt;
};

adiarpt.errorGet = () => {
	return adiarpt.error;
};

adiarpt.isError = () => {
	return adiarpt.errorGet();
};

adiarpt.errorClear = () => {
	adiarpt.error = undefined;
	return adiarpt;
};

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

adiarpt.selidaSetup = () => {
	letrak.
	toolbarTitlosSetup('<b>Κατάσταση Αδειών</b>').
	toolbarXristisSetup().
	ribbonCopyrightSetup();

	if (adiarpt.isError())
	return pnd.fyiError(adiarpt.errorGet());

	adiarpt.
	kritiriaFix().
	kritiriaSetup().
	dataGet();
};

///////////////////////////////////////////////////////////////////////////////@

adiarpt.kritiriaFix = () => {
	let dmy = adiarpt.apo.split(/[^0-9]/);
	adiarpt.apoDate = new Date(dmy[2], dmy[1] - 1, dmy[0]);

	dmy = adiarpt.eos.split(/[^0-9]/);
	adiarpt.eosDate = new Date(dmy[2], dmy[1] - 1, dmy[0]);

	if ((adiarpt.eosDate - adiarpt.apoDate) < 0) {
		let t = adiarpt.apoDate;
		adiarpt.apoDate = adiarpt.eosDate;
		adiarpt.eosDate = t;

		t = adiarpt.apo;
		adiarpt.apo = adiarpt.eos;
		adiarpt.eos = t;
	}

	return adiarpt;
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
	if (adiarpt.dlist.length > adiarpt.deltioCountMax) {
		pnd.fyiError('Μεγάλος πλήθος δελτίων');
		return adiarpt;
	}

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
	if ((!adiarpt) || (!adiarpt.plist.length))
	pnd.fyiError('Δεν βρέθηκαν εγγραφές');

	adiarpt.
	epikefalidaSetup().
	plegmaSetup().
	ipomnimaSetup().
	adanalSetup().
	dataDisplay().
	ipomnimaDisplay().
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
	attr('id', 'epikefalidaTitlos').
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

	const tableDOM = $('<table>').
	attr('border', 1).
	appendTo(adiarpt.plegmaDOM);

	const theadDOM = $('<thead>').appendTo(tableDOM);
	adiarpt.plegmaDataDOM = $('<tbody>').appendTo(tableDOM);
	let rowDOM = $('<tr>').appendTo(theadDOM);

	rowDOM.append($('<th>').text('Υπάλληλος'));

	for (let d = new Date(adiarpt.apoDate);
		d <= adiarpt.eosDate;
		d.setDate(d.getDate() + 1)) {

		rowDOM.
		append($('<th>').
		append($('<div>').text(adiarpt.imeraShortcut[d.getDay()])).
		append($('<div>').text(d.getDate())));
	}

	adiarpt.plegmaKeliDOM = {};
	adiarpt.plegmaKeliOk = {};
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
	const ilist = {};
	let icur = undefined;

	for (let i = 0; i < n; i++) {
		const data = adiarpt.plist[i];
		const ipalilos = data.i;
		const onomateponimo = adiarpt.ipalilosList[ipalilos];

		if (ipalilos !== icur)
		adiarpt.plegmaIpalilosAdd(icur = ipalilos, onomateponimo);

		adiarpt.plegmaDataPush(data);
		//adiarpt.adanalDOM.append($('<div>').text(onomateponimo));
	}

	return adiarpt;
};

adiarpt.plegmaIpalilosAdd = (ipalilos, onomateponimo) => {
	let rowDOM = $('<tr>').appendTo(adiarpt.plegmaDataDOM);

	rowDOM.append($('<td>').
	addClass('plegmaIpalilos').
	text('[' + ipalilos + '] ' + onomateponimo));

	for (let d = new Date(adiarpt.apoDate);
		d <= adiarpt.eosDate;
		d.setDate(d.getDate() + 1)) {

		const idx = adiarpt.keliIndex(ipalilos, d);
		adiarpt.plegmaKeliDOM[idx] = $('<td>').appendTo(rowDOM);
	}

	return adiarpt;
};

adiarpt.plegmaDataPush = (data) => {
	let ymd = data.d.split(/[^0-9]/);
	const date = new Date(ymd[0], ymd[1] - 1, ymd[2]);

	const idx = adiarpt.keliIndex(data.i, date);

	if (adiarpt.plegmaKeliOk[idx])
	return adiarpt;

	const keliDOM = adiarpt.plegmaKeliDOM[idx];

	if (data.aa) {
		switch (data.aa) {
		case 'ΤΗΛΕΡΓΑΣΙΑ':
			keliDOM.append($('<div>').html('&#x2713;'));
			break;
		default:
			let s = adiarpt.adiaEconomyMap[data.aa];

			if (!s) {
				console.error(data.aa + ': adiaEconomyMap missing');
				s = '??';
			}

			keliDOM.removeClass('keliError').text(s);

			adiarpt.adiaEconomyUsed[s] = true;
			break;
		}

		adiarpt.plegmaKeliOk[idx] = true;
		return adiarpt;
	}

	const proselefsi = adiarpt.proselefsiGet(data);
	const apoxorisi = adiarpt.apoxorisiGet(data);

	if (proselefsi && apoxorisi)
	keliDOM.append($('<div>').html('&#x2714;'));

	else if (proselefsi)
	keliDOM.addClass('keliError').append($('<div>').html('&#x25E7;'));

	else if (apoxorisi)
	keliDOM.addClass('keliError').append($('<div>').html('&#x25E8;'));

	else
	keliDOM.addClass('keliError').append($('<div>').html('&#x2753;'));

	return adiarpt;
};

adiarpt.proselefsiGet = (data) => {
	if (data.pt)
	return true;

	if (data.pe)
	return true;

	return false;
};

adiarpt.apoxorisiGet = (data) => {
	if (data.at)
	return true;

	if (data.ae)
	return true;

	return false;
};

///////////////////////////////////////////////////////////////////////////////@

adiarpt.ipomnimaSetup = () => {
	pnd.ofelimoDOM.
	append(adiarpt.ipomnimaDOM = $('<div>').
	attr('id', 'ipomnima'));

	return adiarpt;
};

adiarpt.ipomnimaDisplay = () => {
	let list = [];

	for (let i in adiarpt.adiaEconomyUsed)
	list.push(i);

	list.sort((p1, p2) => {
		const cmp = p1.localeCompare(p2);

		if (cmp < 0)
		return -1;

		if (cmp > 0)
		return 1;

		return 0;
	});

	for (let i = 0; i < list.length; i++) {
		$('<div>').
		addClass('ipomnimaItem').
		append($('<div>').
		addClass('ipomnimaShort').
		text(list[i])).
		append($('<div>').
		addClass('ipomnimaLong').
		text(adiarpt.adiaEconomyPam[list[i]])).
		appendTo(adiarpt.ipomnimaDOM);
	}

	return adiarpt;
};

///////////////////////////////////////////////////////////////////////////////@

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

adiarpt.ipalilosListPush = (kodikos) => {
	const ipalilos = self.opener.LETRAK.ipalilosList[kodikos];
	return (adiarpt.ipalilosList[kodikos] = ipalilos.e + ' ' +
		ipalilos.o + ' ' + ipalilos.p.substr(0, 3));
};

adiarpt.report = (e) => {
	e.stopPropagation();
	self.print();
};

///////////////////////////////////////////////////////////////////////////////@

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

adiarpt.imeraShortcut = [
	"Κυ",
	"Δε",
	"Τρ",
	"Τε",
	"Πε",
	"Πα",
	"Σα",
];

adiarpt.keliIndex = (ipalilos, date) => {
	let idx = ipalilos + ':' + date.getFullYear();

	let x = date.getMonth() + 1;

	if (x < 10)
	idx += '0';

	idx += x;

	x = date.getDate();

	if (x < 10)
	idx += '0';

	idx += x;

	return idx;
};

adiarpt.adiaEconomyMap = {
	'ΚΑΝΟΝΙΚΗ': 'ΚΑ',
	'ΚΑΝΟΝΙΚΗ (ΜΕΤΑΦΟΡΑ)': 'ΚΜ',
	'ΤΗΛΕΡΓΑΣΙΑ': 'ΤΛ',
	'ΕΚ ΠΕΡΙΤΡΟΠΗΣ': 'ΕΠ',

	'ΑΣΘΕΝΕΙΑ': 'ΥΔ',
	'ΑΝΑΡΡΩΤΙΚΗ': 'ΑΝ',
	'ΑΣΘΕΝΕΙΑ ΤΕΚΝΟΥ': 'ΑΤ',
	'ΑΙΜΟΔΟΣΙΑ': 'ΑΜ',
	'ΚΑΤ\' ΟΙΚΟΝ ΠΕΡΙΟΡΙΣΜΟΣ': 'ΠΟ',
	'ΙΑΤΡΙΚΕΣ ΕΞΕΤΑΣΕΙΣ': 'ΙΕ',

	'ΓΟΝΙΚΗ ΣΧΟΛ. ΕΠΙΔ.': 'ΓΕ',
	'ΓΟΝΙΚΗ ΑΝΑΤΡΟΦΗΣ': 'ΓΑ',
	'ΚΥΗΣΕΩΣ & ΛΟΧΕΙΑΣ': 'ΚΥ',

	'ΡΕΠΟ ΑΙΜΟΔΟΣΙΑΣ': 'ΡΑ',
	'ΡΕΠΟ ΥΠΕΡΩΡΙΑΣ': 'ΡΥ',
	'ΡΕΠΟ ΑΝΑΠΑΥΣΗΣ': 'ΡΠ',
	'ΣΥΜΠΛΗΡΩΣΗ ΩΡΑΡΙΟΥ': 'ΣΩ',

	'ΕΙΔΙΚΗ ΑΔΕΙΑ': 'ΕΑ',
	'ΣΕΜΙΝΑΡΙΟ': 'ΣΜ',
	'ΣΠΟΥΔΑΣΤΙΚΗ': 'ΣΠ',
	'ΣΥΝΔΙΚΑΛΙΣΤΙΚΗ': 'ΣΝ',
	'ΓΑΜΟΥ': 'ΓΜ',
	'ΠΕΝΘΟΥΣ': 'ΠΘ',
	'ΕΚΛΟΓΙΚΗ': 'ΕΚ',
	'ΑΘΛΗΤΙΚΗ': 'ΑΘ',
	'ΔΙΚΑΣΤΗΡΙΟ': 'ΔΚ',
	'ΣΤΡΑΤΙΩΤΙΚΗ': 'ΣΤ',

	'ΑΠΕΡΓΙΑ': 'ΑΓ',
	'ΑΝΕΥ ΑΠΟΔΟΧΩΝ': 'ΑΑ',
	'ΑΠΟΣΠΑΣΗ': 'ΑΠ',
	'ΔΙΑΘΕΣΙΜΟΤΗΤΑ': 'ΔΘ',
	'ΑΡΓΙΑ': 'ΑΡ',
	'ΛΥΣΗ ΣΧ. ΕΡΓΑΣΙΑΣ': 'ΑΛ',
	'ΜΕΤΑΚΙΝΗΣΗ': 'ΜΚ',
};

adiarpt.adiaEconomySetup = () => {
	adiarpt.adiaEconomyPam = {};
	adiarpt.adiaEconomyUsed = {};

	for (let i in adiarpt.adiaEconomyMap) {
		let x = adiarpt.adiaEconomyMap[i];

		if (adiarpt.adiaEconomyPam.hasOwnProperty(x))
		adiarpt.errorSet(i + ': adiaEconomy duplicate');

		adiarpt.adiaEconomyPam[x] = i;
	}

	return adiarpt;
};

(() => {
	if (!self.opener)
	return adiarpt.errorSet('missing opener');

	if (!self.opener.hasOwnProperty('LETRAK'))
	return adiarpt.errorSet("missing 'LETRAK' property in opener");

	if (self.opener.LETRAK.ipiresia)
	adiarpt.ipiresia = self.opener.LETRAK.ipiresia;

	if (!self.opener.LETRAK.apo)
	return adiarpt.errorSet("Ακαθόριστη αρχή διατήματος");

	adiarpt.apo = self.opener.LETRAK.apo;

	if (!self.opener.LETRAK.eos)
	return adiarpt.errorSet("Ακαθόριστο τέλος διατήματος");

	adiarpt.eos = self.opener.LETRAK.eos;

	if (self.opener.LETRAK.dlist)
	adiarpt.dlist = self.opener.LETRAK.dlist;

	adiarpt.adiaEconomySetup();
})();
