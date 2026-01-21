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
// www/admin/epilogiEvent.php —— Επιλογή συμβάντων
// @FILE END
//
// @DESCRIPTION BEGIN
// @DESCRIPTION END
//
// @HISTORY BEGIN
// Updated: 2026-01-21
// Updated: 2025-04-15
// Created: 2020-03-09
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

$prosvasi = letrak::prosvasi_check();

if ($prosvasi->ipiresia_oxi_admin(''))
lathos("Διαπιστώθηκε ελλιπής εξουσιοδότηση κατά την επιλογή συμβάντων");

$karta = pandora::parameter_get("karta");

if (letrak::ipalilos_invalid_karta($karta))
lathos("Μη αποδεκτός αριθμός κάρτας");

$imerominia = pandora::parameter_get("imerominia");

if ($imerominia)
$imerominia = pandora::date2date($imerominia, "d-m-Y", "Y-m-d");

else
$imerominia = date("Y-m-d");

$imerominia .= " 23:59:59";

$query = "SELECT `kodikos` AS `e`," .
	" DATE_FORMAT(`meraora`, '%Y%m%d%H%i%s') AS `t`," .
	" DATE_FORMAT(`meraora`, '%d-%m-%Y %H:%i:%s') AS `i`," .
	" `reader` AS `r`" .
	" FROM `kartel`.`event`" .
	" WHERE (`karta` = " . $karta . ")" .
	" AND (`meraora` <= " . pandora::sql_string($imerominia) . ")" .
	" ORDER BY `t` DESC, `e` DESC" .
	" LIMIT 100";
$result = pandora::query($query);

print '{"elist":[';
$enotiko = "";

while ($row = $result->fetch_assoc()) {
	unset($row["t"]);
	print $enotiko . pandora::json_string($row);
	$enotiko = ",";
}

$result->close();
print "]}";

function lathos($s) {
	print '{"error":' . pandora::json_string($s) . '}';
	exit(0);
}
