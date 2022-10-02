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
// Updated: 2022-10-02
// Updated: 2022-10-01
// Updated: 2022-09-30
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
		$pro = pandora::parameter_get("pro");

		if (!isset($pro)) {
			$pro = self::deltio_fetch(self::$tre->protipo, "πρότυπο");
			$pro = $pro->protipo;
		}

		self::$pro = self::deltio_fetch($pro, "προηγούμενο");
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
		// στα προς σύγριση παρουσιολόγια, τότε περιορίζονται οι
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

	// Η μέθοδος "adiafora_delete" διαγράφει από τα προς σύγκριση
	// παρουσιολόγια τις παρουσίες που δεν παρουσιάζουν διαφορές.

	public static function adiafora_delete() {
		// Εκκινούμε τον έλεγχο διατρέχοντας τις παρουσίες του
		// τρέχοντος παρουσιολογίου. Ωστόσο, θα μπορούσαμε να
		// εκκινήσουμε τον έλεγχο διατρέχοντας τις παρουσίες
		// του προηγούμενου παρουσιολογίου.

		foreach (self::$tre->parousia as $ipalilos => $trepar) {
			// Αν δεν υπάρχει εγγραφή για τον ανά χείρας υπάλληλο
			// στο προηγούμενο παρουσιολόγιο, τότε η εγγραφή
			// θεωρείται ύποπτη.

			if (!array_key_exists($ipalilos, self::$pro->parousia))
			continue;

			// Ελέγχουμε αν η παρουσία από μόνη της, δηλαδή χωρίς
			// να αντιπαρατεθεί με την αντίστοιχη παρουσία του
			// προηγούμενου παρουσιολογίου- δείχνει ενδεχομένως
			// ύποπτη.

			if (self::pithani_apousia($trepar))
			continue;

			// Στο σημείο αυτό έχουμε ήδη ελέγξει τα βασικά
			// στοιχεία της ανά χείρας παρουσίας και τα βρήκαμε
			// κανονικά, οπότε θα ελέγξουμε αν υπάρχει διαφορά
			// στα βασικά στοιχεία παρουσίας με την αντίστοιχη
			// παρουσία στο προηγούμενο παρουσιολόγιο.

			if (self::is_diafora($trepar, self::$pro->parousia[$ipalilos]))
			continue;

			// Στο σημείο αυτό θα ελέγξουμε με τυχόν παρατηρήσεις
			// της ανά χείρας παρουσίας. Αν υπάρχουν παρατηρήσεις
			// χωρίς αντίστοιχες καταχωρήσεις αδείας ή εξαίρεσης,
			// τότε η εγγραφή θεωρείται ύποπτη.

			if (self::info_check($trepar, self::$pro->parousia[$ipalilos]))
			continue;

			// Στο σημείο αυτό φαίνεται να μην υπάρχουν διαφορές
			// μεταξύ των δύο παρουσιολογίων για τον υπάλληλο
			// της ανά χείρας παρουσίας, επομένως απαλείφουμε
			// τις εγγραφές παρουσίας τόσο από το τρέχον όσο
			// και από το προηγούμενο παρουσιολόγιο για τον
			// ανά χείρας υπάλληλο.

			unset(self::$tre->parousia[$ipalilos]);
			unset(self::$pro->parousia[$ipalilos]);
		}

		// Έχουμε διατρέξει τις παρουσίες του τρέχοντος παρουσιολογίου
		// και έχουμε απαλείψει τις εγγραφές που δεν παρουσιάζουν
		// διαφορές από τις αντίστοιχες εγγραφές του προηγούμενου
		// παρουσιολογίου. Επισημαίνουμε ότι στο προηγούμενο
		// παρουσιολόγιο μπορεί να έχουν εναπομείνει εγγραφές
		// που δεν έχουν αντίστοιχες εγγραφές στο τρέχον παρουσιολόγιο.

		return __CLASS__;
	}

	// Η μέθοδος "pithani_apousia" είναι εσωτερική και ελέγχει αν
	// μια εγγραφή παρουσίας υποδηλώνει απουσία.

	private static function pithani_apousia($parousia) {
		// Αν υπάρχει λόγος εξαίρεσης, τότε η εγγραφή θεωρείται
		// ύποπτη.

		if ($parousia["excuse"])
		return TRUE;

		// Αν υπάρχει μέρα και ώρα συμπληρωμένη, η εγγραφή θεωρείται
		// κανονική.

		if ($parousia["meraora"])
		return FALSE;

		// Δεν υπάρχει μέρα και ώρα συμπληρωμένη. Αν υπάρχει κωδικός
		// αδείας, τότε η εγγραφή θεωρείται κανονική.

		if ($parousia["adidos"])
		return FALSE;

		// Δεν υπάρχει εξαίρεση. Δεν υπάρχει μέρα και ώρα. Δεν
		// υπάρχει κωδικός αδείας. Η εγγραφή θεωρείται ύποπτη.

		return TRUE;
	}

	// Η μέθοδος "is_diafora" είναι εσωτερική και ελέγχει δύο εγγραφές
	// παρουσίας όσον αφορά κάποια συγκεκριμένα πεδία.

	private static function is_diafora($trepar, $propar) {
		foreach ([
			"karta",
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
		foreach (self::$tre->parousia as $ipalilos => $parousia)
		self::$ilist[$ipalilos] = $ipalilos;

		foreach (self::$pro->parousia as $ipalilos => $parousia)
		self::$ilist[$ipalilos] = $ipalilos;

		// Εμπλουτίζουμε τη λίστα με ονομαστια στοιχεία των υπαλλήλων
		// που θα χρειαστούν κατά την εμφάνιση των διαφορών.

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
