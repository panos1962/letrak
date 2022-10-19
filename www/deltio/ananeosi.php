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
// Το παρόν πρόγραμμα καλείται από τη βασική σελίδα διαχείρισης δελτίων
// και σκοπό έχει το φρεσκάρισμα της κατάστασης των δελτίων που υπάρχουν
// στη σελίδα. Το πρόγραμμα δέχεται ως input ένα array "dlist" που περιέχει
// τους κωδικούς των δελτίων της βασικής σελίδας διαχείρισης δελτίων, και
// επιστρέφει την ίδια λίστα με την τρέχουσα κατάσταση των δελτίων αυτών.
// Για κάθε δελτίο επιστρέφεται ένα string της μορφής:
//
//	ΚΑΤΑΣΤΑΣΗ[:ΥΠΟΓΡΑΦΗ]
//
// όπου "ΚΑΤΑΣΤΑΣΗ" μπορεί να είναι:
//
//	ΕΚΚΡΕΜΕΣ	Το δελτίο δεν έχει κυρωθεί από τον συντάκτη.
//			Θυμίζουμε ότι συντάκτης είναι ο πρώτος υπογράφων.
//
//	ΑΝΥΠΟΓΡΑΦΟ	Το δελτίο έχει κυρωθεί από τον συντάκτη, αλλά
//			εκκρεμούν κυρώσεις από τους υπόλοιπους υπογράφοντες.
//
//	ΚΥΡΩΜΕΝΟ	Το δελτίο έχει κυρωθεί από όλους τους υπογράφοντες.
//
//	ΕΠΙΚΥΡΩΜΕΝΟ	Το δελτίο έχει υπογραφεί από όλους τους υπογράφοντες
//			και έχει επικυρωθεί από εντεταλμένο υπάλληλο της
//			αρμόδιας Διεύθυνσης Προσωπικού.
//
// Το επίθεμα ":ΥΠΟΓΡΑΦΗ" εφόσον υπάρχει δείχνει αν ο υπάλληλος που τρέχει
// την εφαρμογή συμμετέχει ως υπογράφων και σ' αυτήν την περίπτωση μπορεί
// να είναι:
//
//	1	Ο υπάλληλος έχει σειρά να κυρώσει το δελτίο.
//
//	2	Ο υπάλληλος έχει ήδη κυρώσει αλλά εκκρεμούν και επιπλέον
//		κυρώσεις από επόμενους υπογράφοντες.
//
//	3	Ο υπάλληλος είναι υπογράφων αλλά προηγούνται υπογράφοντες
//		που δεν έχουν κυρώσει το δελτίο.
//
// Αν το επίθεμα της υπογραφής δεν υπάρχει, τότε σημαίνει ότι ο υπάλληλος
// που τρέχει την εφαρμογή δεν εμφανίζεται ως υπογράφων στο δελτίο.
// @DESCRIPTION END
//
// @HISTORY BEGIN
// Updated: 2020-10-19
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

// Η function "ipografi" δέχεται ως παραμέτρους τον κωδικό δελτίου και τον
// κωδικό του υπαλλήλου που τρέχει την εφαρμογή και επιστρέφει ένα string
// της μορφής:
//
//	:1	ο υπάλληλος έχει σειρά να υπογράψει
//
//	:2	ο υπάλληλος έχει ήδη υπογράψει
//
//	:3	ο υπάλληλος πρέπει να υπογράψει αλλά δεν είναι ακόμη
//		η σειρά του.
//
// Αν ο εν λόγω υπάλληλος δεν συμμετέχει ως υπογράφων στο δελτίο, τότε
// επιστρέφεται κενό string.
//
// Το string που επιστρέφεται από την function "ipografi" «κολλάει» στην
// κατάσταση του δελτίου, π.χ. αν κάποιο δελτίο έχει κατάσταση "ΕΚΚΡΕΜΕΣ"
// και ο υπάλληλος που τρέχει την εφαρμογή είναι ο αμέσως επόμενος υπογράφων,
// τότε η κατάσταση θα γίνει "ΕΚΚΡΕΜΕΣ:1", ενώ αν ο υπάλληλος έχει ήδη
// υπογράψει, τότε η κατάσταση θα γίνει "ΕΚΚΡΕΜΕΣ:2" κοκ. Αν ο υπάλληλος
// δεν συμμετέχει ως υπογράφων, τότε η κατάσταση θα παραμείνει "ΕΚΚΡΕΜΕΣ".

function ipografi($deltio, $ipalilos) {
	$query = "SELECT `armodios`, `checkok` FROM `letrak`.`ipografi`" .
		" WHERE `deltio` = " . $deltio . " ORDER BY `taxinomisi`";
	$result = pandora::query($query);

	$armodios = [];
	$checkok = [];

	for ($count = 0; $row = $result->fetch_array(MYSQLI_NUM); $count++) {
		$armodios[$count] = $row[0];
		$checkok[$count] = $row[1];
	}

	$result->close();

	// Διατρέχουμε τους υπογράφοντες προσπαθώντας να εντοπίσουμε αν
	// ο υπάλληλος που τρέχει την εφαρμογή συμμετέχει ως υπογράφων.

	// Η μεταβλητή "simetoxi" θα δείχνει την τελευταία θέση στην οποία
	// εμφανίζεται ο υπάλληλος ως υπογράφων, αλλιώς θα παραμείνει NULL.

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

	// Η μεταβλητή "epomenos" θα δείχνει τη θέση του υπαλλήλου που έχει
	// σειρά να υπογράψει, ενώ αν έχουν υπογράψει όλοι οι υπάλληλοι θα
	// πραμείνει NULL.

	$epomenos = NULL;

	for ($i = 0; $i < $count; $i++) {
		if (!$checkok[$i]) {
			$epomenos = $i;
			break;
		}
	}

	// Αν δεν εντοπίστηκε υπογράφων που έχει σειρά να υπογράψει, τότε
	// δεν επιστρέφουμε κάτι.

	if ($epomenos === NULL)
	return "";

	// Αν ο υπογράφων που έχει σειρά να υπογράψει είναι ο υπάλληλος που
	// τρέχει την εφαρμογή, τότε επιστρέφουμε 1 (κόκκινο).

	if ($armodios[$epomenos] == $ipalilos)
	return ":1";	// κόκκινο

	// Αν ο υπάλληλος που τρέχει την εφαρμογή εμφανίζεται τελευταία φορά
	// ως υπογράφων πριν τον υπογράφοντα που έχει σειρά να υπογράψει,
	// τότε σημαίνει ότι έχει ήδη κάνει το καθήκον του ως υπογράφων
	// και επιστρέφουμε 2 (πράσινο).

	if ($simetoxi < $epomenos)
	return ":2";	// πράσινο

	// Αν ο υπάλληλος που τρέχει την εφαρμογή εμφανίζεται τελευταία φορά
	// ως υπογράφων μετά τον υπογράφοντα που έχει σειρά να υπογράψει,
	// τότε σημαίνει ότι θα πρέπει να υπογράψει αλλά προηγείται άλλος,
	// οπότε επιστρέφουμε 3 (κίτρινο).

	if ($simetoxi > $epomenos)
	return ":3";	// κυανό

	// Βρισκόμαστε στην περίπτωση που ο υπάλληλος που έχει σειρά να
	// υπογράψει εμφανίζεται τελευταία φορά στη θέση του υπαλλήλου
	// που έχει σειρά να υπογράψει. Αυτήν την περίπτωση μάλλον την
	// έχουμε ήδη «πιάσει», αλλά μπορεί και όχι αν ο υπάλληλος
	// συμμετέχει περισσότερες από μία φορές, οπότε επιστρέφουμε
	// και πάλι 1 (κοκκινο), που σημαίνει ότι είναι σειρά του να
	// υπογράψει.

	return ":1";	// κόκκινο
}
?>
