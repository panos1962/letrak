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
// www/prosopa/parousiaIpovoli.php —— Υποβολή στοιχείων παρουσίας
// @FILE END
//
// @DESCRIPTION BEGIN
// @DESCRIPTION END
//
// @HISTORY BEGIN
// Created: 2020-05-16
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
lathos("Διαπιστώθηκε ανώνυμη χρήση");

$deltio_kodikos = pandora::parameter_get("deltio");

if (letrak::deltio_invalid_kodikos($deltio_kodikos))
lathos("Μη αποδεκτός κωδικός παρουσιολογίου");

$deltio = (new Deltio())->from_database($deltio_kodikos);

if ($deltio->oxi_kodikos())
lathos($deltio_kodikos . ": δεν εντοπίστηκε το παρουσιολόγιο");

if ($deltio->is_klisto())
lathos("Το παρουσιολόγιο έχει επικυρωθεί");

if ($deltio->is_ipogegrameno())
lathos("Το παρουσιολόγιο έχει κυρωθεί");

if ($prosvasi->oxi_deltio_edit($deltio_kodikos))
lathos("Access denied");

$ipalilos_kodikos = pandora::parameter_get("ipalilos");

if (letrak::ipalilos_invalid_kodikos($ipalilos_kodikos))
lathos("Μη αποδεκτός αρ. μητρώου εργαζομένου");

$ipalilos = (new Ipalilos())->from_database($ipalilos_kodikos);

if ($ipalilos->oxi_kodikos())
lathos($ipalilos_kodikos . ": δεν εντοπίστηκε ο εργαζόμενος");

///////////////////////////////////////////////////////////////////////////////@

$orario = NULL;
$karta = NULL;
$adidos = NULL;
$adapo = NULL;
$adeos = NULL;
$excuse = NULL;
$info = NULL;

$query = "REPLACE INTO `letrak`.`parousia` " .
	"(`deltio`, `ipalilos`, `orario`, `karta`, `meraora`," .
	" `adidos`, `adapo`, `adeos`, `excuse`, `info`)".
	" VALUES (" . $deltio_kodikos . ", " . $ipalilos_kodikos . ", " .
	" NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)";
pandora::query($query);

if (pandora::affected_rows() < 1)
lathos("Αστοχία υποβολής στοιχείων παρουσίας");

exit(0);

function lathos($s) {
	print $s;
	exit(0);
}
?>
