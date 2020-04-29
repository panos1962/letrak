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
	'imerisioAkathoristo': 'Ακαθόριστο παρουσιολόγιο',
	'ipografesTabLabel': 'Υπογραφές',
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
				// XXX
				// Προσωρινό για να δείξουμε τη διασύνδεση
				// με τη γονική σελίδα σε επίπεδο DOM.

				imr.dom.css('background-color', 'red');

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
	imerisio = new letrak.imerisio(imerisio);

	prosopa.imerisioAreaDOM.
	append(imerisio.domGet());

	return prosopa;
};

prosopa.ipografesProcess = (ipografes) => {
	prosopa.ipografesSetup();

	if (!ipografes)
	return prosopa;

	pnd.arrayWalk(ipografes, (v) => {
		v = new letrak.ipografi(v);
		prosopa.ipografesDOM.
		append(v.domGet().
		data('taxinomisi', v.taxinomisiGet()));
	});

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
	addClass('ipografesAreaHidden').

	append($('<div>').
	addClass('ipografesPanel').

	append($('<input>').
	attr('type', 'button').
	addClass('letrak-formaPliktro').
	val('Προσθήκη υπογραφής').
	on('click', (e) => prosopa.ipografiInsert())).

	append(prosopa.ipografiDiagrafiTabDOM = $('<input>').
	attr('type', 'button').
	addClass('letrak-formaPliktro').
	addClass('ipografiPliktroNoCandi').
	val('Διαγραφή υπογραφής').
	on('click', (e) => prosopa.ipografiDiagrafi())).

	append(prosopa.ipografiEditTabDOM = $('<input>').
	attr('type', 'button').
	addClass('letrak-formaPliktro').
	addClass('ipografiPliktroNoCandi').
	val('Επεξεργασία υπογραφής').
	on('click', (e) => prosopa.ipografiEdit()))).

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

	let forma = {}
	let dialogDOM = $('<div>').

	attr('title', 'Προσθήκη υπογράφοντος').
		append($('<form>').
		attr('id', 'ipografiForma').

			append($('<div>').
			addClass('letrak-inputLine').
				append($('<label>').
				attr('for', 'ipografiFormaTaxinomisi').
				text('Α/Α')).
				append(forma.taxinomisiDOM = $('<input>').
				attr('id', 'ipografiFormaTaxinomisi'))).

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
				attr('id', 'ipografiFormaTitlos')))).

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
			'Προσθήκη': function() {
				forma.dom = $(this);
				prosopa.ipografiInsertExec(forma);
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
};

prosopa.ipografiInsertExec = function(forma) {
	pnd.fyiMessage('Προσθήκη υπογραφής…');

	$.post({
		'url': 'ipografiInsert.php',
		'dataType': 'json',
		'data': {
			'imerisio': prosopa.imerisio,
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
	if (rsp.error)
	return pnd.fyiError(rsp.error);

	prosopa.
	fyiClear().
	ipografesDOM.
	empty();

	pnd.arrayWalk(rsp.ipografes, (v) => {
		v = new letrak.ipografi(v);
		prosopa.ipografesDOM.
		append(v.domGet().
		data('taxinomisi', v.taxinomisiGet()));
	});

	forma.dom.dialog('close');
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

	let ipografi = (new letrak.ipografi()).
	taxinomisiSet(dom.data('taxinomisi')).
	armodiosSet(dom.children('.ipografiArmodios').text()).
	titlosSet(dom.children('.ipografiTitlos').text());

	let forma = {
		'isimonixat': ipografi.taxinomisiGet(),
	}
	let dialogDOM = $('<div>').

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
			'Υποβολή': function() {
				forma.dom = $(this);
				prosopa.ipografiEditExec(forma);
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
};

prosopa.ipografiEditExec = function(forma) {
	pnd.fyiMessage('Ενημέρωση υπογραφής…');

	$.post({
		'url': 'ipografiEdit.php',
		'dataType': 'json',
		'data': {
			'imerisio': prosopa.imerisio,
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

	pnd.arrayWalk(rsp.ipografes, (v) => {
		v = new letrak.ipografi(v);
		prosopa.ipografesDOM.
		append(v.domGet().
		data('taxinomisi', v.taxinomisiGet()));
	});

	forma.dom.dialog('close');
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

	let taxinomisi = dom.data('taxinomisi');

	pnd.fyiMessage('Διαγραφή υπογραφής…');
	$.post({
		'url': 'ipografiDelete.php',
		'dataType': 'text',
		'data': {
			'imerisio': prosopa.imerisio,
			'taxinomisi': taxinomisi,
		},
		'success': (rsp) => prosopa.
			ipografiDiagrafiPost(rsp, dom, taxinomisi),
		'error': (err) => {
			prosopa.fyiError('Αδυναμία διαγραφής υπογραφής');
			console.error(err);
		},
	});

	return prosopa;
};

prosopa.ipografiDiagrafiPost = (rsp, dom, taxdel) => {
	if (rsp)
	return prosopa.fyiError(rsp);

	pnd.fyiClear();
	dom.remove();
	prosopa.ipografiCandiTabsHide();

	prosopa.ipografesDOM.
	children('.ipografi').
	removeClass('ipografiCandi').
	each(function() {
		let tax = $(this).data('taxinomisi');

		if (tax <= taxdel)
		return;

		tax--;
		$(this).
		data('taxinomisi', tax).
		children('.ipografiTaxinomisi').
		text(tax);
	});
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

letrak.ipografi.prototype.domGet = function() {
	let checkok = this.checkokGet();

	if (checkok)
	checkok = pnd.date(checok, '%D-%M-%Y %h:%s');

	let dom = $('<div>').
	addClass('ipografi').

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
	text(checkok));

	return dom;
};

///////////////////////////////////////////////////////////////////////////////@

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
