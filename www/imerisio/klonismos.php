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
// www/imerisio/klonismos.php —— Δημιουργία αντιγράφου παρουσιολογίου
// @FILE END
//
// @DESCRIPTION BEGIN
// Το παρόν πρόγραμμα καλείται από τη σελίδα των παρουσιολογίων και δέχεται
// ως παράμετρο έναν κωδικό παρουσιολογίου. Σκοπός του προγράμματος είναι
// να δημιουργήσει ένα κλώνο του συγκεκριμένου παρουσιολογίου (φυσικά με
// νέο κωδικό) και να το επιστρέψει στη σελίδα των παρουσιολογίων.
// @DESCRIPTION END
//
// @HISTORY BEGIN
// Created: 2020-04-22
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

$protipo = pandora::parameter_get("kodikos");

if ((!$protipo) || ($protipo != (int)$protipo))
lathos("Ακαθόριστος κωδικός προτύπου");

///////////////////////////////////////////////////////////////////////////////@

pandora::query("START TRANSACTION");

$query = "INSERT INTO `letrak`.`imerisio` " .
"(`protipo`, `imerominia`, `ipiresia`, `prosapo`, `perigrafi`) " .
"SELECT " . $protipo . ", NOW(), `ipiresia`, `prosapo`, `perigrafi` " .
"FROM `letrak`.`imerisio` WHERE `kodikos` = " . $protipo;
pandora::query($query);

if (pandora::affected_rows() !== 1)
lathos("Αποτυχία δημιουργίας αντιγράφου");

$kodikos = pandora::insert_id();

$query = "INSERT INTO `letrak`.`parousia` " .
"(`imerisio`, `ipalilos`, `karta`, `orario`) " .
"SELECT " . $kodikos . ", `ipalilos`, `karta`, `orario` " .
"FROM `letrak`.`parousia` WHERE `imerisio` = " . $protipo;
pandora::query($query);

pandora::query("COMMIT WORK");

$query = "SELECT " . LETRAK_IMERISIO_PROJECTION_COLUMNS .
	" FROM `letrak`.`imerisio` WHERE `kodikos` = " . $kodikos;
$row = pandora::first_row($query, MYSQLI_ASSOC);

if (!$row)
lathos("Αποτυχία εντοπισμού αντιγράφου");

print '{"imerisio":' . pandora::json_string($row) . ',"error":""}';
exit(0);

///////////////////////////////////////////////////////////////////////////////@

function lathos($msg) {
	print pandora::json_string(array("error" => $msg));
	exit(0);
}
?>
