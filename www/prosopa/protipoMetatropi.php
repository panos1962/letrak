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
// www/prosopa/protipoMetatropi.php —— Μετατροπή δελτίου σε πρότυπο
// @FILE END
//
// @DESCRIPTION BEGIN
// Το παρόν πρόγραμμα χρησιμοποιείται για τη δημιουργία προτύπων δελτίων.
// Τα πρότυπα δελτία χρησιμοποιούνται κυρίως ως ομάδες εργαζομένων και με
// βάση τα πρότυπα δελτία μπορούμε να δημιουργούμε άλλα δελτία, π.χ. αν
// έχουμε μια ομάδα υπαλλήλων που χρησιμοποιούμε συνήθως στη βάρδια του
// Σαββάτου, μπορούμε να δημιουργήσουμε ένα δελτίο (ως κλώνο κάποιου άλλου
// δελτίου) και να αφήσουμε στο νέο δελτίο μόνο τους υπαλλήλους που αποτελούν
// τη βάρδια του Σαββάτου. Κατόπιν μετατρέπουμε το νέο δελτίο σε πρότυπο και
// από το σημείο αυτό και μετά μπορούμε να το χρησιμοποιούμε ως πρότυπο για
// να δημιουργούμε τα παρουσιολόγια του Σαββάτου. Αν αλλάξει κάποια στιγμή
// η σύνθεση της βάρδιας, μπορούμε να το διορθώσουμε και να συνεχίσουμε να
// το χρησιμοποιούμε ως πρότυπο με τη νέα σύνθεση.
//
// Τα πρότυπα δελτία δεν έχουν συμπληρωμένο είδος, δηλαδή δεν είναι ούτε
// δελτία προσέλευσης, ούτε δελτία αποχώρησης. Επίσης, τα πρότυπα δελτία
// είναι πάντα εναρκτήρια, δηλαδή δεν φαίνεται από ποιο παρουσιολόγιο έχουν
// προκύψει κατά τη δημιουργία τους.
// @DESCRIPTION END
//
// @HISTORY BEGIN
// Created: 2020-07-05
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

$orario = orario_get();
deltio_check($deltio_kodikos);

///////////////////////////////////////////////////////////////////////////////@

// Το δελτίο είναι το τελευταίο σε σειρά παρουσιολογίων και επομένως μπορεί
// να μετατραπεί σε πρότυπο. Σ' αυτήν την περίπτωση θα πρέπει να αλλάξουμε
// στοιχεία τόσο στο ίδιο το δελτίο όσο και στις εγγραφές παρουσίας του εν
// λόγω δελτίου.

pandora::autocommit(FALSE);

// Καθαρίζουμε το είδος του δελτίου, οπότε το δελτίο δεν θα είναι ούτε δελτίο
// προσέλευσης, ούτε δελτίο αποχώρησης, και καθιστούμε το δελτίο εναρκτήριο
// ώστε να βγει εκτός οποιασδήποτε σειράς δελτίων.

$query = "UPDATE `letrak`.`deltio`" .
	" SET `prosapo` = NULL, `protipo` = NULL" .
	" WHERE `kodikos` = " . $deltio_kodikos;
pandora::query($query);

if (pandora::affected_rows() !== 1) {
	pandora::rollback();
	lathos("Το δελτίο είναι ήδη πρότυπο");
}

// Έχουν αλλάξει τα στοιχεία του δελτίου και είναι ώρα να σαρώσουμε τις
// εγγραφές παρουσίας του εν λόγω δελτίου.

$query = "UPDATE `letrak`.`parousia` SET `meraora` = NULL," .
	" `adidos` = NULL, `adapo` = NULL, `adeos` = NULL," .
	" `excuse` = NULL";

// Πειράζουμε τα ωράρια μόνον εφόσον έχει δοθεί default ωράριο από τη φόρμα
// μετατροπής δελτίου σε πρότυπο.

if (isset($orario))
$query .= ", `orario` = " . pandora::sql_string($orario);

$query .= " WHERE `deltio` = " . $deltio_kodikos;
pandora::query($query);

pandora::commit();
exit(0);

// Η function "orario_get" ελέγχει αν έχει δοθεί παράμετρος ωραρίου.
// Η παράμετρος ωραρίου καθορίζει το default ωράριο για όλους τους
// υπαλλήλους που εμπλέκονται στο δελτίο.
//
// Η function επιστρέφει το ωράριο ως string στην περίπτωση που έχει
// δοθεί, αλλιώς επιστρέφει null. Αν έχει δοθεί μη αποδεκτό ωράριο,
// τότε το πρόγραμμα διακόπτεται και επιστρέφεται μήνυμα λάθους.

function orario_get() {
	$orario = pandora::parameter_get("orario");

	if (!isset($orario))
	return NULL;

	if (!$orario)
	return NULL;

	$x = new Orario($orario);

	if ($x->oxi_orario())
	lathos($orario . ": μη αποδεκτό ωράριο");

	return $x->to_string();
}

// Η function "deltio_check" ελέγχει αν το δελτίο έχει ήδη χρησιμοποιηθεί ως
// πρότυπο μεταγενέστερου δελτίου. Σε αυτήν την περίπτωση το δελτίο δεν μπορεί
// να μετατραπεί σε πρότυπο, καθώς έτσι θα «σπάσει» η σειρά των δελτίων.

function deltio_check($deltio) {
	$query = "SELECT `kodikos` FROM `letrak`.`deltio`" .
		" WHERE `protipo` = " . $deltio;

	if (pandora::first_row($query))
	lathos("Το δελτίο έχει ήδη χρησιμοποιηθεί ως πρότυπο άλλου δελτίου");
}

function lathos($s) {
	print $s;
	exit(0);
}
?>
