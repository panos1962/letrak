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
// www/deltio/deltio.php —— Πρόγραμμα επιλογής παρουσιολογίων
// @FILE END
//
// @DESCRIPTION BEGIN
// Το παρόν πρόγραμμα καλείται από τη σελίδα των παρουσιολογίων με σκοπό την
// επιλογή και την επιστροφή παρουσιολογίων με βάση τα παρακάτω κριτήρια
// επιλογής:
//
// ipiresia	Πρόκειται για string που χρησιμοποιείται ως mask κωδικού
//		υπηρεσίας των παρουσιολογίων που θα επιλεγούν. Αν π.χ. η
//		η παράμετρος έχει τιμή "Β01", θα επιλεγούν παρουσιολόγια
//		με κωδικό υπηρεσίας "B010001", "Β010002", "Β01" κλπ.
//
// imerominia	Επιλέγονται παρουσιολόγια από την συγκεκριμένη ημερομηνία
//		και πίσω.
//
// eos		Επιλέγονται όλα τα παρουσιολόγια μέχρι και την συγκεκριμένη
//		ημερομηνία.
//
// prosapo	Επιλέγονται παρουσιολόγια προσέλευσης, αποχώρησης ή όλα,
//		ανάλογα με το αν η τιμή της παραμέτρου είναι "ΠΡΟΣΕΛΕΥΣΗ",
//		"ΑΠΟΧΩΡΗΣΗ" ή κενό αντίστοιχα.
//
// katastasi	Επιλέγονται παρουσιολόγια ανάλογα με την κατάσταση στην
//		οποία βρίσκονται οσον αφορά τη σύνταξη, την κύρωση και
//		και την επικύρωση.
//
// ipalilos	Κωδικός υπαλλήλου. Επιλέγονται μόνο παρουσιολόγια στα οποία
//		συμμετέχει ο συγκεκριμένος υπάλληλος.
//
// Το πρόγραμμα επιλέγει και επιστρέφει τα παρουσιολόγια με αντίστροφη σειρά
// ημερομηνίας, κατά υπηρεσία, κατά είδος (πρώτα αποχώρηση, μετά προσέλευση)
// και, τέλος, με αντίστροφη σειρά κωδικού. Με βάση αυτή τη σειρά επιλέγονται
// και επιστρέφονται τα παρουσιολόγια που ταιριάζουν με τα κριτήρια επιλογής,
// αλλά υπάρχει όριο στο πλήθος των παρουσιολογίων που θα επιλεγούν. Ωστόσο
// δεν επιλέγεται ποτέ μέρος των παρουσιολογίων μιας ημερομηνίας· αν δηλαδή
// επιλεγεί έστω και ένα παρουσιολόγιο μιας ημερομηνίας με βάση τα κριτήρια
// που έχουν δοθεί και το μέγιστο πλήθος επιλεγομένων παρουσιολογίων, τότε
// θα επιλεγούν και τα υπόλοιπα παρουσιολόγια της συγκεκριμένης ημερομηνίας.
// Αυτό σημαίνει ότι το μέγιστο πλήθος επιλογμένων παρουσιολογίων αποτελεί
// ένα είδος «φρένου» στην επιλογή, αλλά τα παρουσιολόγια που θα επιλεγούν
// μπορεί να είναι κατά τι περισσότερα από το όριο που έχει καθοριστεί.
// @DESCRIPTION END
//
// @HISTORY BEGIN
// Updated: 2020-08-01
// Updated: 2020-06-11
// Updated: 2020-05-13
// Updated: 2020-05-06
// Updated: 2020-05-05
// Updated: 2020-04-28
// Updated: 2020-04-27
// Updated: 2020-04-26
// Updated: 2020-04-25
// Updated: 2020-04-24
// Created: 2020-04-21
// @HISTORY END
//
// @END
//
///////////////////////////////////////////////////////////////////////////////@

define("MIN_COUNT", 12);

require_once("../../local/conf.php");
require_once(LETRAK_BASEDIR . "/www/lib/letrak.php");

pandora::
header_json()::
session_init()::
database();

$prosvasi = letrak::prosvasi_check();
$ipalilos = pandora::parameter_get("ipalilos");

if ($ipalilos && letrak::ipalilos_invalid_kodikos($ipalilos))
letrak::fatal_error_json("Μη αποδεκτό κριτήριο αριθμού μητρώου υπαλλήλου");

///////////////////////////////////////////////////////////////////////////////@

$query = "SELECT * FROM `letrak`.`deltio`";
$enotiko = " WHERE";

///////////////////////////////////////////////////////////////////////////////@

// Ελέγχουμε τα κριτήρια ημερομηνίας τα οποία, εφόσον έχουν καθοριστεί,
// πρέπει να έχουν δοθεί με format "d-m-Y".

$x = pandora::parameter_get("imerominia");

if ($x) {
	$apo = DateTime::createFromFormat("d-m-Y", $x);

	if ($apo === FALSE)
	lathos_imerominia($x);
}

else
$apo = FALSE;

$x = pandora::parameter_get("eos");

if ($x) {
	$eos = DateTime::createFromFormat("d-m-Y", $x);

	if ($eos === FALSE)
	lathos_imerominia($x);
}

else
$eos = FALSE;

// Αν έχει δοθεί ημερομηνία αρχής ΚΑΙ ημερομηνία τέλους, τότε θα πρέπει
// η ημερομηνία τέλους να είναι μικρότερη από την ημερομηνία αρχής, καθώς
// τα δελτία επιστρέφονται με αντίστροφη ημερολογιακή σειρά. Είναι, όμως,
// πολύ πθανό -και λογικό- ο χρήστης να έχει καθορίσει τις ημερομηνίες με
// αντίστροφη σειρά, επομένως σ' αυτό το σημείο κάνουμε έλεγχο και βάζουμε
// τάξη στις ημερομηνίες.

if ($apo && $eos && ($apo < $eos)) {
	$x = $apo;
	$apo = $eos;
	$eos = $x;
}

if ($apo) {
	$query .= $enotiko . " (`imerominia` <= " .
		pandora::sql_string($apo->format("Y-m-d")) . ")";
	$enotiko = " AND";
}

if ($eos) {
	$query .= $enotiko . " (`imerominia` >= " .
		pandora::sql_string($eos->format("Y-m-d")) . ")";
	$enotiko = " AND";
}

///////////////////////////////////////////////////////////////////////////////@

// Το κριτήριο προσέλευσης/αποχώρησης παίρνει τιμές "ΠΡΟΣΕΛΕΥΣΗ", "ΑΠΟΧΩΡΗΣΗ",
// ή κενό.

$x = pandora::parameter_get("prosapo");

if ($x) {
	switch ($x) {
	case LETRAK_DELTIO_PROSAPO_PROSELEFSI:
	case LETRAK_DELTIO_PROSAPO_APOXORISI:
		$query .= $enotiko . " (`prosapo` = " .
			pandora::sql_string($x) . ")";
		$enotiko = " AND";
		break;
	case LETRAK_DELTIO_PROSAPO_PROTIPO:
		$query .= $enotiko . " (`prosapo` IS NULL)";
		$enotiko = " AND";
		break;
	default:
		lathos("Μη αποδεκτό κριτήριο προσέλευσης/αποχώρησης");
	}
}

else {
	$query .= $enotiko . " (`prosapo` IS NOT NULL)";
	$enotiko = " AND";
}

///////////////////////////////////////////////////////////////////////////////@

$x = pandora::parameter_get("katastasi");

if ($x) {
	switch ($x) {
	case LETRAK_DELTIO_KATASTASI_EKREMES:
	case LETRAK_DELTIO_KATASTASI_ANIPOGRAFO:
	case LETRAK_DELTIO_KATASTASI_KIROMENO:
	case LETRAK_DELTIO_KATASTASI_EPIKIROMENO:
		break;
	default:
		lathos("Μη αποδεκτό κριτήριο κατάστασης");
	}

	$query .= $enotiko . " (`katastasi` = " .
		pandora::sql_string($x) . ")";
	$enotiko = " AND";
}

///////////////////////////////////////////////////////////////////////////////@

// Αν έχει δοθεί μάσκα κωδικού υπηρεσίας, τότε επιλέγουμε παρουσιολόγια που
// ταιριάζουν με τη δοθείσα μάσκα.

$x = pandora::parameter_get("ipiresia");

if ($x) {
	$query .= $enotiko . " (`ipiresia` LIKE " .
		pandora::sql_string($x . '%') . ")";
	$enotiko = " AND";
}

///////////////////////////////////////////////////////////////////////////////@

$query .= " ORDER BY" .
	" `imerominia` DESC," .
	" `ipiresia`," .
	" `perigrafi`," .
	" `prosapo` DESC," .
	" `kodikos` DESC";

///////////////////////////////////////////////////////////////////////////////@

print '{';
print '"deltioQuery":' . pandora::json_string($query) . ',';
print '"deltio":[';

// Θα επιλέξουμε παρουσιολόγια με βάση τα κριτήρια που έχουν δοθεί, αλλά θα
// φροντίσουμε να μην αφήσουμε υπόλοιπα σε κάποια ημερομηνία.

unset($imerominia_last);
$enotiko = "";
$count = 0;

$result = pandora::query($query);
while ($row = $result->fetch_array(MYSQLI_ASSOC)) {
	$deltio = new Deltio($row);

	if ($prosvasi->oxi_prosvasi_deltio($deltio))
	continue;

	if ($ipalilos && $deltio->asxetos_ipalilos($ipalilos))
	continue;

	$imerominia = $deltio->imerominia_get();

	if (!$imerominia)
	continue;

	if ($eos) {
		print_deltio($enotiko, $deltio);
		continue;
	}

	$count++;

	// Αν είναι το πρώτο παρουσιολόγιο που επιλέγουμε, κρατάμε την
	// ημερομηνία του προκειμένου να επιλέξουμε όλα τα παρουσιολόγια
	// αυτής της ημερομηνίας.

	if (!isset($imerominia_last))
	$imerominia_last = $imerominia;

	// Αν το ανά χείρας παρουσιολόγιο έχει άλλη ημερομηνία από τα
	// προηγούμενα που επιλέχθηκαν μέχρι στιγμής, τότε ελέγχουμε
	// το πλήθος των μέχρι τούδε επιλεγμένων παρουσιολογίων. Αν
	// το πλήθος αυτό είναι μικρό τότε ανανεώνουμε την ημερομηνία
	// για να επιλέξουμε άλλη μια παρτίδα κοκ.

	elseif ($imerominia != $imerominia_last) {
		if ($count > MIN_COUNT) {
			$result->free();
			break;
		}

		$imerominia_last = $imerominia;
	}

	print_deltio($enotiko, $deltio);
}

print ']}';
exit(0);

///////////////////////////////////////////////////////////////////////////////@

function print_deltio(&$enotiko, $deltio) {
	print $enotiko . $deltio->json_economy();
	$enotiko = ",";
}

function lathos($s) {
	letrak::fatal_error_json($s);
}

function lathos_imerominia($s) {
	lathos($s . ": λανθασμένη ημερομηνία");
}

?>
