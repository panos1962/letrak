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

	pnd.
	keepAlive('../mnt/pandora');

	if (!(diafores.tre = php.getGet("tre")))
	return pnd.fyiError('Ακαθόριστο τρέχον παρουσιολόγιο');

	if (!(diafores.pro = php.getGet("pro")))
	return pnd.fyiError('Ακαθόριστο προηγούμενο παρουσιολόγιο');

	$.post({
		'url': 'diaforesGet.php',
		'data': {
			"tre": diafores.tre,
			"pro": diafores.pro,
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

diafores.diaforesProcess = (rsp) => {
	let tre = new diafores.deltio(rsp.tre);
	let pro = new diafores.deltio(rsp.pro);

	pnd.ofelimoDOM.
	empty().
	append(tre.deltioDomGet()).
	append(pro.deltioDomGet());

	for (let ipalilos in rsp.tre.parousia) {
		let p1 = new diafores.parousia(ipalilos, rsp.tre.parousia[ipalilos]);
		let p2 = new diafores.parousia(ipalilos, rsp.pro.parousia[ipalilos]);

		pnd.ofelimoDOM.
		append(p1.parousiaDomGet());
	}

	return diafores;
};

///////////////////////////////////////////////////////////////////////////////@

diafores.deltio = function(deltio) {
	this.kodikos = deltio.kodikos;
	this.imerominia = deltio.imerominia;
};

diafores.deltio.prototype.deltioDomGet = function() {
	if (this.hasOwnProperty('DOM'))
	return this.DOM;

	this.DOM = $('<div>').
	append($('<div>').addClass('deltio').
	append($('<div>').addClass('deltioKodikos').text(this.kodikos)).
	append($('<div>').addClass('deltioImerominia').text(this.imerominia)));

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
	this.adapo = parousia.adapo;
	this.adeos = parousia.adeos;
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
	append($('<div>').addClass('parousiaIpalilos').text(this.ipalilos)).
	append($('<div>').addClass('parousiaOrario').text(this.orario)).
	append($('<div>').addClass('parousiaKarta').text(this.karta));

	return this.DOM;
};

///////////////////////////////////////////////////////////////////////////////@
