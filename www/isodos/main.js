"use strict";

const pd =
require('../../mnt/pandora/www/lib/pandoraClient.js');

const letrak = require('../lib/letrak.js');
const isodos = {};

pd.domInit(() => {
console.log(php);
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
console.log(php);

		let post = php._SESSION['_pandoraSessionPost'];
console.log(post);
return;
		let uri = letrakPOST[php._POST._letrakUri];
console.log(php._POST);
return;

		if (!uri)
		uri = php._SERVER.HTTP_HOST + '/letrak'

		$.post({
			'url': '../mnt/pandora/lib/session.php',
			'data': {
				'list': php._POST,
			},
		});

		self.location = uri;
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
