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
// lib/letrakClient.js —— "letrak" javascript API (client module)
// @FILE END
//
// @DESCRIPTION BEGIN
// @DESCRIPTION END
//
// @HISTORY BEGIN
// Updated: 2020-04-19
// Updated: 2020-04-18
// Updated: 2020-04-17
// Created: 2020-04-09
// @HISTORY END
//
// @END
//
///////////////////////////////////////////////////////////////////////////////@

"use strict";

const pnd =
require('../mnt/pandora/lib/pandoraClient.js');
const letrak =
require('./letrakCore.js');
module.exports = letrak;

///////////////////////////////////////////////////////////////////////////////@

// Στο session item "letrak_session_ipalilos" αποθηκεύουμε τα στοιχεία του
// υπαλλήλου που τρέχει την εφαρμογή, εφόσον διαπιστώσουμ επώνυμη χρήση.
// Η function "isXristis" επιστρέφει ακριβώς αυτό το στοιχείο από το
// session cookie. Αν το στοιχείο υπάρχει θεωρούμε ότι έχουμε επώνυμη
// χρήση της εφαρμογής, αλλιώς έχουμε ανώνυμη χρήση.

letrak.isXristis = () => php.sessionGet(php.defs['LETRAK_SESSION_IPALILOS']);
letrak.noXristis = () => !letrak.isXristis();

///////////////////////////////////////////////////////////////////////////////@

// Η function "toolbarXristisSetup" καλείται συνήθως από την "toolbarSetup"
// και σκοπό έχει την εμφάνιση στη δεξιά πλευρά του toolbar των tabs που
// αφορούν στην επώνυμη ή ανώνυμη χρήση της εφαρμογής.

letrak.toolbarXristisSetup = () => {
	let ipalilos = letrak.isXristis();

	if (ipalilos)
	letrak.toolbarXristisSetupYes(ipalilos);

	else
	letrak.toolbarXristisSetupNo();

	return letrak;
};

letrak.toolbarXristisSetupYes = (ipalilos) => {
	if (typeof(ipalilos) === 'string')
	ipalilos = JSON.parse(ipalilos);

	if (ipalilos.prosvasi)
	pnd.toolbarRightDOM.
	append(letrak.tabDOM().
	html(ipalilos.prosvasi));

	if (ipalilos.ipiresia)
	pnd.toolbarRightDOM.
	append(letrak.tabDOM().
	html(ipalilos.ipiresia));

	pnd.toolbarRightDOM.
	append(letrak.tabDOM().
	append($('<div>').
	addClass('letrak-toolbarIpalilosKodikos').
	text(ipalilos.kodikos)).
	append($('<div>').
	addClass('letrak-toolbarIpalilosOnomateponimo').
	text(ipalilos.onomateponimo))).
	append(letrak.tabDOM().
	text('Έξοδος').
	on('click', (e) => {
		e.stopPropagation();

		let list = {};
		list[php.defs['LETRAK_SESSION_IPALILOS']] = true;

		$.post({
			'url': '../mnt/pandora/lib/session.php',
			'data': {
				'unset': true,
				'list': list,
			},
			'success': () => self.location = '/letrak',
			'error': (e) => {
				pnd.fyiError('Αδυναμία εξόδου');
				console.error(e);
			},
		});
	}));

	return letrak;
};

letrak.toolbarXristisSetupNo = () => {
	pnd.toolbarRightDOM.
	append(letrak.tabDOM().
	append('Είσοδος').
	on('click', (e) => {
		e.stopPropagation();
		self.location = '/letrak/isodos';
	}));

	return letrak;
};

///////////////////////////////////////////////////////////////////////////////@

letrak.toolbarTitlosSetup = (titlos) => {
	if (!titlos)
	titlos = 'Παρουσιολόγια';

	pnd.toolbarCenterDOM.
	append($('<div>').
	addClass('letrak-toolbarTitlos').
	text(titlos));

	return letrak;
};

letrak.ribbonCopyrightSetup = () => {
	pnd.ribbonRightDOM.
	append($('<div>').
	addClass('letrak-ribbonCopyright').
	html('Copyright &copy; 2020- Δήμος Θεσσαλονίκης'));

	return letrak;
};

///////////////////////////////////////////////////////////////////////////////@

letrak.tabDOM = () => {
	return $('<div>').
	addClass('letrak-toolbarTab');
};

///////////////////////////////////////////////////////////////////////////////@
