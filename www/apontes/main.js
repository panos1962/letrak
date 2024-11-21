///////////////////////////////////////////////////////////////////////////////@
//
// @BEGIN
//
// @COPYRIGHT BEGIN
// Copyright (C) 2024 Panos I. Papadopoulos <panos1962_AT_gmail_DOT_com>
// @COPYRIGHT END
//
// @FILETYPE BEGIN
// javascipt
// @FILETYPE END
//
// @FILE BEGIN
// www/apontes/main.js —— Πρόγραμμα οδήγησης σελίδας εμφάνισης απόντων
// ημέρας.
// @FILE END
//
// @DESCRIPTION BEGIN
// Το παρόν πρόγραμμα οδηγεί τη σελίδα παρουσίασης απόντων ημέρας του δελτίου
// αποχώρησης του οποίου ο κωδικός έχει περαστεί στη σελίδα ως παράμετρος με
// ονομασία "deltio".
// @DESCRIPTION END
//
// @HISTORY BEGIN
// Updated: 2024-11-21
// Updated: 2024-11-20
// Updated: 2024-11-14
// Updated: 2024-11-08
// Created: 2024-11-07
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

const apontes = {};

apontes.minima = {
	'apantesParontes': 'Άπαντες παρόντες. Κάντε κλικ, ' +
		'ή πατήστε οποιοδήποτε πλήκτρο για επιστροφή&#8230;',
};

pnd.domInit(() => {
	pnd.
	toolbarSetup().
	fyiSetup().
	ofelimoSetup().
	ribbonSetup().
	domSetup().
	domFixup();

	apontes.
	selidaSetup();
});

///////////////////////////////////////////////////////////////////////////////@

apontes.selidaSetup = () => {
	letrak.
	toolbarTitlosSetup('<b>Δελτίο απόντων</b>').
	toolbarXristisSetup().
	ribbonCopyrightSetup();

	if (self.LETRAK.hasOwnProperty('klisimoTabDOM'))
	pnd.toolbarLeftDOM.
	prepend(self.LETRAK.klisimoTabDOM.addClass('diaforesKlisimoTab'));

	if (letrak.noXristis())
	return apontes.fyiError('Διαπιστώθηκε ανώνυμη χρήση');

	if (php.noRequest('deltio'))
	apontes.fatalError('Απροσδιόριστο παρουσιολόγιο');

	let deltio = php.requestGet('deltio');

	if (!deltio)
	apontes.fatalError('Ακαθόριστο παρουσιολόγιο');

	pnd.ofelimoDOM.
	on('click', '.ipalilos', function(e) {
		apontes.ipalilosDoneToggle(e, $(this));
	});

	pnd.ofelimoDOM.
	append(apontes.deltioAreaDOM = $('<div>').attr('id', 'deltioArea')).
	append(apontes.apousiaAreaDOM = $('<div>').attr('id', 'apousiaArea'));

	$.post({
		'url': 'apontesGet.php',
		'data': {
			"deltio": deltio,
		},
		'dataType': 'json',
		'success': (rsp) => apontes.apontesProcess(rsp),
		'error': (e) => {
			pnd.fyiError('Σφάλμα ανίχνευσης απόντων');
			console.error(e);
		},
	});

	return apontes;
};

///////////////////////////////////////////////////////////////////////////////@

apontes.apontesProcess = (rsp) => {
	if (rsp.error)
	return apontes.fyiError(rsp.error);

	apontes.
	ipalilosSort(rsp).
	apousiaApalifi(rsp);

	document.title = rsp.proselefsi.ipiresia + ' ' + rsp.proselefsi.imerominia;

	apontes.
	deltioProcess(rsp).
	apousiaProcess(rsp);

	return apontes;
};

apontes.deltioProcess = function(rsp) {
	let proselefsi = rsp.proselefsi;
	let apoxorisi = rsp.apoxorisi;

	apontes.deltioAreaDOM.
	append($('<div>').
	attr('id', 'deltioImerominia').
	text(proselefsi.imerominia));

	let kodikosDOM = $('<div>').attr('id', 'deltioKodikos').
	appendTo(apontes.deltioAreaDOM);

	kodikosDOM.
	append($('<div>').
	attr('id', 'deltioProselefsi').
	text(proselefsi.kodikos));

	if (apoxorisi)
	kodikosDOM.
	append($('<div>').
	attr('id', 'deltioApoxorisi').
	text(apoxorisi.kodikos));

	apontes.deltioAreaDOM.
	append($('<div>').
	attr('id', 'deltioIpiresia').
	text(proselefsi.ipiresia));

	return apontes;
};

// Η function "apousiaProcess" διατρέχει τη λίστα των απόντων υπαλλήλων και
// εμφανίζει τα στοιχεία του κάθε υπαλλήλου και της σχετικής απουσίας.

apontes.apousiaProcess = function(rsp) {
	if (!apontes.ilist.length)
	return apontes.apantesParontes();

	for (let i = 0; i < apontes.ilist.length; i++)
	apontes.ipalilosProcess(apontes.ilist[i], rsp);

	return apontes;
};

// Η function "ipalilosProcess" δέχεται ως παράμετρο έναν υπάλληλο και
// παρουσιάζει τα στοιχεία του υπαλλήλου και της σχετικής απουσίας.

apontes.ipalilosProcess = function(ipalilos, rsp) {
	let ipalilosDOM = $('<div>').
	addClass('ipalilos');

	ipalilosDOM.
	append($('<div>').addClass('ipalilosData').
	append($('<div>').addClass('ipalilosKodikos').text(ipalilos.kodikos)).
	append($('<div>').addClass('ipalilosOnoma').text(ipalilos.onoma)));

	ipalilos = ipalilos.kodikos;

	let proselefsi = undefined;

	if (rsp.proselefsi && rsp.proselefsi.parousia.hasOwnProperty(ipalilos))
	proselefsi = rsp.proselefsi.parousia[ipalilos];

	let apoxorisi = undefined;

	if (rsp.apoxorisi && rsp.apoxorisi.parousia.hasOwnProperty(ipalilos))
	apoxorisi = rsp.apoxorisi.parousia[ipalilos];

	apontes.
	apousiaPush(ipalilosDOM, proselefsi, 'Proselefsi').
	apousiaPush(ipalilosDOM, apoxorisi, 'Apoxorisi');

	apontes.apousiaAreaDOM.
	append(ipalilosDOM);

	if (apontes.isError(ipalilos))
	ipalilosDOM.
	append($('<div>').addClass('error').text(apontes.getError(ipalilos)));

	return apontes;
};

apontes.apousiaPush = function(dom, apousia, proapo) {
	if (!apousia)
	return apontes;

	let apousiaDOM = $('<div>').addClass('apousia').appendTo(dom);
	let adidos = undefined;
	let diastima = undefined;
	let sxolio = undefined;

	if (apousia.adidos) {
		adidos = apousia.adidos;
		diastima = apousia.adapo + ' - ' + apousia.adeos;
		sxolio = apousia.info;

		apousiaDOM.
		append($('<div>').addClass('adidos').text(adidos)).
		append($('<div>').addClass('diastima').text(diastima)).
		append($('<div>').addClass('sxolio').text(sxolio));

		return apontes;
	}

	if (apousia.excuse) {
		apousiaDOM.addClass('apousia' + proapo);
		adidos = apousia.excuse;
		diastima = apousia.info;

		apousiaDOM.
		append($('<div>').addClass('adidos').text(adidos)).
		append($('<div>').addClass('diastima').text(diastima));

		return apontes;
	}

	if (apousia.info)
	apousiaDOM.
	append($('<div>').addClass('sxolioMono').text(apousia.info));

	return apontes;
};

apontes.ipalilosSort = function(rsp) {
	let ilist = rsp.ipalilos;
	let i;

	apontes.ilist = [];
	apontes.error = {};

	for (i in rsp.ipalilos)
	apontes.ilist.push({
		"kodikos": i,
		"onoma": ilist[i]
	});

	delete rsp.ipalilos;

	apontes.ilist.sort(function(i1, i2) {
		let cmp = i1.onoma.localeCompare(i2.onoma);

		if (cmp)
		return cmp;

		if (i1 < i2)
		return -1;

		else if (i1 > i2)
		return 1;

		return 0;
	});

	return apontes;
};

apontes.apousiaApalifi = function(rsp) {
	let ateles = 2;

	if (rsp.proselefsi)
	ateles--;

	if (rsp.apoxorisi)
	ateles--;

	if (ateles)
	return apontes;

	let proselefsi = rsp.proselefsi.parousia;
	let apoxorisi = rsp.apoxorisi.parousia;

	apontes.
	adiaCheck(proselefsi, apoxorisi).
	exeresiCheck(proselefsi, apoxorisi);

	for (let i in proselefsi) {
		if (!apoxorisi.hasOwnProperty(i))
		continue;

		let dif = false;

		for (let j in proselefsi[i]) {
			if (apoxorisi[i][j] != proselefsi[i][j]) {
				dif = true;
				break;
			}
		}

		if (dif)
		continue;

		for (let j in apoxorisi[i]) {
			if (apoxorisi[i][j] != proselefsi[i][j]) {
				dif = true;
				break;
			}
		}

		if (dif)
		continue;

		delete apoxorisi[i];
	}

	return apontes;
};

// Ελέγχουμε για τυχόν προβληματικές άδειες που έχουν περαστεί μόνο στο ένα
// από τα δύο παρουσιολόγια, ή έχουν συμπληρωμένη ώρα προσέλευσης/αποχώρησης
// κλπ.

apontes.adiaCheck = function(proselefsi, apoxorisi) {
	// Εκκινούμε τη διαδικασία διατρέχοντας τις απουσίες προσέλευσης.

	for (let i in proselefsi) {
		// Αν δεν πρόκειται για άδεια προχωρούμε στην επόμενη
		// απουσία.

		if (!proselefsi[i].adidos)
		continue;

		// Υπάρχει άδεια. Αν υπάρχει ΚΑΙ εξαίρεση έχουμε πρόβλημα.

		if (proselefsi[i].excuse) {
			apontes.setError(i, "Εντοπίστηκε άδεια ΚΑΙ εξαίρεση προσέλευσης");
			continue;
		}

		// Πρόκειται για άδεια. Αν υπάρχει ώρα προσέλευσης έχουμε
		// πρόβλημα.

		if (proselefsi[i].meraora) {
			apontes.setError(i, "Εντοπίστηκε άδεια ΚΑΙ ώρα προσέλευσης");
			continue;
		}

		// Αν δεν υπάρχει αντίστοιχη άδεια στο δελτίο αποχώρησης
		// έχουμε πρόβλημα.

		if (!apoxorisi.hasOwnProperty(i)) {
			apontes.setError(i, "Λείπει η άδεια από το δελτίο αποχώρησης");
			continue;
		}

		// Αν η άδεια του δελτίου αποχώρησης είναι διαφορετικού είδους
		// έχουμε πρόβλημα.

		if (apoxorisi[i].adidos !== proselefsi[i].adidos) {
			apontes.setError(i, "Διαφορετικό είδος αδείας προσέλευσης/αποχώρησης");
			continue;
		}
	}

	// Τώρα διατρέχουμε τις απουσίες της αποχώρησης.

	for (let i in apoxorisi) {
		// Αν έχει ήδη παρατηρηθεί σφάλμα για τον ανά χείρας υπάλληλο,
		// περνάμε στην επόμενη απουσία.

		if (apontes.isError(i))
		continue;

		// Αν δεν πρόκειται για άδεια προχωρούμε στην επόμενη
		// απουσία.

		if (!apoxorisi[i].adidos)
		continue;

		// Εντοπίστηκε άδεια. Αν υπάρχει ΚΑΙ εξαίρεση έχουμε πρόβλημα.

		if (apoxorisi[i].excuse) {
			apontes.setError(i, "Εντοπίστηκε άδεια ΚΑΙ εξαίρεση αποχώρησης");
			continue;
		}

		// Πρόκειται για άδεια. Αν υπάρχει ώρα αποχώρησης έχουμε
		// πρόβλημα.

		if (apoxorisi[i].meraora) {
			apontes.setError(i, "Εντοπίστηκε άδεια ΚΑΙ ώρα αποχώρησης");
			continue;
		}

		// Αν δεν υπάρχει αντίστοιχη άδεια στο δελτίο προσέλευσης
		// έχουμε πρόβλημα.

		if (!proselefsi.hasOwnProperty(i)) {
			apontes.setError(i, "Λείπει η άδεια από το δελτίο προσέλευσης");
			continue;
		}
	}

	return apontes;
};

// Ελέγχουμε για τυχόν προβληματικές εξαιρέσεις. Κυρίως πρόκειται για
// εξαιρέσεις που δεν συνοδεύονται από σχετικό επεξηγηματικό σχόλιο.

apontes.exeresiCheck = function(proselefsi, apoxorisi) {
	// Διατρέχουμε πρώτα τις εξαιρέσεις προσέλευσης.

	for (let i in proselefsi) {
		// Αν έχει ήδη παρατηρηθεί σφάλμα για τον ανά χείρας υπάλληλο,
		// περνάμε στην επόμενη απουσία.

		if (apontes.isError(i))
		continue;

		// Αν δεν υπάρχει εξαίρεση προχρούμε στην επόμενη απουσία.

		if (!proselefsi[i].excuse)
		continue;

		// Πρόκειται για εξαίρεση. Αν υπάρχει ώρα προσέλευσης έχουμε
		// πρόβλημα.

		if (proselefsi[i].meraora) {
			apontes.setError(i, "Εντοπίστηκε εξαίρεση ΚΑΙ ώρα προσέλευσης");
			continue;
		}

		if (!proselefsi[i].info) {
			apontes.setError(i, "Ελλειπείς πληροφορίες εξαίρεσης προσέλευσης");
			continue;
		}
	}

	// Τώρα διατρέχουμε τις απουσίες της αποχώρησης.

	for (let i in apoxorisi) {
		// Αν έχει ήδη παρατηρηθεί σφάλμα για τον ανά χείρας υπάλληλο,
		// περνάμε στην επόμενη απουσία.

		if (apontes.isError(i))
		continue;

		// Αν δεν πρόκειται για εξαίρεση προχωρούμε στην επόμενη
		// απουσία.

		if (!apoxorisi[i].excuse)
		continue;

		// Πρόκειται για εξαίρεση. Αν υπάρχει ώρα αποχώρησης έχουμε
		// πρόβλημα.

		if (apoxorisi[i].meraora) {
			apontes.setError(i, "Εντοπίστηκε εξαίρεση ΚΑΙ ώρα αποχώρησης");
			continue;
		}

		if (!apoxorisi[i].info) {
			apontes.setError(i, "Ελλειπείς πληροφορίες εξαίρεσης αποχώρησης");
			continue;
		}
	}

	return apontes;
};

apontes.apantesParontes = function() {
	apontes.apousiaAreaDOM.
	append($('<div>').
	attr('id', 'apantesParontes').
	html(apontes.minima.apantesParontes));

	pnd.bodyDOM.
	on('click', (e) => apontes.apantesParontesClose(e)).
	on('keyup', (e) => apontes.apantesParontesClose(e));

	return apontes;
};

apontes.apantesParontesClose = function(e) {
	e.stopPropagation();
	self.close();
};

///////////////////////////////////////////////////////////////////////////////@

// Η function "ipalilosDoneToggle" καλείται όταν γίνεται κλικ σε κάποια
// εγγραφή διαφοράς παρουσίας και σκοπό έχει να μαρκάρει με αλλαγή χρώματος
// τον συγκεκριμένο υπάλληλο προκειμένου να γνωρίζει ο χρήστης ποιους
// υπαλλήλους έχει ήδη επεξεργαστεί.

apontes.ipalilosDoneToggle = function(e, dom) {
	e.stopPropagation();
	e.preventDefault();

	if (dom.hasClass('ipalilosDone'))
	dom.removeClass('ipalilosDone');

	else
	dom.addClass('ipalilosDone');
};

///////////////////////////////////////////////////////////////////////////////@

apontes.setError = function(ipalilos, msg) {
	apontes.error[ipalilos] = msg;
	return apontes;
};

apontes.isError = function(ipalilos) {
	if (!apontes.error.hasOwnProperty(ipalilos))
	return false;

	return apontes.error[ipalilos];
};

apontes.getError = function(ipalilos) {
	return apontes.error[ipalilos];
};

apontes.fyiError = (s) => {
	pnd.fyiError(s);
	return apontes;
};

apontes.fatalError = (s) => {
	pnd.fyiError(s);
	throw s;
};

///////////////////////////////////////////////////////////////////////////////@
