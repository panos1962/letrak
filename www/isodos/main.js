"use strict";

const pd =
require('../../mnt/pandora/www/lib/pandoraClient.js');

const letrak = require('../lib/letrak.js');

pd.domInit(() => {
	pd.
	domSetup().
	toolbarSetup().
	fyiSetup().
	ofelimoSetup().
	ribbonSetup();

	isodos.
	selidaSetup();
});

///////////////////////////////////////////////////////////////////////////////@

const isodos = {};

isodos.selidaSetup = () => {
	isodos.
	ofelimoSetup();

	pd.domFixup();
	return isodos;
};

isodos.ofelimoSetup = () => {
	$('<form>').

	append($('<div>').
	addClass('inputLine').

	append($('<label>').
	attr({
		'for': 'login',
	}).text('Αρ. μητρώου')).
	append($('<input>').
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
	}).text('Κωδικός')).
	append($('<input>').
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
		'value': 'Υποβολή',
	}))).

	appendTo(pd.ofelimoDOM);

	return isodos;
};

///////////////////////////////////////////////////////////////////////////////@
