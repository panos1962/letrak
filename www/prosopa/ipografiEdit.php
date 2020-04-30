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
// www/prosopa/ipogarfiInsert.php —— Ενημέρωση υπογραφής παρουσιολογίου
// @FILE END
//
// @DESCRIPTION BEGIN
// Το παρόν πρόγραμμα καλείται από τη σελίδα επεξεργασίας παρουσιολογίου με
// σκοπό να ενημερώσει κάποια εγγραφή υπογραφής. Η ενημέρωση μπορεί να αφορά
// σε οποιοδήποτε στοιχείο της υπογραφής, όπως ταξινομικό αριθμό, αρμόδιο
// υπάλληλο, τίτλο κλπ. Οποιαδήποτε ενημέρωση επισύρει και ακύρωση τυχόν
// ήδη επικυρωμένων υπογραφών.
// @DESCRIPTION END
//
// @HISTORY BEGIN
// Updated: 2020-04-30
// Created: 2020-04-29
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

if (pandora::not_integer($imerisio, 1, LETRAK_IMERISIO_KODIKOS_MAX))
lathos("Μη αποδεκτός κωδικός παρουσιολογίου");

$isimonixat = pandora::parameter_get("isimonixat");

if (pandora::not_integer($isimonixat, 1, LETRAK_IPOGRAFI_TAXINOMISI_MAX))
lathos($isimonixat . "Μη αποδεκτός υφιστάμενος ταξινομικός αριθμός");

$armodios = pandora::parameter_get("armodios");

if (pandora::not_integer($armodios, 1, LETRAK_IPALILOS_KODIKOS_MAX))
lathos("Μη αποδεκτός αριθμός μητρώου υπογράφοντος υπαλλήλου");

$taxinomisi = pandora::parameter_get("taxinomisi");

if (!isset($taxinomisi))
$taxinomisi = LETRAK_IPOGRAFI_TAXINOMISI_MAX;

elseif (pandora::not_integer($taxinomisi, 1, LETRAK_IPOGRAFI_TAXINOMISI_MAX))
lathos("Μη αποδεκτός νέος ταξινομικός αριθμός");

$titlos = pandora::parameter_get("titlos");

///////////////////////////////////////////////////////////////////////////////@

pandora::autocommit(FALSE);

$query = "SELECT COUNT(*) FROM `letrak`.`ipografi`" .
	" WHERE `imerisio` = " . $imerisio;
$row = pandora::first_row($query, MYSQLI_NUM);

$taxmax = (int)$row[0];

$query = "DELETE FROM `letrak`.`ipografi` WHERE (`imerisio` = " .
	$imerisio . ") AND (`taxinomisi` = " . $isimonixat . ")";
pandora::query($query);

if (pandora::affected_rows() != 1) {
	pandora::rollback();
	lathos("Απέτυχε η ενημέρωση της υπογραφής");
}

if ($taxinomisi > $isimonixat) {
	$query = "UPDATE `letrak`.`ipografi`" .
		" SET `taxinomisi` = `taxinomisi` - 1" .
		" WHERE (`imerisio` = " . $imerisio . ")" .
		" AND (`taxinomisi` > " . $isimonixat . ")" .
		" AND (`taxinomisi` <= " . $taxinomisi . ")";
	pandora::query($query);
}

elseif ($taxinomisi < $isimonixat) {
	$query = "UPDATE `letrak`.`ipografi`" .
		" SET `taxinomisi` = `taxinomisi` + 1" .
		" WHERE (`imerisio` = " . $imerisio . ")" .
		" AND (`taxinomisi` < " . $isimonixat . ")" .
		" AND (`taxinomisi` >= " . $taxinomisi . ")";
	pandora::query($query);
}

$query = "INSERT INTO `letrak`.`ipografi` " .
	" (`imerisio`, `taxinomisi`, `armodios`, `titlos`)" .
	" VALUES (" . $imerisio . ", " . $taxinomisi . ", " .
	$armodios . ", " . pandora::sql_string($titlos) . ")";
pandora::query($query);

if (pandora::affected_rows() !== 1)
lathos("Απέτυχε η προσθήκη υπογραφής");

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
