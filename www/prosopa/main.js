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
//
// Η επεξεργασία του παρουσιολογίου αφορά τόσο στα δεδομένα όσο και στα
// μεταδεδομένα του παρουσιολογίου. Πιο συγκεκριμένα, ως δεδομένα εννοούμε
// αυτή καθαυτή τη βασική πληροφορία που μεταφέρει ένα παρουσιολόγιο, δηλαδή
// ποιοι υπάλληλοι προσήλθαν ή απεχώρησαν από την εργασία και πότε. Τα λοιπά
// στοιχεία του παρουσιολογίου, δηλαδή η ημερομηνία, το είδος, οι υπογραφές
// κλπ, αποτελούν τα μεταδεδομένα του παρουσιολογίου.
// @DESCRIPTION END
//
// @HISTORY BEGIN
// Updated: 2021-05-28
// Updated: 2021-05-27
// Updated: 2021-05-22
// Updated: 2021-05-21
// Updated: 2021-05-13
// Updated: 2021-05-10
// Updated: 2021-03-08
// Updated: 2021-03-02
// Updated: 2021-02-25
// Updated: 2021-02-01
// Updated: 2020-08-08
// Updated: 2020-07-14
// Updated: 2020-07-05
// Updated: 2020-07-01
// Updated: 2020-06-27
// Updated: 2020-06-26
// Updated: 2020-06-25
// Updated: 2020-06-20
// Updated: 2020-06-14
// Updated: 2020-06-08
// Updated: 2020-06-06
// Updated: 2020-06-04
// Updated: 2020-05-23
// Updated: 2020-05-20
// Updated: 2020-05-19
// Updated: 2020-05-18
// Updated: 2020-05-17
// Updated: 2020-05-16
// Updated: 2020-05-13
// Updated: 2020-05-11
// Updated: 2020-05-09
// Updated: 2020-05-08
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

const prosopa = {};
const ektiposi =
require('./ektiposi.js')(pnd, letrak, prosopa);

prosopa.minima = {
	'ipografiCheckSymbol': '&#x2714;',

	'deltioKatastasiΕΚΚΡΕΜΕΣSymbol': '&#x25D4;',
	'deltioKatastasiΑΝΥΠΟΓΡΑΦΟSymbol': '&#x25D1;',
	'deltioKatastasiΚΥΡΩΜΕΝΟSymbol': '&#x25D5;',
	'deltioKatastasiΕΠΙΚΥΡΩΜΕΝΟSymbol': '&#x2714;',

	'deltioAkathoristo': 'Ακαθόριστο παρουσιολόγιο',
	'ipografesTabLabel': 'Υπογραφές',

	'deltioAnaneosiTabLabel': 'Ανανέωση περιεχομένου',
	'ipografiAnaneosiTabLabel': 'Ανανέωση υπογραφών',

	'ipografiInsertTabLabel': 'Προσθήκη',
	'ipografiInsertTabTitle': 'Προσθήκη υπογράφοντος υπαλλήλου',

	'ipografiEditTabLabel': 'Επεξεργασία',
	'ipografiEditTabTitle': 'Επεξεργασία υπογράφοντος υπαλλήλου',

	'ipografiDeleteTabLabel': 'Απαλοιφή',
	'ipografiDeleteTabTitle': 'Απαλοιφή υπογράφοντος υπαλλήλου',

	'ipografiKirosiTabLabel': 'Κύρωση',
	'ipografiKirosiTabTitle': 'Κύρωση στοιχείων παρουσιολογίου',

	'ipografiAkirosiTabLabel': 'Αναίρεση',
	'ipografiAkirosiTabTitle': 'Αναίρεση υπογραφής',

	'ergaliaTabLabel': 'Επεξεργασία',
	'winpakTabLabel': 'WIN-PAK',
	'katagrafiKatharismos': 'Καθαρισμός',
	'katagrafiOrario': 'Από ωράριο',
	'katagrafiNoEvent': 'Δεν εντοπίστηκαν καταγεγραμμένα συμβάντα',

	'filtraTabLabel': 'Φίλτρα',
};

// Αν η σελίδα έχει εκκινήσει από τη σελίδα διαχείρισης παρουσιολογίων, τότε
// θέτω το "goniki" να δείχνει σε μεταβλητές που έχουν οριστεί στην εν λόγω
// σελίδα προκειμένου να μπορούμε να επιτελέσουμε διάφορες ενέργειες και
// σε αυτή τη σελίδα ως γονική.

prosopa.goniki = {
	'deltio': undefined,
	'deltioDOM': undefined,
	'klonos': false,
	'ipiresiaList': {},
	'ipalilosArray': [],
};

(() => {
	if (!self.opener)
	return prosopa;

	if (!self.opener.hasOwnProperty('LETRAK'))
	return prosopa;

	if (!self.opener.LETRAK.deltio)
	return prosopa;

	if (!self.opener.LETRAK.deltioDOM)
	return prosopa;

	prosopa.goniki = self.opener.LETRAK;

	return prosopa;
})();

pnd.domInit(() => {
	pnd.
	toolbarSetup().
	fyiSetup().
	ofelimoSetup().
	ribbonSetup().
	domSetup().
	domFixup();

	prosopa.
	selidaSetup();

	window.onbeforeprint = ektiposi.before;
	window.onafterprint = ektiposi.after;
});

///////////////////////////////////////////////////////////////////////////////@

prosopa.selidaSetup = () => {
	ektiposi.setup();
	letrak.
	toolbarTitlosSetup('<b>Επεξεργασία Παρουσιολογίου</b>').
	toolbarXristisSetup().
	ribbonCopyrightSetup();

	// Ο κωδικός του προς επεξεργασία παρουσιολογίου δίνεται ως POST
	// ή GET παράμετρος με το όνομα "deltio".

	prosopa.deltioKodikos = php.requestGet('deltio');

	if (!prosopa.deltioKodikos)
	return prosopa.fyiError(prosopa.minima.deltioAkathoristo);

	letrak.
	toolbarTitlosSet('Παρουσιολόγιο <b>' + prosopa.deltioKodikos + '</b>');

	document.title = prosopa.deltioKodikos;

	if (letrak.noXristis())
	return prosopa.fyiError('Διαπιστώθηκε ανώνυμη χρήση');

	if (prosopa.goniki.deltio &&
		(prosopa.goniki.deltio.kodikosGet() != prosopa.deltioKodikos))
	return prosopa.fyiError('Πρόβλημα σύνδεσης με την γονική σελίδα');

	pnd.
	keepAlive('../mnt/pandora');

	///////////////////////////////////////////////////////////////////////@

	pnd.ofelimoDOM.

	append(prosopa.ipografesAreaDOM = $('<div>').
	addClass('ipografesArea')).

	append(prosopa.deltioAreaDOM = $('<div>').
	addClass('deltioArea')).

	append(prosopa.browserDOM = $('<div>').
	addClass('browser').
	addClass('browserEmfanesOrio'));

	prosopa.
	ipografesSetup().
	prosopaSetup().
	filtraSetup().
	ergaliaSetup().
	editorSetup().
	protipoSetup();

	pnd.toolbarLeftDOM.
	append(prosopa.winpakTabDOM = letrak.tabDOM().
	addClass('prosopaPliktro').
	addClass('prosopaPliktroUpdate').
	text(prosopa.minima.winpakTabLabel).
	on('click', (e) => prosopa.winpak(e)));

	prosopa.ananeosi();
	return prosopa;
};

prosopa.ananeosi = (e) => {
	if (e)
	e.stopPropagation();

	let target = prosopa.parousiaEditorDOM.data('parousia');

	if (target)
	target = target.ipalilosGet();

	pnd.fyiMessage('Αναζήτηση στοιχείων παρουσιολογίου…');
	$.post({
		'url': 'prosopa.php',
		'dataType': 'json',
		'data': {
			'deltio': prosopa.deltioKodikos,
		},
		'success': (rsp) => {
			if (rsp.error)
			return pnd.fyiError(rsp.error);

			prosopa.
			fyiClear().
			deltioProcess(rsp.deltio).
			ipografesProcess(rsp.ipografes).
			prosopaProcess(rsp.prosopa, target);

			// Η property "prosopa.goniki.klonos" είναι true εφόσον
			// η παρούσα παρουσίαση προσώπων έχει προκύψει αμέσως
			// μετά τον κλωνισμό. Αν πρέπει κάτι να γίνει, μπορούμε
			// να ελέγξουμε την εν λόγω property και να προβούμε
			// στις επιθυμητές ενέργειες. Ωστόσο, μετά είναι καλό
			// να διαγράψουμε την εν λόγω property, εκτός και αν
			// υπάρχει περίπτωση να την χρειαστούμε και σε άλλες,
			// επόμενες ενέργειες.
			//
			// Επί του παρόντος την διαγράφουμε αμέσως τώρα, καθώς
			// δεν φαίνεται να χρειάζεται να κάνουμε κάτι ιδιαίτερο
			// σε νεότευκτα παρουσιολόγια που έχουν προκύψει από
			// κλωνισμό.

			delete prosopa.goniki.klonos;
		},
		'error': (err) => {
			pnd.fyiError('Αδυναμία λήψης στοιχείων παρουσιολογίου');
			console.error(err);
		},
	});

	return prosopa;
};

prosopa.deltioProcess = (deltio) => {
	prosopa.deltio = new letrak.deltio(deltio);

	prosopa.deltioAreaDOM.
	empty().
	append(prosopa.deltio.domGet());

	prosopa.editorDeltioKodikosDOM.val(prosopa.deltio.kodikosGet());
	prosopa.editorDeltioPerigrafiDOM.val(prosopa.deltio.perigrafiGet());
	prosopa.editorDeltioImerominiaDOM.
	val(pnd.imerominia(prosopa.deltio.imerominiaGet()));
	prosopa.deltioProsapoProcess();
	prosopa.deltioIpiresiaProcess();

	return prosopa;
};

prosopa.deltioProsapoProcess = () => {
	prosopa.editorDeltioProsapoDOM.
	addClass('deltioProsapo').
	removeClass('deltioProsapoProselefsi').
	removeClass('deltioProsapoApoxorisi');

	let prosapo = prosopa.deltio.prosapoGet();

	switch (prosapo) {
	case php.defs.LETRAK_DELTIO_PROSAPO_PROSELEFSI:
		prosopa.editorDeltioProsapoDOM.
		addClass('deltioProsapoProselefsi');
		break;
	case php.defs.LETRAK_DELTIO_PROSAPO_APOXORISI:
		prosopa.editorDeltioProsapoDOM.
		addClass('deltioProsapoApoxorisi');
		$('#deltioImerisio').css('display', 'block');
		break;
	default:
		prosapo = php.defs.LETRAK_DELTIO_PROSAPO_PROTIPO;
		break;
	}

	prosopa.editorDeltioProsapoDOM.text(prosapo);
	prosopa.editorMeraoraLabelDOM.text(prosapo);

	return prosopa;
};

prosopa.deltioIpiresiaProcess = () => {
	prosopa.editorDeltioIpiresiaDOM.val('');
	prosopa.editorDeltioDiefDOM.val('');
	prosopa.editorDeltioDiefSectionDOM.css('display', 'none');

	let ipiresia = prosopa.deltio.ipiresiaGet();

	if (!ipiresia)
	return prosopa;

	let ipdesc = prosopa.goniki.ipiresiaList[ipiresia];
	prosopa.editorDeltioIpiresiaDOM.val(ipdesc);

	if (ipiresia.length < 4)
	return prosopa;

	ipdesc = prosopa.goniki.ipiresiaList[ipiresia.substr(0, 3)];
	prosopa.editorDeltioDiefDOM.val(ipdesc);
	prosopa.editorDeltioDiefSectionDOM.css('display', '');

	return prosopa;
};

prosopa.ipografesProcess = (ipografes) => {
	if (!ipografes)
	return prosopa;

	prosopa.ipografesDOM.empty();
	pnd.arrayWalk(ipografes, (v) => {
		v = new letrak.ipografi(v);
		prosopa.ipografesDOM.
		append(v.domGet());
	});

	prosopa.prosvasiRefresh();
	return prosopa;
};

prosopa.prosopaProcess = (parousia, target) => {
	prosopa.browserDOM.empty();

	// Αν υπάρχει επιλεγμένος υπάλληλος, θα κρατήσουμε το αντίστοιχο
	// DOM element προκειμένου να κάνουμε ασφαλή ανανέωση στη φόρμα
	// λεπτομερειών.

	let targetDOM = undefined;

	pnd.arrayWalk(parousia, (v, k) => {
		let dom;

		v = new letrak.parousia(v);
		prosopa.browserDOM.
		append(dom = v.domGet(k + 1));

		if (v.ipalilosGet() == target)
		targetDOM = dom.addClass('parousiaTarget');
	});

	// Εφόσον υπάρχει επιλεγμένος υπάλληλος και η φόρμα λεπτομερειών
	// είναι ανοικτή, κάνουμε κλικ στον επιλεγμένο υπάλληλο προκειμένου
	// να ανανεωθούν με ασφάλεια τα στοιχεία της φόρμας λεπτομερειών.

	if (targetDOM && prosopa.parousiaEditorDOM.dialog('isOpen'))
	targetDOM.trigger('click');

	return prosopa;
};

///////////////////////////////////////////////////////////////////////////////@

prosopa.ipografesSetup = () => {
	prosopa.ipografesAreaDOM.

	append(prosopa.ipografesPanelDOM = $('<div>').
	addClass('ipografesPanel').

	append($('<input>').
	attr({
		'type': 'button',
	}).
	addClass('letrak-formaPliktro').
	val(prosopa.minima.ipografiAnaneosiTabLabel).
	on('click', (e) => prosopa.ipografiAnaneosi(e))).

	append(prosopa.ipografiKirosiTabDOM = $('<input>').
	attr({
		'type': 'button',
		'title': prosopa.minima.ipografiKirosiTabTitle,
	}).
	addClass('letrak-formaPliktro').
	addClass('praxiPliktro').
	val(prosopa.minima.ipografiKirosiTabLabel).
	on('click', (e) => prosopa.ipografiPraxi(e, 'kirosi'))).

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
	}));

	pnd.toolbarLeftDOM.

	append(prosopa.ipografesTabDOM = letrak.tabDOM().
	addClass('tabActive').
	text(prosopa.minima.ipografesTabLabel).
	on('click', function(e) {
		e.stopPropagation();

		if ($(this).hasClass('tabActive')) {
			$(this).removeClass('tabActive');
			prosopa.ipografesAreaDOM.addClass('ipografesAreaHidden');
			prosopa.browserDOM.removeClass('browserEmfanesOrio');
		}

		else {
			$(this).addClass('tabActive');
			prosopa.ipografesAreaDOM.removeClass('ipografesAreaHidden');
			prosopa.browserDOM.addClass('browserEmfanesOrio');
		}
	})).

	append(letrak.tabDOM().
	text(prosopa.minima.deltioAnaneosiTabLabel).
	on('click', (e) => prosopa.ananeosi(e)));

	return prosopa;
};

///////////////////////////////////////////////////////////////////////////////@

prosopa.prosvasiRefresh = () => {
	return prosopa.
	deltioKatastasiRefresh().
	ipografiUpdateTabsRefresh().
	ipografiPraxiTabsRefresh().
	prosopaUpdateTabsRefresh().
	editorProsvasiRefresh();
};

prosopa.deltioKatastasiRefresh = () => {
	let katastasi = prosopa.deltio.katastasiGet();

	prosopa.deltioKatastasiDOM.
	removeClass('letrak-deltioKatastasiEKREMES').
	removeClass('letrak-deltioKatastasiANIPOGRAFO').
	removeClass('letrak-deltioKatastasiKIROMENO').
	removeClass('letrak-deltioKatastasiEPIKIROMENO').
	empty();

	if (prosopa.goniki.deltio)
	prosopa.goniki.ananeosi();

	if (!katastasi)
	return prosopa;

	let katastasiEnglish = letrak.deltio.katastasiEnglishMap[katastasi];
	prosopa.deltioKatastasiDOM.
	addClass('letrak-deltioKatastasi' + katastasiEnglish).
	html(prosopa.minima['deltioKatastasi' + katastasi + 'Symbol']);

	return prosopa;
};

prosopa.ipografiUpdateTabsRefresh = () => {
	let prosvasi = false;

	if (prosopa.deltio.isAnikto()) {
		let ipiresia = prosopa.deltio.ipiresiaGet();
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

	if (prosopa.deltio.isKlisto())
	return prosopa;

	let xristis = letrak.xristisIpalilosGet();
	let alosprin = false;
	let kirosi = false;
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
		kirosi = true;
	});

	if (kirosi)
	prosopa.ipografiKirosiTabDOM.
	css('display', '');

	if (akirosi)
	prosopa.ipografiAkirosiTabDOM.
	css('display', '');

	return prosopa;
};

///////////////////////////////////////////////////////////////////////////////@

// Η function "trexonIpografonGet" επιστρέφει τον τρέχοντα υπογράφοντα,
// δηλαδή την πρώτη εγγραφή υπογραφής που δεν έχει συμπληρωμένο το check
// υπογραφής.

prosopa.trexonIpografonGet = () => {
	let ipografi;

	prosopa.ipografesDOM.
	children('.ipografi').
	each(function() {
		let x = $(this).data('ipografi');

		if (!x)
		return;

		if (!x.checkokGet())
		return;

		ipografi = x;
		return false;
	});

	return ipografi;
};

// Η function "protosIpografonGet" επιστρέφει τον πρώτο υπογράφοντα, είτε
// αυτός έχει υπογράψει ήδη, είτε όχι.

prosopa.protosIpografonGet = () => {
	let dom = prosopa.ipografesDOM.
	children('.ipografi').
	first();

	if (dom.length !== 1)
	return undefined;

	return dom.data('ipografi');
};

///////////////////////////////////////////////////////////////////////////////@

// Η function "xristisIsIpografon" επιστρέφει την εγγραφή υπογραφής που αφορά
// τον ίδιο τον χρήστη, εφόσον αυτός συμπεριλαμβάνεται στους υπογράφοντες,
// αλλιώς επιστρέφει undefined.

prosopa.xristisIsIpografon = () => {
	if (letrak.noXristis())
	return false;

	let xristis = letrak.xristisIpalilosGet();
	let ipografi;

	prosopa.ipografesDOM.
	children('.ipografi').
	each(function() {
		let x = $(this).data('ipografi');

		if (!x)
		return;

		if (x.armodiosGet() !== xristis)
		return;

		ipografi = x;
		return false;
	});

	return ipografi;
};

prosopa.xristisOxiIpografon = () => {
	return !prosopa.xristisIsIpografon();
};

prosopa.xristisIsProtosIpografon = () => {
	let xristisIpografi = prosopa.xristisIsIpografon();

	if (!xristisIpografi)
	return false;

	let protosIpografon = prosopa.protosIpografonGet();

	if (!protosIpografon)
	return false;

	if (xristisIpografi != protosIpografon)
	return false;

	return true;
};

prosopa.xristisOxiProtosIpografon = () => !prosopa.xristisIsProtosIpografon();

prosopa.xristisIsTrexonIpografon = () => {
	let xristisIpografi = prosopa.xristisIsIpografon();

	if (!xristisIpografi)
	return false;

	let trexonIpografon = prosopa.trexonIpografonGet();

	if (!trexonIpografon)
	return false;

	if (xristisIpografi != trexonIpografon)
	return false;

	return true;
};

prosopa.xristisOxiTrexonIpografon = () => !prosopa.xristisIsTrexonIpografon();

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
			'deltio': prosopa.deltioKodikos,
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

	forma.titlosDOM.
	on('change', function() {
		let titlos = $(this).val();

		if (titlos.match(/^ΟΠΔ /i))
		titlos = titlos.replace(/.../, 'Ο προϊστάμενος Δ/νσης');

		else if (titlos.match(/^ΗΠΔ /i))
		titlos = titlos.replace(/.../, 'Η προϊσταμένη Δ/νσης');

		else if (titlos.match(/^ΟΑΔ /i))
		titlos = titlos.replace(/.../, 'Ο αναπληρωτής προϊστάμενος Δ/νσης');

		else if (titlos.match(/^ΗΑΔ /i))
		titlos = titlos.replace(/.../, 'Η αναπληρώτρια προϊσταμένη Δ/νσης');

		else if (titlos.match(/^ΟΠΤ /i))
		titlos = titlos.replace(/.../, 'Ο προϊστάμενος Τμ.');

		else if (titlos.match(/^ΗΠΤ /i))
		titlos = titlos.replace(/.../, 'Η προϊσταμένη Τμ.');

		else if (titlos.match(/^ΟΑΤ /i))
		titlos = titlos.replace(/.../, 'Ο αναπληρωτής προϊστάμενος Τμ.');

		else if (titlos.match(/^ΗΑΤ /i))
		titlos = titlos.replace(/.../, 'Η αναπληρώτρια προϊσταμένη Τμ.');

		else if (titlos.match(/^ΟΣ *$/i))
		titlos = 'Ο συντάκτης';

		else if (titlos.match(/^ΗΣ *$/i))
		titlos = 'Η συντάκτρια';

		$(this).val(titlos);
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
			'deltio': prosopa.deltioKodikos,
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

	prosopa.deltio.katastasi = letrak.deltio.katastasiEkremes;

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

	prosopa.prosvasiRefresh();
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
			'deltio': prosopa.deltioKodikos,
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
			'deltio': prosopa.deltioKodikos,
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
			'deltio': prosopa.deltioKodikos,
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

prosopa.ergaliaSetup = () => {
	pnd.toolbarLeftDOM.

	append(prosopa.ergaliaTabDOM = letrak.tabDOM().
	addClass('prosopaPliktro').
	text(prosopa.minima.ergaliaTabLabel).
	on('click', function(e) {
		e.stopPropagation();

		if ($(this).hasClass('tabActive'))
		prosopa.ergaliaDOM.dialog('close');

		else
		prosopa.ergaliaDOM.dialog('open');
	}));

	$('#prosopoInsert').
	on('click', (e) => {
		prosopa.parousiaTargetClear();
		prosopa.parousiaEdit(e);
	});

	$('#prosopaDiagrafi').
	on('click', (e) => {
		let dialogDOM = $('<div>').
		attr('title', 'Διαγραφή υπαλλήλων').
		append($('<div>').
		html('Να διαγραφούν όλοι οι υπάλληλοι του παρουσιολογίου;')).
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
					prosopa.prosopaDiagrafi();
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
	});

	prosopa.protipoMetatropiDOM = $('#protipoMetatropi').
	on('click', (e) => prosopa.protipoMetatropi(e));

	$('#deltioPlires').
	on('click', (e) => ektiposi.deltioPlires(e));

	$('#deltioAponton').
	on('click', (e) => ektiposi.deltioAponton(e));

	$('#deltioImerisio').
	on('click', (e) => ektiposi.deltioImerisio(e));

	///////////////////////////////////////////////////////////////////////@

	prosopa.orariaDiagrafiOrarioDOM = $('#orariaDiagrafiOrario');
	prosopa.orariaDiagrafiFormaDOM = $('#orariaDiagrafiForma').
	on('submit', (e) => prosopa.orariaDiagrafi(e)).
	dialog({
		'title': 'Διαγραφή ωραρίων',
		'autoOpen': false,
		'position': {
			'my': 'left top',
			'at': 'left+120 top+145',
		},
		'resizable': false,
		'height': 'auto',
		'width': '460px',
		'modal': true,
		'open': () => prosopa.orariaDiagrafiOrarioDOM.val(''),
	});

	$('#orariaDiagrafiPanel').
	find('input').
	addClass('letrak-formaPliktro').
	addClass('protipoPliktro');

	$('#orariaDiagrafiDiagrafiPliktro').
	on('click', (e) => prosopa.orariaDiagrafi(e));

	$('#orariaDiagrafiAkiroPliktro').
	on('click', (e) => {
		e.stopPropagation();
		prosopa.orariaDiagrafiFormaDOM.dialog('close');
	});

	$('#orariaDiagrafi').
	attr('title', 'Διαγραφή ωραρίων').
	on('click', (e) => prosopa.orariaDiagrafiFormaDOM.dialog('open'));

	///////////////////////////////////////////////////////////////////////@

	prosopa.ergaliaDOM = $('#ergalia').
	dialog({
		'resizable': false,
		'title': 'Eπεξεργασία',
		'width': '220px',
		'height': 'auto',
		'position': {
			'my': 'left top',
			'at': 'left+290 top+93',
		},
		'open': () => prosopa.ergaliaShow(),
		'close': () => prosopa.ergaliaHide(),
	}).
	dialog('close');

	return prosopa;
};

prosopa.ergaliaShow = () => {
	prosopa.ergaliaTabDOM.addClass('tabActive');
	return prosopa;
};

prosopa.ergaliaHide = () => {
	prosopa.ergaliaTabDOM.removeClass('tabActive');
	return prosopa;
};

prosopa.prosopaDiagrafi = () => {
	$.post({
		'url': 'prosopaDiagrafi.php',
		'dataType': 'text',
		'data': {
			'deltio': prosopa.deltioKodikos,
		},
		'success': (rsp) => prosopa.editorAlagiPost(rsp),
		'error': (err) => {
			pnd.fyiError('Σφάλμα διαγραφής υπαλλήλων');
			console.error(err);
		},
	});
};

prosopa.orariaDiagrafi = (e) => {
	if (e)
	e.stopPropagation();

	let data = {
		'deltio': prosopa.deltioKodikos,
		'orario': prosopa.orariaDiagrafiOrarioDOM.val(),
	};

	let orario = new letrak.orario(data.orario);

	if (orario.oxiOrario())
	delete data.orario;

	$.post({
		'url': 'orariaDiagrafi.php',
		'dataType': 'text',
		'data': data,
		'success': (rsp) => {
			if (rsp)
			return prosopa.fyiError(rsp);

			prosopa.orariaDiagrafiFormaDOM.dialog('close');
			prosopa.ergaliaDOM.dialog('close');
			prosopa.ananeosi();
		},
		'error': (err) => {
			pnd.fyiError('Σφάλμα διαγραφής ωραρίων');
			console.error(err);
		},
	});

	return false;
};

///////////////////////////////////////////////////////////////////////////////@

prosopa.filtraSetup = () => {
	pnd.toolbarLeftDOM.

	append(prosopa.filtraTabDOM = letrak.tabDOM().
	addClass('prosopaPliktro').
	text(prosopa.minima.filtraTabLabel).
	on('click', function(e) {
		e.stopPropagation();

		if ($(this).hasClass('tabActive'))
		prosopa.filtraDOM.dialog('close');

		else
		prosopa.filtraDOM.dialog('open');
	}));

	prosopa.filtroApontesDOM = $('#filtroApontes').
	on('change', prosopa.filtroApontesEfarmogi);

	prosopa.filtroParontesDOM = $('#filtroParontes').
	on('change', prosopa.filtroParontesEfarmogi);

	prosopa.filtroTilergasiaDOM = $('#filtroTilergasia').
	on('change', prosopa.filtroTilergasiaEfarmogi);

	prosopa.filtroApantesDOM = $('#filtroApantes').
	prop('checked', true).
	on('change', prosopa.filtroApantesEfarmogi);

	prosopa.filtraDOM = $('#filtra').
	dialog({
		'resizable': false,
		'title': prosopa.minima.filtraTabLabel,
		'width': '164px',
		'height': 'auto',
		'position': {
			'my': 'left top',
			'at': 'left+98 top+92',
		},
		'open': () => prosopa.filtraShow(),
		'close': () => prosopa.filtraHide(),
	}).
	dialog('close');

	return prosopa;
};

prosopa.filtraShow = () => {
	prosopa.filtraTabDOM.addClass('tabActive');
	return prosopa;
};

prosopa.filtraHide = () => {
	prosopa.filtraTabDOM.removeClass('tabActive');
	return prosopa;
};

prosopa.filtroApontesEfarmogi = (e) => {
	e.stopPropagation();
	prosopa.filtroApantesDOM.prop('checked', false);
	prosopa.filtraEfarmogi();
	return prosopa;
};

prosopa.filtroParontesEfarmogi = (e) => {
	e.stopPropagation();
	prosopa.filtroApantesDOM.prop('checked', false);
	prosopa.filtraEfarmogi();
	return prosopa;
};

prosopa.filtroTilergasiaEfarmogi = (e) => {
	e.stopPropagation();
	prosopa.filtroApantesDOM.prop('checked', false);
	prosopa.filtraEfarmogi();
	return prosopa;
};

prosopa.filtroApantesEfarmogi = (e) => {
	e.stopPropagation();

	if (prosopa.filtroApantesDOM.prop('checked')) {
		prosopa.filtroApontesDOM.prop('checked', false);
		prosopa.filtroParontesDOM.prop('checked', false);
		prosopa.filtroTilergasiaDOM.prop('checked', false);
	}

	prosopa.filtraEfarmogi();
	return prosopa;
};

prosopa.filtraEfarmogi = () => {
	let ordinal = 0;

	prosopa.browserDOM.
	children('.parousia').
	each(function() {
		let parousia = $(this).data('parousia');

		if (!prosopa.filtraMatch(parousia))
		return $(this).css('display', 'none');

		ordinal++;
		$(this).children('.parousiaOrdinal').text(ordinal);
		$(this).css('display', '');
	});

	return prosopa;
};

prosopa.filtraMatch = function(parousia) {
	if (prosopa.filtroApantesDOM.prop('checked'))
	return true;

	switch (parousia.adidos) {
	case "ΤΗΛΕΡΓΑΣΙΑ":
		return prosopa.filtroTilergasiaDOM.prop('checked');
	}

	if (prosopa.filtroApontesMatch(parousia))
	return true;

	if (prosopa.filtroParontesMatch(parousia))
	return true;

	return false;
};

prosopa.filtroApontesMatch = (parousia) => {
	if (!prosopa.filtroApontesDOM.prop('checked'))
	return false;

	if (parousia.adidos)
	return true;

	if (parousia.meraora)
	return false;

	if (parousia.excuse)
	return false;

	return true;
};

prosopa.filtroParontesMatch = (parousia) => {
	if (!prosopa.filtroParontesDOM.prop('checked'))
	return false;

	if (parousia.meraora)
	return true;

	if (parousia.excuse)
	return true;

	return false;
};

///////////////////////////////////////////////////////////////////////////////@

prosopa.prosopaSetup = () => {
	prosopa.browserDOM.
	on('click', '.parousia', function(e) {
		prosopa.parousiaTargetClear();
		$(this).addClass('parousiaTarget');
		prosopa.parousiaEdit(e, $(this).data('parousia'));
	});

	return prosopa;
};

prosopa.parousiaTargetClear = () => {
	$('.parousiaTarget').removeClass('parousiaTarget');
	return prosopa;
};

prosopa.prosopaUpdateTabsRefresh = () => {
	let update = prosopa.prosopaUpdateAllow();

	if (update) {
		pnd.toolbarLeftDOM.
		children('.prosopaPliktroUpdate').
		css('display', 'inline-block');

		prosopa.ergaliaDOM.
		children('.prosopaPliktroUpdate').
		css('display', 'block');

		// Ειδικά για το πλήκτρο μετατροπής σε πρότυπο απαιτείται
		// επιπλέον πρόσβαση διαχειριστή.

		if (!prosopa.deltio ||
		letrak.prosvasiOxiAdmin(prosopa.deltio.ipiresiaGet()))
		prosopa.protipoMetatropiDOM.css('display', 'none');

		return prosopa;
	}

	pnd.toolbarLeftDOM.
	children('.prosopaPliktroUpdate').
	css('display', 'none');

	prosopa.ergaliaDOM.
	children('.prosopaPliktroUpdate').
	css('display', 'none');

	prosopa.ergaliaDOM.dialog('close');
	return prosopa;
}

// Η function "prosopaUpdateAllow" ελέγχει αν ο χρήστης έχει πρόσβαση να
// αλλοιώσει καθ' οιονδήποτε τρόπο το περιεχόμενο του παρουσιολογίου.
// Όμως, ο μόνος υπάλληλος που έχει δικαίωμα αλλοίωσης του περιεχομένου
// ενός παρουσιολογίου είναι ο πρώτος υπογράφων. Συνεπώς η function ελέγχει
// αν ο χρήστης είναι ο πρώτος υπογράφων, ωστόσο βασική προϋπόθεση είναι το
// παρουσιολόγιο να μην έχει κυρωθεί.

prosopa.prosopaUpdateAllow = () => {
	if (!prosopa.hasOwnProperty('deltio'))
	return false;

	let deltio = prosopa.deltio;

	if (!deltio)
	return false;

	if (!(deltio instanceof letrak.deltio))
	return false;

	if (deltio.isKlisto())
	return false;

	let ipografi = prosopa.protosIpografonGet();

	if (!ipografi)
	return false;

	if (ipografi.checkokGet())
	return false;

	if (prosopa.xristisOxiProtosIpografon())
	return false;

	return true;
};

///////////////////////////////////////////////////////////////////////////////@

prosopa.editorSetup = () => {
	prosopa.alagiOkIndicatorDOM = $('#peAlagiOkIndicator');
	prosopa.ipalilosZoomDOM = $('#peIpalilosZoom').
	on('click', '.ipalilosZoom', function(e) {
		prosopa.editorIpalilosKodikosDOM.
		val($(this).children('.ipalilosZoomKodikos').text());

		prosopa.editorIpalilosOnomateponimoDOM.
		val($(this).children('.ipalilosZoomOnomateponimo').text());
	});

	prosopa.parousiaEditorDOM = $('#parousiaEditor').
	on('submit', (e) => prosopa.editorIpovoli(e));

	prosopa.parousiaEditorDOM.find('.peDeltioPedio').
	attr('disabled', true);

	prosopa.editorDeltioKodikosDOM = $('#peDeltioKodikos');
	prosopa.editorDeltioPerigrafiDOM = $('#peDeltioPerigrafi');
	prosopa.editorDeltioImerominiaDOM = $('#peDeltioImerominia');
	prosopa.editorDeltioProsapoDOM = $('#peDeltioProsapo');
	prosopa.editorDeltioIpiresiaDOM = $('#peDeltioIpiresia');
	prosopa.editorDeltioDiefDOM = $('#peDeltioDief');
	prosopa.editorDeltioDiefSectionDOM = $('#peDeltioDiefSection');

	prosopa.editorIpalilosKodikosDOM = $('#peIpalilosKodikos');
	prosopa.editorIpalilosOnomateponimoDOM = $('#peIpalilosOnomateponimo');
	prosopa.editorIpalilosOrarioDOM = $('#peIpalilosOrario');

	pnd.bodyDOM.
	on('keydown', '.orarioPedio', function(e){
		prosopa.orarioEdit(e, $(this));
	}).
	on('change', '.orarioPedio', function() {
		let val = $(this).val();
		let orario = new letrak.orario(val);

		if (orario.isOrario())
		$(this).val(orario.toString());
	});

	prosopa.editorIpalilosKartaDOM = $('#peIpalilosKarta');
	prosopa.katagrafiSetup();
	prosopa.editorMeraoraLabelDOM = $('#peMeraoraLabel');
	prosopa.editorMeraoraDOM = $('#peMeraora');
	prosopa.editorAdidosDOM = $('#peAdidos').
	on('change', () => {
		const adidos = prosopa.editorAdidosDOM.val();

		if (!adidos) {
			prosopa.editorAdapoDOM.val('');
			prosopa.editorAdeosDOM.val('');
			return;
		}

		if (prosopa.editorAdapoDOM.val())
		return;

		if (prosopa.editorAdeosDOM.val())
		return;

		let imerominia = prosopa.deltio.imerominiaGet();
		imerominia = pnd.date(imerominia, '%D-%M-%Y');
		prosopa.editorAdapoDOM.val(imerominia);
		prosopa.editorAdeosDOM.val(imerominia);

		switch (adidos) {
		case "ΤΗΛΕΡΓΑΣΙΑ":
		case "ΚΑΤ' ΟΙΚΟΝ ΠΕΡΙΟΡΙΣΜΟΣ":
			prosopa.editorAdeosDOM.val('');
			break;
		}
	});
	prosopa.editorAdapoDOM = $('#peAdapo').datepicker();
	prosopa.editorAdeosDOM = $('#peAdeos').datepicker();
	prosopa.editorExcuseDOM = $('#peExcuse');
	prosopa.editorInfoDOM = $('#peInfo').
	on('change', function(e) {
		e.stopPropagation();
		let x = $(this).val().trim();
		$(this).val(x);
	});

	prosopa.editorIpovoliDOM = $('#pePliktroIpovoli').
	on('click', (e) => prosopa.editorIpovoli(e));

	prosopa.editorDiagrafiDOM = $('#pePliktroDiagrafi').
	on('click', (e) => prosopa.editorDiagrafi(e));

	prosopa.editorPanelDOM = $('#pePanel');

	prosopa.editorPanelDOM.
	find('input').
	addClass('letrak-formaPliktro').
	addClass('pePliktro');

	prosopa.editorPliktroAkiroDOM = $('#pePliktroAkiro').
	on('click', (e) => prosopa.editorClose(e));

	prosopa.editorEpanaforaDOM = $('#pePliktroEpanafora').
	on('click', (e) => {
		e.stopPropagation();

		let parousia = prosopa.parousiaEditorDOM.data('parousia');
		prosopa.parousiaEdit(null, parousia);
	});

	prosopa.parousiaEditorDOM.
	dialog({
		'title': 'Λεπτομερή στοιχεία συμβάντος',
		'width': 'auto',
		'height': 'auto',
		'position': {
			'my': 'right-30 top+90',
			'at': 'right top',
		},
		'close': () => {
			prosopa.parousiaEditorDOM.removeData('parousia');
			prosopa.
			ipalilosZoomClose().
			parousiaTargetClear();
		},
	}).
	dialog('close');

	return prosopa;
};

// Η function "orarioEdit" καλείται on keydown στο πεδίο του ωραρίου με σκοπό
// να διευκολύνει τον χρήστη κατά την καταχώρηση του ωραρίου. Πιο συγκεκριμένα,
// ο χρήστης μπορεί να χρησιμοποιήσει τα πλήκτρα πάνω και κάτω βέλος, pageDown
// και pageUp, το "+" και το "-" για να μεταθέτει το ωράριο του υπαλλήλου κατά
// διαστήματα μισής ώρας, ή σε άλλα ωράρια βάρδιας.

prosopa.orarioEdit = (e, fld) => {
	const misaoro = 30;	// μισή ώρα σε λεπτά
	const oktaoro = 480;	// οκτώ ώρες σε λεπτά

	let step;
	let prosimo;

	// Με τα βελάκια πάνω/κάτω ή με τα πλήκτρα "+" και "-" αλλάζουμε
	// ωράρια με βήμα μισής ώρας, π.χ. εάν το τρέχον ωράριο είναι
	// "07:30-15:30" και πατήσουμε το κάτω βέλος, τότε το ωράριο θα
	// γίνει "08:00-16:00". Αντίθετα, αν το ωράριο είναι "08:00-16:00"
	// και πατήσουμε το πάνω βέλος το ωράριο θα γίνει "07:30-15:30".
	// Με πλήκτρο pageDown αλλάζουμε ωράρια βάρδιας με την εξής σειρά:
	// "06:00-14:00", "14:00-22:00", "22:00-06:00" και αντίστροφα με
	// το πλήκτρο pageUp.

	switch (e.which) {
	case 38:	// Up arrow
		step = misaoro;
		prosimo = -1;
		break;
	case 40:	// Down arrow
		step = misaoro;
		prosimo = 1;
		break;
	case 33:	// page Up
	case 65:	// key 'A'
		step = oktaoro;
		prosimo = -1;
		break;
	case 34:	// page Down
	case 90:	// key 'Z'
		step = oktaoro;
		prosimo = 1;
		break;
	}

	if (!step)
	return;

	// Εδώ είναι το σωστό σημείο για τις εντολές διαχείρισης event που
	// ακολουθούν, καθώς σε αυτό το σημείο έχουμε διασφαλίσει ότι έχει
	// πατηθεί πλήκτρο αλλαγής ωραρίου και επομένως ο όποιος ρόλος του
	// συγκεκριμένου πλήκτρου έχει εκπληρωθεί.

	e.stopPropagation();
	e.preventDefault();

	let orario = fld.val();

	if (!orario) {
		switch (step) {
		case misaoro:
			return fld.val(letrak.orario.defaultAsString);
		case oktaoro:
			return fld.val(letrak.orario.defaultAsString);
		}

		return;
	}

	orario = new letrak.orario(orario);

	if (orario.oxiOrario())
	return;

	let apo = orario.apoGet();

	if (apo.oxiOralepto())
	return;

	let eos = orario.eosGet();

	if (eos.oxiOralepto())
	return;

	// Τα προκαθορισμένα ωράρια βάρδιας είναι
	//
	//	⚫ 07:00-15:00
	//	⚫ 14:00-22:00
	//	⚫ 22:00-06:00

	if (step === oktaoro) {
		switch (apo.leptaGet()) {
		case 420:	// 07:00 σε λεπτά
			step = (prosimo > 0 ? 420 : 540);
			break;
		case 840:	// 14:00 σε λεπτά
			step = (prosimo > 0 ? 480 : 420);
			break;
		case 1320:	// 22:00 σε λεπτά
			step = (prosimo > 0 ? 540 : 480);
			break;
		default:
			return fld.val(letrak.orario.defaultAsString);
		}
	}

	step *= prosimo;
	orario = new letrak.orario(apo.leptaAdd(step), eos.leptaAdd(step));
	fld.val(orario.toString());
};

prosopa.editorClose = (e) => {
	if (e)
	e.stopPropagation();

	prosopa.parousiaEditorDOM.dialog('close');
	return prosopa;
};

prosopa.parousiaEdit = (e, parousia) => {
	if (e)
	e.stopPropagation();

	prosopa.parousiaEditorDOM.
	removeData('parousia');

	let update = prosopa.prosopaUpdateAllow();

	if (update)
	prosopa.editorIpovoliDOM.css('display', 'inline-block');

	// Η φόρμα επεξεργασίας παρουσίας (editor) λειτουργεί διαφορετικά
	// για υπάρχουσες παρουσίες και διαφορετικά κατά την προσθήκη νέας
	// παρουσίας. Ειδικά για το πλήκτρο διαγραφής μεριμνούμε ιδιαίτερα
	// ώστε να μην εμφανίζεται όταν πρόκειται για προσθήκη νέας
	// παρουσίας.

	if (parousia) {
		var prosthiki = false;
		prosopa.editorIpovoliDOM.
		data('prosthiki', false).
		val('Υποβολή');

		let display = prosopa.editorIpovoliDOM.css('display');
		prosopa.editorDiagrafiDOM.css('display', display);
		prosopa.editorEpanaforaDOM.css('display', display);
		prosopa.parousiaEditorDOM.removeData('prosthiki');
	}

	else if (update) {
		prosthiki = true;
		prosopa.editorIpovoliDOM.
		data('prosthiki', true).
		val('Προσθήκη');

		parousia = new letrak.parousia();
		parousia.orarioSet(letrak.orario.defaultAsString);
		parousia.karta = '@';
		prosopa.editorDiagrafiDOM.css('display', 'none');
		prosopa.editorEpanaforaDOM.css('display', 'none');
		prosopa.parousiaEditorDOM.data('prosthiki', true);
	}

	else {
		prosopa.parousiaEditorDOM.dialog('close');
		return prosopa;
	}

	let enimerosi = !prosthiki;

	if (enimerosi) {
		prosopa.editorIpalilosKodikosDOM.
		attr('disabled', true).
		val(parousia.ipalilos);

		prosopa.editorIpalilosOnomateponimoDOM.
		val(parousia.onomateponimo);
	}

	else {
		prosopa.editorIpalilosKodikosDOM.
		attr('disabled', false).
		val('').
		on('keyup', (e) => prosopa.ipalilosZoom(e)).
		on('blur', (e) => {
			e.stopPropagation();

			// Επειδή το blur ενεργοποιείται και όταν κάνουμε κλικ
			// σε κάποιον υπάλληλο στη zoom φόρμα, φροντίζουμε να
			// αφήσουμε λίγο χρόνο πριν κλείσουμε τη zoom φόρμα.

			setTimeout(() => prosopa.ipalilosZoomClose(), 100);
		});

		prosopa.editorIpalilosOnomateponimoDOM.
		val('');
	}

	// Ωράριο

	prosopa.editorIpalilosOrarioDOM.
	val(parousia.orario ? parousia.orario.toString() : '');

	// Κάρτα

	prosopa.editorIpalilosKartaDOM.
	val(parousia.karta);

	// Καταγραφές

	prosopa.katagrafiHide();

	// Ημερομηνία και ώρα παρουσίας

	let meraora = parousia.meraoraGet();

	if (meraora)
	meraora = pnd.date(meraora, '%D-%M-%Y %h:%m');

	prosopa.editorMeraoraDOM.
	val(meraora).
	on('change', (e) => prosopa.editorMeraoraFix());

	// Άδεια

	prosopa.editorAdidosDOM.
	val(parousia.adidos);

	prosopa.editorAdapoDOM.
	val(pnd.date2date(parousia.adapo, 'Y-M-D', '%D-%M-%Y'));

	prosopa.editorAdeosDOM.
	val(pnd.date2date(parousia.adeos, 'Y-M-D', '%D-%M-%Y'));

	// Excuse

	prosopa.editorExcuseDOM.
	val(parousia.excuse);

	// Παρατηρήσεις

	prosopa.editorInfoDOM.
	val(parousia.infoGet());

	// Άνοιγμα φόρμας καταχώρησης λεπτομερειών συμβάντος (editor)

	prosopa.parousiaEditorDOM.
	data('parousia', parousia).
	dialog('open');

	if (update) {
		if (prosthiki)
		prosopa.editorIpalilosKodikosDOM.focus();

		else if (prosopa.editorIpalilosOrarioDOM.val())
		prosopa.editorMeraoraDOM.focus();

		else
		prosopa.editorIpalilosOrarioDOM.focus();
	}

	else
	prosopa.editorPliktroAkiroDOM.focus();

	return prosopa;
};

prosopa.editorProsvasiRefresh = () => {
	let update = prosopa.prosopaUpdateAllow();

	if (update) {
		prosopa.editorIpovoliDOM.css('display', 'inline-block');

		if (prosopa.parousiaEditorDOM.data('prosthiki')) {
			prosopa.editorDiagrafiDOM.css('display', 'none');
			prosopa.editorEpanaforaDOM.css('display', 'none');
		}

		else {
			prosopa.editorDiagrafiDOM.css('display', 'inline-block');
			prosopa.editorEpanaforaDOM.css('display', 'inline-block');
		}

		prosopa.parousiaEditorDOM.
		find('.pePedioUpdate').
		attr('disabled', false);
	}

	else {
		prosopa.editorIpovoliDOM.css('display', 'none');
		prosopa.editorDiagrafiDOM.css('display', 'none');
		prosopa.editorEpanaforaDOM.css('display', 'none');
		prosopa.parousiaEditorDOM.
		find('.pePedioUpdate').
		attr('disabled', true);
	}

	return prosopa;
};

prosopa.editorMeraoraFix = (e) => {
	if (e)
	e.stopPropagation();

	let meraora = prosopa.editorMeraoraDOM.val();

	if (!meraora)
	return prosopa.editorMeraoraDOM.val('');

	let a = meraora.split(/ +/);

	if (a.length < 1)
	return prosopa.editorMeraoraDOM.val('');

	if (a.length > 2)
	return prosopa.editorMeraoraDOM.val('');

	switch (a.length) {
	case 1:
		var imerominia = pnd.date(prosopa.deltio.imerominiaGet(),
			'%D-%M-%Y');
		var oralepto = a[0];
		break;
	case 2:
		imerominia = a[0];
		oralepto = a[1];
		break;
	default:
		return undefined;
	}

	oralepto = new letrak.oralepto(oralepto);

	if (oralepto.oxiOralepto())
	return;

	imerominia = pnd.date2date(imerominia, 'D-M-Y', '%Y-%M-%D');
	meraora = new Date(imerominia + ' ' + oralepto.toString());
	meraora = pnd.date(meraora, '%D-%M-%Y %h:%m');

	if (!meraora)
	return;

	prosopa.editorMeraoraDOM.val(meraora);
};

prosopa.ipalilosZoom = (e) => {
	if (e)
	e.stopPropagation();

	switch (e.which) {
	case 40:	// Down arrow
		return prosopa.ipalilosZoomEpilogiAlagi(1);
	case 38:	// Up arrow
		return prosopa.ipalilosZoomEpilogiAlagi(-1);
	}

	let zoom = prosopa.ipalilosZoomDOM;
	let fld = prosopa.editorIpalilosKodikosDOM;

	let ipl = prosopa.goniki.ipalilosArray;
	let val = fld.val();

	zoom.css('display', 'none');

	if (!val)
	return;

	if (val.length < 3)
	return;

	if (val == parseInt(val))
	return;

	let a = val.split('');
	let s = '^' + a[0];

	for (let i = 1; i < a.length; i++)
	s += '.*' + a[i];

	s = new RegExp(s, 'i');

	let lpi = [];

	pnd.arrayWalkCond(ipl, (x) => {
		let t = x.e + ' ' + x.o;

		if (t.match(s))
		lpi.push(x);

		if (lpi.length < 30)
		return true;

		lpi.push(undefined);
		return false;
	});

	if (!lpi.length)
	return;

	zoom.css('display', 'block').empty();

	pnd.arrayWalk(lpi, (x, i) => {
		zoom.append(prosopa.ipalilosZoomDomGet(x, i));
	});
};

prosopa.ipalilosZoomEpilogiAlagi = (step) => {
	let list = prosopa.ipalilosZoomDOM.children('.ipalilosZoom');

	if (!list.length)
	return false;

	let count = 0;
	let trexon = 0;

	list.each(function() {
		count++;

		if (!$(this).hasClass('ipalilosZoomEpilogi'))
		return;

		$(this).removeClass('ipalilosZoomEpilogi');
		trexon = count;
	});

	if (!count)
	return false;

	trexon += step;

	if (trexon < 1)
	trexon = count;

	else if (trexon > count)
	trexon = 1;

	count = 0;

	list.each(function() {
		count++;

		if (count !== trexon)
		return;

		$(this).addClass('ipalilosZoomEpilogi');
		return false;
	});

	return false;
};

prosopa.ipalilosZoomDomGet = (x, n) => {
	if (!x)
	return $('<div>').
	text('More…');

	let cls = 'ipalilosZoom';

	if (n === 0)
	cls += ' ipalilosZoomEpilogi';

	cls += ' ipalilosZoomZebra' + (n % 2);

	return $('<div>').
	data('ipalilos', x).
	addClass(cls).

	append($('<div>').
	addClass('ipalilosZoomKodikos').
	text(x.k)).

	append($('<div>').
	addClass('ipalilosZoomOnomateponimo').
	text(x.e + ' ' + x.o + ' ' + x.p)).

	append($('<div>').
	addClass('ipalilosZoomGenisi').
	text(x.g));
};

prosopa.ipalilosZoomClose = () => {
	prosopa.ipalilosZoomDOM.
	css('display', '').
	empty();

	return prosopa;
};

///////////////////////////////////////////////////////////////////////////////@

prosopa.protipoSetup = () => {
	prosopa.protipoDOM = $('#protipo').
	on('submit', (e) => prosopa.protipoMetatropiExec(e));

	prosopa.protipoPerigrafiDOM = $('#protipoPerigrafi');
	prosopa.protipoOrarioDOM = $('#protipoOrario');

	prosopa.protipoIpovoliDOM = $('#protipoPliktroMetatropi').
	on('click', (e) => prosopa.protipoMetatropiExec(e));

	prosopa.protipoPanelDOM = $('#protipoPanel');

	prosopa.protipoPanelDOM.
	find('input').
	addClass('letrak-formaPliktro').
	addClass('protipoPliktro');

	prosopa.protipoPliktroAkiroDOM = $('#protipoPliktroAkiro').
	on('click', (e) => prosopa.protipoClose(e));

	prosopa.protipoDOM.
	dialog({
		'title': 'Μετατροπή σε πρότυπο',
		'width': 'auto',
		'height': 'auto',
		'position': {
			'my': 'left top',
			'at': 'left+20 top+144',
		},
		'open': () => {
			if (prosopa.deltio)
			prosopa.protipoPerigrafiDOM.
			val(prosopa.deltio.perigrafiGet());
		},
	}).
	dialog('close');

	return prosopa;
};

prosopa.protipoMetatropi = (e) => {
	e.stopPropagation();

	if (!prosopa.deltio)
	return;

	let ipiresia = prosopa.deltio.ipiresiaGet();

	if (letrak.prosvasiOxiAdmin(ipiresia))
	return;

	prosopa.protipoDOM.dialog('open');
};

prosopa.protipoMetatropiExec = (e) => {
	pnd.fyiMessage('Μετατροπή δελτίου σε πρότυπο…');
	$.post({
		'url': 'protipoMetatropi.php',
		'dataType': 'text',
		'data': {
			'deltio': prosopa.deltio.kodikosGet(),
			'perigrafi': prosopa.protipoPerigrafiDOM.val(),
			'orario': prosopa.protipoOrarioDOM.val(),
		},
		'success': (rsp) => prosopa.protipoMetatropiPost(rsp),
		'error': (err) => prosopa.protipoMetatropiError(err),
	});

	return false;
};

prosopa.protipoMetatropiPost = (rsp) => {
	if (rsp)
	return pnd.fyiError(rsp);

	// Refresh
	location.reload();
};

prosopa.protipoMetatropiError = (err) => {
	pnd.fyiError('Απέτυχε η μετατροπή του δελτίου σε πρότυπο');
	console.error(err);
};

prosopa.protipoClose = (e) => {
	e.stopPropagation();

	prosopa.protipoDOM.dialog('close');
	return prosopa;
};

///////////////////////////////////////////////////////////////////////////////@

// Ακολουθούν δομές και μέθοδοι που αφορούν στην εμφάνιση καταγραφών από το
// σύστημα καταγραφής συμβάντων εισόδου/εξόδου (WIN-PAK). Πράγματι, στη φόρμα
// επεξεργασίας λεπτομερειών προσέλευσης/αποχώρησης υπαλλήλου (editor) υπάρχει
// πλήκτρο [WIN-PAK] με το οποίο επιλέγονται και εμφανίζονται σε pop-up χωρίο
// συμβάντα που αφορούν στον τρέχοντα υπάλληλο και είναι κοντά στην ημερομηνία
// του τρέχοντος δελτίου. Ο χρήστης μπορεί να επιλέξει κάποιο από τα συμβάντα
// προκειμένου να τεθεί ανάλογα η ημερομηνία και η ώρα προσέλευσης/αποχώρησης.
// Επιπλέον, στο ίδιο χωρίο παρέχεται η δυνατότητα «καθαρισμού» του σχετικού
// πεδίου.

prosopa.katagrafiSetup = () => {
	// Εφοπλίζουμε το πλήκτρο ελέγχου συμβάντων με τη δυνατότητα
	// εμφάνισης και απόκρυψης του σχετικού χωρίου κατά το κλικ.

	prosopa.editorKatagrafiLabelDOM = $('#peKatagrafiLabel').
	on('click', (e) => prosopa.katagrafiToggle(e));

	// Εφοπλίζουμε τα στοιχεία που θα περιέχουνται στο χωρίο ελέγχου
	// συμβάντων με τη function ενημέρωσης του πεδίου καταγραφής.

	prosopa.editorKatagrafiDOM = $('#peKatagrafi').
	on('click', 'div', function(e) {
		prosopa.
		katagrafiGet(e, $(this)).
		katagrafiHide();
	});

	return prosopa;
};

// Η function "katagrafiToggle" καλείται όποτε ο χρήστης κάνει κλικ στο
// πλήκτρο [WIN-PAK]. Αν το πλήκτρο έχει ήδη πατηθεί και το χωρίο είναι ήδη
// ανοικτό, τότε το χωρίο κλείνει, αλλιώς το πρόγραμμα επιλέγει τα συμβάντα
// που αφορούν τον συγκεκριμένο εργαζόμενο και τα εμφανίζει στο σχετικό χωρίο.

prosopa.katagrafiToggle = (e) => {
	e.stopPropagation();

	if (prosopa.editorKatagrafiDOM.css('visibility') === 'visible')
	return prosopa.katagrafiHide();

	return prosopa.katagrafiShow();
};

// Η function "katagrafiHide" κλείνει το χωρίο επιλογής συμβάντων και θέτει
// το σχετικό πλήκτρο σε κατάσταση αναμονής.

prosopa.katagrafiHide = () => {
	prosopa.editorKatagrafiDOM.css('visibility', 'hidden');
	return prosopa;
};

// Η function "katagrafiShow" αποστέλλει τον αριθμό κάρτας εργαζομένου και
// τον κωδικό του δελτίου στον server προκειμένου να αναζητηθούν τα σχετικά
// συμβάντα από το σύστημα καταγραφής (WIN-PAK).

prosopa.katagrafiShow = () => {
	let data = {};

	data.karta = prosopa.editorIpalilosKartaDOM.val();

	if (!data.karta)
	return prosopa.katagrafiProcess();

	if (data.karta != parseInt(data.karta))
	return prosopa.fyiError('Μη αποδεκτός αριθμός κάρτας εργαζομένου');

	data.deltio = prosopa.deltioKodikos;

	pnd.fyiMessage('Αναζήτηση καταγραφών…');
	$.post({
		'url': 'katagrafi.php',
		'dataType': 'json',
		'data': data,
		'success': (rsp) => prosopa.katagrafiProcess(rsp),
		'error': (err) => {
			pnd.fyiError('Σφάλμα επιλογής καταγραφών');
			console.error(err);
		},
	});
};

// Η function "katagrafiProcess" καλείται κατά την επιστροφή των επιλεγμένων
// συμβάντων από τον server. Τα επιστρεφόμενα δεδομένα είναι σε μορφή json
// και περιέχουν τα παρακάτω πεδία:
//
//	prin	Πρόκειται για array με τα τελευταία συμβάντα που αφορούν
//		τον τρέχοντα υπάλληλο μέχρι και την ημερομηνία του δελτίου.
//
//	meta	Πρόκειται για array των πρώτων συμβάντων που αφορούν τον
//		τρέχοντα υπάλληλο αμέσως μετά την ημερομηνία του δελτίου.

prosopa.katagrafiProcess = (rsp) => {
	if (!rsp)
	rsp = {
		"noEvent": true,
	};

	if (rsp.error)
	return pnd.fyiError(rsp.error);

	pnd.fyiMessage();

	prosopa.editorKatagrafiDOM.
	css('visibility', 'visible').
	empty();

	if (rsp.noEvent)
	return prosopa.editorKatagrafiDOM.
	append($('<div>').
	addClass('peKatagrafiNoEvent').
	text(prosopa.minima.katagrafiNoEvent)).
	append($('<div>').
	text(prosopa.minima.katagrafiOrario));

	// Εμφανίζουμε τα συμβάντα στο σχετικό χωρίο προκειμένου ο χρήστης
	// να έχει τη δυνατότητα επιλογής κάποιου από αυτά τα συμβάντα.

	while (rsp.prin.length > 0)
	prosopa.editorKatagrafiDOM.
	prepend($('<div>').
	text(rsp.prin.pop()));

	while (rsp.meta.length > 0)
	prosopa.editorKatagrafiDOM.
	prepend($('<div>').
	text(rsp.meta.shift()));

	// Προσθέτουμε στο επάνω μέρος του χωρίου εμφάνισης καταγραφών
	// ειδικές εγγραφές για ενημέρωση από το ωράριο, για καθαρισμό
	// του πεδίου καταγραφής κλπ.

	prosopa.editorKatagrafiDOM.
	prepend($('<div>').
	text(prosopa.minima.katagrafiOrario)).
	prepend($('<div>').
	text(prosopa.minima.katagrafiKatharismos)).
	scrollTop(0);
};

// Η function "katagrafiGet" καλείται όταν ο χρήστης κάνει κλικ σε κάποιο
// από τα συμβάντα που εμφανίζονται στο χωρίο επιλογής συμβάντων.

prosopa.katagrafiGet = (e, dom) => {
	e.stopPropagation();

	let x = dom.text();

	// Αν ο χρήστης έχει κάνει κλικ στην επιλογή καθαρισμού (πρώτο
	// στοιχείο στο χωρίο επιλογής συμβάντων), τότε θα πρέπει να
	// καθαρίσουμε το πεδίο καταγραφής.

	if (x === prosopa.minima.katagrafiKatharismos)
	x = '';

	// Αν ο χρήστης έχει κάνει κλικ στην επιλογή ώρας με βάση το
	// ωράριο του υπαλλήλου (δεύτερο στοιχείο στο χωρίο επιλογής
	// συμβάντων), τότε θέτουμε την ώρα προσέλευσης με βάση το
	// ωράριο του υπαλλήλου.

	else if (x === prosopa.minima.katagrafiOrario)
	x = prosopa.katagrafiApoOrarioGet();

	else if (x === prosopa.minima.katagrafiNoEvent)
	x = '';

	// Θέτουμε την τιμή του πεδίου καταγραφής και εφαρμόζουμε λίγο
	// animation με τα χρώματα του πεδίου καταγραφής προκειμένου να
	// γίνει σαφής η αλλαγή της τιμής του πεδίου.

	prosopa.editorMeraoraDOM.
	val(x).
	css({
		'color': 'midnightblue',
		'background-color': 'yellow',
	}).
	finish().
	animate({
		'color': '#000000',
		'background-color': '#ffffff',
	}, 1000);

	return prosopa;
};

prosopa.katagrafiApoOrarioGet = () => {
	let parousia = prosopa.parousiaEditorDOM.data('parousia');

	if (!parousia)
	return '';

	let orario = new letrak.orario(parousia.orarioGet());

	if (orario.oxiOrario())
	return '';

	// Θα επιστραφεί ημερομηνία και ώρα προσέλευσης/αποχώρησης με βάση
	// το ωράριο του υπαλλήλου. Αν πρόκειται για προσέλευση επιστρέφεται
	// η ώρα αρχής τους ωραρίου μείον λίγα λεπτά, ενώ για την αποχώρηση
	// επιστρέφεται η ώρα λήξης του ωραρίου συν λίγα λεπτά.

	let imerominia = prosopa.deltio.imerominiaGet();
	let sinplin = Math.floor(Math.random() * 7);

	try {
		switch (prosopa.deltio.prosapoGet()) {
		case 'ΠΡΟΣΕΛΕΥΣΗ':
			imerominia = orario.apomeraoraGet(imerominia);
			sinplin = -sinplin;
			break;
		case 'ΑΠΟΧΩΡΗΣΗ':
			imerominia = orario.eosmeraoraGet(imerominia);
			break;
		default:
			return '';
		}

		imerominia = new Date(imerominia.getTime() + (sinplin * 60000));
		return pnd.date(imerominia, '%D-%M-%Y %h:%m');

	} catch (e) {
		cosnole.error(e);
	}

	return '';
}

///////////////////////////////////////////////////////////////////////////////@

prosopa.editorIpovoli = (e) => {
	if (e)
	e.stopPropagation();

	let x = prosopa.ipalilosZoomDOM.children('.ipalilosZoomEpilogi')

	if (x.length === 1) {
		x = x.data('ipalilos');

		prosopa.editorIpalilosKodikosDOM.val(x.k);
		prosopa.editorIpalilosOnomateponimoDOM.
		val(x.e + ' ' + x.o + ' ' + x.p.substr(0,3));
		prosopa.ipalilosZoomClose();
		prosopa.editorIpalilosOrarioDOM.focus();
		return false;
	}

	let deltio = prosopa.editorDeltioKodikosDOM.val();

	if (!deltio) {
		pnd.fyiError('Απροσδιόριστο παρουσιολόγιο');
		return false;
	}

	let ipalilos = prosopa.editorIpalilosKodikosDOM.val();

	if (!ipalilos) {
		pnd.fyiError('Απροσδιόριστος υπάλληλος');
		return false;
	}

	try {
	$.post({
		'url': 'parousiaIpovoli.php',
		'dataType': 'text',
		'data': {
			'deltio': deltio,
			'ipalilos': ipalilos,
			'orario': prosopa.editorIpalilosOrarioDOM.val(),
			'karta': prosopa.editorIpalilosKartaDOM.val(),
			'meraora': prosopa.editorMeraoraDOM.val(),
			'adidos': prosopa.editorAdidosDOM.val(),
			'adapo': prosopa.editorAdapoDOM.val(),
			'adeos': prosopa.editorAdeosDOM.val(),
			'excuse': prosopa.editorExcuseDOM.val(),
			'info': prosopa.editorInfoDOM.val(),
		},
		'success': (rsp) => {
			// Σε περίπτωση που εισήχθη νέος υπάλληλος πρέπει να
			// ενημερώσουμε τα δεδομένα τρέχουσας εγγραφής στη
			// φόρμα διαχείρισης λεπτομερειών συμβάντος. Βασικά
			// μας ενδιαφέρει ο αρ. μητρώου τυχόν νεοεισαχθέντος
			// υπαλλήλου.

			let mark = prosopa.parousiaEditorDOM.data('parousia');

			if (mark)
			mark.ipalilosSet(ipalilos);

			prosopa.editorAlagiPost(rsp);

			if (prosopa.editorIpovoliDOM.data('prosthiki'))
			setTimeout(function() {
				prosopa.editorIpalilosOrarioDOM.focus();
			}, 100);
		},
		'error': (err) => {
			pnd.fyiError('Σφάλμα υποβολής στοιχείων παρουσίας');
			console.error(err);
		},
	});
	} catch (e) {
		console.error(e);
		return false;
	}

	return false;
};

prosopa.editorDiagrafi = (e, sure) => {
	if (e)
	e.stopPropagation();

	if (!sure) {
		let dialogDOM = $('<div>').
		attr('title', 'Διαγραφή υπαλλήλου').
		append($('<div>').
		html('Να διαγραφεί ο υπάλληλος;')).
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
					prosopa.editorDiagrafi(false, true);
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

		return prosopa;
	}

	let deltio = prosopa.editorDeltioKodikosDOM.val();

	if (!deltio)
	return prosopa.fyiError('Απροσδιόριστο παρουσιολόγιο');

	let ipalilos = prosopa.editorIpalilosKodikosDOM.val();

	if (!ipalilos)
	return prosopa.fyiError('Απροσδιόριστος υπάλληλος');

	$.post({
		'url': 'parousiaDiagrafi.php',
		'dataType': 'text',
		'data': {
			'deltio': deltio,
			'ipalilos': ipalilos,
		},
		'success': (rsp) => prosopa.editorAlagiPost(rsp),
		'error': (err) => {
			pnd.fyiError('Σφάλμα διαγραφής παρουσίας');
			console.error(err);
		},
	});

	return prosopa;
};

prosopa.editorAlagiPost = (rsp) => {
	if (rsp)
	return prosopa.fyiError(rsp);

	// Το snippet που ακολουθεί αφορά στην ένδειξη "Ok!" που υποδηλώνει
	// ότι η αλλαγές που υποβάλαμε καταχωρήθηκαν κανονικά. Ουσιαστικά
	// πρόκειται για eye candy και τίποτα παραπάνω.

	prosopa.alagiOkIndicatorDOM.
	finish().
	css({
		'opacity': 0,
		'left': '60px',
		'font-size': '0',
	}).
	animate({
		'opacity': 1,
		'left': '50px',
		'font-size': '20px',
	}, 200, function() {
		$(this).
		delay(200).
		animate({
			'opacity': 0,
			'left': '60px',
			'font-size': '0px',
		});
	});

	prosopa.ananeosi();
	return prosopa;
};

///////////////////////////////////////////////////////////////////////////////@

// Η function "winpak" εκτελείται με το πάτημα του φερώνυμου πλήκτρου και
// σκοπό έχει τη συμπλήρωση των ωρών προσέλευσης και αποχώρησης με βάση τις
// καταγραφές που υπάρχουν στο σύστημα WIN-PAK και αφορούν στους υπαλλήλους
// του παρουσιολογίου για τη συγκεκριμένη ημερομηνία και με οδηγό τις ώρες
// ωραρίου κάθε υπαλλήλου.

prosopa.winpak = () => {
	let plist = {};
	let count = 0;

	// Ετοιμάζουμε λίστα με τα ωράρια και τους αριθμούς καρτών για τους
	// υπαλλήλους του παρουσιολογίου, δεικτοδοτημένη με τους αρ. μητρώου
	// των υπαλλήλων. Αν κάποιος υπάλληλος έχει ήδη συμπληρωμένη ώρα
	// συμβάντος, τότε αυτός δεν θα περιληφθεί. Δεν περιλαμβάνονται,
	// επίσης, υπάλληλοι που δεν έχουν συμπληρωμένο ωράριο ή αριμό
	// κάρτας.

	prosopa.browserDOM.
	children('.parousia').
	each(function() {
		let parousia = $(this).data('parousia');

		if (!parousia)
		return;

		/***************************************************************
		** Τον Φεβρουάριο του 2021 αποφασίσαμε ότι μάλλον είναι
		** καλύτερα να φαίνεται με κάποιον τρόπο αν υπάρχει άδεια
		** ΚΑΙ χτύπημα κάρτας, οπότε βάλαμε σε σχόλια το παρακάτω
		** τμήμα του κώδικα.

		// Οι έλεγχοι καταγραφών για εργαζομένους που έχουν άδεια
		// ή excuse μάλλον προκαλούν πρόβλημα, οπότε δεν θα τους
		// συμπεριλάβουμε στην αναζήτηση καταγραφών.

		if (parousia.adiaGet())
		return;

		if (parousia.excuseGet())
		return;

		***************************************************************/

		if (parousia.meraora)
		return;

		let ipalilos = parousia.ipalilosGet();

		if (!ipalilos)
		return;

		let orario = parousia.orarioGet();

		if (!orario)
		return;

		orario = orario.toString();

		if (!orario)
		return;

		let karta = parousia.kartaGet();

		if (!karta)
		return;

		count++;
		plist[ipalilos] = {
			'o': orario,
			'k': karta,
		};
	});

	if (!count)
	return prosopa.fyiError('Δεν υπάρχουν ασυμπλήρωτες καταγραφές');

	pnd.fyiMessage('Αναζήτηση καταγραφών…');
	$.post({
		'url': 'winpak.php',
		'data': {
			'deltio': prosopa.deltioKodikos,
			'plist': plist,
		},
		'dataType': 'json',
		'success': (rsp) => prosopa.winpakProcess(rsp),
		'error': (err) => {
			pnd.fyiError('Σφάλμα λήψης καταγραφών');
			console.error(err);
		},
	});

	return prosopa;
};

prosopa.winpakProcess = (rsp) => {
	if (rsp.error)
	pnd.fyiError(rsp.error);

	pnd.fyiClear();

	if (!rsp.hasOwnProperty('data'))
	return prosopa;

	let data = rsp.data;

	prosopa.browserDOM.
	children('.parousia').
	each(function() {
		let parousia = $(this).data('parousia');

		if (!parousia)
		return;

		if (parousia.meraora)
		return;

		let ipalilos = parousia.ipalilosGet();

		if (!ipalilos)
		return;

		if (!data.hasOwnProperty(ipalilos))
		return;

		let ordinal = $(this).children('.parousiaOrdinal').text();
		parousia.meraora = new Date(data[ipalilos] + ':00');
		$(this).after(parousia.domGet(ordinal));
		$(this).remove();
	});

	return prosopa;
};

///////////////////////////////////////////////////////////////////////////////@

letrak.deltio.prototype.domGet = function() {
	let ipiresia = this.ipiresiaGet();
	let ipiresiaDOM;
	let imerominia = pnd.imerominia(this.imerominiaGet());
	let prosapo = this.prosapoGet();
	let prosapoDOM;

	if (!prosapo)
	prosapo = php.defs.LETRAK_DELTIO_PROSAPO_PROTIPO;

	let dom = $('<div>').
	addClass('deltio').

	append(prosopa.deltioKatastasiDOM = $('<div>').
	addClass('deltioKatastasi')).

	append($('<div>').
	addClass('deltioKodikos').
	text(this.kodikosGet())).

	append($('<div>').
	addClass('deltioPerigrafi').
	text(this.perigrafiGet())).

	append(ipiresiaDOM = $('<div>').
	addClass('deltioIpiresia').
	text(ipiresia)).

	append(prosapoDOM = $('<div>').
	addClass('deltioProsapo').
	text(prosapo)).

	append($('<div>').
	addClass('deltioImerominia').
	text(imerominia));

	if (letrak.prosvasiIsUpdate(ipiresia))
	ipiresiaDOM.addClass('deltioIpiresiaUpdate');

	switch (prosapo) {
	case php.defs.LETRAK_DELTIO_PROSAPO_PROSELEFSI:
		prosapoDOM.addClass('deltioProsapoProselefsi');
		break;
	case php.defs.LETRAK_DELTIO_PROSAPO_APOXORISI:
		prosapoDOM.addClass('deltioProsapoApoxorisi');
		break;
	}

	return dom;
};

letrak.parousia.prototype.domGet = function(ordinal) {
	let orario = this.orarioGet();

	if (orario)
	orario = orario.toString();

	else
	orario = '';

	let meraora = this.meraoraGet();

	if (meraora)
	meraora = pnd.date(meraora, '%D-%M-%Y %h:%m');

	let meraoraClass = 'parousiaMeraora';

	if (this.oxiParousia())
	meraoraClass += ' parousiaMeraoraProvlima';

	let isozigio = this.isozigioGet(prosopa.deltio);
	let isozigioClass = 'parousiaIsozigio';

	if (isozigio < 0)
	isozigioClass += ' parousiaIsozigioElima';

	else if (isozigio > 0)
	isozigioClass += ' parousiaIsozigioPleonasma';

	isozigio = letrak.isozigio2hm(isozigio, true);

	const meraoraDOM = $('<div>').
	addClass(meraoraClass).
	text(meraora);

	if (this.isPiragmeno())
	meraoraDOM.append($('<div>').
	addClass('parousiaMeraoraPiragmeno').
	html('&#x25E3;'));

	let dom = $('<div>').
	data('parousia', this).
	addClass('parousia').

	append($('<div>').
	addClass('parousiaOrdinal').
	text(ordinal)).

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
	text(orario)).

	append(meraoraDOM).

	append($('<div>').
	addClass(isozigioClass).
	html(isozigio)).

	append($('<div>').
	addClass('parousiaExcuse').
	text(this.excuseAdiaGet())).

	append($('<div>').
	attr('title', 'Παρατηρήσεις').
	addClass('parousiaInfo').
	text(this.infoAdiaGet()));

	if (this.adidosGet() && meraora)
	dom.addClass('parousiaAdiaAndMeraora')

	return dom;
};

letrak.ipografi.prototype.domGet = function() {
	let checkok = this.checkokGet();

	if (checkok)
	checkok = pnd.date(checkok, '%D-%M-%Y %h:%m');

	let dom = $('<div>').
	addClass('ipografi').
	data('ipografi', this).
	data('checkok', checkok).

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

	if (rsp.hasOwnProperty('katastasi'))
	prosopa.deltio.katastasi = rsp.katastasi;

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

	prosopa.prosvasiRefresh();
	return false;
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
