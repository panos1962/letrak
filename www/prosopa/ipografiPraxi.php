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
// σκοπό έχει την επικύρωση του παρουσιολογίου ή την αναίρεση της υπογραφής.
// @DESCRIPTION END
//
// @HISTORY BEGIN
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

$prosvasi = letrak::prosvasi_get();

if ($prosvasi->oxi_ipalilos())
lathos("Διαπιστώθηκε ανώνυμη χρήση");

$imerisio = pandora::parameter_get("imerisio");

if (letrak::imerisio_invalid_kodikos($imerisio))
lathos("Μη αποδεκτός κωδικός παρουσιολογίου");

$armodios = pandora::parameter_get("armodios");

if (letrak::ipalilos_invalid_kodikos($armodios))
lathos("Μη αποδεκτός αριθμός μητρώου υπογράφοντος αρμοδίου");

$praxi = pandora::parameter_get("praxi");

switch ($praxi) {
case 'akirosi':
	$minima = "αναίρεσης υπογραφής";
	break;
case 'epikirosi':
	$minima = "επικύρωσης αποτελεσμάτων";
	break;
default:
	lathos("Ακαθόριστη πράξη");
}

$xristis = $prosvasi->ipalilos_get();

if ($xristis != $armodios)
lathos("Διαπιστώθηκε αναρμοδιότητα πράξης " . $minima);

if (letrak::imerisio_is_klisto($imerisio))
lathos("Το παρουσιολόγιο έχει κλείσει");

///////////////////////////////////////////////////////////////////////////////@

$praxi($imerisio, $xristis);

print '{';
letrak::ipografes_json($imerisio);
print '}';

exit(0);

///////////////////////////////////////////////////////////////////////////////@

function epikirosi($imerisio, $xristis) {
	$query = "SELECT `taxinomisi` FROM `letrak`.`ipografi`" .
		" WHERE (`imerisio` = " . $imerisio . ")" .
		" AND (`checkok` IS NULL)";
	$result = pandora::query($query);

	$tax = LETRAK_IPOGRAFI_TAXINOMISI_MAX + 1;

	while ($row = $result->fetch_array(MYSQLI_NUM)) {
		if ($row[0] < $tax)
		$tax = $row[0];
	}

	if ($tax > LETRAK_IPOGRAFI_TAXINOMISI_MAX)
	lathos("Αδυναμία εντοπισμού αρμοδίου υπογράφοντος");

	$query = "SELECT `armodios` FROM `letrak`.`ipografi`" .
		" WHERE (`imerisio` = " . $imerisio . ")" .
		" AND (`taxinomisi` = " . $tax . ")";
	$row = pandora::first_row($query, MYSQLI_NUM);

	if ($row[0] != $xristis)
	lathos("Δεν έχετε δικαίωμα επικύρωσης");

	pandora::autocommit(FALSE);

	$query = "UPDATE `letrak`.`ipografi`" .
		" SET `checkok` = NULL" .
		" WHERE (`imerisio` = " . $imerisio . ")" .
		" AND (`taxinomisi` >= " . $tax . ")";
	pandora::query($query);

	$query = "UPDATE `letrak`.`ipografi`" .
		" SET `checkok` = NOW()" .
		" WHERE (`imerisio` = " . $imerisio . ")" .
		" AND (`taxinomisi` = " . $tax . ")";
	pandora::query($query);

	if (pandora::affected_rows() != 1) {
		pandora::rollback();
		lathos("Αδυναμία επικύρωσης παρουσιολογίου");
	}

	pandora::commit();
}

function akirosi($imerisio, $xristis) {
	$query = "SELECT MIN(`taxinomisi`) FROM `letrak`.`ipografi`" .
		" WHERE (`imerisio` = " . $imerisio . ")" .
		" AND (`armodios` = " . $xristis . ")";
	$row = pandora::first_row($query, MYSQLI_NUM);

	if (!$row)
	lathos("Αδυναμία εντοπισμού αρμοδίου υπογράφοντος");

	$query = "UPDATE `letrak`.`ipografi`" .
		" SET `checkok` = NULL" .
		" WHERE (`imerisio` = " . $imerisio . ")" .
		" AND (`taxinomisi` >= " . $row[0] . ")";
	pandora::query($query);

	if (!pandora::affected_rows())
	lathos("Δεν αναιρέθηκαν υπογραφές");
}

function lathos($s) {
	print '{"error":' . pandora::json_string($s) . "}";
	exit(0);
}
?>
