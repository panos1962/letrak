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
// Updated: 2025-08-28
// Updated: 2025-08-21
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

	/*
	XXX
	deltio_check($deltio);
	*/

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

function deltio_check($deltio) {
	$plist = parousies_select($deltio->kodikos);
	parousies_check($plist);

	// Αναζητούμε τυχόν συμπληρωματικό δελτίο.

	$imerominia = $deltio->imerominia->format("Y-m-d");
	$ipiresia = $deltio->ipiresia;
	$perigrafi = $deltio->perigrafi;

	$query = "SELECT `kodikos`, `prosapo`" .
		" FROM `letrak`.`deltio`" .
		" WHERE `imerominia` = " . pandora::sql_string($imerominia) .
		" AND `ipiresia` = " . pandora::sql_string($ipiresia) .
		" AND `perigrafi` = " . pandora::sql_string($perigrafi) .
		" AND `kodikos` <> " . $deltio->kodikos;
	$result = pandora::query($query);

	$count = 0;

	while ($row = $result->fetch_array(MYSQLI_NUM)) {
		$oitled = $row[0];
		$opasorp = $row[1];
		$count++;
	}

	// Αν εντοπιστούν περισσότερα από ένα συμπληρωματικά δελτία, τότε
	// θα πρέπει να διαγραφούν τα πλεονάζοντα συμπληρωματικά δελτία
	// πριν την κύρωση του δελτίου που επιχειρούμε να κυρώσουμε.

	if ($count > 1)
	letrak::fatal_error_json("Πλεονάζοντα συμπληρωματικά δελτία");

	// Αν δεν εντοπιστούν συμπληρωματικά δελτία, τότε σημαίνει ότι το
	// προς κύρωση δελτίο πρέπει να είναι δελτίο προσέλευσης, αλλιώς
	// φαίνεται ότι έχει διαγραφεί το δελτίο σχετικό δελτίο προσέλευσης
	// και θα πρέπει να ξαναφτιαχτεί πριν προχωρήσουμε στην κύρωση του
	// δελτίου (αποχώρησης) που επιχειρούμε να κυρώσουμε.

	if (!$count) {
		if ($deltio->is_proselefsi())
		return;

		letrak::fatal_error_json("Δεν υπάρχει σχετικό δελτίο προσέλευσης");
	}

	// Έχουμε εντοπίσει ακριβώς ένα συμπληρωματικό δελτίο και ελέγχουμε
	// αν είναι όντως συμπηρωματικό.

	if ($deltio->is_proselefsi() && ($opasorp != LETRAK_DELTIO_PROSAPO_APOXORISI))
	letrak::fatal_error_json("Το σχετικό δελτίο δεν είναι δελτίο αποχώρησης");

	if ($deltio->is_apoxorisi() && ($opasorp != LETRAK_DELTIO_PROSAPO_PROSELEFSI))
	letrak::fatal_error_json("Το σχετικό δελτίο δεν είναι δελτίο προσέλευσης");

	// Έχουμε εντοπίσει σχετικό δελτίο και θα προβούμε σε περαιτέρω
	// ελέγχους μεταξύ των δύο δελτίων, αλλά μόνο εφόσον το εν λόγω
	// συμπληρωματικό δελτίο έχει κυρωθεί από τον συντάκτη.

	$query = "SELECT `armodios`" .
		" FROM `letrak`.`ipografi`" .
		" WHERE `deltio` = " . $oitled .
		" AND `taxinomisi` = 1" .
		" AND `checkok` IS NOT NULL";
	$row = pandora::first_row($query);

	// Αν το σχετικό δελτίο δεν έχει κυρωθεί από τον συντάκτη, σημαίνει
	// ότι το εν λόγω δελτίο είναι υπό κατασκευή και δεν προβαίνουμε σε
	// περαιτέρω ελέγχους.

	if (!$row)
	return;

	// Το σχετικό δελτίο έχει κυρωθεί από τον συντάκτη και θα επιλέξουμε
	// τις παρουσίες του, προκειμένου να τις συγκρίνουμε με τις παρουσίες
	// του δελτίου που επιχειρούμε να κυρώσουμε.

	$tsilp = parousies_select($oitled);

// XXX
}

function parousies_select($deltio) {
	$query = "SELECT `ipalilos`, `meraora`," .
		" `adidos`, `adapo`, `adeos`, `excuse`" .
		" FROM `letrak`.`parousia`" .
		" WHERE `deltio` = " . $deltio;
	$result = pandora::query($query);

	$plist = [];

	while ($row = $result->fetch_array(MYSQLI_ASSOC))
	$plist[$row["ipalilos"]] = $row;

	return $plist;
}

function parousies_check($plist) {
	$error = "Σφάλματα: ";
	$enotiko = "";

	foreach ($plist as $ipalilos => $parousia) {
		if (parousia_check($parousia))
		continue;

		$error .= $enotiko . $ipalilos;
		$enotiko = ", ";
	}

	if ($enotiko)
	letrak::fatal_error_json($error);
}

function parousia_check($parousia) {
	return TRUE;
}

///////////////////////////////////////////////////////////////////////////////@

function akirosi() {
	global $kodikos;
	global $deltio;
	global $ipiresia;
	global $xristis;

	$onomateponimo = Ipalilos::onomateponimo($xristis);

	if (!$onomateponimo)
	letrak::fatal_error_json("Δεν βρέθηκε υπογράφων με κωδικό " . $xristis);

	$query = "SELECT MIN(`taxinomisi`) FROM `letrak`.`ipografi`" .
		" WHERE (`deltio` = " . $kodikos . ")" .
		" AND (`armodios` = " . $xristis . ")";
	$row = pandora::first_row($query, MYSQLI_NUM);

	if (!$row)
	letrak::fatal_error_json("Αδυναμία εντοπισμού αρμοδίου υπογράφοντος");

	$taxinomisi = $row[0];

	$kinisi = $xristis . ":";
	$kinisi .= $onomateponimo . ":";
	$kinisi .= $taxinomisi;

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
