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
// Updated: 2020-05-06
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

$kodikos = pandora::parameter_get("deltio");

if (letrak::deltio_invalid_kodikos($kodikos))
lathos("Μη αποδεκτός κωδικός παρουσιολογίου");

$deltio = (new Deltio())->from_database($kodikos);

///////////////////////////////////////////////////////////////////////////////@

print '{';
print '"katastasi":' . pandora::json_string($deltio->katastasi_get()) . ",";
letrak::ipografes_json($kodikos);
print '}';

exit(0);

///////////////////////////////////////////////////////////////////////////////@

function lathos($s) {
	print '{"error":' . pandora::json_string($s) . "}";
	exit(0);
}
?>
