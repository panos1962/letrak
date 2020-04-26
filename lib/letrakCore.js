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

	if (y.hasOwnProperty('protipo') &&
	(y.protipo == parseInt(y.protipo)))
	y.protipo = parseInt(y.protipo);

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

///////////////////////////////////////////////////////////////////////////////@

letrak.parousia = function(x) {
	if (!x)
	return this;

	let that = this;
	let y = {};

	pd.objectWalk(x, (v, k) => {
		if (letrak.parousia.economyMap.hasOwnProperty(k))
		k = letrak.parousia.economyMap[k];

		y[k] = v;
	});

	if (y.hasOwnProperty('imerisio') &&
	(y.imerisio == parseInt(y.imerisio)))
	y.imerisio = parseInt(y.imerisio);

	if (y.hasOwnProperty('ipalilos') &&
	(y.ipalilos == parseInt(y.ipalilos)))
	y.ipalilos = parseInt(y.ipalilos);

	if (y.hasOwnProperty('karta') &&
	(y.karta == parseInt(y.karta)))
	y.karta = parseInt(y.karta);

	if (y.hasOwnProperty('meraora') &&
	y.meraora &&
	(typeof(y.meraora) === 'string'))
	y.meraora = new Date(y.meraora);

	pd.objectWalk(y, (v, k) => that[k] = v);

	return this;
};

letrak.parousia.economyMap = {
	'm': 'imerisio',
	'i': 'ipalilos',
	'k': 'karta',
	'o': 'orario',
	't': 'meraora',
	'e': 'excuse',
	's': 'info',
	'l': 'eponimo',
	'f': 'onoma',
	'p': 'patronimo',
};

letrak.parousia.prototype.imerisioGet = function() {
	return this.imerisio;
};

letrak.parousia.prototype.ipalilosGet = function() {
	return this.ipalilos;
};

letrak.parousia.prototype.kartaGet = function() {
	return this.karta;
};

letrak.parousia.prototype.orarioGet = function() {
	return this.orario;
};

letrak.parousia.prototype.meraoraGet = function() {
	return this.meraora;
};

letrak.parousia.prototype.excuseGet = function() {
	return this.excuse;
};

letrak.parousia.prototype.infoGet = function() {
	return this.info;
};

letrak.parousia.prototype.eponimoGet = function() {
	return this.eponimo;
};

letrak.parousia.prototype.onomaGet = function() {
	return this.onoma;
};

letrak.parousia.prototype.patronimoGet = function() {
	return this.patronimo;
};

letrak.parousia.prototype.onomateponimoGet = function() {
	if (this.hasOwnProperty('onomateponimo'))
	return this.onomateponimo;

	this.onomateponimo = '';

	this.onomateponimo = pd.strPush(this.onomateponimo, this.eponimo);
	this.onomateponimo = pd.strPush(this.onomateponimo, this.onoma);
	this.onomateponimo = pd.strPush(this.onomateponimo, this.patronimo);

	return this.onomateponimo;
};

///////////////////////////////////////////////////////////////////////////////@
