"use strict";

const pd =
require('../../mnt/pandora/www/lib/pandoraClient.js');

const letrak = require('../lib/letrak.js');
const isodos = {};

pd.domInit(() => {
	pd.
	domSetup().
	toolbarSetup().
	fyiSetup().
	ofelimoSetup().
	ribbonSetup();

	isodos.
	ofelimoSetup();

	pd.domFixup();
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
		pd.fyiClear();
		$.post({
			'url': 'isodos.php',
			'data': {
				'ipalilos': isodos.ipalilosDOM.val(),
				'kodikos': isodos.sesamiDOM.val(),
			},
			'success': (rsp) => {
				if (!rsp)
				return self.location = '/letrak/imerisio';

				pd.fyiError(rsp);
				console.error(rsp);
			},
			'error': (e) => {
				pd.fyiError('Σφάλμα εισόδου');
				console.error(e);
			},
		});

		return false;
	}).

	append($('<div>').
	addClass('inputLine').

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
	addClass('inputLine').

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
	addClass('formPanel').

	append($('<input>').
	attr({
		'type': 'submit',
		'value': 'Είσοδος',
	}).
	on('click', (e) => {
		e.stopPropagation();
	})).

	append(isodos.clearDOM = $('<input>').
	attr({
		'type': 'button',
		'value': 'Καθαρισμός',
	}).
	on('click', (e) => isodos.formaClear())).

	append($('<input>').
	attr({
		'type': 'button',
		'value': 'Άκυρο',
	}).
	on('click', () => self.location = '/letrak/imerisio'))).

	appendTo(pd.ofelimoDOM);

	isodos.ipalilosDOM.focus();
	return isodos;
};

isodos.formaClear = (e) => {
	if (e)
	e.stopPropagation();

	pd.fyiClear();
	isodos.sesamiDOM.val('');
	isodos.ipalilosDOM.val('').focus();

	return isodos;
};

///////////////////////////////////////////////////////////////////////////////@
