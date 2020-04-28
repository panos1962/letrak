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
// www/prosopa/ipogarfiDiagrafi.php —— Διαγραφή υπογραφής παρουσιολογίου
// @FILE END
//
// @DESCRIPTION BEGIN
// @DESCRIPTION END
//
// @HISTORY BEGIN
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

if (pandora::not_integer($imerisio, 1))
lathos("Μη αποδεκτός κωδικός παρουσιολογίου");

$taxinomisi = pandora::parameter_get("taxinomisi");

if (pandora::not_integer($taxinomisi, 1))
lathos("Μη αποδεκτός αύξων αριθμός υπογραφής");

///////////////////////////////////////////////////////////////////////////////@

pandora::query("BEGIN WORK");

$query = "DELETE FROM `letrak`.`ipografi` " .
	" WHERE (`imerisio` = " . $imerisio . ")" .
	" AND (`taxinomisi` = " . $taxinomisi . ")";
pandora::query($query);

if (pandora::affected_rows() !== 1) {
	pandora::query("ROLLBACK WORK");
	lathos("Απέτυχε η διαγραφή υπογραφής");
}

$query = "UPDATE `letrak`.`ipografi` " .
	" SET `taxinomisi` = `taxinomisi` - 1 " .
	" WHERE (`imerisio` = " . $imerisio . ")" .
	" AND (`taxinomisi` > " . $taxinomisi . ")";
pandora::query($query);

pandora::query("COMMIT WORK");

///////////////////////////////////////////////////////////////////////////////@

function lathos($s) {
	print $s;
	exit(0);
}

?>
