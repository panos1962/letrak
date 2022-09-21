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

$prosvasi = letrak::prosvasi_get();

if ($prosvasi->oxi_ipalilos())
letrak::fatal_error_json("Διαπιστώθηκε ανώνυμη χρήση");

$tre = pandora::parameter_get("tre");

if (letrak::deltio_invalid_kodikos($tre))
letrak::fatal_error_json("Ακαθόριστος κωδικός τρέχοντος παρουσιολογίου");

$pro = pandora::parameter_get("pro");

if (letrak::deltio_invalid_kodikos($pro))
letrak::fatal_error_json("Ακαθόριστος κωδικός προηγούμενου παρουσιολογίου");

$tre = Diafores::deltio_get($tre);

if (!$tre)
letrak::fatal_error_json("Αδυναμία εντοπισμού τρέχοντος παρουσιολογίου");

$pro = Diafores::deltio_get($pro);

if (!$pro)
letrak::fatal_error_json("Αδυναμία εντοπισμού προηγούμενου παρουσιολογίου");

$ipalilos = [];

Diafores::
parousia_get($tre)::
parousia_get($pro)::
diafores_fix($tre, $pro)::
ipalilos_get($tre, $pro, $ipalilos);

print '{' .
	'"tre":' . pandora::json_string($tre) . ',' .
	'"pro":' . pandora::json_string($pro) .
'}';

///////////////////////////////////////////////////////////////////////////////@

class Diafores {
	public static function deltio_get($deltio) {
		$query = "SELECT `kodikos`, `imerominia` " .
			"FROM `letrak`.`deltio` " .
			"WHERE `kodikos` = " . $deltio;
		return pandora::first_row($query, MYSQLI_ASSOC);
	}

	public static function parousia_get(&$deltio) {
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
		"orario",
		"karta",
		"adidos",
		"adapo",
		"adeos",
		"excuse",
		"info",
	];

	public static function diafores_fix(&$tre, &$pro) {
		$tre_parousia = $tre["parousia"];
		$pro_parousia = $pro["parousia"];

		foreach ($tre_parousia as $ipalilos => $parousia) {
			if (!array_key_exists($ipalilos, $pro_parousia))
			continue;

			if (self::adikeologiti_apousia($parousia))
			continue;

			$dif = FALSE;

			foreach (self::$columns as $column) {
				if ($parousia[$column] === $pro_parousia[$ipalilos][$column])
				continue;

				$dif = TRUE;
				break;
			}

			if ($dif)
			continue;

			unset($tre_parousia[$ipalilos]);
			unset($pro_parousia[$ipalilos]);
		}

		$tre["parousia"] = $tre_parousia;
		$pro["parousia"] = $pro_parousia;

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

	public static function ipalilos_get($tre, $pro, &$ilist) {
		foreach ($tre["parousia"] as $ipalilos => $parousia)
		$ilist[$ipalilos] = $ipalilos;

		foreach ($pro["parousia"] as $ipalilos => $parousia)
		$ilist[$ipalilos] = $ipalilos;

		foreach ($ilist as $ipalilos)
		$ilist[$ipalilos] = self::ipalilos_fetch($ipalilos);

		return __CLASS__;
	}

	private static function ipalilos_fetch($ipalilos) {
		$query = "SELECT `eponimo`, `onoma`, `patronimo` " .
			"FROM " . letrak::erpota12("ipalilos") . " " .
			"WHERE `kodikos` = " . $ipalilos;
	}
}
?>
