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
// www/admin/main.js —— Πρόγραμμα οδήγησης σελίδας διαχείρισης (admin)
// @FILE END
//
// @DESCRIPTION BEGIN
// @DESCRIPTION END
//
// @HISTORY BEGIN
// Updated: 2022-03-06
// Created: 2022-03-05
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
const admin = {};

// Χρησιμοποιούμε το global singleton "LETRAK" ως μέσο κοινοποίησης constant
// αντικειμένων προκειμένου να είναι αυτά προσπελάσιμα από children windows,
// όπως είναι η σελίδα "prosopa" κλπ.

self.LETRAK = {};

admin.minima = {
	"kritiriaKartaLabel": "Κάρτα",
	"kritiriaKodikosLabel": "Κωδικός",
	"kritiriaOnomateponimoLabel": "Ονοματεπώνυμο",
	"kritiriaImerominiaLabel": "Ημερομηνία",
};

pnd.domInit(() => {
	if (letrak.noXristis())
	return letrak.arxikiSelida(admin);

	if (letrak.prosvasiOxiAdmin('')) {
		self.location = '../mnt/pandora/lib/radioActive.html';
		return admin;
	}

	pnd.
	toolbarSetup().
	fyiSetup().
	ofelimoSetup().
	ribbonSetup().
	domSetup().
	domFixup();

	admin.
	selidaSetup();
});

admin.selidaSetup = () => {
	letrak.
	toolbarTitlosSetup().
	toolbarXristisSetup().
	ribbonCopyrightSetup();

	pnd.
	keepAlive('../mnt/pandora');

	admin.
	kritiriaSetup();

	pnd.bodyDOM.css('display', 'block');
	return admin;
};

///////////////////////////////////////////////////////////////////////////////@

admin.kritiriaSetup = () => {
	pnd.bodyDOM.
	append(admin.kritiriaFormaDOM = $('<div>').
	append($('<form>').
	attr('id', 'kritiriaForma').

	append($('<div>').
	addClass('letrak-inputLine').
	append(admin.kritiriaKartaDOM = $('<label>').
	attr('for', 'kritiriaKarta').
	text(admin.minima.kritiriaKartaLabel)).
	append(admin.kritiriaKartaDOM = $('<input>').
	attr('id', 'kritiriaKarta').
	addClass('kritiriaInput'))).

	append($('<div>').
	addClass('letrak-inputLine').
	append(admin.kritiriaKodikosDOM = $('<label>').
	attr('for', 'kritiriaKodikos').
	text(admin.minima.kritiriaKodikosLabel)).
	append(admin.kritiriaKodikosDOM = $('<input>').
	attr('id', 'kritiriaKodikos').
	addClass('kritiriaInput'))).

	append($('<div>').
	addClass('letrak-inputLine').
	append(admin.kritiriaOnomateponimoDOM = $('<label>').
	attr('for', 'kritiriaOnomateponimo').
	text(admin.minima.kritiriaOnomateponimoLabel)).
	append(admin.kritiriaOnomateponimoDOM = $('<input>').
	attr('id', 'kritiriaOnomateponimo').
	addClass('kritiriaInput'))).

	append($('<div>').
	addClass('letrak-inputLine').
	append($('<label>').
	attr('for', 'kritiriaImerominia').
	text(admin.minima.kritiriaImerominiaLabel)).
	append(admin.kiritiriaImerominiaDOM = $('<input>').
	attr('id', 'kritiriaImerominia').
	addClass('kritiriaInput').
	datepicker())).

	append($('<div>').
	addClass('letrak-formaPanel').

	append($('<input>').
	addClass('letrak-formaPliktro').
	attr({
		'type': 'submit',
		'value': letrak.minima.ipovoliPliktroLabel,
	}).
	on('click', (e) => admin.kritiriaFormaIpovoli(e))).

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

	admin.kritiriaFormaDOM.dialog({
		'title': 'Κριτήρια επιλογής',
		'autoOpen': true,
		'resizable': false,

		'width': 'auto',
		'height': 'auto',
		'position': {
			'my': 'left+20 top+70',
			'at': 'left top',
		},
	});

	let kritiriaDialogDOM = admin.kritiriaFormaDOM.closest('.ui-dialog');

	kritiriaDialogDOM.
	find('.ui-dialog-titlebar-close').
	css('display', 'none');

	kritiriaDialogDOM.
	find('.ui-dialog-title').
	css('text-align', 'center');
};
