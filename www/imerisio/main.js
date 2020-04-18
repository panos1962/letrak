"use strict";

const pnd =
require('../mnt/pandora/lib/pandora.js');
require('../mnt/pandora/lib/pandoraJQueryUI.js')(pnd);
const letrak =
require('../lib/letrak.js');
const imerisio = {};

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
	toolbarCenterSetup().
	xristisSetup();

	return imerisio;
};

imerisio.ribbonSetup = () => {
	letrak.
	ribbonRightSetup();

	return imerisio;
};

imerisio.ofelimoSetup = () => {
	if (letrak.noXristis())
	return imerisio.welcome();

	pnd.ofelimoDOM.
	append(imerisio.panelDOM = $('<div>').
	addClass('panel').
	text('Panel')).
	append(imerisio.browserDOM = $('<div>').
	addClass('browser').
	text('Imerisio'));

let i;
for (i = 0; i < 100; i++)
imerisio.browserDOM.
append($('<div>').text(i));

	return imerisio;
};

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
