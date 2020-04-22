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

if (letrak::oxi_xristis())
lathos("Διαπιστώθηκε ανώνυμη χρήση");

$kodikos = pandora::parameter_get("kodikos");

if ((!$kodikos) || ($kodikos != (int)$kodikos))
lathos("Ακαθόριστος κωδικός παρουσιολογίου προς διαγραφή");

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
