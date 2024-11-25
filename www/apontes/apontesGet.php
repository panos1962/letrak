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
// συγκεκριμένης ημέρας. Αν το παρουσιολόγιο είναι παρουσιολόγιο προσέλευσης
// και δεν έχει εκδοθεί ακόμη το αντίστοιχο παρουσιολόγιο αποχώρησης, τότε
// οι απόντες αφορούν μόνο στην προσέλευση, επομένως είναι καλό να δίνεται
// παρουσιολόγιο αποχώρησης.
// @DESCRIPTION END
//
// @HISTORY BEGIN
// Updated: 2024-11-25
// Updated: 2024-11-23
// Updated: 2024-11-22
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
ipalilos_fetch()::
metadata_fetch()::
apontes_print();

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

	private static $pro;

	// Το πεδίο "apo" περιέχει το παρουσιολόγιο αποχώρησης.

	private static $apo;

	// Το πεδίο "imerominia" περιέχει την ημερομηνία των παρουσιολογίων.

	private static $imerominia;

	// Το πεδίο "ipiresia" περιέχει την υπηρεσία των παρουσιολογίων.

	private static $ipiresia;

	// Το πεδίο "perigrafi" περιέχει την περιγραφή των παρουσιολογίων.

	private static $perigrafi;

	// Το πεδίο "die" περιέχει τη διεύθυνση των παρουσιολογίων.

	private static $die;

	// Το πεδίο "tmi" περιέχει το τμήμα των παρουσιολογίων.

	private static $tmi;

	// Το πεδίο "prokat" περιέχει την κατάσταση του δελτίου προσέλευσης.

	private static $prokat;

	// Το πεδίο "apokat" περιέχει την κατάσταση του δελτίου αποχώρησης.

	private static $apokat;

	// Το πεδίο "propar" περιέχει τις απουσίες του παρουσιολογίου
	// προσέλευσης.

	private static $propar;

	// Το πεδίο "apopar" περιέχει τις απουσίες του παρουσιολογίου
	// αποχώρησης.

	private static $apopar;

	// Το πεδίο "ilist" περιέχει λίστα υπαλλήλων οι οποίοι παρουσιάζουν
	// ενδιαφέρον.

	private static $ilist;

	// Η μέθοδος "init" επιτελεί αρχικοποίηση τιμών του singleton
	// "Apontes".

	public static function init() {
		self::$prosvasi = NULL;
		self::$mask = NULL;
		self::$imerominia = NULL;
		self::$ipiresia = "";
		self::$pro = NULL;
		self::$prokat = "";
		self::$apo = NULL;
		self::$apokat = "";
		self::$ilist = [];
		self::$die = "";
		self::$tmi = "";

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
	// επιχειρεί να προσπελάσει το συμπληρωματικό παρουσιολόγιο.

	public static function deltio_check() {
		$deltio = pandora::parameter_get("deltio");
		$deltio = self::deltio_fetch($deltio, "εκκίνησης");

		switch ($deltio->prosapo) {
		case LETRAK_DELTIO_PROSAPO_PROSELEFSI:
			self::$pro = $deltio;
			self::$apo = self::simpliromatiko_fetch(
				$deltio,
				LETRAK_DELTIO_PROSAPO_APOXORISI,
				"αποχώρησης"
			);
			break;
		case LETRAK_DELTIO_PROSAPO_APOXORISI:
			self::$apo = $deltio;
			self::$pro = self::simpliromatiko_fetch(
				$deltio,
				LETRAK_DELTIO_PROSAPO_PROSELEFSI,
				"προσέλευσης"
			);

			if (!self::$pro)
			letrak::fatal_error_json("Απροσδιόριστο δελτίο προσέλευσης");

			break;
		default:
			letrak::fatal_error_json("Απροσδιόριστη προσέλευση/αποχώρηση");
			break;
		}

		return __CLASS__;
	}

	// Η μέθοδος "simpliromatiko_fetch" δέχεται ως παράμετρο ένα
	// παρουσιολόγιο και επιχειρεί να προσπελάσει το συμπληρωματικό.
	// Ως δεύτερη παράμετρο περνάμε το είδος του συμπληρωματικού
	// παρουσιολογίου, ενώ ως τρίτη παράμετρο περνάμε πάλι το είδος
	// ως μήνυμα.
	//
	// Για τη διαδικασία εντοπισμού συμπληρωματικού δελτίου θα
	// μπορούσαμε να χρησιμοποιήσουμε μόνο τα πρότυπα και τους
	// κωδικούς των δελτίων, ωστόσο αυτό δεν είναι πάντα ασφαλές.
	// Πράγματι, μετά από εκ παραδρμής διαγραφή δελτίου μπορεί να
	// ξαναδημιουργήσουμε το δελτίο και η αλυσίδα να «σπάσει».

	private static function simpliromatiko_fetch($deltio, $prosapo, $msg) {
		$imerominia = pandora::sql_string($deltio->imerominiaYMD);
		$ipiresia = pandora::sql_string($deltio->ipiresia);
		$perigrafi = pandora::sql_string($deltio->perigrafi);
		$prosapo = pandora::sql_string($prosapo);

		// Επιλέγουμε το συμπληρωματικό δελτίο με βάση την ημερομηνία,
		// την υπηρεσία και το ζητούμενο είδος. Κανονικά θα πρέπει να
		// εντοπίσουμε ένα ή κανένα συμπληρωματικό δελτίο.

		$query = "SELECT `kodikos` FROM `letrak`.`deltio`" .
			" WHERE (`imerominia` = " . $imerominia . ")" .
			" AND (`ipiresia` = " . $ipiresia . ")" .
			" AND (`perigrafi` = " . $perigrafi . ")" .
			" AND (`prosapo` = " . $prosapo . ")";

		$result = pandora::query($query);

		for ($count = 0; $row = $result->fetch_array(MYSQLI_NUM); $count++)
		$oitled = $row;

		if ($count === 1)
		return self::deltio_fetch($oitled[0], $msg);

		if ($count > 1)
		letrak::fatal_error_json("Εντοπίστηκαν περισσότερα από ένα δελτία " . $msg);

		// Δεν εντοπίσαμε συμπληρωματικό δελτίο. Αυτό σημαίνει ότι το
		// ανά χείρας δελτίο είναι το τελευταίο δελτίο τής εν λόγω
		// υπηρεσίας. Αν δεν είναι, τότε το δελτίο που ψάχνουμε μάλλον
		// έχει διαγραφεί.

		$query = "SELECT `kodikos` FROM `letrak`.`deltio`" .
			" WHERE (`imerominia` > " . $imerominia . ")" .
			" AND (`ipiresia` = " . $ipiresia . ")" .
			" AND (`perigrafi` = " . $perigrafi . ")";

		$row = pandora::first_row($query, MYSQLI_NUM);

		if ($row)
		letrak::fatal_error_json("Δεν εντοπίστηκε σχετικό δελτίο " . $msg);

		return NULL;
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

		$deltio->imerominiaYMD = $deltio->imerominia->format("Y-m-d");
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

		letrak::fatal_error_json("Απροσδιόριστα δελτία προσέλευσης/αποχώρησης");
	}

	private static function plires() {
		if (self::$pro->imerominia !== self::$apo->imerominia)
		letrak::fatal_error_json("Διαφορετική ημερομηνία προσέλευσης/αποχώρησης");

		if (self::$pro->ipiresia !== self::$apo->ipiresia)
		letrak::fatal_error_json("Διαφορετική υπηρεσία προσέλευσης/αποχώρησης");

		if (self::$pro->perigrafi !== self::$apo->perigrafi)
		letrak::fatal_error_json("Διαφορετικός τίτλος προσέλευσης/αποχώρησης");

		self::
		parousia_fetch(self::$pro)::
		parousia_fetch(self::$apo);

		return __CLASS__;
	}

	// Η function "ateles" χρησιμοποιείται όταν ελέγχουμε μόνο ένα
	// παρουσιολόγιο. Αυτό μπορεί να γίνει μόνο στα νέα παρουσιολόγια
	// προσέλευσης για τα οποία λείπει το παρουσιολόγιο αποχώρησης.

	private static function ateles($deltio) {
		self::parousia_fetch($deltio);

		return __CLASS__;
	}

	// Έχουμε ήδη διασφαλίσει ότι στην περίπτωση πλήρους δελτίου απόντων
	// τα παρουσιολόγια προσέλευσης και αποχώρησης έχουν τα ίδια βασικά
	// στοιχεία: ημερομηνία, υπηρεσία και περιγραφή.

	public static function metadata_fetch() {
		self::$imerominia = self::$pro->imerominia;
		self::$ipiresia = self::$pro->ipiresia;
		self::$perigrafi = self::$pro->perigrafi;

		$query = "SELECT `perigrafi` FROM `erpota1`.`ipiresia`" .
			" WHERE `kodikos` = " .
			pandora::sql_string(mb_substr(self::$ipiresia, 0, 3));
		$row = pandora::first_row($query, MYSQLI_NUM);
		self::$die = ($row ? $row[0] : "");

		$query = "SELECT `perigrafi` FROM `erpota1`.`ipiresia`" .
			" WHERE `kodikos` = " .
			pandora::sql_string(mb_substr(self::$ipiresia, 0, 7));
		$row = pandora::first_row($query, MYSQLI_NUM);
		self::$tmi = ($row ? $row[0] : "");

		if (self::$tmi == self::$die)
		self::$tmi = "";

		self::$prokat = self::$pro->katastasi;
		self::$propar = self::$pro->parousia;
		self::$pro = (self::$pro ? self::$pro->kodikos : "");

		if (!self::$apo)
		return __CLASS__;

		self::$apokat = self::$apo->katastasi;
		self::$apopar = self::$apo->parousia;
		self::$apo = (self::$apo ? self::$apo->kodikos : "");

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
			if ($row["adidos"]) {
				if (!$row["adapo"]) $row["adapo"] = "**/**/****";
				if (!$row["adeos"]) $row["adeos"] = "**/**/****";
				self::parousia_push($row, $deltio);
				continue;
			}

			if ($row["excuse"]) {
				self::parousia_push($row, $deltio);
				continue;
			}

			if (!$row["meraora"]) {
				$row["adidos"] = "ΑΔΙΚΑΙΟΛΟΓΗΤΗ ΑΠΟΥΣΙΑ";
				$row["adapo"] = $deltio->imerominia;
				$row["adeos"] = $deltio->imerominia;
				self::parousia_push($row, $deltio);
			}
		}

		return __CLASS__;
	}

	private static function parousia_push($parousia, $deltio) {
		$ipalilos = $parousia["ipalilos"];
		unset($parousia["ipalilos"]);

		// Προσθέτουμε την παρουσία στη λίστα παρουσιών του δελτίου.

		$deltio->parousia[$ipalilos] = $parousia;

		// Προσθέτουμε τον υπάλληλο στη λίστα απόντων.

		self::$ilist[$ipalilos] = TRUE;

		return __CLASS__;
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

	public static function apontes_print() {
		print '{' .
		'"imerominia":' . pandora::json_string(self::$imerominia) . ',' .
		'"ipiresia":' . pandora::json_string(self::$ipiresia) . ',' .
		'"perigrafi":' . pandora::json_string(self::$perigrafi) . ',' .
		'"die":' . pandora::json_string(self::$die) . ',' .
		'"tmi":' . pandora::json_string(self::$tmi) . ',' .
		'"proselefsi":' . pandora::json_string(self::$pro) . ',' .
		'"prokat":' . pandora::json_string(self::$prokat) . ',' .
		'"propar":' . pandora::json_string(self::$propar) . ',' .
		'"apoxorisi":' . pandora::json_string(self::$apo) . ',' .
		'"apokat":' . pandora::json_string(self::$apokat) . ',' .
		'"apopar":' . pandora::json_string(self::$apopar) . ',' .
		'"ipalilos":' . pandora::json_string(self::$ilist) .
		'}';

		return __CLASS__;
	}
}
?>
