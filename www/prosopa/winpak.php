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
// www/prosopa/winpak.php —— Αναζήτηση καταγραφών από σύστημα καταγραφής
// @FILE END
//
// @DESCRIPTION BEGIN
// Το παρόν πρόγραμμα δέχεται μια λίστα από αριθμούς μητρώου εργαζομένων που
// συμμετέχουν σε κάποιο δελτίο, μαζί με τα ωράριά τους και τις κάρτες τους,
// όπως αυτά είναι συμπληρωμένα στο συγκεκριμένο δελτίο, και επιστρέφει τις
// καταγραφές από το σύστημα καταγραφής χρονικών δεδομένων εισόδου/εξόδου.
// Οι καταγραφές που επιστρέφονται είναι οι πλέον «κοντινές» στην προβλεπόμενη
// από το ωράριο ώρα, ανάλογα με το είδος του δελτίου. Πιο συγκεκριμένα αν το
// δελτίο είναι δελτίο προσέλευσης, επιστρέφεται η πιο κοντινή ώρα στην ώρα
// προσέλευσης του ωραρίου, αλλιώς επιστρέφεται η πιο κοντινή ώρα στην ώρα
// αποχώρησης.
//
// ΣΗΜΑΝΤΙΚΟ
// ‾‾‾‾‾‾‾‾‾
// Παράλληλα με την επιστροφή των δεδομένων, το πρόγραμμα ενημερώνει την
// database με τα ευρήματα. Με άλλα λόγια, οι καταγραφές που αφορούν στον
// συγκεκριμένο εργαζόμενο για το συγκεκριμένο δελτίο, αντιγράφονται στην
// στον πίνακα "parousia" της database "letrak".
// @DESCRIPTION END
//
// @HISTORY BEGIN
// Updated: 2021-03-08
// Updated: 2020-05-09
// Created: 2020-05-08
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

$kodikos = pandora::parameter_get("deltio");

if (letrak::deltio_invalid_kodikos($kodikos))
letrak::fatal_error_json("Μη αποδεκτός κωδικός παρουσιολογίου");

$plist = pandora::parameter_get("plist");

print '{';
///////////////////////////////////////////////////////////////////////////////@

$deltio = (new Deltio())->from_database($kodikos);

if ($deltio->oxi_kodikos())
letrak::fatal_error_json($kodikos . ": δεν βρέθηκε το παρουσιολόγιο");

$imerominia = $deltio->imerominia_get()->format("Y-m-d");
$prosapo = $deltio->prosapo_get();

print '"data":{';

$s = "";
foreach ($plist as $ipalilos => $data)
katagrafi($ipalilos, $data["o"], $data["k"], $s);

print '}';

///////////////////////////////////////////////////////////////////////////////@
print '}';
exit(0);

function katagrafi($ipalilos, $orario, $karta, &$s) {
	global $kodikos;
	global $imerominia;
	global $prosapo;

	$orario = new Orario($orario);

	if ($orario->oxi_orario())
	return;

	switch ($prosapo) {
	case LETRAK_DELTIO_PROSAPO_PROSELEFSI:
		$exact = $orario->proselefsi_diastima($imerominia, $apo, $eos);
		$proselefsi = TRUE;
		$ord = "ASC";
		break;
	case LETRAK_DELTIO_PROSAPO_APOXORISI:
		$exact = $orario->apoxorisi_diastima($imerominia, $apo, $eos);
		$proselefsi = FALSE;
		$ord = "DESC";
		break;
	default:
print '"XXX":true,';
$s = ',';
		return;
	}

	if (!$exact)
	return;
print '"YYY":true,';
$s = ',';

	$sapo = $apo->format("Y-m-d H:i:s");
	$seos = $eos->format("Y-m-d H:i:s");

	$query = "SELECT `meraora` FROM `kartel`.`event` " .
		" WHERE (`karta` = " . $karta . ")".
		" AND (`meraora` > '" . $sapo . "')".
		" AND (`meraora` < '" . $seos . "')".
		" ORDER BY `meraora` " . $ord;
	$result = pandora::query($query);

	$meraora = NULL;

	while ($row = $result->fetch_array(MYSQLI_NUM)) {
		$t = DateTime::createFromFormat("Y-m-d H:i:s", $row[0]);

		if ($t === FALSE)
		continue;

		if (!isset($meraora)) {
			$meraora = $t;
			continue;
		}

		if ($proselefsi) {
			if ($t > $exact)
			break;

			$meraora = $t;
			continue;
		}

		if ($t < $exact)
		break;

		$meraora = $t;
	}

	// Αν δεν έχουν βρεθεί καταγραφές για τον συγκεκριμένο εργαζόμενο
	// στη συγκεκριμένη μέρα και ώρα, τότε δεν επιστρέφονται δεδομένα
	// για τον εν λόγω υπάλληλο.

	if (!isset($meraora))
	return;

	// Μετατρέπουμε σε string την καταγραφή που επελέγη και κατόπιν
	// επιχειρούμε να ενημερώσουμε τη σχετική εγγραφή (πίνακας "parousia")
	// που αφορά τον συγκεκριμένο εργαζόμενο στο συγκεκριμένο δελτίο.

	$meraora = $meraora->format("Y-m-d H:i");

	if ($meraora === FALSE)
	return;

	// Εφόσον τα στοιχεία ημερομηνίας και ώρας προσέλευσης/αποχώρησης
	// προκύπτουν από το σύστημα καταγραφής, θέτουμε ανάλογα και την
	// τιμή του πεδίου τρόπου καταχώρησης.

	$kataxorisi = pandora::sql_string(LETRAK_PAROUSIA_KATAXORISI_WINPAK);

	$query = "UPDATE `letrak`.`parousia` SET" .
		" `meraora` = '" . $meraora . ":00'," .
		" `kataxorisi` = " . $kataxorisi .
		" WHERE (`deltio` = " . $kodikos . ")" .
		" AND (`ipalilos` = " . $ipalilos . ")";
	pandora::query($query);

	if (pandora::affected_rows() != 1)
	return;

	// Εφόσον ενημερώθηκε η σχετική εγγραφή του πίνακα "parousia"
	// επιστρέφουμε την καταγραφή προκειμένου να εμφανιστεί και
	// στη σελίδα που εκκίνησε το παρόν πρόγραμμα.

	print $s . '"' . $ipalilos . '":"' . $meraora . '"';
	$s = ",";
}
