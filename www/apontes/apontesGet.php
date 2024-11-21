<?php
///////////////////////////////////////////////////////////////////////////////@
//
// @BEGIN
//
// @COPYRIGHT BEGIN
// Copyright (C) 2024 Panos I. Papadopoulos <panos1962_AT_gmail_DOT_com>
// @COPYRIGHT END
//
// @FILETYPE BEGIN
// php
// @FILETYPE END
//
// @FILE BEGIN
// www/apontes/apontesGet.php —— Ανίχνευση και αποστολή απόντων ημέρας
// παρουσιολογίου.
// @FILE END
//
// @DESCRIPTION BEGIN
// Το παρόν πρόγραμμα καλείται από τη σελίδα παρουσίασης απόντων ημέρας.
// Ως παράμετρος δίνεται ένας κωδικός παρουσιολογίου. Το πρόγραμμα επιλέγει
// το συμπληρωματικό παρουσιολόγιο και κατόπιν εντοπίζει τους απόντες τής
// συγκεκριμένης ημέρας. Αν το παρουσιολόγιο είναι παρουσιλόγιο προσέλευσης
// και δεν έχει εκδοθεί ακόμη το αντίστοιχο παρουσιολόγιο αποχώρησης, τότε
// οι απόντες αφορούν μόνο στην προσέλευση, επομένως είναι καλό να δίνεται
// παρουσιολόγιο αποχώρησης.
// @DESCRIPTION END
//
// @HISTORY BEGIN
// Updated: 2024-11-21
// Updated: 2024-11-20
// Updated: 2024-11-19
// Updated: 2024-11-17
// Updated: 2024-11-16
// Updated: 2024-11-15
// Updated: 2024-11-14
// Updated: 2024-11-13
// Updated: 2024-11-08
// Created: 2024-11-07
// @HISTORY END
//
// @END
//
///////////////////////////////////////////////////////////////////////////////@

require_once("../../local/conf.php");
require_once(LETRAK_BASEDIR . "/www/lib/letrak.php");

pandora::
header_json()::
session_init()::
database();

Apontes::
init()::
prosvasi_fetch()::
deltio_check()::
prosvasi_check()::
deltio_aponton()::
ipalilos_fetch();

print '{' .
	'"proselefsi":' . pandora::json_string(Apontes::$pro) . ',' .
	'"apoxorisi":' . pandora::json_string(Apontes::$apo) . ',' .
	'"ipalilos":' . pandora::json_string(Apontes::$ilist) .
'}';

///////////////////////////////////////////////////////////////////////////////@

class Apontes {
	// Το πεδίο "prosvasi" περιέχει τα στοιχεία πρόσβασης του χρήστη
	// που τρέχει την εφαρμογή.

	private static $prosvasi;

	// Το πεδίο "mask" χρησιμοποιείται για φιλτράρισμα των στοιχείων
	// προκειμένου να μην φανερωθούν στοιχεία σε χρήστες που δεν έχουν
	// πρόσβαση. Αν είναι null τότε δεν γίνεται κάποιο φιλτράρισμα,
	// αλλιώς περιέχει τον κωδικό του υπαλλήλου που τρέχει την εφαρμογή
	// και τα δεδομένα περιορίζονται σε αυτόν τον υπάλληλο μόνο.

	private static $mask;

	// Το πεδίο "pro" περιέχει το παρουσιολόγιο προσέλευσης.

	public static $pro;

	// Το πεδίο "apo" περιέχει το παρουσιολόγιο αποχώρησης.

	public static $apo;

	// Το πεδίο "ilist" περιέχει λίστα υπαλλήλων οι οποίοι παρουσιάζουν
	// ενδιαφέρον.

	public static $ilist;

	// Η μέθοδος "init" επιτελεί αρχικοποίηση τιμών του singleton
	// "Apontes".

	public static function init() {
		self::$prosvasi = NULL;
		self::$mask = NULL;
		self::$apo = NULL;
		self::$pro = NULL;
		self::$ilist = [];

		return __CLASS__;
	}

	// Η μέθοδος "prosvasi_fetch" ελέγχει αν η εφαρμογή τρέχει από
	// επώνυμο χρήστη και θέτει ανάλογα το πεδίο "prosvasi". Σε αντίθετη
	// περίπτωση ακυρώνεται η διαδικασία.

	public static function prosvasi_fetch() {
		self::$prosvasi = letrak::prosvasi_check();
		return __CLASS__;
	}

	// Η μέθοδος "deltio_check" ελέγχει την παράμετρο "deltio" και
	// επιχειρεί να προσπελάσει το σχετικό παρουσιολόγιο.

	public static function deltio_check() {
		$deltio = pandora::parameter_get("deltio");
		$deltio = self::deltio_fetch($deltio, "εκκίνησης");

		switch ($deltio->prosapo) {
		case LETRAK_DELTIO_PROSAPO_PROSELEFSI:
			self::$pro = $deltio;
			self::apoxorisi_fetch($deltio);
			break;
		case LETRAK_DELTIO_PROSAPO_APOXORISI:
			self::$apo = $deltio;
			self::proselefsi_fetch($deltio);

			if (!self::$pro)
			letrak::fatal_error_json("Απροσδιόριστο δελτίο προσέλευσης");

			break;
		default:
			letrak::fatal_error_json("Απροσδιόριστη προσέλευση/αποχώρηση");
			break;
		}

		return __CLASS__;
	}

	// Η μέθοδος "proselefsi_fetch" δέχεται ως παράμετρο ένα παρουσιολόγιο
	// αποχώρησης και επιχειρεί να προσπελάσει το αντίστοιχο παρουσιολόγιο
	// προσέλευσης από την database.

	private static function proselefsi_fetch($deltio) {
		$query = "SELECT `kodikos` FROM `letrak`.`deltio` " .
			"WHERE `kodikos` = " . $deltio->protipo;
		self::$pro = pandora::first_row($query, MYSQLI_NUM);

		if (!self::$pro)
		return __CLASS__;

		self::$pro = self::deltio_fetch(self::$pro[0], "προσέλευσης");

		return __CLASS__;
	}

	// Η μέθοδος "apoxorisi_fetch" δέχεται ως παράμετρο ένα παρουσιολόγιο
	// προσέλευσης και επιχειρεί να προσπελάσει το αντίστοιχο παρουσιολόγιο
	// αποχώρησης από την database.

	private static function apoxorisi_fetch($deltio) {
		$query = "SELECT `kodikos` FROM `letrak`.`deltio` " .
			"WHERE `protipo` = " . $deltio->kodikos;
		self::$apo = pandora::first_row($query, MYSQLI_NUM);

		if (!self::$apo)
		return __CLASS__;

		self::$apo = self::deltio_fetch(self::$apo[0], "αποχώρησης");

		return __CLASS__;
	}

	// Η μέθοδος "deltio_fetch" είναι εσωτερική και σκοπό έχει να
	// προσπελάσει ένα παρουσιολόγιο στην database και να το επιστρέψει.
	// Σε περίπτωση που δεν βρεθεί το παρουσιολόγιο, ακυρώνεται η όλη
	// διαδικασία. Ως παραμέτρους δέχεται τον κωδικό παρουσιολογίου
	// και μια περιγραφή του είδους του δελτίου στη γενική πτώση:
	// "εκκίνησης", "αποχώρησης", "προσέλευσης".

	private static function deltio_fetch($deltio, $spec = "") {
		$spec = " δελτίο " . $spec;

		if (letrak::deltio_invalid_kodikos($deltio))
		letrak::fatal_error_json("Απροσδιόριστο" . $spec);

		$deltio = (new Deltio())->from_database($deltio);

		if ($deltio->oxi_kodikos())
		letrak::fatal_error_json("Ακαθόριστο" . $spec);

		// Μετατρέπουμε την ημερομηνία του παρουσιολογίου από
		// date/time σε string.

		$deltio->imerominia = $deltio->imerominia->format("d/m/Y");

		// Τα πεδία που ακολουθούν δεν μας ενδιαφέρουν στο δελτίο
		// απόντων.

		unset($deltio->ipalilos);
		unset($deltio->alagi);

		return $deltio;
	}

	///////////////////////////////////////////////////////////////////////@

	// Η μέθοδος "prosvasi_check" ελέγχει τις προσβάσεις του χρήστη που
	// τρέχει την εφαρμογή και θέτει το πεδίο "mask" στον κωδικό του
	// υπαλλήλου εφόσον ο χρήστης δεν έχει δικαιώματα στις υπηρεσίες
	// που αφορούν τόσο το παρουσιολόγιο αποχώρησης όσο και το
	// παρουσιολόγιο προσέλευσης.

	public static function prosvasi_check() {
		$ipalilos = self::$prosvasi->ipalilos_get();

		if (self::$pro) {
			$ipiresia = self::$pro->ipiresia_get();

			if (self::$pro->oxi_ipografon($ipalilos) &&
				self::$prosvasi->oxi_prosvasi_ipiresia($ipiresia))
			return self::set_mask($ipalilos);
		}

		if (self::$apo) {
			$ipiresia = self::$apo->ipiresia_get();

			if (self::$apo->oxi_ipografon($ipalilos) &&
				self::$prosvasi->oxi_prosvasi_ipiresia($ipiresia))
			return self::set_mask($ipalilos);
		}

		return __CLASS__;
	}

	// Η μέθοδος "set_mask" είναι εσωτερική και σκοπό έχει να θέσει το
	// πεδίο "mask" στον κωδικό του υπαλλήλου που τρέχει την εφαρμογή.
	// Αν το πεδίο παραμείνει null, τότε υπάρχει πρόσβαση τόσο για το
	// παρουσιολόγιο αποχώρησης, όσο και για το παρουσιολόγιο
	// προσέλευσης.

	private static function set_mask($ipalilos) {
		self::$mask = $ipalilos;
		return __CLASS__;
	}

	///////////////////////////////////////////////////////////////////////@

	public static function deltio_aponton() {
		if (self::$pro && self::$apo)
		return self::plires();

		if (self::$pro)
		return self::ateles(self::$pro);

		if (self::$apo)
		return self::ateles(self::$apo);

		letrak::fatal_error_json("Απροσδόριστα δελτία προσέλευσης/αποχώρησης");
	}

	private static function plires() {
		if (self::$pro->ipiresia !== self::$apo->ipiresia)
		letrak::fatal_error_json("Διαφορετική υπηρεσία προσέλευσης/αποχώρησης");

		if (self::$pro->perigrafi !== self::$apo->perigrafi)
		letrak::fatal_error_json("Διαφορετικός τίτλος προσέλευσης/αποχώρησης");

		if (self::$pro->imerominia !== self::$apo->imerominia)
		letrak::fatal_error_json("Διαφορετική ημερομηνία προσέλευσης/αποχώρησης");

		self::
		parousia_fetch(self::$pro)::
		parousia_fetch(self::$apo);

		// Έχουμε ελέγξει όλα τα στοιχεία των δελτίων προσέλευσης και
		// αποχώρησης που μπορεί να παρουσιάσουν ασυμβατότητα και τα
		// βρήκαμε εντάξει. Προχωράμε, λοιπόν, στην εκκαθάριση όλων
		// βασικών στοιχείων παρουσιολογίου που δεν ενδιαφέρουν στο
		// δελτίο απόντων.

		unset(self::$pro->prosapo);
		unset(self::$pro->protipo);

		unset(self::$apo->prosapo);
		unset(self::$apo->protipo);
		unset(self::$apo->imerominia);
		unset(self::$apo->ipiresia);
		unset(self::$apo->perigrafi);

		return __CLASS__;
	}

	// Η function "ateles" χρησιμοποιείται όταν ελέγχουμε μόνο ένα
	// παρουσιολόγιο. Αυτό μπορεί να γίνει μόνο στα παρουσιολόγια
	// προσέλευσης για τα οποία λείπει το παρουσιολόγιο αποχώρησης.

	private static function ateles($deltio) {
		// Εκκαθαρίζουμε κάποια πεδία του δελτίου προσέλευσης, τα
		// οποία δεν ενδιαφέρουν στο δελτίο απόντων.

		unset(self::$pro->prosapo);
		unset(self::$pro->protipo);

		self::parousia_fetch($deltio);

		return __CLASS__;
	}

	///////////////////////////////////////////////////////////////////////@

	// Η μέθοδος "parousia_fetch" δέχεται ως παράμετρο ένα παρουσιολόγιο
	// και θέτει το πεδίο "parousia" του παρουσιολογίου να δείχνει στις
	// παρουσίες που περιλαμβάνει το παρουσιολόγιο και οι οποίες αφορούν
	// σε απουσία. Πρόκειται για λίστα δεικτοδοτημένη με τον κωδικό
	// υπαλλήλου.

	private static function parousia_fetch($deltio) {
		$deltio->parousia = [];

		$query = "SELECT `ipalilos`, `meraora`, `adidos`, " .
			'DATE_FORMAT(`adapo`, "%d/%m/%Y") AS `adapo`, ' .
			'DATE_FORMAT(`adeos`, "%d/%m/%Y") AS `adeos`, ' .
			"`excuse`, `info` " .
			"FROM `letrak`.`parousia` " .
			"WHERE (`deltio` = " . $deltio->kodikos . ")";

		// Αν ο υπάλληλος που τρέχει την εφαρμογή δεν έχει πρόσβαση
		// στα προς σύγκριση παρουσιολόγια, τότε περιορίζονται οι
		// παρουσίες μόνο σε αυτές που αφορούν τον ίδιο.

		if (self::$mask)
		$query .= " AND (`parousia`.`ipalilos` = " . self::$mask . ")";

		$result = pandora::query($query);

		while ($row = $result->fetch_array(MYSQLI_ASSOC)) {
			switch ($row["adidos"]) {

			// Αν ΔΕΝ υπάρχει καταχωρημένη άδεια, προχωρούμε σε
			// περαιτέρω ελέγχους της εγγραφής.

			case "":
				$ignore = FALSE;
				break;

			// Τα παρακάτω είδη αδείας ΔΕΝ συνιστούν απουσία,
			// οπότε αγνοούμε την ανά χείρας εγγραφή χωρίς να
			// προβούμε σε περαιτέρω ελέγχους.

			case "ΕΚΤΟΣ ΕΔΡΑΣ":
			case "ΡΕΠΟ ΔΗΜΑΡΧΟΥ":
			case "ΑΠΟΣΠΑΣΗ":
			case "ΜΕΤΑΚΙΝΗΣΗ":
			case "ΕΣΩΤΕΡΙΚΗ ΔΙΑΘΕΣΗ":
			case "ΤΗΛΕΡΓΑΣΙΑ":
			case "ΕΚ ΠΕΡΙΤΡΟΠΗΣ":
			case "ΑΡΓΙΑ":
			case "ΔΙΑΘΕΣΙΜΟΤΗΤΑ":
			case "ΛΥΣΗ ΣΧ. ΕΡΓΑΣΙΑΣ":
				$ignore = TRUE;
				break;

			// Όλα τα υπόλοιπα είδη αδείας συνιστούν απουσία,
			// οπότε κρατάμε την ανά χείρας εγγραφή ως απουσία
			// και ΔΕΝ προβαίνουμε σε περαιτέρω ελέγχους της
			// εγγραφής.

			default:
				if (!$row["adapo"]) $row["adapo"] = "**/**/****";
				if (!$row["adeos"]) $row["adeos"] = "**/**/****";
				self::parousia_push($row, $deltio);
				$ignore = TRUE;
				break;
			}

			if ($ignore)
			continue;

			// Σχεδόν όλες οι εξαιρέσεις ΔΕΝ περιλαμβάνονται στο
			// δελτίο απόντων.

			switch ($row["excuse"]) {
			case "":	// δεν υπάρχει εξαίρεση
				$ignore = FALSE;
				break;

			case "ΓΟΝΙΚΗ":	// γονική σχολικής ενημέρωσης
				self::parousia_push($row, $deltio);
				$ignore = TRUE;
				break;

			// Όλες οι υπόλοιπες εξαιρέσεις δεν περιλαμβάνονται
			// στο δελτίο απόντων.

			default:
				$ignore = TRUE;
				break;
			}

			if ($ignore)
			continue;

			// Δεν υπάρχει άδεια ή εξαίρεση. Για να ΜΗΝ θεωρηθεί
			// απουσία πρέπει η εγγραφή να περιλαμβάνει μέρα/ώρα
			// και να ΜΗΝ περιλαμβάνει σχόλιο.

			if (self::kathari_parousia($row, $deltio))
			continue;

			self::parousia_push($row, $deltio);
		}

		return __CLASS__;
	}

	private static function kathari_parousia(&$parousia, $deltio) {
		if (self::oxi_meraora($parousia)) {
			$parousia["adidos"] = "ΑΔΙΚΑΙΟΛΟΓΗΤΗ ΑΠΟΥΣΙΑ";
			$parousia["adapo"] = $deltio->imerominia;
			$parousia["adeos"] = $deltio->imerominia;
			return FALSE;
		}

		if (self::is_sxolio($parousia))
		return FALSE;

		return TRUE;
	}

	private static function parousia_push($parousia, $deltio) {
		$ipalilos = $parousia["ipalilos"];
		unset($parousia["ipalilos"]);

		$deltio->parousia[$ipalilos] = $parousia;
		self::$ilist[$ipalilos] = "";

		return __CLASS__;
	}

	private static function is_meraora($parousia) {
		return $parousia["meraora"];
	}

	private static function oxi_meraora($parousia) {
		return !self::is_meraora($parousia);
	}

	private static function is_sxolio($parousia) {
		return $parousia["info"];
	}

	///////////////////////////////////////////////////////////////////////@

	// Εμπλουτίζουμε τη λίστα των υπαλλήλων που παρουσιάζουν απουσία με
	// τα ονομαστικά τους στοιχεία.

	public static function ipalilos_fetch() {
		foreach (self::$ilist as $ipalilos => &$onoma) {
			$query = "SELECT `eponimo`, `onoma`, `patronimo` " .
				"FROM " . letrak::erpota12("ipalilos") . " " .
				"WHERE `kodikos` = " . $ipalilos;
			$row = pandora::first_row($query, MYSQLI_NUM);
			$onoma = $row[0] . " " .  $row[1] .  " " .
				mb_substr($row[2], 0, 3);
		}

		return __CLASS__;
	}
}
?>
