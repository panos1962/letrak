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

/*
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
*/
apontes.apontesProcess({
"proselefsi": '123',
"apoxorisi": '456',
"ipiresia": "Β10",
"perigrafi": "asd ahsd kashdkjash dhkajh sdkahkd",
"ipl": [],
});

	return apontes;
};

///////////////////////////////////////////////////////////////////////////////@

apontes.apontesProcess = (rsp) => {
	if (rsp.error)
	return apontes.fyiError(rsp.error);

	document.title = rsp.proselefsi + '+' + rsp.apoxorisi;

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

apontes.apantesParontes = function() {
	pnd.ofelimoDOM.
	append($('<div>').addClass('apantesParontes').
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

apontes.ipalilosProsthiki = (dom, parousia) => {
	let msg = 'Προστέθηκε υπάλληλος';

	msg += parousia.orario ?
		', ωράριο: <b>' + parousia.orario + '</b>'
	:
		', <b>χωρίς ωράριο</b>';

	msg += parousia.karta ?
		', κάρτα: <b>' + parousia.karta + '</b>'
	:
		', <b>χωρίς κάρτα</b>';

	if (parousia.adidos)
	msg += ', <b>αδειούχος</b>';

	if (parousia.excuse)
	msg += ', <b>δικαιολογημένος</b>';

	dom.append($('<div>').html(msg));
	return apontes;
};

apontes.ipalilosAferesi = (dom, parousia) => {
	let msg = 'Αφαιρέθηκε υπάλληλος';

	if (parousia.adidos)
	msg += ', <b>αδειούχος ών</b>';

	dom.append($('<div>').html(msg));
	return apontes;
};

apontes.kartaAlagi = (dom, t, p) => {
	if (t.karta === p.karta)
	return apontes;

	let msg = 'Αλλαγή κάρτας';

	if (p.karta)
	msg += ' από <b>' + p.karta + '</b>';

	if (t.karta)
	msg += ' σε <b>' + t.karta + '</b>';

	dom.append($('<div>').html(msg));
	return apontes;
};

apontes.adiaAlagi = (dom, t, p) => {
	let nodif = true;

	if (t.adidos !== p.adidos)
	nodif = false;

	else if (t.adapo !== p.adapo)
	nodif = false;

	else if (t.adeos !== p.adeos)
	nodif = false;

	if (nodif)
	return apontes;

	if ((!p.adidos) && t.adidos) {
		let msg = 'Εκκίνηση αδείας,' +
			apontes.adiaIdos(t) +
			apontes.adiaDiastima(t);

		dom.append($('<div>').html(msg));
		return apontes;
	}

	if (p.adidos && (!t.adidos)) {
		let msg = 'Λήξη αδείας,' +
			apontes.adiaIdos(p) +
			apontes.adiaDiastima(p);

		dom.append($('<div>').html(msg));
		return apontes;
	}

	let msg = 'Αλλαγή αδείας' +
		' από' + apontes.adiaIdos(p) + apontes.adiaDiastima(p) +
		' σε' + apontes.adiaIdos(t) + apontes.adiaDiastima(t);

	dom.append($('<div>').html(msg));
	return apontes;
};

apontes.adiaIdos = (parousia) => {
	let s = ' <b>' + parousia.adidos + '</b>';
	return s;
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
