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
// Σελίδα αναζήτησης συμβάντων (χτυπήματα καρτών). Σε αυτήν τη σελίδα ο χρήστης
// καθορίζει κριτήρια αναζήτησης συμβάντων (ημερομηνία, διάστημα ωρών, κτίριο,
// υπηρεσίες κλπ) και το πρόγραμμα συλλέγει όλα τα σχετικά συμβάντα, τα οποία
// παρουσιάζει με τη μορφή λογιστικού φύλλου.
//
// Τα κριτήρια αναζήτησης καθορίζονται στο url με τις εξής παραμέτρους:
//
//	imerominia	Ημερομηνία με τη μορφή YYYY-MM-DD
//			(default τρέχουσα ημερομηνία)
//
//	apo		Κάτω χρονικό όριο ώρας (default 00:00:00)
//
//	eos		Άνω χρονικό όριο ώρας (default 23:59:59)
//
//	ktirio		Κωδικός κτιρίου (default NDM)
//
// Τα κτίρια είναι τα εξής:
//
//	NDM	Δημαρχιακό Μέγαρο
//	DKA	Α' Δημοτική Κοινότητα
//	DKB	Β' Δημοτική Κοινότητα
//	DKC	Γ' Δημοτική Κοινότητα
//	DKD	Δ' Δημοτική Κοινότητα
//	DKE	Ε' Δημοτική Κοινότητα
//	DKT	Κοινότητα Τριανδρίας
//	ARX	Αρχιτεκτονικό
//	POL	ΠΟΛΕΟΔΟΜΙΑ
//	BIB	Κεντρική Βιβλιοθήκη
//	KIS	Κέντρο Ιστορίας
//	PRN	Πρόνοια
//	PRA	Πράσινο
//	BIO	Βιώσιμη
//	SMA	Σταθμός Μεταφόρτωσης Απορριμμάτων
// @DESCRIPTION END
//
// @HISTORY BEGIN
// Updated: 2024-03-26
// Updated: 2024-03-25
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

$checker = onoma_xristi();

if (!$checker) {
	header("Location: ../isodos/index.php");
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
if (!$imerominia) $imerominia = date("Y-m-d");

$apo = pandora::parameter_get("apo");
if (!$apo) $apo = "00:00:00";

$eos = pandora::parameter_get("eos");
if (!$eos) $eos = "23:59:59";

$ktirio = pandora::parameter_get("ktirio");
if (!$ktirio) $ktirio = "NDM";

$filename = $checker . "_" . rand();
$cmd = "lib/checkin.sh";
$cmd .= " -x tmp/" . $filename . "";
$cmd .= " -d " . $imerominia . "";
$cmd .= " -s " . $ktirio . "";
$cmd .= " -f " . $apo . "";
$cmd .= " -t " . $eos . "";

print "<p>" . $cmd . "</p>";
system($cmd);
print '<p>Κάντε κλικ <a href="tmp/' . $filename . '.xlsx" target="_blank">' .
	'εδώ</a> για να κατεβάσετε τα στοιχεία</p>';

function onoma_xristi() {
	if (!isset($_SESSION))
	return FALSE;

	if (!is_array($_SESSION))
	return FALSE;

	if (!array_key_exists("letrak_session_ipalilos", $_SESSION))
	return FALSE;

	$checker = json_decode($_SESSION["letrak_session_ipalilos"]);
	$checker = $checker->kodikos;

	if (!$checker)
	return FALSE;

	return $checker;
}
