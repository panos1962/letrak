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
// Updated: 2020-04-26
// Created: 2020-03-05
// @HISTORY END
//
// @END
//
///////////////////////////////////////////////////////////////////////////////@

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

class prosvasi {
	public $ipalilos = NULL;
	public $ipiresia = NULL;
	public $epipedo = NULL;

	public function __construct($kodikos = NULL) {
		$this->ipalilos_set($kodikos);
		$this->ipiresia_set(NULL);
		$this->epipedo_set(NULL);
	}

	public function ipalilos_set($ipalilos) {
		$this->ipalilos = NULL;

		if (!isset($ipalilos))
		return $this;

		if ((int)$ipalilos != $ipalilos)
		return $this;

		$ipalilos = (int)$ipalilos;

		if ($ipalilos <= 0)
		return $this;

		$this->ipalilos = $ipalilos;
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

	public function is_prosvasi($ipiresia) {
		$prosvasi_ipiresia = $this->ipiresia_get();

		if (!isset($prosvasi_ipiresia))
		return FALSE;

		if ($prosvasi_ipiresia === "")
		return TRUE;

		if (!isset($ipiresia))
		return FALSE;

		$l = mb_strlen($prosvasi_ipiresia);

		return (mb_substr($ipiresia, 0, $l) === $prosvasi_ipiresia);
	}

	public function oxi_prosvasi($ipiresia) {
		return !$this->is_prosvasi($ipiresia);
	}
}
?>
