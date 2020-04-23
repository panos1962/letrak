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
// www/imerisio/main.js —— Πρόγραμμα οδήγησης σελίδας ελέγχου και διαχείρισης
// παρουσιολογίων.
// @FILE END
//
// @DESCRIPTION BEGIN
// Πρόκειται για το πρόγραμμα οδήγησης της βασικής σελίδας της εφαρμογής
// ελέγχου και διαχείρισης παρουσιολογίων "letrak". Ο χρήστης καταχωρεί
// κριτήρια επιλογής με βάση την ημερομηνία και την υπηρεσία και μετά την
// εμφάνιση των παρουσιολογίων που πληρούν τα κριτήρια επιλογής, μπορεί
// είτε να διαχειριστεί τα επιλεγμένα παρουσιολόγια, είτε να δημιουργήσει
// νέα παρουσιολόγια (συνήθως ως αντίγραφα ήδη υφισταμένων πρόσφατων
// σχετικών παρουσιολογίων).
// @DESCRIPTION END
//
// @HISTORY BEGIN
// Updated: 2020-04-20
// Updated: 2020-04-19
// Updated: 2020-04-18
// Updated: 2020-04-17
// Created: 2020-04-09
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
const imerisio = {};

imerisio.minima = {
	'filtraTabLabel': 'Φίλτρα',
	'filtraHideTitle': 'Απόκρυψη φίλτρων',
	'filtraShowTitle': 'Εμφάνιση φίλτρων',
	'filtraImerominiaLabel': 'Ημερομηνία',
	'filtraIpiresiaLabel': 'Υπηρεσία',
	'erpotaFetchError': 'Αποτυχία λήψης δεδομένων προσωπικού',
};

pnd.domInit(() => {
	pnd.
	toolbarSetup().
	fyiSetup().
	ofelimoSetup().
	ribbonSetup().
	domSetup().
	domFixup();

	imerisio.
	selidaSetup();
});

imerisio.selidaSetup = () => {
	letrak.
	toolbarTitlosSetup().
	toolbarXristisSetup().
	ribbonCopyrightSetup();

	if (letrak.noXristis())
	return letrak.arxikiSelida(imerisio);

	pnd.
	keepAlive();

	letrak.
	toolbarArxikiSetup();

	imerisio.
	browserSetup().
	filtraSetup().
	autoFind().
	erpotaFetch().
	candiTabsSetup();

	return imerisio;
};

///////////////////////////////////////////////////////////////////////////////@

imerisio.filtraSetup = () => {
	pnd.toolbarLeftDOM.
	append(imerisio.filtraTabDOM = letrak.tabDOM().
	attr('title', imerisio.minima.filtraShowTitle).
	data('status', 'hidden').
	append(imerisio.minima.filtraTabLabel).
	on('click', (e) => imerisio.filtraToggle(e)));

	pnd.bodyDOM.
	append(imerisio.filtraDOM = $('<div>').
	append($('<form>').
	attr('id', 'filtraForma').

	append($('<div>').
	addClass('letrak-inputLine').
	append(imerisio.filtraIpiresiaDOM = $('<label>').
	attr('for', 'ipiresiaFiltro').
	text(imerisio.minima.filtraIpiresiaLabel)).
	append(imerisio.filtraIpiresiaDOM = $('<input>').
	attr('id', 'ipiresiaFiltro').
	addClass('filtraInput'))).

	append($('<div>').
	addClass('letrak-inputLine').
	append($('<label>').
	attr('for', 'imerominiaFiltro').
	text(imerisio.minima.filtraImerominiaLabel)).
	append(imerisio.filtraImerominiaDOM = $('<input>').
	attr('id', 'imerominiaFiltro').
	addClass('filtraInput').
	datepicker())).

	append($('<div>').
	addClass('letrak-formaPanel').

	append($('<input>').
	addClass('letrak-formaPliktro').
	attr({
		'type': 'submit',
		'value': letrak.minima.ipovoliPliktroLabel,
	}).
	on('click', (e) => imerisio.filtraFormaIpovoli(e))).

	append($('<input>').
	addClass('letrak-formaPliktro').
	attr({
		'type': 'button',
		'value': letrak.minima.clearPliktroLabel,
	}).
	on('click', (e) => imerisio.filtraFormaClear(e))).

	append($('<input>').
	addClass('letrak-formaPliktro').
	attr({
		'type': 'button',
		'value': letrak.minima.cancelPliktroLabel,
	}).
	on('click', (e) => imerisio.filtraFormaCancel(e))))));

	imerisio.filtraDOM.dialog({
		'title': 'Κριτήρια επιλογής',
		'autoOpen': false,

		'width': 'auto',
		'height': 'auto',
		'position': {
			'my': 'left+100 top+100',
			'at': 'left top',
		},

		'open': () => imerisio.filtraEnable(),
		'show': {
			'effect': 'drop',
			'direction': 'up',
			'duration': 100,
		},

		'close': () => imerisio.filtraDisable(),
		'hide': {
			'effect': 'drop',
			'direction': 'up',
			'duration': 100,
		},
	});

	imerisio.filtraIpiresiaDOM.val(letrak.xristisIpiresiaGet());
	imerisio.filtraImerominiaDOM.val(pnd.dateTime(undefined, '%D-%M-%Y'));
	return imerisio;
};

imerisio.filtraToggle = function(e) {
	if (e)
	e.stopPropagation();

	if (imerisio.filtraDisabled())
	imerisio.filtraDOM.dialog('open');

	else
	imerisio.filtraDOM.dialog('close');

	return imerisio;
};

imerisio.filtraEnable = function() {
	imerisio.filtraTabDOM.
	data('status', 'visible').
	addClass('filtraTabEnabled').
	attr('title', imerisio.minima.filtraHideTitle);

	return imerisio;
};

imerisio.filtraDisable = function(act) {
	imerisio.filtraTabDOM.
	data('status', 'hidden').
	removeClass('filtraTabEnabled').
	attr('title', imerisio.minima.filtraShowTitle);

	return imerisio;
};

imerisio.filtraEnabled = function() {
	return (imerisio.filtraTabDOM.data('status') === 'visible');
};

imerisio.filtraDisabled = function() {
	return !imerisio.filtraEnabled();
};

// XXX
imerisio.filtraFormaIpovoli = (e) => {
	e.stopPropagation();
	return false;
};

imerisio.filtraFormaClear = (e) => {
	e.stopPropagation();
	imerisio.filtraIpiresiaDOM.val('').focus();
	imerisio.filtraImerominiaDOM.val('');

	return imerisio;
};

imerisio.filtraFormaCancel = (e) => {
	e.stopPropagation();
	imerisio.filtraDOM.dialog('close');

	return imerisio;
};

///////////////////////////////////////////////////////////////////////////////@

imerisio.browserSetup = () => {
	pnd.ofelimoDOM.
	empty().
	append(imerisio.browserDOM = $('<div>').
	attr('id', 'browser').
	on('mouseenter', '.imerisio', function(e) {
		e.stopPropagation();

		if ($(this).data('candi'))
		return;

		$(this).
		addClass('imerisioCandi');
	}).
	on('mouseleave', '.imerisio', function(e) {
		e.stopPropagation();

		if ($(this).data('candi'))
		return;

		$(this).
		removeClass('imerisioCandi');
	}).
	on('click', '.imerisio', function(e) {
		e.stopPropagation();

		let wasCandi = $(this).data('candi');

		$('.imerisioCandi').
		removeData('candi').
		removeClass('imerisioCandi');

		if (wasCandi)
		return imerisio.candiTabsHide();

		$(this).
		data('candi', true).
		addClass('imerisioCandi');
		imerisio.candiTabsShow();
	}));

	return imerisio;
};

///////////////////////////////////////////////////////////////////////////////@

imerisio.candiTabsSetup = () => {
	pnd.toolbarLeftDOM.

	append(letrak.tabDOM().
	addClass('candiTab').
	text('Κλωνισμός').
	on('click', (e) => imerisio.klonismos(e))).

	append(letrak.tabDOM().
	addClass('candiTab').
	text('Διαγραφή').
	on('click', (e) => imerisio.diagrafiConfirm(e)));

	return imerisio;
};

imerisio.candiTabsShow = () => {
	pnd.toolbarDOM.
	find('.candiTab').
	addClass('candiTabVisible');

	return imerisio;
};

imerisio.candiTabsHide = () => {
	pnd.toolbarDOM.
	find('.candiTab').
	removeClass('candiTabVisible');

	return imerisio;
};

imerisio.clearCandi = () => {
	$('.imerisio').
	removeData('candi').
	removeClass('imerisioCandi');

	return imerisio;
};

///////////////////////////////////////////////////////////////////////////////@

imerisio.klonismos = (e) => {
	e.stopPropagation();

	let x = $('.imerisioCandi').
	first().
	data('data');

	if (!x)
	return imerisio.fyiError('Ακαθόριστο πρότυπο παρουσιολόγιο');

	try {
		var kodikos = x.kodikosGet();
	}

	catch (e) {
		return imerisio.fyiError('Απροσδιόριστο πρότυπο παρουσιολόγιο');
	}

	pnd.fyiMessage('Κλωνισμός παρουσιολογίου <b>' + kodikos +
		'</b> σε εξέλιξη…');
	$.post({
		'url': 'klonismos.php',
		'data': {
			"kodikos": kodikos,
		},
		'dataType': 'json',
		'success': (rsp) => imerisio.klonosProcess(rsp, kodikos),
		'error': (e) => {
			pnd.fyiError('Σφάλμα κλωνισμού');
			console.error(e);
		},
	});

	return imerisio;
};

imerisio.klonosProcess = (x, protipo) => {
	if (x.error) {
		pnd.fyiError(x.error);
		console.error(x.error);
		return imerisio;
	}

	if (!x.hasOwnProperty('imerisio')) {
		pnd.fyiError('Δεν επστράφησαν στοιχεία αντιγράφου');
		console.error(x);
		return imerisio;
	}

	pnd.fyiMessage('Δημιουργήθηκε παρουσιολόγιο <b>' +
	x.imerisio.k + '</b> ως αντίγραφο του παρουσιολογίου <b>' +
	protipo + '</b>');

	imerisio.clearCandi();

	imerisio.browserDOM.
	prepend((new letrak.imerisio(x.imerisio)).
	domGet().
	data('candi', true).
	addClass('imerisioCandi'));

	pnd.zebraFix(imerisio.browserDOM);
	imerisio.candiTabsShow();
	pnd.ofelimoDOM.scrollTop(0);

	return imerisio;
};

///////////////////////////////////////////////////////////////////////////////@

imerisio.diagrafiConfirm = (e) => {
	e.stopPropagation();

	let dom = $('.imerisioCandi').first();

	if (!dom.length)
	return imerisio.fyiError('Ακαθόριστο παρουσιολόγιο προς διαγραφή');

	try {
		var kodikos = dom.data('data').kodikosGet();
	}

	catch (e) {
		pnd.fyiError('Απροσδιόριστο παρουσιολόγιο προς διαγραφή');
		console.error(e);
	}

	let dialogDOM = $('<div>').
	attr('title', 'Διαγραφή παρουσιολογίου').
	append($('<div>').
	html('Να διαγραφεί το παρουσιολόγιο <b>' + kodikos + '</b>;')).
	dialog({
		'resizable': false,
		'height': 'auto',
		'width': '350px',
		'modal': true,
		'position': {
			'my': 'left+50 top+50',
			'at': 'left top',
		},

		'buttons': {
			'Διαγραφή': function() {
				imerisio.diagrafi(kodikos, dom);
				$(this).dialog('close');
			},
			'Άκυρο': function() {
				$(this).dialog('close');
			},
		},
		'close': function() {
			dialogDOM.remove();
		},
	});

	return imerisio;
};

imerisio.diagrafi = (kodikos, dom) => {
	pnd.fyiMessage('Διαγραφή παρουσιολογίου <b>' + kodikos +
		'</b> σε εξέλιξη…');
	$.post({
		'url': 'diagrafi.php',
		'data': {
			"kodikos": kodikos,
		},
		'success': (rsp) => imerisio.diagrafiProcess(rsp, kodikos, dom),
		'error': (e) => {
			pnd.fyiError('Σφάλμα διαγραφής');
			console.error(e);
		},
	});

	return imerisio;
};

imerisio.diagrafiProcess = (msg, kodikos, dom) => {
	if (msg) {
		pnd.fyiError(msg);
		console.error(msg);
		return imerisio;
	}

	dom.remove();
	pnd.zebraFix(imerisio.browserDOM);
	imerisio.clearCandi().candiTabsHide();

	pnd.fyiMessage('Το παρουσιολόγιο <b>' + kodikos +
	'</b> διεγράφη επιτυχώς');

	return imerisio;
};

///////////////////////////////////////////////////////////////////////////////@

imerisio.erpotaFetch = () => {
	pnd.fyiMessage('Λήψη δεδομένων προσωπικού…');
	$.post({
		'url': 'erpotaFetch.php',
		'dataType': 'json',
		'success': (rsp) => imerisio.erpotaProcess(rsp),
		'error': (e) => {
			pnd.fyiError(imerisio.minima.erpotaFetchError);
			console.error(e);
		},
	});

	return imerisio;
};

imerisio.erpotaProcess = (rsp) => {
	if (!rsp.hasOwnProperty('error'))
	return imerisio.fyiError('Ημιτελής λήψη στοιχείων προσωπικού');

	if (rsp.error)
	return imerisio.fyiError(rsp.error);

	pnd.fyiClear();
	imerisio.ipiresiaList = rsp.ipiresia;
	imerisio.ipalilosList = rsp.ipalilos;

	return imerisio;
};

///////////////////////////////////////////////////////////////////////////////@

imerisio.autoFind = () => {
	let ipiresia = letrak.xristisIpiresiaGet();

	if (!ipiresia)
	return imerisio.filtraToggle();

	pnd.fyiMessage('Επιλογή παρουσιολογίων…');
	$.post({
		'url': 'imerisio.php',
		'data': {
			'ipiresia': ipiresia,
		},
		'dataType': 'json',
		'success': (rsp) => imerisio.imerisioProcess(rsp),
		'error': (e) => {
			pnd.fyiError('Αδυναμία επιλογής παρουσιολογίων');
			console.error(e);
		},
	});

	return imerisio;
};

imerisio.imerisioProcess = (x) => {
	pnd.fyiClear();
	imerisio.browserDOM.empty();

	if (x.error)
	return imerisio.fyiError(x.error);

	pnd.arrayWalk(x.imerisio, function(v) {
		(new letrak.imerisio(v)).
		domGet().
		appendTo(imerisio.browserDOM);
	});

	pnd.zebraFix(imerisio.browserDOM);

	return imerisio;
};

///////////////////////////////////////////////////////////////////////////////@

imerisio.fyiMessage = (s) => {
	pnd.fyiMessage(s);
	return imerisio;
};

imerisio.fyiError = (s) => {
	pnd.fyiError(s);
	return imerisio;
};
