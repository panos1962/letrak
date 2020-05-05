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
// www/imerisio/imerisio.php —— Πρόγραμμα επιλογής παρουσιολογίων
// @FILE END
//
// @DESCRIPTION BEGIN
// Το παρόν πρόγραμμα καλείται από τη σελίδα των παρουσιολογίων με σκοπό την
// επιλογή και την επιστροφή παρουσιολογίων με βάση τα παρακάτω κριτήρια
// επιλογής:
//
// ipiresia	Πρόκειται για string που χρησιμοποιείται ως mask για τον
//		κωδικό υπηρεσίας των παρουσιολογίων που θα επιλεγούν. Αν
//		π.χ. η τιμή παραμέτρου είναι "Β01", τότε θα επιλεγούν
//		παρουσιολόγια με κωδικό υπηρεσίας "B010001", "Β010002",
//		"Β010003", "Β01" κλπ.
//
// imerominia	Επιλέγονται παρουσιολόγια από την συγκεκριμένη ημερομηνία
//		και πίσω.
//
// prosapo	Επιλέγονται παρουσιολόγια προσέλευσης, αποχώρησης ή όλα,
//		ανάλογα με το αν η τιμή της παραμέτρου είναι "ΠΡΟΣΕΛΕΥΣΗ",
//		"ΑΠΟΧΩΡΗΣΗ" ή κενό αντίστοιχα.
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

$prosvasi = letrak::prosvasi_get();

if ($prosvasi->oxi_ipalilos())
lathos("Διαπιστώθηκε ανώνυμη χρήση");

$ipalilos = pandora::parameter_get("ipalilos");

if ($ipalilos && letrak::ipalilos_invalid_kodikos($ipalilos))
lathos($ipalilos . ": λανθασμένο κριτήριο αριθμού μητρώου υπαλλήλου");

///////////////////////////////////////////////////////////////////////////////@

$query = "SELECT " . LETRAK_IMERISIO_PROJECTION_COLUMNS .
	" FROM `letrak`.`imerisio`";
$enotiko = " WHERE";

///////////////////////////////////////////////////////////////////////////////@

// Το κριτήριο ημερομηνίας έχει format "D-M-Y", οπότε το μετατρέπουμε στο
// λογικότερο "Y-M-D".

$x = pandora::parameter_get("imerominia");

if ($x) {
	$d = DateTime::createFromFormat("d-m-Y", $x);

	if ($d === FALSE)
	lathos_imerominia($x);

	$d = $d->format("Y-m-d");

	if ($d === FALSE)
	lathos_imerominia($x);

	$query .= $enotiko . " (`imerominia` <= " .
		pandora::sql_string($d) . ")";
	$enotiko = " AND";
}

///////////////////////////////////////////////////////////////////////////////@

// Το κριτήριο προσέλευσης/αποχώρησης παίρνει τιμές "ΠΡΟΣΕΛΕΥΣΗ", "ΑΠΟΧΩΡΗΣΗ",
// ή κενό.

$x = pandora::parameter_get("prosapo");

switch ($x) {
case 'ΠΡΟΣΕΛΕΥΣΗ':
case 'ΑΠΟΧΩΡΗΣΗ':
	$query .= $enotiko . " (`prosapo` = " . pandora::sql_string($x) . ")";
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

$query .= " ORDER BY `i` DESC, `r`, `o` DESC, `k`";

///////////////////////////////////////////////////////////////////////////////@

print '{';
print '"imerisioQuery":' . pandora::json_string($query) . ',';
print '"imerisio":[';

// Θα επιλέξουμε παρουσιολόγια με βάση τα κριτήρια που έχουν δοθεί, αλλά θα
// φροντίσουμε να μην αφήσουμε υπόλοιπα σε κάποια ημερομηνία.

unset($imerominia);
$enotiko = '';
$count = 0;

$result = pandora::query($query);
while ($row = $result->fetch_array(MYSQLI_ASSOC)) {
	if (oxi_prosvasimo($row, $prosvasi))
	continue;

	if (oxi_ipalilos($row, $ipalilos))
	continue;

	$count++;
	pandora::null_purge($row);

	// Αν είναι το πρώτο παρουσιολόγιο που επιλέγουμε, κρατάμε την
	// ημερομηνία του προκειμένου να επιλέξουμε όλα τα παρουσιολόγια
	// αυτής της ημερομηνίας.

	if (!isset($imerominia))
	$imerominia = $row["i"];

	// Αν το ανά χείρας παρουσιολόγιο έχει άλλη ημερομηνία από τα
	// προηγούμενα που επιλέχθηκαν μέχρι στιγμής, τότε ελέγχουμε
	// το πλήθος των μέχρι τούδε επιλεγμένων παρουσιολογίων. Αν
	// το πλήθος αυτό είναι μικρό τότε ανανεώνουμε την ημερομηνία
	// για να επιλέξουμε άλλη μια παρτίδα κοκ.

	else if ($row["i"] != $imerominia) {
		if ($count > MIN_COUNT) {
			$result->free();
			break;
		}

		$imerominia = $row["i"];
	}

	print $enotiko . pandora::json_string($row);
	$enotiko = ",";
}

print ']}';
exit(0);

///////////////////////////////////////////////////////////////////////////////@

function is_prosvasimo($imerisio, $prosvasi) {
	if ($prosvasi->is_prosvasi_ipiresia($imerisio["r"]))
	return TRUE;

	$query = "SELECT `ipalilos` FROM `letrak`.`parousia`" .
		" WHERE (`imerisio` = " . $imerisio["k"] . ")" .
		" AND (`ipalilos` = " . $prosvasi->ipalilos_get() . ")";
	return pandora::first_row($query, MYSQLI_NUM);
}

function oxi_prosvasimo($imerisio, $prosvasi) {
	return !is_prosvasimo($imerisio, $prosvasi);
}

function is_ipalilos($imerisio, $ipalilos) {
	if (!$ipalilos)
	return TRUE;

	$query = "SELECT `ipalilos` FROM `letrak`.`parousia`" .
		" WHERE (`imerisio` = " . $imerisio["k"] . ")" .
		" AND (`ipalilos` = " . $ipalilos . ")";
	return pandora::first_row($query, MYSQLI_NUM);
}

function oxi_ipalilos($imerisio, $ipalilos) {
	return !is_ipalilos($imerisio, $ipalilos);
}

function lathos($s) {
	print '{"error":' . pandora::json_string($s) . "}";
	exit(0);
}

function lathos_imerominia($s) {
	lathos($s . ": λανθασμένη ημερομηνία");
}

?>
