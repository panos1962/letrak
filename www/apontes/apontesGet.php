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
// Ως παράμετρος δίνεται ο κωδικός παρουσιολογίου αποχώρησης της ημέρας.
// @DESCRIPTION END
//
// @HISTORY BEGIN
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
	'"pro":' . pandora::json_string(Apontes::$pro) . ',' .
	'"apo":' . pandora::json_string(Apontes::$apo) . ',' .
	'"ipo":' . pandora::json_string(Apontes::$ilist) .
'}';

///////////////////////////////////////////////////////////////////////////////@

class Apontes {
	// Το πεδίο "prosvasi" περιέχει τα στοιχεία πρόσβασης του χρήστη
	// που τρέχει την εφαρμογή.

	public static $prosvasi;

	// Το πεδίο "mask" χρησιμοποιείται για φιλτράρισμα των στοιχείων
	// προκειμένου να μην φανερωθούν στοιχεία σε χρήστες που δεν έχουν
	// πρόσβαση. Αν είναι null τότε δεν γίνεται κάποιο φιλτράρισμα,
	// αλλιώς περιέχει τον κωδικό του υπαλλήλου που τρέχει την εφαρμογή
	// και τα δεδομένα περιορίζονται σε αυτόν τον υπάλληλο μόνο.

	public static $mask;

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
			break;
		default:
			letrak::fatal_error_json("Απροσδιόριστη προσέλευση/αποχώρηση");
		}

		return __CLASS__;
	}

	// Η μέθοδος "apoxorisi_fetch" δέχεται ως παράμετρο ένα παρουσιολόγιο
	// προσέλευσης και επιχειρεί να προσπελάσει το αντίστοιχο παρουσιολόγιο
	// αποχώρησης από την database.

	public static function apoxorisi_fetch($deltio) {
		$query = "SELECT `kodikos` FROM `letrak`.`deltio` " .
			"WHERE `protipo` = " . $deltio->kodikos;
		self::$apo = pandora::first_row($query, MYSQLI_NUM);

		if (!self::$apo)
		return __CLASS__;

		self::$apo = self::deltio_fetch(self::$apo[0], "αποχώρησης");

		return __CLASS__;
	}

	// Η μέθοδος "proselefsi_fetch" δέχεται ως παράμετρο ένα παρουσιολόγιο
	// αποχώρησης και επιχειρεί να προσπελάσει το αντίστοιχο παρουσιολόγιο
	// προσέλευσης από την database.

	public static function proselefsi_fetch($deltio) {
		$query = "SELECT `kodikos` FROM `letrak`.`deltio` " .
			"WHERE `kodikos` = " . $deltio->protipo;
		self::$pro = pandora::first_row($query, MYSQLI_NUM);

		if (!self::$pro)
		return __CLASS__;

		self::$pro = self::deltio_fetch(self::$pro[0], "προσέλευσης");

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

		$deltio->imerominia = $deltio->imerominia->format("Y-m-d");

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
		self::
		parousia_fetch(self::$pro)::
		parousia_fetch(self::$apo);

		return __CLASS__;
	}

	// Η function "ateles" χρησιμοποιείται όταν ελέγχουμε μόνο ένα
	// παρουσιολόγιο. Συνήθως αυτό γίνεται στα παρουσιολόγια προσέλευσης
	// για τα οποία λείπει ή δεν έχει κυρωθεί το παρουσιολόγιο αποχώρησης.

	private static function ateles($deltio) {
		self::parousia_fetch($deltio);

		foreach ($deltio->parousia as $ipalilos => $parousia) {
			if (self::is_adia($parousia)) {
				$apoeos = self::adia_diastima($parousia);
				self::$ilist[$ipalilos] = [
					"adidos" => $parousia["adidos"],
					"apoeos" => self::adia_diastima($parousia)
				];

				if (self::is_sxolio($parousia))
				self::$ilist[$ipalilos]["info"] = $parousia["info"];

				continue;
			}

			if (self::is_exeresi($parousia)) {
				self::$ilist[$ipalilos] = [
					"adidos" => "ΓΟΝΙΚΗ (ΩΡΕΣ)"
				];

				if (self::is_sxolio($parousia))
				self::$ilist[$ipalilos]["apoeos"] = $parousia["info"];

				else
				self::$ilist[$ipalilos]["apoeos"] = "ΑΚΑΘΟΡΙΣΤΟ ΔΙΑΣΤΗΜΑ";

				continue;
			}

			if (self::is_meraora($parousia))
			continue;

			self::$ilist[$ipalilos] = [
				"adidos" => "ΑΔΙΚΑΙΟΛΟΓΗΤΗ"
			];

			if (self::is_sxolio($parousia))
			self::$ilist[$ipalilos]["apoeos"] = $parousia["info"];
		}

		unset($deltio->parousia);
		return __CLASS__;
	}

	private static function adia_diastima($parousia) {
		$apo = $parousia["adapo"];
		$eos = $parousia["adeos"];

		if ($apo)
		$diastima = "ΑΠΟ " . $apo;

		else
		$diastima = "";

		if ($eos)
		$diastima .= " ΕΩΣ " . $eos;

		return $diastima;
	}

	// Η μέθοδος "parousia_fetch" δέχεται ως παράμετρο ένα παρουσιολόγιο
	// και θέτει το πεδίο "plist" του παρουσιολογίου να δείχνει στις
	// παρουσίες που περιλαμβάνει το παρουσιολόγιο.

	private static function parousia_fetch($deltio) {
		$plist = [];

		$query = "SELECT `ipalilos`, `orario`, `karta`, `meraora`, " .
			"`adidos`, `adapo`, `adeos`, `excuse`, `info` " .
			"FROM `letrak`.`parousia` " .
			"WHERE (`deltio` = " . $deltio->kodikos . ")";

		// Αν ο υπάλληλος που τρέχει την εφαρμογή δεν έχει πρόσβαση
		// στα προς σύγκριση παρουσιολόγια, τότε περιορίζονται οι
		// παρουσίες μόνο σε αυτές που αφορούν τον ίδιο.

		if (self::$mask)
		$query .= " AND (`parousia`.`ipalilos` = " . self::$mask . ")";

		$result = pandora::query($query);

		while ($row = $result->fetch_array(MYSQLI_ASSOC)) {
			// Κάποια είδη αδείας δεν περιλαμβάνονται στο
			// δελτίο αδείας.

			$ignore = FALSE;

			switch ($row["adidos"]) {
			case "ΕΚΤΟΣ ΕΔΡΑΣ":
			case "ΑΠΟΣΠΑΣΗ":
			case "ΕΣΩΤΕΡΙΚΗ ΔΙΑΘΕΣΗ":
			case "ΤΗΛΕΡΓΑΣΙΑ":
			case "ΕΚ ΠΕΡΙΤΡΟΠΗΣ":
				$ignore = TRUE;
				break;

			// Επί τη ευκαιρία τροποποιούμε την περιγραφή της
			// ημερήσιας γονικής σε αντιδιαστολή με τη γονική
			// ωρών.

			case "ΓΟΝΙΚΗ":
				$row["adidos"] = "ΓΟΝΙΚΗ ΑΔΕΙΑ";
				break;
			}

			if ($ignore)
			continue;

			// Σχεδόν όλες οι εξαιρέσεις δεν περιλαμβάνονται στο
			// δελτίο απόντων.

			$ignore = TRUE;

			switch ($row["excuse"]) {
			case "":	// δεν υπάρχει εξαίρεση
			case "ΓΟΝΙΚΗ":
				$ignore = FALSE;
				break;
			}

			if ($ignore)
			continue;

			// Δεν υπάρχει άδεια ή εξαίρεση. Για να μην θεωρηθεί
			// απουσία πρέπει η εγγραφή να περιλαμβάνει μέρα/ώρα
			// και να μην περιλαμβάνει σχόλιο.

			if (self::kathari_parousia($row))
			continue;

			$plist[$row["ipalilos"]] = $row;
			unset($row["ipalilos"]);
		}

		$deltio->parousia = $plist;

		return __CLASS__;
	}

	private static function kathari_parousia($parousia) {
		if (self::oxi_meraora($parousia)) {
			$parousia["adidos"] = "ΑΔΙΚΑΙΟΛΟΓΗΤΗ ΑΠΟΥΣΙΑ";
			return FALSE;
		}

		if (self::is_sxolio($parousia))
		return FALSE;

		return TRUE;
	}

	private static function is_adia($parousia) {
		return $parousia["adidos"];
	}

	private static function is_exeresi($parousia) {
		return $parousia["excuse"];
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

	// Η μέθοδος "is_diafora" είναι εσωτερική και ελέγχει δύο εγγραφές
	// παρουσίας όσον αφορά κάποια συγκεκριμένα πεδία.

	private static function is_diafora($trepar, $propar) {
		foreach ([
			"adidos",
			"adapo",
			"adeos",
		] as $col) {
			if ($trepar[$col] !== $propar[$col])
			return TRUE;
		}

		return FALSE;
	}

	// Η μέθοδος "info_check" είναι εσωτερική και ελέγχει το πεδίο
	// παρατηρήσεων σε κατά τα λοιπά ίδιες παρουσίες.

	private static function info_check($trepar, $propar) {
		// Αν δεν υπάρχει παρατήρηση, τότε η παρουσία θεωρείται
		// κανονική.

		if (!$trepar["info"])
		return FALSE;

		// Αν η παρατήρηση είναι διαφορετική από την παρατήρηση του
		// προηγούμενου παρουσιολογίου, τότε η παρουσία θεωρείται
		// ύποπτη.

		if ($trepar["info"] !== $propar["info"])
		return TRUE;

		// Υπάρχει παρατήρηση και είναι ίδια με την παρατήρηση του
		// προηγούμενου παρουσιολογίου. Αν δεν υπάρχει είδος αδείας,
		// τότε η παρουσία θεωρείται ύποπτη.

		if (!$trepar["adidos"])
		return TRUE;

		// Υπάρχει παρατήρηση και είναι ίδια με την παρατήρηση του
		// προηγούμενου παρουσιολογίου. Υπάρχει και είδος αδείας.
		// Αν το είδος αδείας είναι διαφρετικό από το είδος αδείας
		// του προηγούμενου παρουσιολογίου, τότε η παρουσία θεωρείται
		// ύποπτη.

		if ($trepar["adidos"] !== $propar["adidos"])
		return TRUE;


		// Υπάρχει παρατήρηση και είδος αδείας που συμπίπτουν με τα
		// αντίστοιχα στοιχεία του προηγούμενου παρουσιολογίου. Σε
		// αυτή την περίπτωση η εγγραφή θεωρείται κανονική.

		return FALSE;
	}

	// Η μέθοδος "ipalilos_fetch" θέτει το πεδίο "ilist" να δείχνει σε
	// λίστα με τους υπαλλήλους που παρουσιάζουν διαφορές.

	public static function ipalilos_fetch() {
		// Εμπλουτίζουμε τη λίστα με ονομαστικά στοιχεία των υπαλλήλων
		// που θα χρειαστούν κατά την εμφάνιση των διαφορών.

		foreach (self::$ilist as $ipalilos => $apousia) {
			$query = "SELECT `eponimo`, `onoma`, `patronimo` " .
				"FROM " . letrak::erpota12("ipalilos") . " " .
				"WHERE `kodikos` = " . $ipalilos;
			self::$ilist[$ipalilos]["ipalilos"] = pandora::first_row($query, MYSQLI_ASSOC);
		}

		return __CLASS__;
	}
}
?>
