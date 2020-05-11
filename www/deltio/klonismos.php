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
// www/deltio/klonismos.php —— Δημιουργία αντιγράφου παρουσιολογίου
// @FILE END
//
// @DESCRIPTION BEGIN
// Το παρόν πρόγραμμα καλείται από τη σελίδα των παρουσιολογίων και δέχεται
// ως παράμετρο έναν κωδικό παρουσιολογίου. Σκοπός του προγράμματος είναι
// να δημιουργήσει ένα κλώνο του συγκεκριμένου παρουσιολογίου (φυσικά με
// νέο κωδικό) και να το επιστρέψει στη σελίδα των παρουσιολογίων.
// @DESCRIPTION END
//
// @HISTORY BEGIN
// Updated: 2020-05-10
// Updated: 2020-05-09
// Updated: 2020-05-08
// Updated: 2020-04-30
// Created: 2020-04-22
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

$protipo = pandora::parameter_get("kodikos");

if (letrak::deltio_invalid_kodikos($protipo))
lathos("Ακαθόριστος κωδικός προτύπου");

$query = "SELECT * FROM `letrak`.`deltio`" .
	" WHERE `kodikos` = " . $protipo;
$protipo = pandora::first_row($query, MYSQLI_ASSOC);

if (!$protipo)
lathos("Αδυναμία εντοπισμού προτύπου");

if ($prosvasi->oxi_update_ipiresia($protipo["ipiresia"]))
lathos("Δεν έχετε δικαίωμα δημιουργίας παρουσιολογίου");

///////////////////////////////////////////////////////////////////////////////@

pandora::autocommit(FALSE);

$simera = date("Y-m-d");

$ipiresia = $protipo["ipiresia"];
$prosapo = $protipo["prosapo"];
$perigrafi = $protipo["perigrafi"];

$query = "INSERT INTO `letrak`.`deltio` " .
"(`protipo`, `ipalilos`, `imerominia`," .
" `ipiresia`, `prosapo`, `perigrafi`) VALUES (" .
$protipo["kodikos"] . ", " .
$prosvasi->ipalilos_get() . ", '" . $simera . "', " .
pandora::sql_string($ipiresia) . ", " .
pandora::sql_string($prosapo) . ", " .
pandora::sql_string($perigrafi) . ")";
pandora::query($query);

if (pandora::affected_rows() !== 1) {
	pandora::rollback();
	lathos("Αποτυχία δημιουργίας αντιγράφου");
}

// Κρατάμε τον κωδικό του νεοεισαχθέντος παρουσιολογίου.

$kodikos = pandora::insert_id();

// Εισάγουμε τα πρόσωπα με τα ίδια στοιχεία που είχαν στο πρωτότυπο, χωρίς
// τις εξαιρέσεις.

$flist = "`ipalilos`, `karta`, `orario`, `adidos`, `adapo`, `adeos`";

$query = "INSERT INTO `letrak`.`parousia` (`deltio`, " . $flist . ")" .
	" SELECT " . $kodikos . ", " . $flist .
	" FROM `letrak`.`parousia`" .
	" WHERE `deltio` = " . $protipo["kodikos"];
pandora::query($query);

// Αν πρόκειται για παρουσιολόγιο αποχώρησης, τότε εντοπίζουμε το αντίστοιχο
// παρουσιολόγιο προσέλευσης και συμπληρώνουμε τυχόν άδειες που εκκίνησαν
// σήμερα.

if ($prosapo === "ΑΠΟΧΩΡΗΣΗ")
simerines_adies($kodikos, $simera, $ipiresia);

// Ενημερώνουμε τα νεοεισαχθέντα πρόσωπα καταργώντας τυχόν άδειες που έχουν
// λήξει.

$query = "UPDATE `letrak`.`parousia`" .
	" SET `adidos` = NULL, `adapo` = NULL, `adeos` = NULL" .
	" WHERE (`deltio` = " . $kodikos . ")" .
	" AND (`adeos` < '" . $simera . "')";
pandora::query($query);

pandora::query("SET @tax := 0");

$query = "INSERT INTO `letrak`.`ipografi`" .
	" (`deltio`, `taxinomisi`, `titlos`, `armodios`)" .
	" SELECT " . $kodikos . ", (@tax := @tax + 1), `titlos`, `armodios`" .
	" FROM `letrak`.`ipografi` WHERE `deltio` = " . $protipo["kodikos"] .
	" ORDER BY `taxinomisi`";
pandora::query($query);

pandora::commit();

$deltio = (new Deltio())->from_database($kodikos);

if ($deltio->oxi_kodikos())
lathos("Αποτυχία εντοπισμού αντιγράφου");


print '{"deltio":' . $deltio->json_economy() . '}';
exit(0);

///////////////////////////////////////////////////////////////////////////////@

// Η function "simerines_adies" τρέχει μόνο για παρουσιολόγια αποχώρησης και
// σκοπό έχει τον εντοπισμό αδειών που εκκίνησαν με το αντίστοιχο παρουσιολόγιο
// προσέλευσης.

function simerines_adies($deltio, $imerominia, $ipiresia) {
	$query = "SELECT `kodikos` FROM `letrak`.`deltio`" .
		" WHERE (`imerominia` = '" . $imerominia . "')" .
		" AND (`ipiresia` = '" . $ipiresia . "')" .
		" AND (`prosapo` = 'ΠΡΟΣΕΛΕΥΣΗ')";
	$result = pandora::query($query);

	while ($row = $result->fetch_array(MYSQLI_NUM))
	antigrafi_adion($deltio, $row[0]);
}

function antigrafi_adion($target, $source) {
	$query = "SELECT `ipalilos`, `adidos`, `adapo`, `adeos`" .
		" FROM `letrak`.`parousia`".
		" WHERE (`deltio` = " . $source . ")".
		" AND (`adidos` IS NOT NULL)";
	$result = pandora::query($query);

	while ($row = $result->fetch_array(MYSQLI_ASSOC))
	antigrafi_adias($target, $row);
}

function antigrafi_adias($deltio, $adia) {
	$query = "UPDATE `letrak`.`parousia` SET" .
		" `adidos` = " . $adia["adidos"] . "," .
		" `adapo` = '" . $adia["adapo"] . "'," .
		" `adeos` = '" . $adia["adeos"] . "'" .
		" WHERE (`deltio` = " . $deltio . ")" .
		" AND (`ipalilos` = " . $adia["ipalilos"] .")";
	pandora::query($query);
}

function lathos($msg) {
	print '{"error":' . pandora::json_string($msg) . '}';
	exit(0);
}
?>