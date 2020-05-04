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
// www/prosopa/ipogarfiDelete.php —— Διαγραφή υπογραφής παρουσιολογίου
// @FILE END
//
// @DESCRIPTION BEGIN
// Το παρόν πρόγραμμα καλείται από τη σελίδα επεξεργασίας παρουσιολογίου και
// σκοπό έχει την απαλοιφή συγκεκριμένου υπογράφοντος από το παρουσιολόγιο.
// Παράλληλα επαναριθμούνται οι υπόλοιποι υπογράφοντες και ακυρώνονται τυχόν
// επικυρώσεις υπογραφόντων.
// @DESCRIPTION END
//
// @HISTORY BEGIN
// Updated: 2020-05-04
// Updated: 2020-04-30
// Updated: 2020-04-26
// Created: 2020-04-25
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

$taxinomisi = pandora::parameter_get("taxinomisi");

if (letrak::ipografi_invalid_taxinomisi($taxinomisi))
lathos("Μη αποδεκτός ταξινομικός αριθμός υπογραφής");

if (letrak::imerisio_is_klisto($imerisio))
lathos("Το παρουσιολόγιο έχει κλείσει");

///////////////////////////////////////////////////////////////////////////////@

pandora::autocommit(FALSE);

$query = "DELETE FROM `letrak`.`ipografi` " .
	" WHERE (`imerisio` = " . $imerisio . ")" .
	" AND (`taxinomisi` = " . $taxinomisi . ")";
pandora::query($query);

if (pandora::affected_rows() !== 1) {
	pandora::rollback();
	lathos("Απέτυχε η διαγραφή υπογραφής");
}

letrak::ipografes_taxinomisi($imerisio);
pandora::commit();

print '{';
letrak::ipografes_json($imerisio);
print '}';

exit(0);

///////////////////////////////////////////////////////////////////////////////@

function lathos($s) {
	print '{"error":' . pandora::json_string($s) . "}";
	exit(0);
}
?>
