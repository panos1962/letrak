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
// www/imerisio/diagrafi.php —— Διαγραφή παρουσιολογίου
// @FILE END
//
// @HISTORY BEGIN
// Created: 2020-04-22
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
lathos("Αδυναμία εντοπισμού παρουσιολογίου προς διαγραφή");

if ($prosvasi->ipiresia_oxi_update($imerisio["ipiresia"]))
lathos("Δεν έχετε δικαίωμα διαγραφής παρουσιολογίου");

///////////////////////////////////////////////////////////////////////////////@

$query = "DELETE FROM `letrak`.`imerisio` WHERE `kodikos` = " . $kodikos;
pandora::query($query);

if (pandora::affected_rows() < 1)
lathos("Αποτυχία διαγραφής παρουσιολογίου");

exit(0);

///////////////////////////////////////////////////////////////////////////////@

function lathos($msg) {
	print $msg;
	exit(0);
}
?>
