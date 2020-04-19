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
// www/imerisio/main.js —— Πρόγραμμα οδήγησης σελίδας ελέγχου και διαχείρισης
// παρουσιολογίων.
// @FILE END
//
// @DESCRIPTION BEGIN
// Πρόκειται για το πρόγραμμα οδήγησης της βασικής σελίδας της εφαρμογής
// ελέγχου και διαχείρισης παρουσιολογίων. Ο χρήστης καταχωρεί κριτήρια
// επιλογής με βάση την ημερομηνία και την υπηρεσία και μετά την εμφάνιση
// των παρουσιολογίων που πληρούν τα κριτήρια επιλογής, μπορεί είτε να
// διαχειριστεί κάποιο από τα επιλεγμένα παρουσιολόγια, είτε να δημιουργήσει
// νέο παρουσιολόγιο (συνήθως ως αντίγραφο πρόσφατου σχετικού παρουσιολογίου).
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
require('../mnt/pandora/lib/pandora.js');
require('../mnt/pandora/lib/pandoraJQueryUI.js')(pnd);
const letrak =
require('../lib/letrak.js');
const imerisio = {};

imerisio.misc = {
	'filtraHideTitle': 'Απόκρυψη φίλτρων',
	'filtraShowTitle': 'Εμφάνιση φίλτρων',
};
	

pnd.domInit(() => {
	pnd.
	toolbarSetup().
	fyiSetup().
	ofelimoSetup().
	ribbonSetup().
	domSetup().
	domFixup();

	imerisio.
	selidaSetup();
});

///////////////////////////////////////////////////////////////////////////////@

imerisio.selidaSetup = () => {
	imerisio.
	toolbarSetup().
	ribbonSetup().
	ofelimoSetup();

	return imerisio;
};

imerisio.toolbarSetup = () => {
	letrak.
	toolbarTitlosSetup().
	toolbarXristisSetup();

	if (letrak.noXristis())
	return imerisio;

	pnd.toolbarLeftDOM.
	append(imerisio.filtraTabDOM = letrak.tabDOM().
	append('Φίλτρα').
	on('click', (e) => {
		e.stopPropagation();
		imerisio.filtraToggle(true);
	}));

	return imerisio;
};

imerisio.ribbonSetup = () => {
	letrak.
	ribbonCopyrightSetup();

	return imerisio;
};

///////////////////////////////////////////////////////////////////////////////@

imerisio.ofelimoSetup = () => {
	if (letrak.noXristis())
	return imerisio.welcome();

	pnd.bodyDOM.
	append(imerisio.filtraDOM = $('<div>').
	attr('id', 'filtra'));

	pnd.ofelimoDOM.
	empty().
	append(imerisio.browserDOM = $('<div>').
	addClass('browser'));

	imerisio.
	filtraSetup().
	browserSetup();

	return imerisio;
};

imerisio.filtraSetup = () => {
	imerisio.filtraDOM.

	append($('<div>').
	addClass('filtroPedio').
	append($('<label>').
	attr('for', 'imerominiaFiltro').
	text('Ημερομηνία')).
	append(imerisio.imerominiaFiltroDOM = $('<input>').
	attr('id', 'imerominiaFiltro').
	addClass('pnd-imerominiaInput').
	datepicker())).

	append($('<div>').
	addClass('filtroPedio').
	append($('<label>').
	attr('for', 'ipiresiaFiltro').
	text('Υπηρεσία')).
	append(imerisio.ipiresiaFiltroDOM = $('<input>').
	attr('id', 'ipiresiaFiltro').
	addClass('letrak-ipiresiaInput')));

	imerisio.filtraDOM.dialog({
		'title': 'Κριτήρια επιλογής',
		'autoOpen': false,

		'width': 'auto',
		'height': 'auto',
		'position': {
			'my': 'left+50 top+60',
			'at': 'left top',
		},

		'open': function() {
			imerisio.filtraTabDOM.data('status', 'visible');
			imerisio.filtraToggle();
		},

		'show': {
			'effect': 'drop',
			'direction': 'up',
			'duration': 100,
		},

		'close': function() {
			imerisio.filtraTabDOM.data('status', 'hidden');
			imerisio.filtraToggle();
		},

		'hide': {
			'effect': 'drop',
			'direction': 'up',
			'duration': 100,
		},
	});

	return imerisio;
};

imerisio.filtraToggle = function(act) {
	if (imerisio.filtraDisabled())
	imerisio.filtraEnable(act);

	else
	imerisio.filtraDisable(act);

	return imerisio;
};

imerisio.filtraEnable = function(act) {
	imerisio.filtraTabDOM.
	removeClass('filtraTabOff').
	attr('title', imerisio.misc.filrtaHideTitle);

	if (!act)
	return imerisio;

	imerisio.filtraDOM.dialog('open');
	return imerisio;
};

imerisio.filtraDisable = function(act) {
	imerisio.filtraTabDOM.
	addClass('filtraTabOff').
	attr('title', imerisio.misc.filrtaHideTitle);

	if (!act)
	return imerisio;

	imerisio.filtraDOM.dialog('close');
	return imerisio;
};

imerisio.filtraDisabled = function() {
	return (imerisio.filtraTabDOM.data('status') === 'hidden');
};

imerisio.browserSetup = () => {
	let i;

	for (i = 0; i < 100; i++)
	imerisio.browserDOM.
	append($('<div>').text(i));

	return imerisio;
};

///////////////////////////////////////////////////////////////////////////////@

imerisio.welcome = () => {
	pnd.ofelimoDOM.
	append($('<div>').
	attr('id', 'welcome').
	html(
	'Καλωσήλθατε στην εφαρμογή <b>letrak</b> διαχείρισης ' +
	'παρουσιολογίων. Κάντε κλικ στο πλήκτρο εισόδου που ' +
	'βρίσκεται στο επάνω δεξιά μέρος της σελίδας προκειμένου ' +
	'να ελέγξετε ή να διαχειριστείτε ημερήσια δελτία προσέλευσης ' +
	'και αποχώρησης υπαλλήλων, σύμφωνα με τα διακαιώματα που σας ' +
	'σας έχουν αποδοθεί.'
	));

	return imerisio;
};

///////////////////////////////////////////////////////////////////////////////@
