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
// www/prosopa/apoOrarioOla.php —— Συμπλήρωση καταγραφής από ωράριο για
// όσους δεν έχουν καταγραφή ώρας και δεν είναι αδειούχοι ή εξαιρετέοι.
// @FILE END
//
// @DESCRIPTION BEGIN
// Το παρόν πρόγραμμα δέχεται μια λίστα από αριθμούς μητρώου εργαζομένων που
// συμμετέχουν σε κάποιο δελτίο, μαζί με τα ωράριά τους όπως αυτά είναι
// συμπληρωμένα στο συγκεκριμένο δελτίο, και επιστρέφει χρονικές καταγραφές
// εισόδου ή εξόδου, ανάλογα με το αν το δελτίο είναι προσέλευσης ή
// αποχώρησης αντίστοιχα.
//
// ΣΗΜΑΝΤΙΚΟ
// ‾‾‾‾‾‾‾‾‾
// Παράλληλα με την επιστροφή των δεδομένων, το πρόγραμμα ενημερώνει την
// database με τις χρονικές καταγραφές που έχει υπολογίσει. Με άλλα λόγια,
// οι καταγραφές καταχωρούνται στον πίνακα "parousia" της database "letrak".
// @DESCRIPTION END
//
// @HISTORY BEGIN
// Created: 2023-09-12
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

$prosvasi = letrak::prosvasi_check();
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
apoOrario($ipalilos, $data["o"], $s);

print '}';

///////////////////////////////////////////////////////////////////////////////@
print '}';
exit(0);

function apoOrario($ipalilos, $orario, &$s) {
	global $kodikos;
	global $imerominia;
	global $prosapo;

	$orario = new Orario($orario);

	if ($orario->oxi_orario())
	return;

	switch ($prosapo) {
	case LETRAK_DELTIO_PROSAPO_PROSELEFSI:
		$exact = $orario->proselefsi_diastima($imerominia, $apo, $eos);
		if (!$exact) return;
		$meraora = $apo->format("Y-m-d H:i");
		break;
	case LETRAK_DELTIO_PROSAPO_APOXORISI:
		$exact = $orario->apoxorisi_diastima($imerominia, $apo, $eos);
		if (!$exact) return;
		$meraora = $eos->format("Y-m-d H:i");
		break;
	default:
		return;
	}

	if ($meraora === FALSE)
	return;

	// Εφόσον τα στοιχεία ημερομηνίας και ώρας προσέλευσης/αποχώρησης
	// προκύπτουν από το σύστημα καταγραφής, θέτουμε ανάλογα και την
	// τιμή του πεδίου τρόπου καταχώρησης.

	$kataxorisi = pandora::sql_string(LETRAK_PAROUSIA_KATAXORISI_SINTAKTIS);

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
