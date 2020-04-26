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
// www/prosopa/main.js —— Πρόγραμμα οδήγησης σελίδας επεξεργασίας
// παρουσιολογίου.
// @FILE END
//
// @DESCRIPTION BEGIN
// Το παρόν πρόγραμμα οδηγεί τη σελίδα επεξεργασίας παρουσιολογίου. Δέχεται
// ως παράμετρο τον κωδικό παρουσιολογίου και αφού παραλάβει τα στοιχεία τού
// συγκεκριμένου παρουσιολογίου από τον server, το εμφανίζει στη σελίδα και
// παρέχει τη δυνατότητα επεξεργασίας των στοιχείων του παρουσιολογίου.
// @DESCRIPTION END
//
// @HISTORY BEGIN
// Updated: 2020-04-26
// Updated: 2020-04-25
// Created: 2020-04-24
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

// Αν η σελίδα έχει εκκινήσει από τη σελίδα διαχείρισης παρουσιολογίων, τότε
// θέτω το "imr" να δείχνει σε globals που έχουν οριστεί στην εν λόγω σελίδα
// προκειμένου να μπορούμε να επιτελέσουμε διάφορες ενέργειες και σε αυτή τη
// σελίδα (πατρική).

const imr = (self.opener && self.opener.hasOwnProperty('LETRAK') &&
	self.opener.LETRAK.imerisio) ? self.opener.LETRAK : undefined;

const prosopa = {};

prosopa.minima = {
	'imerisioAkathoristo': 'Ακαθόριστο παρουσιολόγιο',
};

pnd.domInit(() => {
	prosopa.opener
	pnd.
	toolbarSetup().
	fyiSetup().
	ofelimoSetup().
	ribbonSetup().
	domSetup().
	domFixup();

	prosopa.
	selidaSetup();
});

prosopa.selidaSetup = () => {
	letrak.
	toolbarTitlosSetup('<b>Επεξεργασία Παρουσιολογίου</b>').
	toolbarXristisSetup().
	ribbonCopyrightSetup();

	let imerisio = php.requestGet('imerisio');

	if (!imerisio) {
		pnd.fyiError(prosopa.minima.imerisioAkathoristo);
		return prosopa;
	}

	letrak.
	toolbarTitlosSet('Παρουσιολόγιο <b>' + imerisio + '</b>');

	if (letrak.noXristis())
	return prosopa.fyiError('Διαπιστώθηκε ανώνυμη χρήση');

	pnd.
	keepAlive('../mnt/pandora');

	pnd.ofelimoDOM.
	append(prosopa.imerisioDOM = $('<div>').
	addClass('imerisioArea')).
	append(prosopa.browserDOM = $('<div>').
	addClass('browser'));

	prosopa.
	imerisioSetup(imerisio);

	return prosopa;
};

prosopa.imerisioSetup = (imerisio) => {
/*
	if (imr && imr.hasOwnProperty('imerisioROW') &&
	(imr.imerisioROW.kodikosGet() != imerisio))
	return prosopa.fyiError('Προβληματικό παρουσιολόγιο');
*/

	pnd.fyiMessage('Αναζήτηση στοιχείων παρουσιολογίου…');

	$.post({
		'url': 'prosopa.php',
		'dataType': 'json',
		'data': {
			'imerisio': imerisio,
		},
		'success': (rsp) => {
			if (rsp.error)
			return pnd.fyiError(rsp.error);

			pnd.fyiClear();
			prosopa.
			imerisioProcess(rsp.imerisio).
			prosopaProcess(rsp.prosopa);
		},
		'error': (err) => {
			pnd.fyiError('Αδυναμία λήψης στοιχείων παρουσιολογίου');
			console.error(err);
		},
	});

/*
console.log(imr.imerisioROW);
imr.imerisioDOM.css('background-color', 'red');
*/

	return prosopa;
};

prosopa.imerisioProcess = (imerisio) => {
	imerisio = new letrak.imerisio(imerisio);

	prosopa.imerisioDOM.
	append(imerisio.domGet());

	return prosopa;
};

prosopa.prosopaProcess = (parousia) => {
	pnd.
	arrayWalk(parousia, (v, k) => {
		parousia[k] = new letrak.parousia(v);
		prosopa.browserDOM.
		append(parousia[k].domGet());
	});

	prosopa.
	browserFix();

	return prosopa;
};

///////////////////////////////////////////////////////////////////////////////@

letrak.imerisio.prototype.domGet = function() {
	let prosapo = this.prosapoGet();
	let imerominia = this.imerominiaGet().toLocaleDateString('el-GR', {
		'weekday': 'long',
		'year': 'numeric',
		'month': 'long',
		'day': 'numeric',
	});

	let dom = $('<div>').
	addClass('imerisio').

	append($('<div>').
	addClass('imerisioKodikos').
	text(this.kodikosGet())).

	append($('<div>').
	addClass('imerisioPerigrafi').
	text(this.perigrafiGet())).

	append($('<div>').
	addClass('imerisioProsapo').
	addClass('imerisioProsapo' +
	(prosapo === 'ΠΡΟΣΕΛΕΥΣΗ' ? 'Proselefsi' : 'Apoxorisi')).
	text(prosapo)).

	append($('<div>').
	addClass('imerisioImerominia').
	text(imerominia));

	return dom;
};

letrak.parousia.prototype.domGet = function() {
/*
this.ipalilos = 1234567;
this.karta = 1234567;
this.orario = '09:00-17:00';
this.excuse = 'ΕΚΤΟΣ ΕΔΡΑΣ';
*/
this.orario = new letrak.orario('830-1430');
	let dom = $('<div>').
	data('data', this).
	addClass('parousia').

	append($('<div>').
	addClass('parousiaOrdinal')).

	append($('<div>').
	attr('title', 'Κωδικός υπαλλήλου').
	addClass('parousiaIpalilos').
	text(this.ipalilosGet())).

	append($('<div>').
	addClass('parousiaOnomateponimo').
	text(this.onomateponimoGet())).

	append($('<div>').
	attr('title', 'Αριθμός κάρτας').
	addClass('parousiaKarta').
	text(this.kartaGet())).

	append($('<div>').
	attr('title', 'Ωράριο υπαλλήλου').
	addClass('parousiaOrario').
	text(this.orarioGet().toString())).

	append($('<div>').
	addClass('parousiaMeraora').
	text(pnd.date(this.meraoraGet(), '%D-%M-%Y %h:%m'))).

	append($('<div>').
	addClass('parousiaExcuse').
	text(this.excuseGet())).

	append($('<div>').
	attr('title', 'Παρατηρήσεις').
	addClass('parousiaInfo').
	text(this.infoGet()));

	return dom;
};

///////////////////////////////////////////////////////////////////////////////@

prosopa.fyiMessage = (s) => {
	pnd.fyiMessage(s);
	return prosopa;
};

prosopa.fyiError = (s) => {
	pnd.fyiError(s);
	return prosopa;
};


prosopa.browserFix = () => {
	let i = 0;
	let zebra1 = 'pnd-zebra1';
	let zebra2 = 'pnd-zebra2';

	prosopa.browserDOM.
	children().
	each(function() {
		let zebra = (++i % 2 ? zebra1 : zebra2);

		$(this).
		removeClass(zebra1).
		removeClass(zebra2).
		addClass(zebra).
		children('.parousiaOrdinal').
		text(i);
	});

	return prosopa;
};
