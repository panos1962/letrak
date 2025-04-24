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
// www/prosopa/iperoria.php —— Καθορισμός υπερωριών επιλεγμένων, ή μη
// επιλεγμένων υπαλλήλων παρουσιολογίου
// @FILE END
//
// @DESCRIPTION BEGIN
// Το παρόν πρόγραμμα καλείται από τη φόρμα επεξεργασίας δελτίου και σκοπό
// έχει τον μαζικό καθορισμό υπερωριών σε υπαλλήλους. Ως παραμέτρους δέχεται
// τον κωδικό δελτίου και ένα array με τους κωδικούς των υπαλλήλων στους
// οποίους θα δοθούν οι υπερωρίες.
// @DESCRIPTION END
//
// @HISTORY BEGIN
// Created: 2025-04-24
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

$deltio_kodikos = pandora::parameter_get("deltio");

if (letrak::deltio_invalid_kodikos($deltio_kodikos))
lathos("Μη αποδεκτός κωδικός παρουσιολογίου");

$deltio = (new Deltio())->from_database($deltio_kodikos);

if ($deltio->oxi_kodikos())
lathos($kodikos . ": δεν εντοπίστηκε το παρουσιολόγιο");

if ($deltio->is_klisto())
lathos("Το παρουσιολόγιο έχει επικυρωθεί");

if ($deltio->is_ipogegrameno())
lathos("Το παρουσιολόγιο έχει κυρωθεί");

if ($prosvasi->oxi_deltio_edit($deltio_kodikos))
lathos("Access denied");

$ores = pandora::parameter_get("ores");
$ores = filter_var($ores, FILTER_VALIDATE_INT);

if (($ores === FALSE) || ($ores < 0) || ($ores > 12))
lethos("Καθορίστηκαν λανθασμένες ώρες υπερωριών");

$plist = pandora::parameter_get("plist");

if (!is_array($plist))
lathos("Ακαθόριστοι υπάλληλοι για υπερωρίες");

$plist_count = count($plist);

if ($plist_count <= 0)
lathos("Δεν επελέγησαν υπάλληλοι για υπερωρίες");

///////////////////////////////////////////////////////////////////////////////@

$imerominia = $deltio->imerominia_get()->format("Y-m-d");
$prosapo = $deltio->prosapo_get();
$kataxorisi = pandora::sql_string(LETRAK_PAROUSIA_KATAXORISI_SINTAKTIS);

for ($i = 0; $i < $plist_count; $i++)
iperoria($plist[$i]);

exit(0);

function iperoria($ipalilos) {
	global $deltio_kodikos;
	global $imerominia;
	global $prosapo;
	global $kataxorisi;
	global $ores;

	$query = "SELECT `orario` FROM `letrak`.`parousia`" .
		" WHERE (`deltio` = " . $deltio_kodikos . ")" .
		" AND (`ipalilos` = " . $ipalilos . ")" .
		" AND (`excuse` IS NULL)" .
		" AND (`adidos` IS NULL)";
	$result = pandora::query($query);

	$orario = NULL;

	while ($row = $result->fetch_array(MYSQLI_NUM))
	$orario = $row[0];

	$orario = new Orario($orario);

	if ($orario->oxi_orario())
	return;

	switch ($prosapo) {
	case LETRAK_DELTIO_PROSAPO_PROSELEFSI:
		$meraora = $orario->apo_get($imerominia);
		$invert = 1;
		break;
	case LETRAK_DELTIO_PROSAPO_APOXORISI:
		$meraora = $orario->eos_get($imerominia);
		$invert = 0;
		break;
	default:
		return;
	}

	if ($meraora === NULL)
	return;

	$sinplin = ($ores * 60) + random_int(0, 7);
	$sinplin = new DateInterval("PT" . $sinplin . "M");
	$sinplin->invert = $invert;
	$meraora->add($sinplin);
	$meraora = $meraora->format("Y-m-d H:i:00");

	$query = "UPDATE `letrak`.`parousia` SET" .
		" `meraora` = '" . $meraora . "'," .
		" `kataxorisi` = " . $kataxorisi .
		" WHERE (`deltio` = " . $deltio_kodikos . ")" .
		" AND (`ipalilos` = " . $ipalilos . ")";

	pandora::query($query);
}

function lathos($s) {
	print $s;
	exit(0);
}
?>
