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
// Το παρόν πρόγραμμα οδηγεί τη σελίδα παρουσίασης απόντων ημέρας. Ως
// βασική παράμετρος δίδεται ένας κωδικός δελτίου με ονομασία "deltio".
// Το πρόγραμμα εντοπίζει το συμπληρωματικό δελτίο και κατόπιν εμφανίζει
// τις απουσίες για τα δύο δελτία. Αν το δελτίο που δόθηκε είναι δελτίο
// προσέλευσης και δεν έχει συμπληρωθεί ακόμη το δελτίο αποχώρησης, τότε
// εμφανίζονται μόνο οι απουσίες του δελτίου προσέλευσης.
// @DESCRIPTION END
//
// @HISTORY BEGIN
// Updated: 2025-01-08
// Updated: 2024-12-02
// Updated: 2024-11-27
// Updated: 2024-11-26
// Updated: 2024-11-25
// Updated: 2024-11-24
// Updated: 2024-11-23
// Updated: 2024-11-22
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
	'apantesParontes': 'ΑΠΑΝΤΕΣ ΠΑΡΟΝΤΕΣ',
	'apantesParontesMain': 'Κάντε κλικ, ή πατήστε οποιοδήποτε πλήκτρο για ',
	'apantesParontesKlisimo': 'επιστροφή',
	'apantesParontesEpikirosi': 'επικύρωση',
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

	// Ο χρήστης μπορεί να κάνει κλικ σε κάθε υπάλληλο που έχει ελέγξει
	// προκειμένου να «γκριζαριστεί» η περιοχή του εν λόγω υπαλλήλου.
	// Αυτό διευκολύνει τη διαχείριση των απόντων, καθώς γίνεται εμφανές
	// το ποιος είναι ο επόμενος υπάλληλος που έχει σειρά να ελεγχθεί.

	on('click', '.ipalilos', function(e) {
		apontes.ipalilosDoneToggle(e, $(this));
	}).

	// Στο επάνω μέρος της σελίδας εμφανίζουμε τα βασικά στοιχεία των
	// προς έλεγχο παρουσιολογίων.

	append(apontes.deltioAreaDOM = $('<div>').attr('id', 'deltioArea')).

	// Αμέσως μετά εμφανίζουμε τους υπαλλήλους που παρουσιάζουν απουσία.

	append(apontes.apousiaAreaDOM = $('<div>').attr('id', 'apousiaArea'));

	// Ζητάμε τώρα από τον server να μας επιστρέψει τους απόντες που
	// αφορούν στο προς έλεγχο δελτίο. Επισημαίνουμε ότι μαζί με το
	// προς έλεγχο δελτίο θα ελεγχθεί και το συμπληρωματικό δελτίο.

	$.post({
		'url': 'apontes.php',
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

// Έχουν επιστραφεί τα στοιχεία των προς έλεγχο δελτίων (προσέλευση/αποχώρηση)
// και οι υπάλληλοι που παρουσίασαν απουσία.

apontes.apontesProcess = (rsp) => {
	if (rsp.error)
	return apontes.fyiError(rsp.error);

	// Αναθέτουμε όλα τα στοιχεία της απάντησης σε global μεταβλητές.

	apontes.imerominia = rsp.imerominia;	// ημερομηνία ελέγχου
	apontes.ipiresia = rsp.ipiresia;	// κωδικός υπηρεσίας
	apontes.perigrafi = rsp.perigrafi;	// τίτλος παρουσιολογίου
	apontes.die = rsp.die;			// περιγραφή διεύθυνσης
	apontes.tmi = rsp.tmi;			// περιγραφή τμήματος

	apontes.proselefsi = rsp.proselefsi;	// κωδικός δελτίου προσέλευσης
	apontes.prokat = rsp.prokat;		// κατάσταση δελτίου προσέλευσης
	apontes.propar = rsp.propar;		// απουσίες δελτίου προσέλευσης

	apontes.apoxorisi = rsp.apoxorisi;	// κωδικός δελτίου αποχώρησης
	apontes.apokat = rsp.apokat;		// κατάσταση δελτίου αποχώρησης
	apontes.apopar = rsp.apopar;		// απουσίες δελτίου αποχώρησης

	apontes.sintaktis = rsp.sintaktis;	// ονοματεπώνυμο συντάκτη
	apontes.tilefono = rsp.tilefono;	// τηλέφωνο επικοινωνίας

	apontes.ipalilos = rsp.ipalilos;	// λίστα απόντων υπαλλήλων

	// Ορίζουμε το global array "ilist" το οποίο θα περιέχει τους
	// απόντες υπαλλήλους ταξινομημένους αλφαβητικά.

	apontes.ilist = [];

	// Ορίζουμε την global λίστα "error" το οποίο θα περιέχει τυχόν
	// μηνύματα λάθους που αφορούν στις παρουσίες των υπαλλήλων και
	// είναι δεικτοδοτημένη με τον κωδικό υπαλλήλου.

	apontes.error = {};

	// Έχουμε κάνει την προεργασία μας και προχωρούμε στην επεξεργασία
	// των στοιχείων που παραλάβαμε.

	apontes.

	// Θέτουμε τον τίτλο της τρέχουσας καρτέλας στον browser.

	titlosSet().

	// Ταξινομούμε τους υπαλλήλους αλφαβητικά.

	ipalilosSort().

	// Διαγράφουμε από το παρουσιολόγιο αποχώρησης τις άδειες που είναι
	// ταυτόσημες με τις αντίστοιχες άδειες στο παρουσιολόγιο προσέλευσης.

	apousiaCheck().

	// Εμφανίζουμε τα βασικά στοιχεία των προς έλεγχο παρουσιολογίων στο
	// επάνω μέρος της σελίδας.

	deltioProcess().

	// Αμέσως μετά εμφανίζουμε τις απουσίες των υπαλλήλων από τα προς
	// έλεγχο παρουσιολόγια.

	apousiaProcess();

	return apontes;
};

///////////////////////////////////////////////////////////////////////////////@

// Η function "titlosSet" θέτει τον τίτλο της τρέχουσας καρτέλας του browser
// ώστε να φαίνεται ο κωδικός υπηρεσίας και η ημερομηνία των προς έλεγχο
// παρουσιολογίων.

apontes.titlosSet = function() {
	document.title = apontes.ipiresia + ' ' + apontes.imerominia;
	return apontes;
};

///////////////////////////////////////////////////////////////////////////////@

// Οι υπάλληλοι που παρουσιάζουν απουσία μάς έχουν επιστραφεί ως λίστα
// "ipalilos" δεικτοδοτημένη με τους κωδικούς υπαλλήλων. Η function
// "ipalilosSort" δημιουργεί global array "ilist" το οποίο περιέχει
// τα στοιχεία των υπαλλήλων και είναι ταξινομημένο αλφαβητικά ως
// προς το όνομα.

apontes.ipalilosSort = function() {
	for (let i in apontes.ipalilos)
	apontes.ilist.push({
		"kodikos": i,
		"onoma": apontes.ipalilos[i]
	});

	// Η global λίστα "ipalilos" δεν μας χρειάζεται πια.

	delete apontes.ipalilos;

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

///////////////////////////////////////////////////////////////////////////////@

// Η function "apousiaCheck" διατρέχει τις απουσίες και στα δύο δελτία και
// επιτελεί βασικούς ελέγχους.

apontes.apousiaCheck = function() {
	if (apontes.isAteles())
	return apontes;

	apontes.
	adiaCheck(apontes.propar, apontes.apopar).
	exeresiCheck(apontes.propar, apontes.apopar);

	return apontes;
};

apontes.isAteles = function() {
	if (!apontes.proselefsi)
	return true;

	if (!apontes.apoxorisi)
	return true;

	return false;
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

		// Πρόκειται για άδεια. Αν υπάρχει ΚΑΙ ώρα προσέλευσης έχουμε
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

		if ((apoxorisi[i].adapo !== proselefsi[i].adapo) ||
			(apoxorisi[i].adeos !== proselefsi[i].adeos)) {
			apontes.setError(i, "Διαφορετικό διάστημα αδείας προσέλευσης/αποχώρησης");
			continue;
		}

		// Η άδεια είναι ταυτόσημη και στα δύο δελτία, οπότε την
		// διαγράφουμε από το δελτίο αποχώρησης.

		delete apoxorisi[i];
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

		// Αν δεν υπάρχει εξαίρεση προχωρούμε στην επόμενη απουσία.

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

///////////////////////////////////////////////////////////////////////////////@

apontes.deltioProcess = function() {
	let prokat = apontes.prokat;
	let apokat = apontes.apokat;

	apontes.epikirosiSetup();

	apontes.deltioAreaDOM.
	append($('<div>').attr('id', 'ipiresia')).
	append($('<div>').attr('id', 'ipiresiaKodikos').text(apontes.ipiresia)).
	append($('<div>').attr('id', 'ipiresiaPerigrafi').text(apontes.perigrafi));

	if (apontes.die && (apontes.die != apontes.perigrafi))
	apontes.deltioAreaDOM.
	append($('<div>').attr('id', 'ipiresiaDie').text(apontes.die));

	if (apontes.tmi && (apontes.tmi != apontes.perigrafi))
	apontes.deltioAreaDOM.
	append($('<div>').attr('id', 'ipiresiaTmi').text(apontes.tmi));

	let deltioDOM = $('<div>').attr('id', 'deltio').
	appendTo(apontes.deltioAreaDOM);

	let dmy = apontes.imerominia.split('/');
	deltioDOM.
	append($('<div>').
	attr('id', 'deltioImerominia').
	text(pnd.imerominia(new Date(dmy[2], dmy[1] - 1, dmy[0]))));

	let katastasiClass = apontes.katastasiClass(prokat);

	deltioDOM.
	append($('<div>').attr('id', 'deltioKodikos')).
	append($('<div>').attr({
		"id": "deltioProselefsi",
		"title": prokat
	}).addClass(katastasiClass).
	text(apontes.proselefsi));

	if (apontes.apoxorisi) {
		katastasiClass = apontes.katastasiClass(apokat);

		deltioDOM.
		append($('<div>').attr({
			"id": "deltioApoxorisi",
			"title": apokat
		}).addClass(katastasiClass).
		text(apontes.apoxorisi));
	}

	apontes.sintaktisProcess();

	return apontes;
};

// Η function "sintaktisProcess" εμφανίζει τα στοιχεία του συντάκτη στο κάτω
// μέρος της επάνω περιοχής τής σελίδας, όπου εμφανίζουμε τα στοιχεία των
// παρουσιολογίων ενδιαφέροντος.

apontes.sintaktisProcess = function() {
	let sintaktisDOM = $('<div>').
	attr('id', 'sintaktis').
	appendTo(apontes.deltioAreaDOM);

	if (apontes.sintaktis)
	sintaktisDOM.
	append($('<div>').
	attr('id', 'sintaktisOnomateponimo').
	text(apontes.sintaktis));

	if (apontes.tilefono)
	sintaktisDOM.
	append($('<div>').
	attr('id', 'sintaktisTilefono').
	text(apontes.tilefono));

	return apontes;
};

apontes.katastasiClassMap = {
	"ΕΚΚΡΕΜΕΣ": "deltioKatastasiEKREMES",
	"ΑΝΥΠΟΓΡΑΦΟ": "deltioKatastasiANIPOGRAFO",
	"ΚΥΡΩΜΕΝΟ": "deltioKatastasiKIROMENO",
	"ΕΠΙΚΥΡΩΜΕΝΟ": "deltioKatastasiEPIKIROMENO",
};

apontes.katastasiClass = function(katastasi) {
	if (apontes.katastasiClassMap.hasOwnProperty(katastasi))
	return apontes.katastasiClassMap[katastasi];

	return 'deltioKatastasiEKREMES';
};

///////////////////////////////////////////////////////////////////////////////@

// Η function "apousiaProcess" διατρέχει τη λίστα των απόντων υπαλλήλων και
// εμφανίζει τα στοιχεία του κάθε υπαλλήλου και της σχετικής απουσίας.

apontes.apousiaProcess = function() {
	if (!apontes.ilist.length)
	return apontes.apantesParontes();

	for (let i = 0; i < apontes.ilist.length; i++)
	apontes.ipalilosProcess(apontes.ilist[i], i + 1);

	return apontes;
};

// Η function "ipalilosProcess" δέχεται ως παράμετρο έναν υπάλληλο και
// παρουσιάζει τα στοιχεία του υπαλλήλου και της σχετικής απουσίας.

apontes.ipalilosProcess = function(ipalilos, aa) {
	let zebra = aa % 2;
	let dom = $('<div>').addClass('ipalilos ipalilos' + zebra);
	let ipalilosDOM = $('<div>').addClass('ipalilosData');
	let apousiaDOM = $('<div>').addClass('apousiaData');

	dom.
	append($('<div>').addClass('ipalilosOrdinal').text(aa)).
	append(ipalilosDOM).
	append(apousiaDOM);

	ipalilosDOM.
	append($('<div>').addClass('ipalilosKodikosKelifos').
	append($('<div>').addClass('ipalilosKodikos').text(ipalilos.kodikos))).
	append($('<div>').addClass('ipalilosOnoma').text(ipalilos.onoma));

	ipalilos = ipalilos.kodikos;

	let proselefsi = undefined;

	if (apontes.proselefsi && apontes.propar.hasOwnProperty(ipalilos))
	proselefsi = apontes.propar[ipalilos];

	let apoxorisi = undefined;

	if (apontes.apoxorisi && apontes.apopar.hasOwnProperty(ipalilos))
	apoxorisi = apontes.apopar[ipalilos];

	apontes.
	apousiaPush(apousiaDOM, proselefsi, 'Proselefsi').
	apousiaPush(apousiaDOM, apoxorisi, 'Apoxorisi');

	apontes.apousiaAreaDOM.
	append(dom);

	if (apontes.isError(ipalilos))
	apousiaDOM.
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

///////////////////////////////////////////////////////////////////////////////@

// Η funtion "epikirosiSetup" δέχεται ως παράμετρο τα δεδομένα απόντων και
// ελέγχει στοιχεία πρόσβασης του χρήστη προκειμένου να εμφανίσει πλήκτρο
// επικύρωσης για τα προς έλεγχο δελτία.

apontes.epikirosiSetup = function() {
	// Ο χρήστης πρέπει να έχει δικαιώματα διαχειριστή στην υπηρεσία.

	if (letrak.prosvasiOxiAdmin(apontes.ipiresia))
	return apontes;

	// Θα ελέγξουμε τώρα αν υπάρχουν παρουσιολόγια προς επικύρωση.
	// Αρχικά θεωρούμε ότι δεν υπάρχουν.

	apontes.prosEpikirosi = false;

	// Ελέγχουμε πρώτα την κατάσταση του παρουσιολογίου προσέλευσης.

	switch (apontes.prokat) {
	case 'ΚΥΡΩΜΕΝΟ':
		apontes.prosEpikirosi = true;
		break;
	case 'ΕΠΙΚΥΡΩΜΕΝΟ':
		break;
	default:
		return apontes;
	}

	// Κατόπιν ελέγχουμε την κατάσταση του παρουσιολογίου αποχώρησης
	// εφόσον αυτό υπάρχει.

	if (apontes.apoxorisi) {
		switch (apontes.apokat) {
		case 'ΚΥΡΩΜΕΝΟ':
			apontes.prosEpikirosi = true;
			break;
		case 'ΕΠΙΚΥΡΩΜΕΝΟ':
			break;
		default:
			return apontes;
		}
	}

	// Αν δεν έχουν εντοπιστεί παρουσιολόγια προς επικύρωση, τότε
	// δεν εμφανίζουμε πλήκτρο επικύρωσης.

	if (!apontes.prosEpikirosi)
	return apontes;

	// Έχουν εντοπιστεί παρουσιολόγια προς επικύρωση οπότε εμφανίζουμε
	// πλήκτρο επικύρωσης. Χρησιμοποιούμε το flag "prosEpikirosi" για
	// να κρατήσουμε το πλήκρρο επικύρωσης.

	apontes.prosEpikirosi = $('<div>').
	addClass('letrak-toolbarTab').
	addClass('epikirosiPliktro').
	text('Επικύρωση').
	on('click', function(e) {
		e.stopPropagation();
		apontes.epikirosi();
	}).
	appendTo(pnd.toolbarLeftDOM);

	return apontes;
};

apontes.epikirosi = function() {
	$.post({
		'url': 'epikirosi.php',
		'data': {
			"ipiresia": apontes.ipiresia,
			"pro": apontes.proselefsi,
			"apo": apontes.apoxorisi,
		},
		'dataType': 'json',
		'success': (rsp) => {
			try {
				self.opener.LETRAK.ananeosi();
			} catch (e) {
				return pnd.fyiError('Αστοχία ανανέωσης');
			}
			self.close();
		},
		'error': (e) => {
			pnd.fyiError('Σφάλμα επικύρωσης');
			console.error(e);
		},
	});

	return apontes;
};

///////////////////////////////////////////////////////////////////////////////@

apontes.apantesParontes = function() {
	let minima = apontes.minima.apantesParontesMain +
		(apontes.prosEpikirosi ?
		apontes.minima.apantesParontesEpikirosi :
		apontes.minima.apantesParontesKlisimo);

	apontes.apousiaAreaDOM.
	append($('<div>').
	attr('id', 'apantesParontes').
	text(apontes.minima.apantesParontes)).
	append($('<div>').
	attr('id', 'apantesParontesKlik').
	text(minima));

	pnd.bodyDOM.
	css('cursor', 'pointer').
	on('click keyup', (e) => apontes.apantesParontesClose(e));

	return apontes;
};

apontes.apantesParontesClose = function(e) {
	e.stopPropagation();

	if (apontes.prosEpikirosi)
	return apontes.epikirosi();

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
