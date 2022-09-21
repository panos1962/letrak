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
// www/diafores/main.js —— Πρόγραμμα οδήγησης σελίδας εμφάνισης διαφορών
// παρουσιολογίων.
// @FILE END
//
// @DESCRIPTION BEGIN
// @DESCRIPTION END
//
// @HISTORY BEGIN
// Updated: 2022-09-21
// Created: 2022-09-17
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

const diafores = {};
const ektiposi =
require('./ektiposi.js')(pnd, letrak, diafores);

(() => {
	if (!self.opener)
	return diafores;

	return diafores;
})();

pnd.domInit(() => {
	pnd.
	toolbarSetup().
	fyiSetup().
	ofelimoSetup().
	ribbonSetup().
	domSetup().
	domFixup();

	diafores.
	selidaSetup();

	window.onbeforeprint = ektiposi.before;
	window.onafterprint = ektiposi.after;
});

///////////////////////////////////////////////////////////////////////////////@

diafores.selidaSetup = () => {
	ektiposi.setup();
	letrak.
	toolbarTitlosSetup('<b>Διαφορές Παρουσιολογίων</b>').
	toolbarXristisSetup().
	ribbonCopyrightSetup();

	if (letrak.noXristis())
	return pnd.fyiError('Διαπιστώθηκε ανώνυμη χρήση');

	pnd.
	keepAlive('../mnt/pandora');

	if (!(diafores.tre = php.getGet("tre")))
	return pnd.fyiError('Ακαθόριστο τρέχον παρουσιολόγιο');

	if (!(diafores.pro = php.getGet("pro")))
	return pnd.fyiError('Ακαθόριστο προηγούμενο παρουσιολόγιο');

	$.post({
		'url': 'diaforesGet.php',
		'data': {
			"tre": diafores.tre,
			"pro": diafores.pro,
		},
		'dataType': 'json',
		'success': (rsp) => diafores.diaforesProcess(rsp),
		'error': (e) => {
			pnd.fyiError('Σφάλμα ανίχνευσης διαφορών');
			console.error(e);
		},
	});

	return diafores;
};

diafores.diaforesProcess = (rsp) => {
console.log(rsp);
};
