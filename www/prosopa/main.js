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
// θέτω το "imr" να δείχνει σε globals που έχουν οριστεί στην εν λόγω σελίδα
// προκειμένου να μπορούμε να επιτελέσουμε διάφορες ενέργειες και σε αυτή τη
// σελίδα (πατρική).

const imr = (self.opener && self.opener.hasOwnProperty('LETRAK') &&
	self.opener.LETRAK.imerisio) ? self.opener.LETRAK : undefined;

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

	pnd.
	keepAlive('../mnt/pandora');

	pnd.ofelimoDOM.
	append(prosopa.imerisioAreaDOM = $('<div>').
	addClass('imerisioArea')).
	append(prosopa.browserDOM = $('<div>').
	addClass('browser'));

	prosopa.
	imerisioSetup();

	return prosopa;
};

prosopa.imerisioSetup = () => {
	prosopa.imerisioAreaDOM.
	append(prosopa.ipografesAreaDOM = $('<div>').
	addClass('ipografesAreaHidden'));

	prosopa.ipografesSetup();

/*
	if (imr && imr.hasOwnProperty('imerisioROW') &&
	(imr.imerisioROW.kodikosGet() != prosopa.imerisio))
	return prosopa.fyiError('Προβληματικό παρουσιολόγιο');
*/

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

			pnd.fyiClear();
			prosopa.
			imerisioProcess(rsp.imerisio).
			ipografesProcess(rsp.ipografes).
			prosopaProcess(rsp.prosopa);
		},
		'error': (err) => {
			pnd.fyiError('Αδυναμία λήψης στοιχείων παρουσιολογίου');
			console.error(err);
		},
	});

/*
console.log(imr.imerisioROW);
imr.imerisioDOM.css('background-color', 'red');
*/

	return prosopa;
};

prosopa.ipografesSetup = () => {
	prosopa.ipografesAreaDOM.

	append($('<div>').
	addClass('ipografesPanel').

	append($('<input>').
	attr('type', 'button').
	addClass('letrak-formaPliktro').
	val('Προσθήκη υπογραφής')).

	append(prosopa.ipografiDiagrafiTabDOM = $('<input>').
	attr('type', 'button').
	addClass('letrak-formaPliktro').
	addClass('letrak-pliktroHidden').
	val('Διαγραφή υπογραφής').
	on('click', (e) => prosopa.ipografiDiagrafi()))).

	append(prosopa.ipografesDOM = $('<div>').
	addClass('ipografes').
	on('click', '.ipografi', function(e) {
		let candi = $(this).hasClass('ipografiCandi');
		prosopa.ipografiCandiTabsHide();

		$('.ipografiCandi').removeClass('ipografiCandi');

		if (candi)
		return;

		$(this).addClass('ipografiCandi');
		prosopa.ipografiCandiTabsShow();
	}));

	pnd.toolbarLeftDOM.
	append(prosopa.ipografesTabDOM = letrak.tabDOM().
	text(prosopa.minima.ipografesTabLabel).
	on('click', function(e) {
		e.stopPropagation();

		let visible = $(this).data('visible');

		if (visible) {
			$(this).
			removeData('visible').
			removeClass('ipografiTabHide');
			prosopa.ipografesAreaDOM.addClass('ipografesAreaHidden');
		}

		else {
			$(this).
			data('visible', true).
			addClass('ipografiTabHide');
			prosopa.ipografesAreaDOM.removeClass('ipografesAreaHidden');
		}
	}));
};

prosopa.ipografiCandiTabsHide = () => {
	prosopa.ipografiDiagrafiTabDOM.
	addClass('letrak-pliktroHidden');

	return prosopa;
};

prosopa.ipografiCandiTabsShow = () => {
	prosopa.ipografiDiagrafiTabDOM.
	removeClass('letrak-pliktroHidden');

	return prosopa;
};

prosopa.ipografiDiagrafi = (e) => {
	if (e)
	e.stopPropagation();

	let dom = $('.ipografiCandi');

	if (dom.length !== 1)
	return prosopa.fyiError('Απροσδιόριστη υπογραφή προς διαγραφή');

	let taxinomisi = dom.data('taxinomisi');

	$.post({
		'url': 'ipografiDelete.php',
		'dataType': 'text',
		'data': {
			'imerisio': prosopa.imerisio,
			'taxinomisi': taxinomisi,
		},
		'success': (rsp) => {
			if (rsp)
			return prosopa.fyiError(rsp);

			$('.ipografi').
			removeClass('ipografiCandi').
			each(function() {
				let t = $(this).data('taxinomisi');

				if (t <= taxinomisi)
				return true;

				t--;
				$(this).
				data('taxinomisi', t).
				children('.ipografiTaxinomisi').
				text(t);
			});

			prosopa.ipografiCandiTabsHide();
			dom.remove();
		},
		'error': (err) => {
			prosopa.fyiError('Αδυναμία διαγραφής υπογραφής');
			console.error(err);
		},
	});

	return prosopa;
};

///////////////////////////////////////////////////////////////////////////////@

prosopa.imerisioProcess = (imerisio) => {
	imerisio = new letrak.imerisio(imerisio);

	prosopa.imerisioAreaDOM.
	prepend(imerisio.domGet());

	return prosopa;
};

prosopa.ipografesProcess = (ipografes) => {
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
