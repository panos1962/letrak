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
// www/prosopa/ipogarfiInsert.php —— Προσθήκη υπογραφής παρουσιολογίου
// @FILE END
//
// @DESCRIPTION BEGIN
// Το παρό πρόγραμμα καλείται από τη σελίδα επεξεργασίας παρουσιολογίου και
// σκοπό έχει την προσθήκη νέου υπογράφοντος. Η νέα εγγραφή προστίθεται σε
// σημείο που υποδηλώνει ο ταξινομικός αριθμός, ενώ παράλληλα ακυρώνει τυχόν
// ήδη επικυρωμένες υπογραφές.
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

$armodios = pandora::parameter_get("armodios");

if (pandora::not_integer($armodios, 1, LETRAK_IPALILOS_KODIKOS_MAX))
lathos("Μη αποδεκτός αριθμός μητρώου υπογράφοντος υπαλλήλου");

$taxinomisi = pandora::parameter_get("taxinomisi");

if ($taxinomisi &&
	pandora::not_integer($taxinomisi, 1, LETRAK_IPOGRAFI_TAXINOMISI_MAX))
lathos("Μη αποδεκτός ταξινομικός αριθμός");

$titlos = pandora::parameter_get("titlos");

///////////////////////////////////////////////////////////////////////////////@

pandora::autocommit(FALSE);

if ($taxinomisi) {
	$query = "UPDATE `letrak`.`ipografi`" .
		" SET `taxinomisi` = `taxinomisi` + 1" .
		" WHERE (`imerisio` = " . $imerisio . ")" .
		" AND (`taxinomisi` >= " . $taxinomisi . ")";
	pandora::query($query);
}

else
$taxinomisi = LETRAK_IPOGRAFI_TAXINOMISI_MAX;

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
