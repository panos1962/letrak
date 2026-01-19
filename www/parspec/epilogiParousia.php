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
// www/parspec/epilogiParousia.php —— Επιλογή παρουσιών
// @FILE END
//
// @DESCRIPTION BEGIN
// @DESCRIPTION END
//
// @HISTORY BEGIN
// Created: 2026-01-18
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

switch ($prosvasi->epipedo_get()) {
case 'VIEW':
case 'UPDATE':
case 'ADMIN':
	break;
default:
	lathos("Διαπιστώθηκε ελλιπής εξουσιοδότηση");
}

$ipalilos = pandora::parameter_get("ipalilos");
$apo = pandora::parameter_get("apo");
$eos = pandora::parameter_get("eos");

if ($apo)
$apo = pandora::date2date($apo, "d-m-Y", "Y-m-d");

else
$apo = date("Y-m-d");

if ($eos)
$eos = pandora::date2date($eos, "d-m-Y", "Y-m-d");

else
$eos = date("Y-m-d");

$query = "SELECT " .
	"`deltio`.`imerominia` AS `d`, " .
	"`deltio`.`prosapo` AS `i`, " .
	"`parousia`.`orario` AS `o`, " .
	"`parousia`.`meraora` AS `t`, " .
	"`parousia`.`adidos` AS `a`, " .
	"`parousia`.`exeresi` AS `e`, " .
	"`parousia`.`info` AS `s`" .
	" FROM `letrak`.`deltio`, `letrak`.`parousia`" .
	" WHERE `parousia`.`ipalilos` = " . $ipalilos .
	" AND `deltio` IN (SELECT `kodikos` FROM `letrak`.`deltio" .
	" WHERE `deltio`.`imerominia` BETWEEN " . pandora::sql_strinf($apo) .
	" AND " . pandora::sql_string($eos) .
	" ORDER BY `d` DESC, `i` DESC";
$result = pandora::query($query);

print '{"plist":[';
$enotiko = "";

while ($row = $result->fetch_assoc()) {
	print $enotiko . pandora::json_string($row);
	$enotiko = ",";
}

$result->close();
print "]}";

function lathos($s) {
	print '{"error":' . pandora::json_string($s) . '}';
	exit(0);
}
