///////////////////////////////////////////////////////////////////////////////@
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
// Updated: 2020-05-19
// Updated: 2020-05-15
// Updated: 2020-05-13
// Updated: 2020-05-12
// Updated: 2020-05-11
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

self.LETRAK = {};

deltio.minima = {
	'filtraTabLabel': 'Φίλτρα',
	'filtraHideTitle': 'Απόκρυψη φίλτρων',
	'filtraShowTitle': 'Εμφάνιση φίλτρων',
	'filtraIpalilosLabel': 'Υπάλληλος',
	'filtraImerominiaLabel': 'Ημερομηνία',
	'filtraProsapoLabel': 'Είδος',
	'filtraKatastasiLabel': 'Κατάσταση',
	'filtraIpiresiaLabel': 'Υπηρεσία',
	'paleoteraTabLabel': 'Παλαιότερα',
	'paleoteraTitle': 'Επιλογή παλαιότερων παρουσιολογίων',
	'ananeosiTabLabel': 'Ανανέωση',
	'ananeosiTitle': 'Ανανέωση κατάστασης παρουσιολογίων',
	'klisimoTabLabel': 'Επικύρωση',
	'klisimoTitle': 'Επικύρωση επιλεγμένου παρουσιολογίου',
	'anigmaTabLabel': 'Άνοιγμα',
	'anigmaTitle': 'Άνοιγμα επιλεγμένου παρουσιολογίου',
	'diagrafiTabLabel': 'Διαγραφή',
	'diagrafiTitle': 'Διαγραφή επιλεγμένου παρουσιολογίου',
	'klonosTabLabel': 'Κλώνος',
	'klonosTitle': 'Κλωνοποίηση επιλεγμένου παρουσιολογίου',
	'epexergasiaTabLabel': 'Επεξεργασία',
	'epexergasiaTitle': 'Επεξεργασία επιλεγμένου παρουσιολογίου',
	'leptomeriesTabLabel': 'Λεπτομέρειες',
	'leptomeriesTitle': 'Λεπτομέρειες επιλεγμένου παρουσιολογίου',
	'erpotaFetchError': 'Αποτυχία λήψης δεδομένων προσωπικού',

	'deltioKatastasiΕΚΚΡΕΜΕΣSymbol': '&#x25D4;',
	'deltioKatastasiΑΝΥΠΟΓΡΑΦΟSymbol': '&#x25D1;',
	'deltioKatastasiΚΥΡΩΜΕΝΟSymbol': '&#x25D5;',
	'deltioKatastasiΕΠΙΚΥΡΩΜΕΝΟSymbol': '&#x2714;',
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
	klonismosSetup().
	browserSetup().
	filtraSetup().
	autoFind().
	candiTabsSetup();

	return deltio;
};

///////////////////////////////////////////////////////////////////////////////@

deltio.filtraSetup = () => {
	pnd.toolbarLeftDOM.

	append(letrak.tabDOM().
	addClass('adminTab').
	addClass('deltioTab').
	attr('title', deltio.minima.ananeosiTitle).
	text(deltio.minima.ananeosiTabLabel).
	on('click', (e) => deltio.ananeosi(e))).

	append(deltio.filtraTabDOM = letrak.tabDOM().
	attr('title', deltio.minima.filtraShowTitle).
	append(deltio.minima.filtraTabLabel).
	on('click', (e) => deltio.filtraToggle(e))).

	append(deltio.paleoteraTabDOM = letrak.tabDOM().
	addClass('deltioTab').
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
	append($('<option>').val('').text('').attr('selected', true)).
	append($('<option>').
	val(php.defs.LETRAK_DELTIO_PROSAPO_PROSELEFSI).
	text(php.defs.LETRAK_DELTIO_PROSAPO_PROSELEFSI)).
	append($('<option>').
	val(php.defs.LETRAK_DELTIO_PROSAPO_APOXORISI).
	text(php.defs.LETRAK_DELTIO_PROSAPO_APOXORISI)).
	attr('id', 'prosapoFiltro').
	addClass('filtraInput'))).

	append($('<div>').
	addClass('letrak-inputLine').
	append(deltio.filtraKatastasiDOMDOM = $('<label>').
	attr('for', 'katastasiFiltro').
	text(deltio.minima.filtraKatastasiLabel)).
	append(deltio.filtraKatastasiDOM = $('<select>').
	append($('<option>').val('').text('').attr('selected', true)).
	append($('<option>').val('ΕΚΚΡΕΜΕΣ').text('ΕΚΚΡΕΜΕΣ')).
	append($('<option>').val('ΑΝΥΠΟΓΡΑΦΟ').text('ΑΝΥΠΟΓΡΑΦΟ')).
	append($('<option>').val('ΚΥΡΩΜΕΝΟ').text('ΚΥΡΩΜΕΝΟ')).
	append($('<option>').val('ΕΠΙΚΥΡΩΜΕΝΟ').text('ΕΠΙΚΥΡΩΜΕΝΟ')).
	attr('id', 'katastasiFiltro').
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
		'resizable': false,

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
	addClass('filtraTabEnabled').
	attr('title', deltio.minima.filtraHideTitle);

	return deltio;
};

deltio.filtraDisable = function(act) {
	deltio.filtraTabDOM.
	removeClass('filtraTabEnabled').
	attr('title', deltio.minima.filtraShowTitle);

	return deltio;
};

deltio.filtraEnabled = function() {
	return (deltio.filtraTabDOM.hasClass('filtraTabEnabled'));
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
		'katastasi': deltio.filtraKatastasiDOM.val(),
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

		if ($(this).hasClass('deltioCandi'))
		return;

		$(this).
		addClass('deltioCandiCandi');
	}).
	on('mouseleave', '.deltio', function(e) {
		e.stopPropagation();

		if ($(this).hasClass('deltioCandi'))
		return;

		$(this).
		removeClass('deltioCandiCandi');
	}).
	on('click', '.deltio', function(e) {
		e.stopPropagation();

		let wasCandi = $(this).hasClass('deltioCandi');

		$('.deltioCandi').
		removeClass('deltioCandi');

		if (wasCandi)
		return deltio.candiTabsHide();

		$(this).
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
	on('click', (e) => deltio.klonismosAnte(e))).

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

	let katastasi = x.katastasiGet();
	let klisto = x.isKlisto();
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

	// Τα πλήκτρα επικύρωσης και άρσης επικύρωσης έχουν ήδη τεθεί σε
	// κατάσταση ανάλογη με το αν το επιλεγμένο παρουσιολόγιο είναι
	// επικυρωμένο ή όχι, ωστόσο μπορούμε να προβούμε σε περαιτέρω
	// ενέργειες απόκρυψης των σχετικών πλήκτρων.

	switch (katastasi) {
	case 'ΚΥΡΩΜΕΝΟ':
	case 'ΕΠΙΚΥΡΩΜΕΝΟ':
		break;
	default:
		deltio.klisimoTabDOM.removeClass('candiTabVisible');
		deltio.anigmaTabDOM.removeClass('candiTabVisible');
		break;
	}

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
	removeClass('deltioCandi');

	deltio.candiTabsHide();
	return deltio;
};

///////////////////////////////////////////////////////////////////////////////@

deltio.ananeosi = (e) => {
	e.stopPropagation();

	let domList = deltio.browserDOM.children('.deltio');
	let dltList = [];

	domList.
	each(function() {
		let deltio = $(this).data('deltio');

		if (!deltio)
		return;

		deltio = deltio.kodikosGet();

		if (!deltio)
		return;

		dltList.push(deltio);
	});

	$.post({
		'url': 'ananeosi.php',
		'data': {
			'dlist': dltList,
		},
		'dataType': 'json',
		'success': (rsp) => deltio.ananeosiProcess(rsp, domList),
		'error': (err) => {
			pnd.fyiMessage('Σφάλμα ανανέωσης');
			console.error(err);
		},
	});

	return deltio;
};

deltio.ananeosiProcess = (rsp, domList) => {
	if (rsp.error)
	return deltio.fyiError(rsp.error);

	if (!rsp.hasOwnProperty('dlist'))
	return deltio.clearCandi();

	let candi = false;

	domList.
	each(function() {
		if (candi)
		$(this).removeClass('deltioCandi');

		else if ($(this).hasClass('deltioCandi'))
		candi = true;

		let dlt = $(this).data('deltio');

		if (!dlt)
		return;

		let kodikos = dlt.kodikosGet();

		if (!kodikos)
		return;

		if (!rsp.dlist.hasOwnProperty(kodikos))
		return;

		let katastasi = rsp.dlist[kodikos];

		if (!letrak.deltio.katastasiEnglishMap.
			hasOwnProperty(katastasi))
		return;

		dlt.katastasiSet(katastasi);
		let katastasiEnglish = letrak.deltio.
			katastasi2english(katastasi);

		$(this).
		children('.deltioKatastasi').
		removeClass('letrak-deltioKatastasiEKREMES').
		removeClass('letrak-deltioKatastasiANIPOGRAFO').
		removeClass('letrak-deltioKatastasiKIROMENO').
		removeClass('letrak-deltioKatastasiEPIKIROMENO').
		addClass('letrak-deltioKatastasi' + katastasiEnglish).
		html(deltio.minima['deltioKatastasi' + katastasi + 'Symbol']);
	});

	if (candi)
	deltio.candiTabsShow();

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
	deltio.
	zebraFix().
	clearCandi();

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
		var dlt = dom.data('deltio');
		var kodikos = dlt.kodikosGet();
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
		'success': (rsp) => deltio.klisimoProcess(rsp, dlt, dom),
		'error': (e) => {
			pnd.fyiError('Σφάλμα κλεισίματος παρουσιολογίου');
			console.error(e);
		},
	});

	return deltio;
};

deltio.klisimoProcess = (msg, dlt, dom) => {
	if (msg)
	return deltio.fyiError(msg);


	pnd.fyiClear();
	dlt.katastasiSet('ΕΠΙΚΥΡΩΜΕΝΟ');
	dom.children('.deltioKatastasi').
	removeClass('letrak-deltioKatastasiEKREMES').
	removeClass('letrak-deltioKatastasiANIPOGRAFO').
	removeClass('letrak-deltioKatastasiKIROMENO').
	addClass('letrak-deltioKatastasiEPIKIROMENO').
	html(deltio.minima['deltioKatastasiΕΠΙΚΥΡΩΜΕΝΟSymbol']);
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
		var dlt = dom.data('deltio');
		var kodikos = dlt.kodikosGet();
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
		'success': (rsp) => deltio.anigmaProcess(rsp, dlt, dom),
		'error': (e) => {
			pnd.fyiError('Σφάλμα ανοίγματος παρουσιολογίου');
			console.error(e);
		},
	});

	return deltio;
};

deltio.anigmaProcess = (msg, dlt, dom) => {
	if (msg)
	return deltio.fyiError(msg);

	pnd.fyiClear();
	dlt.katastasiSet('ΚΥΡΩΜΕΝΟ');
	dom.children('.deltioKatastasi').
	removeClass('letrak-deltioKatastasiEKREMES').
	removeClass('letrak-deltioKatastasiANIPOGRAFO').
	addClass('letrak-deltioKatastasiKIROMENO').
	removeClass('letrak-deltioKatastasiEPIKIROMENO').
	html(deltio.minima['deltioKatastasiΚΥΡΩΜΕΝΟSymbol']);
	deltio.candiTabsShow();

	return deltio;
};

///////////////////////////////////////////////////////////////////////////////@

deltio.klonismosSetup = () => {
	deltio.klonismosFormaDOM = $('#klonismosForma');
	deltio.klonismosFormaImerominiaDOM = deltio.klonismosFormaDOM.
	find('#klonismosFormaImerominia').
	datepicker({
		'autoOpen': false,
	});
	deltio.klonismosFormaEnarktirioDOM = deltio.klonismosFormaDOM.
	find('#klonismosFormaEnarktirio');

	deltio.klonismosFormaDOM.
	dialog({
		'title': 'Δημιουργία παρουσιολογίου',
		'autoOpen': false,
		'resizable': false,
		'height': 'auto',
		'width': '24em',
		'modal': true,
		'position': {
			'my': 'left+150 top+56',
			'at': 'left top',
		},
		'buttons': {
			'Δημιουργία': function() {
				deltio.klonismos();
			},
			'Άκυρο': function() {
				$(this).dialog('close');
			},
		},
		'open': () => deltio.klonismosFormaEnarktirioDOM.
			prop('checked', false),
	});

	return deltio;
};

deltio.klonismosAnte = (e) => {
	e.stopPropagation();

	let protipo = $('.deltioCandi').first().data('deltio');

	if (!protipo)
	return deltio.fyiError('Ακαθόριστο πρότυπο παρουσιολόγιο');

	try {
		deltio.klonismosFormaDOM.
		data('protipo', protipo.kodikosGet());
	}

	catch (e) {
		return deltio.fyiError('Απροσδιόριστο πρότυπο παρουσιολόγιο');
	}

	let imerominia;

	switch (protipo.prosapoGet()) {
	case php.defs.LETRAK_DELTIO_PROSAPO_PROSELEFSI:
		imerominia = protipo.imerominiaGet();
		break;
	case php.defs.LETRAK_DELTIO_PROSAPO_APOXORISI:
		imerominia = new Date();
		break;
	default:
		return deltio.fyiError('Απροσδιόριστο είδος παρουσιολογίου');
	}

	imerominia = pnd.date(imerominia, '%D-%M-%Y');

	deltio.klonismosFormaImerominiaDOM.
	val(imerominia);
	deltio.klonismosFormaDOM.dialog('open');

	return deltio;
};

deltio.klonismos = () => {
	let data = {
		'protipo': deltio.klonismosFormaDOM.data('protipo'),
		'imerominia': deltio.klonismosFormaImerominiaDOM.val(),
	};

	if (deltio.klonismosFormaEnarktirioDOM.prop('checked'))
	data.enarktirio = 1;

	pnd.fyiMessage('Κλωνισμός παρουσιολογίου ' +
		'<b>' + data.protipo + '</b>…');
	$.post({
		'url': 'klonismos.php',
		'data': data,
		'dataType': 'json',
		'success': (rsp) => deltio.klonosProcess(rsp, data.protipo),
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
		return deltio;
	}

	if (!x.hasOwnProperty('deltio')) {
		pnd.fyiError('Δεν επστράφησαν στοιχεία αντιγράφου');
		console.error(x);
		return deltio;
	}

	deltio.klonismosFormaDOM.dialog('close');
	pnd.fyiMessage('Δημιουργήθηκε παρουσιολόγιο <b>' +
	x.deltio.k + '</b> ως αντίγραφο του παρουσιολογίου <b>' +
	protipo + '</b>');

	deltio.clearCandi();

	deltio.browserDOM.
	prepend((new letrak.deltio(x.deltio)).
	domGet().
	addClass('deltioCandi'));

	deltio.zebraFix();
	pnd.ofelimoDOM.scrollTop(0);

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

	self.LETRAK.deltio = x;
	self.LETRAK.deltioDOM = dom;
	self.LETRAK.klonos = opts.klonos;

	if (deltio.hasOwnProperty('ipiresiaList')) {
		self.LETRAK.ipiresiaList = deltio.ipiresiaList;
		self.LETRAK.ipalilosArray = deltio.ipalilosArray;
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

	deltio.zebraFix();

	if (count) {
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

	self.LETRAK.ipiresiaList = deltio.ipiresiaList;
	self.LETRAK.ipalilosArray = deltio.ipalilosArray;
	deltio.prosopaOpen(kodikos);

	return deltio;
};

///////////////////////////////////////////////////////////////////////////////@

letrak.deltio.prototype.domGet = function() {
	let kodikos = this.kodikosGet();
	let katastasiDOM;
	let prosapoClass = 'deltioProsapo';

	switch (this.prosapoGet()) {
	case php.defs.LETRAK_DELTIO_PROSAPO_PROSELEFSI:
		prosapoClass += ' deltioProsapoProselefsi';
		break;
	case php.defs.LETRAK_DELTIO_PROSAPO_APOXORISI:
		prosapoClass += ' deltioProsapoApoxorisi';
		break;
	}

	let dom = $('<div>').
	data('deltio', this).
	addClass('deltio').

	append(katastasiDOM = $('<div>').
	addClass('deltioKatastasi')).

	append($('<div>').
	addClass('deltioKodikos').
	attr('title', 'Κωδικός παρουσιολογίου').
	text(kodikos)).

	append($('<div>').
	addClass('deltioImerominia').
	text(pnd.date(this.imerominiaGet(), '%D-%M-%Y'))).

	append($('<div>').
	addClass('deltioImera').
	text(pnd.dowLongGet(this.imerominiaGet()))).

	append($('<div>').
	addClass('deltioIpiresia').
	text(this.ipiresiaGet())).

	append($('<div>').
	addClass(prosapoClass).
	text(this.prosapoGet())).

	append($('<div>').
	addClass('deltioPerigrafi').
	text(this.perigrafiGet()));

	let katastasi = this.katastasiGet();
	let katastasiEnglish = letrak.deltio.katastasi2english(katastasi);

	katastasiDOM.
	addClass('letrak-deltioKatastasi' + katastasiEnglish).
	html(deltio.minima['deltioKatastasi' + katastasi + 'Symbol']);

	if (this.oxiProtipo())
	dom.
	append($('<div>').
	attr('title', 'Εναρκτήριο παρουσιολόγιο').
	addClass('deltioEnarktirio').
	html('&#x2605;'));

	return dom;
};

///////////////////////////////////////////////////////////////////////////////@

deltio.zebraFix = () => {
	pnd.zebraFix(deltio.browserDOM);

	let count = deltio.browserDOM.children('.deltio').length;

	if (count)
	pnd.toolbarLeftDOM.
	children('.deltioTab').
	addClass('deltioTabVisible');

	else
	pnd.toolbarLeftDOM.
	children('.deltioTab').
	removeClass('deltioTabVisible');

	return deltio;
};

deltio.fyiMessage = (s) => {
	pnd.fyiMessage(s);
	return deltio;
};

deltio.fyiError = (s) => {
	pnd.fyiError(s);
	return deltio;
};
