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
// www/deltio/index.php —— Εφαρμογή διαχείρισης παρουσιολογίων
// @FILE END
//
// @DESCRIPTION BEGIN
// Σελίδα αναζήτησης συμβάντων (χτυπημάτων καρτών). Σε αυτήν τη σελίδα ο χρήστης
// καθορίζει κριτήρια αναζήτησης συμβάντων (ημερομηνία, διάστημα ωρών, υπηρεσίες
// κλπ) και το πρόγραμμα συλλέγει όλα τα σχετικά συμβάντα, τα οποία παρουσιάζει
// με τη μορφή λογιστικού φύλλου.
// @DESCRIPTION END
//
// @HISTORY BEGIN
// Created: 2024-03-22
// @HISTORY END
//
// @END
//
///////////////////////////////////////////////////////////////////////////////@

require_once("../../local/conf.php");
require_once(LETRAK_BASEDIR . "/www/lib/letrak.php");

pandora::
session_init();

if (anonimo()) {
	header("Location: ../isodos");
	exit(0);
}

pandora::
document_head([
	"title" => "Checkin",
	"css" => [
		"../mnt/pandora/lib/pandora",
		"../lib/pandora",
		"../lib/letrak",
		"main",
	],
])::
database();

$imerominia = pandora::parameter_get("imerominia");

if (!$imerominia)
$imerominia = date("Y-m-d");

$ktirio = pandora::parameter_get("ktirio");

if (!$ktirio)
$ktirio = "NDM";

$apo = pandora::parameter_get("apo");

if (!$apo)
$apo = "00:00:00";

$eos = pandora::parameter_get("eos");

if (!$eos)
$eos = "23:59:59";

$cmd = "lib/checkin.sh";
$cmd .= " -x 'tmp/" . $checker . "'";
$cmd .= " -d '" . $imerominia . "'";
$cmd .= " -f '" . $apo . "'";
$cmd .= " -t '" . $eos . "'";

system($cmd);
header("Location: tmp/" . $checker . ".xlsx");


function anonimo() {
	global $checker;

	if (!array_key_exists("letrak_session_ipalilos", $_SESSION))
	return TRUE;

	$checker = json_decode($_SESSION["letrak_session_ipalilos"]);
	$checker = $checker->kodikos;

	if (!$checker)
	return TRUE;

	return FALSE;
}
