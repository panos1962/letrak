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
const imerisio = {};

// Χρησιμοποιούμε το global singleton "LETRAK" ως μέσο κοινοποίησης constant
// αντικειμένων προκειμένου να είναι αυτά προσπελάσιμα από children windows.

self.LETRAK.pnd = pnd;
self.LETRAK.letrak = letrak;
self.LETRAK.imerisio = imerisio;

imerisio.minima = {
	'filtraTabLabel': 'Φίλτρα',
	'filtraHideTitle': 'Απόκρυψη φίλτρων',
	'filtraShowTitle': 'Εμφάνιση φίλτρων',
	'filtraIpalilosLabel': 'Υπάλληλος',
	'filtraImerominiaLabel': 'Ημερομηνία',
	'filtraIpiresiaLabel': 'Υπηρεσία',
	'paleoteraTabLabel': 'Παλαιότερα',
	'paleoteraTitle': 'Επιλογή παλαιότερων παρουσιολογίων',
	'diagrafiTabLabel': 'Διαγραφή',
	'diagrafiTitle': 'Διαγραφή επιλεγμένου παρουσιολογίου',
	'klonosTabLabel': 'Κλώνος',
	'klonosTitle': 'Κλωνοποίηση επιλεγμένου παρουσιολογίου',
	'prosopaTabLabel': 'Επεξεργασία',
	'prosopaTitle': 'Επεξεργασία επιλεγμένου παρουσιολογίου',
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
	keepAlive('../mnt/pandora');

	letrak.
	toolbarArxikiSetup();

	imerisio.
	browserSetup().
	filtraSetup().
	autoFind().
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
	on('click', (e) => imerisio.filtraToggle(e))).

	append(imerisio.paleoteraTabDOM = letrak.tabDOM().
	attr('title', imerisio.minima.paleoteraTitle).
	append(imerisio.minima.paleoteraTabLabel).
	on('click', (e) => imerisio.paleotera(e)));

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
	addClass('letrak-inputLine').
	append(imerisio.filtraIpalilosDOM = $('<label>').
	attr('for', 'ipalilosFiltro').
	text(imerisio.minima.filtraIpalilosLabel)).
	append(imerisio.filtraIpalilosDOM = $('<input>').
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

	let ipiresia = letrak.xristisIpiresiaGet();

	if (ipiresia === undefined)
	imerisio.filtraIpalilosDOM.
	attr('disabled', true).
	val(letrak.xristisIpalilosGet());

	else
	imerisio.filtraIpiresiaDOM.val(ipiresia);

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

// Η function "filtraFormaIpovoli" καλείται με το πάτημα του φερώνυμου
// πλήκτρου στη φόρμα καταχώρησης κριτηρίων επιλογής παρουσιολογίων.

imerisio.filtraFormaIpovoli = (e) => {
	e.stopPropagation();

	let data = {
		'ipiresia': imerisio.filtraIpiresiaDOM.val(),
		'imerominia': imerisio.filtraImerominiaDOM.val(),
		'ipalilos': imerisio.filtraIpalilosDOM.val(),
	};

	imerisio.imerisioEpilogi(data, {
		'clean': true,
		'onFound': () => imerisio.filtraDOM.dialog('close'),
	});

	return false;
};

imerisio.filtraFormaClear = (e) => {
	e.stopPropagation();
	imerisio.filtraIpiresiaDOM.val('').focus();
	imerisio.filtraImerominiaDOM.val('');

	if (!imerisio.filtraIpalilosDOM.attr('disabled'))
	imerisio.filtraIpalilosDOM.val('');

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
	letrak.arxikiTabDOM.
	addClass('indacTab');

	imerisio.filtraTabDOM.
	addClass('indacTab');

	imerisio.paleoteraTabDOM.
	addClass('indacTab');

	pnd.toolbarLeftDOM.

	append(letrak.tabDOM().
	addClass('candiTab').
	attr('title', imerisio.minima.diagrafiTitle).
	text(imerisio.minima.diagrafiTabLabel).
	on('click', (e) => imerisio.diagrafiConfirm(e))).

	append(letrak.tabDOM().
	addClass('candiTab').
	attr('title', imerisio.minima.klonosTitle).
	text(imerisio.minima.klonosTabLabel).
	on('click', (e) => imerisio.klonismos(e))).

	append(letrak.tabDOM().
	addClass('candiTab').
	attr('title', imerisio.minima.prosopaTitle).
	text(imerisio.minima.prosopaTabLabel).
	on('click', (e) => imerisio.prosopa({
		'clickEvent': e,
	})));

	return imerisio;
};

imerisio.candiTabsShow = () => {
	pnd.toolbarDOM.
	find('.candiTab').
	addClass('candiTabVisible');

	pnd.toolbarDOM.
	find('.indacTab').
	addClass('indacTabHidden');

	return imerisio;
};

imerisio.candiTabsHide = () => {
	pnd.toolbarDOM.
	find('.candiTab').
	removeClass('candiTabVisible');

	pnd.toolbarDOM.
	find('.indacTab').
	removeClass('indacTabHidden');

	return imerisio;
};

imerisio.clearCandi = () => {
	$('.imerisio').
	removeData('candi').
	removeClass('imerisioCandi');

	return imerisio;
};

///////////////////////////////////////////////////////////////////////////////@

imerisio.paleotera = (e) => {
	e.stopPropagation();

	// Αρχικά θέτουμε το κριτήριο ημερομηνίας με βάση την ημερομηνία
	// από την τελευταία παρτίδα που έχουμε ήδη παραλάβει.

	let data = {
		'ipiresia': imerisio.filtraIpiresiaDOM.val(),
		'imerominia': imerisio.imerominiaLast,
	};

	// Αν δεν έχουμε παραλάβει παρουσιολόγια μέχρι στιγμής, τότε
	// θέτουμε το κριτήριο ημερομηνίας με βάση το σχετικό φίλτρο
	// από τη φόρμα καταχώρησης κριτηρίων επιλογής.

	if (!data.imerominia)
	data.imerominia = imerisio.filtraImerominiaDOM.val();

	imerisio.imerisioEpilogi(data, {
		'onFound': () => {
			imerisio.filtraDOM.dialog('close');
			pnd.ofelimoDOM.
			scrollTop(pnd.ofelimoDOM.prop('scrollHeight'));
		},
		'onEmpty': () => pnd.fyiMessage
			('Δεν βρέθηκαν παλαιότερα παρουσιολόγια'),
	});
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

	pnd.
	zebraFix(imerisio.browserDOM).
	ofelimoDOM.scrollTop(0);

	imerisio.
	candiTabsShow().
	prosopa({
		'klonos': true,
	});

	return imerisio;
};

///////////////////////////////////////////////////////////////////////////////@

imerisio.prosopa = (opts) => {
	if (opts.hasOwnProperty('clickEvent'))
	opts.clickEvent.stopPropagation();

	let dom = $('.imerisioCandi').first();

	if (dom.length !== 1)
	return pnd.fyiError('Δεν επιλέξατε παρουσιολόγιο προς επεξεργασία');

	let x = dom.data('data');

	if (!x)
	return imerisio.fyiError('Ακαθόριστο παρουσιολόγιο προς επεξεργασία');

	try {
		var kodikos = x.kodikosGet();
	}

	catch (e) {
		return imerisio.fyiError
			('Απροσδιόριστο παρουσιολόγιο προς επεξεργασία');
	}

	// Κρατάμε σε global μεταβλητές το παρουσιολόγιο ως αντικείμενο και
	// ως DOM element, προκειμένου να μπορούμε να τα προσπελάσουμε από
	// τη σελίδα επεξεργασίας παρουσιολογίου.

	self.LETRAK.imerisio = {
		'row': x,
		'dom': dom,
		'klonos': opts.klonos,
	};

	imerisio.erpotaFetch(kodikos);
	return imerisio;
};

imerisio.prosopaOpen = (kodikos) => {
	window.open('../prosopa?imerisio=' + kodikos, '_blank');
	return imerisio;
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

imerisio.autoFind = () => {
	let ipiresia = letrak.xristisIpiresiaGet();

	// Η περίπτωση null κωδικού υπηρεσίας θεωρείται ταυτόσημη με την
	// περίπτωση της ακαθόριστης (undefined) υπηρεσίας 

	if (ipiresia === null)
	ipiresia = undefined;

	// Αν δεν έχει καθοριστεί υπηρεσία, τότε ο χρήστης έχει πρόσβαση
	// μόνο σε παρουσιολόγια που τον αφορούν ως συμμετέχοντα σε αυτά.

	if (ipiresia === undefined)
	imerisio.imerisioEpilogi({
		'ipalilos': letrak.xristisIpalilosGet(),
	});

	// Αν η υπηρεσία είναι καθορισμένη, τότε η τιμή είναι «μάσκα»
	// επιλογής, π.χ. "Β09" έχει πρόσβαση σε όποια υπηρεσία εκκινεί
	// με "Β09" όπως "Β09", "Β090001", "Β0090002" κοκ. Αν η υπηρεσία
	// είναι "Β" έχει πρόσβαση στις "Β010001", "Β020003" κοκ, δηλαδή
	// σε όποια υπηρεσία της οποίας ο κωδικός εκκινεί με το γράμμα "Β".

	else if (ipiresia)
	imerisio.imerisioEpilogi({
		'ipiresia': ipiresia,
	});

	// Με αυτή τη λογική, η καθορισμένη αλλά κενή υπηρεσία σημαίνει ότι
	// ο χρήστης έχει πρόσβαση σε όλες τις υπηρεσίες. Στην περίπτωση αυτή
	// δεν επιλέγουμε αυτόματα παρουσιολόγια, αλλά εμφανίζουμε τη φόρμα
	// καταχώρησης κριτηρίων επιλογής.

	else
	imerisio.filtraToggle();

	return imerisio;
};

imerisio.imerisioEpilogi = (data, opts) => {
	if (!opts)
	opts = {};

	if (!opts.hasOwnProperty('onEmpty'))
	opts.onEmpty = () => pnd.fyiMessage('Δεν βρέθηκαν παρουσιολόγια');

	pnd.fyiMessage('Επιλογή παρουσιολογίων…');
	$.post({
		'url': 'imerisio.php',
		'data': data,
		'dataType': 'json',
		'success': (rsp) => imerisio.imerisioProcess(rsp, opts),
		'error': (e) => {
			pnd.fyiError('Αδυναμία επιλογής παρουσιολογίων');
			console.error(e);
		},
	});

	return imerisio;
};

imerisio.imerisioProcess = (rsp, opts) => {
	if (!opts)
	opts = {};

	if (rsp.hasOwnProperty('error'))
	return imerisio.fyiError(rsp.error);

	pnd.fyiClear();

	if (opts.clean) {
		imerisio.browserDOM.empty();
		delete imerisio.imerominiaLast;
	}

	let count = 0;
	let ilast = undefined;

	pnd.arrayWalk(rsp.imerisio, function(v) {
		count++;
		(new letrak.imerisio(v)).
		domGet().
		appendTo(imerisio.browserDOM);
		ilast = v.i;
	});

	if (ilast) {
		ilast = new Date(ilast);
		ilast.setDate(ilast.getDate() - 1);
		imerisio.imerominiaLast = pnd.date(ilast, '%D-%M-%Y');
	}

	if (count) {
		pnd.zebraFix(imerisio.browserDOM);

		if (opts.onFound)
		opts.onFound();
	}

	else if (opts.onEmpty)
	opts.onEmpty();

	return imerisio;
};

///////////////////////////////////////////////////////////////////////////////@

imerisio.erpotaFetch = (kodikos) => {
	return imerisio.prosopaOpen(kodikos);

	if (imerisio.hasOwnProperty('ipiresiaList'))
	return imerisio.prosopaOpen(kodikos);

	pnd.fyiMessage('Λήψη δεδομένων προσωπικού…');
	$.post({
		'url': 'erpotaFetch.php',
		'dataType': 'json',
		'success': (rsp) => imerisio.erpotaProcess(rsp, kodikos),
		'error': (e) => {
			pnd.fyiError(imerisio.minima.erpotaFetchError);
			console.error(e);
		},
	});

	return imerisio;
};

imerisio.erpotaProcess = (rsp, kodikos) => {
	if (!rsp.hasOwnProperty('error'))
	return imerisio.fyiError('Ημιτελής λήψη στοιχείων προσωπικού');

	if (rsp.error)
	return imerisio.fyiError(rsp.error);

	pnd.fyiClear();
	imerisio.ipiresiaList = rsp.ipiresia;
	imerisio.ipalilosList = rsp.ipalilos;

	imerisio.prosopaOpen(kodikos);
	return imerisio;
};

///////////////////////////////////////////////////////////////////////////////@

letrak.imerisio.prototype.domGet = function() {
	let kodikos = this.kodikosGet();

	let dom = $('<div>').
	data('data', this).
	addClass('imerisio').

	append($('<div>').
	addClass('imerisioKodikos').
	attr('title', 'Κωδικός παρουσιολογίου').
	text(kodikos)).

	append($('<div>').
	addClass('imerisioImerominia').
	text(pnd.date(this.imerominiaGet(), '%D-%M-%Y'))).

	append($('<div>').
	addClass('imerisioIpiresia').
	text(this.ipiresiaGet())).

	append($('<div>').
	addClass('imerisioTipos').
	text(this.prosapoGet())).

	append($('<div>').
	addClass('imerisioPerigrafi').
	text(this.perigrafiGet()));

	return dom;
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
