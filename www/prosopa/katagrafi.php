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
// www/prosopa/katagrafi.php —— Αναζήτηση καταγραφών υπαλλήλου
// @FILE END
//
// @DESCRIPTION BEGIN
// @DESCRIPTION END
//
// @HISTORY BEGIN
// Created: 2020-06-07
// @HISTORY END
//
// @END
//
///////////////////////////////////////////////////////////////////////////////@

require_once("../../local/conf.php");
require_once(LETRAK_BASEDIR . "/www/lib/letrak.php");

define("MAX_COUNT", 6);

pandora::
header_json()::
session_init()::
database();

$prosvasi = letrak::prosvasi_get();

if ($prosvasi->oxi_ipalilos())
letrak::fatal_error_json("Διαπιστώθηκε ανώνυμη χρήση");

$deltio_kodikos = pandora::parameter_get("deltio");

if (letrak::deltio_invalid_kodikos($deltio_kodikos))
letrak::fatal_error_json("Μη αποδεκτός κωδικός παρουσιολογίου");

$karta = pandora::parameter_get("karta");

if (letrak::ipalilos_invalid_karta($karta))
letrak::fatal_error_json("Μη αποδεκτός αριθμός κάρτας εργαζομένου");

///////////////////////////////////////////////////////////////////////////////@

$deltio = (new Deltio())->from_database($deltio_kodikos);

if ($deltio->oxi_kodikos())
letrak::fatal_error_json($deltio_kodikos . ": δεν βρέθηκε το παρουσιολόγιο");

$imerominia = $deltio->imerominia_get()->format("Y-m-d") . " 12:00:00";

print '{';

print '"prin":';
katagrafi("<=", "DESC");

print '"meta":';
katagrafi(">", "ASC");

print '"max":' . MAX_COUNT . '}';
exit(0);

function katagrafi($op, $ord) {
	global $imerominia;
	global $karta;

	print "[";
	$enotiko = "";

	$query = "SELECT `meraora` FROM `kartel`.`event` " .
		" WHERE (`karta` = " . $karta . ")" .
		" AND (`meraora` " . $op . "'" . $imerominia . "')" .
		" ORDER BY `meraora` " . $ord . ", `kodikos` " . $ord .
		" LIMIT " . MAX_COUNT;
	$result = pandora::query($query);

	while ($row = $result->fetch_array(MYSQLI_NUM)) {
		$t = DateTime::createFromFormat("Y-m-d H:i:s", $row[0]);

		if ($t === FALSE)
		continue;

		print $enotiko;
		print pandora::sql_string($t->format("d-m-Y H:i"), '"');
		$enotiko = ",";
	}

	print "],";
}
