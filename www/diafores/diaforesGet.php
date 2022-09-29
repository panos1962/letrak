<?php
///////////////////////////////////////////////////////////////////////////////@
//
// @BEGIN
//
// @COPYRIGHT BEGIN
// Copyright (C) 2020 Panos I. Papadopoulos <panos1962_AT_gmail_DOT_com>
// @COPYRIGHT END
//
// @FILETYPE BEGIN
// php
// @FILETYPE END
//
// @FILE BEGIN
// www/diafores/diaforesGet.php —— Ανίχνευση και αποστολή διαφορών τρέχοντος
// παρουσιολογίου με αντίστοιχο προηγούμενο παρουσιολόγιο
// @FILE END
//
// @DESCRIPTION BEGIN
// Το παρόν πρόγραμμα καλείται από τη σελίδα παρουσίασης διαφορών τρέχοντος
// παρουσιολογίου με αντίχτοιχο προηγούμενο παρουσιολόγιο, με σκοπό την
// ανίχνευση και αποστολή των διαφορών μεταξύ των εν λόγω παρουσιολογίων.
// Ως παραμέτρους περνάμε (post) τον κωδικό του τρέχοντος παρουσιολογίου
// (tre) και τον κωδικό του αντίσοιχου προηγούμενου παρουσιολογίου (pro).
// @DESCRIPTION END
//
// @HISTORY BEGIN
// Updated: 2022-09-29
// Updated: 2022-09-28
// Updated: 2022-09-25
// Updated: 2022-09-24
// Updated: 2022-09-22
// Created: 2022-09-21
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

Diafores::
init()::
prosvasi_fetch()::
trexon_fetch()::
proigoumeno_fetch()::
prosvasi_check()::
parousia_fetch(Diafores::$tre)::
parousia_fetch(Diafores::$pro)::
adiafora_delete()::
ipalilos_fetch();

print '{' .
	'"tre":' . pandora::json_string(Diafores::$tre) . ',' .
	'"pro":' . pandora::json_string(Diafores::$pro) . ',' .
	'"ipl":' . pandora::json_string(Diafores::$ilist) .
'}';

///////////////////////////////////////////////////////////////////////////////@

class Diafores {
	// Το πεδίο "prosvasi" περιέχει τα στοιχεία πρόσβασης του χρήστη
	// που τρέχει την εφαρμογή.

	public static $prosvasi;

	// Το πεδίο "mask" χρησιμοποιείται για φιλτράρισμα των στοιχείων
	// προκειμένου να μην φανερωθούν στοιχεία σε χρήστες που δεν έχουν
	// πρόσβαση. Αν είναι null τότε δεν γίνεται κάποιο φιλτράρισμα,
	// αλλιώς περιέχει τον κωδικό του υπαλλήλου που τρέχει την εφαρμογή
	// και τα δεδομένα περιορίζονται σε αυτόν τον υπάλληλο μόνο.

	public static $mask;

	// Το πεδίο "tre" περιέχει το «τρέχον» παρουσιολόγιο, δηλαδή το
	// παρουσιολόγιο από το οποίο εκκίνησε ο εντοπισμός διαφορών.

	public static $tre;

	// Το πεδίο "pro" περιέχει το «προηγούμενο» παρουσιολόγιο, δηλαδή
	// αυτό με το οποίο θα γίνει η σύγκριση.

	public static $pro;

	// Το πεδίο "ilist" περιέχει λίστα υπαλλήλων οι οποίοι παρουσιάζουν
	// διαφορές μεταξύ τρέχοντος και προηγούμενου παρουσιολογίου.

	public static $ilist;

	// Η μέθοδος "init" επιτελεί αρχικοποίηση τιμών του singleton
	// "Diafores".

	public static function init() {
		self::$prosvasi = NULL;
		self::$mask = NULL;
		self::$tre = NULL;
		self::$pro = NULL;
		self::$ilist = [];

		return __CLASS__;
	}

	// Η μέθοδος "prosvasi_check" ελέγχει αν η εφαρμογή τρέχει από
	// επώνυμο χρήστη. Σε αντίθετη περίπτωση ακυρώνεται η διαδικασία.

	public static function prosvasi_fetch() {
		self::$prosvasi = letrak::prosvasi_get();

		if (self::$prosvasi->oxi_ipalilos())
		letrak::fatal_error_json("Διαπιστώθηκε ανώνυμη χρήση");

		return __CLASS__;
	}

	// Η μέθοδος "trexon_fetch" επιχειρεί να προσπελάσει το τρέχον
	// παρουσιολόγιο από την database.

	public static function trexon_fetch() {
		$tre = pandora::parameter_get("tre");
		self::$tre = self::deltio_fetch($tre, "τρέχον");
		self::imerominia_fix(self::$tre);

		return __CLASS__;
	}

	// Η μέθοδος "proigoumeno_fetch" επιχειρεί να προσπελάσει το
	// προηγούμενο παρουσιολόγιο από την database.

	public static function proigoumeno_fetch() {
		// Παίρνουμε πρώτα το πρότυπο του τρέχοντος παρουσιολογίου,
		// έστω αυτό το παρουσιολόγιο "Π", και μετά παίρνουμε το
		//  πρότυπο του "Π".

		$pro = self::deltio_fetch(self::$tre->protipo, "πρότυπο");
		self::$pro = self::deltio_fetch($pro->protipo, "προηγούμενο");
		self::imerominia_fix(self::$pro);

		return __CLASS__;
	}

	// Η μέθοδος "deltio_fetch" είναι εσωτερική και σκοπό έχει να
	// προσπελάσει ένα παρουσιολόγιο στην database και να το επισρέψει.
	// Σε περίπτωση που δεν βρεθεί το παρουσιολόγιο, ακυρώνεται η όλη
	// διαδικασία. Ως παραμέτρους δέχεται τον κωδικό παρουσιολογίου
	// και μια περιγραφή («τρέχον», «πρότυπο», «προηγούμενο»).

	private static function deltio_fetch($deltio, $spec = "") {
		$spec = " " . $spec . " παρουσιολόγιο";

		if (letrak::deltio_invalid_kodikos($deltio))
		letrak::fatal_error_json("Απροσδόριστο" . $spec);

		$deltio = (new Deltio())->from_database($deltio);

		if ($deltio->oxi_kodikos())
		letrak::fatal_error_json("Ακαθόριστο" . $spec);

		return $deltio;
	}

	// Η μέθοδος "imerominia_fix" είναι εσωτερική και σκοπό έχει τη
	// μετατροπή της ημερομηνίας του παρουσιολογίου από date/time σε
	// string. Ως παράμετρο δέχεται το ίδιο το παρουσιολόγιο.

	private static function imerominia_fix($deltio) {
		$deltio->imerominia = $deltio->imerominia->format("Y-m-d");
		return __CLASS__;
	}

	// Η μέθοδος "prosvasi_check" ελέγχει τις προσβάσεις του χρήστη που
	// τρέχει την εφαρμογή και θέτει το πεδίο "mask" στον κωδικό του
	// υπαλλήλου εφόσον ο χρήστης δεν έχει δικαιώματα στις υπηρεσίες
	// που αφορούν τόσο το τρέχον όσο και το προηγούμενο παρουσιολόγιο.

	public static function prosvasi_check() {
		$ipalilos = self::$prosvasi->ipalilos_get();

		$ipiresia = self::$tre->ipiresia_get();

		if (self::$tre->oxi_ipografon($ipalilos) &&
			self::$prosvasi->oxi_prosvasi_ipiresia($ipiresia))
		return self::set_mask($ipalilos);

		$ipiresia = self::$pro->ipiresia_get();

		if (self::$pro->oxi_ipografon($ipalilos) &&
			self::$prosvasi->oxi_prosvasi_ipiresia($ipiresia))
		return self::set_mask($ipalilos);

		return __CLASS__;
	}

	// Η μέθοδος "set_mask" είναι εσωτερική και σκοπό έχει να θέσει το
	// πεδίο "mask" στον κωδικό του υπαλλήλου που τρέχει την εφαρμογή.

	private static function set_mask($ipalilos) {
		self::$mask = $ipalilos;
		return __CLASS__;
	}

	// Η μέθοδος "parousia_fetch" δέχεται ως παράμετρο ένα παρουσιολόγιο
	// και θέτει το πεδίο "plist" του παρουσιολογίου να δείχενει στις
	// παρουσίες που περιλαμβάνει το παρουσιολόγιο.

	public static function parousia_fetch($deltio) {
		$plist = [];
		$query = "SELECT `ipalilos`, `orario`, `karta`, `meraora`, " .
			"`adidos`, `adapo`, `adeos`, `excuse`, `info` " .
			"FROM `letrak`.`parousia` " .
			"WHERE (`deltio` = " . $deltio->kodikos . ")";

		// Αν ο υπάλληλος που τρέχει την εφαρμογή δεν έχει πρόσβαση
		// στα προς σύγριση παρουσιολόγια, τότε οι περιορίζονται οι
		// παρουσίες μόνο σε αυτές που αφορούν τον ίδιο.

		if (self::$mask)
		$query .= " AND (`parousia`.`ipalilos` = " . self::$mask . ")";

		$result = pandora::query($query);

		while ($row = $result->fetch_array(MYSQLI_ASSOC)) {
			$plist[$row["ipalilos"]] = $row;
			unset($row["ipalilos"]);
		}

		$deltio->parousia = $plist;

		return __CLASS__;
	}

	// Στον πίνακα "columns" έχουμε τα πεδία που μπορεί να παρουσιάζουν
	// διαφορές.

	private static $columns = [
		"karta",
		"adidos",
		"adapo",
		"adeos",
		"info",
	];

	// Η μέθοδος "adiafora_delete" διαγράφει από τα προς σύγκριση
	// παρουσιολόγια τις παρουσίες που δεν παρουσιάζουν διαφορές.

	public static function adiafora_delete() {
		$tre = self::$tre->parousia;
		$pro = self::$pro->parousia;

		foreach ($tre as $ipalilos => $parousia) {
			if (!array_key_exists($ipalilos, $pro))
			continue;

			if ($parousia["excuse"])
			continue;

			if (self::adikeologiti_apousia($parousia))
			continue;

			$dif = FALSE;

			foreach (self::$columns as $column) {
				if ($parousia[$column] === $pro[$ipalilos][$column])
				continue;

				$dif = TRUE;
				break;
			}

			if ($dif)
			continue;

			unset($tre[$ipalilos]);
			unset($pro[$ipalilos]);
		}

		self::$tre->parousia = $tre;
		self::$pro->parousia = $pro;

		return __CLASS__;
	}

	// Η μέθοδος "adikeologiti_apousia" είναι εσωτερική και ελέγχει αν
	// μια εγγραφή παρουσίας υποδηλώνει αδικαιολόγητη απουσία.

	private static function adikeologiti_apousia($parousia) {
		// Αν υπάρχει μέρα και ώρα συμπληρωμένη, τότε δεν έχουμε
		// αδικαιολόγητη απουσία.

		if ($parousia["meraora"])
		return FALSE;

		// Αν de
		// αδικαιολόγητη απουσία.

		if ($parousia["adidos"])
		return FALSE;

		return TRUE;
	}

	public static function ipalilos_fetch() {
		foreach (self::$tre->parousia as $ipalilos => $parousia)
		self::$ilist[$ipalilos] = $ipalilos;

		foreach (self::$pro->parousia as $ipalilos => $parousia)
		self::$ilist[$ipalilos] = $ipalilos;

		foreach (self::$ilist as $ipalilos) {
			$query = "SELECT `eponimo`, `onoma`, `patronimo` " .
				"FROM " . letrak::erpota12("ipalilos") . " " .
				"WHERE `kodikos` = " . $ipalilos;
			self::$ilist[$ipalilos] = pandora::first_row($query, MYSQLI_ASSOC);
		}

		return __CLASS__;
	}
}
?>
