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
// kodikos	Επιλέγονται παρουσιολόγια παλαιότερα από το παρουσιολόγιο
//		με τον συγκεκριμένο κωδικό. Αν π.χ. η τιμή της παραμέτρου
//		"kodikos" είναι 13768, τότε θα επιστραφούν παρουσιολόγια
//		με κωδικούς μικρότερους από 13768.
//
// imerominia	Επιλέγονται παρουσιολόγια από την συγκεκριμένη ημερομηνία
//		και πίσω.
//		ΠΡΟΣΟΧΗ: Αν έχει δοθεί κριτήριο κωδικού παρουσιολογίου,
//		         τότε τυχόν κριτήριο ημερομηνίας αγνοείται.
//
// ipiresia	Πρόκειται για string που χρησιμοποιείται mask για τον
//		κωδικό υπηρεσίας των παρουσιολογίων που θα επιλεγούν. Αν
//		π.χ. η τιμή παραμέτρου είναι "Β01", τότε θα επιλεγούν
//		παρουσιολόγια με κωδικό υπηρεσίας "B010001", "Β010002",
//		"Β010003", "Β01" κλπ.
// @DESCRIPTION END
//
// @HISTORY BEGIN
// Updated: 2020-04-24
// Created: 2020-04-21
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

if (letrak::oxi_xristis())
lathos("Διαπιστώθηκε ανώνυμη χρήση");

///////////////////////////////////////////////////////////////////////////////@

$query = "SELECT " . letrak::$imerisioPrjcols . " FROM `letrak`.`imerisio`";
$enotiko = " WHERE";

///////////////////////////////////////////////////////////////////////////////@

// Εκκινούμε με το κριτήριο κωδικού παρουσιολογίου.

$x = pandora::parameter_get("kodikos");

if ($x) {
	$query .= $enotiko . " (`kodikos` < " . $x . ")";
	$enotiko = " AND";
}

// Εφόσον δεν έχει δοθεί κριτήριο κωδικού παρουσιολογίου, ελέγχουμε αν έχει
// δοθεί κριτήριο ημερομηνίας. Το κριτήριο ημερομηνίας, εφόσον έχει δοθεί,
// έχει format "D-M-Y", οπότε το μετατρέπουμε στο λογικότερο "Y-M-D".

else {
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
}

///////////////////////////////////////////////////////////////////////////////@

$x = pandora::parameter_get("ipiresia");

if ($x) {
	$query .= $enotiko . " (`ipiresia` LIKE " .
		pandora::sql_string($x . '%') . ")";
	$enotiko = " AND";
}

///////////////////////////////////////////////////////////////////////////////@

// Τα παρουσιολόγια που επιλέγονται επιστρέφονται με αντίστροφη σειρά
// ημερομηνίας (από τα νεότερα προς τα παλαιότερα), κατά υπηρεσία και
// με αντίστροφη σειρά κωδικού.

$query .= " ORDER BY `imerominia` DESC, `ipiresia` ASC, `kodikos` DESC" .
	" LIMIT 12";

///////////////////////////////////////////////////////////////////////////////@

print '{';
print '"imerisioQuery":' . pandora::json_string($query) . ',';
print '"imerisio":[';

$result = pandora::query($query);

$enotiko = '';
while ($row = $result->fetch_array(MYSQLI_ASSOC)) {
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
