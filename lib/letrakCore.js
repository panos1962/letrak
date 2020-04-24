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
// lib/letrakCore.js —— "letrak" javascript API (core module)
// @FILE END
//
// @DESCRIPTION BEGIN
// @DESCRIPTION END
//
// @HISTORY BEGIN
// Created: 2020-04-09
// @HISTORY END
//
// @END
//
///////////////////////////////////////////////////////////////////////////////@

"use strict";

const pd =
require('../mnt/pandora/lib/pandoraCore.js');

const letrak = {};
module.exports = letrak;

letrak.minima = {};

///////////////////////////////////////////////////////////////////////////////@

letrak.imerisio = function(x) {
	if (!x)
	return this;

	let that = this;
	let y = {};

	pd.objectWalk(x, (v, k) => {
		if (letrak.imerisio.economyMap.hasOwnProperty(k))
		k = letrak.imerisio.economyMap[k];

		y[k] = v;
	});

	if (y.hasOwnProperty('imerominia') &&
	y.imerominia &&
	(typeof(y.imerominia) === 'string'))
	y.imerominia = new Date(y.imerominia);

	if (y.hasOwnProperty('closed') &&
	y.closed &&
	(typeof(y.cclosed) === 'string'))
	y.closed = new Date(y.closed);

	pd.objectWalk(y, (v, k) => that[k] = v);

	if (this.hasOwnProperty('kodikos')) {
		if (isNaN(this.kodikos))
		delete this.kodikos;

		else
		this.kodikos = parseInt(this.kodikos);
	}

	return this;
};

letrak.imerisio.economyMap = {
	'k': 'kodikos',
	'p': 'protipo',
	'i': 'imerominia',
	'r': 'ipiresia',
	'o': 'prosapo',
	'e': 'perigrafi',
	'c': 'closed',
};

letrak.imerisio.prototype.kodikosGet = function() {
	return this.kodikos;
};

letrak.imerisio.prototype.imerominiaGet = function() {
	return this.imerominia;
};

letrak.imerisio.prototype.ipiresiaGet = function() {
	return this.ipiresia;
};

letrak.imerisio.prototype.prosapoGet = function() {
	return this.prosapo;
};

letrak.imerisio.prototype.perigrafiGet = function() {
	return this.perigrafi;
};

letrak.imerisio.prototype.closedGet = function() {
	return this.closed;
};

letrak.imerisio.prototype.domGet = function() {
	let kodikos = this.kodikosGet();

	let dom = $('<div>').
	data('data', this).
	addClass('imerisio').

	append($('<div>').
	addClass('imerisioKodikos').
	attr('title', 'Κωδικός παρουσιολογίου').
	text(kodikos)).

	append($('<div>').
	addClass('imerisioImerominia').
	text(pd.date(this.imerominiaGet(), '%D-%M-%Y'))).

	append($('<div>').
	addClass('imerisioIpiresia').
	text(this.ipiresiaGet())).

	append($('<div>').
	addClass('imerisioTipos').
	text(this.prosapoGet())).

	append($('<div>').
	addClass('imerisioPerigrafi').
	text(this.perigrafiGet()));

	return dom;
};
