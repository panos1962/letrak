///////////////////////////////////////////////////////////////////////////////@
//
// @BEGIN
//
// @COPYRIGHT BEGIN
// Copyright (C) 2024 Panos I. Papadopoulos <panos1962_AT_gmail_DOT_com>
// @COPYRIGHT END
//
// @FILETYPE BEGIN
// javascipt
// @FILETYPE END
//
// @FILE BEGIN
// www/apontes/main.js —— Πρόγραμμα οδήγησης σελίδας εμφάνισης απόντων
// ημέρας.
// @FILE END
//
// @DESCRIPTION BEGIN
// Το παρόν πρόγραμμα οδηγεί τη σελίδα παρουσίασης απόντων ημέρας του δελτίου
// αποχώρησης του οποίου ο κωδικός έχει περαστεί στη σελίδα ως παράμετρος με
// ονομασία "deltio".
// @DESCRIPTION END
//
// @HISTORY BEGIN
// Updated: 2024-11-20
// Updated: 2024-11-14
// Updated: 2024-11-08
// Created: 2024-11-07
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

const apontes = {};

apontes.minima = {
	'apantesParontes': 'Άπαντες παρόντες. Κάντε κλικ, ' +
		'ή πατήστε οποιοδήποτε πλήκτρο για επιστροφή&#8230;',
};

pnd.domInit(() => {
	pnd.
	toolbarSetup().
	fyiSetup().
	ofelimoSetup().
	ribbonSetup().
	domSetup().
	domFixup();

	apontes.
	selidaSetup();
});

///////////////////////////////////////////////////////////////////////////////@

apontes.selidaSetup = () => {
	letrak.
	toolbarTitlosSetup('<b>Δελτίο απόντων</b>').
	toolbarXristisSetup().
	ribbonCopyrightSetup();

	if (letrak.noXristis())
	return apontes.fyiError('Διαπιστώθηκε ανώνυμη χρήση');

	if (php.noRequest('deltio'))
	apontes.fatalError('Απροσδιόριστο παρουσιολόγιο');

	let deltio = php.requestGet('deltio');

	if (!deltio)
	apontes.fatalError('Ακαθόριστο παρουσιολόγιο');

	pnd.ofelimoDOM.
	on('click', '.ipalilosArea', function(e) {
		apontes.ipalilosDoneToggle(e, $(this));
	});

	pnd.ofelimoDOM.
	append(apontes.deltioAreaDOM = $('<div>').attr('id', 'deltioArea')).
	append(apontes.apousiaAreaDOM = $('<div>').attr('id', 'apousiaArea'));

	$.post({
		'url': 'apontesGet.php',
		'data': {
			"deltio": deltio,
		},
		'dataType': 'json',
		'success': (rsp) => apontes.apontesProcess(rsp),
		'error': (e) => {
			pnd.fyiError('Σφάλμα ανίχνευσης απόντων');
			console.error(e);
		},
	});

	return apontes;
};

///////////////////////////////////////////////////////////////////////////////@

apontes.apontesProcess = (rsp) => {
	if (rsp.error)
	return apontes.fyiError(rsp.error);

	apontes.
	ipalilosSort(rsp).
	apousiaApalifi(rsp);

	document.title = rsp.proselefsi.ipiresia + ' ' + rsp.proselefsi.imerominia;

	apontes.
	deltioProcess(rsp).
	apousiaProcess(rsp);

console.log(rsp);

return apontes;

	let apantesParontes = true;

	for (let ipalilos in rsp.ipl) {
		apantesParontes = false;
		break;
	}

	let deltioAreaDOM = $('<div>').attr('id', 'deltioArea');

	deltioAreaDOM.
	append($('<div>').html(rsp.proselefsi + '@' + rsp.apoxorisi));

	if (self.LETRAK.hasOwnProperty('klisimoTabDOM'))
	deltioAreaDOM.
	append(self.LETRAK.klisimoTabDOM.addClass('apontesKlisimoTab'));

	pnd.ofelimoDOM.
	empty().
	append(deltioAreaDOM);

	if (apantesParontes)
	return apontes.apantesParontes();

	for (let ipalilos in rsp.ipl) {
		ipalilos = new apontes.ipalilos(ipalilos, rsp.ipl[ipalilos]);

		let dom = $('<div>').addClass('ipalilosArea').
			appendTo(pnd.ofelimoDOM);

		dom.
		append(ipalilos.ipalilosDomGet());

		let t = tre.parousia.hasOwnProperty(ipalilos.kodikos) ?
			new apontes.parousia(ipalilos,
				tre.parousia[ipalilos.kodikos]) : undefined;
		let p = pro.parousia.hasOwnProperty(ipalilos.kodikos) ?
			new apontes.parousia(ipalilos,
				pro.parousia[ipalilos.kodikos]) : undefined;

		if ((!p) && (!t))
		continue;

		if ((!p) && t) {
			apontes.ipalilosProsthiki(dom, t);
			continue;
		}

		if (!(t) && p) {
			apontes.ipalilosAferesi(dom, p);
			continue;
		}

		apontes.
		kartaAlagi(dom, t, p).
		adiaAlagi(dom, t, p).
		exeresiCheck(dom, t).
		infoCheck(dom, t, p);
	}

	return apontes;
};

apontes.deltioProcess = function(rsp) {
	let proselefsi = rsp.proselefsi;
	let apoxorisi = rsp.apoxorisi;

	apontes.deltioAreaDOM.
	append($('<div>').
	attr('id', 'deltioImerominia').
	text(proselefsi.imerominia));

	let kodikosDOM = $('<div>').attr('id', 'deltioKodikos').
	appendTo(apontes.deltioAreaDOM);

	kodikosDOM.
	append($('<div>').
	attr('id', 'deltioProselefsi').
	text(proselefsi.kodikos));

	if (apoxorisi)
	kodikosDOM.
	append($('<div>').
	attr('id', 'deltioApoxorisi').
	text(apoxorisi.kodikos));

	apontes.deltioAreaDOM.
	append($('<div>').
	attr('id', 'deltioIpiresia').
	text(proselefsi.ipiresia));

	return apontes;
};

// Η function "apousiaProcess" διατρέχει τη λίστα των απόντων υπαλλήλων και
// εμφανίζει τα στοιχεία του κάθε υπαλλήλου και της σχετικής απουσίας.

apontes.apousiaProcess = function(rsp) {
	if (!apontes.ilist.length)
	return apontes.apantesParontes();

	for (let i = 0; i < apontes.ilist.length; i++)
	apontes.ipalilosProcess(apontes.ilist[i], rsp, i % 2);

	return apontes;
};

// Η function "ipalilosProcess" δέχεται ως παράμετρο έναν υπάλληλο και
// παρουσιάζει τα στοιχεία του υπαλλήλου και της σχετικής απουσίας.

apontes.ipalilosProcess = function(ipalilos, rsp, zebra) {
	let ipalilosDOM = $('<div>').
	addClass('ipalilos').
	addClass('ipalilos' + zebra);

	ipalilosDOM.
	append($('<div>').addClass('ipalilosKodikos').text(ipalilos.kodikos)).
	append($('<div>').addClass('ipalilosOnoma').text(ipalilos.onoma));

	ipalilos = ipalilos.kodikos;

	let proselefsi = undefined;

	if (rsp.proselefsi && rsp.proselefsi.parousia.hasOwnProperty(ipalilos))
	proselefsi = rsp.proselefsi.parousia[ipalilos];

	let apoxorisi = undefined;

	if (rsp.apoxorisi && rsp.apoxorisi.parousia.hasOwnProperty(ipalilos))
	apoxorisi = rsp.apoxorisi.parousia[ipalilos];

	apontes.
	apousiaPush(ipalilosDOM, proselefsi, 'Proselefsi').
	apousiaPush(ipalilosDOM, apoxorisi, 'Apoxorisi');

	apontes.apousiaAreaDOM.
	append(ipalilosDOM);

	return apontes;
};

apontes.apousiaPush = function(dom, apousia, proapo) {
	if (!apousia)
	return apontes;

	let apousiaDOM = $('<div>').addClass('apousia').appendTo(dom);
	let adidos = undefined;

	if (apousia.adidos)
	adidos = apousia.adidos;

	if (apousia.excuse) {
		adidos = apousia.excuse;
		apousiaDOM.addClass('apousia' + proapo);
	}

	apousiaDOM.text(adidos);

	return apontes;
};

apontes.ipalilosSort = function(rsp) {
	let ilist = rsp.ipalilos;
	let i;

	apontes.ilist = [];

	for (i in rsp.ipalilos)
	apontes.ilist.push({
		"kodikos": i,
		"onoma": ilist[i]
	});

	delete rsp.ipalilos;

	apontes.ilist.sort(function(i1, i2) {
		let cmp = i1.onoma.localeCompare(i2.onoma);

		if (cmp)
		return cmp;

		if (i1 < i2)
		return -1;

		else if (i1 > i2)
		return 1;

		return 0;
	});

	console.log(apontes.ilist);
	console.log(rsp);

	return apontes;
};

apontes.apousiaApalifi = function(rsp) {
	let ateles = 2;

	if (rsp.pro)
	ateles--;

	if (rsp.apo)
	ateles--;

	if (ateles)
	return apontes;

	for (let i in rsp.pro.parousia) {
		if (!(i in rsp.apo.parousia))
		continue;

		let dif = false;

		for (let j in rsp.pro.parousia[i]) {
			if (rsp.apo.parousia[i][j] != rsp.pro.parousia[i][j]) {
				dif = true;
				break;
			}
		}

		if (dif)
		continue;

		for (let j in rsp.apo.parousia[i]) {
			if (rsp.apo.parousia[i][j] != rsp.pro.parousia[i][j]) {
				dif = true;
				break;
			}
		}

		if (dif)
		continue;

		delete rsp.apo.parousia[i];
	}

	return apontes;
};

apontes.apantesParontes = function() {
	apontes.apousiaAreaDOM.
	append($('<div>').
	attr('id', 'apantesParontes').
	html(apontes.minima.apantesParontes));

	pnd.bodyDOM.
	on('click', (e) => apontes.apantesParontesClose(e)).
	on('keyup', (e) => apontes.apantesParontesClose(e));

	return apontes;
};

apontes.apantesParontesClose = function(e) {
	e.stopPropagation();
	self.close();
};

apontes.adiaDiastima = (parousia) => {
	let s = ' &#10098;';

	if (parousia.adapo)
	s += '<b>' + parousia.adapo + '</b>';

	s += '&nbsp;&#8212;&nbsp;';

	if (parousia.adeos)
	s += '<b>' + parousia.adeos + '</b>';

	s += '&#10099';

	return s;
};

apontes.exeresiCheck = (dom, t) => {
	if (!t.excuse)
	return apontes;

	let msg = 'Εξαίρεση <b>' + t.excuse + '</b>';

	dom.append($('<div>').html(msg));
	return apontes;
};

apontes.infoCheck = (dom, t, p) => {
	if (!t.info)
	return apontes;

	let msg = 'Παρατήρηση: <b>' + t.info + '</b>';

	dom.append($('<div>').html(msg));
	return apontes;
};

///////////////////////////////////////////////////////////////////////////////@

// Η function "ipalilosDoneToggle" καλείται όταν γίνεται κλικ σε κάποια
// εγγραφή διαφοράς παρουσίας και σκοπό έχει να μαρκάρει με αλλαγή χρώματος
// τη συγκεκριμένη διαφφορά προκειμένου να γνωρίζει ο χρήστης ποιες διαφορές
// έχει ήδη επεξεργαστεί.

apontes.ipalilosDoneToggle = function(e, dom) {
	e.stopPropagation();
	e.preventDefault();

	if (dom.hasClass('ipalilosAreaDone'))
	dom.removeClass('ipalilosAreaDone');

	else
	dom.addClass('ipalilosAreaDone');
};

///////////////////////////////////////////////////////////////////////////////@

apontes.deltio = function(deltio) {
	this.kodikos = deltio.kodikos;
	this.imerominia = deltio.imerominia;
	this.parousia = deltio.parousia;
};

apontes.deltio.prototype.deltioDomGet = function() {
	if (this.hasOwnProperty('DOM'))
	return this.DOM;

	let date = new Date(this.imerominia);
	let dmy = pnd.date2date(date, 'YMD', '%D-%M-%Y');
	let imera = pnd.dowLongGet(date);

	this.DOM = $('<div>').addClass('deltio').
	append($('<div>').addClass('deltioKodikos').text(this.kodikos)).
	append($('<div>').addClass('deltioImera').text(imera)).
	append($('<div>').addClass('deltioImerominia').text(dmy));

	return this.DOM;
};

///////////////////////////////////////////////////////////////////////////////@

apontes.ipalilos = function(ipalilos, props) {
	this.kodikos = ipalilos;

	for (let i in props)
	this[i] = props[i];
};

apontes.ipalilos.prototype.ipalilosDomGet = function() {
	if (this.hasOwnProperty('DOM'))
	return this.DOM;

	this.DOM = $('<div>').addClass('ipalilos').
	append($('<div>').addClass('ipalilosKodikos').text(this.kodikos)).
	append($('<div>').addClass('ipalilosEponimo').text(this.eponimo)).
	append($('<div>').addClass('deltioOnoma').text(this.onoma)).
	append($('<div>').addClass('deltioOnoma').text(this.patronimo.substr(0, 3)));

	return this.DOM;
};

///////////////////////////////////////////////////////////////////////////////@

apontes.parousia = function(ipalilos, parousia) {
	if (!parousia)
	return;

	this.ipalilos = ipalilos;
	this.orario = parousia.orario;
	this.karta = parousia.karta;
	this.adidos = parousia.adidos;
	this.adapo = parousia.adapo ?
		pnd.date2date(parousia.adapo, 'YMD', '%D-%M-%Y') : '';
	this.adeos = parousia.adeos ?
		pnd.date2date(parousia.adeos, 'YMD', '%D-%M-%Y') : '';
	this.excuse = parousia.excuse;
	this.info = parousia.info;
};

apontes.parousia.prototype.isParousia = function() {
	return this.ipalilos;
};

apontes.parousia.prototype.parousiaDomGet = function() {
	if (this.hasOwnProperty('DOM'))
	return this.DOM;

	this.DOM = $('<div>').addClass('parousia').
	append($('<div>').addClass('parousiaOrario').text(this.orario)).
	append($('<div>').addClass('parousiaKarta').text(this.karta));

	return this.DOM;
};

///////////////////////////////////////////////////////////////////////////////@

apontes.fyiError = (s) => {
	pnd.fyiError(s);
	return apontes;
};

apontes.fatalError = (s) => {
	pnd.fyiError(s);
	throw s;
};

///////////////////////////////////////////////////////////////////////////////@
