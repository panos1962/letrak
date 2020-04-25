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
// www/prosopa/imerisio.php —— Επιλογή και αποστολή στοιχείων παρουσιολογίου
// @FILE END
//
// @DESCRIPTION BEGIN
// Το παρόν πρόγραμμα καλείται από τη σελίδα επεξεργασίας παρουσιολογίου και
// δέχεται ως παράμετρο ένα κωδικό παρουσιολογίου. Σκοπός του προγράμματος
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

///////////////////////////////////////////////////////////////////////////////@

$query = "SELECT * FROM `letrak`.`imerisio` WHERE `kodikos` = " . $kodikos;
$row = pandora::first_row($query, MYSQLI_ASSOC);

if (!$row)
lathos($kodikos . ": δεν βρέθηκε το παρουσιολόγιο");

print '{';
print '"imerisio":' . pandora::json_string($row) . ",";
print '"error":""}';
///////////////////////////////////////////////////////////////////////////////@

function lathos($s) {
	print '{"error":' . pandora::json_string($s) . "}";
	exit(0);
}

?>
