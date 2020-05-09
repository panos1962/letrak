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
// www/prosopa/winpak.php —— Αναζήτηση καταγραφών από σύστημα καταγραφής
// @FILE END
//
// @DESCRIPTION BEGIN
// @DESCRIPTION END
//
// @HISTORY BEGIN
// Created: 2020-05-08
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

$kodikos = pandora::parameter_get("imerisio");

if (letrak::imerisio_invalid_kodikos($kodikos))
lathos("Μη αποδεκτός κωδικός παρουσιολογίου");

$plist = pandora::parameter_get("plist");

print '{';
///////////////////////////////////////////////////////////////////////////////@

$imerisio = (new Imerisio())->from_database($kodikos);

if ($imerisio->oxi_kodikos())
lathos($kodikos . ": δεν βρέθηκε το παρουσιολόγιο");

$imerominia = $imerisio->imerominia_get()->format("Y-m-d");
$imerominia = "2019-10-10";
$imerominia = "2019-07-02";
$prosapo = $imerisio->prosapo_get();

$query = "SELECT" .
	" DATE_SUB('" . $imerominia . "', INTERVAL 1 DAY)," .
	" DATE_ADD('" . $imerominia . "', INTERVAL 1 DAY)";
$row = pandora::first_row($query, MYSQLI_NUM);

print '"diastima": "' . $row[0] . " - " . $row[1] . '"}",';
print '"data":{';
$s = "";
foreach ($plist as $ipalilos => $data)
katagrafi($imerominia, $prosapo, $ipalilos, $data["o"], $data["k"], $s);
print '}';

///////////////////////////////////////////////////////////////////////////////@
print '}';
exit(0);

function katagrafi($imerominia, $prosapo, $ipalilos, $orario, $karta, &$s) {
	$orario = (new Orario())->from_string($orario);

	if ($orario->oxi_orario())
	return;

	$query = "SELECT `meraora` FROM `kartel`.`event` " .
		" WHERE (`karta` = " . $karta . ")".
		" AND (`meraora` > DATE_SUB('" . $imerominia . "',".
		" INTERVAL 1 DAY))" .
		" AND (`meraora` <= DATE_ADD('" . $imerominia . "',".
		" INTERVAL 1 DAY))" .
		" ORDER BY `meraora` DESC";
	$row = pandora::first_row($query, MYSQLI_NUM);

	if (!$row)
	return;

	print $s . $ipalilos . ':{"t":"' . $row[0] . '"}';
	$s = ",";
}
