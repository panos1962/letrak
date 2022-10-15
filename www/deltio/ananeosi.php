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
// www/deltio/ananeosi.php —— Ανανέωση κατάστασης παρουσιολογίων
// @FILE END
//
// @DESCRIPTION BEGIN
// Το παρόν πρόγραμμα καλείται από τη βασική σελίδα διαχείρισης
// παρουσιολογίων και σκοπό έχει το φρεσκάρισμα των δεδομένων και
// των μεταδεδομένων των παρουσιολογίων που υπάρχουν στη σελίδα.
// @DESCRIPTION END
//
// @HISTORY BEGIN
// Updated: 2020-10-15
// Updated: 2020-05-18
// Created: 2020-05-13
// @HISTORY END
//
// @END
//
///////////////////////////////////////////////////////////////////////////////@

require_once("../../local/conf.php");
require_once(LETRAK_BASEDIR . "/www/lib/letrak.php");

pandora::
header_data()::
session_init()::
database();

$prosvasi = letrak::prosvasi_get();

if ($prosvasi->oxi_ipalilos())
letrak::fatal_error_json("Διαπιστώθηκε ανώνυμη χρήση");

$dlist = pandora::parameter_get("dlist");

if (!is_array($dlist))
letrak::fatal_error_json("Μη αποδεκτή λίστα δελτίων");

$ipalilos = $prosvasi->ipalilos_get();
$tsild = array();

foreach ($dlist as $kodikos) {
	$deltio = (new Deltio())->from_database($kodikos);

	switch ($katastasi = $deltio->katastasi_get()) {
	case LETRAK_DELTIO_KATASTASI_EKREMES:
	case LETRAK_DELTIO_KATASTASI_ANIPOGRAFO:
		$katastasi .= ipografi($kodikos, $ipalilos);
		break;
	}

	$tsild[$kodikos] = $katastasi;
}

print '{';
print '"dlist":' . pandora::json_string($tsild);
print '}';

function ipografi($deltio, $ipalilos) {
	$query = "SELECT `armodios`, `checkok`" .
		" FROM `letrak`.`ipografi`" .
		" WHERE `deltio` = " . $deltio .
		" ORDER BY `taxinomisi`";
	$result = pandora::query($query);

	$armodios = [];
	$checkok = [];

	$count = 0;

	for ($count = 0; $row = $result->fetch_array(MYSQLI_NUM); $count++) {
		$armodios[$count] = $row[0];
		$checkok[$count] = $row[1];
	}

	$result->close();

	// Διατρέχουμε τους υπογράφοντες προσπαθώντας να εντοπίσουμε αν
	// ο υπάλληλος που τρέχει την εφαρμογή συμμετέχει ως υπογράφων.

	$simetoxi = NULL;

	for ($i = 0; $i < $count; $i++) {
		if ($armodios[$i] == $ipalilos)
		$simetoxi = $i;
	}

	// Αν ο υπάλληλος που τρέχει την εφαρμογή δεν συμμετέχει ως υπογράφων,
	// τότε δεν επιστρέφουμε κάτι.

	if ($simetoxi === NULL)
	return "";

	// Διατρέχουμε τους υπογράφοντες προσπαθώντας να εντοπίσουμε τον
	// πρώτο υπογράφοντα που δεν έχει υπογράψει.

	$epomenos = NULL;

	for ($i = 0; $i < $count; $i++) {
		if ($checkok[$i])
		continue;

		$epomenos = $i;
		break;
	}

	// Αν δεν εντοπίστηκε υπογράφων που έχει σειρά να υπογράψει, τότε
	// δεν επιστρέφουμε κάτι.

	if ($epomenos === NULL)
	return "";

	// Αν ο υπογράφων που έχει σειρά να υπογράψει είναι ο υπάλληλος που
	// τρέχει την εφαρμογή, τότε επιστρέφουμε 1 (κόκκινο).

	if ($armodios[$epomenos] == $ipalilos)
	return ":1";

	// Αν ο υπάλληλος που τρέχει την εφαρμογή εμφανίζεται τελευταία φορά
	// ως υπογράφων πριν τον υπογράφοντα που έχει σειρά να υπογράψει,
	// τότε σημαίνει ότι έχει ήδη κάνει το καθήκον του ως υπογράφων
	// και επιστρέφουμε 2 (πράσινο).

	if ($simetoxi < $epomenos)
	return ":2";

	// Αν ο υπάλληλος που τρέχει την εφαρμογή εμφανίζεται τελευταία φορά
	// ως υπογράφων μετά τον υπογράφοντα που έχει σειρά να υπογράψει,
	// τότε σημαίνει ότι θα πρέπει να υπογράψει αλλά προηγείται άλλος,
	// οπότε επιστρέφουμε 3 (κίτρινο).

	if ($simetoxi > $epomenos)
	return ":3";

	// Βρισκόμαστε στην περίπτωση που ο υπάλληλος που έχει σειρά να
	// υπογράψει εμφανίζεται τελευταία φορά στη θέση του υπαλλήλου
	// που έχει σειρά να υπογράψει. Αυτήν την περίπτωση μάλλον την
	// έχουμε ήδη «πιάσει», αλλά μπορεί και όχι αν ο υπάλληλος
	// συμμετέχει περισσότερες από μία φορές, οπότε επιστρέφουμε
	// και πάλι 1 (κοκκινο), που σημαίνει ότι είναι σειρά του να
	// υπογράψει.

	return ":1";
}
?>
