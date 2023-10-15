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
// www/prosopa/orarioItemDiagrafi.php —— Απαλοιφή ωραρίου υπαλλήλου
// @FILE END
//
// @DESCRIPTION BEGIN
// Διαγραφή ωραρίου υπαλλήλου από τα ωράρια που δίνονται ως επιλογή για τον
// συγκεκριμένο υπάλληλο.
// @DESCRIPTION END
//
// @HISTORY BEGIN
// Created: 2023-10-15
// @HISTORY END
//
// @END
//
///////////////////////////////////////////////////////////////////////////////@

require_once("../../local/conf.php");
require_once(LETRAK_BASEDIR . "/www/lib/letrak.php");

pandora::
header_json()::
session_init()::
database();

$prosvasi = letrak::prosvasi_get();

if ($prosvasi->oxi_ipalilos())
lathos("Διαπιστώθηκε ανώνυμη χρήση");

$ipalilos = pandora::parameter_get("ipalilos");

if (letrak::ipalilos_invalid_kodikos($ipalilos))
lathos("Μη αποδεκτός αρ. μητρώου εργαζομένου");

$orario = pandora::parameter_get("orario");

///////////////////////////////////////////////////////////////////////////////@

$query = "DELETE FROM `letrak`.`orario`" .
	" WHERE (`ipalilos` = " . $ipalilos . ")" .
	" AND (`orario` = " . pandora::sql_string($orario) . ")";
pandora::query($query);

if (pandora::affected_rows() != 1)
lathos("Αστοχία απαλοιφής ωραρίου");

exit(0);

function lathos($s) {
	print $s;
	exit(0);
}
?>
