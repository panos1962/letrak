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
// www/prosopa/ipogarfiInsert.php —— Προσθήκη υπογραφής παρουσιολογίου
// @FILE END
//
// @DESCRIPTION BEGIN
// Το παρό πρόγραμμα καλείται από τη σελίδα επεξεργασίας παρουσιολογίου και
// σκοπό έχει την προσθήκη νέου υπογράφοντος. Η νέα εγγραφή προστίθεται σε
// σημείο που υποδηλώνει ο ταξινομικός αριθμός, ενώ παράλληλα ακυρώνει τυχόν
// ήδη επικυρωμένες υπογραφές.
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
letrak::fatal_error_json("Δεν έχετε δικαίωμα προσθήκης αρμοδίου υπογραφής");

$armodios = pandora::parameter_get("armodios");

if (letrak::ipalilos_invalid_kodikos($armodios))
letrak::fatal_error_json("Μη αποδεκτός αριθμός μητρώου υπογράφοντος υπαλλήλου");

$query = "SELECT `eponimo`, `onoma`" .
	" FROM " . letrak::erpota12("ipalilos") .
	" WHERE `kodikos` = " . $armodios;
$row = pandora::first_row($query, MYSQLI_NUM);

if (!$row)
letrak::fatal_error_json("Δεν βρέθηκε υπάλληλος με κωδικό " . $armodios);

$onomateponimo = rtrim($row[0]) . " " . rtrim($row[1]);

$taxinomisi = pandora::parameter_get("taxinomisi");

if ($taxinomisi && letrak::ipografi_invalid_taxinomisi($taxinomisi))
letrak::fatal_error_json("Μη αποδεκτός ταξινομικός αριθμός");

$titlos = pandora::parameter_get("titlos");

///////////////////////////////////////////////////////////////////////////////@

pandora::autocommit(FALSE);

if ($taxinomisi) {
	$query = "UPDATE `letrak`.`ipografi`" .
		" SET `taxinomisi` = `taxinomisi` + 1" .
		" WHERE (`deltio` = " . $kodikos . ")" .
		" AND (`taxinomisi` >= " . $taxinomisi . ")";
	pandora::query($query);
}

else
$taxinomisi = LETRAK_IPOGRAFI_TAXINOMISI_MAX;

$kinisi .= $taxinomisi . ":";
$kinisi .= $armodios . ":";
$kinisi .= $onomateponimo . ":";
$kinisi .= $titlos;

letrak::katagrafi($prosvasi->ipalilos_get(), $kodikos, $ipiresia,
	"ΠΡΟΣΘΗΚΗ ΑΡΜΟΔΙΟΥ", $kinisi);

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
print '"katastasi":';
print pandora::json_string(LETRAK_DELTIO_KATASTASI_EKREMES) . ',';
letrak::ipografes_json($kodikos);
print '}';
exit(0);
?>
