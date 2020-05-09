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

$kodikos = pandora::parameter_get("deltio");

if (letrak::deltio_invalid_kodikos($kodikos))
lathos("Μη αποδεκτός κωδικός παρουσιολογίου");

$plist = pandora::parameter_get("plist");

print '{';
///////////////////////////////////////////////////////////////////////////////@

$deltio = (new Deltio())->from_database($kodikos);

if ($deltio->oxi_kodikos())
lathos($kodikos . ": δεν βρέθηκε το παρουσιολόγιο");

$imerominia = $deltio->imerominia_get()->format("Y-m-d");
$prosapo = $deltio->prosapo_get();

print '"data":{';
$s = "";
foreach ($plist as $ipalilos => $data)
katagrafi($ipalilos, $data["o"], $data["k"], $s);
print '}';

///////////////////////////////////////////////////////////////////////////////@
print '}';
exit(0);

function katagrafi($ipalilos, $orario, $karta, &$s) {
	global $kodikos;
	global $imerominia;
	global $prosapo;

	$orario = (new Orario())->from_string($orario);

	if ($orario->oxi_orario())
	return;

	switch ($prosapo) {
	case "ΠΡΟΣΕΛΕΥΣΗ":
		$exact = $orario->proselefsi_diastima($imerominia, $apo, $eos);
		$proselefsi = TRUE;
		$ord = "ASC";
		break;
	case "ΑΠΟΧΩΡΗΣΗ":
		$exact = $orario->apoxorisi_diastima($imerominia, $apo, $eos);
		$proselefsi = FALSE;
		$ord = "DESC";
		break;
	default:
		return;
	}

	if (!$exact)
	return;

	$sapo = $apo->format("Y-m-d H:i:s");
	$seos = $eos->format("Y-m-d H:i:s");

	$query = "SELECT `meraora` FROM `kartel`.`event` " .
		" WHERE (`karta` = " . $karta . ")".
		" AND (`meraora` > '" . $sapo . "')".
		" AND (`meraora` < '" . $seos . "')".
		" ORDER BY `meraora` " . $ord;
	$result = pandora::query($query);

	$meraora = NULL;

	while ($row = $result->fetch_array(MYSQLI_NUM)) {
		$t = DateTime::createFromFormat("Y-m-d H:i:s", $row[0]);

		if ($t === FALSE)
		continue;

		if (!isset($meraora)) {
			$meraora = $t;
			continue;
		}

		if ($proselefsi) {
			if ($t > $exact)
			break;

			$meraora = $t;
			continue;
		}

		if ($t < $exact)
		break;

		$meraora = $t;
	}

	if (!isset($meraora))
	return;

	$meraora = $meraora->format("Y-m-d H:i");

	if ($meraora === FALSE)
	return;

	$query = "UPDATE `letrak`.`parousia` SET `meraora` = '" .
		$meraora . ":00' WHERE (`deltio` = " . $kodikos . ")" .
		" AND (`ipalilos` = " . $ipalilos . ")";
	pandora::query($query);

	if (pandora::affected_rows() != 1)
	return;

	print $s . '"' . $ipalilos . '":"' . $meraora . '"';
	$s = ",";
}
