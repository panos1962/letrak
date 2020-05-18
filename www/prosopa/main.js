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

	'prosopoInsertTabLabel': 'Προσθήκη υπαλλήλου',
	'winpakTabLabel': 'WIN-PAK',
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

///////////////////////////////////////////////////////////////////////////////@

prosopa.selidaSetup = () => {
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

	if (prosopa.goniki.deltio.kodikosGet() != prosopa.deltioKodikos)
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
	addClass('browser'));

	prosopa.
	ipografesSetup().
	prosopaSetup().
	editorSetup();

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
			prosopaProcess(rsp.prosopa).
			prosvasiRefresh();

			// Σε περίπτωση που το παρουσιολόγιο έχει μόλις
			// δημιουργηθεί ως αντίγραφο κάποιου προηγούμενου
			// παρουσιολογίου, φροντίζουμε να παρουσιαστεί το
			// νεότευκτο σε ανοιγμένη μορφή.

			if (prosopa.goniki.klonos)
			prosopa.ipografesTabDOM.trigger('click');

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

	$('#peDeltioKodikos').val(prosopa.deltio.kodikosGet());
	$('#peDeltioPerigrafi').val(prosopa.deltio.perigrafiGet());
	$('#peDeltioImerominia').val(prosopa.deltio.imerominiaGet().
	toLocaleDateString('el-GR', {
		'weekday': 'long',
		'year': 'numeric',
		'month': 'long',
		'day': 'numeric',
	}));

	let prosapo = prosopa.deltio.prosapoGet();
	let prosapoDOM = $('#peDeltioProsapo');

	switch (prosapo) {
	case 'ΠΡΟΣΕΛΕΥΣΗ':
		prosapoDOM.addClass('deltioProsapoProselefsi');
		break;
	case 'ΑΠΟΧΩΡΗΣΗ':
		prosapoDOM.addClass('deltioProsapoApoxorisi');
		break;
	}

	prosapoDOM.text(prosapo);
	prosopa.editorMeraoraLabelDOM.text(prosapo);

	let ipiresia = prosopa.deltio.ipiresiaGet();
	let ipdesc = '';

	if (ipiresia.length > 3) {
		let dief = prosopa.goniki.ipiresiaList[ipiresia.substr(0, 3)];

		if (dief) {
			if (dief.length > 20)
			ipdesc = dief.substr(0, 64) + '…\n';

			else
			ipdesc = dief + '\n';
		}
	}
	
	ipdesc += prosopa.goniki.ipiresiaList[ipiresia];
	$('#peDeltioIpiresia').val(ipdesc);

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

prosopa.prosopaProcess = (parousia) => {
	prosopa.browserDOM.empty();

	pnd.arrayWalk(parousia, (v, k) => {
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
	prosopa.ipografesAreaDOM.
	addClass('ipografesAreaHidden').

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
			'deltio': prosopa.deltio.kodikosGet(),
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
			'deltio': prosopa.deltio.kodikosGet(),
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
			'deltio': prosopa.deltio.kodikosGet(),
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
			'deltio': prosopa.deltio.kodikosGet(),
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
			'deltio': prosopa.deltio.kodikosGet(),
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

prosopa.prosopaSetup = () => {
	pnd.toolbarLeftDOM.

	append(prosopa.prosopoInsertTabDOM = letrak.tabDOM().
	addClass('prosopaPliktro').
	addClass('prosopaPliktroUpdate').
	text(prosopa.minima.prosopoInsertTabLabel).
	on('click', (e) => prosopa.parousiaEdit(e)));

	prosopa.browserDOM.
	on('click', '.parousia', function(e) {
		prosopa.parousiaEdit(e, $(this).data('parousia'));
	});

	return prosopa;
};

prosopa.prosopaUpdateTabsRefresh = () => {
	let update = prosopa.prosopaUpdateAllow();

	if (update) {
console.log('PROSOPAUPDATE')
		pnd.toolbarLeftDOM.
		children('.prosopaPliktroUpdate').
		css('display', 'inline-block');
	}

	else {
console.log('OXI PROSOPAUPDATE')
		pnd.toolbarLeftDOM.
		children('.prosopaPliktroUpdate').
		css('display', update ? 'inline-block' : 'none');
	}

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
	prosopa.ipalilosZoomDOM = $('#peIpalilosZoom').
	on('click', '.ipalilosZoom', function(e) {
		prosopa.ipalilosZoomEpilogi(e, $(this));
	});

	prosopa.parousiaEditorDOM = $('#parousiaEditor').
	on('submit', (e) => prosopa.editorIpovoli(e));

	prosopa.parousiaEditorDOM.find('.peDeltioPedio').
	attr('disabled', true);

	prosopa.editorDeltioKodikosDOM = $('#peDeltioKodikos');
	prosopa.editorIpalilosKodikosDOM = $('#peIpalilosKodikos');
	prosopa.editorIpalilosOnomateponimoDOM = $('#peIpalilosOnomateponimo');
	prosopa.editorIpalilosOrarioDOM = $('#peIpalilosOrario');
	prosopa.editorIpalilosOrarioDOM = $('#peIpalilosOrario');
	prosopa.editorIpalilosKartaDOM = $('#peIpalilosKarta');
	prosopa.editorMeraoraLabelDOM = $('#peMeraoraLabel');
	prosopa.editorMeraoraDOM = $('#peMeraora');
	prosopa.editorAdidosDOM = $('#peAdidos').
	on('change', () => {
		if (prosopa.editorAdidosDOM.val())
		return;

		prosopa.editorAdapoDOM.val('');
		prosopa.editorAdeosDOM.val('');
	});
	prosopa.editorAdapoDOM = $('#peAdapo').datepicker();
	prosopa.editorAdeosDOM = $('#peAdeos').datepicker();
	prosopa.editorExcuseDOM = $('#peExcuse');
	prosopa.editorInfoDOM = $('#peInfo');

	prosopa.editorIpovoliDOM = $('#pePliktroIpovoli').
	on('click', (e) => prosopa.editorIpovoli(e));

	prosopa.editorDiagrafiDOM = $('#pePliktroDiagrafi').
	on('click', (e) => prosopa.editorDiagrafi(e));

	prosopa.editorPanelDOM = $('#pePanel');

	prosopa.parousiaEditorDOM.
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
			'my': 'left+290 top+90',
			'at': 'left top',
		},
		'close': () => prosopa.ipalilosZoomClose(),
	}).
	dialog('close');

	return prosopa;
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
		prosopa.editorIpovoliDOM.val('Υποβολή')
		let display = prosopa.editorIpovoliDOM.css('display');
		prosopa.editorDiagrafiDOM.css('display', display);
		prosopa.editorEpanaforaDOM.css('display', display);
		prosopa.parousiaEditorDOM.removeData('prosthiki');
	}

	else if (update) {
		prosthiki = true;
		prosopa.editorIpovoliDOM.val('Προσθήκη')
		parousia = new letrak.parousia();
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
		on('blur', (e) => prosopa.ipalilosZoomClose(e));
		//on('blur', (e) => $.noop());

		prosopa.editorIpalilosOnomateponimoDOM.
		val('');
	}

	// Ωράριο

	prosopa.editorIpalilosOrarioDOM.
	val(parousia.orario ? parousia.orario.toString() : '');

	// Κάρτα

	prosopa.editorIpalilosKartaDOM.
	val(parousia.karta);

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

		else
		prosopa.editorMeraoraDOM.focus();
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

	if (oralepto.notOralepto())
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

console.log(e.which);
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

prosopa.ipalilosZoomClose = (e) => {
	if (e)
	e.stopPropagation();

	prosopa.ipalilosZoomDOM.
	css('display', '').
	empty();

	return prosopa;
};

prosopa.ipalilosZoomEpilogi = (e, dom) => {
	prosopa.ipalilosZoomDOM.
	children('.ipalilosZoomEpilogi').
	removeClass('.ipalilosZoomEpilogi');

	if (dom.hasClass('ipalilosZoom'))
	dom.addClass('ipalilosZoomEpilogi');
};

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
		'success': (rsp) => prosopa.editorAlagiPost(rsp),
		'error': (err) => {
			pnd.fyiError('Σφάλμα υποβολής στοιχείων παρουσίας');
			console.error(err);
		},
	});
}

catch (e) {
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

	prosopa.ananeosi();
	prosopa.parousiaEditorDOM.dialog('close');

	return prosopa;
};

///////////////////////////////////////////////////////////////////////////////@

prosopa.winpak = () => {
	let plist = {};
	let count = 0;

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
			'deltio': prosopa.deltio.kodikosGet(),
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

		parousia.meraora = new Date(data[ipalilos] + ':00');

		$(this).
		children('.parousiaMeraora').
		text(data[ipalilos]);
	});

	return prosopa;
};

///////////////////////////////////////////////////////////////////////////////@

letrak.deltio.prototype.domGet = function() {
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

	append($('<div>').
	addClass('deltioProsapo').
	addClass('deltioProsapo' +
	(prosapo === 'ΠΡΟΣΕΛΕΥΣΗ' ? 'Proselefsi' : 'Apoxorisi')).
	text(prosapo)).

	append($('<div>').
	addClass('deltioImerominia').
	text(imerominia));

	if (letrak.prosvasiIsUpdate(ipiresia))
	ipiresiaDOM.addClass('deltioIpiresiaUpdate');

	return dom;
};

letrak.parousia.prototype.domGet = function() {
/*
this.ipalilos = 1234567;
this.karta = 1234567;
this.orario = '09:00-17:00';
this.excuse = 'ΕΚΤΟΣ ΕΔΡΑΣ';
this.orario = new letrak.orario('830-1530');
*/

	let meraora = this.meraoraGet();

	if (meraora)
	meraora = pnd.date(meraora, '%D-%M-%Y %h:%m');

	let orario = this.orarioGet();

	if (orario)
	orario = orario.toString();

	else
	orario = '';

	let dom = $('<div>').
	data('parousia', this).
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
	text(orario)).

	append($('<div>').
	addClass('parousiaMeraora').
	text(meraora)).

	append($('<div>').
	addClass('parousiaExcuse').
	text(this.excuseAdiaGet())).

	append($('<div>').
	attr('title', 'Παρατηρήσεις').
	addClass('parousiaInfo').
	text(this.infoAdiaGet()));

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
