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
// lib/letrakCore.js —— "letrak" javascript API (core module)
// @FILE END
//
// @DESCRIPTION BEGIN
// @DESCRIPTION END
//
// @HISTORY BEGIN
// Updated: 2020-06-08
// Updated: 2020-06-06
// Updated: 2020-05-19
// Updated: 2020-04-28
// Updated: 2020-04-27
// Updated: 2020-04-26
// Created: 2020-04-09
// @HISTORY END
//
// @END
//
///////////////////////////////////////////////////////////////////////////////@

"use strict";

const pd =
require('../mnt/pandora/lib/pandoraCore.js');

const letrak = {};
module.exports = letrak;

letrak.minima = {};

///////////////////////////////////////////////////////////////////////////////@

letrak.deltio = function(x) {
	if (!x)
	return this;

	let that = this;
	let y = {};

	pd.objectWalk(x, (v, k) => {
		if (letrak.deltio.economyMap.hasOwnProperty(k))
		k = letrak.deltio.economyMap[k];

		y[k] = v;
	});

	if (y.hasOwnProperty('protipo') &&
	(y.protipo == parseInt(y.protipo)))
	y.protipo = parseInt(y.protipo);

	if (y.hasOwnProperty('imerominia') &&
	y.imerominia &&
	(typeof(y.imerominia) === 'string'))
	y.imerominia = new Date(y.imerominia + ' 00:00:00');

	if (!y.hasOwnProperty('katastasi'))
	y.katastasi = letrak.deltio.katastasiEkremes;

	if (y.hasOwnProperty('alagi') &&
	y.alagi &&
	(typeof(y.alagi) === 'string'))
	y.alagi = new Date(y.alagi);

	pd.objectWalk(y, (v, k) => that[k] = v);

	if (this.hasOwnProperty('kodikos')) {
		if (isNaN(this.kodikos))
		delete this.kodikos;

		else
		this.kodikos = parseInt(this.kodikos);
	}

	return this;
};

letrak.deltio.economyMap = {
	'k': 'kodikos',
	'p': 'protipo',
	'i': 'imerominia',
	'r': 'ipiresia',
	'o': 'prosapo',
	'e': 'perigrafi',
	's': 'katastasi',
};

letrak.deltio.katastasiEnglishMap = {
	'ΑΝΥΠΟΓΡΑΦΟ': 'ANIPOGRAFO',
	'ΚΥΡΩΜΕΝΟ': 'KIROMENO',
	'ΕΠΙΚΥΡΩΜΕΝΟ': 'EPIKIROMENO',
};

letrak.deltio.katastasiEkremes = 'ΕΚΚΡΕΜΕΣ';
letrak.deltio.katastasiEnglishMap[letrak.deltio.katastasiEkremes] = 'EKREMES';

letrak.deltio.katastasi2english = (katastasi) => {
	if (!katastasi)
	katastasi = letrak.deltio.katastasiEkremes;

	else if (!letrak.deltio.katastasiEnglishMap.hasOwnProperty(katastasi))
	katastasi = letrak.deltio.katastasiEkremes;

	return letrak.deltio.katastasiEnglishMap[katastasi];
};

letrak.deltio.prototype.katastasiSet = function(katastasi) {
	if (!katastasi)
	katastasi = letrak.deltio.katastasiEkremes;

	else if (!letrak.deltio.katastasiEnglishMap.hasOwnProperty(katastasi))
	katastasi = letrak.deltio.katastasiEkremes;

	this.katastasi = katastasi
	this.alagi = new Date();

	return this;
};

letrak.deltio.prototype.kodikosGet = function() {
	return this.kodikos;
};

letrak.deltio.prototype.protipoGet = function() {
	return this.protipo;
};

letrak.deltio.prototype.imerominiaGet = function() {
	return this.imerominia;
};

letrak.deltio.prototype.ipiresiaGet = function() {
	return this.ipiresia;
};

letrak.deltio.prototype.prosapoGet = function() {
	return this.prosapo;
};

letrak.deltio.prototype.perigrafiGet = function() {
	return this.perigrafi;
};

letrak.deltio.prototype.katastasiGet = function() {
	let katastasi = this.katastasi;

	if (!katastasi)
	katastasi = letrak.deltio.katastasiEkremes;

	return katastasi;
};

letrak.deltio.prototype.alagiGet = function() {
	return this.alagi;
};

letrak.deltio.prototype.isProtipo = function() {
	return this.protipoGet();
};

letrak.deltio.prototype.oxiProtipo = function() {
	return !this.isProtipo();
};

letrak.deltio.prototype.isKlisto = function() {
	let katastasi = this.katastasiGet();

	if (!katastasi)
	return false;

	if (katastasi === 'ΕΠΙΚΥΡΩΜΕΝΟ')
	return true;

	return false;
};

letrak.deltio.prototype.isAnikto = function() {
	return !this.isKlisto();
};

///////////////////////////////////////////////////////////////////////////////@

letrak.parousia = function(x) {
	if (!x)
	return this;

	let that = this;
	let y = {};

	pd.objectWalk(x, (v, k) => {
		if (letrak.parousia.economyMap.hasOwnProperty(k))
		k = letrak.parousia.economyMap[k];

		y[k] = v;
	});

	if (y.hasOwnProperty('deltio') &&
	(y.deltio == parseInt(y.deltio)))
	y.deltio = parseInt(y.deltio);

	if (y.hasOwnProperty('ipalilos') &&
	(y.ipalilos == parseInt(y.ipalilos)))
	y.ipalilos = parseInt(y.ipalilos);

	if (y.hasOwnProperty('karta') &&
	(y.karta == parseInt(y.karta)))
	y.karta = parseInt(y.karta);

	if (y.hasOwnProperty('meraora') &&
	y.meraora &&
	(typeof(y.meraora) === 'string'))
	y.meraora = new Date(y.meraora);

	pd.objectWalk(y, (v, k) => that[k] = v);

	return this;
};

letrak.parousia.economyMap = {
	'm': 'deltio',

	'i': 'ipalilos',
	'l': 'eponimo',
	'f': 'onoma',
	'r': 'patronimo',

	'o': 'orario',
	'k': 'karta',
	't': 'meraora',

	'a': 'adidos',
	'p': 'adapo',
	'e': 'adeos',

	'x': 'excuse',
	's': 'info',
};

letrak.parousia.prototype.ipalilosSet = function(ipalilos) {
	this.ipalilos = ipalilos;
	return this;
};

letrak.parousia.prototype.deltioGet = function() {
	return this.deltio;
};

letrak.parousia.prototype.ipalilosGet = function() {
	return this.ipalilos;
};

letrak.parousia.prototype.eponimoGet = function() {
	return this.eponimo;
};

letrak.parousia.prototype.onomaGet = function() {
	return this.onoma;
};

letrak.parousia.prototype.patronimoGet = function() {
	return this.patronimo;
};

letrak.parousia.prototype.onomateponimoGet = function() {
	if (this.hasOwnProperty('onomateponimo'))
	return this.onomateponimo;

	this.onomateponimo = '';

	this.onomateponimo = pd.strPush(this.onomateponimo, this.eponimo);
	this.onomateponimo = pd.strPush(this.onomateponimo, this.onoma);

	if (this.patronimo)
	this.onomateponimo = pd.strPush(this.onomateponimo,
		this.patronimo.substr(0, 3));

	return this.onomateponimo;
};

letrak.parousia.prototype.orarioGet = function() {
	return this.orario;
};

letrak.parousia.prototype.kartaGet = function() {
	return this.karta;
};

letrak.parousia.prototype.meraoraGet = function() {
	return this.meraora;
};

letrak.parousia.prototype.adidosGet = function() {
	return this.adidos;
};

letrak.parousia.prototype.adiaGet = function() {
	return this.adidosGet();
};

letrak.parousia.prototype.adapoGet = function() {
	return this.adapo;
};

letrak.parousia.prototype.adeosGet = function() {
	return this.adeos;
};

letrak.parousia.prototype.excuseGet = function() {
	return this.excuse;
};

letrak.parousia.prototype.infoGet = function() {
	let s = this.info;

	if (!s)
	s = '';

	return s;
};

letrak.parousia.prototype.excuseAdiaGet = function() {
	let s = this.adidosGet();

	if (s)
	return s;

	return this.excuseGet();
};

letrak.parousia.prototype.infoAdiaGet = function() {
	let s = '';
	let t;

	t = this.adapoGet();

	if (t) {
		t = pd.date2date(t, 'Y-M-D', 'από %D/%M/%Y');
		s = pd.strPush(s, t);
	}

	t = this.adeosGet();

	if (t) {
		t = pd.date2date(t, 'Y-M-D', 'έως %D/%M/%Y');
		s = pd.strPush(s, t);
	}

	t = this.infoGet();

	if (t)
	s = pd.strPush(s, t);

	return s;
};

letrak.parousia.prototype.isOrario = function() {
	let orario = this.orarioGet();

	if (!orario)
	return undefined;

	orario = new letrak.orario(orario);

	if (orario.oxiOrario())
	return undefined;

	return orario;
};

letrak.parousia.prototype.oxiOrario = function() {
	return !this.isOrario();
};

letrak.parousia.prototype.isMeraora = function() {
	return this.meraoraGet();
};

letrak.parousia.prototype.oxiMeraora = function() {
	return !this.isMeraora();
};

letrak.parousia.prototype.isAdia = function() {
	return this.adidosGet();
};

letrak.parousia.prototype.oxiAdia = function() {
	return !this.isAdia();
};

letrak.parousia.prototype.isExcuse = function() {
	return this.excuseGet();
};

letrak.parousia.prototype.oxiExcuse = function() {
	return !this.isExcuse();
};

letrak.parousia.prototype.isParousia = function() {
	if (this.isAdia())
	return true;

	if (this.isExcuse())
	return true;

	if (this.oxiOrario())
	return false;

	if (this.oxiMeraora())
	return false;

	return true;
};

letrak.parousia.prototype.oxiParousia = function() {
	return !this.isParousia();
};

letrak.parousia.prototype.pleonelimaSet = function(deltio) {
	this.pleoneli = undefined;

	if (!deltio)
	return this;

	let orario = new letrak.orario(this.orarioGet());

	if (!orario)
	return this;

	if (orario.oxiOrario())
	return this;

	let meraora = this.meraoraGet();

	if (!meraora)
	return this;

	if (!(meraora instanceof Date))
	return this;

	let imerominia = deltio.imerominiaGet();

	if (!imerominia)
	return this;

	let prosapo = deltio.prosapoGet();

	if (!prosapo)
	return this;

	let ora;
	let prosimo;

	switch (prosapo) {
	case 'ΠΡΟΣΕΛΕΥΣΗ':
		ora = orario.apomeraoraGet(imerominia);
		prosimo = -1;
		break;
	case 'ΑΠΟΧΩΡΗΣΗ':
		ora = orario.eosmeraoraGet(imerominia);
		prosimo = 1;
		break;
	default:
		return this;
	}

	let lepta = (meraora.getTime() - ora.getTime()) * prosimo;
	lepta = parseInt(lepta / 60000);

	this.pleonelima = lepta;
	return this;
};

letrak.parousia.prototype.pleonelimaGet = function() {
	return this.pleonelima;
};

letrak.pleonelima2hm = (lepta, html) => {
	let s = '';

	if (!lepta)
	return s;

	let x = parseInt(lepta);

	if (isNaN(x))
	return s;

	if (html)
	s = '<b>';

	if (x < 0) {
		s += '-';
		x = -x;
	}

	else {
		s += '+';
	}

	let l = x % 60;
	let o = (x - l) / 60;

	if (o) {
		s += o;

		if (html)
		s += '</b><i>h</i><b>';

		else
		s += 'h';
	}

	if (l) {
		s += l;

		if (html)
		s += '</b><i>m</i><b>';

		else
		s += 'm';
	}

	if (html)
	s += '</b>';

	return s;
};

///////////////////////////////////////////////////////////////////////////////@

letrak.ipografi = function(x) {
	if (!x)
	return this;

	let that = this;
	let y = {};

	pd.objectWalk(x, (v, k) => {
		if (letrak.ipografi.economyMap.hasOwnProperty(k))
		k = letrak.ipografi.economyMap[k];

		y[k] = v;
	});


	if (y.hasOwnProperty('taxinomisi') &&
	(y.taxinomisi == parseInt(y.taxinomisi)))
	y.taxinomisi = parseInt(y.taxinomisi);

	if (y.hasOwnProperty('armodios') &&
	(y.armodios == parseInt(y.armodios)))
	y.armodios = parseInt(y.armodios);

	if (y.hasOwnProperty('checkok') &&
	y.checkok &&
	(typeof(y.checkok) === 'string'))
	y.checkok = new Date(y.checkok);

	pd.objectWalk(y, (v, k) => that[k] = v);

	return this;
};

letrak.ipografi.economyMap = {
	'x': 'taxinomisi',
	't': 'titlos',
	'a': 'armodios',
	'e': 'eponimo',
	'o': 'onoma',
	'c': 'checkok',
};

letrak.ipografi.prototype.taxinomisiSet = function(taxinomisi) {
	delete this.taxinomisi;

	taxinomisi = parseInt(taxinomisi);

	if (isNaN(taxinomisi))
	return this;

	if (taxinomisi < 1)
	return this;

 	if (taxinomisi > 255)
	return this;

	this.taxinomisi = taxinomisi;
	return this;
};

letrak.ipografi.prototype.titlosSet = function(titlos) {
	delete this.titlos;

	if (!titlos)
	return this;

	this.titlos = titlos;
	return this;
};

letrak.ipografi.prototype.armodiosSet = function(armodios) {
	delete this.armodios;

	armodios = parseInt(armodios);

	if (isNaN(armodios))
	return this;

	if (armodios < 1)
	return this;

 	if (armodios > 999999)
	return this;

	this.armodios = armodios;
	return this;
};

letrak.ipografi.prototype.checkokSet = function(checkok) {
	delete this.checkok;

	if (!checkok)
	return this;

	this.checkok = checkok;
	return this;
};

letrak.ipografi.prototype.taxinomisiGet = function() {
	return this.taxinomisi;
};

letrak.ipografi.prototype.titlosGet = function() {
	return this.titlos;
};

letrak.ipografi.prototype.armodiosGet = function() {
	return this.armodios;
};

letrak.ipografi.prototype.eponimoGet = function() {
	return this.eponimo;
};

letrak.ipografi.prototype.onomaGet = function() {
	return this.onoma;
};

letrak.ipografi.prototype.checkokGet = function() {
	return this.checkok;
};

letrak.ipografi.prototype.onomateponimoGet = function() {
	if (this.hasOwnProperty('onomateponimo'))
	return this.onomateponimo;

	this.onomateponimo = '';

	this.onomateponimo = pd.strPush(this.onomateponimo, this.eponimo);
	this.onomateponimo = pd.strPush(this.onomateponimo, this.onoma);

	return this.onomateponimo;
};

///////////////////////////////////////////////////////////////////////////////@

// Το αντικείμενο "oralepto" απεικονίζεί ακριβώς αυτό, δηλαδή κάποια στιγμή
// του εικοσιτετραώρου με ακρίβεια λεπτού, π.χ. 20:32, 09:14, 24:00 κλπ.
// Ουσιαστικά πρόκειται για ζεύγος αριθμών εκ των οποίων ο πρώτος αριθμός
// είναι η ώρα (στο διάστημα 00 έως 24), ενώ ο δεύτερος αριθμός είναι το
// λεπτό (στο διάστημα 00 έως 59).
//
// Κατά το ορισμό νέου αντικειμένου μπορούμε να περάσουμε την επιθυμητή ώρα
// ως string, π.χ. 10:34, ή μπορούμε να περάσουμε δύο παραμέτρους που είναι
// η ώρα και το λεπτό αντίστοιχα, π.χ. για την ώρα 10:34 θα περάσουμε τους
// αριθμούς 10 και 34. Τέλος, μπορούμε να περάσουμε ένα άλλο αντικείμενο
// τύπου "oralepto".

letrak.oralepto = function() {
	if (arguments.length < 1)
	return this;

	if (arguments.length > 2)
	return this;

	// Αν έχουμε περάσει δύο παραμέτρους παραπέμπουμε την κατασκευή σε
	// εξειδικευμένη μέθοδο που δέχεται ώρα και λεπτό.

	if (arguments.length === 2)
	return this.oraleptoSet(arguments[0], arguments[1]);

	// Αν η παράμετρος είναι τύπου "oralepto" τότε δημιουργούμε το νέο
	// αντικείμενο από την ώρα και το λεπτό του αντικειμένου αυτού.

	if (arguments[0] instanceof letrak.oralepto)
	return this.oraleptoSet(arguments[0].ora, arguments[0].lepto);

	// Έχει περαστεί μία παράμετρος και δεν είναι τύπου "oralepto",
	// επομένως η μόνη αποδεκτές τιμές είναι ένα νούμερο, π.χ. 1034
	// ή ένα string, π.χ. "10:34" κλπ. Ελέγχουμε πρώτα την περίπτωση
	// κατά την οποία έχει περαστεί ένα νούμερο.

	let oralepto = parseInt(arguments[0]);

	if (arguments[0] == oralepto) {
		if (oralepto < 0)
		return this;

		let lepto = oralepto % 100;
		let ora = (oralepto - lepto) / 100;

		return this.oraleptoSet(ora, lepto);
	}

	// Η παράμετρος που περάστηκε δεν ήταν αριθμητική, επομένως έχει
	// απομείνει μόνο η περίπτωση του string.

	if (typeof(arguments[0]) !== 'string')
	return this;

	// Σπάμε το string σε ώρα και λεπτό και προχωρούμε κατά τα γνωστά.

	let a = arguments[0].split(/:/);

	if (a.length === 2)
	this.oraleptoSet(a[0], a[1]);
}

// Η μέθοδος "oraleptoSet" είναι πολύ συγκεκριμένη και δέχεται ως παραμέτρους
// δύο αριθμούς, την ώρα και το λεπτό αντίστοιχα. Αν δεν έχουν περαστεί δύο
// νούμερα, ή τα νούμερα αυτά δεν είναι αποδεκτά ως ώρα και λεπτό αντίστοιχα,
// τότε το αντικείμενο καθίσταται ασαφές από πλευράς περιεχομένου.

letrak.oralepto.prototype.oraleptoSet = function(ora, lepto) {
	delete this.ora;
	delete this.lepto;

	if (ora != parseInt(ora))
	return this;

	if (lepto != parseInt(lepto))
	return this;

	ora = parseInt(ora);
	lepto = parseInt(lepto);

	if ((ora < 0) || (ora > 24))
	return this;

	if ((lepto < 0) || (lepto > 59))
	return this;

	if ((ora === 24) && (lepto > 0))
	return this;

	this.ora = ora;
	this.lepto = lepto;

	return this;
};

letrak.oralepto.prototype.oraGet = function() {
	return this.ora;
};

letrak.oralepto.prototype.leptoGet = function() {
	return this.lepto;
};

letrak.oralepto.prototype.oraSet = function(ora) {
	this.ora = ora;
	return this;
};

letrak.oralepto.prototype.leptoSet = function(lepto) {
	this.lepto = lepto;
	return this;
};

letrak.oralepto.prototype.isOralepto = function() {
	return (this.hasOwnProperty('ora') && this.hasOwnProperty('lepto'));
};

letrak.oralepto.prototype.oxiOralepto = function() {
	return !this.isOralepto();
};

letrak.oralepto.prototype.toString = function() {
	if (this.oxiOralepto())
	return undefined;

	let s = '';

	if (this.ora < 10)
	s += '0';

	s += this.ora + ':';

	if (this.lepto < 10)
	s += '0';

	s += this.lepto;

	return s;
};

letrak.oralepto.prototype.leptaGet = function() {
	let ora = this.oraGet();

	if (ora != parseInt(ora))
	return undefined;

	ora = parseInt(ora);

	if (ora < 0)
	return undefined;

	if (ora > 24)
	return undefined;

	let lepto = this.leptoGet();

	if (lepto != parseInt(lepto))
	return undefined;

	lepto = parseInt(lepto);

	if (lepto < 0)
	return undefined;

	if (lepto > 59)
	return undefined;

	if ((ora === 24) && (lepto !== 0))
	return undefined;

	return (ora * 60) + lepto;
};

// Η μέθοδος "leptaAdd" δέχεται ένα πλήθος λεπτών και το προσθέτει στην
// ώρα του αντικειμένου. Αν π.χ. το αντικείμενο παριστά την ώρα 10:34 και
// περάσουμε την τιμή 72, τότε το αντικείμενο θα παριστά την ώρα 11:46 καθώς
// θα προστεθεί μία ώρα (60 λεπτά) και 12 ακόμη λεπτά. Αν περάσουμε αρνητικό
// πλήθος λεπτών, τότε τα λεπτά αφαιρούνται από την ώρα του αντικειμένου.
// Η νέα ώρα μπορεί να ξεφεύγει από τα όρια του εικοσιτρτραώρου, π.χ. αν
// προσθέσουμε 40 λεπτά στην ώρα 11:30 θα λάβουμε νέα ώρα 00:10, ενώ αν
// αφαιρέσουμε 20 λεπτά από την ώρα 00:10 θα λάβουμε νέα ώρα 23:50. Αν
// κάτι δεν είναι σωστό, το περιεχόμενο παραμένει αναλλοίωτο.

letrak.oralepto.prototype.leptaAdd = function(lepta) {
	if (lepta != parseInt(lepta))
	return this;

	let l = this.leptaGet();

	if (l === undefined)
	return this;

	l += parseInt(lepta);

	if (l >= 0)
	l = l % 1440;

	else
	l = 1440 - ((-l) % 1440);

	let lepto = l % 60;
	let ora = (l - lepto) / 60;

	return this.
	oraSet(ora).
	leptoSet(lepto);
};

///////////////////////////////////////////////////////////////////////////////@

letrak.orario = function() {
	if (arguments.length < 1)
	return this;

	let a = arguments;

	if (a.length === 1) {
		if (typeof(a[0] !== 'string'))
		return this;

		a = a[0].split(/[ -]/);
	}

	if (a.length !== 2)
	return this;

	let apo = new letrak.oralepto(a[0]);

	if (apo.oxiOralepto())
	return this;

	let eos = new letrak.oralepto(a[1]);

	if (eos.oxiOralepto())
	return this;

	this.apo = apo;
	this.eos = eos;

	return this;
};

letrak.orario.prototype.apoSet = function(apo) {
	this.apo = new letrak.oralepto(apo);
	return this;
};

letrak.orario.prototype.eosSet = function(eos) {
	this.eos = new letrak.oralepto(eos);
	return this;
};

letrak.orario.prototype.apoGet = function() {
	return this.apo;
};

letrak.orario.prototype.eosGet = function() {
	return this.eos;
};

letrak.orario.prototype.apomeraoraGet = function(imerominia) {
	if (!imerominia)
	return undefined;

	if (!(imerominia instanceof Date))
	return undefined;

	let apo = this.apoGet();

	if (apo.oxiOralepto())
	return undefined;

	return new Date(imerominia.getTime() + (apo.leptaGet() * 60000));
};

letrak.orario.prototype.eosmeraoraGet = function(imerominia) {
	if (!imerominia)
	return undefined;

	if (!(imerominia instanceof Date))
	return undefined;

	let apo = this.apoGet();

	if (apo.oxiOralepto())
	return undefined;

	let eos = this.eosGet();

	if (eos.oxiOralepto())
	return undefined;

	let lepta = eos.leptaGet();

	if (apo.leptaGet() >= lepta)
	lepta += 24 * 60;

	return new Date(imerominia.getTime() + (lepta * 60000));
};

letrak.orario.prototype.isOrario = function() {
	return (this.hasOwnProperty('apo') && this.hasOwnProperty('eos'));
};

letrak.orario.prototype.oxiOrario = function() {
	return !this.isOrario();
};

letrak.orario.prototype.toString = function() {
	if (this.oxiOrario())
	return undefined;

	return this.apo.toString() + '-' + this.eos.toString();
};

///////////////////////////////////////////////////////////////////////////////@
