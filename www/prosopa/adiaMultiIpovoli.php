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
// www/prosopa/adiaMultiIpovoli.php —— Υποβολή στοιχείων αδείας στους
// επιλεγμένους υπαλλήλους.
// @FILE END
//
// @DESCRIPTION BEGIN
// Το παρόν πρόγγραμμα δέχεται ως παραμέτρους τα στοιχεία αδείας του τρέχοντος
// υπαλλήλου, και ένα array που περιέχει τους κωδικούς των επιλεγμένων
// υπαλλήλων. Στόχος είναι να αντιγραφούν τα στοιχεία αδείας του τρέχοντος
// υπαλλήλου στους επιλεγμένους υπαλλήλους. Τα στοιχεία αδείας είναι το είδος
// αδείας, το διάστημα και οι πληροφορίες.
// @DESCRIPTION END
//
// @HISTORY BEGIN
// Updated: 2025-10-30
// Updated: 2025-07-08
// Created: 2025-07-07
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
lathos($deltio_kodikos . ": δεν εντοπίστηκε το παρουσιολόγιο");

if ($deltio->is_klisto())
lathos("Το παρουσιολόγιο έχει επικυρωθεί");

if ($deltio->is_ipogegrameno())
lathos("Το παρουσιολόγιο έχει κυρωθεί");

if ($prosvasi->oxi_deltio_edit($deltio_kodikos))
lathos("Access denied");

$plist = pandora::parameter_get("plist");
$adidos = adia_get($adapo, $adeos);
$exeresi = exeresi_get();
$info = info_get();

$count = 0;

foreach ($plist as $ipalilos) {
	$query = "UPDATE `letrak`.`parousia` SET " .
		"`meraora` = NULL, " .
		"`kataxorisi` = NULL, " .
		"`adidos` = " . $adidos . ", " .
		"`adapo` = " . $adapo . ", " .
		"`adeos` = " . $adeos . ", " .
		"`excuse` = " . $exeresi . "," .
		"`info` = " . $info . " " .
		"WHERE `deltio` = " . $deltio_kodikos . " " .
		"AND `ipalilos` = " . $ipalilos;
	pandora::query($query);

	if (pandora::affected_rows() > 0)
	$count++;
}

print $count;
exit(0);

function adia_get(&$adapo, &$adeos) {
	global $deltio;

	// Είδος αδείας

	$adidos = pandora::parameter_get("adidos");

	if (!isset($adidos))
	$adidos = NULL;

	elseif (!$adidos)
	$adidos = NULL;

	// Έναρξη αδείας

	$adapo = pandora::parameter_get("adapo");

	if (!isset($adapo))
	$adapo = NULL;

	elseif (!$adapo)
	$adapo = NULL;

	// Λήξη αδείας

	$adeos = pandora::parameter_get("adeos");

	if (!isset($adeos))
	$adeos = NULL;

	elseif (!$adeos)
	$adeos = NULL;

	// Διάφοροι έλεγχοι

	if ((!isset($adidos)) && (isset($adidos) || isset($adeos)))
	lathos("Ακαθόριστο είδος αδείας");

	if (!isset($adidos)) {
		$adapo = "NULL";
		$adeos = "NULL";
		return "NULL";
	}

	if (isset($adapo)) {
		$s = DateTime::createFromFormat("d-m-Y", $adapo);

		if ($s === FALSE)
		lathos($adapo . ": λανθασμένη ημερομηνία έναρξης αδείας");

		$adapo = $s->format("Y-m-d");
		$apo = DateTime::createFromFormat("Y-m-d H:i:s",
			$adapo . " 00:00:00");
		$adapo = pandora::sql_string($adapo);
	}

	else {
		$adapo = "NULL";
		$apo = NULL;
	}

	if (isset($adeos)) {
		$s = DateTime::createFromFormat("d-m-Y", $adeos);

		if ($s === FALSE)
		lathos($adeos . ": λανθασμένη ημερομηνία λήξης αδείας");

		$adeos = $s->format("Y-m-d");
		$eos = DateTime::createFromFormat("Y-m-d H:i:s",
			$adeos . " 00:00:00");
		$adeos = pandora::sql_string($adeos);
	}

	else {
		$adeos = "NULL";
		$eos = NULL;
	}

	$tdlt = $deltio->imerominia_get();

	$tdlt = DateTime::createFromFormat("Y-m-d H:i:s",
		$tdlt->format("Y-m-d") . " 00:00:00");

	if (isset($apo) && isset($eos)) {
		$diafora = $apo->diff($eos);

		if (($diafora === FALSE) || $diafora->invert)
		lathos("Μη αποδεκτό διάστημα αδείας");
	}

	if (isset($apo)) {
		$diafora = $apo->diff($tdlt);

		if (($diafora === FALSE) || $diafora->invert)
		lathos("Μη αποδεκτή ημερομηνία αρχής αδείας");
	}

	if (isset($eos)) {
		$diafora = $tdlt->diff($eos);

		if (($diafora === FALSE) || $diafora->invert)
		lathos("Μη αποδεκτή ημερομηνία λήξης αδείας");
	}

	return pandora::sql_string($adidos);
}

function exeresi_get() {
	$exeresi = pandora::parameter_get("exeresi");

	if (!isset($exeresi))
	return "NULL";

	if (!$exeresi)
	return "NULL";

	return pandora::sql_string(trim($exeresi));
}

function info_get() {
	$info = pandora::parameter_get("info");

	if (!isset($info))
	return "NULL";

	if (!$info)
	return "NULL";

	return pandora::sql_string(trim($info));
}

function lathos($s) {
	print $s;
	exit(0);
}
?>
