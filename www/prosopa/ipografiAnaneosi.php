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
// www/prosopa/ipogarfiAnaneosi.php —— Ενημέρωση εικόνας υπογραφών
// @FILE END
//
// @DESCRIPTION BEGIN
// Το παρόν πρόγραμμα καλείται από τη σελίδα επεξεργασίας παρουσιολογίου και
// σκοπό έχει την ανανέωση των υπογραφών του παρουσιολογίου.
// @DESCRIPTION END
//
// @HISTORY BEGIN
// Updated: 2020-05-04
// Created: 2020-05-01
// @HISTORY END
//
// @END
//
///////////////////////////////////////////////////////////////////////////////@

require_once("../../local/conf.php");
require_once(LETRAK_BASEDIR . "/www/lib/letrak.php");

pandora::
header_data()::
session_init()::
database();

$prosvasi = letrak::prosvasi_get();

if ($prosvasi->oxi_ipalilos())
lathos("Διαπιστώθηκε ανώνυμη χρήση");

$imerisio = pandora::parameter_get("imerisio");

if (letrak::imerisio_invalid_kodikos($imerisio))
lathos("Μη αποδεκτός κωδικός παρουσιολογίου");

///////////////////////////////////////////////////////////////////////////////@

print '{';
print '"closed":' . (letrak::imerisio_is_klisto($imerisio) ?
	'true' : 'false') . ',';
letrak::ipografes_json($imerisio);
print '}';

exit(0);

///////////////////////////////////////////////////////////////////////////////@

function lathos($s) {
	print '{"error":' . pandora::json_string($s) . "}";
	exit(0);
}
?>
