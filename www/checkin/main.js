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
// www/checkin/main.js —— Πρόγραμμα οδήγησης σελίδας ελέγχου και διαχείρισης
// παρουσιολογίων.
// @FILE END
//
// @DESCRIPTION BEGIN
// Πρόκειται για το πρόγραμμα οδήγησης της σελίδας αναζήτησης συμβάντων
// συγκεκριμένης ημερομηνίας.
// @DESCRIPTION END
//
// @HISTORY BEGIN
// Created: 2024-03-22
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
const checkin = {};

checkin.minima = {
	'filtraTabLabel': 'Φίλτρα',
};

pnd.domInit(() => {
	pnd.
	toolbarSetup().
	fyiSetup().
	ofelimoSetup().
	ribbonSetup().
	domSetup().
	domFixup();

	checkin.
	selidaSetup();
});

checkin.selidaSetup = () => {
	letrak.
	toolbarTitlosSetup().
	toolbarXristisSetup().
	ribbonCopyrightSetup();

	if (letrak.noXristis())
	return letrak.arxikiSelida(checkin);

	letrak.
	toolbarArxikiSetup();

	checkin.
	kritiriaSetup();

	return checkin;
};

///////////////////////////////////////////////////////////////////////////////@

checkin.kritiriaSetup = () => {
	pnd.toolbarLeftDOM.

	append(letrak.tabDOM().
	addClass('adminTab').
	addClass('checkinTab').
	attr('title', checkin.minima.ananeosiTitle).
	text(checkin.minima.ananeosiTabLabel).
	on('click', (e) => checkin.ananeosi(e))).

	append(checkin.filtraTabDOM = letrak.tabDOM().
	attr('title', checkin.minima.filtraShowTitle).
	append(checkin.minima.filtraTabLabel).
	on('click', (e) => checkin.filtraToggle(e))).

	append(checkin.paleoteraTabDOM = letrak.tabDOM().
	addClass('checkinTab').
	attr('title', checkin.minima.paleoteraTitle).
	append(checkin.minima.paleoteraTabLabel).
	on('click', (e) => checkin.paleotera(e))).

	append(checkin.reportsTabDOM = letrak.tabDOM().
	addClass('checkinTab').
	append(checkin.minima.reportsTabLabel).
	on('click', (e) => checkin.reportsToggle(e)));

	pnd.bodyDOM.
	append(checkin.filtraDOM = $('<div>').
	append($('<form>').
	attr('id', 'filtraForma').

	append($('<div>').
	addClass('letrak-inputLine').
	append(checkin.filtraIpiresiaDOM = $('<label>').
	attr('for', 'ipiresiaFiltro').
	text(checkin.minima.filtraIpiresiaLabel)).
	append(checkin.filtraIpiresiaDOM = $('<input>').
	attr('id', 'ipiresiaFiltro').
	addClass('filtraInput'))).

	// Το βασικό φίλτρο ημερομηνίας καθορίζει από ποια ημερομηνία
	// και πίσω επιθυμούμε να επιλέξουμε δελτία.

	append($('<div>').
	addClass('letrak-inputLine').
	append($('<label>').
	attr('for', 'imerominiaFiltro').
	text(checkin.minima.filtraImerominiaLabel)).
	append(checkin.filtraImerominiaDOM = $('<input>').
	attr('id', 'imerominiaFiltro').
	addClass('filtraInput').
	datepicker())).

	// Το δευτερεύον φίλτρο ημερομηνίας καθορίζει μέχρι και
	// ποια ημερομηνία επιθυμούμε να επιλέξουμε δελτία.

	append($('<div>').
	addClass('letrak-inputLine').
	append($('<label>').
	attr('for', 'eosFiltro').
	text(checkin.minima.filtraEosLabel)).
	append(checkin.filtraEosDOM = $('<input>').
	attr('id', 'eosFiltro').
	addClass('filtraInput').
	datepicker())).

	append($('<div>').
	addClass('letrak-inputLine').
	append(checkin.filtraProsapoDOM = $('<label>').
	attr('for', 'prosapoFiltro').
	text(checkin.minima.filtraProsapoLabel)).

	append(checkin.filtraProsapoDOM = $('<select>').

	append($('<option>').
	val('').
	text('').
	attr('selected', true)).

	append($('<option>').
	val(php.defs.LETRAK_checkin_PROSAPO_PROSELEFSI).
	text(php.defs.LETRAK_checkin_PROSAPO_PROSELEFSI)).

	append($('<option>').
	val(php.defs.LETRAK_checkin_PROSAPO_APOXORISI).
	text(php.defs.LETRAK_checkin_PROSAPO_APOXORISI)).

	append($('<option>').
	val(php.defs.LETRAK_checkin_PROSAPO_PROTIPO).
	text(php.defs.LETRAK_checkin_PROSAPO_PROTIPO)).

	attr('id', 'prosapoFiltro').
	addClass('filtraInput'))).

	append($('<div>').
	addClass('letrak-inputLine').
	append(checkin.filtraKatastasiDOMDOM = $('<label>').
	attr('for', 'katastasiFiltro').
	text(checkin.minima.filtraKatastasiLabel)).
	append(checkin.filtraKatastasiDOM = $('<select>').
	append($('<option>').val('').text('').attr('selected', true)).
	append($('<option>').val('ΕΚΚΡΕΜΕΣ').text('ΕΚΚΡΕΜΕΣ')).
	append($('<option>').val('ΑΝΥΠΟΓΡΑΦΟ').text('ΑΝΥΠΟΓΡΑΦΟ')).
	append($('<option>').val('ΚΥΡΩΜΕΝΟ').text('ΚΥΡΩΜΕΝΟ')).
	append($('<option>').val('ΕΠΙΚΥΡΩΜΕΝΟ').text('ΕΠΙΚΥΡΩΜΕΝΟ')).
	attr('id', 'katastasiFiltro').
	addClass('filtraInput'))).

	append($('<div>').
	addClass('letrak-inputLine').
	append(checkin.filtraIpalilosDOM = $('<label>').
	attr('for', 'ipalilosFiltro').
	text(checkin.minima.filtraIpalilosLabel)).
	append(checkin.filtraIpalilosDOM = $('<input>').
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
	on('click', (e) => checkin.filtraFormaIpovoli(e))).

	append($('<input>').
	addClass('letrak-formaPliktro').
	attr({
		'type': 'button',
		'value': letrak.minima.clearPliktroLabel,
	}).
	on('click', (e) => checkin.filtraFormaClear(e))).

	append($('<input>').
	addClass('letrak-formaPliktro').
	attr({
		'type': 'button',
		'value': letrak.minima.cancelPliktroLabel,
	}).
	on('click', (e) => checkin.filtraFormaCancel(e))))));

	checkin.filtraDOM.dialog({
		'title': 'Κριτήρια επιλογής',
		'autoOpen': false,
		'resizable': false,

		'width': 'auto',
		'height': 'auto',
		'position': {
			'my': 'left+100 top+100',
			'at': 'left top',
		},

		'open': () => checkin.filtraEnable(),
		'show': {
			'effect': 'drop',
			'direction': 'up',
			'duration': 100,
		},

		'close': () => checkin.filtraDisable(),
		'hide': {
			'effect': 'drop',
			'direction': 'up',
			'duration': 100,
		},
	});

	let ipiresia = letrak.xristisIpiresiaGet();

	if (ipiresia === undefined)
	checkin.filtraIpalilosDOM.
	attr('disabled', true).
	val(letrak.xristisIpalilosGet());

	else
	checkin.filtraIpiresiaDOM.val(ipiresia);

	checkin.filtraImerominiaDOM.val(pnd.dateTime(undefined, '%D-%M-%Y'));

	return checkin;
};
