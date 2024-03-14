///////////////////////////////////////////////////////////////////////////////@
//
// @BEGIN
//
// @COPYRIGHT BEGIN
// Copyright (C) 2020 Panos I. Papadopoulos <panos1962_AT_gmail_DOT_com>
// @COPYRIGHT END
//
// @FILETYPE BEGIN
// javascript
// @FILETYPE END
//
// @FILE BEGIN
// www/prosopa/ektiposi.js —— Πρόγραμμα εκτύπωσης δελτίου
// @FILE END
//
// @DESCRIPTION BEGIN
//
// Το παρόν αποτελεί προσάρτημα του www/prosopa/main.js και περιλαμβάνει
// κώδικα εκτυπώσεων δελτίων προσέλευσης/αποχώρησης. Ο χρήστης δρομολογεί
// εκτύπωση μέσω των default εργαλείων του browser, είτε με Control+P, είτε
// μέσω των μενού του browser, είτε μέσω των παρεχόμενων εργαλείων εκτύπωσης
// της σελίδας επεξεργασίας δελτίων. Οι εκτυπώσεις που παρέχονται είναι:
//
// Λεπτομερής εκτύπωση δελτίου
// ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
// Πρόκειται για την default εκτύπωση του δελτίου προσέλευσης/αποχώρησης
// η οποία δρομολογείται είτε me Control-P, είτε με την επιλογή εκτύπωσης
// σελίδας από τα μενού εργαλείων του broswer. Η εκτύπωση περιλαμβάνει
// όλα τα στοιχεία του δελτίου.
//
// Δελτίο απόντων
// ‾‾‾‾‾‾‾‾‾‾‾‾‾‾
// Η εκτύπωση δρομολογείται με το φερώνυμο πλήκτρο, μέσω του μενού
// εργαλείων της σελίδας επεξεργασίας δελτίου, και περιλαμβάνει τους
// εργαζόμενους που δεν έχουν συμπληρωμένη ημερομηνία και ώρα συμβάντος
// προσέλευσης/αποχώρησης, καθώς επίσης και τους αδειούχους.
//
// Ημερήσιο δελτίο
// ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
// Η εκτύπωση δρομολογείται με το φερώνυμο πλήκτρο, μέσω του μενού
// εργαλείων της σελίδας επεξεργασίας δελτίου, και περιλαμβάνει τους
// εργαζόμενους που συμμετέχουν στο ανά χείρας δελτίο αλλά και στο
// συμπληρωματικό του. Αν π.χ. εκτυπώσουμε ημερήσιο δελτίο για δελτίο
// προσέλευσης, τότε θα συμπεριληφθούν και τα στοιχεία του σχετικού
// δελτίου αποχώρησης και το αντίστροφο.
//
// @DESCRIPTION END
//
// @HISTORY BEGIN
// Updated: 2024-03-14
// Updated: 2022-12-14
// Updated: 2022-10-06
// Updated: 2022-10-05
// Updated: 2022-10-04
// Updated: 2022-03-31
// Updated: 2020-10-19
// Updated: 2020-08-08
// Updated: 2020-07-01
// Updated: 2020-06-30
// Updated: 2020-06-29
// Updated: 2020-06-28
// Updated: 2020-06-27
// Updated: 2020-06-26
// Updated: 2020-06-25
// Updated: 2020-06-24
// Updated: 2020-06-23
// Updated: 2020-06-22
// Created: 2020-06-21
// @HISTORY END
//
// @END
//
///////////////////////////////////////////////////////////////////////////////@

"use strict";

module.exports = function(pnd, letrak, prosopa) {
const ektiposi = {};

///////////////////////////////////////////////////////////////////////////////@

// Η εκτύπωση του δελτίου προσέλευσης/αποχώρησης δημιουργείται ως DOM κόμβος
// της βασικής δελίδας επεξεργασίας λεπτομερειών του δελτίου. Ο συγκεκριμένος
// κόμβος δημιουργείται άπαξ κατά το στήσιμο της σελίδας και «γεμίζει» κάθε
// φορά που ο χρήστης δρομολογεί εκτύπωση δελτίου προσέλευσης/αποχώρησης ή
// δελτίου απόντων.

ektiposi.setup = () => {
	ektiposi.bodyDOM = $('<div>').
	attr('id', 'ektiposi').
	appendTo(pnd.bodyDOM);

	ektiposi.reset();
	return ektiposi;
};

// Η function "before" καλείται αμέσως μετά τη δρομολόγηση εκτύπωσης του
// δελτίου από τον χρήστη και πριν αρχίσει να δημιουργείται το περιεχόμενο
// του κόμβου εκτύπωσης, επομένως είναι το σωστό σημείο να λάβουν χώρα οι
// απαραίτητες εργασίες προετοιμασίας.

ektiposi.before = () => {
	// XXX
	// !!!Πρέπει να ελέγξω αν ενεργοποιείται το onafterprint event!!!
	//
	// Τον Ιανουάριο του 2023 εμφανίστηκε το εξής φαινόμενο: μετά την
	// εκτύπωση δεν καθαρίζει (empty) το ektiposi.bodyDOM, με αποτέλεσμα
	// η επόμενη εκτύπωση να βγαίνει μαζί με την προηγούμενη κοκ. Για
	// να λύσω πρόχειρα το πρόβλημα, καθαρίζω το ektiposi.bodyDOM ΚΑΙ
	// κατά την εκκίνηση της εκτύπωσης.

	ektiposi.bodyDOM.
	empty();

	ektiposi.
	deltio().
	prosopa();

	return ektiposi;
};

// Η function "after" καλείται μετά το πέρας ή την ακύρωση της εκτύπωσης
// και σκοπό έχει να «αδειάσει» τον κόμβο εκτύπωσης και να επαναφέρει τις
// διαδικασίες εκτύπωσης στις default διαδικασίες εκτύπωσης δελτίου.

ektiposi.after = () => {
/* XXX
$('[media="print"]').removeAttr('media');
return ektiposi;
*/
	ektiposi.bodyDOM.
	empty();

	ektiposi.reset();
	return ektiposi;
};

// Σε γενικές γραμμές τα διάφορα εκτυπωτικά του δελτίου μοιάζουν μεταξύ τους.
// Ωστόσο σε αρκετά σημεία υπάρχουν διαφοροποιήσεις οι οποίες έχουν απομονωθεί
// σε functions (drivers) που τίθενται κατά τη διαδικασία επιλογής εκτύπωσης
// από τον χρήστη. Η function "reset" θέτει ή επαναφέρει τους drivers στους
// default drivers εκτύπωσης δελτίου.

ektiposi.reset = () => {
	ektiposi.ektipotiko = 'Deltio';
	ektiposi.titlosGet = ektiposi.titlosGetDeltio;
	ektiposi.perigrafiGet = ektiposi.perigrafiGetDeltio;
	ektiposi.prosopa = ektiposi.prosopaDeltio;

	return ektiposi;
};

///////////////////////////////////////////////////////////////////////////////@

// Η function "deltio" αναλαμβάνει την εκτύπωση της κεφαλίδας του δελτίου σε
// όλα τα είδη των εκτυπώσεων που παρέχονται από τη σελίδα επεξεργασίας
// περιεχομένου.

ektiposi.deltio = () => {
	let deltioDOM = $('<div>').
	addClass('ektiposi-deltio').
	appendTo(ektiposi.bodyDOM);

	// Η κεφαλίδα του δελτίου αποτελείται από τρεις στήλες. Στην αριστερή
	// πλευρά εκτυπώνεται το λογότυπο του Δήμου και οι οργανικές μονάδες
	// στις οποίες αφορά το δελτίο ιεραρχικά.

	let aristeraDOM = $('<div>').
	addClass('ektiposi-deltioAristera').
	appendTo(deltioDOM);

	aristeraDOM.

	append($('<div>').
	addClass('ektiposi-deltioDimos').
	text(letrak.minima.organismos)).
	// Χρειάζεται line break γιατί αλλιώς μπορεί να «κολλήσει» δίπλα
	// η περιγραφή της διεύθυνσης.
	append($('<br>'));

	let ipiresia = prosopa.deltio.ipiresiaGet();

	// Ξεκινάμε από το επίπεδο διεύθυνσης (πλάτος κωδικού υπηρεσίας 3)
	// και αυξάνουμε σταδιακά το πλάτος ελεχοντας αν πρόκειται για
	// κωδικό υπηρεσίας. Όπου εντοπίσουμε υπηρεσία εκτυπώνουμε την
	// περιγραφή, π.χ. αν η υπηρεσία του δελτίου είναι "Β090003",
	// τότε θα εκτυπωθεί «Διεύθυνση Επιχειρησιακού Προγραμματισμού
	// και Συστημάτων ΤΠΕ» για τον κωδικό "Β09" και «Τμήμα Μηχανογραφικής
	// Υποστήριξης» για τον κωδικό "Β090003", ενώ αν η υπηρεσία δελτίου
	// είναι "Β0801" θα εκτυπωθεί «Διεύθυνση Δημοτικής Αστυνομίας» για
	// τον κωδικό "Β08" και "Υποδιεύθυνση Δημοτικής Αστυνόμευσης» για
	// τον κωδικό "Β0801".

	for (let i = 3; i <= ipiresia.length; i++) {
		let x = prosopa.goniki.ipiresiaList[ipiresia.substr(0, i)];

		if (x)
		aristeraDOM.
		append($('<div>').
		addClass('ektiposi-deltioIpiresia').
		text(x)).
		// Χρειάζεται line break γιατί αλλιώς μπορεί να «κολλήσει»
		// δίπλα η περιγραφή του τμήματος, του γραφείο κοκ.
		append($('<br>'));
	}

	// Ακολουθεί η κεντρική στήλη στην οποία εκτυπώνονται ο κωδικός και
	// η περιγραφή του δελτίου, το είδος του δελτίου και το είδος της
	// εκτύπωσης, π.χ. ημερήσιο δελτίο, δελτίο απόντων κλπ.

	deltioDOM.
	append($('<div>').
	addClass('ektiposi-deltioKentro').

	append($('<div>').
	addClass('ektiposi-deltioIdos').

	append($('<div>').
	addClass('ektiposi-deltioProsapo').
	text(ektiposi.titlosGet()))).

	append($('<div>').
	addClass('ektiposi-deltioPerigrafi').
	html(ektiposi.perigrafiGet()))).

	// Στη δεξιά στήλη εκτυπώνεται η ημερομηνία του δελτίου.

	append($('<div>').
	addClass('ektiposi-deltioDexia').

	append($('<div>').
	addClass('ektiposi-deltioImerominia').
	text(prosopa.deltioAreaDOM.find('.deltioImerominia').text())));

	return ektiposi;
};

// Η function "prosopa" εκτυπώνει το σώμα του δελτίου, δηλαδή τις εγγραφές
// παρουσίας. Στην default εκτύπωση δελτίου εκτυπώνονται όλα τα στοιχεία
// της παρουσίας, δηλαδή τα στοιχεία ταυτότητας του υπαλλήλου, το ωράριο,
// ο αριθμός κάρτας, η ημερομηνία και η ώρα συμβάντος, η αιτιολογία έλλειψης
// ημερομηνίας και ώρας συμβάντος, τα στοιχεία αδείας, και τα σχόλια.

ektiposi.prosopa =
ektiposi.prosopaDeltio = () => {
	let plist = prosopa.browserDOM.children();
	let parea = ektiposi.bodyDOM;
	let count = plist.length;
	let aa = 0;

	plist.each(function() {
		aa++;
		count--;

		// Αν έχει απομείνει μικρό πλήθος παρουσιών προς εκτύπωση,
		// φροντίζουμε αυτές οι παρουσίες μαζί με τις υπογραφές
		// να τοποθετηθούν σε αδιάσπαστο wrapper προκειμένου να
		// αποφύγουμε φαινόμενα «ορφανών» γραμμών στο τέλος της
		// εκτύπωσης.

		if (count === 4)
		parea = $('<div>').
		addClass('ektiposi-parousiaWrapper').
		addClass('pnd-idiaSelida').
		appendTo(ektiposi.bodyDOM);

		ektiposi.parousiaDOM($(this), aa).
		appendTo(parea);
	});

	parea.
	append(ektiposi.ipografesDOM());

	return ektiposi;
};

// Η function "prosopaApontes" εκτυπώνει μόνο τις εγγραφές παρουσίας που
// αφορούν στους αδειούχους και στους υπαλλήλους που δεν έχουν συμπληρωμένη
// ημερομηνία ώρα συμβάντος χωρίς αιτιολόγηση.

ektiposi.prosopaApontes = () => {
	let plist = prosopa.browserDOM.children();
	let parea = ektiposi.bodyDOM;	// printing area
	let count = plist.length;
	let aa = 0;

	plist.each(function() {
		if (ektiposi.oxiApon($(this)))
		return;

		aa++;
		count--;

		if (count === 4)
		parea = $('<div>').
		addClass('ektiposi-parousiaWrapper').
		addClass('pnd-idiaSelida').
		appendTo(ektiposi.bodyDOM)

		ektiposi.parousiaDOM($(this), aa).
		appendTo(parea);
	});

	if (!aa)
	$('<div>').
	addClass('ektiposi-apartia').
	text('ΑΠΑΝΤΕΣ ΠΑΡΟΝΤΕΣ').
	appendTo(ektiposi.bodyDOM);

	parea.
	append(ektiposi.ipografesDOM());

	return ektiposi;
};

// Η function "oxiApon" δέχεται ένα DOM element παρουσίας και ελέγχει αν ο
// σχετικός υπάλληλος εκείνη τη μέρα δεν φαίνεται να είναι απών. Επιστρέφει
// true εφόσον ο υπάλληλος δεν πρέπει να συμπεριληφθεί στο δελτίο απόντων.

ektiposi.oxiApon = (dom) => {
	let parousia = dom.data('parousia');

	// Αν δεν υπάρχει σχετική εγγραφή δεν γνωρίζουμε καν τον υπάλληλο
	// επομένως δεν μπορούμε να αποφανθούμε αν ο υπάλληλος πρέπει να
	// συμπεριληφθεί στο δελτίο απόντων.

	if (!parousia)
	return true;

	// Αν υπάρχει συμπληρωμένη αιτιολογία απουσίας συμβάντος, τότε
	// ο υπάλληλος δεν πρέπει να συμπεριληφθεί στο δελτίο απόντων.

	if (parousia.excuseGet())
	return true;

	let adidos = parousia.adidosGet();

	// Κάποια είδη αδειών εξαιρούται από το δελτίο απόντων.

	switch (adidos) {
	// Η άδεια τύπου "ΕΚΤΟΣ ΕΔΡΑΣ" καταχωρείται στους εργαζόμενους οι
	// οποίοι εργάζονται σε καθημερινή βάση σε δομές ή γενικότερα σε
	// χώρους που δεν διαθέτουν καταγραφείς, π.χ. σισίτια, οδηγοί κλπ.
	case 'ΕΚΤΟΣ ΕΔΡΑΣ':

	// Η άδεια τύπου "ΕΣΩΤΕΡΙΚΗ ΔΙΑΘΕΣΗ" καταχωρείται σε εργαζόμενους
	// που έχουν διατεθεί σε αντιδημάρχους, παρατάξεις, εντεταλμένους
	// κλπ.
	case 'ΕΣΩΤΕΡΙΚΗ ΔΙΑΘΕΣΗ':

	// Στις 19 Οκτωβρίου 2020 η Βλαχιώτη, η Νάταλη και ο Πασχάλης
	// συμφώνησαν να εξαιρεθεί η τηλεργασία από το δελτίο απόντων.
	case 'ΤΗΛΕΡΓΑΣΙΑ':

	// Στις 23 Νοεμβρίου 2020, ο Πασχάλης και η Νάταλη συμφώνησαν
	// να εξαιρεθεί η εκ περιτροπής απουσία από το δελτίο απόντων.
	case 'ΕΚ ΠΕΡΙΤΡΟΠΗΣ':
		return true;
	}

	// Αν υπάρχει κάποιο άλλο είδος αδείας, τότε ο υπάλληλος πρέπει
	// να συμπεριληφθεί στο δελτίο απόντων.

	if (adidos)
	return false;

	// Αν υπάρχει συμπληρωμένη ημερομηνία και ώρα προσέλευσης/αποχώρησης,
	// τότε ο υπάλληλος δεν πρέπει να συμπεριληφθεί στο δελτίο απόντων.

	if (parousia.meraoraGet())
	return true;

	// Σε κάθε άλλη περίπτωση θεωρούμε ότι ο υπάλληλος πρέπει να
	// συμπεριληφθεί στο δελτίο απόντων.

	return false;
};

// Η function "prosopaImerisio" εκτυπώνει τους υπαλλήλους που αφορούν στα
// δελτία προσέλευσης και αποχώρησης συγκεκριμένης οργανικής μονάδας για
// συγκεκριμένη ημερομηνία. Δέχεται μια λίστα εγγραφών πλήρους παρουσίας,
// δηλαδή εγγραφών που περιλαμβάνουν στοιχεία τόσο για την προσέλευση όσο
// και για την αποχώρηση των υπαλλήλων της οργανικής μονάδας στην οποία
// αφορούν τα συγκεκριμένα δελτία.

ektiposi.prosopaImerisio = (plist) => {
	// Θα πρέπει να δημιουργηθεί array με τις εγγραφές παρουσίας
	// ταξινομημένο ως προς το ονοματεπώνυμο των υπαλλήλων.

	let pl = [];

	pnd.objectWalk(plist, (x, i) => {
		let p = new ektiposi.parousia(i, x);
		pl.push(p);
	});

	pl.sort((p1, p2) => {
		let i1 = (p1.ipalilos);
		let i2 = (p2.ipalilos);

		let o1 = ektiposi.onomateponimo(i1);
		let o2 = ektiposi.onomateponimo(i2);

		let cmp = o1.localeCompare(o2);

		if (cmp)
		return cmp;

		if (i1 < i2)
		return -1;

		if (i1 > i2)
		return 1;

		return 0;
	});

	// Μετά την ταξινόμηση των εγγραφών παρουσίας ως προς το
	// ονοματεπώνυμο των υπαλλήλων, μπορούμε να προχωρήσουμε
	// στην εκτύπωση των εγγραφών παρουσίας.

	let parea = ektiposi.bodyDOM;
	let count = pl.length;
	let aa = 0;

	pnd.arrayWalk(pl, (x) => {
		aa++;
		count--;

		if (count === 4)
		parea = $('<div>').
		addClass('ektiposi-parousiaWrapper').
		addClass('pnd-idiaSelida').
		appendTo(ektiposi.bodyDOM);

		x.domGet(aa).
		appendTo(parea);
	});

	parea.
	append(ektiposi.ipografesDOM());
};

///////////////////////////////////////////////////////////////////////////////@

ektiposi.titlosGetDeltio = () => {
	return 'Δελτίο ' + prosopa.deltio.prosapoGet() + 'Σ Εργαζομένων';
};

ektiposi.titlosGetApontes = () => {
	return 'ΔΕΛΤΙΟ ΑΠΟΝΤΩΝ';
};

ektiposi.titlosGetImerisio = () => {
	return 'ΗΜΕΡΗΣΙΟ ΔΕΛΤΙΟ ΠΡΟΣΕΛΕΥΣΗΣ/ΑΠΟΧΩΡΗΣΗΣ';
};

///////////////////////////////////////////////////////////////////////////////@

ektiposi.perigrafiGetDeltio = () => {
	return prosopa.deltio.kodikosGet() + '.&nbsp;' +
		prosopa.deltio.perigrafiGet();
};

ektiposi.perigrafiGetImerisio = (rsp) => {
	let x = '';

	x = pnd.strPush(x, rsp.proselefsi);
	x = pnd.strPush(x, rsp.apoxorisi, '&ndash;');
	x = pnd.strPush(x, prosopa.deltio.perigrafiGet(), '.&nbsp;');

	return x;
};

///////////////////////////////////////////////////////////////////////////////@

// Η function "parousiaDOM" δέχεται ως παράμετρο το DOM element υπαλλήλου και
// επιστρέφει το αντίστοιχο DOM element για τη σελίδα εκτύπωσης του δελτίου.
// Αναμφίβολα πρόκειται για την πλέον σημαντική function που αφορά στην
// εκτύπωση του δελτίου, καθώς περιέχει όλες εκείνες τις πληροφορίες που
// αφορούν στην προσέλευση, στην αποχώρηση, ή στην απουσία του υπαλλήλου.

ektiposi.parousiaDOM = (deltioDOM, aa) => {
	let dom = $('<div>').
	addClass('ektiposi-parousia');

	$('<div>').
	addClass('ektiposi-parousiaOrdinal').
	text(aa).
	appendTo(dom);

	let x = deltioDOM.
	children('.parousiaIpalilos').
	text();

	$('<div>').
	addClass('ektiposi-parousiaIpalilos').
	text(x).
	appendTo(dom);

	x = deltioDOM.
	children('.parousiaOnomateponimo').
	text();

	$('<div>').
	addClass('ektiposi-parousiaOnomateponimo').
	text(x).
	appendTo(dom);

	x = deltioDOM.
	children('.parousiaOrario').
	text();

	$('<div>').
	addClass('ektiposi-parousiaOrario').
	text(x).
	appendTo(dom);

	// Φροντίζουμε να απαλείψουμε τη σήμανση πειραγμένης εγγραφής
	// καθώς αυτό δεν μπορεί να γίνει μέσω του styling λόγω κακού
	// σχεδιασμού.

	x = deltioDOM.
	children('.parousiaMeraora').
	text().
	replace(/[^0-9: -]/g, '')

	$('<div>').
	addClass('ektiposi-parousiaMeraora').
	addClass('ektiposi-parousiaMeraora' + ektiposi.ektipotiko).
	text(x).
	appendTo(dom);

	x = deltioDOM.
	children('.parousiaExcuse').
	text();

	$('<div>').
	addClass('ektiposi-parousiaExcuse').
	text(x).
	appendTo(dom);

	x = deltioDOM.
	children('.parousiaInfo').
	text();

	$('<div>').
	addClass('ektiposi-parousiaInfo').
	addClass('ektiposi-parousiaInfo' + ektiposi.ektipotiko).
	html(ektiposi.nl2br(x)).
	appendTo(dom);

	return dom;
};

// Η function "ipografesDOM" δημιουργεί DOM element που αφορά στους
// υπογράφοντες του δελτίου. Πιο συγκεκριμένα, το εν λόγω DOM element
// αποτελεί τον επίλογο του δελτίου και περιλαμβάνει τους δύο τελευταίους
// υπογράφοντες του δελτίου.

ektiposi.ipografesDOM = () => {
	let dom = $('<div>').
	addClass('ektiposi-ipografes');

	let ilist = pnd.ofelimoDOM.
	children('.ipografesArea').
	children('.ipografes').
	children();

	let i = ilist.length - 2;

	while (i < 0)
	i++;

	for (; i < ilist.length; i++)
	dom.
	append(ektiposi.ipografiDOM($(ilist[i])));

	return dom;
};

// Η function "ipografiDOM" δέχεται ως παράμετρο το DOM element υπογράφοντος
// υπαλλήλου και δημιουργεί DOM element στη σελίδα εκτύπωσης του δελτίου.
// Αυτό το DOM element περιλαμβάνει τον τίτλο και το ονοματεπώνυμο του
// υπογράφοντος, καθώς επίσης και την ημερομηνία και την ώρα κύρωσης του
// δελτίου από τον συγκεκριμένο υπογράφοντα· αν ο εν λόγω υπογράφων δεν έχει
// κυρώσει το δελτίο, τότε στο DOM element αναφέρεται ότι το δελτίο βρίσκεται
// σε κατάσταση αναμονής ελέγχου και κύρωσης από τον συγκεκριμένο υπογράφοντα.

ektiposi.ipografiDOM = (deltioDOM) => {
	let dom = $('<div>').
	addClass('ektiposi-ipografi');

	let titlos = deltioDOM.
	children('.ipografiTitlos').
	text();

	// Αν δεν έχει συμπληρωθεί τίτλος υπογράφοντος, τότε ο συγκεκριμένος
	// υπογράφων δεν εμφανίζεται. Αυτό είναι χρήσιμο σε περιπτώσεις που
	// υπογράφει μόνο ένας, π.χ. ο διευθυντής της Δημοτικής Αστυνομίας,
	// αλλά υπάρχει πρώτος υπογράφων που είναι ο συντάξας ο οποίος όμως
	// δεν θέλουμε να εμφανίζεται.

	if (!titlos)
	return dom;

	let katastasiDOM = $('<div>').
	addClass('ektiposi-ipografiKatastasi').
	appendTo(dom);

	let x = deltioDOM.data('checkok');

	if (x)
	katastasiDOM.
	addClass('ektiposi-ipografiKirosi').
	text(x);

	else
	katastasiDOM.
	addClass('ektiposi-ipografiAnamoni');

	$('<div>').
	addClass('ektiposi-ipografiTitlos').
	text(titlos).
	appendTo(dom);

	x = deltioDOM.
	children('.ipografiOnomateponimo').
	text();

	$('<div>').
	addClass('ektiposi-ipografiOnomateponimo').
	text(x).
	appendTo(dom);

	return dom;
};

// Η πλήρης εκτύπωση του δελτίου δρομολογείται από το μενού εργαλείων του
// προγράμματος επεξεργασίας δελτίων και παρέχει μια αναλυτική εκτύπωση του
// δελτίου.

ektiposi.deltioPlires = (e) => {
	prosopa.ergaliaDOM.dialog('close');
	window.print();
};

// Η εκτύπωση του δελτίου απόντων δρομολογείται από το μενού εργαλείων του
// προγράμματος επεξεργασίας δελτίων και περιλαμβάνει:
//
//	⚫ υπαλλήλους που δεν έχουν συμπληρωμένη ώρα προσέλευσης/αποχώρησης
//	  χωρίς αιτιολογία (excuse)
//
//	⚫ υπαλλήλους που λείπουν με άδεια
//
// Ουσιαστικά πρόκειται για υπαλλήλους που δεν εργάζονται τη συγκεκριμένη
// ημέρα που αφορά το δελτίο προσέλευσης/αποχώρησης. Οι συγκεκριμένες εγγραφές
// είθισται να καταχωρούνται στο ΟΠΣΟΥ ως άδειες είδους "ΔΕΛΤΙΟ ΑΠΟΝΤΩΝ" οι
// οποίες αργότερα αντικαθίστανται από τα επίσημα έντυπα αίτησης αδείας που
// προσκομίζουν οι αδειούχοι υπάλληλοι.

ektiposi.deltioAponton = (e) => {
	prosopa.ergaliaDOM.dialog('close');
	ektiposi.ektipotiko = 'Apontes';
	ektiposi.titlosGet = ektiposi.titlosGetApontes;
	ektiposi.perigrafiGet = ektiposi.perigrafiGetDeltio;
	ektiposi.prosopa = ektiposi.prosopaApontes;
	window.print();
};

// Η εκτύπωση του ημερήσιου δελτίου προσέλευσης/αποχώρησης δρομολογείται
// από το μενού εργαλείων του προγράμματος επεξεργασίας δελτίων και
// συνδυάζει τις εγγραφές δύο δελτίων της ίδιας ημερομηνίας, με σχέση
// προτύπου/αντιγράφου, όπου το πρότυπο είναι δελτίο προσέλευσης και
// το αντίγραφο είναι δελτίο αποχώρησης. Ουσιαστικά, η συγκεκριμένη
// εκτύπωση παρουσιάζει συνολικά την προσέλευση, την αποχώρηση και
// τις απουσίες -αιτιολογημένες ή μη- των εργαζομένων σε συγκεκριμένη
// οργανική μονάδα, για συγκεκριμένη ημερομηνία.

ektiposi.deltioImerisio = (e) => {
	prosopa.ergaliaDOM.dialog('close');
	let plist = {};

	pnd.fyiMessage('Επιλογή στοιχείων προσέλευσης/αποχώρησης υπαλλήλων…');
	$.post({
		'url': 'imerisio.php',
		'data': {
			'deltio': prosopa.deltio.kodikosGet(),
		},
		'dataType': 'json',
		'success': (rsp) => ektiposi.imerisioProcess(rsp),
		'error': (err) => ektiposi.imerisioError(err),
	});

	return ektiposi;
};

ektiposi.imerisioProcess = (rsp) => {
	if (rsp.error)
	return pnd.fyiError(rsp.error);

	pnd.fyiClear();
	ektiposi.ektipotiko = 'Imerisio';
	ektiposi.titlosGet = ektiposi.titlosGetImerisio;
	ektiposi.perigrafiGet = () => ektiposi.perigrafiGetImerisio(rsp);
	ektiposi.prosopa = () => ektiposi.prosopaImerisio(rsp.parousia);

	window.print();
};

ektiposi.imerisioError = (err) => {
	console.error(err);
	pnd.fyiError('Σφάλμα επιλογής στοιχείων ημερήσιου δελτίου');
};

///////////////////////////////////////////////////////////////////////////////@

// Για την εκτύπωση του ημερήσιου δελτίου προσέλευσης/αποχώρησης κρίνεται
// σκόπιμο να δημιουργήσουμε αντικείμενα πλήρους παρουσίας τα οποία
// περιλαμβάνουν στοιχεία τόσο της προσέλευσης όσο και της αποχώρησης
// των υπαλλήλων. Τα αντικείμενα αυτά δημιουργούνται από τα πρωτογενή
// στοιχεία που επιστρέφονται από τον server αντιστοιχίζοντας τα πεδία
// ως εξής:
//
// Περιγραφή		Server		Client			Τύπος
// -------------------------------------------------------------------
// Ωράριο		  o		orario			Ωράριο
// Αρ. κάρτας		  k		karta			Number
// Ώρα προσέλευσης	  p		proselefsi		Date
// Ώρα αποχώρησης	  a		apoxorisi		Date
// Excuse προσέλευσης	  px		proselefsiExcuse	String
// Excuse αποχώρησης	  px		apoxorisiExcuse		String
// Είδος αδείας		  ai		adidos			String
// Έναρξη αδείας	  aa		adapo			String
// Λήξη αδείας		  ae		adeos			String
// Info προσέλευσης	  pf		proselefsiInfo		String
// Info αποχώρησης	  af		apoxorisiInfo		String

ektiposi.parousia = function(i, x) {
	this.ipalilos = parseInt(i);

	if (x.o)
	this.orario = new letrak.orario(x.o);

	if (x.k)
	this.karta = parseInt(x.k);

	if (x.p)
	this.proselefsi = new Date(x.p);

	if (x.a)
	this.apoxorisi = new Date(x.a);

	if (x.px)
	this.proselefsiExcuse = x.px;

	if (x.ax)
	this.apoxorisiExcuse = x.ax;

	if (x.ai) {
		this.adidos = x.ai;
		this.adapo = x.aa;
		this.adeos = x.ae;
	}

	if (x.pf)
	this.proselefsiInfo = x.pf;

	if (x.af)
	this.apoxorisiInfo = x.af;

	return this;
};

// Η μέθοδος "domGet" επιστρέφει DOM element που αφορά σε εγγραφή πλήρους
// παρουσίας.

ektiposi.parousia.prototype.domGet = function(aa) {
	let dom = $('<div>').
	addClass('ektiposi-parousia');

	$('<div>').
	addClass('ektiposi-parousiaOrdinal').
	text(aa).
	appendTo(dom);

	$('<div>').
	addClass('ektiposi-parousiaIpalilos').
	text(this.ipalilos).
	appendTo(dom);

	$('<div>').
	addClass('ektiposi-parousiaImerisioOnomateponimo').
	text(ektiposi.onomateponimo(this.ipalilos)).
	appendTo(dom);

	let x = this.orario;
	x = ((x && x.isOrario()) ? x.toString() : '');

	$('<div>').
	addClass('ektiposi-parousiaOrario').
	text(x).
	appendTo(dom);

	$('<div>').
	addClass('ektiposi-parousiaKarta').
	text(this.karta).
	appendTo(dom);

	let pdif = 0;
	let adif = 0;

	// Αν υπάρχει άδεια του υπαλλήλου στη συγκεκριμένη ημερομηνία,
	// τότε εκτυπώνουμε τα στοιχεία αδείας.

	if (this.adidos)
	ektiposi.adidos(this.adidos, this.adapo, this.adeos,
		this.proselefsiInfo, this.apoxorisiInfo, dom);

	// Αν ο υπάλληλος δεν είχε άδεια, τότε πρέπει να έχει συμπληρωμένες
	// ημερομηνίες και ώρες προσέλευσης/αποχώρησης, ή θα πρέπει να είναι
	// ευμπληρωμένες σχετικές εξαιρέσεις.

	else {
		pdif = ektiposi.prosapo("ΠΡΟΣΕΛΕΥΣΗ", this.orario,
			this.proselefsi, this.proselefsiExcuse,
			this.proselefsiInfo, dom);

		adif = ektiposi.prosapo("ΑΠΟΧΩΡΗΣΗ", this.orario,
			this.apoxorisi, this.apoxorisiExcuse,
			this.apoxorisiInfo, dom);
	}

	$('<div>').
	addClass('ektiposi-parousiaImerisioIsozigio').
	html(this.isozigio(pdif, adif)).
	appendTo(dom);

	return dom;
};

// Η function "adidos" καλείται όταν υπάρχει συμπληρωμένο είδος αδείας και
// σκοπό έχει την εκτύπωση της αδείας με τα χαρακτηριστικά της. Αν υπάρχουν
// σχόλια προσέλευσης/αποχώρησης, τότε εκτυπώνονται και αυτά (αν είναι ίδια,
// τότε εκτυπώνεται μόνο το σχόλιο προσέλευσης).

ektiposi.adidos = function(adidos, adapo, adeos, pinfo, ainfo, dom) {
	let s = adidos;

	if (adapo)
	s = pnd.strPush(s, 'από ' + adapo);

	if (adeos)
	s = pnd.strPush(s, 'έως ' + adeos);

	if (pinfo)
	s += '\n<i>' + pinfo + '</i>';

	if (ainfo && (ainfo !== pinfo))
	s += '\n<i>' + ainfo + '</i>';

	$('<div>').
	addClass('ektiposi-parousiaImerisioAdia').
	html(ektiposi.nl2br(s)).
	appendTo(dom);
};

// Η function "prosapo" καλείται για την εκτύπωση της μέρας και ώρας
// προσέλευσης/αποχώρησης. Αν υπάρχει εξαίρεση, τότε εκτυπώνεται και
// η εξαίρεση. Το ίδιο συμβαίνει και με τα σχόλια.

ektiposi.prosapo = function(prosapo, orario, meraora, exeresi, info, dom) {
	let dif = 0;
	let s = '';

	if (meraora) {
		s = pnd.date(meraora, '%D-%M-%Y %h:%m');

		dif = letrak.isozigioCalc(prosopa.deltio.imerominiaGet(),
			prosapo, orario, meraora);

		if (dif)
		s += '&nbsp;&nbsp;(' + letrak.isozigio2hm(dif, false) + ')';
	}

	if (exeresi)
	s = pnd.strPush(s, exeresi, '\n');

	if (!s)
	s = '???';

	if (info)
	s += '\n<i>' + info + '</i>';

	$('<div>').
	addClass('ektiposi-parousiaImerisioProsapo').
	html(ektiposi.nl2br(s)).
	appendTo(dom);

	return dif;
};

// Η μέθοδος "isozigio" δέχεται τα χρονικά ελλείμματα/πλεονάσματα των
// συμβάντων προσέλευσης/αποχώρησης μια πλήρους παρουσίας και επιστρέφει
// τα λεπτά περικοπής. Αν λείπει ένα ή και τα δύο συμβάντα, επιστρέφει
// ερωτηματικά, ενώ αν υπάρχει πλεόνασμα ή δεν υπάρχουν λεπτά περικοπής,
// τότε επιστρέφει κενό. Όπως και να έχει, το επιστρεφόμενο string
// εκτυπώνεται στην τελευταία στήλη του ημερήσιου δελτίου, η οποία
// αφορά στα λεπτά περικοπής.

ektiposi.parousia.prototype.isozigio = function(pdif, adif) {
	let s = '';

	if (this.adidos)
	return s;

	if ((!this.proselefsi) && (!this.proselefsiExcuse))
	s = '???';

	if ((!this.apoxorisi) && (!this.apoxorisiExcuse))
	s = pnd.strPush(s, '???', '-');

	if (s)
	return s;

	// Ο υπάλληλος έχει το δικαίωμα να συμπληρώσει τυχόν έλλειμμα χρόνου
	// προσέλευσης, παρατείνοντας την αποχώρησή του. Ωστόσο, αυτή η ανοχή
	// δεν μπορεί να καλύψει έλλειμμα μεγαλύτερο από 15 λεπτά της ώρας.

	if (adif > 15)
	adif = 15;

	if (pdif < 0)
	pdif += adif;

	if (pdif < 0)
	return letrak.isozigio2hm(pdif, true);

	return '';
};

///////////////////////////////////////////////////////////////////////////////@

ektiposi.onomateponimo = function(ipalilos) {
	try {
		return prosopa.goniki.ipalilosList[ipalilos].oe;
	} catch (e) {
		return '???';
	}
};

ektiposi.nl2br = function(s) {
	return s.replace(/\n+/, '<br>', 'g');
};

///////////////////////////////////////////////////////////////////////////////@

return ektiposi;
};
