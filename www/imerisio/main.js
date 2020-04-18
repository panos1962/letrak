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
	toolbarCenterSetup().
	xristisSetup();

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
	ribbonRightSetup();

	return imerisio;
};

///////////////////////////////////////////////////////////////////////////////@

imerisio.ofelimoSetup = () => {
	if (letrak.noXristis())
	return imerisio.welcome();

	pnd.bodyDOM.
	append(imerisio.panelDOM = $('<div>').
	attr('id', 'panel'));

	pnd.ofelimoDOM.
	append(imerisio.browserDOM = $('<div>').
	addClass('browser'));

	imerisio.
	panelSetup().
	browserSetup();

let i;
for (i = 0; i < 100; i++)
imerisio.browserDOM.
append($('<div>').text(i));

	return imerisio;
};

imerisio.panelSetup = () => {
	imerisio.panelDOM.

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

	imerisio.panelDOM.dialog({
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
