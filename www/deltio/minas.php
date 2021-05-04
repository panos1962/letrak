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
// www/deltio/minas.php —— Μηνιαία κατάσταση αδειών
// @FILE END
//
// @DESCRIPTION BEGIN
// @DESCRIPTION END
//
// @HISTORY BEGIN
// Created: 2021-05-04
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

$dlist = pandora::parameter_get("dlist");

if (!is_array($dlist))
letrak::fatal_error_json("Μη αποδεκτή λίστα δελτίων");

$basedir = getenv("LETRAK_BASEDIR");

if ($basedir === FALSE)
$basedir = "/var/opt/letrak";

$cmd = $basedir . "/bin/minas -w";

foreach ($dlist as $kodikos) {
	$cmd .= " " . $kodikos;
}

system($cmd);
?>
