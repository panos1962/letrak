///////////////////////////////////////////////////////////////////////////////@
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
// www/admin/main.js —— Πρόγραμμα οδήγησης σελίδας διαχείρισης (admin)
// @FILE END
//
// @DESCRIPTION BEGIN
// @DESCRIPTION END
//
// @HISTORY BEGIN
// Updated: 2025-04-01
// Updated: 2025-03-24
// Updated: 2025-01-10
// Updated: 2022-03-11
// Updated: 2022-03-09
// Updated: 2022-03-08
// Updated: 2022-03-07
// Updated: 2022-03-06
// Created: 2022-03-05
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
const admin = {};

// Χρησιμοποιούμε το global singleton "LETRAK" ως μέσο κοινοποίησης constant
// αντικειμένων προκειμένου να είναι αυτά προσπελάσιμα από children windows,
// όπως είναι η σελίδα "prosopa" κλπ.

self.LETRAK = {};

admin.minima = {
	"kritiriaKartaLabel": "Κάρτα",
	"kritiriaEfarmogiLabel": "από",
	"kritiriaKodikosLabel": "Κωδικός",
	"kritiriaEponimoLabel": "Επώνυμο",
	"kritiriaOnomaLabel": "Όνομα",
	"kritiriaPatronimoLabel": "Πατρώνυμο",
	"kritiriaIpemailLabel": "Υπηρεσιακό email",
	"kritiriaPremailLabel": "Προσωπικό email",
	"kritiriaImerominiaLabel": "Ημερομηνία",
};

pnd.domInit(() => {
	if (letrak.noXristis())
	return letrak.arxikiSelida(admin);

	// Πρόσβαση στο γενικό ευρετήριο προσωπικού έχουν όσοι διαθέτουν
	// δικαιώματα "UPDATE" και "ADMIN", ασχέτως υπηρεσίας.

	switch (letrak.xristisProsvasiGet()) {
	case 'UPDATE':
	case 'ADMIN':
		break;
	default:
		self.location = '../mnt/pandora/lib/radioActive.html';
		return admin;
	}

	pnd.
	toolbarSetup().
	fyiSetup().
	ofelimoSetup().
	ribbonSetup().
	domSetup().
	domFixup();

	admin.
	selidaSetup();
});

admin.selidaSetup = () => {
	letrak.
	toolbarTitlosSetup().
	toolbarXristisSetup().
	ribbonCopyrightSetup();

	admin.
	kritiriaSetup().
	ilistSetup().
	elistSetup();

	pnd.bodyDOM.css('display', 'block');

	// Στο σημείο αυτό κανονίζουμε την καθ' ύψος διάσταση του χώρου
	// παρουσίασης των συμβάντων, καθώς επίσης και πώς αυτή η διάσταση
	// θα προσαρμόζεται σε ενδεχόμενες αλλαγές διάστασης της σελίδας.

	pnd.windowDOM.
	on('resize', () => {
		admin.elistSettle();
	});
	admin.elistSettle();

	return admin;
};

///////////////////////////////////////////////////////////////////////////////@

admin.kritiriaSetup = () => {
	pnd.bodyDOM.
	append(admin.kritiriaFormaDOM = $('<div>').
	append($('<form>').
	attr('id', 'kritiriaForma').

	append($('<div>').
	addClass('letrak-inputLine').
	append(admin.kritiriaKartaDOM = $('<label>').
	attr('for', 'kritiriaKarta').
	text(admin.minima.kritiriaKartaLabel)).
	append(admin.kritiriaKartaDOM = $('<input>').
	attr('id', 'kritiriaKarta').
	addClass('kritiriaInput')).

	append(admin.kritiriaEfarmogiDOM = $('<label>').
	attr('for', 'kritiriaEfarmogi').
	attr('id', 'kritiriaEfarmogiLabel').
	text(admin.minima.kritiriaEfarmogiLabel)).
	append(admin.kritiriaEfarmogiDOM = $('<input>').
	attr('id', 'kritiriaEfarmogi').
	attr('tabindex', -1).
	addClass('kritiriaInput'))).

	append($('<div>').
	addClass('letrak-inputLine').
	append(admin.kritiriaKodikosDOM = $('<label>').
	attr('for', 'kritiriaKodikos').
	text(admin.minima.kritiriaKodikosLabel)).
	append(admin.kritiriaKodikosDOM = $('<input>').
	attr('id', 'kritiriaKodikos').
	addClass('kritiriaInput'))).

	append($('<div>').
	addClass('letrak-inputLine').
	append(admin.kritiriaEponimoDOM = $('<label>').
	attr('for', 'kritiriaEponimo').
	text(admin.minima.kritiriaEponimoLabel)).
	append(admin.kritiriaEponimoDOM = $('<input>').
	attr('id', 'kritiriaEponimo').
	addClass('kritiriaInput'))).

	append($('<div>').
	addClass('letrak-inputLine').
	append(admin.kritiriaOnomaDOM = $('<label>').
	attr('for', 'kritiriaOnoma').
	text(admin.minima.kritiriaOnomaLabel)).
	append(admin.kritiriaOnomaDOM = $('<input>').
	attr('id', 'kritiriaOnoma').
	addClass('kritiriaInput'))).

	append($('<div>').
	addClass('letrak-inputLine').
	append(admin.kritiriaPatronimoDOM = $('<label>').
	attr('for', 'kritiriaPatronimo').
	text(admin.minima.kritiriaPatronimoLabel)).
	append(admin.kritiriaPatronimoDOM = $('<input>').
	attr('id', 'kritiriaPatronimo').
	addClass('kritiriaInput'))).

	append($('<div>').
	addClass('letrak-inputLine').
	append(admin.kritiriaIpemailDOM = $('<label>').
	attr('for', 'kritiriaIpemail').
	text(admin.minima.kritiriaIpemailLabel)).
	append(admin.kritiriaIpemailDOM = $('<input>').
	attr('id', 'kritiriaIpemail').
	addClass('kritiriaInput'))).

	append($('<div>').
	addClass('letrak-inputLine').
	append(admin.kritiriaPremailDOM = $('<label>').
	attr('for', 'kritiriaPremail').
	text(admin.minima.kritiriaPremailLabel)).
	append(admin.kritiriaPremailDOM = $('<input>').
	attr('id', 'kritiriaPremail').
	addClass('kritiriaInput'))).

	append($('<div>').
	addClass('letrak-inputLine').
	append($('<label>').
	attr('for', 'kritiriaImerominia').
	text(admin.minima.kritiriaImerominiaLabel)).
	append(admin.kritiriaImerominiaDOM = $('<input>').
	attr('id', 'kritiriaImerominia').
	addClass('kritiriaInput').
	datepicker())).

	append($('<div>').
	addClass('letrak-formaPanel').

	append($('<input>').
	addClass('letrak-formaPliktro').
	attr({
		'type': 'submit',
		'value': letrak.minima.ipovoliPliktroLabel,
	}).
	on('click', (e) => admin.kritiriaFormaIpovoli(e))).

	append($('<input>').
	addClass('letrak-formaPliktro').
	attr({
		'type': 'button',
		'value': letrak.minima.clearPliktroLabel,
	}).
	on('click', (e) => admin.kritiriaFormaClear(e))))));

	admin.kritiriaFormaDOM.dialog({
		'title': 'Κριτήρια επιλογής',
		'autoOpen': true,
		'closeOnEscape': false,
		'draggable': false,
		'resizable': false,

		'width': 'auto',
		'height': 'auto',
		'position': {
			'my': 'left+10 top+63',
			'at': 'left top',
		},
	});

	let kritiriaDialogDOM = admin.kritiriaFormaDOM.closest('.ui-dialog');

	kritiriaDialogDOM.
	find('.ui-dialog-titlebar-close').
	css('display', 'none');

	kritiriaDialogDOM.
	find('.ui-dialog-title').
	css('text-align', 'center');

	setTimeout(() => {
		admin.kritiriaKartaDOM.focus();
	}, 0);

	pnd.ofelimoDOM.
	on('mouseover', '.ilistRow', function(e) {
		e.stopPropagation();
		$(this).addClass('candiRow');
	}).
	on('mouseleave', '.ilistRow', function(e) {
		e.stopPropagation();

		if ($(this).data('epilogi'))
		return;

		$(this).removeClass('candiRow');
	}).
	on('click', '.ilistRow', function(e) {
		e.stopPropagation();

		let x = admin.ilist[$(this).data('ord')];
		let y = admin.ilist[$(this).data('idx')];

		$('.candiRow').
		removeData('epilogi').
		removeClass('candiRow');

		$(this).
		data('epilogi', true).
		addClass('candiRow');

		admin.kritiriaKartaDOM.val(x.karta);
		admin.kritiriaEfarmogiDOM.val(x.efarmogi);
		admin.kritiriaKodikosDOM.val(y.ipalilos);
		admin.kritiriaEponimoDOM.val(y.eponimo);
		admin.kritiriaOnomaDOM.val(y.onoma);
		admin.kritiriaPatronimoDOM.val(y.patronimo);
		admin.kritiriaIpemailDOM.val(y.ipemail);
		admin.kritiriaPremailDOM.val(y.premail);

		pnd.fyiMessage('Επιλογή συμβάντων…');
		$.post({
			'url': 'epilogiEvent.php',
			'data': {
				"karta": x.karta,
				"imerominia": admin.kritiriaImerominiaDOM.val(),
			},
			'success': (rsp) => admin.parseEvent(rsp),
			'error': (e) => {
				pnd.fyiError('Αδυναμία επιλογής συμβάντων');
				console.error(e);
			},
		});
	});

	pnd.bodyDOM.
	on('click', '.elistRow', function(e) {
		e.stopPropagation();
		admin.kritiriaImerominiaDOM.
		val($(this).data('d')).
		trigger('change');
	}).
	on('click', '#kritiriaForma', function(e) {
		e.stopPropagation();
		admin.
		elistClear().
		kritiriaFormaDOM.
		removeClass('kritiriaFormaEconomy');
	});

	admin.kritiriaImerominiaDOM.
	on('change', function(e) {
		e.stopPropagation();
		admin.ilistTbodyDOM.
		children('.candiRow').trigger('click');
	});

	return admin;
};

admin.kritiriaFormaFlist = {
	"Karta": 1,
	"Efarmogi": 0,
	"Kodikos": 1,
	"Eponimo": 1,
	"Onoma": 1,
	"Patronimo": 1,
	"Ipemail": 1,
	"Premail": 1,
	"Imerominia": 0,
};

admin.kritiriaFormaIpovoli = (e) => {
	e.stopPropagation();
	pnd.fyiClear();

	let fld;
	let fldDOM;
	let data = {};
	let err = undefined;

	for (fld in admin.kritiriaFormaFlist) {
		fldDOM = admin['kritiria' + fld + 'DOM'];
		data[fld] = fldDOM.val().trim();
		fldDOM.val(data[fld]);
	}

	if (!data['Kodikos'].match(/^[0-9]{0,8}$/))
	err = admin.kritiriaKodikosDOM;

	if (!data['Karta'].match(/^[0-9]{0,8}$/))
	err = admin.kritiriaKartaDOM;

	if (err) {
		pnd.fyiError('Λανθασμένο κριτήριο');
		err.select().focus();
		return false;
	}

	admin.kritiriaKartaDOM.focus();

	if (data["Karta"])
	data["Karta"] = parseInt(data["Karta"]);

	if (data["Kodikos"])
	data["Kodikos"] = parseInt(data["Kodikos"]);

	admin.epilogiIpalilos(data);

	return false;
};

admin.kritiriaFormaClear = (e) => {
	e.stopPropagation();

	admin.
	elistClear().
	kritiriaFormaDOM.removeClass('kritiriaFormaEconomy');

	for (let fld in admin.kritiriaFormaFlist)
	admin['kritiria' + fld + 'DOM'].val('');

	admin.kritiriaKartaDOM.val('').focus();
	pnd.fyiClear();
	return admin;
};

///////////////////////////////////////////////////////////////////////////////@

admin.ilistSetup = () => {
	admin.ilistDOM = $('#ilist');
	pnd.ofelimoDOM.append(admin.ilistDOM);
	admin.ilistTbodyDOM = $('#ilistTbody');

	return admin;
}

///////////////////////////////////////////////////////////////////////////////@

admin.elistSetup = () => {
	pnd.ofelimoDOM.
	append(admin.elistDOM = $('<div>').
	attr('id', 'elist').
	append(admin.elistTableDOM = $('<table>')));

	return admin;
}

admin.elistSettle = () => {
	let oh = pnd.ofelimoDOM.innerHeight();
	let kh = admin.kritiriaFormaDOM.
		closest('.ui-dialog').outerHeight(true);

	kh -= 100;	// economy
	admin.elistDOM.css('max-height', (60 + oh - kh - 35) + 'px');

	return admin;
};

admin.elistClear = () => {
	admin.elistDOM.css('display', '');
	admin.elistTableDOM.empty();

	return admin;
};

admin.parseEvent = (rsp) => {
	let elist;

	pnd.fyiClear();
	admin.elistClear();

	try {
		if (rsp.hasOwnProperty('error')) {
			pnd.fyiError(rsp.error);
			return admin;
		}

		elist = rsp.elist;
	} catch (e) {
		console.error(e);
		pnd.fyiError('Internal error');
		return admin;
	}

	if (elist.length <= 0) {
		pnd.fyiError('Δεν βρέθηκαν συμβάντα');
		return admin;
	}

	for (let i = 0; i < elist.length; i++) {
		let x = elist[i];

		admin.elistTableDOM.
		append($('<tr>').
		data('d', x.i.replace(/ .*/, '')).
		addClass('elistRow').
		append($('<td>').
		text(x.i)).
		append($('<td>').
		text(x.e)).
		append($('<td>').
		text(x.r)));
	}

	admin.elistDOM.
	css('display', 'block').
	scrollTop(0);

	admin.kritiriaFormaDOM.
	addClass('kritiriaFormaEconomy');

	return admin;
}

///////////////////////////////////////////////////////////////////////////////@

admin.epilogiIpalilos = (data) => {
	pnd.fyiMessage('Επιλογή υπαλλήλων…');
	$.post({
		'url': 'epilogiIpalilos.php',
		'data': data,
		'success': (rsp) => admin.parseIpalilos(rsp),
		'error': (e) => {
			pnd.fyiError('Αδυναμία επιλογής υπαλλήλων');
			console.error(e);
		},
	});

	return admin;
};

admin.parseIpalilos = (rsp) => {
	pnd.fyiClear();

	admin.ilistDOM.css('display', 'none');
	admin.ilistTbodyDOM.empty();
	admin.elistClear();
	admin.ilist = [];

	try {
		if (rsp.hasOwnProperty('error')) {
			pnd.fyiError(rsp.error);
			return admin;
		}

		admin.ilist = rsp.ilist;
	} catch (e) {
		console.error(e);
		pnd.fyiError('Internal error');
		return admin;
	}

	let prev = undefined;
	let idx = undefined;

	for (let i = 0; i < admin.ilist.length; i++) {
		let x = admin.ilist[i];

		for (let j in x) {
			if (x[j] === null)
			x[j] = '';
		}

		let kartaClass = 'ilistKarta';

		if (x.ipalilos === prev) {
			x.ipalilos = '';
			x.eponimo = '';
			x.onoma = '';
			x.patronimo = '';
			x.ipemail = '';
			x.premail = '';
			kartaClass += ' ilistKartaOld';
		}
		else {
			prev = x.ipalilos;
			idx = i;
		}

		let ipemailClass = 'ilistIpemail';
		let premailClass = 'ilistPremail';

		let ipemail = x.ipemail;
		let premail = x.premail;

		if (ipemail) {
			if (!ipemail.match(/@thessaloniki[.]gr/))
			ipemailClass += ' invalidEmail';
		}
		else {
			if (premail.match(/@thessaloniki[.]gr$/))
			premailClass += ' invalidEmail';
		}

		$('<tr>').
		data('ord', i).
		data('idx', idx).
		addClass('ilistRow').

		append($('<td>').
		addClass('ilistKodikos').
		text(x.ipalilos)).

		append($('<td>').
		addClass('ilistEponimo').
		text(x.eponimo)).

		append($('<td>').
		addClass('ilistOnoma').
		text(x.onoma)).

		append($('<td>').
		addClass('ilistPatronimo').
		text(x.patronimo.substr(0, 3))).

		append($('<td>').
		addClass(kartaClass).
		text(x.karta)).

		append($('<td>').
		addClass(ipemailClass).
		text(x.ipemail.replace(/@thessaloniki.gr$/, ''))).

		append($('<td>').
		addClass(premailClass).
		text(x.premail)).

		appendTo(admin.ilistTbodyDOM);
	}

	admin.ilistDOM.css('display', 'block');
	return admin;
};
