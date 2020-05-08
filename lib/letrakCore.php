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
define("LETRAK_IMERISIO_KODIKOS_MAX", 999999);
define("LETRAK_IPOGRAFI_TAXINOMISI_MAX", 255);

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

	public static function erpota12($s) {
		if (!isset(self::$erpota_version))
		self::erpota_version_get();

		if ($s)
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

	public static function imerisio_valid_kodikos($kodikos) {
		return pandora::is_integer
			($kodikos, 1, LETRAK_IMERISIO_KODIKOS_MAX);
	}

	public static function imerisio_invalid_kodikos($kodikos) {
		return !self::imerisio_valid_kodikos($kodikos);
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

	// Η μέθοδος "imerisio_is_klisto" δέχεται έναν κωδικό παρουσιολογίου
	// και επιστρέφει true εφόσον το παρουσιολόγιο είναι κλειστό. Επίσης
	// επιστρέφει true εφόσον ο κωδικός δεν είναι αποδεκτός ή δεν υπάρχει
	// το παρουσιολόγιο. Σε κάθε άλλη περίπτωση επιστρέφει false.

	public static function imerisio_is_klisto($kodikos) {
		if (self::imerisio_invalid_kodikos($kodikos))
		return TRUE;

		$query = "SELECT `closed` FROM `letrak`.`imerisio`" .
			" WHERE `kodikos` = " . $kodikos;
		$row = pandora::first_row($query);

		if (!$row)
		return TRUE;

		if ($row[0])
		return TRUE;

		return FALSE;
	}

	public static function imerisio_is_anikto($kodikos) {
		return !imerisio_is_klisto($kodikos);
	}

	public static function ipalilos_is_simetoxi($imerisio, $ipalilos) {
		$query = "SELECT `ipalilos` FROM `letrak`.`parousia`" .
			" WHERE (`imerisio` = " . $imerisio . ")" .
			" AND (`ipalilos` = " . $ipalilos . ")";
		return pandora::first_row($query);
	}

	public static function ipalilos_oxi_simetoxi($imerisio, $ipalilos) {
		return !self::ipalilos_is_simetoxi($imerisio, $ipalilos);
	}
}

class Orario {
	public $apo = NULL;
	public $eos = NULL;

	function __construct($x = NULL) {
		$this->from_array($x);
	}

	private function from_array($x) {
		$this->apo = NULL;
		$this->eos = NULL;

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

	private static function is_ora_lepto($s) {
		if (!isset($s))
		return NULL;

		$x = explode(":", $s);

		if (count($x) != 2)
		return NULL;

		if (pandora::not_integer($x[0], 0, 24))
		return NULL;

		if (pandora::not_integer($x[1], 0, 59))
		return NULL;

		$ora = (int)($x[0]);
		$lepto = (int)($x[1]);

		if (($ora === 24) && ($lepto != 0))
		return NULL;

		return sprintf("%0d:%02d", $ora, $lepto);
	}

	public function apo_set($s) {
		$this->apo = self::is_ora_lepto($s);
		return $this;
	}

	public function eos_set($s) {
		$this->eos = self::is_ora_lepto($s);
		return $this;
	}

	public function apo_get() {
		return $this->apo;
	}

	public function eos_get() {
		return $this->eos;
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

		$eos = self::oxi_ora_lepto($x[1]);

		if (!isset($eos))
		return $this;

		$this->apo = $apo;
		$this->eos = $eos;

		return $this;
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
}

class Imerisio {
	public $kodikos = NULL;		// κωδικός παρουσιολογίου
	public $ipalilos = NULL;	// αρ. μητρώου δημιοργού υπαλλήλου
	public $protipo = NULL;		// κωδικός προτύπου παρουσιολογίου
	public $imerominia = NULL;	// ημερομηνία στη οποία αφορά
	public $ipiresia = NULL;	// κωδικός υπηρεσίας
	public $prosapo = NULL;		// προσέλευση/αποχώρηση
	public $perigrafi = NULL;	// περιγραφή παρουσιολογίου
	public $closed = NULL;		// ημερομηνία και ώρα κλεισίματος

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
		$this->closed = NULL;

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

		if (letrak::imerisio_invalid_kodikos($kodikos))
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

		if (letrak::imerisio_invalid_kodikos($protipo))
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
		case "ΠΡΟΣΕΛΕΥΣΗ":
		case "ΑΠΟΧΩΡΗΣΗ":
			$this->prosapo = $prosapo;
		}

		return $this;
	}

	public function perigrafi_set($perigrafi = NULL) {
		$this->perigrafi = NULL;

		if (!isset($perigrafi))
		return $this;

		$this->perigrafi = $perigrafi;
		return $this;
	}

	public function closed_set($closed = NULL, $format = "Y-m-d H:i:s") {
		$this->closed = NULL;

		if (!isset($closed))
		return $this;

		$this->closed = pandora::date2date($closed, $format);
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

	public function closed_get($format = NULL) {
		return pandora::date2date($this->closed, NULL, $format);
	}

	public function is_klisto() {
		return $this->closed_get();
	}

	public function is_anikto() {
		return !$this->is_klisto();
	}

	public function from_database($kodikos) {
		$query = "SELECT * FROM `letrak`.`imerisio`" .
			" WHERE `kodikos` = " . $kodikos;
		$row = pandora::first_row($query, MYSQLI_ASSOC);
		return $this->from_array($row);
	}

	public function is_ipografi($ipalilos = NULL) {
		$imerisio = $this->kodikos_get();

		if (letrak::imerisio_invalid_kodikos($imerisio))
		return FALSE;

		if (letrak::ipalilos_invalid_kodikos($ipalilos))
		return FALSE;

		$query = "SELECT `armodios` FROM `letrak`.`ipografi`" .
			" WHERE (`imerisio` = " . $imerisio . ")" .
			" AND (`armodios` = " . $ipalilos . ")";

		return pandora::first_row($query);
	}

	public function oxi_ipografi($ipalilos = NULL) {
		return !$this->is_ipografi($ipalilos);
	}

	public function is_simetoxi($ipalilos = NULL) {
		$imerisio = $this->kodikos_get();

		if (letrak::imerisio_invalid_kodikos($imerisio))
		return FALSE;

		if (letrak::ipalilos_invalid_kodikos($ipalilos))
		return FALSE;

		$query = "SELECT `ipalilos` FROM `letrak`.`parousia`" .
			" WHERE (`imerisio` = " . $imerisio . ")" .
			" AND (`ipalilos` = " . $ipalilos . ")";

		return pandora::first_row($query);
	}

	public function sxetikos_ipalilos($ipalilos = NULL) {
		$imerisio = $this->kodikos_get();

		if (letrak::imerisio_invalid_kodikos($imerisio))
		return FALSE;

		if (letrak::ipalilos_invalid_kodikos($ipalilos))
		return FALSE;

		$query = "SELECT 1 FROM `letrak`.`parousia`" .
			" WHERE (`imerisio` = " . $imerisio . ")" .
			" AND (`ipalilos` = " . $ipalilos . ")";

		if (pandora::first_row($query))
		return TRUE;

		$query = "SELECT 1 FROM `letrak`.`ipografi`" .
			" WHERE (`imerisio` = " . $imerisio . ")" .
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

		if (letrak::imerisio_invalid_kodikos($kodikos))
		return FALSE;

		$query = "SELECT 1 FROM `letrak`.`ipografi`" .
			" WHERE (`imerisio` = " . $kodikos . ")" .
			" AND (`checkok` IS NULL)";

		if (pandora::first_row($query, MYSQLI_NUM))
		return FALSE;

		return TRUE;
	}

	public function is_anipografo() {
		return !$this->is_ipogegrameno();
	}

	public static $economy_map = array(
		"kodikos" => "k",
		"imerominia" => "i",
		"ipiresia" => "r",
		"prosapo" => "o",
		"perigrafi" => "e",
		"closed" => "c",
	);

	public function json_economy() {
		$row = array();

		$x = $this->kodikos_get();
		if ($x) $row["k"] = $x;

		$x = $this->imerominia_get();
		if ($x) $row["i"] = $x->format("Y-m-d");

		$x = $this->ipiresia_get();
		if ($x) $row["r"] = $x;

		$x = $this->prosapo_get();
		if ($x) $row["o"] = $x;

		$x = $this->perigrafi_get();
		if ($x) $row["e"] = $x;

		$x = $this->closed_get();
		if ($x) $row["c"] = $x->format("Y-m-d");

		return pandora::json_string($row);
	}
}

class Ipografi {
	public $imerisio = NULL;
	public $taxinomisi = NULL;
	public $armodios = NULL;
	public $titlos = NULL;
	public $checkok = NULL;

	public function __construct($x) {
		$this->imerisio = NULL;
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

	public function imerisio_set($x) {
		$this->imerisio = $x;
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

	public function imerisio_get($x) {
		return $this->imerisio;
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

	// Η μέθοδος "is_prosvasi_imerisio" δέχεται ως παράμετρο ένα
	// παρουσιολόγιο και ελέγχει αν ο υπάλληλος της ανά χείρας
	// πρόσβασης έχει δικαιώματα στο περιεχόμενο του παρουσιολογίου.

	public function is_prosvasi_imerisio($imerisio) {
		if ($this->oxi_ipalilos())
		return FALSE;

		if ($imerisio->oxi_kodikos())
		return FALSE;

		$ipiresia = $imerisio->ipiresia_get();

		if ($this->is_prosvasi_ipiresia($ipiresia))
		return TRUE;

		$ipalilos = $this->ipalilos_get();

		if ($imerisio->is_simetoxi($ipalilos))
		return TRUE;

		if ($imerisio->is_ipografi($ipalilos))
		return TRUE;

		return FALSE;
	}

	public function oxi_prosvasi_imerisio($imerisio) {
		return !$this->is_prosvasi_imerisio($imerisio);
	}
}
?>
