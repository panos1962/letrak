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
// Updated: 2020-04-28
// Updated: 2020-04-27
// Updated: 2020-04-26
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

letrak.ipografi = function(x) {
	if (!x)
	return this;

	let that = this;
	let y = {};

	pd.objectWalk(x, (v, k) => {
		if (letrak.ipografi.economyMap.hasOwnProperty(k))
		k = letrak.ipografi.economyMap[k];

		y[k] = v;
	});


	if (y.hasOwnProperty('taxinomisi') &&
	(y.taxinomisi == parseInt(y.taxinomisi)))
	y.taxinomisi = parseInt(y.taxinomisi);

	if (y.hasOwnProperty('armodios') &&
	(y.armodios == parseInt(y.armodios)))
	y.armodios = parseInt(y.armodios);

	if (y.hasOwnProperty('checkok') &&
	y.checkok &&
	(typeof(y.checkok) === 'string'))
	y.checkok = new Date(y.checkok);

	pd.objectWalk(y, (v, k) => that[k] = v);

	return this;
};

letrak.ipografi.economyMap = {
	'x': 'taxinomisi',
	't': 'titlos',
	'a': 'armodios',
	'e': 'eponimo',
	'o': 'onoma',
	'c': 'checkok',
};

letrak.ipografi.prototype.taxinomisiSet = function(taxinomisi) {
	delete this.taxinomisi;

	taxinomisi = parseInt(taxinomisi);

	if (isNaN(taxinomisi))
	return this;

	if (taxinomisi < 1)
	return this;

 	if (taxinomisi > 255)
	return this;

	this.taxinomisi = taxinomisi;
	return this;
};

letrak.ipografi.prototype.titlosSet = function(titlos) {
	delete this.titlos;

	if (!titlos)
	return this;

	this.titlos = titlos;
	return this;
};

letrak.ipografi.prototype.armodiosSet = function(armodios) {
	delete this.armodios;

	armodios = parseInt(armodios);

	if (isNaN(armodios))
	return this;

	if (armodios < 1)
	return this;

 	if (armodios > 999999)
	return this;

	this.armodios = armodios;
	return this;
};

letrak.ipografi.prototype.checkokSet = function(checkok) {
	delete this.checkok;

	if (!checkok)
	return this;

	this.checkok = checkok;
	return this;
};

letrak.ipografi.prototype.taxinomisiGet = function() {
	return this.taxinomisi;
};

letrak.ipografi.prototype.titlosGet = function() {
	return this.titlos;
};

letrak.ipografi.prototype.armodiosGet = function() {
	return this.armodios;
};

letrak.ipografi.prototype.eponimoGet = function() {
	return this.eponimo;
};

letrak.ipografi.prototype.onomaGet = function() {
	return this.onoma;
};

letrak.ipografi.prototype.checkokGet = function() {
	return this.checkok;
};

letrak.ipografi.prototype.onomateponimoGet = function() {
	if (this.hasOwnProperty('onomateponimo'))
	return this.onomateponimo;

	this.onomateponimo = '';

	this.onomateponimo = pd.strPush(this.onomateponimo, this.eponimo);
	this.onomateponimo = pd.strPush(this.onomateponimo, this.onoma);

	return this.onomateponimo;
};

///////////////////////////////////////////////////////////////////////////////@

letrak.oralepto = function() {
	if (arguments.length < 1)
	return this;

	let a = arguments;

	if (a.length === 1) {
		let b = a[0].split(/:/);

		if (b.length > 2)
		return this;

		if (b.length === 1) {
			if (a[0] != parseInt(a[0]))
			return this;

			a[1] = b[0] % 100;
			a[0] = (b[0] - a[1]) / 100;
		}

		else
		a = b;
	}

	else if (a.length !== 2)
	return this;

	if ((a[0] < 0) || (a[0] > 24))
	return this;

	if ((a[1] < 0) || (a[1] > 59))
	return this;

	if ((a[0] === 24) && (a[1] > 0))
	return this;

	this.ora = a[0];
	this.lepto = a[1];

	return this;
};

letrak.oralepto.prototype.isOralepto = function() {
	return (this.hasOwnProperty('ora') && this.hasOwnProperty('lepto'));
};

letrak.oralepto.prototype.notOralepto = function() {
	return !this.isOralepto();
};

letrak.oralepto.prototype.toString = function() {
	if (this.notOralepto())
	return undefined;

	let s = '';

	if (this.ora < 10)
	s += '0';

	s += this.ora + ':';

	if (this.lepto < 10)
	s += '0';

	s += this.lepto;

	return s;
};

///////////////////////////////////////////////////////////////////////////////@

letrak.orario = function() {
	if (arguments.length < 1)
	return this;

	let a = arguments;

	if (a.length === 1)
	a = a[0].split(/[ -]/);

	if (a.length !== 2)
	return this;

	let apo = new letrak.oralepto(a[0]);

	if (apo.notOralepto())
	return this;

	let eos = new letrak.oralepto(a[1]);

	if (eos.notOralepto())
	return this;

	this.apo = apo;
	this.eos = eos;

	return this;
};

letrak.orario.prototype.isOrario = function() {
	return (this.hasOwnProperty('apo') && this.hasOwnProperty('eos'));
};

letrak.orario.prototype.notOrario = function() {
	return !this.isOrario();
};

letrak.orario.prototype.toString = function() {
	if (this.notOrario())
	return undefined;

	return this.apo.toString() + '-' + this.eos.toString();
};

///////////////////////////////////////////////////////////////////////////////@
