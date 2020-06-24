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
	text(ektiposi.titlosGet()))).

	append($('<div>').
	addClass('ektiposi-deltioPerigrafi').
	html(prosopa.deltio.kodikosGet() + '.&nbsp;' +
		prosopa.deltio.perigrafiGet()))).

	append($('<div>').
	addClass('ektiposi-deltioDexia').

	append($('<div>').
	addClass('ektiposi-deltioImerominia').
	text(prosopa.deltioAreaDOM.find('.deltioImerominia').text())));

	return ektiposi;
};

ektiposi.prosopa = () => {
	let plist = prosopa.browserDOM.children();
	let count = 0;

	// Επιτελούμε καταμέτρηση των εκτυπώσιμων παρουσιών. Αυτό κρίνεται
	// απαραίτητο προκειμένου να αποφύγουμε «ορφανές» γραμμές στο τέλος
	// της εκτύπωσης.

	plist.each(function() {
		if (ektiposi.isEktiposimiParousia($(this)))
		count++;
	});

	let parea = ektiposi.bodyDOM;
	let aa = 0;

	plist.each(function() {
		if (ektiposi.oxiEktiposimiParousia($(this)))
		return;

		aa++;
		count--;

		// Αν έχει απομείνει μικρό πλήθος παρουσιών προς εκτύπωση,
		// φροντίζουμε αυτές οι παρουσίες μαζί με τις υπογραφές
		// να τοποθετηθούν σε αδιάσπαστο wrapper προκειμένου να
		// αποφύγουμε φαινόμενα «ορφανών» γραμμών στο τέλος της
		// εκτύπωσης.

		if (count == 4)
		parea = $('<div>').
		addClass('ektiposi-parousiaWrapper').
		addClass('pnd-idiaSelida').
		appendTo(parea);

		ektiposi.parousiaDOM($(this), aa).
		appendTo(parea);
	});

	parea.
	append(ektiposi.ipografesDOM());
};

ektiposi.isEktiposimiParousia = (dom) => {
	switch (ektiposi.ektipotiko) {
	case 'Apontes':
		let parousia = dom.data('parousia');

		if (!parousia)
		return false;

		if (parousia.excuseGet())
		return false;

		if (parousia.meraoraGet())
		return false;

		return true;
	}

	return true;
};

ektiposi.titlosGet = () => {
	switch (ektiposi.ektipotiko) {
	case 'Apontes':
		return 'ΔΕΛΤΙΟ ΑΠΟΝΤΩΝ';
	}

	return 'Δελτίο ' + prosopa.deltio.prosapoGet() + 'Σ Εργαζομένων';
};

ektiposi.oxiEktiposimiParousia = (dom) => !ektiposi.isEktiposimiParousia(dom);

ektiposi.parousiaDOM = (deltioDOM, aa) => {
	let dom = $('<div>').
	addClass('ektiposi-parousia');

	$('<div>').
	addClass('ektiposi-parousiaOrdinal').
	text(aa).
	appendTo(dom);

	let x = deltioDOM.
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
	addClass('ektiposi-parousiaMeraora' + ektiposi.ektipotiko).
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
	addClass('ektiposi-parousiaInfo' + ektiposi.ektipotiko).
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

ektiposi.deltioAponton = (e) => {
	prosopa.ergaliaDOM.dialog('close');
	ektiposi.ektipotiko = 'Apontes';
	window.print();
	delete ektiposi.ektipotiko;
};

///////////////////////////////////////////////////////////////////////////////@

return ektiposi;
};
