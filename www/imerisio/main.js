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

	letrak.
	toolbarArxikiSetup();

	imerisio.
	erpotaFetch();

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
	text('Κλώνος')).

	append(letrak.tabDOM().
	addClass('candiTab').
	text('Διαγραφή'));

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
	if (!rsp.hasOwnProperty('error')) {
		pnd.fyiError('Ημιτελής λήψη στοιχείων προσωπικού');
		return imerisio;
	}

	if (rsp.error) {
		pnd.fyiError(rsp.error);
		return imerisio;
	}

	pnd.fyiClear();
	imerisio.ipiresiaList = rsp.ipiresia;
	imerisio.ipalilosList = rsp.ipalilos;

	imerisio.
	browserSetup().
	filtraSetup().
	candiTabsSetup().
	autoFind();

	return imerisio;
};

///////////////////////////////////////////////////////////////////////////////@

imerisio.autoFind = () => {
	pnd.fyiMessage('Επιλογή παρουσιολογίων…');
	$.post({
		'url': 'imerisio.php',
		'data': {
			'ipiresia': letrak.xristisIpiresiaGet(),
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

	if (x.error) {
		pnd.fyiError(x.error);
		return imerisio;
	}

	let ilist = x.imerisio;

	pnd.arrayWalk(ilist, function(v, k) {
		ilist[k] = new Imerisio(v);
		imerisio.browserDOM.
		append(ilist[k].DOM());
	});

	pnd.zebraFix(imerisio.browserDOM);

console.log(ilist);
	return imerisio;
};

///////////////////////////////////////////////////////////////////////////////@

function Imerisio(x) {
	let that = this;

	pnd.objectWalk(x, (v, k) => {
		that[k] = v;
	});

	if (this.hasOwnProperty('d'))
	this.d = new Date(this.d);

	if (this.hasOwnProperty('c') && this.c)
	this.c = new Date(this.c);
};

Imerisio.prototype.kodikosGet = function() {
	return this.k;
};

Imerisio.prototype.imerominiaGet = function() {
	return this.d;
};

Imerisio.prototype.ipiresiaGet = function() {
	return this.i;
};

Imerisio.prototype.tiposGet = function() {
	return this.t;
};

Imerisio.prototype.perigrafiGet = function() {
	return this.p;
};

Imerisio.prototype.closedGet = function() {
	return this.c;
};

Imerisio.prototype.DOM = function() {
	let kodikos = this.kodikosGet();

	let dom = $('<div>').
	addClass('imerisio').
	data('data', this).

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
	text(this.tiposGet())).

	append($('<div>').
	addClass('imerisioPerigrafi').
	text(this.perigrafiGet()));

	return dom;
};
