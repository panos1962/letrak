"use strict";

const pnd =
require('../mnt/pandora/lib/pandora.js');
const letrak =
require('../lib/letrak.js');
const isodos = {};

pnd.domInit(() => {
	pnd.
	domSetup().
	toolbarSetup().
	fyiSetup().
	ofelimoSetup().
	ribbonSetup();

	isodos.
	ofelimoSetup();

	letrak.
	toolbarCenterSetup();

	pnd.domFixup();
	return isodos;
});

///////////////////////////////////////////////////////////////////////////////@

isodos.ofelimoSetup = () => {
	$('<form>').
	addClass('pnd-forma').
	attr({
		'id': 'isodosForma',
	}).
	on('submit', (e) => {
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
				pnd.fyiError('Σφάλμα εισόδου');
				console.error(e);
			},
		});

		return false;
	}).

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
		'value': 'Είσοδος',
	}).
	on('click', (e) => {
		e.stopPropagation();
	})).

	append(isodos.clearDOM = $('<input>').
	addClass('letrak-formaPliktro').
	attr({
		'type': 'button',
		'value': 'Καθαρισμός',
	}).
	on('click', (e) => isodos.formaClear())).

	append($('<input>').
	addClass('letrak-formaPliktro').
	attr({
		'type': 'button',
		'value': 'Άκυρο',
	}).
	on('click', () => self.location = '/letrak/imerisio'))).

	appendTo(pnd.ofelimoDOM);

	isodos.ipalilosDOM.focus();
	return isodos;
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
