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
// www/imerisio/klisimo.php —— Κλείσιμο παρουσιολογίου
// @FILE END
//
// @HISTORY BEGIN
// Created: 2020-05-03
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

$kodikos = pandora::parameter_get("kodikos");

if (pandora::not_integer($kodikos, 1, LETRAK_IMERISIO_KODIKOS_MAX))
lathos("Μη αποδεκτός κωδικός παρουσιολογίου");

$query = "SELECT `ipiresia` FROM `letrak`.`imerisio`" .
	" WHERE `kodikos` = " . $kodikos;
$imerisio = pandora::first_row($query, MYSQLI_ASSOC);

if (!$imerisio)
lathos("Αδυναμία εντοπισμού παρουσιολογίου");

if ($prosvasi->oxi_update($imerisio["ipiresia"]))
lathos("Δεν έχετε δικαίωμα κλεισίματος παρουσιολογίου");

$query = "SELECT `imerisio` FROM `letrak`.`ipografi`" .
	" WHERE (`imerisio` = " . $kodikos . ")" .
	" AND (`checkok` IS NULL)";

if (pandora::first_row($query, MYSQLI_NUM))
lathos("Δεν υπάρχουν οι απαραίτητες υπογραφές");

///////////////////////////////////////////////////////////////////////////////@

$query = "UPDATE `letrak`.`imerisio`" .
	" SET `closed` = NOW()" .
	" WHERE `kodikos` = " . $kodikos;
pandora::query($query);

if (pandora::affected_rows() != 1)
lathos("Αποτυχία κλεισίματος παρουσιολογίου");

exit(0);

///////////////////////////////////////////////////////////////////////////////@

function lathos($msg) {
	print $msg;
	exit(0);
}
?>
