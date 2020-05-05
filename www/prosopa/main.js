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
// Updated: 2020-05-05
// Updated: 2020-05-04
// Updated: 2020-05-02
// Updated: 2020-05-01
// Updated: 2020-04-30
// Updated: 2020-04-29
// Updated: 2020-04-28
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
// θέτω το "imr" να δείχνει σε μεταβλητές που έχουν οριστεί στην εν λόγω
// σελίδα προκειμένου να μπορούμε να επιτελέσουμε διάφορες ενέργειες και
// σε αυτή τη σελίδα ως γονική.

const imr = (self.opener && self.opener.hasOwnProperty('LETRAK') &&
	self.opener.LETRAK.hasOwnProperty('imerisio') &&
	self.opener.LETRAK.imerisio.row) ?
	self.opener.LETRAK.imerisio : undefined;

const prosopa = {};

prosopa.minima = {
	'ipografiCheckSymbol': '&#x2714;',

	'imerisioKatastasiNeoSymbol': '&#x25D4;',
	'imerisioKatastasiEkremesSymbol': '&#x25D1;',
	'imerisioKatastasiReadySymbol': '&#x25D5;',
	'imerisioKatastasiClosedSymbol': '&#x2714;',

	'imerisioAkathoristo': 'Ακαθόριστο παρουσιολόγιο',
	'ipografesTabLabel': 'Υπογραφές',

	'ipografiAnaneosiTabLabel': 'Ανανέωση',
	'ipografiAnaneosiTabTitle': 'Ανανέωση εικόνας υπογραφών',

	'ipografiInsertTabLabel': 'Προσθήκη',
	'ipografiInsertTabTitle': 'Προσθήκη υπογράφοντος υπαλλήλου',

	'ipografiEditTabLabel': 'Επεξεργασία',
	'ipografiEditTabTitle': 'Επεξεργασία υπογράφοντος υπαλλήλου',

	'ipografiDeleteTabLabel': 'Απαλοιφή',
	'ipografiDeleteTabTitle': 'Απαλοιφή υπογράφοντος υπαλλήλου',

	'ipografiEpikirosiTabLabel': 'Επικύρωση',
	'ipografiEpikirosiTabTitle': 'Επικύρωση στοιχείων παρουσιολογίου',

	'ipografiAkirosiTabLabel': 'Αναίρεση',
	'ipografiAkirosiTabTitle': 'Αναίρεση υπογραφής',
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

	// Ο κωδικός του προς επεξεργασία παρουσιολογίου δίνεται ως POST
	// ή GET παράμετρος με το όνομα "imerisio".

	prosopa.imerisio = php.requestGet('imerisio');

	if (!prosopa.imerisio)
	return prosopa.fyiError(prosopa.minima.imerisioAkathoristo);

	letrak.
	toolbarTitlosSet('Παρουσιολόγιο <b>' + prosopa.imerisio + '</b>');

	document.title = prosopa.imerisio;

	if (letrak.noXristis())
	return prosopa.fyiError('Διαπιστώθηκε ανώνυμη χρήση');

	if (imr && (imr.row.kodikosGet() != prosopa.imerisio))
	return prosopa.fyiError('Πρόβλημα σύνδεσης με την γονική σελίδα');

	pnd.
	keepAlive('../mnt/pandora');

	///////////////////////////////////////////////////////////////////////@

	pnd.ofelimoDOM.

	append(prosopa.imerisioAreaDOM = $('<div>').
	addClass('imerisioArea')).

	append(prosopa.browserDOM = $('<div>').
	addClass('browser'));

	///////////////////////////////////////////////////////////////////////@

	pnd.fyiMessage('Αναζήτηση στοιχείων παρουσιολογίου…');
	$.post({
		'url': 'prosopa.php',
		'dataType': 'json',
		'data': {
			'imerisio': prosopa.imerisio,
		},
		'success': (rsp) => {
			if (rsp.error)
			return pnd.fyiError(rsp.error);

			prosopa.
			fyiClear().
			imerisioProcess(rsp.imerisio).
			ipografesProcess(rsp.ipografes).
			prosopaProcess(rsp.prosopa);

			if (imr) {
				// Σε περίπτωση που το παρουσιολόγιο έχει
				// μόλις δημιουργηθεί ως αντίγραφο κάποιου
				// προηγούμενου παρουσιολογίου, φροντίζουμε
				// να παρουσιαστεί το νεότευκτο σε ανοιγμένη
				// μορφή.

				if (imr.klonos)
				prosopa.ipografesTabDOM.trigger('click');
			}
		},
		'error': (err) => {
			pnd.fyiError('Αδυναμία λήψης στοιχείων παρουσιολογίου');
			console.error(err);
		},
	});

	return prosopa;
};

prosopa.imerisioProcess = (imerisio) => {
	prosopa.imerisio = new letrak.imerisio(imerisio);

	prosopa.imerisioAreaDOM.
	append(prosopa.imerisio.domGet());

	return prosopa;
};

prosopa.ipografesProcess = (ipografes) => {
	prosopa.ipografesSetup();

	if (!ipografes)
	return prosopa;

	pnd.arrayWalk(ipografes, (v) => {
		v = new letrak.ipografi(v);
		prosopa.ipografesDOM.
		append(v.domGet());
	});

	prosopa.ipografiRefresh();
	return prosopa;
};

prosopa.prosopaProcess = (parousia) => {
	pnd.
	arrayWalk(parousia, (v, k) => {
		v = new letrak.parousia(v);
		prosopa.browserDOM.
		append(v.domGet());
	});

	prosopa.
	browserFix();

	return prosopa;
};

///////////////////////////////////////////////////////////////////////////////@

prosopa.ipografesSetup = () => {
	prosopa.imerisioAreaDOM.
	append(prosopa.ipografesAreaDOM = $('<div>').
	addClass('ipografesArea').
	addClass('ipografesAreaHidden').

	append(prosopa.ipografesPanelDOM = $('<div>').
	addClass('ipografesPanel').

	append($('<input>').
	attr({
		'type': 'button',
		'title': prosopa.minima.ipografiAnaneosiTabTitle,
	}).
	addClass('letrak-formaPliktro').
	val(prosopa.minima.ipografiAnaneosiTabLabel).
	on('click', (e) => prosopa.ipografiAnaneosi(e))).

	append(prosopa.ipografiEpikirosiTabDOM = $('<input>').
	attr({
		'type': 'button',
		'title': prosopa.minima.ipografiEpikirosiTabTitle,
	}).
	addClass('letrak-formaPliktro').
	addClass('praxiPliktro').
	val(prosopa.minima.ipografiEpikirosiTabLabel).
	on('click', (e) => prosopa.ipografiPraxi(e, 'epikirosi'))).

	append(prosopa.ipografiAkirosiTabDOM = $('<input>').
	attr({
		'type': 'button',
		'title': prosopa.minima.ipografiAkirosiTabTitle,
	}).
	addClass('letrak-formaPliktro').
	addClass('praxiPliktro').
	val(prosopa.minima.ipografiAkirosiTabLabel).
	on('click', (e) => prosopa.ipografiPraxi(e, 'akirosi'))).

	append($('<input>').
	attr({
		'type': 'button',
		'title': prosopa.minima.ipografiInsertTabTitle,
	}).
	addClass('letrak-formaPliktro').
	addClass('ipografiUpdatePliktro').
	val(prosopa.minima.ipografiInsertTabLabel).
	on('click', (e) => prosopa.ipografiInsert(e))).

	append(prosopa.ipografiDiagrafiTabDOM = $('<input>').
	attr({
		'type': 'button',
		'title': prosopa.minima.ipografiDeleteTabTitle,
	}).
	addClass('letrak-formaPliktro').
	addClass('ipografiUpdatePliktro').
	addClass('ipografiPliktroNoCandi').
	val(prosopa.minima.ipografiDeleteTabLabel).
	on('click', (e) => prosopa.ipografiDiagrafi(e))).

	append(prosopa.ipografiEditTabDOM = $('<input>').
	attr({
		'type': 'button',
		'title': prosopa.minima.ipografiEditTabTitle,
	}).
	addClass('letrak-formaPliktro').
	addClass('ipografiUpdatePliktro').
	addClass('ipografiPliktroNoCandi').
	val(prosopa.minima.ipografiEditTabLabel).
	on('click', (e) => prosopa.ipografiEdit(e)))).

	append(prosopa.ipografesDOM = $('<div>').
	addClass('ipografes').
	on('click', '.ipografi', function(e) {
		prosopa.ipografiCandiToggle(e, $(this));
	})));

	pnd.toolbarLeftDOM.
	append(prosopa.ipografesTabDOM = letrak.tabDOM().
	text(prosopa.minima.ipografesTabLabel).
	on('click', function(e) {
		e.stopPropagation();

		if ($(this).hasClass('ipografiTabHide')) {
			$(this).removeClass('ipografiTabHide');
			prosopa.ipografesAreaDOM.addClass('ipografesAreaHidden');
			prosopa.browserDOM.removeClass('browserEmfanesOrio');
		}

		else {
			$(this).addClass('ipografiTabHide');
			prosopa.ipografesAreaDOM.removeClass('ipografesAreaHidden');
			prosopa.browserDOM.addClass('browserEmfanesOrio');
		}
	}));
};

///////////////////////////////////////////////////////////////////////////////@

prosopa.ipografiRefresh = () => {
	return prosopa.
	imerisioKatastasiRefresh().
	ipografiUpdateTabsRefresh().
	ipografiPraxiTabsRefresh();
};

prosopa.imerisioKatastasiRefresh = () => {
	let katastasi = prosopa.imerisioKatastasiGet();

	prosopa.imerisioKatastasiDOM.
	removeClass('imerisioKatastasiNeo').
	removeClass('imerisioKatastasiEkremes').
	removeClass('imerisioKatastasiReady').
	removeClass('imerisioKatastasiClosed').
	empty();

	if (!katastasi)
	return prosopa;

	prosopa.imerisioKatastasiDOM.
	addClass('imerisioKatastasi' + katastasi).
	html(prosopa.minima['imerisioKatastasi' + katastasi + 'Symbol']);

	return prosopa;
};

prosopa.imerisioKatastasiGet = () => {
	if (prosopa.imerisio.closedGet())
	return 'Closed';

	let proto = false;
	let count = 0;
	let check = 0;

	prosopa.ipografesDOM.
	children('.ipografi').
	each(function() {
		count++;
		let ipografi = $(this).data('ipografi')

		if (!ipografi.checkokGet())
		return;

		check++;

		if (count === 1)
		proto = true;
	});

	if (!count)
	return 'Neo';

	if (check === count)
	return 'Ready';

	if (proto)
	return 'Ekremes';

	return 'Neo';
};

prosopa.ipografiUpdateTabsRefresh = () => {
	let prosvasi = false;

	if (!prosopa.imerisio.closedGet()) {
		let ipiresia = prosopa.imerisio.ipiresiaGet();
		prosvasi = letrak.prosvasiIsUpdate(ipiresia);
	}

	prosopa.ipografesPanelDOM.
	children('.ipografiUpdatePliktro').
	css('display', prosvasi ? '' : 'none');

	return prosopa;
};

prosopa.ipografiPraxiTabsRefresh = () => {
	prosopa.ipografesPanelDOM.
	children('.praxiPliktro').
	css('display', 'none');

	if (prosopa.imerisio.closedGet())
	return prosopa;

	let xristis = letrak.xristisIpalilosGet();
	let alosprin = false;
	let epikirosi = false;
	let akirosi = false;

	prosopa.ipografesDOM.
	children('.ipografi').
	each(function() {
		let ipografi = $(this).data('ipografi');
		let armodios = ipografi.armodiosGet();
		let checkok = ipografi.checkokGet();

		if (armodios !== xristis) {
			if (!checkok)
			alosprin = true;
			return;
		}

		if (checkok) {
			akirosi = true;
			return;
		}

		if (!alosprin)
		epikirosi = true;
	});

	if (epikirosi)
	prosopa.ipografiEpikirosiTabDOM.
	css('display', '');

	if (akirosi)
	prosopa.ipografiAkirosiTabDOM.
	css('display', '');

	return prosopa;
};

///////////////////////////////////////////////////////////////////////////////@

prosopa.ipografiIpografon = () => {
	let ipografi;

	prosopa.ipografesDOM.
	children('.ipografi').
	each(function() {
		let x = $(this).data('ipografi');

		if (!x.checkokGet())
		return;

		ipografi = x;
		return false;
	});

	return ipografi;
};

prosopa.ipografiProtos = () => {
	let dom = prosopa.ipografesDOM.
	children('.ipografi').
	first();

	if (!dom.length)
	return undefined;

	return new letrak.ipografi().
	armodiosSet(dom.children('.ipografArmodios').text()).
	titlosSet(dom.children('.ipografTitlos').text()).
	checkokSet(dom.children('.ipografCheckok').text());
};

prosopa.xristisIsIpografon = () => {
	if (letrak.noXristis())
	return false;

	let xristis = letrak.xristisIpalilosGet();
	let ipografi;

	prosopa.ipografesDOM.
	children('.ipografi').
	each(function() {
		let x = $(this).data('ipografi');

		if (x.armodiosGet() !== xristis)
		return;

		ipografi = x;
		return false;
	});

	return ipografi;
};

prosopa.xristisNotIpografon = () => {
	return !prosopa.xristisIsIpografon();
};

prosopa.ipografiCandiToggle = function(e, ipografiDOM) {
	if (e)
	e.stopPropagation();

	let candi = ipografiDOM.hasClass('ipografiCandi');

	// Είναι μια καλή ευκαιρία να καθαρίσουμε το πεδίο από τυχόν
	// άλλες υποψήφιες υπογραφές.

	prosopa.ipografesDOM.
	children('.ipografiCandi').
	removeClass('ipografiCandi');
	prosopa.ipografiCandiTabsHide();

	if (candi)
	return prosopa;

	ipografiDOM.addClass('ipografiCandi');
	prosopa.ipografiCandiTabsShow();

	return prosopa;
};

prosopa.ipografiCandiTabsHide = () => {
	prosopa.ipografiDiagrafiTabDOM.
	addClass('ipografiPliktroNoCandi');

	prosopa.ipografiEditTabDOM.
	addClass('ipografiPliktroNoCandi');

	return prosopa;
};

prosopa.ipografiCandiTabsShow = () => {
	prosopa.ipografiDiagrafiTabDOM.
	removeClass('ipografiPliktroNoCandi');

	prosopa.ipografiEditTabDOM.
	removeClass('ipografiPliktroNoCandi');

	return prosopa;
};

///////////////////////////////////////////////////////////////////////////////@

prosopa.ipografiInsert = (e) => {
	if (e)
	e.stopPropagation();

	prosopa.ipografesDOM.
	children('.ipografiCandi').
	removeClass('ipografiCandi');
	prosopa.ipografiCandiTabsHide();

	let forma = {};
	forma.dialogDOM = $('<div>').

	attr('title', 'Προσθήκη υπογράφοντος').
		append($('<form>').
		attr('id', 'ipografiForma').

			append($('<div>').
			addClass('letrak-inputLine').
				append($('<label>').
				attr('for', 'ipografiFormaArmodios').
				text('Αρμόδιος')).
				append(forma.armodiosDOM = $('<input>').
				attr('id', 'ipografiFormaArmodios'))).

			append($('<div>').
			addClass('letrak-inputLine').
				append($('<label>').
				attr('for', 'ipografiFormaTitlos').
				text('Τίτλος')).
				append(forma.titlosDOM = $('<input>').
				attr('id', 'ipografiFormaTitlos'))).

			append($('<div>').
			addClass('letrak-inputLine').
				append($('<label>').
				attr('for', 'ipografiFormaTaxinomisi').
				text('Α/Α')).
				append(forma.taxinomisiDOM = $('<input>').
				attr('id', 'ipografiFormaTaxinomisi')))).

	dialog({
		'resizable': false,
		'height': 'auto',
		'width': 'auto',
		'modal': true,
		'position': {
			'my': 'left+290 top+40',
			'at': 'left top',
		},
		'buttons': {
			'Προσθήκη': () => prosopa.ipografiInsertExec(forma),
			'Άκυρο': () => forma.dialogDOM.dialog('close'),
		},
		'close': () => forma.dialogDOM.remove(),
	});

	forma.dialogDOM.
	find('.letrak-inputLine').
	children('input').
	on('keypress', (e) => {
		e.stopPropagation();

		if (e.which !== 13)
		return;

		prosopa.ipografiInsertExec(forma);
	});

	return prosopa;
};

prosopa.ipografiInsertExec = function(forma) {
	pnd.fyiMessage('Προσθήκη υπογραφής…');

	$.post({
		'url': 'ipografiInsert.php',
		'dataType': 'json',
		'data': {
			'imerisio': prosopa.imerisio.kodikosGet(),
			'taxinomisi': forma.taxinomisiDOM.val(),
			'armodios': forma.armodiosDOM.val(),
			'titlos': forma.titlosDOM.val(),
		},
		'success': (rsp) => prosopa.ipografiInsertPost(rsp, forma),
		'error': (err) => {
			pnd.fyiError('Αδυναμία προσθήκης υπογραφής');
			console.error(err);
		},
	});

	return prosopa;
};

prosopa.ipografiInsertPost = (rsp, forma) => {
	if (prosopa.ipografesRefreshErrorCheck(rsp))
	return prosopa;

	// Δεν κλείνουμε τη φόρμα διαλόγου ώστε να μπορεί ο χρήστης να
	// περνά τη μια υπογραφή μετά την άλλη· απλώς καθαρίζουμε τα
	// πεδία τής φόρμας.

	forma.dialogDOM.
	find('.letrak-inputLine').
	children('input').
	val('');

	forma.armodiosDOM.focus();
	return prosopa;
};

///////////////////////////////////////////////////////////////////////////////@

prosopa.ipografiEdit = (e) => {
	if (e)
	e.stopPropagation();

	let dom = prosopa.ipografesDOM.
	children('.ipografiCandi');

	if (dom.length !== 1)
	return prosopa.fyiError('Απροσδιόριστη υπογραφή προς επεξεργασία');

	let ipografi = dom.data('ipografi');

	let forma = {
		'isimonixat': ipografi.taxinomisiGet(),
	};
	forma.dialogDOM = $('<div>').

	attr('title', 'Επεξεργασία υπογραφής…').
		append($('<form>').
		attr('id', 'ipografiForma').

			append($('<div>').
			addClass('letrak-inputLine').
				append($('<label>').
				attr('for', 'ipografiFormaTaxinomisi').
				text('Α/Α')).
				append(forma.taxinomisiDOM = $('<input>').
				attr('id', 'ipografiFormaTaxinomisi').
				val(ipografi.taxinomisiGet()))).

			append($('<div>').
			addClass('letrak-inputLine').
				append($('<label>').
				attr('for', 'ipografiFormaArmodios').
				text('Αρμόδιος')).
				append(forma.armodiosDOM = $('<input>').
				attr('id', 'ipografiFormaArmodios').
				val(ipografi.armodiosGet()))).

			append($('<div>').
			addClass('letrak-inputLine').
				append($('<label>').
				attr('for', 'ipografiFormaTitlos').
				text('Τίτλος')).
				append(forma.titlosDOM = $('<input>').
				attr('id', 'ipografiFormaTitlos').
				val(ipografi.titlosGet())))).

	dialog({
		'resizable': false,
		'height': 'auto',
		'width': 'auto',
		'modal': true,
		'position': {
			'my': 'left+290 top+60',
			'at': 'left top',
		},
		'buttons': {
			'Υποβολή': () => prosopa.ipografiEditExec(forma),
			'Άκυρο': () => forma.dialogDOM.dialog('close'),
		},
		'close': () => forma.dialogDOM.remove(),
	});

	forma.dialogDOM.
	find('.letrak-inputLine').
	children('input').
	on('keypress', (e) => {
		e.stopPropagation();

		if (e.which !== 13)
		return;

		prosopa.ipografiEditExec(forma);
	});

	return prosopa;
};

prosopa.ipografiEditExec = function(forma) {
	pnd.fyiMessage('Ενημέρωση υπογραφής…');

	$.post({
		'url': 'ipografiEdit.php',
		'dataType': 'json',
		'data': {
			'imerisio': prosopa.imerisio.kodikosGet(),
			'isimonixat': forma.isimonixat,
			'taxinomisi': forma.taxinomisiDOM.val(),
			'armodios': forma.armodiosDOM.val(),
			'titlos': forma.titlosDOM.val(),
		},
		'success': (rsp) => prosopa.ipografiEditPost(rsp, forma),
		'error': (err) => {
			pnd.fyiError('Αδυναμία ενημέρωσης υπογραφής');
			console.error(err);
		},
	});

	return prosopa;
};

prosopa.ipografiEditPost = (rsp, forma) => {
	if (rsp.error)
	return pnd.fyiError(rsp.error);

	prosopa.
	fyiClear().
	ipografiCandiTabsHide().
	ipografesDOM.
	children('.ipografi').
	removeClass('ipografiCandi');

	prosopa.
	ipografesDOM.
	empty();

	let found = false;
	let armodios = parseInt(forma.armodiosDOM.val());

	pnd.arrayWalk(rsp.ipografes, (v) => {
		v = new letrak.ipografi(v);
		let tax = v.taxinomisiGet();
		let dom = v.domGet();

		prosopa.ipografesDOM.
		append(dom);

		if (found)
		return;

		if (v.armodiosGet() !== armodios)
		return;

		found = true;
		dom.addClass('ipografiCandi');
	});

	if (found)
	prosopa.ipografiCandiTabsShow();

	prosopa.ipografiRefresh();
	forma.dialogDOM.dialog('close');

	return prosopa;
};

///////////////////////////////////////////////////////////////////////////////@

prosopa.ipografiDiagrafi = (e) => {
	if (e)
	e.stopPropagation();

	let dom = prosopa.ipografesDOM.
	children('.ipografiCandi');

	if (dom.length !== 1)
	return prosopa.fyiError('Απροσδιόριστη υπογραφή προς διαγραφή');

	let taxinomisi = dom.data('ipografi').taxinomisiGet();

	pnd.fyiMessage('Διαγραφή υπογραφής…');
	$.post({
		'url': 'ipografiDelete.php',
		'dataType': 'json',
		'data': {
			'imerisio': prosopa.imerisio.kodikosGet(),
			'taxinomisi': taxinomisi,
		},
		'success': (rsp) => prosopa.ipografesRefreshErrorCheck(rsp),
		'error': (err) => {
			prosopa.fyiError('Αδυναμία διαγραφής υπογραφής');
			console.error(err);
		},
	});

	return prosopa;
};

///////////////////////////////////////////////////////////////////////////////@

prosopa.ipografiAnaneosi = (e) => {
	if (e)
	e.stopPropagation();

	pnd.fyiMessage('Ανανέωση εικόνας υπογραφών');
	$.post({
		'url': 'ipografiAnaneosi.php',
		'dataType': 'json',
		'data': {
			'imerisio': prosopa.imerisio.kodikosGet(),
		},
		'success': (rsp) => prosopa.ipografesRefreshErrorCheck(rsp),
		'error': (err) => {
			prosopa.fyiError
				('Αδυναμία ανανέωσης εικόνας υπογραφών');
			console.error(err);
		},
	});

	return prosopa;
};

///////////////////////////////////////////////////////////////////////////////@

prosopa.ipografiPraxi = (e, praxi) => {
	if (e)
	e.stopPropagation();

	let ipografi = prosopa.xristisIsIpografon();

	if (!ipografi)
	return prosopa.fyiError('Δεν έχετε δικαίωμα υπογραφής!');

	let minima;
	let errmsg;

	if (praxi === 'akirosi') {
		minima = 'Αναίρεση υπογραφής…';
		errmsg = 'Αδυναμία αναίρεσης υπογραφής';
	}

	else {
		minima = 'Επικύρωση στοιχείων…';
		errmsg = 'Αδυναμία επικύρωσης στοιχείων';
	}

	pnd.fyiMessage(minima);
	$.post({
		'url': 'ipografiPraxi.php',
		'dataType': 'json',
		'data': {
			'imerisio': prosopa.imerisio.kodikosGet(),
			'armodios': ipografi.armodiosGet(),
			'praxi': praxi,
		},
		'success': (rsp) => prosopa.ipografesRefreshErrorCheck(rsp),
		'error': (err) => {
			prosopa.fyiError(errmsg);
			console.error(err);
		},
	});

	return prosopa;
};

///////////////////////////////////////////////////////////////////////////////@

letrak.imerisio.prototype.domGet = function() {
	let ipiresia = this.ipiresiaGet();
	let ipiresiaDOM;
	let prosapo = this.prosapoGet();

	let imerominia = this.imerominiaGet().toLocaleDateString('el-GR', {
		'weekday': 'long',
		'year': 'numeric',
		'month': 'long',
		'day': 'numeric',
	});

	let dom = $('<div>').
	addClass('imerisio').

	append(prosopa.imerisioKatastasiDOM = $('<div>').
	addClass('imerisioKatastasi')).

	append($('<div>').
	addClass('imerisioKodikos').
	text(this.kodikosGet())).

	append($('<div>').
	addClass('imerisioPerigrafi').
	text(this.perigrafiGet())).

	append(ipiresiaDOM = $('<div>').
	addClass('imerisioIpiresia').
	text(ipiresia)).

	append($('<div>').
	addClass('imerisioProsapo').
	addClass('imerisioProsapo' +
	(prosapo === 'ΠΡΟΣΕΛΕΥΣΗ' ? 'Proselefsi' : 'Apoxorisi')).
	text(prosapo)).

	append($('<div>').
	addClass('imerisioImerominia').
	text(imerominia));

	if (letrak.prosvasiIsUpdate(ipiresia))
	ipiresiaDOM.addClass('imerisioIpiresiaUpdate');

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

letrak.ipografi.prototype.domGet = function() {
	let checkok = this.checkokGet();

	if (checkok)
	checkok = pnd.date(checkok, '%D-%M-%Y %h:%s');

	let dom = $('<div>').
	addClass('ipografi').
	data('ipografi', this).

	append($('<div>').
	addClass('ipografiTaxinomisi').
	text(this.taxinomisiGet())).

	append($('<div>').
	addClass('ipografiArmodios').
	text(this.armodiosGet())).

	append($('<div>').
	addClass('ipografiOnomateponimo').
	text(this.onomateponimoGet())).

	append($('<div>').
	addClass('ipografiTitlos').
	text(this.titlosGet())).

	append($('<div>').
	addClass('ipografiCheckok').
	html(checkok ? prosopa.minima.ipografiCheckSymbol : ''));

	return dom;
};

///////////////////////////////////////////////////////////////////////////////@

prosopa.ipografesRefreshErrorCheck = (rsp) => {
	if (rsp.error) {
		pnd.fyiError(rsp.error);
		return true;
	};

	if (rsp.hasOwnProperty('closed'))
	prosopa.imerisio.closed = rsp.closed;

	prosopa.
	fyiClear().
	ipografiCandiTabsHide().
	ipografesDOM.
	empty();

	pnd.arrayWalk(rsp.ipografes, (v) => {
		v = new letrak.ipografi(v);
		prosopa.ipografesDOM.
		append(v.domGet());
	});

	prosopa.ipografiRefresh();
	return false;
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

prosopa.fyiMessage = (s) => {
	pnd.fyiMessage(s);
	return prosopa;
};

prosopa.fyiError = (s) => {
	pnd.fyiError(s);
	return prosopa;
};

prosopa.fyiClear = (s) => {
	pnd.fyiClear();
	return prosopa;
};
