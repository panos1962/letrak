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
// www/deltio/ananeosi.php —— Ανανέωση κατάστασης παρουσιολογίων
// @FILE END
//
// @DESCRIPTION BEGIN
// Το παρόν πρόγραμμα καλείται από τη βασική σελίδα διαχείρισης
// παρουσιολογίων και σκοπό έχει το φρεσκάρισμα των δεδομένων και
// των μεταδεδομένων των παρουσιολογίων που υπάρχουν στη σελίδα.
// @DESCRIPTION END
//
// @HISTORY BEGIN
// Updated: 2020-05-18
// Created: 2020-05-13
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
letrak::fatal_error_json("Διαπιστώθηκε ανώνυμη χρήση");

$dlist = pandora::parameter_get("dlist");

if (!is_array($dlist))
letrak::fatal_error_json("Μη αποδεκτή λίστα δελτίων");

$tsild = array();

foreach ($dlist as $kodikos) {
	$deltio = (new Deltio())->from_database($kodikos);
	$tsild[$kodikos] = $deltio->katastasi_get();
}

print '{';
print '"dlist":' . pandora::json_string($tsild);
print '}';
?>
