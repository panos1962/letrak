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
// lib/letrakCore.php —— Βασική PHP βιβλιοθήκη πλατφόρμας "letrak"
// @FILE END
//
// @DESCRIPTION BEGIN
// Το ανά χείρας PHP module μπορεί να γίνεται include σε PHP προγράμματα που
// σχετίζονται με την πλατφόρμα "letrak".
// @DESCRIPTION END
//
// @HISTORY BEGIN
// Updated: 2025-08-19
// Updated: 2021-03-31
// Updated: 2021-05-30
// Updated: 2021-05-23
// Updated: 2020-06-07
// Updated: 2020-06-06
// Updated: 2020-05-11
// Updated: 2020-05-09
// Updated: 2020-05-06
// Updated: 2020-05-05
// Updated: 2020-05-04
// Updated: 2020-05-03
// Updated: 2020-04-28
// Updated: 2020-04-27
// Updated: 2020-04-26
// Created: 2020-03-05
// @HISTORY END
//
// @END
//
///////////////////////////////////////////////////////////////////////////////@

define("LETRAK_IPALILOS_KODIKOS_MAX", 999999);
define("LETRAK_DELTIO_KODIKOS_MAX", 999999);
define("LETRAK_IPOGRAFI_TAXINOMISI_MAX", 255);

define("LETRAK_DELTIO_PROSAPO_PROSELEFSI", "ΠΡΟΣΕΛΕΥΣΗ");
define("LETRAK_DELTIO_PROSAPO_APOXORISI", "ΑΠΟΧΩΡΗΣΗ");
define("LETRAK_DELTIO_PROSAPO_PROTIPO", "ΠΡΟΤΥΠΟ");

define("LETRAK_DELTIO_KATASTASI_EKREMES", "ΕΚΚΡΕΜΕΣ");
define("LETRAK_DELTIO_KATASTASI_ANIPOGRAFO", "ΑΝΥΠΟΓΡΑΦΟ");
define("LETRAK_DELTIO_KATASTASI_KIROMENO", "ΚΥΡΩΜΕΝΟ");
define("LETRAK_DELTIO_KATASTASI_EPIKIROMENO", "ΕΠΙΚΥΡΩΜΕΝΟ");

define("LETRAK_XPARAM_DELTIO_ORDER", "ΤΑΞΙΝΟΜΗΣΗ ΔΕΛΤΙΩΝ");
define("LETRAK_XPARAM_DELTIO_ORDER_PROSFATA", "ΠΡΟΣΦΑΤΑ");
define("LETRAK_XPARAM_DELTIO_ORDER_PALEOTERA", "ΠΑΛΑΙΟΤΕΡΑ");

define("LETRAK_XPARAM_DELTIO_GROUP", "ΟΜΑΔΟΠΟΙΗΣΗ ΔΕΛΤΙΩΝ");
define("LETRAK_XPARAM_DELTIO_GROUP_IMEROMINIA", "ΗΜΕΡΟΜΗΝΙΑ");
define("LETRAK_XPARAM_DELTIO_GROUP_IPIRESIA", "ΥΠΗΡΕΣΙΑ");

// Η συμβολική σταθερά "LETRAK_ORARIO_WINDOW_MIN" καθορίζει το μέγιστο
// «παράθυρο» ελέγχου καταγραφής ώρας προσέλευσης μετά την προσέλευση,
// ή αποχώρησης πριν την αποχώρηση του εργαζομένου.

define("LETRAK_ORARIO_WINDOW_MIN", 90);		// μιάμιση ώρα

// Η συμβολική σταθερά "LETRAK_ORARIO_WINDOW_MAX" καθορίζει το μέγιστο
// «παράθυρο» ελέγχου καταγραφής ώρας προσέλευσης πριν την προσέλευση,
// ή αποχώρησης μετά την αποχώρηση του εργαζομένου.

define("LETRAK_ORARIO_WINDOW_MAX", 360);	// έξι ώρες

// Η συμβολική σταθερά "LETRAK_ORARIO_ANOXI_MAX" δείχνει το μέγιστο όριο
// συμπλήρωσης ωραρίου σε λεπτά. Αν, π.χ. το εν λόγω όριο είναι 15 λεπτά
// και κάποιος εργαζόμενος προσέλθει στην υπηρεσία του 28 λεπτά αργότερα
// από το ωράριό του, τότε ακόμη και αν αποχωρήσει 40 λεπτά αργότερα από
// το ωράριό του η καθυστέρηση λογίζεται στα 28 - 15 = 13 λεπτά.

define("LETRAK_ORARIO_ANOXI_MAX", 15);

define("LETRAK_PAROUSIA_KATAXORISI_WINPAK", "WINPAK");
define("LETRAK_PAROUSIA_KATAXORISI_SINTAKTIS", "ΣΥΝΤΑΚΤΗΣ");

class letrakCore {
	// Η property "erpota_version" παίρνει τιμές 1 ή 2 ανάλογα με την
	// τρέχουσα version της database "erpota".

	public static $erpota_version = NULL;

	public static function pathname($x) {
		return LETRAK_BASEDIR . "/" . $x;
	}

	// Η μέθοδος "erpota12" επιστρέφει την τρέχουσα version της database
	// "erpota". Μπορούμε να περάσουμε το όνομα πίνακα οπότε επιστρέφεται
	// το πλήρες όνομα του πίνακα (μαζί με την τρέχουσα database "erpota"),
	// π.χ. αν περάσουμε "ipalilos" θα επιστραφεί "`erpota2`.`ipalilos`",
	// εφόσον η τρέχουσα "erpota" database version είναι 2.

	public static function erpota12($s = NULL) {
		if (!isset(self::$erpota_version))
		self::erpota_version_get();

		if (isset($s))
		return "`erpota" . self::$erpota_version . "`.`" . $s . "`";

		return self::$erpota_version;
	}

	private static function erpota_version_get() {
		$query = "SELECT `timi` FROM `kartel`.`parametros`" .
			" WHERE `kodikos` = " .
			pandora::sql_string("erpota12");
		$row = pandora::first_row($query);

		if (!$row)
		throw new Exception("undefined 'erpota' database version");


		switch ($row[0]) {
		case 1:
		case 2:
			self::$erpota_version = (int)($row[0]);
			return self::$erpota_version;
		}

		throw new Exception("invalid 'erpota' database version");
	}

	public static function deltio_valid_kodikos($kodikos) {
		return pandora::is_integer
			($kodikos, 1, LETRAK_DELTIO_KODIKOS_MAX);
	}

	public static function deltio_invalid_kodikos($kodikos) {
		return !self::deltio_valid_kodikos($kodikos);
	}

	public static function ipalilos_valid_kodikos($kodikos) {
		return pandora::is_integer
			($kodikos, 1, LETRAK_IPALILOS_KODIKOS_MAX);
	}

	public static function ipalilos_invalid_kodikos($kodikos) {
		return !self::ipalilos_valid_kodikos($kodikos);
	}

	public static function ipografi_valid_taxinomisi($taxinomisi) {
		return pandora::is_integer
			($taxinomisi, 1, LETRAK_IPOGRAFI_TAXINOMISI_MAX);
	}

	public static function ipografi_invalid_taxinomisi($taxinomisi) {
		return !self::ipografi_valid_taxinomisi($taxinomisi);
	}

	public static function ipalilos_valid_karta($karta) {
		return pandora::is_integer($karta, 1000, 99999);
	}

	public static function ipalilos_invalid_karta($karta) {
		return !self::ipalilos_valid_karta($karta);
	}

	// Η μέθοδος "deltio_is_klisto" δέχεται έναν κωδικό παρουσιολογίου
	// και επιστρέφει true εφόσον το παρουσιολόγιο είναι κλειστό. Επίσης
	// επιστρέφει true εφόσον ο κωδικός δεν είναι αποδεκτός ή δεν υπάρχει
	// το παρουσιολόγιο. Σε κάθε άλλη περίπτωση επιστρέφει false.

	public static function deltio_is_klisto($kodikos) {
		if (self::deltio_invalid_kodikos($kodikos))
		return TRUE;

		$query = "SELECT `katastasi` FROM `letrak`.`deltio`" .
			" WHERE `kodikos` = " . $kodikos;
		$row = pandora::first_row($query);

		if (!$row)
		return TRUE;

		if ($row[0] === LETRAK_DELTIO_KATASTASI_EPIKIROMENO)
		return TRUE;

		return FALSE;
	}

	public static function deltio_is_anikto($kodikos) {
		return !deltio_is_klisto($kodikos);
	}
}

// Η κλάση "Orario" απεικονίζει ωράρια εργαζομένων. Τα ωράρια αποτελεούνται
// από δύο βασικές συνιστώσες, την ώρα προέλευσης στην εργασία και την ώρα
// αποχώρησης από την εργασία. Παραθέτουμε ορισμένα παραδείγματα:
//
// 08:00-15:00	Ο εργαζόμενος προσέρχεται στην εργασία του στις 8πμ και
//		αποχωρεί στις 3μμ.
//
// 22:00-06:00	Ο εργαζόμενος προσέρχεται στην εργασία του στις 10μμ και
//		αποχωρεί στις 6πμ της επόμενης ημέρας.
//
// Παρατηρούμε, λοιπόν, ότι δεν είναι απαραίτητο η ώρα προσέλευσης στην
// εργασία να είναι μικρότερη από την ώρα αποχώρησης από την εργασία. Στην
// περίπτωση που η ώρα αποχώρησης είναι μικρότερη από την ώρα προσέλευσης
// αυτό σημαίνει ότι ο εργαζόμενος αποχωρεί την επόμενη ημέρα.

class Orario {
	public $apo = NULL;
	public $eos = NULL;

	// Στον constructor προτιμήσαμε να δώσουμε τη δυνατότητα κατασκευής
	// από string, ώστε να καταστεί ευκολότερη η γραφή κώδικα της μορφής:
	//
	//	...
	//	$orario = new Orario("08:30-16:30");
	//	...

	function __construct($s = NULL) {
		$this->from_string($s);
	}

	// Για τις εσωτερικές διαδικασίες που αφορούν στα ωράρια είναι πολύ
	// χρήσιμη η function "is_ora_lepto" η οποία δέχεται ένα string και
	// ελέγχει αν είναι της μορφής "ΩΩ:ΛΛ" όπου "ΩΩ" είναι η ώρα και "ΛΛ"
	// το λεπτό, π.χ. "08:17", "9:10", "11:1" τα οποία μεταφράζονται σε
	// "08:17", "09:10", "11:01" αντίστοιχα. Ο παράγων της ώρας παίρνει
	// τιμές από 0 έως 24, ενώ ο παράγων των λεπτών παίρνει τιμές από
	// 0 έως 59· σε περίπτωση που η ώρα έχει την τιμή 24, τότε τα λεπτά
	// πρέπει να έχουν τιμή 0.
	//
	// Η function επιστρέφει null αν το string που της περάσαμε δεν είναι
	// αποδεκτό, αλλιώς επιστρέφει το string με format "ΩΩ:ΛΛ", π.χ. αν
	// περάσουμε "8:10" θα επιστρέψει "08:10", αν περάσουμε "5:2" θα
	// επιστρέψει "05:02", ενώ αν περάσουμε "10:76" θα επιστρέψει null.
	//
	// Επομένως η function "is_ora_lepto" μπορεί να χρησιμοποιηθεί τόσο
	// για τον έλεγχο ορθότητος ενός string όσον αφορά το αν αυτό μπορεί
	// να μεταφραστεί σε ώρα και λεπτά, όσο και για τη μετατροπή τέτοιων
	// strings σε πιο ευανάγνωστο format.

	private static function is_ora_lepto($s) {
		if (!isset($s))
		return NULL;

		$x = explode(":", $s);

		switch (count($x)) {
		case 1:
			$ora = $x[0];
			$lepto = 0;
			break;
		case 2:
			$ora = $x[0];
			$lepto = $x[1];
			break;
		default:
			return NULL;
		}

		if (pandora::not_integer($ora, 0, 24))
		return NULL;

		if (pandora::not_integer($lepto, 0, 59))
		return NULL;

		$ora = (int)$ora;
		$lepto = (int)$lepto;

		if (($ora === 24) && ($lepto !== 0))
		return NULL;

		return sprintf("%02d:%02d", $ora, $lepto);
	}

	private static function oxi_ora_lepto($s) {
		return !self::is_ora_lepto($s);
	}

	public function apo_set($s) {
		$this->apo = self::is_ora_lepto($s);
		return $this;
	}

	public function eos_set($s) {
		$this->eos = self::is_ora_lepto($s);
		return $this;
	}

	// Η μέθοδος "apo_get" επιστρέφει την ώρα προσέλευσης του ωραρίου
	// ως string. Αν περάσουμε κάποια ημερομηνία, τότε επιστρέφεται
	// η ημερομηνία συνοδευόμενη από την ώρα προσέλευσης, ως DateTime
	// object· σ' αυτήν την περίπτωση επιστρέφονται και δευτερόλεπτα
	// με μηδενική τιμή.

	public function apo_get($imerominia = NULL) {
		if ($this->oxi_orario())
		return NULL;

		if (!isset($imerominia))
		return $this->apo;

		$apo = $this->apo;

		// Δεν είναι λογικό να υπάρχει προσέλευση στην εργασία
		// τα μεσάνυχτα, ωστόσο αν παρουσιαστεί τέτοια περίπτωση
		// μετατρέπουμε την ώρα προσέλευσης σε 00:00.

		if ($apo === "24:00")
		$apo = "00:00";

		$apo = $imerominia . " " . $this->apo . ":00";
		$apo = DateTime::createFromFormat("Y-m-d H:i:s", $apo);

		// Ο έλεγχος που ακολουθεί είναι μάλλον περιττός, ωστόσο
		// μπορεί να μας γλιτώσει από πολύ κόπο σε περίπτωση που
		// κάτι δεν πάει καλά.

		if ($apo === FALSE)
		return NULL;

		return $apo;
	}

	// Η μέθοδος "eos_get" είναι παρόμοια με την "apo_get" με τη διαφορά
	// ότι επιστρέφει την ώρα αποχώρησης αντί της ώρας προσέλευσης. Είναι
	// όμως σημαντικό να γνωρίζουμε ότι υπάρχει και άλλη πιο σημαντική
	// διαφορά και αυτή αφορά στην περίπτωση που περνάμε ως παράμετρο
	// μια ημερομηνία. Όπως και στην περίπτωση της "apo_get" η ημερομηνία
	// την οποία περνάμε ως παράμετρο στην "eos_get" υποτίθεται ότι είναι
	// η ημερομηνία ελέγχου του ωραρίου. Αν, λοιπόν, το ωράριο αφορά σε
	// νυχτερινή εργασία και περνά από μια ημερομηνία στην επομένη, τότε
	// το DateTime object που θα επιστραφεί θα αφορά στην επόμενη ημέρα
	// από αυτην που περάσαμε, π.χ. αν το ωράριο είναι "22:30-06:30":
	//
	//	...
	//	$orario = new Orario("22:30-06:30);
	//	print $orario->apo_get("2020-05-13")->format("Y-m-d H:i");
	//	print $orario->eos_get("2020-05-13")->format("Y-m-d H:i");
	//	...
	//
	// θα εκτυπώσει:
	//
	//	2020-05-13 22:30
	// 	2020-05-14 06:30

	public function eos_get($imerominia = NULL) {
		if ($this->oxi_orario())
		return NULL;

		if (!isset($imerominia))
		return $this->eos;

		$eos = $this->eos;

		if ($eos === "24:00")
		$eos = "00:00";

		$eos = $imerominia . " " . $this->eos . ":00";
		$eos = DateTime::createFromFormat("Y-m-d H:i:s", $eos);

		if ($eos === FALSE)
		return NULL;

		$apo = $imerominia . " " . $this->apo . ":00";
		$apo = DateTime::createFromFormat("Y-m-d H:i:s", $apo);

		if ($apo === FALSE)
		return NULL;

		if ($apo < $eos)
		return $eos;

		return $eos->modify('+1 day');
	}

	public function is_orario() {
		if (self::oxi_ora_lepto($this->apo))
		return FALSE;

		if (self::oxi_ora_lepto($this->eos))
		return FALSE;

		return TRUE;
	}

	public function oxi_orario() {
		return !$this->is_orario();
	}

	public function from_string($s) {
		$this->apo = NULL;
		$this->eos = NULL;

		$x = explode("-", $s);

		if (count($x) != 2)
		return $this;

		$apo = self::is_ora_lepto($x[0]);

		if (!isset($apo))
		return $this;

		$eos = self::is_ora_lepto($x[1]);

		if (!isset($eos))
		return $this;

		$this->apo = $apo;
		$this->eos = $eos;

		return $this;
	}

	public function to_string() {
		$apo = self::is_ora_lepto($this->apo);

		if (!isset($apo))
		return "";

		$eos = self::is_ora_lepto($this->eos);

		if (!isset($eos))
		return "";

		return $apo . "-" . $eos;
	}

	// Η μέθοδος "proselefsi_diastima" χρησιμοποιείται κατά τον έλεγχο
	// των καταγεγραμμένων timestamps προσέλευσης του υπαλλήλου για
	// συγκεκριμένη ημερομηνία. Επιστρέφει DateTime object της ώρας
	// προσέλευσης για τη συγκεκριμένη ημερομηνία, ενώ παράλληλα θέτει
	// τα όρια ελέγχου καταγραφών με βάση τις παραμέτρους καθορισμού
	// διαστήματος ελέγχου καταγραφής (LETRAK_ORARIO_WINDOW_MIN και
	// LETRAK_ORARIO_WINDOW_MAX), π.χ. αν κάποιος εργαζόμενος έχει
	// ωράριο "08:00-16:00", η εν λόγω μέθοδος για την ημερομηνία
	// 2020-05-13 θα επιστρέψει το διάστημα από "2020-05-13 02:00:00"
	// έως "2020-05-13 09:30:00", εφόσον οι παράμετροι διαστήματος
	// ελέγχου καταγραφής είναι έξι ώρες πριν και μιάμιση ώρα μετά
	// την προσέλευση των εργαζομένων.

	public function proselefsi_diastima($imerominia = NULL, &$min, &$max) {
		$min = NULL;
		$max = NULL;

		if ($this->oxi_orario())
		return FALSE;

		if (!isset($imerominia))
		return FALSE;

		$apo = $this->apo_get($imerominia);

		if (!isset($apo))
		return FALSE;

		$d = new DateInterval("PT" . LETRAK_ORARIO_WINDOW_MAX . "M");

		$min = clone $apo;
		$min->sub($d);

		$d = new DateInterval("PT" . LETRAK_ORARIO_WINDOW_MIN . "M");

		$max = clone $apo;
		$max->add($d);

		return $apo;
	}

	public function apoxorisi_diastima($imerominia = NULL, &$min, &$max) {
		$min = NULL;
		$max = NULL;

		if ($this->oxi_orario())
		return FALSE;

		if (!isset($imerominia))
		return FALSE;

		$eos = $this->eos_get($imerominia);

		if (!isset($eos))
		return FALSE;

		$d = new DateInterval("PT" . LETRAK_ORARIO_WINDOW_MIN . "M");

		$min = clone $eos;
		$min->sub($d);

		$d = new DateInterval("PT" . LETRAK_ORARIO_WINDOW_MAX . "M");

		$max = clone $eos;
		$max->add($d);

		return $eos;
	}
}

class Ipalilos {
	public $kodikos = NULL;
	public $xparam = NULL;

	public function __construct($x = NULL) {
		$this->from_array($x);
		$this->xparam = NULL;
	}

	private function from_array($x) {
		$this->kodikos = NULL;

		if (!isset($x))
		return $this;

		foreach ($x as $k => $v) {
			try {
				$func = $k . "_set";
				$this->$func($v);
			}

			catch (Exception $e) {
				continue;
			}
		}

		return $this;
	}

	public function kodikos_set($kodikos = NULL) {
		$this->kodikos = NULL;

		if (letrak::ipalilos_invalid_kodikos($kodikos))
		return $this;

		$this->kodikos = $kodikos;
		return $this;
	}

	public function kodikos_get() {
		return $this->kodikos;
	}

	public function is_kodikos() {
		return $this->kodikos_get();
	}

	public function oxi_kodikos() {
		return !$this->is_kodikos();
	}

	public function xparam_set($param, $timi) {
		if (!isset($param))
		return $this;

		if (!isset($timi)) {
			if (isset($this->xparam) && is_array($this->xparam))
			unset($this->xparam[$param]);

			return $this;
		}

		switch ($param) {
		case LETRAK_XPARAM_DELTIO_ORDER:
			switch ($timi) {
			case LETRAK_XPARAM_DELTIO_ORDER_PROSFATA:
			case LETRAK_XPARAM_DELTIO_ORDER_PALEOTERA:
				break;
			default:
				return $this;
			}
		}

		if (!isset($this->xparam))
		$this->xparam = array();

		$this->xparam[$param] = $timi;
		return $this;
	}

	public function xparam_get($param) {
		switch ($param) {
		case LETRAK_XPARAM_DELTIO_ORDER:
			$dflt = LETRAK_XPARAM_DELTIO_ORDER_PROSFATA;
			break;
		case LETRAK_XPARAM_DELTIO_GROUP:
			$dflt = LETRAK_XPARAM_DELTIO_GROUP_IMEROMINIA;
			break;
		default:
			return NULL;
		}

		if (!isset($this->xparam))
		return $dflt;

		if (!is_array($this->xparam))
		return $dflt;

		if (!array_key_exists($param, $this->xparam))
		return $dflt;

		return $this->xparam[$param];
	}

	public function from_database($kodikos) {
		$query = "SELECT `kodikos` FROM " . letrak::erpota12("ipalilos") .
			" WHERE `kodikos` = " . $kodikos;
		$row = pandora::first_row($query, MYSQLI_ASSOC);
		return $this->from_array($row);
	}

	public function xparam_from_database($kodikos) {
		unset($this->xparam);

		$query = "SELECT `param`, `timi` FROM `letrak`.`xparam`" .
			" WHERE `ipalilos` =" . $kodikos;
		$result = pandora::query($query);

		while ($row = $result->fetch_array(MYSQLI_NUM))
		$this->xparam_set($row[0], $row[1]);

		return $this;
	}

	// Η function "onomateponimo" επιστρέφει το ονοματεπώυμο υπαλλήλου
	// του οποίου τον κωδικό περνάμε ως παράμετρο. Αν ο υπάλληλος δεν
	// υπάρχει, επιστρέφει FALSE.

	public static function onomateponimo($kodikos) {
		$query = "SELECT `eponimo`, `onoma`, `patronimo`" .
			" FROM " . letrak::erpota12("ipalilos") .
			" WHERE `kodikos` = " . $kodikos;
		$row = pandora::first_row($query);

		if ($row)
		return rtrim($row[0]) . " " . rtrim($row[1]);

		return FALSE;
	}
}

class Deltio {
	public $kodikos = NULL;		// κωδικός παρουσιολογίου
	public $ipalilos = NULL;	// αρ. μητρώου δημιοργού υπαλλήλου
	public $protipo = NULL;		// κωδικός προτύπου παρουσιολογίου
	public $imerominia = NULL;	// ημερομηνία στη οποία αφορά
	public $ipiresia = NULL;	// κωδικός υπηρεσίας
	public $prosapo = NULL;		// προσέλευση/αποχώρηση
	public $perigrafi = NULL;	// περιγραφή παρουσιολογίου
	public $katastasi = NULL;	// κατάσταση παρουσιολογίου
	public $alagi = NULL;		// ημερομηνία και ώρα κλεισίματος

	public function __construct($x = NULL) {
		$this->from_array($x);
	}

	private function from_array($x) {
		$this->kodikos = NULL;
		$this->ipalilos = NULL;
		$this->protipo = NULL;
		$this->imerominia = NULL;
		$this->ipiresia = NULL;
		$this->prosapo = NULL;
		$this->perigrafi = NULL;
		$this->katastasi = NULL;
		$this->alagi = NULL;

		if (!isset($x))
		return $this;

		foreach ($x as $k => $v) {
			try {
				$func = $k . "_set";
				$this->$func($v);
			}

			catch (Exception $e) {
				continue;
			}
		}

		return $this;
	}

	public function kodikos_set($kodikos = NULL) {
		$this->kodikos = NULL;

		if (letrak::deltio_invalid_kodikos($kodikos))
		return $this;

		$this->kodikos = $kodikos;
		return $this;
	}

	public function ipalilos_set($ipalilos = NULL) {
		$this->ipalilos = NULL;

		if (letrak::ipalilos_invalid_kodikos($ipalilos))
		return $this;

		$this->ipalilos = $ipalilos;
		return $this;
	}

	public function protipo_set($protipo = NULL) {
		$this->protipo = NULL;

		if (letrak::deltio_invalid_kodikos($protipo))
		return $this;

		$this->protipo = $protipo;
		return $this;
	}

	public function imerominia_set($imerominia = NULL, $format = "Y-m-d") {
		$this->imerominia = NULL;

		if (!isset($imerominia))
		return $this;

		$this->imerominia = pandora::date2date($imerominia, $format);
		return $this;
	}

	public function ipiresia_set($ipiresia = NULL) {
		$this->ipiresia = NULL;

		if (!isset($ipiresia))
		return $this;

		if (!$ipiresia)
		return $this;

		$this->ipiresia = $ipiresia;
		return $this;
	}

	public function prosapo_set($prosapo = NULL) {
		$this->prosapo = NULL;

		if (!isset($prosapo))
		return $this;

		switch ($prosapo) {
		case LETRAK_DELTIO_PROSAPO_PROSELEFSI:
		case LETRAK_DELTIO_PROSAPO_APOXORISI:
			$this->prosapo = $prosapo;
		}

		return $this;
	}

	public function is_proselefsi() {
		return ($this->prosapo == LETRAK_DELTIO_PROSAPO_PROSELEFSI);
	}

	public function is_apoxorisi() {
		return ($this->prosapo == LETRAK_DELTIO_PROSAPO_APOXORISI);
	}

	public function is_protipo() {
		return ($this->prosapo == LETRAK_DELTIO_PROSAPO_PROTIPO);
	}

	public function perigrafi_set($perigrafi = NULL) {
		$this->perigrafi = NULL;

		if (!isset($perigrafi))
		return $this;

		$this->perigrafi = $perigrafi;
		return $this;
	}

	public function katastasi_set($katastasi = NULL) {
		$this->katastasi = LETRAK_DELTIO_KATASTASI_EKREMES;

		if (!isset($katastasi))
		return $this;

		switch ($katastasi) {
		case LETRAK_DELTIO_KATASTASI_EKREMES:
		case LETRAK_DELTIO_KATASTASI_ANIPOGRAFO:
		case LETRAK_DELTIO_KATASTASI_KIROMENO:
		case LETRAK_DELTIO_KATASTASI_EPIKIROMENO:
			$this->katastasi = $katastasi;
		}

		return $this;
	}

	public function alagi_set($alagi = NULL, $format = "Y-m-d H:i:s") {
		$this->alagi = NULL;

		if (!isset($alagi))
		return $this;

		$this->alagi = pandora::date2date($alagi, $format);
		return $this;
	}

	public function kodikos_get() {
		return $this->kodikos;
	}

	public function protipo_get() {
		return $this->protipo;
	}

	public function is_kodikos() {
		return $this->kodikos_get();
	}

	public function oxi_kodikos() {
		return !$this->is_kodikos();
	}

	public function imerominia_get($format = NULL) {
		return pandora::date2date($this->imerominia, NULL, $format);
	}

	public function ipiresia_get() {
		return $this->ipiresia;
	}

	public function prosapo_get() {
		return $this->prosapo;
	}

	public function perigrafi_get() {
		return $this->perigrafi;
	}

	public function katastasi_get() {
		$katastasi = $this->katastasi;

		if (!isset($katastasi))
		return LETRAK_DELTIO_KATASTASI_EKREMES;

		switch ($katastasi) {
		case LETRAK_DELTIO_KATASTASI_EKREMES:
		case LETRAK_DELTIO_KATASTASI_ANIPOGRAFO:
		case LETRAK_DELTIO_KATASTASI_KIROMENO:
		case LETRAK_DELTIO_KATASTASI_EPIKIROMENO:
			return $katastasi;
		}

		return LETRAK_DELTIO_KATASTASI_EKREMES;
	}

	public function alagi_get($format = NULL) {
		return pandora::date2date($this->alagi, NULL, $format);
	}

	public function is_klisto() {
		$katastasi = $this->katastasi_get();

		if ($katastasi === LETRAK_DELTIO_KATASTASI_EPIKIROMENO)
		return TRUE;

		return FALSE;
	}

	public function is_anikto() {
		return !$this->is_klisto();
	}

	public function from_database($kodikos) {
		$query = "SELECT * FROM `letrak`.`deltio`" .
			" WHERE `kodikos` = " . $kodikos;
		$row = pandora::first_row($query, MYSQLI_ASSOC);
		return $this->from_array($row);
	}

	///////////////////////////////////////////////////////////////////////@

	// Η μέθοδος "is_ipografon" δέχεται έναν αριθμό μητρώου εργαζομένου
	// και ελέγχει αν ο συγκεκριμένος εργαζόμενος συμπεριλαμβάνεται στους
	// υπογράφοντες του παρουσιολογίου.

	public function is_ipografon($ipalilos = NULL) {
		$deltio = $this->kodikos_get();

		if (letrak::deltio_invalid_kodikos($deltio))
		return FALSE;

		if (letrak::ipalilos_invalid_kodikos($ipalilos))
		return FALSE;

		$query = "SELECT `armodios` FROM `letrak`.`ipografi`" .
			" WHERE (`deltio` = " . $deltio . ")" .
			" AND (`armodios` = " . $ipalilos . ")";

		return pandora::first_row($query);
	}

	public function oxi_ipografon($ipalilos = NULL) {
		return !$this->is_ipografon($ipalilos);
	}

	// Η μέθοδος "is_simetexon" δέχεται έναν αριθμό μητρώου εργαζομένου
	// και ελέγχει αν ο συγκεκριμένος εργαζόμενος συμπεριλαμβάνεται στους
	// ελεγχόμενους εργαζόμενους του παρουσιολογίου.

	public function is_simetexon($ipalilos = NULL) {
		$deltio = $this->kodikos_get();

		if (letrak::deltio_invalid_kodikos($deltio))
		return FALSE;

		if (letrak::ipalilos_invalid_kodikos($ipalilos))
		return FALSE;

		$query = "SELECT `ipalilos` FROM `letrak`.`parousia`" .
			" WHERE (`deltio` = " . $deltio . ")" .
			" AND (`ipalilos` = " . $ipalilos . ")";

		return pandora::first_row($query);
	}

	public function oxi_simetexon($ipalilos = NULL) {
		return !$this->is_simetexon();
	}

	public function sxetikos_ipalilos($ipalilos = NULL) {
		$deltio = $this->kodikos_get();

		if (letrak::deltio_invalid_kodikos($deltio))
		return FALSE;

		if (letrak::ipalilos_invalid_kodikos($ipalilos))
		return FALSE;

		$query = "SELECT 1 FROM `letrak`.`parousia`" .
			" WHERE (`deltio` = " . $deltio . ")" .
			" AND (`ipalilos` = " . $ipalilos . ")";

		if (pandora::first_row($query))
		return TRUE;

		$query = "SELECT 1 FROM `letrak`.`ipografi`" .
			" WHERE (`deltio` = " . $deltio . ")" .
			" AND (`armodios` = " . $ipalilos . ")";

		if (pandora::first_row($query))
		return TRUE;

		return FALSE;
	}

	public function asxetos_ipalilos($ipalilos = NULL) {
		return !$this->sxetikos_ipalilos($ipalilos);
	}

	public function is_ipogegrameno() {
		$kodikos = $this->kodikos_get();

		if (letrak::deltio_invalid_kodikos($kodikos))
		return FALSE;

		$query = "SELECT `checkok` FROM `letrak`.`ipografi`" .
			" WHERE (`deltio` = " . $kodikos . ")";
		$result = pandora::query($query);

		$anipografo = FALSE;
		$count = 0;

		while ($row = $result->fetch_array(MYSQLI_NUM)) {
			$count++;

			if ($row[0])
			continue;

			$result->free();
			return FALSE;
		}

		if ($count)
		return TRUE;

		return FALSE;
	}

	public function is_anipografo() {
		return !$this->is_ipogegrameno();
	}

	public function katastasi_scan() {
		if ($this->oxi_kodikos())
		return LETRAK_DELTIO_KATASTASI_EKREMES;

		$kodikos = $this->kodikos_get();

		$query = "SELECT `checkok` FROM `letrak`.`ipografi`" .
			" WHERE `deltio` = " . $kodikos .
			" ORDER BY `taxinomisi`";
		$result = pandora::query($query);

		$count = 0;
		$checkok = 0;

		while ($row = $result->fetch_array(MYSQLI_NUM)) {
			$count++;

			if (!$row[0])
			break;

			$checkok++;
		}

		// Αν δεν υπάρχουν καθόλου υπογραφές το δελτίο θεωρείται
		// εκκρεμές.

		if (!$count)
		return LETRAK_DELTIO_KATASTASI_EKREMES;

		// Το ίδιο ισχύει και στην περίπτωση που το δελτίο δεν έχει
		// υπογραφεί από τον πρώτο υπογράφοντα.

		if (!$checkok)
		return LETRAK_DELTIO_KATASTASI_EKREMES;

		// Αν ο πρώτος υπογράφων έχει υπογράψει αλλά υπάρχει έστω και
		// ένας υπογράφων που δεν έχει υπογράψει ακόμη, τότε το δελτίο
		// θεωρείται ανυπόγραφο.

		if ($checkok < $count)
		return LETRAK_DELTIO_KATASTASI_ANIPOGRAFO;

		// Στο σημείο αυτό έχουμε διασφαλίσει ότι το δελτίο έχει
		// υπογράφοντες και όλοι οι υπογράφοντες έχουν υπογράψει.
		// Σ' αυτήν την περίπτωση ελέγχουμε και την κατάσταση του
		// δελτίου προκειμένου να αποφανθούμε αν το δελτίο είναι
		// απλώς κυρωμένο ή επικυρωμένο.

		$query = "SELECT `katastasi` FROM `letrak`.`deltio`" .
			" WHERE `kodikos` = " . $kodikos;
		$row = pandora::first_row($query);

		if (!$row)
		return LETRAK_DELTIO_KATASTASI_KIROMENO;

		if ($row[0] !== LETRAK_DELTIO_KATASTASI_EPIKIROMENO)
		return LETRAK_DELTIO_KATASTASI_KIROMENO;

		return LETRAK_DELTIO_KATASTASI_EPIKIROMENO;
	}

	public function katastasi_update() {
		if ($this->oxi_kodikos())
		return NULL;

		$kodikos = $this->kodikos_get();
		$katastasi_deltio = $this->katastasi_get();
		$katastasi_pragma = $this->katastasi_scan();

		if ($katastasi_deltio === $katastasi_pragma)
		return $katastasi_deltio;

		$query = "UPDATE `letrak`.`deltio` SET  `katastasi` = " .
			pandora::json_string($katastasi_pragma) . "," .
			" `alagi` = NOW() WHERE `kodikos` = " . $kodikos;
		pandora::query($query);

		if (pandora::affected_rows() != 1)
		return NULL;

		return $katastasi_pragma;
	}

	// Η μέθοδος "ekremes_update" θέτει εκ νέου το δελτίο σε κατάσταση
	// εκκρεμότητας, ενώ παράλληλα αναιρεί όλες τις υπογραφές. Όλες οι
	// αλλαγές γίνονται στην database και δεν επηρεάζουν το ανά χείρας
	// δελτίο.

	public function ekremes_update() {
		if ($this->oxi_kodikos())
		return $this;

		$kodikos = $this->kodikos_get();

		$query = "UPDATE `letrak`.`deltio` SET  `katastasi` = " .
			pandora::json_string(LETRAK_DELTIO_KATASTASI_EKREMES) .
			", `alagi` = NOW() WHERE `kodikos` = " . $kodikos;
		pandora::query($query);

		$query = "UPDATE `letrak`.`ipografi` SET `checkok` = NULL" .
			" WHERE `deltio` = " . $kodikos;
		pandora::query($query);

		return $this;
	}

	public static $economy_map = array(
		"kodikos" => "k",
		"imerominia" => "i",
		"ipiresia" => "r",
		"prosapo" => "o",
		"perigrafi" => "e",
		"katastasi" => "s",
	);

	public function json_economy() {
		$row = array();

		$x = $this->kodikos_get();
		if ($x) $row["k"] = $x;

		$x = $this->protipo_get();
		if ($x) $row["p"] = $x;

		$x = $this->imerominia_get();
		if ($x) $row["i"] = $x->format("Y-m-d");

		$x = $this->ipiresia_get();
		if ($x) $row["r"] = $x;

		$x = $this->prosapo_get();
		if ($x) $row["o"] = $x;

		$x = $this->perigrafi_get();
		if ($x) $row["e"] = $x;

		$x = $this->katastasi_get();

		if ($x && ($x !== LETRAK_DELTIO_KATASTASI_EKREMES))
		$row["s"] = $x;

		return pandora::json_string($row);
	}
}

class Ipografi {
	public $deltio = NULL;
	public $taxinomisi = NULL;
	public $armodios = NULL;
	public $titlos = NULL;
	public $checkok = NULL;

	public function __construct($x) {
		$this->deltio = NULL;
		$this->taxinomisi = NULL;
		$this->armodios = NULL;
		$this->titlos = NULL;
		$this->checkok = NULL;

		foreach ($x as $k => $v) {
			try {
				$func = $k . "_set";
				$this->$func($v);
			}

			catch (Exception $e) {
				continue;
			}
		}
	}

	public function deltio_set($x) {
		$this->deltio = $x;
		return $this;
	}

	public function taxinomisi_set($x) {
		$this->taxinomisi = $x;
		return $this;
	}

	public function armodios_set($x) {
		$this->armodios = $x;
		return $this;
	}

	public function checkok_set($x) {
		$this->checkok = $x;
		return $this;
	}

	public function deltio_get($x) {
		return $this->deltio;
	}

	public function taxinomisi_get($x) {
		return $this->taxinomisi;
	}

	public function armodios_get($x) {
		return $this->armodios;
	}

	public function checkok_get($x) {
		return $this->checkok;
	}
}

class Parousia {
	public $deltio = NULL;		// κωδικός δελτίου
	public $ipalilos = NULL;	// κωδικός εργαζομένου
	public $orario = NULL;		// ωράριο
	public $karta = NULL;		// αριθμός κάρτας WIN-PAK
	public $meraora = NULL;		// ημερομηνία και ώρα συμβάντος
	public $adidos = NULL;		// είδος αδείας
	public $adapo = NULL;		// ημερομηνία έναρξης αδείας
	public $adeos = NULL;		// ημερομηνία λήξης αδείας
	public $excuse = NULL;		// είδος excuse
	public $info = NULL;		// σχόλια

	public function __construct($x) {
		$this->deltio = NULL;
		$this->ipalilos = NULL;
		$this->orario = NULL;
		$this->karta = NULL;
		$this->meraora = NULL;
		$this->adidos = NULL;
		$this->adapo = NULL;
		$this->adeos = NULL;
		$this->excuse = NULL;
		$this->info = NULL;

		foreach ($x as $k => $v) {
			try {
				$func = $k . "_set";
				$this->$func($v);
			}

			catch (Exception $e) {
				continue;
			}
		}
	}

	public function deltio_set($x) {
		$this->deltio = $x;
		return $this;
	}

	public function ipalilos_set($x) {
		$this->ipalilos = $x;
		return $this;
	}

	public function orario_set($x) {
		$this->orario = $x;
		return $this;
	}

	public function karta_set($x) {
		$this->karta = $x;
		return $this;
	}

	public function meraora_set($x) {
		$this->meraora = $x;
		return $this;
	}

	public function adidos_set($x) {
		$this->adidos = $x;
		return $this;
	}

	public function adapo_set($x) {
		$this->adapo = $x;
		return $this;
	}

	public function adeos_set($x) {
		$this->adeos = $x;
		return $this;
	}

	public function excuse_set($x) {
		$this->excuse = $x;
		return $this;
	}

	public function info_set($x) {
		$this->info = $x;
		return $this;
	}

	public function info_get() {
		return $this->info;
	}

	public function deltio_get() {
		return $this->deltio;
	}

	public function ipalilos_get() {
		return $this->ipalilos;
	}

	public function orario_get() {
		return $this->orario;
	}

	public function karta_get() {
		return $this->karta;
	}

	public function meraora_get() {
		return $this->meraora;
	}

	public function adidos_get() {
		return $this->adidos;
	}

	public function adapo_get() {
		return $this->adapo;
	}

	public function adeos_get() {
		return $this->adeos;
	}

	public function excuse_get() {
		return $this->excuse;
	}
}

// Η κλάση "Prosvasi" απεικονίζει εγγραφές πρόσβασης χρηστών στα χρονικά
// δεδομένα προσέλευσης και αποχώρησης των υπαλλήλων. Οι προσβάσεις των
// χρηστών καθορίζονται στον πίνακα "prosvasi" της database "erpota".
// Ο εν λόγω πίνακας περιέχει μία εγγραφή για κάθε χρήστη με primary
// τον αριθμό μητρώου του χρήστη ως υπαλλήλου στον Δμο Θεσσαλονίκης.
// Τα βασικά στοιχεία πρόσβασης για κάθε χρήστη είναι δύο: «μάσκα»
// κωδικού υπηρεσίας, και επίπεδο πρόσβασης.
//
// Μάσκα κωδικού υπηρεσίας
// ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
// Αν το συγκεριμένο πεδίο του πίνακα είναι null, αυτό σημαίνει απλά ότι
// ο χρήστης δεν έχει πρόσβαση σε επίπεδο υπηρεσίας, αλλά έχει πρόσβαση
// μόνο στα προσωπικά του στοιχεία. Αν, όμως, το πεδίο είναι συμπληρωμένο
// τότε αποτελεί «μάσκα» κωδικού υπηρεσίας, πράγμα που σημαίνει ότι ο χρήστης
// έχει πρόσβαση σε όλες τις υπηρεσίες που εκκινούν με τη συγκεκριμέν μάσκα,
// π.χ. αν το πεδίο έχει τιμή "Γ01", τότε ο χρήστης έχει πρόσβαση σε όλες τις
// υπηρεσίες των οποίων ο κωδικός εκκινεί με "Γ01", π.χ. "Γ010001", "Γ010002",
// κλπ· εννοείται ότι σ' αυτήν την περίπτωηση ο χρήστης έχει πρόσβαση και στην
// ίδια τη διεύθυνση "Γ01". Αν το πεδίο έχει τιμή "Β090003", τότε ο χρήστης
// έχει πρόσβαση στην υπηρεσία "Β090003" που είναι το «Τμήμα Μηχανογραφικής
// Υποστήριξης» και ενδεχομένως σε γραφεία του τμήματος που φέρουν κωδικούς
// "Β09000301", "Β09000302" κοκ.
//
// Επίπεδο πρόσβασης
// ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
// Το επίπεδο πρόσβασης είναι κάτι πιο απλό και παίρνει τιμές "VIEW",
// "UPDATE" και "ADMIN". Η πρόσβαση επιπέδου "VIEW" σημαίνει ότι ο χρήστης
// έχει δικαίωμα να βλέπει στοιχεία, αλλά δεν μπορεί να προσθέσει, να
// διαγράψει ή να μεταβάλει καθ' οιονδήποτε τρόπο στοιχεία που αφορούν
// στην προσέλευση και στην αποχώρηση των υπαλλήλων. Φυσικά, τα στοιχεία
// που βλέπει ο χρήστης καθορίζονται σε συνάρτηση με τη «μάσκα» κωδικού
// υπηρεσίας σύμφωνα με τα προαναφερθέντα. Αν ο χρήστης έχει πρόσβαση
// επιπέδου "UPDATE" τότε ο χρήστης εκτός από τη θέαση έχει και δικαιώματα
// εισαγωγής, μεταβολής και διαγραφής στοιχείων στις υπηρεσίες που
// καθορίζονται με τη «μάσκα» κωδικού υπηρεσίας. Τέλος, η πρόσβαση επιπέδου
// "ADMIN" αποτελεί υπερσύνολο των δικαιωμάτων του επιπέδου "UPDATE"
// παρέχοντας στον χρήστη κάποια επιπλέον δικαιώματα στα οποία δεν θα
// επεκταθούμε στον παρόν.

class Prosvasi {
	// Η property "ipalilos" περιέχει τον αριθμό μητρώου του χρήστη
	// ως εργαζομένου στον Δήμο Θεσσαλονίκης.

	public $ipalilos = NULL;

	// Η property "ipiresia" περιέχει την «μάσκα» κωδικού υπηρεσίας
	// σύμφωνα με την οποία η πρόσβαση του χρήστη περιορίζεται σε
	// υπηρεσίες των οποίων ο κωδικός εκκινεί με τη συγκεκριμένη
	// «μάσκα». Αν η «μάσκα» είναι το κενό string ο χρήστης έχει
	// πρόσβαση σε όλες τις υπηρεσίες, ενώ αν είναι null ο χρήστης
	// δεν έχει πρόσβαση σε επίπεδο υπηρεσίας αλλά μόνο στα προσωπικά
	// του στοιχεία.

	public $ipiresia = NULL;

	// Η property "epipedo" παίρνει τιμές "VIEW", "UPDATE" και "ADMIN"
	// ανάλογα με το αν ο χρήστης μπορεί να έχει πρόσβαση θέασης,
	// ενημέρωσης, ή διαχείρισης αντίστοιχα, στις υπρεσίες που ορίζονται
	// μέσω της «μάσκας» κωδικού υπηρεσίας.

	public $epipedo = NULL;

	// Κατά τη δημιουργία νέου αντικειμένου πρόσβασης όλα τα πεδία
	// τίθενται σε null τιμές, ωστόσο μπορούμε να καθορίσουμε τον
	// αριθμό μητρώου του χρήστη ως εργαζομένου στον Δήμο Θεσσαλονίκης.

	public function __construct($ipalilos = NULL) {
		$this->
		ipalilos_set($ipalilos)->
		ipiresia_set(NULL)->
		epipedo_set(NULL);
	}

	public function ipalilos_set($ipalilos = NULL) {
		$this->ipalilos = NULL;

		if (letrak::ipalilos_invalid_kodikos($ipalilos))
		return $this;

		$this->ipalilos = $ipalilos;
		return $this;
	}

	public function ipiresia_set($ipiresia = NULL) {
		$this->ipiresia = NULL;

		if (!isset($ipiresia))
		return $this;

		$this->ipiresia = $ipiresia;
		return $this;
	}

	public function epipedo_set($epipedo = NULL) {
		$this->epipedo = NULL;

		if (!isset($epipedo))
		return $this;

		switch ($epipedo) {
		case 'VIEW':
		case 'UPDATE':
		case 'ADMIN':
			$this->epipedo = $epipedo;
		}

		return $this;
	}

	public function ipalilos_get() {
		return $this->ipalilos;
	}

	public function ipiresia_get() {
		return $this->ipiresia;
	}

	public function epipedo_get() {
		return $this->epipedo;
	}

	// Η μέθοδος "is_ipalilos" ελέγχει αν είναι καθορισμένος ο υπάλληλος,
	// επομένως μπορεί να χρησιμοποιηθεί και για τον έλεγχο ακαθόριστων
	// προσβάσεων.

	public function is_ipalilos() {
		return isset($this->ipalilos);
	}

	public function oxi_ipalilos() {
		return !$this->is_ipalilos();
	}

	public function is_ipiresia() {
		return isset($this->ipiresia);
	}

	public function oxi_ipiresia() {
		return !$this->is_ipiresia();
	}

	// Η μέθοδος "fromdb" θέτει τα πεδία της πρόσβασης σε τιμές που
	// λαμβάνει από τον πίνακα "prosvasi" της database "erpota",
	// εφόσον ο χρήστης είναι συμπληρωμένος.

	public function fromdb() {
		$this->
		ipiresia_set()->
		epipedo_set();

		if ($this->oxi_ipalilos())
		return $this;

		$ipalilos = $this->ipalilos_get();

		$query = "SELECT `ipiresia`, `level`" .
			" FROM `erpota`.`prosvasi`" .
			" WHERE `ipalilos` = " . $ipalilos;
		$row = pandora::first_row($query, MYSQLI_NUM);

		if (!$row)
		return $this;

		$this->
		ipiresia_set($row[0])->
		epipedo_set($row[1]);

		return $this;
	}

	// Η μέθοδος "is_prosvasi_ipiresia" είναι σημαντική καθώς δέχεται
	// έναν κωδικό υπηρεσίας και ελέγχει αν η ανά χείρας πρόσβαση
	// «ταιριάζει» στη συγκεκριμένη υπηρεσία με βάση τη μάσκα
	// κωδικού υπηρεσίας.

	public function is_prosvasi_ipiresia($ipiresia) {
		$maska = $this->ipiresia_get();

		// Αν η μάσκα κωδικού υπηρεσίας δεν έχει καθοριστεί, τότε
		// ο χρήστης έχει πρόσβαση μόνο στα προσωπικά του στοιχεία
		// επομένως δεν έχει καμία πρόσβαση σε επίπεδο υπηρεσίας.

		if (!isset($maska))
		return FALSE;

		// Αντίθετα, αν η μάσκα κωδικού υπηρεσίας έχει καθοριστεί
		// αλλά είναι κενή, αυτό σημαίνει ότι η πρόσβαση αφορά σε
		// όλες τις υπηρεσίες.

		if ($maska === "")
		return TRUE;

		// Αν ο κωδικός υπηρεσίας είναι ακαθόριστος, τότε δεν
		// μπορούμε να ελέγξουμε την πρόσβαση οπότε η απάντησή
		// μας είναι αρνητική.

		if (!isset($ipiresia))
		return FALSE;

		// Ήρθε η στιγμή να δούμε αν ο κωδικός της ελεγχόμενης
		// υπηρεσίας ταιριάζει με τη μάσκα κωδικού υπηρεσίας.

		$l = strlen($maska);

		// Έχει ήδη ελεγχθεί αλλά ένας έλεγχος παραπάνω δεν βλάπτει.

		if ($l <= 0)
		return TRUE;


		return (substr($ipiresia, 0, $l) === $maska);
	}

	public function oxi_prosvasi_ipiresia($ipiresia) {
		return !$this->is_prosvasi_ipiresia($ipiresia);
	}

	// Η μέθοδος "is_update_ipiresia" δέχεται έναν κωδικό υπηρεσίας και
	// επιστρέφει true εφόσον ο χρήστης έχει πρόσβαση ενημέρωσης στη
	// συγκεκριμένη υπηρεσία, αλλιώς επιστρέφει false.

	public function is_update_ipiresia($ipiresia = NULL) {
		if ($this->oxi_prosvasi_ipiresia($ipiresia))
		return FALSE;

		switch ($this->epipedo_get()) {
		case 'ADMIN':
		case 'UPDATE':
			return TRUE;
		}

		return FALSE;
	}

	public function oxi_update_ipiresia($ipiresia = NULL) {
		return !$this->is_update_ipiresia($ipiresia);
	}

	// Η μέθοδος "ipiresia_is_admin" δέχεται έναν κωδικό υπηρεσίας και
	// επιστρέφει true εφόσον ο χρήστης έχει πρόσβαση διαχείρισης στη
	// συγκεκριμένη υπηρεσία, αλλιώς επιστρέφει false.

	public function ipiresia_is_admin($ipiresia = NULL) {
		if ($this->oxi_prosvasi_ipiresia($ipiresia))
		return FALSE;

		switch ($this->epipedo_get()) {
		case 'ADMIN':
			return TRUE;
		}

		return FALSE;
	}

	public function ipiresia_oxi_admin($ipiresia) {
		return !$this->ipiresia_is_admin($ipiresia);
	}

	// Η μέθοδος "is_prosvasi_deltio" δέχεται ως παράμετρο ένα
	// παρουσιολόγιο και ελέγχει αν ο υπάλληλος της ανά χείρας
	// πρόσβασης έχει δικαιώματα στο περιεχόμενο του παρουσιολογίου.

	public function is_prosvasi_deltio($deltio) {
		if ($this->oxi_ipalilos())
		return FALSE;

		if ($deltio->oxi_kodikos())
		return FALSE;

		$ipiresia = $deltio->ipiresia_get();

		if ($this->is_prosvasi_ipiresia($ipiresia))
		return TRUE;

		$ipalilos = $this->ipalilos_get();

		if ($deltio->is_ipografon($ipalilos))
		return TRUE;

		if ($deltio->is_simetexon($ipalilos))
		return TRUE;

		return FALSE;
	}

	public function oxi_prosvasi_deltio($deltio) {
		return !$this->is_prosvasi_deltio($deltio);
	}

	// Ελέγχει αν ο υπάλληλος της πρόσβασης έχει δικαίωμα διόρθωσης του
	// παρουσιολογίου, τουτέστιν αν είναι ο πρώτος υπογράφων και δεν έχει
	// υπογράψει ακόμη.

	public function is_deltio_edit($deltio) {
		if (!isset($deltio))
		return FALSE;

		if ($deltio instanceof Deltio)
		$deltio = $deltio->kodikos_get();

		if (letrak::deltio_invalid_kodikos($deltio))
		return FALSE;

		$query = "SELECT `armodios`, `checkok`" .
			" FROM `letrak`.`ipografi`" .
			" WHERE `deltio` = " . $deltio .
			" ORDER BY `taxinomisi`" .
			" LIMIT 1";

		$row = pandora::first_row($query, MYSQLI_NUM);

		if (!$row)
		return FALSE;

		if ($row[0] != $this->ipalilos_get())
		return FALSE;

		if ($row[1])
		return FALSE;

		return TRUE;
	}

	public function oxi_deltio_edit($deltio) {
		return !$this->is_deltio_edit($deltio);
	}
}
?>
