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
deltio_fetch()::
prosvasi_check()::
parousia_fetch(Apontes::$pro)::
parousia_fetch(Apontes::$apo)::
adiafora_mark(Apontes::$pro, Apontes::$apo)::
adiafora_mark(Apontes::$apo, Apontes::$pro)::
adiafora_delete()::
ipalilos_fetch();

print '{' .
	'"pro":' . pandora::json_string(Apontes::$pro) . ',' .
	'"apo":' . pandora::json_string(Apontes::$apo) .
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

	// Το πεδίο "apo" περιέχει το παρουσιολόγιο αποχώρησης, δηλαδή το
	// παρουσιολόγιο από το οποίο εκκινεί ο εντοπισμός απουσιών.

	public static $apo;

	// Το πεδίο "pro" περιέχει το παρουσιολόγιο προσέλευσης, το οποίο
	// αντιστοιχεί στο παρουσιολόγιο αποχώρησης.

	public static $pro;

	// Το πεδίο "ilist" περιέχει λίστα υπαλλήλων οι οποίοι παρουσιάζουν
	// απουσία.

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

	// Η μέθοδος "apo_fetch" επιχειρεί να προσπελάσει το παρουσιολόγιο
	// αποχώρησης από την database.

	public static function apo_fetch() {
		$apo = pandora::parameter_get("apo");
		self::$apo = self::deltio_fetch($apo, "αποχώρησης");
		self::imerominia_fix(self::$apo);

		return __CLASS__;
	}

	// Η μέθοδος "pro_fetch" επιχειρεί να προσπελάσει το  παρουσιολόγιο
	// προσέλευσης από την database.

	public static function pro_fetch() {
		$pro = self::$apo->protipo_get();
		self::$pro = self::deltio_fetch($pro, "προσέλευσης");
		self::imerominia_fix(self::$pro);

		return __CLASS__;
	}

	// Η μέθοδος "deltio_fetch" είναι εσωτερική και σκοπό έχει να
	// προσπελάσει ένα παρουσιολόγιο στην database και να το επιστρέψει.
	// Σε περίπτωση που δεν βρεθεί το παρουσιολόγιο, ακυρώνεται η όλη
	// διαδικασία. Ως παραμέτρους δέχεται τον κωδικό παρουσιολογίου
	// και μια περιγραφή («αποχώρηση», «προσέλευση»).

	private static function deltio_fetch($deltio, $spec = "") {
		$spec = " παρουσιολόγιο " . $spec;

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

	///////////////////////////////////////////////////////////////////////@

	// Η μέθοδος "prosvasi_check" ελέγχει τις προσβάσεις του χρήστη που
	// τρέχει την εφαρμογή και θέτει το πεδίο "mask" στον κωδικό του
	// υπαλλήλου εφόσον ο χρήστης δεν έχει δικαιώματα στις υπηρεσίες
	// που αφορούν τόσο το παρουσιολόγιο αποχώρησης όσο και το
	// παρουσιλόγιο προσέλευσης.

	public static function prosvasi_check() {
		$ipalilos = self::$prosvasi->ipalilos_get();
		$ipiresia = self::$apo->ipiresia_get();

		if (self::$apo->oxi_ipografon($ipalilos) &&
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
	// Αν το πεδίο παραμείνει null, τότε υπάρχει πρόσβαση τόσο για το
	// παρουσιολόγιο αποχώρησης, όσο και για το παρουσιολόγιο
	// προσέλευσης.

	private static function set_mask($ipalilos) {
		self::$mask = $ipalilos;
		return __CLASS__;
	}

	///////////////////////////////////////////////////////////////////////@

	// Η μέθοδος "parousia_fetch" δέχεται ως παράμετρο ένα παρουσιολόγιο
	// και θέτει το πεδίο "plist" του παρουσιολογίου να δείχνει στις
	// παρουσίες που περιλαμβάνει το παρουσιολόγιο.

	public static function parousia_fetch($deltio) {
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
			$plist[$row["ipalilos"]] = $row;
			unset($row["ipalilos"]);
		}

		$deltio->parousia = $plist;

		return __CLASS__;
	}

	///////////////////////////////////////////////////////////////////////@

	// Η μέθοδος "adiafora_mark" διαγράφει από το προς έλεγχο
	// παρουσιολόγιο τις παρουσίες που δεν παρουσιάζουν ενδιαφέρον.
	// Το προς έλεγχο παρουσιολόγιο περνιέται ως πρώτη εγγραφή ("deltio"),
	// ενώ ως δεύτερη παράμετρο περνάμε το συμπληρωματικό του ("oitled").
	// Με τον όρο "διαγραφή" δεν εννοούμε πραγματική διαγραφή της εγγραφής,
	// αλλά θέτουμε την εγγραφή σε null.

	public static function adiafora_mark($deltio, $oitled) {
		foreach (self::$deltio->parousia as $ipalilos => $parousia) {
			// Αν δεν υπάρχει αντίστοιχη εγγραφή παρουσίας για
			// τον ανά χείρας υπάλληλο στο συμπληρωματικό
			// παρουσιολόγιο, τότε η εγγραφή θεωρείται ύποπτη.

			if (!array_key_exists($ipalilos, self::$oitled->parousia))
			continue;

			// Αν υπάρχει είδος αδείας, η εγγραφή θεωρείται
			// απουσία.

			if ($parousia["adidos"])
			continue;

			// Από τις εξαιρέσεις μάς ενδιαφέρουν μόνο ορισμένα
			// είδη.

			switch ($parousia["excuse"]) {
			case 'ΓΟΝΙΚΗ':
				continue;
			}

			// Οι υπόλοιπες εξαιρέσεις δεν θεωρούνται απουσίες,
			// ασχέτως με όλα τα υπόλοιπα στοιχεία της εγγραφής.

			if ($parousia["excuse"]) {
				$deltio->parousia[$ipalilos] = NULL;
				continue;
			}

			// Η εγγραφή δεν αφορά ούτε σε άδεια ούτε σε
			// αιτιολογημένη εξαίρεση, άρα πρέπει να έχει
			// συμπηρωμένη μέρα/ώρα· αν δεν έχει συμπληρωμένη
			// μέρα/ώρα, θεωρείται απουσία.

			if (!$parousia["meraora"])
			continue;

			// Η εγγραφή έχει συμπληρωμένη μέρα/ώρα και το μόνο
			// που μένει να ελέγξουμε είναι το σχόλιο. Κανονικά
			// δεν πρέπει να υπάρχει σχόλιο σε εγγραφές που δεν
			// αφορούν σε άδεια ή σε εξαίρεση· αν υπάρχει σχόλιο,
			// η εγγραφή θεωρείται ύποπτη.

			if ($parousia["info"])
			continue;

			// Σε αυτό το σημείο έχουμε ελέγξει όλα τα στοιχεία
			// που καθιστούν την εγγραφή ενδιαφέρουσα. Αν δεν
			// έχουμε εντοπίσει κάποιο σημείο ενδιαφέροντος,
			// διαγράφουμε την εγγραφή από το προς έλεγχο
			// παρουσιολόγιο.

			$deltio->parousia[$ipalilos] = NULL;
		}

		return __CLASS__;
	}

	public static adiafora_delete() {
		foreach (self::$pro->parousia as $ipalilos => $propar) {
			// Αν δεν υπάρχει εγγραφή για τον ανά χείρας υπάλληλο
			// στο παρουσιολόγιο αποχώρησης, τότε η εγγραφή
			// θεωρείται ύποπτη.

			if (!array_key_exists($ipalilos, self::$apo->parousia))
			continue;

			// Ελέγχουμε αν η παρουσία από μόνη της δείχνει 
			// ενδεχομένως ύποπτη.

			if (self::pithani_apousia($propar))
			continue;

			// Στο σημείο αυτό έχουμε ήδη ελέγξει τα βασικά
			// στοιχεία της ανά χείρας παρουσίας και τα βρήκαμε
			// κανονικά, οπότε θα ελέγξουμε αν υπάρχει διαφορά
			// στα βασικά στοιχεία παρουσίας με την αντίστοιχη
			// παρουσία στο προηγούμενο παρουσιολόγιο.

			if (self::is_diafora($propar, self::$apo->parousia[$ipalilos]))
			continue;

			// Στο σημείο αυτό θα ελέγξουμε τυχόν παρατηρήσεις
			// της ανά χείρας παρουσίας. Αν υπάρχουν παρατηρήσεις
			// χωρίς αντίστοιχες καταχωρήσεις αδείας ή εξαίρεσης,
			// τότε η εγγραφή θεωρείται ύποπτη.

			if (self::info_check($propar, self::$pro->parousia[$ipalilos]))
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
		// Αν δεν υπάρχει μέρα και ώρα συμπληρωμένη, η εγγραφή
		// θεωρείται ύποπτη.

		if (!$parousia["meraora"])
		return FALSE;

		// Αν υπάρχει κωδικός αδείας, τότε η εγγραφή θεωρείται
		// ύποπτη.

		if ($parousia["adidos"])
		return FALSE;

		// Αν υπάρχει λόγος εξαίρεσης, τότε η εγγραφή θεωρείται
		// ύποπτη.

		if ($parousia["excuse"])
		return TRUE;

		// Δεν υπάρχει εξαίρεση. Δεν υπάρχει μέρα και ώρα. Δεν
		// υπάρχει κωδικός αδείας. Η εγγραφή θεωρείται ύποπτη.

		return TRUE;
	}

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
