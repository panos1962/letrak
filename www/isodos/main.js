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
// www/isodos/main.js —— Πρόγραμμα οδήγησης φόρμας εισόδου στην εφαρμογή
// @FILE END
//
// @DESCRIPTION BEGIN
// Ο χρήστης συμπληρώνει τον αριθμό μητρώου που φέρει ως εργαζόμενος στο
// Δήμο Θεσσαλονίκης και τον μυστικό κωδικό του (password) και εισέρχεται
// στην εφαρμογή "letrak", ελέγχου και διαχείρισης παρουσιολογίων.
//
// Τα διαπιστευτήρια του χρήστη είναι τα ίδια με αυτά της εφαρμογής "kartel",
// ελέγχου χτυπημάτων καρτών.
// @DESCRIPTION END
//
// @HISTORY BEGIN
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
const letrak =
require('../lib/letrak.js');
const isodos = {};

isodos.minima = {
	'isodos': 'Είσοδος',
	'clear': 'Καθαρισμός',
	'cancel': 'Άκυρο',
	'error': 'Σφάλμα διαδικασίας εισόδου',
};

pnd.domInit(() => {
	pnd.
	toolbarSetup().
	fyiSetup().
	ofelimoSetup().
	ribbonSetup().
	domSetup().
	domFixup();

	isodos.
	selidaSetup();

	return isodos;
});

///////////////////////////////////////////////////////////////////////////////@

isodos.selidaSetup = () => {
	letrak.
	toolbarTitlosSetup().
	toolbarArxikiSetup().
	ribbonCopyrightSetup();

	isodos.
	ofelimoSetup();

	return isodos;
};

///////////////////////////////////////////////////////////////////////////////@

isodos.ofelimoSetup = () => {
	$('<form>').
	addClass('pnd-forma').
	attr('id', 'isodosForma').
	on('submit', (e) => isodos.isodos(e)).

	append($('<div>').
	addClass('letrak-inputLine').

	append($('<label>').
	attr({
		'for': 'login',
	}).text('Αριθμός μητρώου')).
	append(isodos.ipalilosDOM = $('<input>').
	attr({
		'id': 'login',
		'type': 'text',
		'name': 'login',
		'value': '',
	}))).

	append($('<div>').
	addClass('letrak-inputLine').

	append($('<label>').
	attr({
		'for': 'sesami',
	}).text('Κωδικός εισόδου')).
	append(isodos.sesamiDOM = $('<input>').
	attr({
		'id': 'sesami',
		'type': 'password',
		'name': 'sesami',
		'value': '',
	}))).

	append($('<div>').
	addClass('letrak-formaPanel').

	append($('<input>').
	addClass('letrak-formaPliktro').
	attr({
		'type': 'submit',
		'value': isodos.minima.isodos,
	}).
	on('click', (e) => isodos.isodos(e))).

	append(isodos.clearDOM = $('<input>').
	addClass('letrak-formaPliktro').
	attr({
		'type': 'button',
		'value': isodos.minima.clear,
	}).
	on('click', (e) => isodos.formaClear())).

	append($('<input>').
	addClass('letrak-formaPliktro').
	attr({
		'type': 'button',
		'value': isodos.minima.cancel
	}).
	on('click', () => self.location = '/letrak/imerisio'))).

	appendTo(pnd.ofelimoDOM);

	isodos.ipalilosDOM.focus();
	return isodos;
};

isodos.isodos = (e) => {
	if (e)
	e.stopPropagation();

	pnd.fyiClear();
	$.post({
		'url': 'isodos.php',
		'data': {
			'ipalilos': isodos.ipalilosDOM.val(),
			'kodikos': isodos.sesamiDOM.val(),
		},
		'success': (rsp) => {
			if (!rsp)
			return self.location = '/letrak/imerisio';

			pnd.fyiError(rsp);
			console.error(rsp);
		},
		'error': (e) => {
			pnd.fyiError(isodos.minima.error);
			console.error(e);
		},
	});

	return false;
};

isodos.formaClear = (e) => {
	if (e)
	e.stopPropagation();

	pnd.fyiClear();
	isodos.sesamiDOM.val('');
	isodos.ipalilosDOM.val('').focus();

	return isodos;
};

///////////////////////////////////////////////////////////////////////////////@
