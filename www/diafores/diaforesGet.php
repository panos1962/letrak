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
prosvasi_check();

$tre = pandora::parameter_get("tre");

if (letrak::deltio_invalid_kodikos($tre))
letrak::fatal_error_json("Ακαθόριστος κωδικός τρέχοντος παρουσιολογίου");

$pro = pandora::parameter_get("pro");

if (letrak::deltio_invalid_kodikos($pro))
letrak::fatal_error_json("Ακαθόριστος κωδικός προηγούμενου παρουσιολογίου");

Diafores::$tre = Diafores::deltio_fetch($tre);

if (!Diafores::$tre)
letrak::fatal_error_json("Αδυναμία εντοπισμού τρέχοντος παρουσιολογίου");

Diafores::$pro = Diafores::deltio_fetch($pro);

if (!Diafores::$pro)
letrak::fatal_error_json("Αδυναμία εντοπισμού προηγούμενου παρουσιολογίου");

Diafores::
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
	public static $tre;
	public static $pro;
	public static $ilist;

	public static function init() {
		self::$tre = NULL;
		self::$pro = NULL;
		self::$ilist = [];

		return __CLASS__;
	}

	public static function prosvasi_check() {
		$prosvasi = letrak::prosvasi_get();

		if ($prosvasi->oxi_ipalilos())
		letrak::fatal_error_json("Διαπιστώθηκε ανώνυμη χρήση");

		return __CLASS__;
	}


	public static function deltio_fetch($deltio) {
		$query = "SELECT `kodikos`, `imerominia` " .
			"FROM `letrak`.`deltio` " .
			"WHERE `kodikos` = " . $deltio;
		return pandora::first_row($query, MYSQLI_ASSOC);
	}

	public static function parousia_fetch(&$deltio) {
		$plist = [];
		$query = "SELECT `ipalilos`, `orario`, `karta`, `meraora`, " .
			"`adidos`, `adapo`, `adeos`, `excuse`, `info` " .
			"FROM `letrak`.`parousia` " .
			"WHERE `deltio` = " . $deltio["kodikos"];

		$result = pandora::query($query);

		while ($row = $result->fetch_array(MYSQLI_ASSOC)) {
			$plist[$row["ipalilos"]] = $row;
			unset($row["ipalilos"]);
		}

		$deltio["parousia"] = $plist;

		return __CLASS__;
	}

	// Στον πίνακα "columns" έχουμε τα πεδία που μπορεί
	// να παρουσιάζουν διαφορές.

	private static $columns = [
		"karta",
		"adidos",
		"adapo",
		"adeos",
		"excuse",
		"info",
	];

	public static function adiafora_delete() {
		$tre = self::$tre["parousia"];
		$pro = self::$pro["parousia"];

		foreach ($tre as $ipalilos => $parousia) {
			if (!array_key_exists($ipalilos, $pro))
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

		self::$tre["parousia"] = $tre;
		self::$pro["parousia"] = $pro;

		return __CLASS__;
	}

	private static function adikeologiti_apousia($parousia) {
		if ($parousia["meraora"])
		return FALSE;

		if ($parousia["adidos"])
		return FALSE;

		if ($parousia["excuse"])
		return FALSE;

		return TRUE;
	}

	public static function ipalilos_fetch() {
		foreach (self::$tre["parousia"] as $ipalilos => $parousia)
		self::$ilist[$ipalilos] = $ipalilos;

		foreach (self::$pro["parousia"] as $ipalilos => $parousia)
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
