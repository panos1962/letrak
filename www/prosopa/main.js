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
// www/prosopa/main.js —— Πρόγραμμα οδήγησης σελίδας επεξεργασίας
// παρουσιολογίου.
// @FILE END
//
// @DESCRIPTION BEGIN
// @DESCRIPTION END
//
// @HISTORY BEGIN
// Created: 2020-04-24
// @HISTORY END
//
// @END
//
///////////////////////////////////////////////////////////////////////////////@

"use strict";

const pnd =
require('../mnt/pandora/lib/pandora.js');
require('../mnt/pandora/lib/pandoraJQueryUI.js')(pnd);
const letrak =
require('../lib/letrak.js');

// Αν η σελίδα έχει εκκινήσει από τη σελίδα διαχείρισης παρουσιολογίων, τότε
// θέτω το "imr" να δείχνει σε globas που έχουν οριστεί στην εν λόγω σελίδα
// προκειμένου να μπορούμε να επιτελέσουμε διάφορες ενέργειες και σε αυτή τη
// σελίδα.

const imr = (self.opener && self.opener.hasOwnProperty('LETRAK') &&
	self.opener.LETRAK.imerisio) ? self.opener.LETRAK : undefined;

const prosopa = {};

prosopa.minima = {
	'imerisioAkathoristo': 'Ακαθόριστο παρουσιολόγιο',
};

pnd.domInit(() => {
	prosopa.opener
	pnd.
	toolbarSetup().
	fyiSetup().
	ofelimoSetup().
	ribbonSetup().
	domSetup().
	domFixup();

	prosopa.
	selidaSetup();
});

prosopa.selidaSetup = () => {
	letrak.
	toolbarTitlosSetup('<b>Επεξεργασία Παρουσιολογίου</b>').
	toolbarXristisSetup().
	ribbonCopyrightSetup();

	let x = php.requestGet('imerisio');

	if (!x) {
		pnd.fyiError(prosopa.minima.imerisioAkathoristo);
		return prosopa;
	}

	letrak.
	toolbarTitlosSet('Παρουσιολόγιο <b>' + x + '</b>');

	if (letrak.noXristis())
	return prosopa.fyiError('Διαπιστώθηκε ανώνυμη χρήση');

	pnd.
	keepAlive('../mnt/pandora');

	pnd.ofelimoDOM.
	append(x);

	prosopa.
	imerisioSetup(x);

	return prosopa;
};

prosopa.imerisioSetup = (kodikos) => {
	let imerisio;

	if (imr && imr.hasOwnProperty('imerisioROW') &&
	(imr.imerisioROW.kodikosGet() != kodikos))
	return prosopa.fyiError('Προβληματικό παρουσιολόγιο');

	$.post({
		'url': 'prosopa.php',
		'dataType': 'json',
		'data': {
			'imerisio': kodikos,
		},
		'success': (rsp) => {
			if (rsp.error)
			return pnd.fyiError(rsp.error);

			prosopa.imerisioCheck(kodikos, rsp.imerisio);
		},
		'error': (err) => {
			pnd.fyiError('Αδυναμία λήψης στοιχείων παρουσιολογίου');
			console.error(err);
		},
	});

console.log(imr.imerisioROW);
imr.imerisioDOM.css('background-color', 'red');

	return prosopa;
};

prosopa.imerisioCheck = (kodikos, imerisio) => {
	imerisio = new letrak.imerisio(imerisio);
	console.log(kodikos, imerisio);

	return prosopa;
};

///////////////////////////////////////////////////////////////////////////////@

prosopa.fyiMessage = (s) => {
	pnd.fyiMessage(s);
	return prosopa;
};

prosopa.fyiError = (s) => {
	pnd.fyiError(s);
	return prosopa;
};
