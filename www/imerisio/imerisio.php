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
// imerominia	Επιλέγονται παρουσιολόγια από την συγκεκριμένη ημερομηνία
//		και πίσω.
//
// ipiresia	Πρόκειται για string που χρησιμοποιείται ως mask για τον
//		κωδικό υπηρεσίας των παρουσιολογίων που θα επιλεγούν. Αν
//		π.χ. η τιμή παραμέτρου είναι "Β01", τότε θα επιλεγούν
//		παρουσιολόγια με κωδικό υπηρεσίας "B010001", "Β010002",
//		"Β010003", "Β01" κλπ.
// @DESCRIPTION END
//
// @HISTORY BEGIN
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

if (letrak::oxi_xristis())
lathos("Διαπιστώθηκε ανώνυμη χρήση");

///////////////////////////////////////////////////////////////////////////////@

$query = "SELECT " . letrak::$imerisioPrjcols . " FROM `letrak`.`imerisio`";
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
" `prosapo` DESC," .
" `kodikos` DESC";

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
	$count++;

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

print '],';
print '"error":""}';
exit(0);

///////////////////////////////////////////////////////////////////////////////@

function lathos($s) {
	print '{"error":' . pandora::json_string($s) . "}";
	exit(0);
}

function lathos_imerominia($s) {
	lathos($s . ": λανθασμένη ημερομηνία");
}

?>
