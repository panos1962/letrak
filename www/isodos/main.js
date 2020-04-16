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
	attr({
		'id': 'isodosForma',
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
		'type': 'button',
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
	on('click', (e) => {
		e.stopPropagation();

		let href = php._SESSION[php.defs.PANDORA_SESSION_HREF];

		if (!href)
		href = php._SERVER.HTTP_HOST + '/letrak'

		let list = {};
		list[php.defs.PANDORA_SESSION_POST] = JSON.stringify(php._POST);

		$.post({
			'url': '../mnt/pandora/lib/session.php',
			'data': { 'list': list },
			'success': () => self.location = href,
			'error': (e) => {
				pd.fyiError('Αδυναμία ακύρωσης της φόρμας εισόδου');
				console.error(e);
			},
		});
	}))).

	appendTo(pd.ofelimoDOM);

	return isodos;
};

isodos.formaClear = (e) => {
	if (e)
	e.stopPropagation();

	isodos.sesamiDOM.val('');
	isodos.ipalilosDOM.val('').focus();

	return isodos;
};

///////////////////////////////////////////////////////////////////////////////@
