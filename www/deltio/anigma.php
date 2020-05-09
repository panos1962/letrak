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
// www/deltio/anigma.php —— Άνοιγμα παρουσιολογίου
// @FILE END
//
// @HISTORY BEGIN
// Updated: 2020-05-06
// Updated: 2020-05-04
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

$deltio = (new Deltio())->from_database($kodikos);

if ($deltio->oxi_kodikos())
lathos("Αδυναμία εντοπισμού παρουσιολογίου");

$ipiresia = $deltio->ipiresia_get();

if ($prosvasi->ipiresia_oxi_admin($ipiresia))
lathos("Δεν έχετε δικαίωμα ανοίγματος παρουσιολογίου");

///////////////////////////////////////////////////////////////////////////////@

$query = "UPDATE `letrak`.`deltio` SET `closed` = NULL" .
	" WHERE `kodikos` = " . $kodikos;
pandora::query($query);

if (pandora::affected_rows() != 1)
lathos("Αποτυχία ανοίγματος παρουσιολογίου");

exit(0);

///////////////////////////////////////////////////////////////////////////////@

function lathos($msg) {
	print $msg;
	exit(0);
}
?>
