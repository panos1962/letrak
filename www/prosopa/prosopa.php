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
// www/prosopa/prosopa.php —— Επιλογή και αποστολή στοιχείων παρουσιολογίου
// @FILE END
//
// @DESCRIPTION BEGIN
// Το παρόν πρόγραμμα καλείται από τη σελίδα επεξεργασίας παρουσιολογίου και
// δέχεται ως παράμετρο έναν κωδικό παρουσιολογίου. Σκοπός του προγράμματος
// είναι να επιστρέψει σε json format το παρουσιολόγιο με όλα τα επιμέρους
// στοιχεία του παρουσιολογίου.
// @DESCRIPTION END
//
// @HISTORY BEGIN
// Created: 2020-04-25
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

if (letrak::oxi_xristis())
lathos("Διαπιστώθηκε ανώνυμη χρήση");

$kodikos = pandora::parameter_get("imerisio");

if ((!$kodikos) || ((int)$kodikos != $kodikos))
lathos("Μη αποδεκτός κωδικός παρουσιολογίου");

print '{';
///////////////////////////////////////////////////////////////////////////////@

$query = "SELECT * FROM `letrak`.`imerisio` WHERE `kodikos` = " . $kodikos;
$imerisio = pandora::first_row($query, MYSQLI_ASSOC);

if (!$imerisio)
lathos($kodikos . ": δεν βρέθηκε το παρουσιολόγιο");

print '"imerisio":' . pandora::json_string($imerisio) . ",";

$par = "`letrak`.`parousia`";
$ipl = letrak::erpota12("ipalilos");

$query = "SELECT " .
$par . ".`ipalilos` AS `i`, " .
$par . ".`karta` AS `k`, " .
$par . ".`orario` AS `o`, " .
$par . ".`meraora` AS `t`, " .
$par . ".`excuse` AS `e`, " .
$par . ".`info` AS `s`, " .
$ipl . ".`eponimo` AS `l`, " .
$ipl . ".`onoma` AS `f`, " .
$ipl . ".`patronimo` AS `p`" .
" FROM " . $par . " LEFT JOIN " . $ipl .
" ON " . $ipl . ".`kodikos` = " . $par . ".`ipalilos`" .
" WHERE " . $par . ".`imerisio` = " . $kodikos .
" ORDER BY `eponimo`, `onoma`, `patronimo`, `ipalilos`";

print '"parousia":[';
$enotiko = "";
$result = pandora::query($query);

while ($row = $result->fetch_array(MYSQLI_ASSOC)) {
	// Απαλοιφή των πεδίων με null τιμές
	foreach ($row as $k => $v) {
		if (!isset($v))
		unset($row[$k]);
	}

	print $enotiko . pandora::json_string($row);
	$enotiko = ",";
}

print '],';
///////////////////////////////////////////////////////////////////////////////@
print '"error":""}';

function lathos($s) {
	print '{"error":' . pandora::json_string($s) . "}";
	exit(0);
}

?>
