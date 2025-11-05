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
// www/adialist/index.php —— Σελίδα γρήγορης εκτύπωσης αδειών υπαλλήλου
// @FILE END
//
// @DESCRIPTION BEGIN
// @DESCRIPTION END
//
// @HISTORY BEGIN
// Created: 2025-11-05
// @HISTORY END
//
// @END
//
///////////////////////////////////////////////////////////////////////////////@

define("SEP", " | ");
require_once("../../local/conf.php");
require_once(LETRAK_BASEDIR . "/www/lib/letrak.php");

$ipalilos = pandora::parameter_get("ipalilos");
$etos = pandora::parameter_get("etos");

pandora::
header_data()::
session_init()::
database();

letrak::prosvasi_check();

$query = "SELECT `adidos`, `adapo`, `adeos`, `info`" .
" FROM `letrak`.`parousia`" .
" WHERE `ipalilos` = " . $ipalilos .
" AND `deltio` IN (" .
	" SELECT `kodikos`" .
	" FROM `letrak`.`deltio`" .
	" WHERE `imerominia` BETWEEN '" . $etos . "-01-01'" .
	" AND '" . $etos . "-12-31'" .
	" AND `prosapo` = 'ΠΡΟΣΕΛΕΥΣΗ'" .
")" .
" AND `adidos` IS NOT NULL" .
" ORDER BY `deltio`";

$count = 0;
$total = [];

$result = pandora::query($query);

while ($row = $result->fetch_array(MYSQLI_NUM)) {
	print
	$row[0] . SEP .
	$row[1] . SEP .
	$row[2] . SEP .
	$row[3] . SEP .
	PHP_EOL;

	if (array_key_exists($row[0], $total))
	$total[$row[0]]++;

	else
	$total[$row[0]] = 1;

	$count++;
}

if (!$count)
exit(0);

print "__________________\n\n";

foreach ($total as $idos => $meres)
print $idos . ": " . $meres;

$result->close();
exit(0);
?>
