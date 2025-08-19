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
// www/prosopa/ipogarfiPraxi.php —— Επικύρωση παρουσιολογίου ή αναίρεση
// υπογραφής.
// @FILE END
//
// @DESCRIPTION BEGIN
// Το παρόν πρόγραμμα καλείται από τη σελίδα επεξεργασίας παρουσιολογίου και
// σκοπό έχει την κύρωση του παρουσιολογίου ή την αναίρεση της υπογραφής.
// @DESCRIPTION END
//
// @HISTORY BEGIN
// Updated: 2025-08-19
// Updated: 2021-05-23
// Updated: 2020-05-06
// Updated: 2020-05-04
// Created: 2020-04-30
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

$prosvasi = letrak::prosvasi_check();
$kodikos = pandora::parameter_get("deltio");

if (letrak::deltio_invalid_kodikos($kodikos))
letrak::fatal_error_json("Μη αποδεκτός κωδικός παρουσιολογίου");

$deltio = (new Deltio())->from_database($kodikos);

if ($deltio->oxi_kodikos())
letrak::fatal_error_json("Αδυναμία εντοπισμού παρουσιολογίου");

if ($deltio->is_klisto())
letrak::fatal_error_json("Το παρουσιολόγιο έχει κλείσει");

$ipiresia = $deltio->ipiresia_get();

$armodios = pandora::parameter_get("armodios");

if (letrak::ipalilos_invalid_kodikos($armodios))
letrak::fatal_error_json("Μη αποδεκτός αριθμός μητρώου υπογράφοντος αρμοδίου");

$praxi = pandora::parameter_get("praxi");

switch ($praxi) {
case 'akirosi':
	$minima = "αναίρεσης υπογραφής";
	break;
case 'kirosi':
	$minima = "κύρωσης παρουσιολογίου";
	break;
default:
	letrak::fatal_error_json("Ακαθόριστη πράξη");
}

$xristis = $prosvasi->ipalilos_get();

if ($xristis != $armodios)
letrak::fatal_error_json("Διαπιστώθηκε αναρμοδιότητα πράξης " . $minima);

///////////////////////////////////////////////////////////////////////////////@

$katastasi = $praxi();

if (!$katastasi)
letrak::fatal_error_json("Αδυναμία " . $minima);

pandora::commit();

print '{';
print '"katastasi":' . pandora::json_string($katastasi) . ',';
letrak::ipografes_json($deltio);
print '}';

exit(0);

///////////////////////////////////////////////////////////////////////////////@

function kirosi() {
	global $kodikos;
	global $deltio;
	global $xristis;

	$query = "SELECT `taxinomisi` FROM `letrak`.`ipografi`" .
		" WHERE (`deltio` = " . $kodikos . ")" .
		" AND (`checkok` IS NULL)";
	$result = pandora::query($query);

	$tax = LETRAK_IPOGRAFI_TAXINOMISI_MAX + 1;

	while ($row = $result->fetch_array(MYSQLI_NUM)) {
		if ($row[0] < $tax)
		$tax = $row[0];
	}

	if ($tax > LETRAK_IPOGRAFI_TAXINOMISI_MAX)
	letrak::fatal_error_json("Αδυναμία εντοπισμού αρμοδίου υπογράφοντος");

	$query = "SELECT `armodios` FROM `letrak`.`ipografi`" .
		" WHERE (`deltio` = " . $kodikos . ")" .
		" AND (`taxinomisi` = " . $tax . ")";
	$row = pandora::first_row($query, MYSQLI_NUM);

	if ($row[0] != $xristis)
	letrak::fatal_error_json("Δεν έχετε δικαίωμα κύρωσης");

	pandora::autocommit(FALSE);

	$query = "UPDATE `letrak`.`ipografi`" .
		" SET `checkok` = NULL" .
		" WHERE (`deltio` = " . $kodikos . ")" .
		" AND (`taxinomisi` >= " . $tax . ")";
	pandora::query($query);

	$query = "UPDATE `letrak`.`ipografi`" .
		" SET `checkok` = NOW()" .
		" WHERE (`deltio` = " . $kodikos . ")" .
		" AND (`taxinomisi` = " . $tax . ")";
	pandora::query($query);

	if (!pandora::affected_rows())
	return FALSE;

	$katastasi = $deltio->katastasi_update();

	if (!$katastasi)
	return FALSE;

	return $katastasi;
}

function akirosi() {
	global $kodikos;
	global $deltio;
	global $ipiresia;
	global $xristis;

	$query = "SELECT `eponimo`, `onoma`" .
		" FROM " . letrak::erpota12("ipalilos") .
		" WHERE `kodikos` = " . $xristis;
	$row = pandora::first_row($query, MYSQLI_NUM);

	if (!$row)
	letrak::fatal_error_json("Δεν βρέθηκε υπογράφων με κωδικό " . $xristis);

	$onomateponimo = rtrim($row[0]) . " " . rtrim($row[1]);

	$query = "SELECT MIN(`taxinomisi`) FROM `letrak`.`ipografi`" .
		" WHERE (`deltio` = " . $kodikos . ")" .
		" AND (`armodios` = " . $xristis . ")";
	$row = pandora::first_row($query, MYSQLI_NUM);

	if (!$row)
	letrak::fatal_error_json("Αδυναμία εντοπισμού αρμοδίου υπογράφοντος");

	$taxinomisi = $row[0];

	$kinisi .= $taxinomisi . ":";
	$kinisi .= $xristis . ":";
	$kinisi .= $onomateponimo;

	letrak::katagrafi($xristis, $kodikos, $ipiresia,
		"ΑΝΑΙΡΕΣΗ ΚΥΡΩΣΗΣ", $kinisi);

	$query = "UPDATE `letrak`.`ipografi`" .
		" SET `checkok` = NULL" .
		" WHERE (`deltio` = " . $kodikos . ")" .
		" AND (`taxinomisi` >= " . $taxinomisi . ")";
	pandora::query($query);

	if (!pandora::affected_rows())
	return FALSE;

	$katastasi = $deltio->katastasi_update();

	if (!$katastasi)
	return FALSE;

	return $katastasi;
}
?>
