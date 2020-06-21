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
	deltio().
	prosopa();

	return ektiposi;
};

ektiposi.deltio = () => {
	$('<div>').
	addClass('ektiposi-deltio').

	append($('<div>').
	addClass('ektiposi-deltioKodikos').
	text(prosopa.deltio.kodikosGet())).

	appendTo(ektiposi.bodyDOM);

	return ektiposi;
};

ektiposi.prosopa = () => {
	let prosopaDOM = $('<div>').
	addClass('ektiposi-prosopa').
	appendTo(ektiposi.bodyDOM);

for (let i = 0; i < 4; i++) {
	prosopa.browserDOM.
	children().
	each(function() {
		let parousiaWrapperDOM = $('<div>').
		addClass('ektiposi-parousiaWrapper').
		addClass('pnd-idiaSelida').
		appendTo(prosopaDOM);

		let parousiaDOM = $('<div>').
		addClass('ektiposi-parousia').
		appendTo(parousiaWrapperDOM);

		let x = $(this).
		children('.parousiaOrdinal').
		text();

		$('<div>').
		addClass('ektiposi-parousiaOrdinal').
		text(x).
		appendTo(parousiaDOM);

		x = $(this).
		children('.parousiaIpalilos').
		text();

		$('<div>').
		addClass('ektiposi-parousiaIpalilos').
		text(x).
		appendTo(parousiaDOM);

		x = $(this).
		children('.parousiaOnomateponimo').
		text();

		$('<div>').
		addClass('ektiposi-parousiaOnomateponimo').
		text(x).
		appendTo(parousiaDOM);

		x = $(this).
		children('.parousiaOrario').
		text();

		$('<div>').
		addClass('ektiposi-parousiaOrario').
		text(x).
		appendTo(parousiaDOM);

		x = $(this).
		children('.parousiaMeraora').
		text();

		$('<div>').
		addClass('ektiposi-parousiaMeraora').
		text(x).
		appendTo(parousiaDOM);

		x = $(this).
		children('.parousiaExcuse').
		text();

		$('<div>').
		addClass('ektiposi-parousiaExcuse').
		text(x).
		appendTo(parousiaDOM);

		x = $(this).
		children('.parousiaInfo').
		text();

		$('<div>').
		addClass('ektiposi-parousiaInfo').
		text(x).
		appendTo(parousiaDOM);
	});
}
};
///////////////////////////////////////////////////////////////////////////////@

return ektiposi;
};
