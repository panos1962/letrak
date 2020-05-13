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

// Αν η σελίδα έχει εκκινήσει από τη σελίδα διαχείρισης παρουσιολογίων, τότε
// θέτω το "imr" να δείχνει σε μεταβλητές που έχουν οριστεί στην εν λόγω
// σελίδα προκειμένου να μπορούμε να επιτελέσουμε διάφορες ενέργειες και
// σε αυτή τη σελίδα ως γονική.

const imr = (self.opener && self.opener.hasOwnProperty('LETRAK') &&
	self.opener.LETRAK.hasOwnProperty('deltio') &&
	self.opener.LETRAK.deltio.row) ?
	self.opener.LETRAK.deltio : undefined;

const prosopa = {};

prosopa.minima = {
	'ipografiCheckSymbol': '&#x2714;',

	'deltioKatastasiΕΚΚΡΕΜΕΣSymbol': '&#x25D4;',
	'deltioKatastasiΑΝΥΠΟΓΡΑΦΟSymbol': '&#x25D1;',
	'deltioKatastasiΚΥΡΩΜΕΝΟSymbol': '&#x25D5;',
	'deltioKatastasiΕΠΙΚΥΡΩΜΕΝΟSymbol': '&#x2714;',

	'deltioAkathoristo': 'Ακαθόριστο παρουσιολόγιο',
	'ipografesTabLabel': 'Υπογραφές',

	'ipografiAnaneosiTabLabel': 'Ανανέωση',
	'ipografiAnaneosiTabTitle': 'Ανανέωση εικόνας υπογραφών',

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

	prosopa.deltio = php.requestGet('deltio');

	if (!prosopa.deltio)
	return prosopa.fyiError(prosopa.minima.deltioAkathoristo);

	letrak.
	toolbarTitlosSet('Παρουσιολόγιο <b>' + prosopa.deltio + '</b>');

	document.title = prosopa.deltio;

	if (letrak.noXristis())
	return prosopa.fyiError('Διαπιστώθηκε ανώνυμη χρήση');

	if (imr && (imr.row.kodikosGet() != prosopa.deltio))
	return prosopa.fyiError('Πρόβλημα σύνδεσης με την γονική σελίδα');

	pnd.
	keepAlive('../mnt/pandora');

	///////////////////////////////////////////////////////////////////////@

	pnd.ofelimoDOM.

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

	///////////////////////////////////////////////////////////////////////@

	pnd.fyiMessage('Αναζήτηση στοιχείων παρουσιολογίου…');
	$.post({
		'url': 'prosopa.php',
		'dataType': 'json',
		'data': {
			'deltio': prosopa.deltio,
		},
		'success': (rsp) => {
			if (rsp.error)
			return pnd.fyiError(rsp.error);

			prosopa.
			fyiClear().
			deltioProcess(rsp.deltio).
			ipografesProcess(rsp.ipografes).
			prosopaProcess(rsp.prosopa).
			pliktraRefresh();

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

prosopa.deltioProcess = (deltio) => {
	prosopa.deltio = new letrak.deltio(deltio);

	prosopa.deltioAreaDOM.
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
		let dief = imr.ipiresiaList[ipiresia.substr(0, 3)];

		if (dief) {
			if (dief.length > 20)
			ipdesc = dief.substr(0, 64) + '…\n';

			else
			ipdesc = dief + '\n';
		}
	}
	
	ipdesc += imr.ipiresiaList[ipiresia];
	$('#peDeltioIpiresia').val(ipdesc);

	return prosopa;
};

prosopa.ipografesProcess = (ipografes) => {
	if (!ipografes)
	return prosopa;

	pnd.arrayWalk(ipografes, (v) => {
		v = new letrak.ipografi(v);
		prosopa.ipografesDOM.
		append(v.domGet());
	});

	prosopa.pliktraRefresh();
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
	prosopa.deltioAreaDOM.
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

	return prosopa;
};

///////////////////////////////////////////////////////////////////////////////@

prosopa.pliktraRefresh = () => {
	return prosopa.
	deltioKatastasiRefresh().
	ipografiUpdateTabsRefresh().
	ipografiPraxiTabsRefresh().
	prosopaUpdateTabsRefresh();
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

	prosopa.pliktraRefresh();
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

	pnd.toolbarLeftDOM.
	children('.prosopaPliktroUpdate').
	css('display', update ? 'inline-block' : 'none');

	return prosopa;
}

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
	return true;

	if (ipografi.checkokGet())
	return false;

	if (prosopa.xristisOxiProtosIpografon())
	return false;

	return true;
};

///////////////////////////////////////////////////////////////////////////////@

prosopa.editorSetup = () => {
	prosopa.parousiaEditorDOM = $('#parousiaEditor');

	prosopa.editorIpalilosKodikosDOM = $('#peIpalilosKodikos');
	prosopa.editorIpalilosOnomateponimoDOM = $('#peIpalilosOnomateponimo');
	prosopa.editorIpalilosOrarioDOM = $('#peIpalilosOrario');
	prosopa.editorIpalilosOrarioDOM = $('#peIpalilosOrario');
	prosopa.editorIpalilosKartaDOM = $('#peIpalilosKarta');
	prosopa.editorMeraoraLabelDOM = $('#peMeraoraLabel');
	prosopa.editorMeraoraDOM = $('#peMeraora');
	prosopa.editorAdidosDOM = $('#peAdidos');
	prosopa.editorAdapoDOM = $('#peAdapo');
	prosopa.editorAdeosDOM = $('#peAdeos');
	prosopa.editorExcuseDOM = $('#peExcuse');
	prosopa.editorInfoDOM = $('#peInfo');

	prosopa.editorPanelDOM = $('#pePanel');

	prosopa.editorPanelDOM.
	children('input').
	addClass('letrak-formaPliktro').
	addClass('pePanelPliktro');

	prosopa.editorPliktroAkiroDOM = $('#pePliktroAkiro').
	on('click', (e) => prosopa.editorClose(e));

	$('#pePliktroEpanafora').
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
		'open': () => {
			let update = prosopa.prosopaUpdateAllow();

			prosopa.editorPanelDOM.
			children('.prosopaPliktroUpdate').
			css('display', update ? 'inline-block' : 'none');
		}
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

	if (!parousia)
	parousia = new letrak.parousia();

	let meraora = parousia.meraoraGet();

	if (meraora)
	meraora = pnd.date(meraora, '%D-%M-%Y %h:%m');

	prosopa.editorIpalilosKodikosDOM.
	attr('disabled', true).
	val(parousia.ipalilos);

	prosopa.editorIpalilosOnomateponimoDOM.
	attr('disabled', true).
	val(parousia.onomateponimo);

	let orario = parousia.orario;

	if (orario)
	orario = orario.toString();

	prosopa.editorIpalilosOrarioDOM.
	val(orario);

	prosopa.editorIpalilosKartaDOM.
	val(parousia.karta);

	prosopa.editorMeraoraDOM.
	val(meraora);

	prosopa.editorAdidosDOM.
	val(parousia.adidos);

	prosopa.editorAdapoDOM.
	val(parousia.adapo);

	prosopa.editorAdeosDOM.
	val(parousia.adeos);

	prosopa.editorExcuseDOM.
	val(parousia.excuse);

	prosopa.editorInfoDOM.
	val(parousia.infoGet());

	prosopa.parousiaEditorDOM.
	data('parousia', parousia).
	dialog('open');
	prosopa.editorPliktroAkiroDOM.focus();

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

		let orario = parousia.orarioGet().toString();

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
*/
this.orario = new letrak.orario('830-1530');

	let meraora = this.meraoraGet();

	if (meraora)
	meraora = pnd.date(meraora, '%D-%M-%Y %h:%m');

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
	text(this.orarioGet().toString())).

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

	prosopa.pliktraRefresh();
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
