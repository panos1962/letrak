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
// www/prosopa/ipogarfiInsert.php —— Ενημέρωση υπογραφής παρουσιολογίου
// @FILE END
//
// @DESCRIPTION BEGIN
// Το παρόν πρόγραμμα καλείται από τη σελίδα επεξεργασίας παρουσιολογίου με
// σκοπό να ενημερώσει κάποια εγγραφή υπογραφής. Η ενημέρωση μπορεί να αφορά
// σε οποιοδήποτε στοιχείο της υπογραφής, όπως ταξινομικό αριθμό, αρμόδιο
// υπάλληλο, τίτλο κλπ. Οποιαδήποτε ενημέρωση επισύρει και ακύρωση τυχόν
// ήδη επικυρωμένων υπογραφών.
// @DESCRIPTION END
//
// @HISTORY BEGIN
// Updated: 2025-08-19
// Updated: 2021-05-23
// Updated: 2020-05-06
// Updated: 2020-05-04
// Updated: 2020-04-30
// Created: 2020-04-29
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

$prosvasi = letrak::prosvasi_check();
$kodikos = pandora::parameter_get("deltio");

if (letrak::deltio_invalid_kodikos($kodikos))
letrak::fatal_error_json("Μη αποδεκτός κωδικός παρουσιολογίου");

$deltio = (new Deltio())->from_database($kodikos);

if ($deltio->oxi_kodikos())
letrak::fatal_error_json($kodikos . ": δεν εντοπίστηκε το παρουσιολόγιο");

if ($deltio->is_klisto())
letrak::fatal_error_json("Το παρουσιολόγιο έχει κλείσει");

$ipiresia = $deltio->ipiresia_get();

if ($prosvasi->oxi_update_ipiresia($ipiresia))
letrak::fatal_error_json("Δεν έχετε δικαίωμα αλλαγής αρμοδίου υπογραφής");

$isimonixat = pandora::parameter_get("isimonixat");

if (letrak::ipografi_invalid_taxinomisi($isimonixat))
letrak::fatal_error_json("Μη αποδεκτός υφιστάμενος ταξινομικός αριθμός");

$armodios = pandora::parameter_get("armodios");

if (letrak::ipalilos_invalid_kodikos($armodios))
letrak::fatal_error_json("Μη αποδεκτός αριθμός μητρώου υπογράφοντος υπαλλήλου");

$onomateponimo = Ipalilos::onomateponimo($armodios);

if (!$onomateponimo)
letrak::fatal_error_json("Δεν βρέθηκε υπάλληλος με κωδικό " . $armodios);

$taxinomisi = pandora::parameter_get("taxinomisi");

if (!isset($taxinomisi))
$taxinomisi = LETRAK_IPOGRAFI_TAXINOMISI_MAX;

elseif (letrak::ipografi_invalid_taxinomisi($taxinomisi))
letrak::fatal_error_json("Μη αποδεκτός νέος ταξινομικός αριθμός");

$titlos = pandora::parameter_get("titlos");

///////////////////////////////////////////////////////////////////////////////@

pandora::autocommit(FALSE);

$kinisi .= $taxinomisi . ":";
$kinisi .= $armodios . ":";
$kinisi .= $onomateponimo . ":";
$kinisi .= $titlos;

letrak::katagrafi($prosvasi->ipalilos_get(), $kodikos, $ipiresia,
	"ΜΕΤΑΒΟΛΗ ΑΡΜΟΔΙΟΥ", $kinisi);

$query = "SELECT COUNT(*) FROM `letrak`.`ipografi`" .
	" WHERE `deltio` = " . $kodikos;
$row = pandora::first_row($query, MYSQLI_NUM);

$taxmax = (int)$row[0];

$query = "DELETE FROM `letrak`.`ipografi`" .
	" WHERE (`deltio` = " . $kodikos . ")" .
	" AND (`taxinomisi` = " . $isimonixat . ")";
pandora::query($query);

if (pandora::affected_rows() != 1)
letrak::fatal_error_json("Απέτυχε η ενημέρωση της υπογραφής");

if ($taxinomisi > $isimonixat) {
	$query = "UPDATE `letrak`.`ipografi`" .
		" SET `taxinomisi` = `taxinomisi` - 1" .
		" WHERE (`deltio` = " . $kodikos . ")" .
		" AND (`taxinomisi` > " . $isimonixat . ")" .
		" AND (`taxinomisi` <= " . $taxinomisi . ")";
	pandora::query($query);
}

elseif ($taxinomisi < $isimonixat) {
	$query = "UPDATE `letrak`.`ipografi`" .
		" SET `taxinomisi` = `taxinomisi` + 1" .
		" WHERE (`deltio` = " . $kodikos . ")" .
		" AND (`taxinomisi` < " . $isimonixat . ")" .
		" AND (`taxinomisi` >= " . $taxinomisi . ")";
	pandora::query($query);
}

$query = "INSERT INTO `letrak`.`ipografi` " .
	" (`deltio`, `taxinomisi`, `armodios`, `titlos`)" .
	" VALUES (" . $kodikos . ", " . $taxinomisi . ", " .
	$armodios . ", " . pandora::sql_string($titlos) . ")";
pandora::query($query);

if (pandora::affected_rows() !== 1)
letrak::fatal_error_json("Απέτυχε η προσθήκη υπογραφής");

$deltio->ekremes_update();
letrak::ipografes_taxinomisi($kodikos);
pandora::commit();

print '{';
print '"katastasi":' .
pandora::json_string(LETRAK_DELTIO_KATASTASI_EKREMES) . ',';
letrak::ipografes_json($kodikos);
print '}';
exit(0);
?>
