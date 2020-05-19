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
// www/prosopa/parousiaIpovoli.php —— Υποβολή στοιχείων παρουσίας
// @FILE END
//
// @DESCRIPTION BEGIN
// @DESCRIPTION END
//
// @HISTORY BEGIN
// Updated: 2020-05-19
// Created: 2020-05-16
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

$ipalilos_kodikos = pandora::parameter_get("ipalilos");

if (letrak::ipalilos_invalid_kodikos($ipalilos_kodikos))
lathos("Μη αποδεκτός αρ. μητρώου εργαζομένου");

$ipalilos = (new Ipalilos())->from_database($ipalilos_kodikos);

if ($ipalilos->oxi_kodikos())
lathos($ipalilos_kodikos . ": δεν εντοπίστηκε ο εργαζόμενος");

$adidos = adia_get($adapo, $adeos);
$excuse = excuse_get();

if (($adidos !== "NULL")  && ($excuse !== "NULL"))
lathos("Καθορίσατε άδεια ΚΑΙ αιτιολογία");

///////////////////////////////////////////////////////////////////////////////@

$orario = orario_get();
$karta = karta_get();
$meraora = meraora_get();
$info = info_get();

$query = "REPLACE INTO `letrak`.`parousia` " .
	"(`deltio`, `ipalilos`, `orario`, `karta`, `meraora`," .
	" `adidos`, `adapo`, `adeos`, `excuse`, `info`) VALUES (" .
	$deltio_kodikos . ", " .
	$ipalilos_kodikos . ", " .
	$orario . ", " .
	$karta . ", " .
	$meraora . ", " .
	$adidos . ", " .
	$adapo . ", " .
	$adeos . ", " .
	$excuse . ", " .
	$info . ")";
pandora::query($query);

if (pandora::affected_rows() < 1)
lathos("Αστοχία υποβολής στοιχείων παρουσίας");

exit(0);

function orario_get() {
	$s = pandora::parameter_get("orario");

	if (!isset($s))
	return "NULL";

	if (!$s)
	return "NULL";

	$orario = new Orario($s);

	if ($orario->oxi_orario())
	lathos($s . ": μη αποδεκτό ωράριο");

	return pandora::sql_string($orario->to_string());
}

function karta_get() {
	$s = pandora::parameter_get("karta");

	if (!isset($s))
	return "NULL";

	if (!$s)
	return "NULL";

	if (letrak::ipalilos_invalid_karta($s))
	lathos($s . ": μη αποδεκτός αριθμός κάρτας");

	return $s;
}

function meraora_get() {
	global $deltio;

	$s = pandora::parameter_get("meraora");

	if (!isset($s))
	return "NULL";

	if (!$s)
	return "NULL";

	$t = DateTime::createFromFormat("d-m-Y H:i", $s);

	if ($t === FALSE)
	lathos($s . ": λανθασμένη ημερομηνία/ώρα συμβάντος");

	$tdlt = $deltio->imerominia_get();

	if (!isset($tdlt))
	return pandora::sql_string($t->format("Y-m-d H:i"));

	$tdlt = DateTime::createFromFormat("Y-m-d H:i:s",
		$tdlt->format("Y-m-d") . " 00:00:00");

	$diafora = $tdlt->diff($t);

	if ($diafora === FALSE)
	lathos($s . ": ακαθόριστη ημερομηνία παρουσιολογίου");

	$max = ($diafora->invert ? 0 : 1);

	if ($diafora->d > $max)
	lathos($s . ": μη αποδεκτή ημερομηνία/ώρα συμβάντος");

	return pandora::sql_string($t->format("Y-m-d H:i"));
}

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

function excuse_get() {
	$excuse = pandora::parameter_get("excuse");

	if (!isset($excuse))
	return "NULL";

	if (!$excuse)
	return "NULL";

	return pandora::sql_string($excuse);
}

function info_get() {
	$info = pandora::parameter_get("info");

	if (!isset($info))
	return "NULL";

	if (!$info)
	return "NULL";

	return pandora::sql_string($info);
}

function lathos($s) {
	print $s;
	exit(0);
}
?>
