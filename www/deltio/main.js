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
// www/deltio/main.js —— Πρόγραμμα οδήγησης σελίδας ελέγχου και διαχείρισης
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
// Updated: 2020-05-04
// Updated: 2020-05-02
// Updated: 2020-04-29
// Updated: 2020-04-26
// Updated: 2020-04-25
// Updated: 2020-04-24
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
const deltio = {};

// Χρησιμοποιούμε το global singleton "LETRAK" ως μέσο κοινοποίησης constant
// αντικειμένων προκειμένου να είναι αυτά προσπελάσιμα από children windows,
// όπως είναι η σελίδα "prosopa" κλπ.

/*
self.LETRAK.pnd = pnd;
self.LETRAK.letrak = letrak;
*/
self.LETRAK.deltio = deltio;

deltio.minima = {
	'filtraTabLabel': 'Φίλτρα',
	'filtraHideTitle': 'Απόκρυψη φίλτρων',
	'filtraShowTitle': 'Εμφάνιση φίλτρων',
	'filtraIpalilosLabel': 'Υπάλληλος',
	'filtraImerominiaLabel': 'Ημερομηνία',
	'filtraProsapoLabel': 'Είδος',
	'filtraIpiresiaLabel': 'Υπηρεσία',
	'paleoteraTabLabel': 'Παλαιότερα',
	'paleoteraTitle': 'Επιλογή παλαιότερων παρουσιολογίων',
	'diagrafiTabLabel': 'Διαγραφή',
	'diagrafiTitle': 'Διαγραφή επιλεγμένου παρουσιολογίου',
	'klisimoTabLabel': 'Κύρωση',
	'klisimoTitle': 'Κύρωση επιλεγμένου παρουσιολογίου',
	'anigmaTabLabel': 'Άνοιγμα',
	'anigmaTitle': 'Άνοιγμα επιλεγμένου παρουσιολογίου',
	'klonosTabLabel': 'Κλώνος',
	'klonosTitle': 'Κλωνοποίηση επιλεγμένου παρουσιολογίου',
	'epexergasiaTabLabel': 'Επεξεργασία',
	'epexergasiaTitle': 'Επεξεργασία επιλεγμένου παρουσιολογίου',
	'leptomeriesTabLabel': 'Λεπτομέρειες',
	'leptomeriesTitle': 'Λεπτομέρειες επιλεγμένου παρουσιολογίου',
	'erpotaFetchError': 'Αποτυχία λήψης δεδομένων προσωπικού',
	'deltioKatastasiClosedSymbol': '&#x2714;',
};

pnd.domInit(() => {
	pnd.
	toolbarSetup().
	fyiSetup().
	ofelimoSetup().
	ribbonSetup().
	domSetup().
	domFixup();

	deltio.
	selidaSetup();
});

deltio.selidaSetup = () => {
	letrak.
	toolbarTitlosSetup().
	toolbarXristisSetup().
	ribbonCopyrightSetup();

	if (letrak.noXristis())
	return letrak.arxikiSelida(deltio);

	pnd.
	keepAlive('../mnt/pandora');

	letrak.
	toolbarArxikiSetup();

	deltio.
	browserSetup().
	filtraSetup().
	autoFind().
	candiTabsSetup();

	return deltio;
};

///////////////////////////////////////////////////////////////////////////////@

deltio.filtraSetup = () => {
	pnd.toolbarLeftDOM.

	append(deltio.filtraTabDOM = letrak.tabDOM().
	attr('title', deltio.minima.filtraShowTitle).
	data('status', 'hidden').
	append(deltio.minima.filtraTabLabel).
	on('click', (e) => deltio.filtraToggle(e))).

	append(deltio.paleoteraTabDOM = letrak.tabDOM().
	attr('title', deltio.minima.paleoteraTitle).
	append(deltio.minima.paleoteraTabLabel).
	on('click', (e) => deltio.paleotera(e)));

	pnd.bodyDOM.
	append(deltio.filtraDOM = $('<div>').
	append($('<form>').
	attr('id', 'filtraForma').

	append($('<div>').
	addClass('letrak-inputLine').
	append(deltio.filtraIpiresiaDOM = $('<label>').
	attr('for', 'ipiresiaFiltro').
	text(deltio.minima.filtraIpiresiaLabel)).
	append(deltio.filtraIpiresiaDOM = $('<input>').
	attr('id', 'ipiresiaFiltro').
	addClass('filtraInput'))).

	append($('<div>').
	addClass('letrak-inputLine').
	append($('<label>').
	attr('for', 'imerominiaFiltro').
	text(deltio.minima.filtraImerominiaLabel)).
	append(deltio.filtraImerominiaDOM = $('<input>').
	attr('id', 'imerominiaFiltro').
	addClass('filtraInput').
	datepicker())).

	append($('<div>').
	addClass('letrak-inputLine').
	append(deltio.filtraProsapoDOM = $('<label>').
	attr('for', 'prosapoFiltro').
	text(deltio.minima.filtraProsapoLabel)).
	append(deltio.filtraProsapoDOM = $('<select>').
	append($('<option>').val('').text('ΟΛΑ').attr('selected', true)).
	append($('<option>').val('ΠΡΟΣΕΛΕΥΣΗ').text('ΠΡΟΣΕΛΕΥΣΗ')).
	append($('<option>').val('ΑΠΟΧΩΡΗΣΗ').text('ΑΠΟΧΩΡΗΣΗ')).
	attr('id', 'prosapoFiltro').
	addClass('filtraInput'))).

	append($('<div>').
	addClass('letrak-inputLine').
	append(deltio.filtraIpalilosDOM = $('<label>').
	attr('for', 'ipalilosFiltro').
	text(deltio.minima.filtraIpalilosLabel)).
	append(deltio.filtraIpalilosDOM = $('<input>').
	attr('id', 'ipalilosFiltro').
	addClass('filtraInput'))).

	append($('<div>').
	addClass('letrak-formaPanel').

	append($('<input>').
	addClass('letrak-formaPliktro').
	attr({
		'type': 'submit',
		'value': letrak.minima.ipovoliPliktroLabel,
	}).
	on('click', (e) => deltio.filtraFormaIpovoli(e))).

	append($('<input>').
	addClass('letrak-formaPliktro').
	attr({
		'type': 'button',
		'value': letrak.minima.clearPliktroLabel,
	}).
	on('click', (e) => deltio.filtraFormaClear(e))).

	append($('<input>').
	addClass('letrak-formaPliktro').
	attr({
		'type': 'button',
		'value': letrak.minima.cancelPliktroLabel,
	}).
	on('click', (e) => deltio.filtraFormaCancel(e))))));

	deltio.filtraDOM.dialog({
		'title': 'Κριτήρια επιλογής',
		'autoOpen': false,

		'width': 'auto',
		'height': 'auto',
		'position': {
			'my': 'left+100 top+100',
			'at': 'left top',
		},

		'open': () => deltio.filtraEnable(),
		'show': {
			'effect': 'drop',
			'direction': 'up',
			'duration': 100,
		},

		'close': () => deltio.filtraDisable(),
		'hide': {
			'effect': 'drop',
			'direction': 'up',
			'duration': 100,
		},
	});

	let ipiresia = letrak.xristisIpiresiaGet();

	if (ipiresia === undefined)
	deltio.filtraIpalilosDOM.
	attr('disabled', true).
	val(letrak.xristisIpalilosGet());

	else
	deltio.filtraIpiresiaDOM.val(ipiresia);

	deltio.filtraImerominiaDOM.val(pnd.dateTime(undefined, '%D-%M-%Y'));

	return deltio;
};

deltio.filtraToggle = function(e) {
	if (e)
	e.stopPropagation();

	if (deltio.filtraDisabled())
	deltio.filtraDOM.dialog('open');

	else
	deltio.filtraDOM.dialog('close');

	return deltio;
};

deltio.filtraEnable = function() {
	deltio.filtraTabDOM.
	data('status', 'visible').
	addClass('filtraTabEnabled').
	attr('title', deltio.minima.filtraHideTitle);

	return deltio;
};

deltio.filtraDisable = function(act) {
	deltio.filtraTabDOM.
	data('status', 'hidden').
	removeClass('filtraTabEnabled').
	attr('title', deltio.minima.filtraShowTitle);

	return deltio;
};

deltio.filtraEnabled = function() {
	return (deltio.filtraTabDOM.data('status') === 'visible');
};

deltio.filtraDisabled = function() {
	return !deltio.filtraEnabled();
};

// Η function "filtraFormaIpovoli" καλείται με το πάτημα του φερώνυμου
// πλήκτρου στη φόρμα καταχώρησης κριτηρίων επιλογής παρουσιολογίων.

deltio.filtraFormaIpovoli = (e) => {
	e.stopPropagation();

	let data = {
		'ipiresia': deltio.filtraIpiresiaDOM.val(),
		'imerominia': deltio.filtraImerominiaDOM.val(),
		'prosapo': deltio.filtraProsapoDOM.val(),
		'ipalilos': deltio.filtraIpalilosDOM.val(),
	};

	deltio.deltioEpilogi(data, {
		'clean': true,
		'onFound': () => deltio.filtraDOM.dialog('close'),
	});

	return false;
};

deltio.filtraFormaClear = (e) => {
	e.stopPropagation();
	deltio.filtraIpiresiaDOM.val('').focus();
	deltio.filtraImerominiaDOM.val('');

	if (!deltio.filtraIpalilosDOM.attr('disabled'))
	deltio.filtraIpalilosDOM.val('');

	return deltio;
};

deltio.filtraFormaCancel = (e) => {
	e.stopPropagation();
	deltio.filtraDOM.dialog('close');

	return deltio;
};

///////////////////////////////////////////////////////////////////////////////@

deltio.browserSetup = () => {
	pnd.ofelimoDOM.
	empty().
	append(deltio.browserDOM = $('<div>').
	attr('id', 'browser').
	on('mouseenter', '.deltio', function(e) {
		e.stopPropagation();

		if ($(this).data('candi'))
		return;

		$(this).
		addClass('deltioCandiCandi');
	}).
	on('mouseleave', '.deltio', function(e) {
		e.stopPropagation();

		if ($(this).data('candi'))
		return;

		$(this).
		removeClass('deltioCandiCandi');
	}).
	on('click', '.deltio', function(e) {
		e.stopPropagation();

		let wasCandi = $(this).data('candi');

		$('.deltioCandi').
		removeData('candi').
		removeClass('deltioCandi');

		if (wasCandi)
		return deltio.candiTabsHide();

		$(this).
		data('candi', true).
		addClass('deltioCandi').
		removeClass('deltioCandiCandi');
		deltio.candiTabsShow();
	}));

	return deltio;
};

///////////////////////////////////////////////////////////////////////////////@

deltio.candiTabsSetup = () => {
	letrak.arxikiTabDOM.
	addClass('idnacTab');

	deltio.filtraTabDOM.
	addClass('idnacTab');

	deltio.paleoteraTabDOM.
	addClass('idnacTab');

	pnd.toolbarLeftDOM.

	append(deltio.klisimoTabDOM = letrak.tabDOM().
	addClass('candiTab').
	addClass('aniktoTab').
	addClass('updateTab').
	addClass('adminTab').
	attr('title', deltio.minima.klisimoTitle).
	text(deltio.minima.klisimoTabLabel).
	on('click', (e) => deltio.klisimo(e))).

	append(deltio.anigmaTabDOM = letrak.tabDOM().
	addClass('candiTab').
	addClass('klistoTab').
	addClass('updateTab').
	addClass('adminTab').
	attr('title', deltio.minima.anigmaTitle).
	text(deltio.minima.anigmaTabLabel).
	on('click', (e) => deltio.anigma(e))).

	append(deltio.diagrafiTabDOM = letrak.tabDOM().
	addClass('candiTab').
	addClass('aniktoTab').
	addClass('updateTab').
	attr('title', deltio.minima.diagrafiTitle).
	text(deltio.minima.diagrafiTabLabel).
	on('click', (e) => deltio.diagrafiConfirm(e))).

	append(letrak.tabDOM().
	addClass('candiTab').
	addClass('updateTab').
	attr('title', deltio.minima.klonosTitle).
	text(deltio.minima.klonosTabLabel).
	on('click', (e) => deltio.klonismos(e))).

	append(deltio.prosopaTabDOM = letrak.tabDOM().
	addClass('candiTab').
	addClass('klistoTab').
	attr('title', deltio.minima.leptomeriesTitle).
	text(deltio.minima.leptomeriesTabLabel).
	on('click', (e) => deltio.prosopa({
		'clickEvent': e,
	}))).

	append(letrak.tabDOM().
	addClass('candiTab').
	addClass('aniktoTab').
	addClass('updateTab').
	attr('title', deltio.minima.epexergasiaTitle).
	text(deltio.minima.epexergasiaTabLabel).
	on('click', (e) => deltio.prosopa({
		'clickEvent': e,
	})));

	return deltio;
};

deltio.candiTabsShow = () => {
	pnd.toolbarDOM.
	find('.idnacTab').
	addClass('idnacTabHidden');

	pnd.toolbarDOM.
	find('.candiTab').
	removeClass('candiTabVisible');

	// Διασφαλίζουμε το γεγονός ότι υπάρχει πράγματι επιλεγμένο
	// παρουσιολόγιο.

	let x = $('.deltioCandi').first();

	if (!x.length)
	return deltio;

	x = x.data('deltio');

	if (!x)
	return deltio;

	let klisto = x.closedGet();
	let ipiresia = x.ipiresiaGet();
	let update = letrak.prosvasiIsUpdate(ipiresia);

	pnd.toolbarDOM.
	find('.candiTab').
	addClass('candiTabVisible');

	pnd.toolbarDOM.
	find('.' + (klisto ? 'anikto' : 'klisto') + 'Tab').
	removeClass('candiTabVisible');

	if (letrak.prosvasiOxiAdmin(ipiresia))
	pnd.toolbarDOM.
	find('.adminTab').
	removeClass('candiTabVisible');

	if (update)
	return deltio;

	pnd.toolbarDOM.
	find('.updateTab').
	removeClass('candiTabVisible');

	// Ειδικά για τα πλήκτρα λεπτομερειών και επεξεργασίας λαμβάνουμε
	// ειδική μέριμνα, για την περίπτωση «ανοικτού» παρουσιολογίου στο
	// οποίο ο χρήστης δεν έχει πρόσβαση ενημέρωσης.

	deltio.prosopaTabDOM.
	addClass('candiTabVisible');

	return deltio;
};

deltio.candiTabsHide = () => {
	pnd.toolbarDOM.
	find('.candiTab').
	removeClass('candiTabVisible');

	pnd.toolbarDOM.
	find('.idnacTab').
	removeClass('idnacTabHidden');

	return deltio;
};

deltio.clearCandi = () => {
	$('.deltio').
	removeData('candi').
	removeClass('deltioCandi');

	return deltio;
};

///////////////////////////////////////////////////////////////////////////////@

deltio.paleotera = (e) => {
	e.stopPropagation();

	// Αρχικά θέτουμε το κριτήριο ημερομηνίας με βάση την ημερομηνία
	// από την τελευταία παρτίδα που έχουμε ήδη παραλάβει.

	let data = {
		'ipiresia': deltio.filtraIpiresiaDOM.val(),
		'imerominia': deltio.imerominiaLast,
	};

	// Αν δεν έχουμε παραλάβει παρουσιολόγια μέχρι στιγμής, τότε
	// θέτουμε το κριτήριο ημερομηνίας με βάση το σχετικό φίλτρο
	// από τη φόρμα καταχώρησης κριτηρίων επιλογής.

	if (!data.imerominia)
	data.imerominia = deltio.filtraImerominiaDOM.val();

	deltio.deltioEpilogi(data, {
		'onFound': () => {
			deltio.filtraDOM.dialog('close');
			pnd.ofelimoDOM.
			scrollTop(pnd.ofelimoDOM.prop('scrollHeight'));
		},
		'onEmpty': () => pnd.fyiMessage
			('Δεν βρέθηκαν παλαιότερα παρουσιολόγια'),
	});
	return deltio;
};

///////////////////////////////////////////////////////////////////////////////@

deltio.diagrafiConfirm = (e) => {
	e.stopPropagation();

	let dom = $('.deltioCandi').first();

	if (!dom.length)
	return deltio.fyiError('Ακαθόριστο παρουσιολόγιο προς διαγραφή');

	try {
		var kodikos = dom.data('deltio').kodikosGet();
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
				deltio.diagrafi(kodikos, dom);
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

	return deltio;
};

deltio.diagrafi = (kodikos, dom) => {
	pnd.fyiMessage('Διαγραφή παρουσιολογίου <b>' + kodikos +
		'</b> σε εξέλιξη…');
	$.post({
		'url': 'diagrafi.php',
		'data': {
			'kodikos': kodikos,
		},
		'success': (rsp) => deltio.diagrafiProcess(rsp, kodikos, dom),
		'error': (e) => {
			pnd.fyiError('Σφάλμα διαγραφής');
			console.error(e);
		},
	});

	return deltio;
};

deltio.diagrafiProcess = (msg, kodikos, dom) => {
	if (msg) {
		pnd.fyiError(msg);
		console.error(msg);
		return deltio;
	}

	dom.remove();
	pnd.zebraFix(deltio.browserDOM);
	deltio.clearCandi().candiTabsHide();

	pnd.fyiMessage('Το παρουσιολόγιο <b>' + kodikos +
	'</b> διεγράφη επιτυχώς');

	return deltio;
};

///////////////////////////////////////////////////////////////////////////////@

deltio.klisimo = (e) => {
	if (e)
	e.stopPropagation();

	let dom = $('.deltioCandi').first();

	if (!dom)
	return deltio.fyiError('Ακαθόριστο παρουσιολόγιο');

	try {
		var imr = dom.data('deltio');
		var kodikos = imr.kodikosGet();
	}

	catch (e) {
		return deltio.fyiError('Απροσδιόριστο παρουσιολόγιο');
	}

	pnd.fyiMessage('Κλείσιμο παρουσιολογίου <b>' + kodikos + '</b>…');
	$.post({
		'url': 'klisimo.php',
		'data': {
			'kodikos': kodikos,
		},
		'success': (rsp) => deltio.klisimoProcess(rsp, imr, dom),
		'error': (e) => {
			pnd.fyiError('Σφάλμα κλεισίματος παρουσιολογίου');
			console.error(e);
		},
	});

	return deltio;
};

deltio.klisimoProcess = (msg, imr, dom) => {
	if (msg) {
		pnd.fyiError(msg);
		console.error(msg);
		return deltio;
	}


	pnd.fyiClear();
	imr.closedSet(true);
	dom.children('.deltioClosed').
	html(deltio.minima.deltioKatastasiClosedSymbol);
	deltio.candiTabsShow();

	return deltio;
};

///////////////////////////////////////////////////////////////////////////////@

deltio.anigma = (e) => {
	if (e)
	e.stopPropagation();

	let dom = $('.deltioCandi').first();

	if (!dom)
	return deltio.fyiError('Ακαθόριστο παρουσιολόγιο');

	try {
		var imr = dom.data('deltio');
		var kodikos = imr.kodikosGet();
	}

	catch (e) {
		return deltio.fyiError('Απροσδιόριστο παρουσιολόγιο');
	}

	pnd.fyiMessage('Άνοιγμα παρουσιολογίου <b>' + kodikos + '</b>…');
	$.post({
		'url': 'anigma.php',
		'data': {
			'kodikos': kodikos,
		},
		'success': (rsp) => deltio.anigmaProcess(rsp, imr, dom),
		'error': (e) => {
			pnd.fyiError('Σφάλμα ανοίγματος παρουσιολογίου');
			console.error(e);
		},
	});

	return deltio;
};

deltio.anigmaProcess = (msg, imr, dom) => {
	if (msg) {
		pnd.fyiError(msg);
		console.error(msg);
		return deltio;
	}

	pnd.fyiClear();
	imr.closedSet();
	dom.children('.deltioClosed').text('');
	deltio.candiTabsShow();

	return deltio;
};

///////////////////////////////////////////////////////////////////////////////@

deltio.klonismos = (e) => {
	e.stopPropagation();

	let x = $('.deltioCandi').first().data('deltio');

	if (!x)
	return deltio.fyiError('Ακαθόριστο πρότυπο παρουσιολόγιο');

	try {
		var kodikos = x.kodikosGet();
	}

	catch (e) {
		return deltio.fyiError('Απροσδιόριστο πρότυπο παρουσιολόγιο');
	}

	pnd.fyiMessage('Κλωνισμός παρουσιολογίου <b>' + kodikos + '</b>…');
	$.post({
		'url': 'klonismos.php',
		'data': {
			'kodikos': kodikos,
		},
		'dataType': 'json',
		'success': (rsp) => deltio.klonosProcess(rsp, kodikos),
		'error': (e) => {
			pnd.fyiError('Σφάλμα κλωνισμού');
			console.error(e);
		},
	});

	return deltio;
};

deltio.klonosProcess = (x, protipo) => {
	if (x.error) {
		pnd.fyiError(x.error);
		console.error(x.error);
		return deltio;
	}

	if (!x.hasOwnProperty('deltio')) {
		pnd.fyiError('Δεν επστράφησαν στοιχεία αντιγράφου');
		console.error(x);
		return deltio;
	}

	pnd.fyiMessage('Δημιουργήθηκε παρουσιολόγιο <b>' +
	x.deltio.k + '</b> ως αντίγραφο του παρουσιολογίου <b>' +
	protipo + '</b>');

	deltio.clearCandi();

	deltio.browserDOM.
	prepend((new letrak.deltio(x.deltio)).
	domGet().
	data('candi', true).
	addClass('deltioCandi'));

	pnd.
	zebraFix(deltio.browserDOM).
	ofelimoDOM.scrollTop(0);

	deltio.
	candiTabsShow().
	prosopa({
		'klonos': true,
	});

	return deltio;
};

///////////////////////////////////////////////////////////////////////////////@

deltio.prosopa = (opts) => {
	if (opts.hasOwnProperty('clickEvent'))
	opts.clickEvent.stopPropagation();

	let dom = $('.deltioCandi').first();

	if (dom.length !== 1)
	return pnd.fyiError('Δεν επιλέξατε παρουσιολόγιο προς επεξεργασία');

	let x = dom.data('deltio');

	if (!x)
	return deltio.fyiError('Ακαθόριστο παρουσιολόγιο προς επεξεργασία');

	try {
		var kodikos = x.kodikosGet();
	}

	catch (e) {
		return deltio.fyiError
			('Απροσδιόριστο παρουσιολόγιο προς επεξεργασία');
	}

	// Κρατάμε σε global μεταβλητές το παρουσιολόγιο ως αντικείμενο και
	// ως DOM element, προκειμένου να μπορούμε να τα προσπελάσουμε από
	// τη σελίδα επεξεργασίας παρουσιολογίου.

	self.LETRAK.deltio = {
		'row': x,
		'dom': dom,
		'klonos': opts.klonos,
	};

	if (deltio.hasOwnProperty('ipiresiaList')) {
		self.LETRAK.deltio.ipiresiaList = deltio.ipiresiaList;
		deltio.prosopaOpen(kodikos);
		return deltio;
	}

	deltio.erpotaFetch(kodikos);
	return deltio;
};

deltio.prosopaOpen = (kodikos) => {
	window.open('../prosopa?deltio=' + kodikos, '_blank');
	return deltio;
};

///////////////////////////////////////////////////////////////////////////////@

// Η function "autoFind" καλείται κατά την είσοδο του χρήστη στη σελίδα και
// σκοπό έχει την αυτόματη επιλογή και εμφάνιση των πρόσφατων παρουσιολογίων
// που αφορούν τον χρήστη με βάση την υπηρεσία του χρήστη. Αν π.χ. ο χρήστης
// έχει υπηρεσία την "Β090003", τότε θα επιλεγούν τα πρόσφατα παρουσιολόγια
// του Τμήματος Μηχανογραφικής Υποστήριξης. Αν ο χρήστης έχει υπηρεσία την
// "Β09", τότε θα επιλεγούν αυτόματα τα πρόσφατα παρουσιολόγια της ΔΕΠΣΤΠΕ.
// Αν το πεδίο της υπηρεσίας είναι null, τότε σημαίνει ότι ο χρήστης έχει
// πρόσβαση μόνο στα προσωπικά του στοιχεία, οπότε σ' αυτήν την περίπτωση
// επιλέγονται τα παρουσιολόγια που τον αφορούν ως συμμετέχοντα σε αυτά.
// Τέλος, αν η υπηρεσία είναι κενή σημαίνει ότι ο χρήστης έχει πρόσβαση σε
// όλες τις υπηρεσίες· σ' αυτήν την περίπτωση δεν επιλέγονται αυτοματα
// παρουσιολόγια, αλλά εμφανίζεται η φόρμα καταχώρησης κριτηρίων επιλογής.

deltio.autoFind = () => {
	let ipiresia = letrak.xristisIpiresiaGet();

	// Η περίπτωση null κωδικού υπηρεσίας θεωρείται ταυτόσημη με την
	// περίπτωση της ακαθόριστης (undefined) υπηρεσίας 

	if (ipiresia === null)
	ipiresia = undefined;

	// Αν δεν έχει καθοριστεί υπηρεσία, τότε ο χρήστης έχει πρόσβαση
	// μόνο σε παρουσιολόγια που τον αφορούν ως συμμετέχοντα σε αυτά.

	if (ipiresia === undefined)
	deltio.deltioEpilogi({
		'ipalilos': letrak.xristisIpalilosGet(),
	});

	// Αν η υπηρεσία είναι καθορισμένη, τότε η τιμή είναι «μάσκα»
	// επιλογής, π.χ. "Β09" έχει πρόσβαση σε όποια υπηρεσία εκκινεί
	// με "Β09" όπως "Β09", "Β090001", "Β0090002" κοκ. Αν η υπηρεσία
	// είναι "Β" έχει πρόσβαση στις "Β010001", "Β020003" κοκ, δηλαδή
	// σε όποια υπηρεσία της οποίας ο κωδικός εκκινεί με το γράμμα "Β".

	else if (ipiresia)
	deltio.deltioEpilogi({
		'ipiresia': ipiresia,
	});

	// Με αυτή τη λογική, η καθορισμένη αλλά κενή υπηρεσία σημαίνει ότι
	// ο χρήστης έχει πρόσβαση σε όλες τις υπηρεσίες. Στην περίπτωση αυτή
	// δεν επιλέγουμε αυτόματα παρουσιολόγια, αλλά εμφανίζουμε τη φόρμα
	// καταχώρησης κριτηρίων επιλογής.

	else
	deltio.filtraToggle();

	return deltio;
};

deltio.deltioEpilogi = (data, opts) => {
	if (!opts)
	opts = {};

	if (!opts.hasOwnProperty('onEmpty'))
	opts.onEmpty = () => pnd.fyiMessage('Δεν βρέθηκαν παρουσιολόγια');

	pnd.fyiMessage('Επιλογή παρουσιολογίων…');
	$.post({
		'url': 'deltio.php',
		'data': data,
		'dataType': 'json',
		'success': (rsp) => deltio.deltioProcess(rsp, opts),
		'error': (e) => {
			pnd.fyiError('Αδυναμία επιλογής παρουσιολογίων');
			console.error(e);
		},
	});

	return deltio;
};

deltio.deltioProcess = (rsp, opts) => {
	if (!opts)
	opts = {};

	if (rsp.hasOwnProperty('error'))
	return deltio.fyiError(rsp.error);

	pnd.fyiClear();

	if (opts.clean) {
		deltio.browserDOM.empty();
		delete deltio.imerominiaLast;
	}

	let count = 0;
	let ilast = undefined;

	pnd.arrayWalk(rsp.deltio, function(v) {
		count++;
		(new letrak.deltio(v)).
		domGet().
		appendTo(deltio.browserDOM);
		ilast = v.i;
	});

	if (ilast) {
		ilast = new Date(ilast);
		ilast.setDate(ilast.getDate() - 1);
		deltio.imerominiaLast = pnd.date(ilast, '%D-%M-%Y');
	}

	if (count) {
		pnd.zebraFix(deltio.browserDOM);

		if (opts.onFound)
		opts.onFound();
	}

	else if (opts.onEmpty)
	opts.onEmpty();

	return deltio;
};

///////////////////////////////////////////////////////////////////////////////@

deltio.erpotaFetch = (kodikos) => {
	if (deltio.hasOwnProperty('ipiresiaArray'))
	return deltio.prosopaOpen(kodikos);

	pnd.fyiMessage('Λήψη δεδομένων προσωπικού…');
	$.post({
		'url': 'erpotaFetch.php',
		'dataType': 'json',
		'success': (rsp) => deltio.erpotaProcess(rsp, kodikos),
		'error': (e) => {
			pnd.fyiError(deltio.minima.erpotaFetchError);
			console.error(e);
		},
	});

	return deltio;
};

deltio.erpotaProcess = (rsp, kodikos) => {
	if (!rsp.hasOwnProperty('error'))
	return deltio.fyiError('Ημιτελής λήψη στοιχείων προσωπικού');

	if (rsp.error)
	return deltio.fyiError(rsp.error);

	pnd.fyiClear();
	deltio.ipiresiaArray = rsp.ipiresia;
	deltio.ipalilosArray = rsp.ipalilos;

	deltio.ipiresiaList = {};
	pnd.arrayWalk(deltio.ipiresiaArray, (v) => {
		deltio.ipiresiaList[v.k] = v.p;
	});

	self.LETRAK.deltio.ipiresiaList = deltio.ipiresiaList;
	deltio.prosopaOpen(kodikos);

	return deltio;
};

///////////////////////////////////////////////////////////////////////////////@

letrak.deltio.prototype.domGet = function() {
	let kodikos = this.kodikosGet();
	let closedDOM;
	let prosapoClass = 'deltioProsapo';
console.log(this);

	switch (this.prosapoGet()) {
	case 'ΠΡΟΣΕΛΕΥΣΗ':
		prosapoClass += ' deltioProsapoProselefsi';
		break;
	case 'ΑΠΟΧΩΡΗΣΗ':
		prosapoClass += ' deltioProsapoApoxorisi';
		break;
	}

	let dom = $('<div>').
	data('deltio', this).
	addClass('deltio').

	append(closedDOM = $('<div>').
	addClass('deltioClosed')).

	append($('<div>').
	addClass('deltioKodikos').
	attr('title', 'Κωδικός παρουσιολογίου').
	text(kodikos)).

	append($('<div>').
	addClass('deltioImerominia').
	text(pnd.date(this.imerominiaGet(), '%D-%M-%Y'))).

	append($('<div>').
	addClass('deltioIpiresia').
	text(this.ipiresiaGet())).

	append($('<div>').
	addClass(prosapoClass).
	text(this.prosapoGet())).

	append($('<div>').
	addClass('deltioPerigrafi').
	text(this.perigrafiGet()));

console.log(this.closedGet());
	if (this.closedGet())
	closedDOM.html(deltio.minima.deltioKatastasiClosedSymbol);

	else
	closedDOM.text('');
	
	return dom;
};

///////////////////////////////////////////////////////////////////////////////@

deltio.fyiMessage = (s) => {
	pnd.fyiMessage(s);
	return deltio;
};

deltio.fyiError = (s) => {
	pnd.fyiError(s);
	return deltio;
};
