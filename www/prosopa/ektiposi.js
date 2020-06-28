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
// Το παρόν αποτελεί προσάρτημα του www/prosopa/main.js και περιλαμβάνει τον
// κώδικα της default εκτύπωσης των παρουσιολογίων. Ο χρήστης δρομολογεί
// εκτύπωση μέσω των default εργαλείων του browser, είτε με Control+P, είτε
// μέσω των μενού του browser και το πρόγραμμα προετοιμάζει το δελτίο για
// εκτύπωση. Ο χρήστης μπορεί να δρομολογήσει και εκτύπωση του δελτίου
// απόντων μέσα από το μενού "Εργαλεία" του προγράμματος διαχείρισης των
// δελτίων.
// @DESCRIPTION END
//
// @HISTORY BEGIN
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

// Η εκτύπωση του δελτίου προσέλευσης/αποχώρησης δημιουργείται ως κόμβος τής
// βασικής δελίδας επεξεργασίας λεπτομερειών του δελτίου. Ο συγκεκριμένος
// κόμβος δημιουργείται κατά το στήσιμο της σελίδας και «γεμίζει» κάθε φορά
// που ο χρήστης δρομολογεί εκτύπωση δελτίου προσέλευσης/αποχώρησης ή δελτίου
// απόντων.

ektiposi.setup = () => {
	ektiposi.bodyDOM = $('<div>').
	attr('id', 'ektiposi').
	appendTo(pnd.bodyDOM);

	return ektiposi;
};

// Η function "ante" καλείται αμέσως μετά τη δρομολόγηση εκτύπωσης του δελτίου
// από τον χρήστη και πριν αρχίσει να δημιουργείται το περιεχόμενο του κόμβου
// εκτύπωσης, επομένως είναι το σωστό σημείο να λάβουν χώρα οι απαραίτητες
// εργασίες προετοιμασίας.

ektiposi.ante = () => {
	ektiposi.
	reset().
	deltio().
	prosopa();

	return ektiposi;
};

ektiposi.post = () => {
	delete ektiposi.ektipotiko;
	ektiposi.prosopa = ektiposi.prosopaDeltio;

	return ektiposi;
};

///////////////////////////////////////////////////////////////////////////////@

ektiposi.reset = () => {
	ektiposi.bodyDOM.
	empty();

	return ektiposi;
};

ektiposi.deltio = () => {
	let deltioDOM = $('<div>').
	addClass('ektiposi-deltio').
	appendTo(ektiposi.bodyDOM);

	let aristeraDOM = $('<div>').
	addClass('ektiposi-deltioAristera').
	appendTo(deltioDOM);

	aristeraDOM.

	append($('<div>').
	addClass('ektiposi-deltioDimos').
	text('ΔΗΜΟΣ ΘΕΣΣΑΛΟΝΙΚΗΣ'));

	let ipiresia = prosopa.deltio.ipiresiaGet();

	for (let i = 3; i <= ipiresia.length; i++) {
		let x = prosopa.goniki.ipiresiaList[ipiresia.substr(0, i)];

		if (x)
		aristeraDOM.
		append($('<div>').
		addClass('ektiposi-deltioIpiresia').
		text(x));
	}

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
	html(prosopa.deltio.kodikosGet() + '.&nbsp;' +
		prosopa.deltio.perigrafiGet()))).

	append($('<div>').
	addClass('ektiposi-deltioDexia').

	append($('<div>').
	addClass('ektiposi-deltioImerominia').
	text(prosopa.deltioAreaDOM.find('.deltioImerominia').text())));

	return ektiposi;
};

ektiposi.prosopa =
ektiposi.prosopaDeltio = () => {
	let plist = prosopa.browserDOM.children();
	let count = plist.length;
	let parea = ektiposi.bodyDOM;
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

ektiposi.prosopaApontes = () => {
	let plist = prosopa.browserDOM.children();
	let count = plist.length;
	let parea = ektiposi.bodyDOM;
	let aa = 0;

	plist.each(function() {
		if (ektiposi.isParon($(this)))
		return;

		aa++;
		count--;

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

ektiposi.isParon = (dom) => {
	let parousia = dom.data('parousia');

	if (!parousia)
	return true;

	if (parousia.excuseGet())
	return true;

	if (parousia.meraoraGet())
	return true;

	return false;
};

ektiposi.prosopaImerisio = (plist) => {
	if (!ektiposi.hasOwnProperty('ipalilosList')) {
		ektiposi.ipalilosList = {};
		pnd.arrayWalk(prosopa.goniki.ipalilosArray, (x) => {
			let o = x.e + ' ' + x.o;

			if (x.p)
			o += ' ' + x.p.substr(0, 3);

			ektiposi.ipalilosList[x.k] = o;
		});

	}

	let pl = [];

	pnd.objectWalk(plist, (x, i) => {
		let p = new ektiposi.parousia(i, x);
		pl.push(p);
	});

	pl.sort((p1, p2) => {
		let i1 = p1.ipalilos;
		let i2 = p2.ipalilos;

		let o1 = ektiposi.ipalilosList[i1];
		let o2 = ektiposi.ipalilosList[i2];

		return o1.localeCompare(o2);
	});

	let count = pl.length;
	let parea = ektiposi.bodyDOM;
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

ektiposi.titlosGet = () => {
	switch (ektiposi.ektipotiko) {
	case 'Apontes':
		return 'ΔΕΛΤΙΟ ΑΠΟΝΤΩΝ';
	case 'Imerisio':
		return 'ΗΜΕΡΗΣΙΟ ΔΕΛΤΙΟ ΠΡΟΣΕΛΕΥΣΗΣ/ΑΠΟΧΩΡΗΣΗΣ';
	}

	return 'Δελτίο ' + prosopa.deltio.prosapoGet() + 'Σ Εργαζομένων';
};

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

	x = deltioDOM.
	children('.parousiaMeraora').
	text();

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
	text().
	replace(/\n+/, '<br>', 'g');

	$('<div>').
	addClass('ektiposi-parousiaInfo').
	addClass('ektiposi-parousiaInfo' + ektiposi.ektipotiko).
	html(x).
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
	let x = deltioDOM.data('checkok');

	let dom = $('<div>').
	addClass('ektiposi-ipografi');

	let katastasiDOM = $('<div>').
	addClass('ektiposi-ipografiKatastasi').
	appendTo(dom);

	if (x)
	katastasiDOM.
	addClass('ektiposi-ipografiKirosi').
	text(x);

	else
	katastasiDOM.
	addClass('ektiposi-ipografiAnamoni');

	x = deltioDOM.
	children('.ipografiTitlos').
	text();

	$('<div>').
	addClass('ektiposi-ipografiTitlos').
	text(x).
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
	ektiposi.prosopa = ektiposi.prosopaApontes;
	window.print();
};

// Η εκτύπωση του ημερήσιου δελτίου προσέλευσης/αποχώρησης δρομολογείται
// από το μενού εργαλείων του προγράμματος επεξεργασίας δελτίων και
// συνδυάζει τις εγγραφές δύο δελτίων της ίδιας ημερομηνίας, με σχέση
// προτύπου/αντιγράφου, όπου το πρότυπο είναι δελτίο προσέλευσης και
// το αντίγραφο είναι δελτίο αποχώρησης. Ουσιαστικά, η συγκεκριμένη
// εκτύπωση παρουσιάζει συνολικά την προσέλευση, την αποχώρηση και
// τις απουσίες -αιτιολογημένες ή μη- των εργαζομένων σε μια οργανική
// μονάδα, για μια συγκεκριμένη ημερομηνία.

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
	ektiposi.prosopa = () => {
		ektiposi.prosopaImerisio(rsp.parousia);
	};

	window.print();
};

ektiposi.imerisioError = (err) => {
	console.error(err);
	pnd.fyiError('Σφάλμα επιλογής στοιχείων ημερήσιου δελτίου');
};

///////////////////////////////////////////////////////////////////////////////@

ektiposi.parousia = function(i, x) {
	this.ipalilos = parseInt(i);

	this.orario = new letrak.orario(x.o);
	this.karta = parseInt(x.k);

	this.proselefsi = new Date(x.p);
	this.apoxorisi = new Date(x.a);

	this.poselefsiExcuse = x.px;
	this.apoxorisiExcuse = x.ax;

	this.adidos = x.ai;
	this.adapo = x.aa;
	this.adeos = x.ae;
};

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
	addClass('ektiposi-parousiaOnomateponimo').
	text(ektiposi.ipalilosList[this.ipalilos]).
	appendTo(dom);

	$('<div>').
	addClass('ektiposi-parousiaOrario').
	text(this.orario.toString()).
	appendTo(dom);

	$('<div>').
	addClass('ektiposi-parousiaMeraora').
	text(pnd.date(this.proselefsi, '%D-%M-%Y %h:%m')).
	appendTo(dom);

	$('<div>').
	addClass('ektiposi-parousiaMeraora').
	text(pnd.date(this.apoxorisi, '%D-%M-%Y %h:%m')).
	appendTo(dom);

	$('<div>').
	addClass('ektiposi-parousiaMeraora').
	text(pnd.date(this.proselefsi, '%D-%M-%Y %h:%m')).
	appendTo(dom);

	$('<div>').
	addClass('ektiposi-parousiaMeraora').
	text(pnd.date(this.apoxorisi, '%D-%M-%Y %h:%m')).
	appendTo(dom);

	return dom;
};

///////////////////////////////////////////////////////////////////////////////@

return ektiposi;
};
