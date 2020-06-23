///////////////////////////////////////////////////////////////////////////////@
//
// @BEGIN
//
// @COPYRIGHT BEGIN
// Copyright (C) 2020 Panos I. Papadopoulos <panos1962_AT_gmail_DOT_com>
// @COPYRIGHT END
//
// @FILETYPE BEGIN
// javascript
// @FILETYPE END
//
// @FILE BEGIN
// www/prosopa/ektiposi.js —— Πρόγραμμα εκτύπωσης δελτίου
// @FILE END
//
// @DESCRIPTION BEGIN
// @DESCRIPTION END
//
// @HISTORY BEGIN
// Created: 2020-06-21
// @HISTORY END
//
// @END
//
///////////////////////////////////////////////////////////////////////////////@

"use strict";

module.exports = function(pnd, letrak, prosopa) {
const ektiposi = {};

///////////////////////////////////////////////////////////////////////////////@

ektiposi.setup = () => {
	console.log('EKTIPOSI SETUP');

	ektiposi.bodyDOM = $('<div>').
	attr('id', 'ektiposi').
	appendTo(pnd.bodyDOM);

	return ektiposi;
};

ektiposi.ante = () => {
	console.log('EKTIPOSI ANTE');

	ektiposi.
	reset().
	deltio().
	prosopa();

	return ektiposi;
};

ektiposi.reset = () => {
	ektiposi.bodyDOM.
	empty();

	return ektiposi;
};

ektiposi.deltio = () => {
	let deltioDOM = $('<div>').
	addClass('ektiposi-deltio').
	appendTo(ektiposi.bodyDOM);

	let aristeraDOM = $('<div>').
	addClass('ektiposi-deltioAristera').
	appendTo(deltioDOM);

	aristeraDOM.

	append($('<div>').
	addClass('ektiposi-deltioDimos').
	text('ΔΗΜΟΣ ΘΕΣΣΑΛΟΝΙΚΗΣ'));

	let ipiresia = prosopa.deltio.ipiresiaGet();

	for (let i = 3; i <= ipiresia.length; i++) {
		let x = prosopa.goniki.ipiresiaList[ipiresia.substr(0, i)];

		if (x)
		aristeraDOM.
		append($('<div>').
		addClass('ektiposi-deltioIpiresia').
		text(x));
	}

	deltioDOM.
	append($('<div>').
	addClass('ektiposi-deltioKentro').

	append($('<div>').
	addClass('ektiposi-deltioIdos').

	append($('<div>').
	addClass('ektiposi-deltioProsapo').
	text('Δελτίο ' + prosopa.deltio.prosapoGet() + 'Σ Εργαζομένων'))).

	append($('<div>').
	addClass('ektiposi-deltioData').

	append($('<div>').
	addClass('ektiposi-deltioKodikos').
	text(prosopa.deltio.kodikosGet())).

	append($('<div>').
	addClass('ektiposi-deltioPerigrafi').
	text(prosopa.deltio.perigrafiGet())))).

	append($('<div>').
	addClass('ektiposi-deltioDexia').

	append($('<div>').
	addClass('ektiposi-deltioImerominia').
	text(prosopa.deltioAreaDOM.find('.deltioImerominia').text())));

	return ektiposi;
};

ektiposi.prosopa = () => {
	let plist = prosopa.browserDOM.children();
	let prest = plist.length;
	let parea = ektiposi.bodyDOM;

	plist.each(function() {
		prest--;

		if (prest === 4)
		parea = $('<div>').
		addClass('ektiposi-parousiaWrapper').
		addClass('pnd-idiaSelida').
		appendTo(parea);

		ektiposi.parousiaDOM($(this)).
		appendTo(parea);
	});

	parea.
	append(ektiposi.ipografesDOM());
};

ektiposi.parousiaDOM = (deltioDOM) => {
	let dom = $('<div>').
	addClass('ektiposi-parousia');

	let x = deltioDOM.
	children('.parousiaOrdinal').
	text();

	$('<div>').
	addClass('ektiposi-parousiaOrdinal').
	text(x).
	appendTo(dom);

	x = deltioDOM.
	children('.parousiaIpalilos').
	text();

	$('<div>').
	addClass('ektiposi-parousiaIpalilos').
	text(x).
	appendTo(dom);

	x = deltioDOM.
	children('.parousiaOnomateponimo').
	text();

	$('<div>').
	addClass('ektiposi-parousiaOnomateponimo').
	text(x).
	appendTo(dom);

	x = deltioDOM.
	children('.parousiaOrario').
	text();

	$('<div>').
	addClass('ektiposi-parousiaOrario').
	text(x).
	appendTo(dom);

	x = deltioDOM.
	children('.parousiaMeraora').
	text();

	$('<div>').
	addClass('ektiposi-parousiaMeraora').
	text(x).
	appendTo(dom);

	x = deltioDOM.
	children('.parousiaExcuse').
	text();

	$('<div>').
	addClass('ektiposi-parousiaExcuse').
	text(x).
	appendTo(dom);

	x = deltioDOM.
	children('.parousiaInfo').
	text();

	$('<div>').
	addClass('ektiposi-parousiaInfo').
	text(x).
	appendTo(dom);

	return dom;
};

ektiposi.ipografesDOM = () => {
	let dom = $('<div>').
	addClass('ektiposi-ipografes');

	let ilist = pnd.ofelimoDOM.
	children('.ipografesArea').
	children('.ipografes').
	children();

	let i = ilist.length - 2;

	while (i < 0)
	i++;

	for (; i < ilist.length; i++)
	dom.
	append(ektiposi.ipografiDOM($(ilist[i])));

	return dom;
};

ektiposi.ipografiDOM = (deltioDOM) => {
	let x = deltioDOM.data('checkok');

	let dom = $('<div>').
	addClass('ektiposi-ipografi');

	let katastasiDOM = $('<div>').
	addClass('ektiposi-ipografiKatastasi').
	appendTo(dom);

	if (x)
	katastasiDOM.
	addClass('ektiposi-ipografiKirosi').
	text(x);

	else
	katastasiDOM.
	addClass('ektiposi-ipografiAnamoni');

	x = deltioDOM.
	children('.ipografiTitlos').
	text();

	$('<div>').
	addClass('ektiposi-ipografiTitlos').
	text(x).
	appendTo(dom);

	x = deltioDOM.
	children('.ipografiOnomateponimo').
	text();

	$('<div>').
	addClass('ektiposi-ipografiOnomateponimo').
	text(x).
	appendTo(dom);

	return dom;
};

///////////////////////////////////////////////////////////////////////////////@

return ektiposi;
};
