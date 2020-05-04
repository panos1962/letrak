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
		$row = pandora::first_row($query, MYSQLI_NUM);

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
}

class Ipografi {
	public $imerisio = NULL;
	public $taxinomisi = NULL;
	public $armodios = NULL;
	public $titlos = NULL;
	public $checkok = NULL;

	public function __construct($x) {
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

	public function __construct($kodikos = NULL) {
		$this->ipalilos_set($kodikos);
		$this->ipiresia_set(NULL);
		$this->epipedo_set(NULL);
	}

	public function ipalilos_set($ipalilos) {
		$this->ipalilos = NULL;

		if (pandora::is_integer($ipalilos, 1, 999999))
		$this->ipalilos = (int)$ipalilos;

		return $this;
	}

	public function ipiresia_set($ipiresia) {
		$this->ipiresia = $ipiresia;
		return $this;
	}

	public function epipedo_set($level) {
		switch ($level) {
		case 'VIEW':
		case 'UPDATE':
		case 'ADMIN':
			$this->epipedo = $level;
			return $this;
		}

		$this->epipedo = NULL;
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
		$this->ipiresia = NULL;
		$this->epipedo = NULL;

		if ($this->oxi_ipalilos())
		return $this;

		$query = "SELECT `ipiresia`, `level`" .
			" FROM `erpota`.`prosvasi`" .
			" WHERE `ipalilos` = " . $this->ipalilos_get();
		$row = pandora::first_row($query, MYSQLI_NUM);

		if (!$row)
		return $this;

		$this->ipiresia_set($row[0]);
		$this->epipedo_set($row[1]);

		return $this;
	}

	// Η μέθοδος "is_prosvasi_ipiresia" είναι σημαντική καθώς δέχεται
	// έναν κωδικό υπηρεσίας και ελέγχει αν η ανά χείρας πρόσβαση
	// «ταιριάζει» στη συγκεκριμένη υπηρεσία με βάση τη «μάσκα»
	// κωδικού υπηρεσίας.

	public function is_prosvasi_ipiresia($ipiresia) {
		$maska = $this->ipiresia_get();

		// Αν η μάσκα κωδικού υπηρεσίας δεν έχει καθοριστεί, τότε
		// ο χρήστης έχει πρόσβαση μόνο στα προσωπικά του σχτοιχεία
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

		if ($l === 0)
		return TRUE;

		return (substr($ipiresia, 0, $l) === $maska);
	}

	public function oxi_prosvasi_ipiresia($ipiresia) {
		return !$this->is_prosvasi_ipiresia($ipiresia);
	}

	public function is_update($ipiresia = NULL) {
		if ($this->oxi_prosvasi_ipiresia($ipiresia))
		return FALSE;

		switch ($this->epipedo_get()) {
		case 'ADMIN':
		case 'UPDATE':
			return TRUE;
		}

		return FALSE;
	}

	public function oxi_update($ipiresia) {
		return !$this->is_update($ipiresia);
	}

	public function is_admin($ipiresia = NULL) {
		if ($this->oxi_prosvasi_ipiresia($ipiresia))
		return FALSE;

		switch ($this->epipedo_get()) {
		case 'ADMIN':
			return TRUE;
		}

		return FALSE;
	}

	public function oxi_admin($ipiresia) {
		return !$this->is_admin($ipiresia);
	}

	// Η μέθοδος "is_prosvasi_imerisio" δέχεται ως παράμετρο ένα
	// παρουσιολόγιο και ελέγχει αν ο υπάλληλος της ανά χείρας
	// πρόσβασης έχει δικαιώματα στο περιεχόμενο του παρουσιολογίου.

	public function is_prosvasi_imerisio($imerisio) {
		// Αν ο υπάλληλος της ανά χείρας πρόσβασης είναι υπογράφων
		// στο παρουσιολόγιο, τότε αυτεπάγγελτα αποκτά δικαιώματα
		// στο περιεχόμενο του παρουσιολογίου.

		if ($this->is_ipografon($imerisio["kodikos"]))
		return TRUE;

		// Αν τα δικαιώματα που απορρέουν από τη μάσκα κωδικού
		// υπηρεσίας για τον εν λόγω υπάλληλο ταιριάζουν με την
		// υπηρεσία του παρουσιολογίου, τότε ο υπάλληλος αποκτά
		// δικαιώματα στο περιεχόμενο του παρουσιολογίου.

		if ($this->is_prosvasi_ipiresia($imerisio["ipiresia"]))
		return TRUE;

		// Σε κάθε άλλη περίπτωση ο υπάλληλος έχει δικαιώματα
		// μόνο σε στοιχεία που τον αφορούν προσωπικά.

		return FALSE;
	}

	public function oxi_prosvasi_imerisio($imerisio) {
		return !$this->is_prosvasi_imerisio($imerisio);
	}

	// Η μέθοδος "is_ipografon" δέχεται ως παράμετρο ένα παρουσιολόγιο
	// και ελέγχει αν ο υπάλληλος της ανά χείρας πρόσβασης συμμετέχει
	// ως υπογράφων στο συγκεκριμένο παρουσιολόγιο.

	public function is_ipografon($imerisio) {
		if ($this->oxi_ipalilos())
		return FALSE;

		if (is_array($imerisio))
		$imerisio = $imerisio["kodikos"];

		$query = "SELECT `armodios` FROM `letrak`.`ipografi`" .
			" WHERE (`imerisio` = " . $imerisio . ")" .
			" AND (`armodios` = " . $this->ipalilos_get() . ")";

		return pandora::first_row($query, MYSQLI_NUM);
	}
}
?>
