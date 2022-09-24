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
//
// Η διαδικασία έχει ως εξής: Προσπελαύνουμε το πρότυπο παρουσιολόγιο του
// επιλεγμένου παρουσιολογίου και μετά προσπελαύνουμε το πρότυπο παρουσιολόγιο
// του προτύπου. Με αυτόν τον τρόπο εντοπίζουμε το «αντίστοιχο» προηγούμενο
// παρουσιολόγιο του επιλεγμένου παρουσιολογίου.
// @DESCRIPTION END
//
// @HISTORY BEGIN
// Updated: 2022-09-24
// Updated: 2022-09-17
// Updated: 2022-09-14
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

$proigoumeno = entopismos_proigoumenou($protipo);

if ($proigoumeno === FALSE)
letrak::fatal_error_json("Αδυναμία εντοπισμού προηγούμενου παρουσιολογίου");

$trexon_parousia = [];
select_parousia($trexon, $trexon_parousia);

$proigoumeno_parousia = [];
select_parousia($proigoumeno, $proigoumeno_parousia);

if (oxi_diafores($trexon_parousia, $proigoumeno_parousia, $proigoumeno))
exit(0);

print '{"dif":1,"tre":' . $trexon . ',"pro":' . $proigoumeno . '}';

///////////////////////////////////////////////////////////////////////////////@

function entopismos_proigoumenou($deltio) {
	$query = "SELECT `protipo` FROM `letrak`.`deltio`" .
		" WHERE `kodikos` = " . $deltio;
	$deltio = pandora::first_row($query, MYSQLI_NUM);

	if (!$deltio)
	return FALSE;

	$proigoumeno = $deltio[0];

	if (letrak::deltio_invalid_kodikos($proigoumeno))
	return FALSE;

	return $proigoumeno;
}

function select_parousia($deltio, &$pinakas) {
	$query = "SELECT `ipalilos`, `orario`, `karta`, `meraora`, " .
		"`adidos`, `adapo`, `adeos`, `excuse`, `info` " .
		"FROM `letrak`.`parousia` " .
		"WHERE `deltio` = " . $deltio;

	$result = pandora::query($query);

	while ($row = $result->fetch_array(MYSQLI_ASSOC)) {
		$ipalilos = $row["ipalilos"];
		unset($row["ipalilos"]);

		$pinakas[$ipalilos] = $row;
	}
}

function oxi_diafores(&$tre, &$pro, $proigoumeno) {
	// Στον πίνακα "columns" έχουμε τα πεδία που μπορεί
	// να παρουσιάζουν διαφορές.

	$columns = [
		"karta",
		"adidos",
		"adapo",
		"adeos",
		"info",
	];

	foreach ($tre as $ipalilos => $parousia) {
		if (!array_key_exists($ipalilos, $pro))
		continue;

		if ($parousia["excuse"])
		continue;

		if ($parousia["info"] &&
			($parousia["info"] !== $pro[$ipalilos]["info"]))
		continue;

		if (adikeologiti_apousia($parousia))
		continue;

		$dif = FALSE;

		foreach ($columns as $column) {
			if ($parousia[$column] === $pro[$ipalilos][$column])
			continue;

			$dif = TRUE;
			break;
		}

		if ($dif)
		continue;

		unset($tre[$ipalilos]);
		unset($pro[$ipalilos]);
	}

	// Αν έχουν μείνει εγγραφές στο τρέχον παρουσιολόγιο, τότε
	// επιστρέφουμε false.

	foreach ($tre as $ipalilos)
	return FALSE;

	// Αν έχουν μείνει εγγραφές στο προηγούμενο παρουσιολόγιο,
	// τότε επιστρέφουμε false.

	foreach ($pro as $ipalilos)
	return FALSE;

	// Δεν έχουν μείνει εγγραφές, πράγμα που σημαίνει ότι όλες οι
	// εγγραφές ήταν ίδιες, οπότε επιχειρούμε να επιστρέφουμε json
	// data που δείχνουν ότι δεν υπάρχουν διαφορές.

	$query = "SELECT `imerominia` FROM `letrak`.`deltio`" .
		" WHERE `kodikos` = " . $proigoumeno;
	$deltio = pandora::first_row($query, MYSQLI_NUM);

	if (!$deltio)
	letrak::fatal_error_json("Αδυναμία ανάκτησης προηγούμενου παρουσιολογίου");

	$imerominia = pandora::date2date($deltio[0], "Y-m-d", "Y-m-d");

	if (!$imerominia)
	letrak::fatal_error_json("Αδυναμία ανάκτησης ημερομηνίας προηγούμενου παρουσιολογίου");

	print '{';
	print '"nodif":1,';
	print '"proigoumeno":' . $proigoumeno . ',';
	print '"imerominia":' . pandora::json_string($imerominia);
	print '}';

	return TRUE;
}

function adikeologiti_apousia($parousia) {
	if ($parousia["meraora"])
	return FALSE;

	if ($parousia["adidos"])
	return FALSE;

	return TRUE;
}
?>
