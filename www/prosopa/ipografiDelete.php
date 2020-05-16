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
// Updated: 2020-05-12
// Updated: 2020-05-06
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
letrak::fatal_error_json("Διαπιστώθηκε ανώνυμη χρήση");

$kodikos = pandora::parameter_get("deltio");

if (letrak::deltio_invalid_kodikos($kodikos))
letrak::fatal_error_json("Μη αποδεκτός κωδικός παρουσιολογίου");

$deltio = (new Deltio())->from_database($kodikos);

if ($deltio->oxi_kodikos())
letrak::fatal_error_json($kodikos . ": δεν εντοπίστηκε το παρουσιολόγιο");

if ($deltio->is_klisto())
letrak::fatal_error_json("Το παρουσιολόγιο έχει κλείσει");

$ipiresia = $deltio->ipiresia_get();

if ($prosvasi->oxi_update_ipiresia($ipiresia))
letrak::fatal_error_json("Δεν έχετε δικαίωμα διαγραφής αρμοδίου υπογραφής");

$taxinomisi = pandora::parameter_get("taxinomisi");

if (letrak::ipografi_invalid_taxinomisi($taxinomisi))
letrak::fatal_error_json("Μη αποδεκτός ταξινομικός αριθμός υπογραφής");

///////////////////////////////////////////////////////////////////////////////@

pandora::autocommit(FALSE);

$query = "DELETE FROM `letrak`.`ipografi` " .
	" WHERE (`deltio` = " . $kodikos . ")" .
	" AND (`taxinomisi` = " . $taxinomisi . ")";
pandora::query($query);

if (pandora::affected_rows() !== 1) {
	pandora::rollback();
	letrak::fatal_error_json("Απέτυχε η διαγραφή υπογραφής");
}

$katastasi = $deltio->katastasi_update();

if (!isset($katastasi)) {
	pandora::rollback();
	letrak::fatal_error_json("Αστοχία ενημέρωσης κατάστασης δελτίου");
}

letrak::ipografes_taxinomisi($kodikos);
pandora::commit();

print '{';
print '"katastasi":' . pandora::json_string($katastasi) . ",";
letrak::ipografes_json($kodikos);
print '}';

exit(0);
?>
