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
// www/diafores/main.js —— Πρόγραμμα οδήγησης σελίδας εμφάνισης διαφορών
// παρουσιολογίων.
// @FILE END
//
// @DESCRIPTION BEGIN
// Το παρόν πρόγραμμα οδηγεί τη σελίδα παρουσίασης διαφορών τρέχοντος
// παρουσιολογίου με αντίστοιχο προηγούμενο παρουσιπολόγιο. Ο κωδικός
// του τρέχοντος παρουσιολογίου έχει περαστεί ως παράμετρος "tre", ενώ
// ο κωδικός του αντίστοιχου προηγούμενου παρουσιολογίου έχει περαστεί
// ως παράμετρος "pro".
// @DESCRIPTION END
//
// @HISTORY BEGIN
// Updated: 2022-09-29
// Updated: 2022-09-26
// Updated: 2022-09-25
// Updated: 2022-09-24
// Updated: 2022-09-22
// Updated: 2022-09-21
// Created: 2022-09-17
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

const diafores = {};
const ektiposi =
require('./ektiposi.js')(pnd, letrak, diafores);

pnd.domInit(() => {
	pnd.
	toolbarSetup().
	fyiSetup().
	ofelimoSetup().
	ribbonSetup().
	domSetup().
	domFixup();

	diafores.
	selidaSetup();

	window.onbeforeprint = ektiposi.before;
	window.onafterprint = ektiposi.after;
});

///////////////////////////////////////////////////////////////////////////////@

diafores.selidaSetup = () => {
	ektiposi.setup();
	letrak.
	toolbarTitlosSetup('<b>Διαφορές Παρουσιολογίων</b>').
	toolbarXristisSetup().
	ribbonCopyrightSetup();

	if (letrak.noXristis())
	return pnd.fyiError('Διαπιστώθηκε ανώνυμη χρήση');

	if (!self.opener)
	return pnd.fyiError('Ακαθόριστη γονική σελίδα');

	try {
		diafores.tre = self.opener.LETRAK.trexon.kodikosGet();
	}

	catch (e) {
		return pnd.fyiError('Απροσδιόριστο τρέχον παρουσιολόγιο');
	}

	pnd.
	keepAlive('../mnt/pandora');

	pnd.ofelimoDOM.
	on('click', '.ipalilosArea', function(e) {
		diafores.ipalilosDoneToggle(e, $(this));
	});

	$.post({
		'url': 'diaforesGet.php',
		'data': {
			"tre": diafores.tre,
		},
		'dataType': 'json',
		'success': (rsp) => diafores.diaforesProcess(rsp),
		'error': (e) => {
			pnd.fyiError('Σφάλμα ανίχνευσης διαφορών');
			console.error(e);
		},
	});

	return diafores;
};

diafores.ipalilosDoneToggle = function(e, dom) {
	e.stopPropagation();
	e.preventDefault();

	if (dom.hasClass('ipalilosAreaDone'))
	dom.removeClass('ipalilosAreaDone');

	else
	dom.addClass('ipalilosAreaDone');
};

diafores.diaforesProcess = (rsp) => {
	if (rsp.error)
	return pnd.fyiError(rsp.error);

	let tre = new diafores.deltio(rsp.tre);
	let pro = new diafores.deltio(rsp.pro);

	document.title = tre.kodikos + ' <> ' + pro.kodikos;

	let nodif = true;

	for (let ipalilos in rsp.ipl) {
		nodif = false;
		break;
	}

	pnd.ofelimoDOM.
	empty().
	append($('<div>').attr('id', 'deltioArea').
	append(tre.deltioDomGet()).
	append($('<div>').html(nodif ? '&#9776' : '&#9775')).
	append(pro.deltioDomGet()));

	if (nodif)
	return diafores.oxiAlages();

	for (let ipalilos in rsp.ipl) {
		ipalilos = new diafores.ipalilos(ipalilos, rsp.ipl[ipalilos]);

		let dom = $('<div>').addClass('ipalilosArea').
			appendTo(pnd.ofelimoDOM);

		dom.
		append(ipalilos.ipalilosDomGet());

		let t = tre.parousia.hasOwnProperty(ipalilos.kodikos) ?
			new diafores.parousia(ipalilos,
				tre.parousia[ipalilos.kodikos]) : undefined;
		let p = pro.parousia.hasOwnProperty(ipalilos.kodikos) ?
			new diafores.parousia(ipalilos,
				pro.parousia[ipalilos.kodikos]) : undefined;

		if ((!p) && (!t))
		continue;

		if ((!p) && t) {
			diafores.ipalilosProsthiki(dom, t);
			continue;
		}

		if (!(t) && p) {
			diafores.ipalilosAferesi(dom, p);
			continue;
		}

		diafores.
		kartaAlagi(dom, t, p).
		adiaAlagi(dom, t, p).
		exeresiCheck(dom, t).
		infoAlagi(dom, t, p);
	}

	return diafores;
};

diafores.oxiAlages = function() {
	pnd.ofelimoDOM.
	append($('<div>').addClass('diaforesNoDif').
	text('Δεν παρουσιάστηκαν διαφορές. Κάντε κλικ, ' +
		'ή πατήστε οποιοδήποτε πλήκτρο για επιστροφή.'));
	pnd.bodyDOM.
	on('click', (e) => diafores.oxiAlagesClose(e)).
	on('keyup', (e) => diafores.oxiAlagesClose(e));

	return diafores;
};

diafores.oxiAlagesClose = function(e) {
	e.stopPropagation();
	self.close();
};

diafores.ipalilosProsthiki = (dom, parousia) => {
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
	return diafores;
};

diafores.ipalilosAferesi = (dom, parousia) => {
	let msg = 'Αφαιρέθηκε υπάλληλος';

	if (parousia.adidos)
	msg += ', <b>αδειούχος ών</b>';

	dom.append($('<div>').html(msg));
	return diafores;
};

diafores.kartaAlagi = (dom, t, p) => {
	if (t.karta === p.karta)
	return diafores;

	let msg = 'Αλλαγή κάρτας';

	if (p.karta)
	msg += ' από <b>' + p.karta + '</b>';

	if (t.karta)
	msg += ' σε <b>' + t.karta + '</b>';

	dom.append($('<div>').html(msg));
	return diafores;
};

diafores.adiaAlagi = (dom, t, p) => {
	let nodif = true;

	if (t.adidos !== p.adidos)
	nodif = false;

	else if (t.adapo !== p.adapo)
	nodif = false;

	else if (t.adeos !== p.adeos)
	nodif = false;

	if (nodif)
	return diafores;

	if ((!p.adidos) && t.adidos) {
		let msg = 'Εκκίνηση αδείας, είδος <b>' + t.adidos + '</b>';

		if (t.adapo)
		msg += ', από <b>' + t.adapo + '</b>';

		if (t.adeos)
		msg += ', έως <b>' + t.adeos + '</b>';

		dom.append($('<div>').html(msg));
		return diafores;
	}

	if (p.adidos && (!t.adidos)) {
		let msg = 'Λήξη αδείας, είδος <b>' + p.adidos + '</b>';

		if (p.adapo)
		msg += ', από <b>' + p.adapo + '</b>';

		if (p.adeos)
		msg += ', έως <b>' + p.adeos + '</b>';

		dom.append($('<div>').html(msg));
		return diafores;
	}

	let msg = 'Αλλαγή αδείας' +
		' από <b>' + p.adidos + ' ' + p.adapo + ' &#8212; ' + p.adeos + '</b>' +
		' σε <b>' + t.adidos + ' ' + t.adapo + ' &#8212; ' + t.adeos + '</b>';

	dom.append($('<div>').html(msg));
	return diafores;
};

diafores.exeresiCheck = (dom, t) => {
	if (!t.excuse)
	return diafores;

	let msg = 'Εξαίρεση <b>' + t.excuse + '</b>';

	dom.append($('<div>').html(msg));
	return diafores;

	dom.append($('<div>').html(msg));
	return diafores;
};

diafores.infoAlagi = (dom, t, p) => {
	if (!t.info)
	return diafores;

	if (t.info === p.info)
	return diafores;

	let msg = 'Παρατήρηση: <b>' + t.info + '</b>';

	dom.append($('<div>').html(msg));
	return diafores;
};

///////////////////////////////////////////////////////////////////////////////@

diafores.deltio = function(deltio) {
	this.kodikos = deltio.kodikos;
	this.imerominia = deltio.imerominia;
	this.parousia = deltio.parousia;
};

diafores.deltio.prototype.deltioDomGet = function() {
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

diafores.ipalilos = function(ipalilos, props) {
	this.kodikos = ipalilos;

	for (let i in props)
	this[i] = props[i];
};

diafores.ipalilos.prototype.ipalilosDomGet = function() {
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

diafores.parousia = function(ipalilos, parousia) {
	if (!parousia)
	return;

	this.ipalilos = ipalilos;
	this.orario = parousia.orario;
	this.karta = parousia.karta;
	this.adidos = parousia.adidos;
	this.adapo = pnd.date2date(parousia.adapo, 'YMD', '%D-%M-%Y');
	this.adeos = pnd.date2date(parousia.adeos, 'YMD', '%D-%M-%Y');
	this.excuse = parousia.excuse;
	this.info = parousia.info;
};

diafores.parousia.prototype.isParousia = function() {
	return this.ipalilos;
};

diafores.parousia.prototype.parousiaDomGet = function() {
	if (this.hasOwnProperty('DOM'))
	return this.DOM;

	this.DOM = $('<div>').addClass('parousia').
	append($('<div>').addClass('parousiaOrario').text(this.orario)).
	append($('<div>').addClass('parousiaKarta').text(this.karta));

	return this.DOM;
};

///////////////////////////////////////////////////////////////////////////////@
