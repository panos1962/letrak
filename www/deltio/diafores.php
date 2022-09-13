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
// www/deltio/klonismos.php —— Δημιουργία αντιγράφου παρουσιολογίου
// @FILE END
//
// @DESCRIPTION BEGIN
// Το παρόν πρόγραμμα καλείται από τη σελίδα των παρουσιολογίων και δέχεται
// ως παραμέτρους τον κωδικό τού επιλεγμένου παρουσιολογίου (trexon) και τον
// κωδικό του προτύπου τού επιλεγμένου παρουσιολογίου (protipo). Σκοπός του
// προγράμματος είναι να συγκρίνει το επιλεγμένο παρουσιολόγιο με το αντίστοιχο
// προηγούμενο, π.χ. αν το επιλεγμένο παρουσιολόγιο είναι το δελτίο προσέλευσης
// της Τρίτης, 13 Σεπτεμβρίου 2022, τότε αυτό θα συγκριθεί με το δελτίο
// προσέλευσης της Δευτέρας, 12 Σεπτεμβρίου 2022.
// @DESCRIPTION END
//
// @HISTORY BEGIN
// Created: 2022-09-13
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
letrak::fatal_error_json("Διαπιστώθηκε ανώνυμη χρήση");

$trexon = pandora::parameter_get("trexon");

if (letrak::deltio_invalid_kodikos($trexon))
letrak::fatal_error_json("Ακαθόριστος κωδικός παρουσιολογίου");

$protipo = pandora::parameter_get("protipo");

if (letrak::deltio_invalid_kodikos($protipo))
letrak::fatal_error_json("Ακαθόριστος κωδικός προτύπου");

$proigoumeno = entopismos_protipou($protipo);

if ($proigoumeno === FALSE)
letrak::fatal_error_json("Αδυναμία εντοπισμού προηγούμενου");

print '{"proigoumeno":' . $proigoumeno . '}';

///////////////////////////////////////////////////////////////////////////////@

function entopismos_protipou($deltio) {
	$query = "SELECT `protipo` FROM `letrak`.`deltio`" .
		" WHERE `kodikos` = " . $deltio;
	$row = pandora::first_row($query, MYSQLI_NUM);

	if (!$row)
	return FALSE;

	$protipo = $row[0];

	if (!$protipo)
	return FALSE;

	return $protipo;
}
?>
