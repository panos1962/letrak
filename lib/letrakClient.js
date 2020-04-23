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

pnd.objectWalk({
	'arxikiSelidaLabel': 'Αρχική',
	'isodosSelidaLabel': 'Είσοδος',
	'imerisioSelidaLabel': 'Παρουσιολόγια',
	'exodosPliktroLabel': 'Έξοδος',
	'ipovoliPliktroLabel': 'Υποβολή',
	'clearPliktroLabel': 'Καθαρισμός',
	'cancelPliktroLabel': 'Άκυρο',
}, (v, k) => {
	letrak.minima[k] = v;
});

///////////////////////////////////////////////////////////////////////////////@

// Στο session item "letrak_session_ipalilos" αποθηκεύουμε τα στοιχεία του
// υπαλλήλου που τρέχει την εφαρμογή, εφόσον διαπιστώσουμ επώνυμη χρήση.
// Η function "isXristis" επιστρέφει ακριβώς αυτό το στοιχείο από το
// session cookie. Αν το στοιχείο υπάρχει θεωρούμε ότι έχουμε επώνυμη
// χρήση της εφαρμογής, αλλιώς έχουμε ανώνυμη χρήση.

letrak.xristisSetup = () => {
	letrak.xristis = undefined;
	let x = php.sessionGet(php.defs['LETRAK_SESSION_IPALILOS']);

	if (!x)
	return letrak;

	try {
		letrak.xristis = JSON.parse(x);
	}

	catch (e) {
		console.error(e);
		letrak.xristis = undefined;
	}

	return letrak;
};

letrak.xristisSetup();

letrak.isXristis = () => letrak.xristis;

letrak.noXristis = () => !letrak.isXristis();

letrak.xristisIpiresiaGet = () => {
	if (letrak.noXristis())
	return undefined;

	if (typeof(letrak.xristis.ipiresia) !== 'string')
	return undefined;

	return letrak.xristis.ipiresia;
};

letrak.xristisProsvasiGet = () => {
	if (letrak.noXristis())
	return undefined;

	return letrak.xristis.prosvasi;
};

letrak.prosvasiIsUpdate = (ipiresia) => {
	let x = letrak.xristisProsvasiGet();

	if (x === 'ADMIN')
	return true;

	if (x !== 'UPDATE')
	return false;

	x = letrak.ipiresiaGet();

	if (x === undefined)
	return false;

	let l = x.length();

	if (l === 0)
	return true;

	return (ipiresia.substr(0, l) === x)
};

letrak.prosvasiOxiUpdate = (ipiresia) => !letrak.prosvasiIsUpdate(ipiresia);

letrak.prosvasiIsView = (ipiresia) => {
	let x = letrak.xristisProsvasiGet();

	if (x === 'ADMIN')
	return true;

	x = letrak.ipiresiaGet();

	if (x === undefined)
	return false;

	let l = x.length();

	if (l === 0)
	return true;

	return (ipiresia.substr(0, l) === x)
};

letrak.prosvasiOxiView = (ipiresia) => !letrak.prosvasiIsView(ipiresia);

///////////////////////////////////////////////////////////////////////////////@

// Η function "toolbarXristisSetup" καλείται συνήθως από την "toolbarSetup"
// και σκοπό έχει την εμφάνιση στη δεξιά πλευρά του toolbar των tabs που
// αφορούν στην επώνυμη ή ανώνυμη χρήση της εφαρμογής.

letrak.toolbarXristisSetup = () => {
	if (letrak.isXristis())
	letrak.toolbarXristisSetupYes();

	else
	letrak.toolbarXristisSetupNo();

	return letrak;
};

letrak.toolbarXristisSetupYes = () => {
	letrak.
	toolbarXristisProsvasiSetup().
	toolbarXristisIpiresiaSetup();

	pnd.toolbarRightDOM.
	append(letrak.tabDOM().
	append($('<div>').
	addClass('letrak-toolbarIpalilosKodikos').
	text(letrak.xristis.kodikos)).
	append($('<div>').
	addClass('letrak-toolbarIpalilosOnomateponimo').
	text(letrak.xristis.onomateponimo))).
	append(letrak.tabDOM().
	text(letrak.minima.exodosPliktroLabel).
	on('click', (e) => letrak.exodos(e)));

	return letrak;
};

letrak.toolbarXristisProsvasiSetup = () => {
	let ipi = letrak.xristisIpiresiaGet();
	let pro = letrak.xristisProsvasiGet();
	let cls = 'letrak-prosvasiTab';
	let tit;

	if (ipi === null)
	ipi = undefined;

	else if (typeof(ipi) !== 'string')
	ipi = undefined;

	if (ipi === undefined)
	tit = 'στα προσωπικά του στοιχεία';

	else if (ipi !== '')
	tit = 'στην υπηρεσία "' + ipi + '"';

	else
	tit = 'σε ΟΛΕΣ τις υπηρεσίες!';

	switch (pro) {
	case 'VIEW':
		tit = 'Ο χρήστης έχει δικαιώματα θέασης ' + tit;
		break;
	case 'UPDATE':
		tit = 'Ο χρήστης έχει δικαιώματα ενημέρωσης' + tit;
		break;
	case 'ADMIN':
		tit = 'With great power comes great responsibility!';
		break;
	default:
		return imerisio;
	}

	pnd.toolbarRightDOM.
	append(letrak.tabDOM().
	attr('title', tit).
	addClass(cls + ' letrak-prosvasiTab' + pro).
	html(pro));

	return letrak;
};

letrak.toolbarXristisIpiresiaSetup = () => {
	let x = letrak.xristisIpiresiaGet();

	// Αν δεν έχει καθοριστεί κωδικός υπηρεσίας για τα δικαιώματα του
	// χρήστη (πεδίο "erpota"."prosvasi"."ipiresia" is null), τότε ο
	// χρήστης έχει δικαιώματα μόνο για στοιχεία που αφορούν τον ίδιο
	// προσωπικά. Σ' αυτήν την περίπτωση δεν εμφανίζουμε σχετικό tab
	// στο toolbar.

	if (x === undefined)
	return letrak;

	// Έχει καθοριστεί κωδικός υπηρεσίας επομένως θα πρέπει να
	// εμφανίζουμε το σχετικό tab.

	let tabDOM = letrak.tabDOM().
	appendTo(pnd.toolbarRightDOM);

	// Αν ο κωδικός υπηρεσίας έχει καθοριστεί αλλά είναι κενός, τότε
	// σημαίνει ότι ο χρήστης έχει δικαιώματα σε όλες τις υπηρεσίες
	// του Δήμου, καθώς ο κωδικός που αναγράφεται στο πεδίο "ipiresia"
	// του πίνακα "erpota"."prosvasi" είναι το ελάχιστο τμήμα κωδικού
	// υπηρεσιών στις οποίες έχει πρόσβαση ο χρήστης, π.χ. αν το πεδίο
	// φέρει τιμή "Γ08" σημαίνει ότι ο χρήστης έχει πρόσβαση σε όλες τις
	// υπηρεσίες των οποίων ο κωδικός αρχίζει με "Γ08", όπως "Γ080001",
	// "Γ080002" κοκ. Στην περίπτωση, λοιπόν, που ο κωδικός είναι κενός
	// σημαίνει ότι ο χρήστης έχει δικαιώματα σε όλες τις υπηρεσίες και
	// αντί να αναγράφεται ο συγκεκριμένος κωδικός στο σχετικό tab,
	// εμφανίζουμε το σύμβολο της υδρογείου (globe).

	if (x === '')
	tabDOM.
	attr('title', 'Τα δικαιώματα του χρήστη αφορούν σε όλες τις υπηρεσίες').
	html('&#x1f310;');

	else
	tabDOM.
	attr('title', 'Τα δικαιώματα του χρήστη αφορούν στην υπηρεσία ' + x).
	text(x);

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

letrak.exodos = (e) => {
	e.stopPropagation();

	let list = {};
	list[php.defs['LETRAK_SESSION_IPALILOS']] = true;

	$.post({
		'url': '/letrak/mnt/pandora/lib/session.php',
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

letrak.toolbarArxikiSetup = () => {
	pnd.toolbarLeftDOM.
	append(letrak.tabDOM().
	text(letrak.minima.arxikiSelidaLabel).
	on('click', (e) => letrak.arxikiSelida()));

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

letrak.arxikiSelida = (x) => {
	if (!x)
	x = letrak;

	self.location = '/letrak';
	return x;
};

///////////////////////////////////////////////////////////////////////////////@
