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
// Updated: 2022-03-07
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
	"kritiriaEponimoLabel": "Επώνυμο",
	"kritiriaOnomaLabel": "Όνομα",
	"kritiriaPatronimoLabel": "Πατρώνυμο",
	"kritiriaIpemailLabel": "Υπηρεσιακό email",
	"kritiriaPremailLabel": "Προσωπικό email",
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
	append(admin.kritiriaEponimoDOM = $('<label>').
	attr('for', 'kritiriaEponimo').
	text(admin.minima.kritiriaEponimoLabel)).
	append(admin.kritiriaEponimoDOM = $('<input>').
	attr('id', 'kritiriaEponimo').
	addClass('kritiriaInput'))).

	append($('<div>').
	addClass('letrak-inputLine').
	append(admin.kritiriaOnomaDOM = $('<label>').
	attr('for', 'kritiriaOnoma').
	text(admin.minima.kritiriaOnomaLabel)).
	append(admin.kritiriaOnomaDOM = $('<input>').
	attr('id', 'kritiriaOnoma').
	addClass('kritiriaInput'))).

	append($('<div>').
	addClass('letrak-inputLine').
	append(admin.kritiriaPatronimoDOM = $('<label>').
	attr('for', 'kritiriaPatronimo').
	text(admin.minima.kritiriaPatronimoLabel)).
	append(admin.kritiriaPatronimoDOM = $('<input>').
	attr('id', 'kritiriaPatronimo').
	addClass('kritiriaInput'))).

	append($('<div>').
	addClass('letrak-inputLine').
	append(admin.kritiriaIpemailDOM = $('<label>').
	attr('for', 'kritiriaIpemail').
	text(admin.minima.kritiriaIpemailLabel)).
	append(admin.kritiriaIpemailDOM = $('<input>').
	attr('id', 'kritiriaIpemail').
	addClass('kritiriaInput'))).

	append($('<div>').
	addClass('letrak-inputLine').
	append(admin.kritiriaPremailDOM = $('<label>').
	attr('for', 'kritiriaPremail').
	text(admin.minima.kritiriaPremailLabel)).
	append(admin.kritiriaPremailDOM = $('<input>').
	attr('id', 'kritiriaPremail').
	addClass('kritiriaInput'))).

	append($('<div>').
	addClass('letrak-inputLine').
	append($('<label>').
	attr('for', 'kritiriaImerominia').
	text(admin.minima.kritiriaImerominiaLabel)).
	append(admin.kritiriaImerominiaDOM = $('<input>').
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
	on('click', (e) => admin.kritiriaFormaClear(e))))));

	admin.kritiriaFormaDOM.dialog({
		'title': 'Κριτήρια επιλογής',
		'autoOpen': true,
		'closeOnEscape': false,
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

	setTimeout(() => {
		admin.kritiriaKartaDOM.focus();
	}, 0);
};

admin.kritiriaFormaFlist = {
	"Karta": 0,
	"Kodikos": 0,
	"Eponimo": 0,
	"Onoma": 0,
	"Patronimo": 0,
	"Ipemail": 0,
	"Premail": 0,
	"Imerominia": 0,
};

admin.kritiriaFormaIpovoli = (e) => {
	e.stopPropagation();
	pnd.fyiClear();

	let fld;
	let fldDOM;
	let data = {};
	let err = undefined;

	for (fld in admin.kritiriaFormaFlist) {
		fldDOM = admin['kritiria' + fld + 'DOM'];
		data[fld] = fldDOM.val().trim();
		fldDOM.val(data[fld]);
	}

	if (!data['Kodikos'].match(/^[0-9]{0,8}$/))
	err = admin.kritiriaKodikosDOM;

	if (!data['Karta'].match(/^[0-9]{0,8}$/))
	err = admin.kritiriaKartaDOM;

	if (err) {
		pnd.fyiError('Λανθασμένο κριτήριο');
		err.select().focus();
		return false;
	}

	admin.kritiriaKartaDOM.focus();
	admin.epilogiIpalilos(data);

	return false;
};

admin.kritiriaFormaClear = (e) => {
	e.stopPropagation();

	for (let fld in admin.kritiriaFormaFlist)
	admin['kritiria' + fld + 'DOM'].val('');

	admin.kritiriaKartaDOM.val('').focus();
	pnd.fyiClear();
	return admin;
};

///////////////////////////////////////////////////////////////////////////////@

admin.epilogiIpalilos = (data) => {
	pnd.fyiMessage('Επιλογή υπαλλήλων…');
	$.post({
		'url': 'epilogiIpalilos.php',
		'data': data,
		'dataType': 'json',
		'success': (rsp) => admin.epilogiIpalilos(rsp),
		'error': (e) => {
			pnd.fyiError('Αδυναμία επιλογής υπαλλήλων');
			console.error(e);
		},
	});

	return admin;
};
