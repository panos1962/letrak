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
// Updated: 2022-10-18
// Updated: 2022-10-16
// Updated: 2022-10-15
// Updated: 2022-09-25
// Updated: 2022-09-17
// Updated: 2022-09-14
// Updated: 2022-09-07
// Updated: 2021-05-29
// Updated: 2021-05-18
// Updated: 2021-05-13
// Updated: 2021-05-12
// Updated: 2021-05-05
// Updated: 2021-05-04
// Updated: 2020-08-02
// Updated: 2020-08-01
// Updated: 2020-07-05
// Updated: 2020-06-14
// Updated: 2020-06-11
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
	'filtraEosLabel': 'Έως',
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
	'reportsTabLabel': 'Εκτυπώσεις',

	'diaforesTabLabel': '&#9775;',
	'diaforesTitle': 'Εντοπισμός διαφορών με προηγούμενο παρουσιολόγιο',

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

	letrak.
	toolbarArxikiSetup();

	deltio.
	klonismosSetup().
	browserSetup().
	filtraSetup().
	reportsSetup().
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
	on('click', (e) => deltio.paleotera(e))).

	append(deltio.reportsTabDOM = letrak.tabDOM().
	addClass('deltioTab').
	append(deltio.minima.reportsTabLabel).
	on('click', (e) => deltio.reportsToggle(e)));

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

	// Το βασικό φίλτρο ημερομηνίας καθορίζει από ποια ημερομηνία
	// και πίσω επιθυμούμε να επιλέξουμε δελτία.

	append($('<div>').
	addClass('letrak-inputLine').
	append($('<label>').
	attr('for', 'imerominiaFiltro').
	text(deltio.minima.filtraImerominiaLabel)).
	append(deltio.filtraImerominiaDOM = $('<input>').
	attr('id', 'imerominiaFiltro').
	addClass('filtraInput').
	datepicker())).

	// Το δευτερεύον φίλτρο ημερομηνίας καθορίζει μέχρι και
	// ποια ημερομηνία επιθυμούμε να επιλέξουμε δελτία.

	append($('<div>').
	addClass('letrak-inputLine').
	append($('<label>').
	attr('for', 'eosFiltro').
	text(deltio.minima.filtraEosLabel)).
	append(deltio.filtraEosDOM = $('<input>').
	attr('id', 'eosFiltro').
	addClass('filtraInput').
	datepicker())).

	append($('<div>').
	addClass('letrak-inputLine').
	append(deltio.filtraProsapoDOM = $('<label>').
	attr('for', 'prosapoFiltro').
	text(deltio.minima.filtraProsapoLabel)).

	append(deltio.filtraProsapoDOM = $('<select>').

	append($('<option>').
	val('').
	text('').
	attr('selected', true)).

	append($('<option>').
	val(php.defs.LETRAK_DELTIO_PROSAPO_PROSELEFSI).
	text(php.defs.LETRAK_DELTIO_PROSAPO_PROSELEFSI)).

	append($('<option>').
	val(php.defs.LETRAK_DELTIO_PROSAPO_APOXORISI).
	text(php.defs.LETRAK_DELTIO_PROSAPO_APOXORISI)).

	append($('<option>').
	val(php.defs.LETRAK_DELTIO_PROSAPO_PROTIPO).
	text(php.defs.LETRAK_DELTIO_PROSAPO_PROTIPO)).

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
		'eos': deltio.filtraEosDOM.val(),
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
	deltio.filtraEosDOM.val('');
	deltio.filtraProsapoDOM.val('');
	deltio.filtraKatastasiDOM.val('');

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

deltio.reportsSetup = () => {
	$('#excelAdiaImera').
	on('click', (e) => deltio.adiaExcel(e, 0));

	$('#excelAdiaDiastima').
	on('click', (e) => deltio.adiaExcel(e, 1));

	$('#reportAdiaIpalilos').
	on('click', (e) => deltio.adiaReport(e));

	deltio.reportsDOM = $('#reports');

	deltio.reportsDOM.
	dialog({
		'resizable': false,
		'title': 'Εκτυπώσεις',
		'width': 'auto',
		'height': 'auto',
		'position': {
			'my': 'left top',
			'at': 'left+290 top+93',
		},
		'open': () => deltio.reportsShow(),
		'close': () => deltio.reportsHide(),
	}).
	dialog('close');

	return deltio;
};

deltio.reportsShow = () => {
	deltio.reportsDOM.
	data('anikto', true).
	dialog('open');

	return deltio;
};

deltio.reportsHide = () => {
	deltio.reportsDOM.
	removeData('anikto').
	dialog('close');

	return deltio;
};

deltio.reportsToggle = (e) => {
	let anikto = deltio.reportsDOM.data('anikto');

	if (anikto)
	deltio.reportsHide();

	else
	deltio.reportsShow();

	return deltio;
};

// Η function "adiaExcel" καλείται κατά την προετοιμασία των reports αδειών.
// Πρόκειται για excel αρχεία τα οποία υποχρεούνται οι υπηρεσίες να υποβάλλουν
// στο Προσωπικό τουλάχιστον κάθε μήνα. Στα αρχεία αυτά περιλαμβάνονται οι
// άδειες που έχουν καταχωρηθεί στα καθημερινά παρουσιολόγια για το διάστημα
// στο οποίο αναφέρεται το εκάστοτε report.
//
// Ως δεύτερη παράμετρος περνά ένας αριθμός που αν είναι μη μηδενικός σημαίνει
// ότι το report θα περιλαμβάνει τις άδειες σε διαστήματα, δηλαδή το είδος τής
// άδειας και το διάστημα στο οποίο αφορά, ενώ αν οαριθμός είναι μηδενικός,
// το report είναι αναλυτικό κατά ημέρα.

deltio.adiaExcel = (e, diastima) => {
	e.stopPropagation();

	// Το πρόγραμμα "minas.php" δέχεται ως παραμέτρους ένα array από
	// κωδικούς δελτίων και παράγει ένα excel αρχείο που φυλάσσεται
	// προσωρινά (για 1-2 ημέρες) στο directory "local/minas". Το
	// basename του παραγόμενου excel αρχείου επιστρέφεται από το
	// πρόγραμμα, ενώ παρέχεται τοπικό link του directory προσωρινής
	// φύλαξης των παραγομένων αρχείων με το όνομα "minas".

	$.post({
		'url': 'minas.php',
		'data': {
			'diastima': diastima,
			'dlist': deltio.dlistCreate(),
		},
		'dataType': 'text',

		// Το πρόγραμμα επιστρέφει το basename του παραγόμενου excel
		// αρχείου, το οποίο μπορούμε να το προσπελάσουμε μέσω του
		// τοπικού link "minas" που δείχνει στο directory προσωρινής
		// φύλαξης των παραγομένων αρχείων.

		'success': (rsp) => {
			deltio.reportsHide();

			if (!rsp)
			return pnd.fyiMessage('Δεν υπάρχουν άδειες προς εκτύπωση');

			rsp.trim();
			pnd.fyiMessage(rsp);
			window.open('minas/' + rsp);
		},
		'error': (err) => {
			pnd.fyiMessage('Σφάλμα κατάστασης αδειών');
			console.error(err);
		},
	});

	return deltio;
};

deltio.adiaReport = (e) => {
	e.stopPropagation();

	self.LETRAK.ipiresia = deltio.filtraIpiresiaDOM.val();
	self.LETRAK.apo = deltio.filtraImerominiaDOM.val();
	self.LETRAK.eos = deltio.filtraEosDOM.val();
	self.LETRAK.dlist = deltio.dlistCreate();

	if (!deltio.hasOwnProperty('ipiresiaList'))
	deltio.erpotaProcess();

	deltio.prosopaWindows.push(window.open('../adiarpt', '_blank'));
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

	// Αν ο χρήστης κάνει κλικ στον κωδικό του δελτίου, τότε ανοίγει
	// απευθείας νέο παράθυρο επεξεργασίας του παρουσιολογίου.

	deltio.browserDOM.
	on('click', '.deltioKodikos', function(e) {
		deltio.prosopa({
			'clickEvent': e,
			'deltioDOM': $(this).closest('.deltio'),
		});
	});

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
	}))).

	append(deltio.diaforesTabDOM = letrak.tabDOM().
	addClass('candiTab').
	attr('title', deltio.minima.diaforesTitle).
	html(deltio.minima.diaforesTabLabel).
	on('click', (e) => deltio.diafores(e)));

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

	let candi = deltio.isCandi();

	if (!candi)
	return deltio;

	let katastasi = candi.katastasiGet();
	let klisto = candi.isKlisto();
	let ipiresia = candi.ipiresiaGet();
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

// Το πρόγραμμα επιτελεί αυτόματες ανανεώσεις σε τακτά χρονικά διαστήματα.
// Για τον έλεγχο των αυτόματων ανανεώσεων χρησιμοποιούμε σχετικό timer.
// By default το διάστημα μεταξύ των αυτόματων ανανεώσεων τίθεται 5 sec,
// αλλά μπορούμε να το αλλάξουμε από το url με την παράμετρο "ananeosi",
// ή ακόμη και να ακυρώσουμε τις αυτόματες ανανεώσεις θέτοντας μηδενικό
// διάστημα.

deltio.ananeosiInterval = php.isGet('ananeosi') ?
	(php.getGet('ananeosi') * 1000) : 5000;

// Ο timer "ananeosiTimer" δείχνει την επόμενη προγραμματισμένη ανανέωση και
// τον χρησιμοποιούμε για να ακυρώνουμε την προγραμματισμένη ανανέσωση κάθε
// φορά που ο χρήστης ζητά ανανέωση με το αντίστοιχο πλήκτρο.

deltio.ananeosiTimer = undefined;

deltio.ananeosi = (e) => {
	if (e)
	e.stopPropagation();

	// Κάθε φορά που επιτελείται ανανέωση, ελέγχουμε αν υπάρχει ήδη
	// δρομολογημένη ανανέωση και αν ναι την ακυρώνουμε, καθώς θα
	// τρέξει άμεσα η ανανέωση που έχουμε ζητήσει.

	if (deltio.ananeosiTimer) {
		clearTimeout(deltio.ananeosiTimer);
		deltio.ananeosiTimer = undefined;
	}

	// Δημιουργούμε λίστα των δελτίων της σελίδας προκειμένου να την
	// αποστείλουμε στο πρόγραμμα ανανέωσης.

	let dlist = deltio.dlistCreate();

	// Αν η λίστα δελτίων της σελίδας είναι κενή, σημαίνει ότι δεν
	// δεν υπάρχουν δελτία στη σελίδα και η ανανέωση ακυρώενεται.

	if (!dlist.length)
	return deltio;

	$.post({
		'url': 'ananeosi.php',
		'data': {
			'dlist': deltio.dlistCreate(),
		},
		'dataType': 'json',
		'success': (rsp) => deltio.ananeosiProcess(rsp),
		'error': (err) => {
			pnd.fyiMessage('Σφάλμα ανανέωσης');
			console.error(err);
		},
	});

	return deltio;
};

deltio.katastasiTitle = {
	"ΕΚΚΡΕΜΕΣ": 'Το δελτίο δεν έχει κυρωθεί',
	"ΑΝΥΠΟΓΡΑΦΟ": 'Απαιτούνται κυρώσεις',
	"ΚΥΡΩΜΕΝΟ": 'Το δελτίο έχει κυρωθεί',
	"ΕΠΙΚΥΡΩΜΕΝΟ": 'Το δελτίο έχει κλείσει',
};

deltio.endixiIpografiTitle = {
	"1": 'Είναι η σειρά σας να κυρώσετε το δελτίο',
	"2": 'Έχετε ήδη κυρώσει το δελτίο',
	"3": 'Προηγείται άλλος στην κύρωση του δελτίου',
};

deltio.ananeosiProcess = (rsp) => {
	// Έχουμε ήδη παραλάβει τα ανανεωμένα δεδομένα των δελτίων της
	// σελίδας, τα οποία με τη σειρά τους θα ανανεώσουν το περιεχόμενο
	// της σελίδας. Εν τω μεταξύ δρομολογούμε την επόμενη (αυτόματη)
	// ανανέωση.

	if (deltio.ananeosiInterval)
	deltio.ananeosiTimer = setTimeout(function() {
		deltio.ananeosi();
	}, deltio.ananeosiInterval);

	if (rsp.error)
	return deltio.fyiError(rsp.error);

	if (!rsp.hasOwnProperty('dlist'))
	return deltio.clearCandi();

	let domList = deltio.browserDOM.children('.deltio');
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

		let x = (rsp.dlist[kodikos]).split(':');

		let katastasi = x[0];
		let ipografi = x[1];

		deltio.katastasiAlagi(dlt, $(this), katastasi, ipografi);
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
	deltio.katastasiAlagi(dlt, dom, 'ΕΠΙΚΥΡΩΜΕΝΟ');
	deltio.candiTabsShow();

	return deltio;
};

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
	deltio.katastasiAlagi(dlt, dom, 'ΚΥΡΩΜΕΝΟ');
	deltio.candiTabsShow();

	return deltio;
};

///////////////////////////////////////////////////////////////////////////////@

// Η function "katastasiAlagi" δέχεται ως παραμέτρους ένα δελτίο, το DOM
// element του δελτίου, την κατάσταση του δελτίου (στα ελληνικά), και
// τον κωδικό υπογραφής για τον υπάλληλο που τρέχει την εφαρμογή. Θέτει
// την κατάσταση του δελτίου και την ένδειξη υπογράφοντος, διαμορφώνοντας
// ανάλογα τα αντίστοιχα DOM elements του δελτίου.

deltio.katastasiAlagi = (dlt, dom, katastasi, ipografi) => {
	dlt.katastasiSet(katastasi);

	let katastasiEnglish = letrak.deltio.katastasi2english(katastasi);

	if (!katastasiEnglish)
	katastasiEnglish = '';

	let titlos = deltio.katastasiTitle[katastasi];

	if (!titlos)
	titlos = 'Προβληματική κατάσταση δελτίου';

	let simvolo = deltio.minima['deltioKatastasi' + katastasi + 'Symbol'];

	if (!simvolo)
	simvolo = '&quest;';

	dom.children('.deltioKatastasi').
	removeClass('letrak-deltioKatastasiEKREMES').
	removeClass('letrak-deltioKatastasiANIPOGRAFO').
	removeClass('letrak-deltioKatastasiKIROMENO').
	removeClass('letrak-deltioKatastasiEPIKIROMENO').
	addClass('letrak-deltioKatastasi' + katastasiEnglish).
	attr('title', titlos).
	html(simvolo);

	deltio.ipografiEndixiAlagi(dom, ipografi);

	return deltio;
};

deltio.ipografiEndixiAlagi = function(dom, ipografi) {
	// Αφαιρούμε τυχόν ένδειξη υπογράφοντος για τον υπάλληλο
	// που τρέχει την εφαρμογή.

	dom.children('.deltioIpografi').remove();

	if (!ipografi)
	return deltio;

	// Προσθέτουμε τυχόν ένδειξη υπογραφής που να αφορά τον
	// υπάλληλο που τρέχει την εφαρμογή.

	switch (parseInt(ipografi)) {
	case 1:	// ο υπάλληλος/χρήστης έχει σειρά να κυρώσει
	case 2:	// ο υπάλληλος/χρήστης έχει ήδη κυρώσει
	case 3:	// ο υπάλληλος/χρήστης θα πρέπει να κυρώσει αργότερα
		dom.append($('<div>').
		addClass('deltioIpografi').
		addClass('deltioIpografi' + ipografi).
		attr('title', deltio.endixiIpografiTitle[ipografi]).
		html('&bull;'));
	}

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
			'my': 'left+150 top+85',
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
	default:
		imerominia = new Date();
		break;
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

	let deltioDOM;
	let amolimeno;

	if (opts.hasOwnProperty('deltioDOM')) {
		deltioDOM = opts.deltioDOM;
		amolimeno = true;
	}

	else {
		deltioDOM = $('.deltioCandi').first();
		amolimeno = false;
	}

	if (deltioDOM.length !== 1)
	return pnd.fyiError('Δεν επιλέξατε παρουσιολόγιο προς επεξεργασία');

	let x = deltioDOM.data('deltio');

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
	self.LETRAK.deltioDOM = deltioDOM;
	self.LETRAK.klonos = opts.klonos;
	self.LETRAK.ananeosi = deltio.ananeosi;

	// Αν έχουμε ήδη διαχειριστεί τα δεδομένα προσωπικού, τότε προχωρούμε
	// άμεσα στο άνοιγμα της σελίδας επεξεργασίας δελτίου.

	if (!deltio.hasOwnProperty('ipiresiaList'))
	deltio.erpotaProcess();

	deltio.prosopaOpen(kodikos, amolimeno);
	return deltio;
};

///////////////////////////////////////////////////////////////////////////////@

deltio.diafores = (e) => {
	e.stopPropagation();

	let trexon = deltio.candiGet();

	if (!trexon)
	return;

	LETRAK.trexon = trexon;
	deltio.prosopaWindows.push(window.open('../diafores', '_blank'));
};

///////////////////////////////////////////////////////////////////////////////@

// Διατηρούμε array με όλα τα ξεχωριστά παράθυρα επεξεργασίας δελτίων που
// έχει ανοίγει ο χρήστης κάνοντας κλικ στον κωδικό του δελτίου.

deltio.prosopaWindows = [];

// Κατά το κλείσιμο της αρχικής σελίδας φροντίζουμε να κλείσουμε πρώτα όλα
// τα ξεχωριστά παράθυρα που ενδεχομένως έχει ανοίξει ο χρήστης.

$(window).
on('beforeunload', () => {
	while (deltio.prosopaWindows.length)
	deltio.prosopaWindows.pop().close();
});

// Η function "prosopaOpen" ανοίγει νέα καρτέλα ή νέο παράθυρο επεξεργασίας
// του επιλεγμένου δελτίου. Η συνήθης διαδικασία είναι ο χρήστης να κάνει
// κλικ κάπου στη γραμμή του δελτίου οπότε καθιστά το συγκεκριμένο δελτίο
// υποψήφιο προς επεξεργασία· κατόπιν μπορεί να κάνει κλικ στο πλήκτρο
// επεξεργασίας δελτίου οπότε το πρόγραμμα ανοίγει νέα καρτέλα επεξεργασίας
// του συγκεκριμένου δελτίου. Εναλλακτικά ο χρήστης μπορεί να κάνει κλικ
// στον κωδικό του δελτίου (στο αριστερό μέρος της γραμμής δελτίου), οπότε
// το πρόγραμμα ανοίγει νέο παράθυρο επεξεργασίας του συγκεκριμένου δελτίου.

deltio.prosopaOpen = (kodikos, amolimeno) => {
	let url = '../prosopa?deltio=' + kodikos;

	// Αν δεν έχει δοθεί δεύτερη παράμετρος, τότε ανοίγει νέα καρτέλα
	// επεξεργασίας δελτίου.

	if (!amolimeno) {
		deltio.prosopaWindows.push(window.open(url, '_blank'));
		return deltio;
	}

	// Αλλιώς ανοίγει νέο παράθυρο επεξεργασίας δελτίου, οπότε
	// μεριμνούμε, έστω υποτυπωδώς, για τη χωροταξία των παραθύρων.

	let n = (deltio.prosopaWindows.length % 4) + 1;

	let specs = '';
	specs += 'width=1500,';
	specs += 'height=600,';
	specs += 'top=' + (n * 100) + ',';
	specs += 'left=' + (n * 100);

	deltio.prosopaWindows.push(window.open(url, kodikos, specs));
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

	deltio.clearCandi();

	if (count)
	deltio.ananeosi();

	return deltio;
};

///////////////////////////////////////////////////////////////////////////////@

deltio.erpotaProcess = () => {
	if (!self.LETRAK.hasOwnProperty('erpotaData'))
	return deltio.fyiError('Αδυναμία λήψης στοιχείων προσωπικού');

	if (!self.LETRAK.erpotaData.hasOwnProperty('error'))
	return deltio.fyiError('Αστοχία λήψης στοιχείων προσωπικού');

	if (self.LETRAK.erpotaData.error)
	return deltio.fyiError(self.LETRAK.erpotaData.error);

	deltio.ipiresiaArray = self.LETRAK.erpotaData.ipiresia;
	deltio.ipalilosArray = self.LETRAK.erpotaData.ipalilos;

	delete self.LETRAK.erpotaData;

	deltio.ipiresiaList = {};
	pnd.arrayWalk(deltio.ipiresiaArray, (v) => {
		deltio.ipiresiaList[v.k] = v.p;
	});

	deltio.ipalilosList = {};
	pnd.arrayWalk(deltio.ipalilosArray, (v) => {
		if (!v.k)
		return;

		v.oe = '';

		v.oe = pnd.strPush(v.oe, v.e);
		v.oe = pnd.strPush(v.oe, v.o);

		if (v.p)
		v.oe = pnd.strPush(v.oe, v.p.substr(0, 3));

		deltio.ipalilosList[v.k] = v;
	});

	self.LETRAK.ipiresiaList = deltio.ipiresiaList;
	self.LETRAK.ipalilosArray = deltio.ipalilosArray;
	self.LETRAK.ipalilosList = deltio.ipalilosList;

	return deltio;
};

///////////////////////////////////////////////////////////////////////////////@

letrak.deltio.prototype.domGet = function() {
	let kodikos = this.kodikosGet();
	let katastasiDOM;
	let prosapo = this.prosapoGet();
	let prosapoClass = 'deltioProsapo';

	switch (prosapo) {
	case php.defs.LETRAK_DELTIO_PROSAPO_PROSELEFSI:
		prosapoClass += ' deltioProsapoProselefsi';
		break;
	case php.defs.LETRAK_DELTIO_PROSAPO_APOXORISI:
		prosapoClass += ' deltioProsapoApoxorisi';
		break;
	default:
		prosapo = 'ΠΡΟΤΥΠΟ';
		prosapoClass += ' deltioProsapoProtipo';
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
	text(prosapo)).

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

deltio.isCandi = () => {
	let candi = $('.deltioCandi').first();

	if (!candi.length)
	return false;

	candi = candi.data('deltio');

	// Αν φαίνεται να υπάρχει τρέχον δελτίο, και είναι πράγματι δελτίο,
	// και μπορώ να πάρω τον κωδικό του, και ο κωδικός αυτός δεν είναι
	// ακαθόριστος ή μηδενικός, τότε θεωρώ ότι υπάρχει πράγματι τρέχον
	// δελτίο και σ' αυτήν την περίπτωση το επιστρέφω.

	try {
		if (candi.kodikosGet())
		return candi;
	}

	// Αν κάτι πήγε στραβά στη διαδικασία του παραπάνω ελέγχου, τότε
	// θεωρώ ότι δεν υπάρχει τρέχον δελτίο.

	catch (e) {
		return false;
	}

	// Η διαδικασία ελέγχου περατώθηκε χωρίς προβλήματα, αλλά το
	// αποτέλεσμα του ελέγχου ήταν αρνητικό.

	return false;
};

deltio.candiGet = () => {
	let candi = deltio.isCandi();

	if (candi)
	return candi;

	pnd.fyiError('Ακαθόριστο τρέχον παρουσιολόγιο');
	return undefined;
};

///////////////////////////////////////////////////////////////////////////////@

deltio.dlistCreate = () => {
	let dlist = [];

	deltio.browserDOM.children('.deltio').each(function() {
		let deltio = $(this).data('deltio');

		if (!deltio)
		return;

		deltio = deltio.kodikosGet();

		if (!deltio)
		return;

		dlist.push(deltio);
	});

	return dlist;
};

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
